import { NextResponse } from "next/server";
import { getPayOS } from "@/actions/createCheckoutSession";
import { serverWriteClient } from "@/sanity/lib/server-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    getPayOS().webhooks.verify(body);

    const data = (body as any)?.data || body;
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
    let meta: any = null;
    if (metaEncoded) {
      try {
        meta = JSON.parse(Buffer.from(metaEncoded, "base64").toString("utf8"));
      } catch (err) {
        console.warn("Cannot parse PayOS meta", err);
      }
    }

    const addressMeta = meta?.address || {};
    const userId = meta?.userId || null;
    const itemsMeta = meta?.items || data?.items || [];
    const totalAmount = amount ?? meta?.totalAmount ?? 0;

    const fullName =
      addressMeta.fullName || data?.buyerName || data?.customerName || "Khách";
    const phone =
      addressMeta.phone || data?.buyerPhone || data?.customerPhone || "N/A";
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

    const products =
      itemsMeta?.map((item: any, idx: number) => ({
        _key: item?.id
          ? `product-${item.id}`
          : item?._key || `item-${idx}-${Date.now()}`,
        _type: "object",
        product: item?.id
          ? {
              _type: "reference",
              _ref: item.id,
            }
          : undefined,
        name: item?.name,
        price: Math.round(item?.price || 0),
        quantity: item?.quantity || 1,
        image: item?.image ? { _type: "image", asset: item.image } : undefined,
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
    const doc: any = {
      _type: "order",
      orderNumber: `PAYOS-${orderCode}`,
      status: "paid",
      totalPrice: Math.round(totalAmount),
      orderDate: new Date().toISOString(),
      shippingAddress: {
        fullName,
        phone,
        address: addressLine.toString().trim(),
        ward,
        district,
        city: province,
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
