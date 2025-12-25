"use server";

import payos from "@/lib/payos";
import { serverWriteClient } from "@/sanity/lib/client"; // Client có token quyền Ghi
import { Address } from "@/sanity.types"; // Type từ Sanity của bạn

export async function createCheckoutSession({
  items,
  address,
  userId,
  totalPrice,
  paymentType = "full",
}: {
  items: any[]; // Grouped Items từ store
  address: Address;
  userId?: string | null;
  totalPrice: number;
  paymentType?: "full" | "deposit";
}) {
  try {
    // 1. Tạo mã đơn hàng (Số nguyên, duy nhất)
    // Dùng timestamp cắt gọn để đảm bảo unique và vừa vặn giới hạn int
    const orderCode = Number(String(Date.now()).slice(-10));

    // 2. Tính toán số tiền cọc và số tiền thanh toán
    let depositAmount = 0;
    let paymentAmount = totalPrice;
    let remainingAmount = 0;

    if (paymentType === "deposit") {
      // Tính tổng tiền cọc từ các sản phẩm có depositPrice
      depositAmount = items.reduce((total, item) => {
        const productDepositPrice = item.product?.depositPrice ?? 0;
        const quantity = item.quantity || 1;
        return total + productDepositPrice * quantity;
      }, 0);

      // Nếu không có sản phẩm nào có depositPrice, không cho phép thanh toán cọc
      if (depositAmount === 0) {
        throw new Error("Không có sản phẩm nào hỗ trợ thanh toán cọc");
      }

      paymentAmount = depositAmount;
      remainingAmount = totalPrice - depositAmount;
    }

    // 3. Chuẩn bị dữ liệu sản phẩm cho Sanity
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

    // 4. Lưu đơn hàng vào Sanity (Trạng thái: PENDING)
    // Lưu ý: Đổi tên field addressLine, province... khớp với Address type của bạn
    const newOrder = await serverWriteClient.create({
      _type: "order",
      orderNumber: orderCode,
      status: "pending",
      totalPrice: totalPrice,
      paymentType: paymentType,
      depositAmount: paymentType === "deposit" ? depositAmount : 0,
      remainingAmount: paymentType === "deposit" ? remainingAmount : 0,
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

    // 5. Chuẩn bị dữ liệu cho PayOS
    // PayOS yêu cầu item có field: name, quantity, price
    // Nếu thanh toán cọc, cần điều chỉnh price của items để tổng bằng depositAmount
    let payosItems: any[];

    if (paymentType === "deposit") {
      // Tạo PayOS items với giá cọc
      payosItems = items.map((item) => {
        const productDepositPrice = item.product?.depositPrice ?? 0;
        const quantity = item.quantity || 1;

        return {
          name: `${item.product?.name?.substring(0, 40) || "Sản phẩm"} (Cọc)`,
          quantity: quantity,
          price: productDepositPrice, // Giá cọc cho mỗi sản phẩm
        };
      });
    } else {
      // Thanh toán đủ
      payosItems = items.map((item) => ({
        name: item.product?.name?.substring(0, 50) || "Sản phẩm",
        quantity: item.quantity || 1,
        price: item.product?.price || 0,
      }));
    }

    const YOUR_DOMAIN =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // PayOS yêu cầu description tối đa 25 ký tự
    const description =
      paymentType === "deposit"
        ? `Coc DH ${orderCode}`.substring(0, 25)
        : `DH ${orderCode}`.substring(0, 25);

    const paymentBody = {
      orderCode: orderCode,
      amount: paymentAmount, // Số tiền thực tế thanh toán (full hoặc deposit)
      description: description,
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
