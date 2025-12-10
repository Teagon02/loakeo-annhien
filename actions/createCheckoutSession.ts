"use server";
import { Address } from "@/sanity.types";
import { CartItem } from "@/store";
import payos from "@/lib/payos";
import { PaymentLinkItem } from "@payos/node";
import { urlFor } from "@/sanity/lib/image";
import { serverWriteClient } from "@/sanity/lib/server-client";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  clerkUserId?: string;
  address?: Address | null;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata,
  address: Address | null
) {
  // 1. Tạo mã đơn hàng
  const orderCode = Number(String(Date.now()).slice(-12));
  // 2. Tính tổng tiền và map items cho PayOS
  const payOsItems = items.map((item) => ({
    name: item?.product?.name,
    quantity: item?.quantity,
    price: Math.round(item?.product?.price ?? 0),
  }));
  const totalAmount = payOsItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  // 3. Tạo order trong Sanity
  const orderPayload = {
    _type: "order",
    orderNumber: String(orderCode),
    clerkUserId: metadata.clerkUserId,
    totalPrice: totalAmount,
    status: "pending",
    products: items.map((item) => ({
      _key: item?.product?._id,
      product: { _type: "reference", _ref: item?.product?._id },
      name: item?.product?.name,
      price: item?.product?.price,
      quantity: item?.quantity,
      image:
        item?.product?.images && item?.product?.images[0]
          ? {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: item?.product?.images?.[0]?.asset?._ref,
              },
            }
          : undefined,
    })),
    shippingAddress: {
      fullName: metadata.customerName,
      phone: address?.phone,
      address: address?.addressLine,
      ward: address?.ward,
      district: address?.district,
      city: address?.province,
      fullAddress:
        address?.addressLine +
        " " +
        address?.ward +
        " " +
        address?.district +
        " " +
        address?.province,
    },
    payosOrderCode: Number(orderCode),
    orderDate: new Date().toISOString(),
  };
  try {
    // Lưu vào Sanity trước
    await serverWriteClient.create(orderPayload);

    // 4. Tạo link PayOS
    const requestBody = {
      orderCode: orderCode,
      amount: totalAmount,
      description: `DH: ${orderCode}`,
      items: payOsItems as PaymentLinkItem[],
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    };
    const paymentLinkResponse = await payos.paymentRequests.create(requestBody);
    return paymentLinkResponse.checkoutUrl;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}
