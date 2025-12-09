import { NextResponse } from "next/server";
import { getPayOS } from "@/actions/createCheckoutSession";
import { serverWriteClient } from "@/sanity/lib/server-client";
import type { PayOS } from "@payos/node";

type PayOSItem = {
  id?: string;
  name?: string;
  price?: number;
  quantity?: number;
  image?: unknown;
  _key?: string;
};

type PayOSWebhookPayload = {
  data?: {
    status?: string;
    payment?: { status?: string };
    orderCode?: number | string;
    code?: number | string;
    amount?: number;
    description?: string;
    buyerName?: string;
    customerName?: string;
    buyerPhone?: string;
    customerPhone?: string;
    buyerAddress?: string;
    items?: PayOSItem[];
  };
  status?: string;
  orderCode?: number | string;
  code?: number | string;
  amount?: number;
  description?: string;
  buyerName?: string;
  customerName?: string;
  buyerPhone?: string;
  customerPhone?: string;
  buyerAddress?: string;
  payment?: { status?: string };
  items?: PayOSItem[];
};

type PayOSWebhookVerifyInput = Parameters<
  ReturnType<typeof getPayOS>["webhooks"]["verify"]
>[0];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PayOSWebhookPayload &
      PayOSWebhookVerifyInput;
    getPayOS().webhooks.verify(body as PayOSWebhookVerifyInput);

    const data =
      (body?.data as PayOSWebhookPayload["data"]) ||
      (body as PayOSWebhookPayload);
    const status = (data?.status || data?.payment?.status || "")
      .toString()
      .toUpperCase();
    const orderCode = data?.orderCode || data?.code;
    const amount = data?.amount;
    const description = data?.description || "";
    const metaEncoded = description.split("||META:")?.[1];

    // Chỉ xử lý khi thanh toán thành công
    if (!["PAID", "SUCCESS", "SUCCEEDED"].includes(status)) {
      return NextResponse.json({ success: true, message: "Ignored status" });
    }

    if (!orderCode) {
      return NextResponse.json(
        { error: "Missing orderCode from PayOS webhook" },
        { status: 400 }
      );
    }

    // Parse metadata đính kèm trong description
    let meta: unknown = null;
    if (metaEncoded) {
      try {
        meta = JSON.parse(Buffer.from(metaEncoded, "base64").toString("utf8"));
      } catch (err) {
        console.warn("Cannot parse PayOS meta", err);
      }
    }

    const addressMeta =
      typeof meta === "object" && meta
        ? (meta as { address?: Record<string, unknown> }).address || {}
        : {};
    const userId =
      typeof meta === "object" && meta
        ? (meta as { userId?: string | null }).userId || null
        : null;
    const itemsMeta =
      (typeof meta === "object" && meta
        ? (meta as { items?: PayOSItem[] }).items
        : null) ||
      data?.items ||
      [];
    const totalAmount =
      amount ??
      (typeof meta === "object" && meta
        ? (meta as { totalAmount?: number }).totalAmount
        : 0) ??
      0;

    const fullName =
      addressMeta.fullName || data?.buyerName || data?.customerName || "Khách";
    const phone =
      addressMeta.phone || data?.buyerPhone || data?.customerPhone || "N/A";
    const fullNameStr = String(fullName ?? "Khách");
    const phoneStr = String(phone ?? "N/A");
    const addressLine =
      addressMeta.addressLine ||
      addressMeta.address ||
      data?.buyerAddress ||
      "Không cung cấp";
    const ward = addressMeta.ward;
    const district = addressMeta.district;
    const province = addressMeta.province;
    const fullAddress = [addressLine, ward, district, province]
      .filter(Boolean)
      .join(", ");

    const addressLineStr = String(addressLine ?? "");
    const wardStr = ward ? String(ward) : undefined;
    const districtStr = district ? String(district) : undefined;
    const provinceStr = province ? String(province) : undefined;

    const products =
      itemsMeta?.map((item: PayOSItem, idx: number) => ({
        _key: item?.id
          ? `product-${item.id}`
          : item?._key || `item-${idx}-${Date.now()}`,
        _type: "object" as const,
        product: item?.id
          ? {
              _type: "reference" as const,
              _ref: item.id,
            }
          : undefined,
        name: item?.name,
        price: Math.round(item?.price || 0),
        quantity: item?.quantity || 1,
        image: item?.image
          ? { _type: "image" as const, asset: item.image as unknown }
          : undefined,
      })) || [];

    // Tránh tạo trùng
    const existed = await serverWriteClient.fetch(
      'count(*[_type == "order" && payosOrderCode == $code])',
      { code: Number(orderCode) }
    );
    if (existed && existed > 0) {
      return NextResponse.json({
        success: true,
        message: "Order already exists",
      });
    }

    // Tạo order khi thanh toán thành công
    type OrderDoc = {
      _type: "order";
      orderNumber: string;
      status: "paid" | "shipped" | "cancelled";
      totalPrice: number;
      orderDate: string;
      shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        ward?: string;
        district?: string;
        city?: string;
        fullAddress?: string;
      };
      products: {
        _key: string;
        _type: "object";
        product?: { _type: "reference"; _ref: string };
        name?: string;
        price?: number;
        quantity?: number;
        image?: { _type: "image"; asset: unknown };
      }[];
      payosOrderCode: number;
      clerkUserId?: string | null;
    };

    const doc: OrderDoc = {
      _type: "order",
      orderNumber: `PAYOS-${orderCode}`,
      status: "paid",
      totalPrice: Math.round(totalAmount),
      orderDate: new Date().toISOString(),
      shippingAddress: {
        fullName: fullNameStr,
        phone: phoneStr,
        address: addressLineStr.trim(),
        ward: wardStr,
        district: districtStr,
        city: provinceStr,
        fullAddress,
      },
      products,
      payosOrderCode: Number(orderCode),
    };

    if (userId) {
      doc.clerkUserId = userId;
    }

    await serverWriteClient.create(doc);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Invalid PayOS webhook:", error);

    // Không leak thông tin chi tiết
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
