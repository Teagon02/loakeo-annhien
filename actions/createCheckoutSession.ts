"use server";
import { PayOS } from "@payos/node";
import { Address } from "@/sanity.types";
import { CartItem } from "@/store";
import { serverWriteClient } from "@/sanity/lib/server-client";

let payos: PayOS | null = null;

const getPayOS = () => {
  if (payos) return payos;

  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (!clientId || !apiKey || !checksumKey) {
    throw new Error(
      "Thiếu PAYOS_CLIENT_ID / PAYOS_API_KEY / PAYOS_CHECKSUM_KEY."
    );
  }

  payos = new PayOS({
    clientId,
    apiKey,
    checksumKey,
  });

  return payos;
};

type CheckoutPayload = {
  items: CartItem[];
  totalAmount: number;
  address?: Address | null;
  description?: string;
  userId?: string | null;
  cancelUrl?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SANITY_WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

const buildOrderCode = () => Number(`${Date.now()}`.slice(-10)); // PayOS requires numeric orderCode

// Tạo mã đơn hàng
const buildOrderNumber = () => {
  // Tạo mã ngẫu nhiên 8 ký tự (chữ và số)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomCode = "";
  for (let i = 0; i < 8; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ORD-${randomCode}`;
};

const createOrderDraft = async ({
  orderCode,
  items,
  totalAmount,
  address,
  userId,
}: {
  orderCode: number;
  items: CartItem[];
  totalAmount: number;
  address?: Address | null;
  userId?: string | null;
}) => {
  if (!SANITY_WRITE_TOKEN) {
    console.warn(
      "Missing SANITY_API_WRITE_TOKEN, skip saving order to Sanity."
    );
    return null;
  }

  const products = items.map(({ product, quantity }, index) => ({
    _key: product?._id
      ? `product-${product._id}`
      : `product-${index}-${Date.now()}`,
    _type: "object",
    product: product?._id
      ? {
          _type: "reference",
          _ref: product._id,
        }
      : undefined,
    name: product?.name,
    price: product?.price ?? 0,
    quantity,
    image:
      product?.images && product.images.length > 0
        ? { _type: "image", asset: product.images[0].asset }
        : undefined,
  }));

  const addressLine =
    (address as any)?.addressLine || (address as any)?.address || "";
  const ward = (address as any)?.ward;
  const district = (address as any)?.district;
  const province = (address as any)?.province;
  const fullAddress = [addressLine, ward, district, province]
    .filter(Boolean)
    .join(", ");

  const doc: any = {
    _type: "order",
    orderNumber: buildOrderNumber(),
    status: "paid",
    totalPrice: Math.round(totalAmount),
    orderDate: new Date().toISOString(), // Ngày đặt hàng
    shippingAddress: address
      ? {
          fullName: address.fullName,
          phone: address.phone,
          address: addressLine.trim(),
          ward,
          district,
          city: province,
          fullAddress,
        }
      : undefined,
    products,
    payosOrderCode: orderCode,
  };

  // Thêm clerkUserId nếu có (cho guest thì để undefined)
  if (userId) {
    doc.clerkUserId = userId;
  }

  try {
    const res = await serverWriteClient.create(doc);
    return res?._id || null;
  } catch (err) {
    console.error("Failed to create order in Sanity:", err);
    return null;
  }
};

export async function createCheckoutSession({
  items,
  totalAmount,
  address,
  description,
  userId,
  cancelUrl,
}: CheckoutPayload) {
  // Validate items
  if (!items?.length || !Array.isArray(items)) {
    throw new Error("Giỏ hàng trống, không thể tạo thanh toán.");
  }

  if (!totalAmount || totalAmount <= 0) {
    throw new Error("Số tiền thanh toán không hợp lệ.");
  }

  if (!BASE_URL) {
    throw new Error("Thiếu cấu hình NEXT_PUBLIC_BASE_URL.");
  }

  try {
    const orderCode = buildOrderCode();
    const paymentData = {
      orderCode,
      amount: Math.round(totalAmount),
      description: description || `Ma don hang: ${orderCode}`,
      items: items.map(({ product, quantity }) => ({
        name: product?.name || "Sản phẩm",
        quantity,
        price: Math.round(product?.price || 0),
      })),
      cancelUrl: cancelUrl || `${BASE_URL}/cart`,
      returnUrl: `${BASE_URL}/success?orderCode=${orderCode}`,
      buyerName: address?.fullName,
      buyerPhone: address?.phone,
    };

    const paymentLink = await getPayOS().paymentRequests.create(paymentData);
    void createOrderDraft({ orderCode, items, totalAmount, address, userId });

    return {
      checkoutUrl: paymentLink.checkoutUrl,
      orderCode,
    };
  } catch (error) {
    console.error("Error creating PayOS Checkout Session", error);
    // Không throw error chi tiết trong production
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
    throw new Error("Không thể tạo link thanh toán. Vui lòng thử lại.");
  }
}

export { getPayOS };
