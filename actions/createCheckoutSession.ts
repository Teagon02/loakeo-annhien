"use server";

import payos from "@/lib/payos";
import { serverWriteClient } from "@/sanity/lib/client"; // Client có token quyền Ghi
import { Address } from "@/sanity.types"; // Type từ Sanity của bạn

export async function createCheckoutSession({
  items,
  address,
  userId,
  totalPrice,
}: {
  items: any[]; // Grouped Items từ store
  address: Address;
  userId?: string | null;
  totalPrice: number;
}) {
  try {
    // 1. Tạo mã đơn hàng (Số nguyên, duy nhất)
    // Dùng timestamp cắt gọn để đảm bảo unique và vừa vặn giới hạn int
    const orderCode = Number(String(Date.now()).slice(-10));

    // 2. Chuẩn bị dữ liệu sản phẩm cho Sanity
    const sanityProducts = items.map((item) => ({
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: item.product?._id,
      },
      name: item.product?.name,
      price: item.product?.price,
      quantity: item.quantity || 1, // Store của bạn cần trả về quantity
      image: item.product?.images?.[0]
        ? {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: item.product.images[0].asset._ref,
            },
          }
        : undefined,
    }));

    // 3. Lưu đơn hàng vào Sanity (Trạng thái: PENDING)
    // Lưu ý: Đổi tên field addressLine, province... khớp với Address type của bạn
    const newOrder = await serverWriteClient.create({
      _type: "order",
      orderNumber: orderCode,
      status: "pending",
      totalPrice: totalPrice,
      orderDate: new Date().toISOString(),
      clerkUserId: userId,
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        address: address.addressLine, // Field này trong Sanity của bạn là 'address' hay 'addressLine'? Kiểm tra lại schema
        ward: address.ward,
        district: address.district,
        city: address.province, // Schema Sanity là city, Type address là province
        fullAddress: `${address.addressLine}, ${address.ward}, ${address.district}, ${address.province}`,
      },
      products: sanityProducts,
    });

    console.log("Created Sanity Order:", newOrder._id);

    // 4. Chuẩn bị dữ liệu cho PayOS
    // PayOS yêu cầu item có field: name, quantity, price
    const payosItems: any[] = items.map((item) => ({
      name: item.product?.name?.substring(0, 50) || "Sản phẩm", // PayOS giới hạn ký tự tên
      quantity: item.quantity || 1,
      price: item.product?.price || 0,
    }));

    // Đảm bảo tổng tiền khớp (tránh lỗi làm tròn)
    // PayOS tự tính tổng dựa trên items, nhưng ta có thể truyền amount tổng
    // Tuy nhiên items price * quantity phải bằng amount

    const YOUR_DOMAIN =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const paymentBody = {
      orderCode: orderCode,
      amount: totalPrice,
      description: `Don hang ${orderCode}`,
      items: payosItems,
      returnUrl: `${YOUR_DOMAIN}/success?orderCode=${orderCode}`, // Trang thành công
      cancelUrl: `${YOUR_DOMAIN}/cart`, // Quay lại giỏ hàng nếu hủy
    };

    const paymentLinkRes = await payos.paymentRequests.create(paymentBody);

    return {
      url: paymentLinkRes.checkoutUrl,
      orderId: newOrder._id,
    };
  } catch (error: any) {
    console.error("Lỗi tạo thanh toán:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi tạo đơn hàng");
  }
}
