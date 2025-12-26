import { NextRequest, NextResponse } from "next/server";
import payos from "@/lib/payos";
import { serverWriteClient } from "@/sanity/lib/client";
import { sendNewOrderNotification, sendLowStockWarning } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ ok: true, message: "PayOS webhook endpoint" });
}

export function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      Allow: "POST, GET, OPTIONS, HEAD",
    },
  });
}

export function HEAD() {
  return NextResponse.json(null, { status: 200 });
}

// 1. Định nghĩa kiểu dữ liệu Webhook
// PayOS trả về object phẳng hoặc trong field data tùy cấu hình.
type PayOSWebhookData = {
  code?: string;
  desc?: string;
  success?: boolean;
  orderCode?: number;
  amount?: number;
  description?: string;
  accountNumber?: string;
  reference?: string;
  transactionDateTime?: string;
  currency?: string;
  paymentLinkId?: string;
  counterAccountBankId?: string | null;
  counterAccountBankName?: string | null;
  counterAccountName?: string | null;
  counterAccountNumber?: string | null;
  virtualAccountName?: string | null;
  virtualAccountNumber?: string | null;
  data?: {
    orderCode?: number;
    reference?: string;
    code?: string;
    desc?: string;
  };
  signature?: string;
};

export async function POST(req: NextRequest) {
  console.log("[DEBUG] Code đã CHẠY VÀO webhook file route.ts thành công!");
  try {
    const body = await req.json();

    // 2. Xác thực Webhook. Thư viện trả Promise → cần await để nhận object, tránh log Promise pending.
    const webhookData = (await payos.webhooks.verify(
      body
    )) as unknown as PayOSWebhookData;

    console.log("Nhận Webhook từ PayOS:", webhookData);

    // Một số webhook trả code ở top-level, một số nằm trong data
    const code = webhookData.code || webhookData.data?.code;
    const orderCode = webhookData.orderCode ?? webhookData.data?.orderCode;
    const transactionRef = webhookData.reference ?? webhookData.data?.reference;
    const transactionDateTime = webhookData.transactionDateTime ?? "";

    if (code === "00") {
      if (!orderCode) {
        console.warn("⚠️ orderCode missing in payload:", webhookData);
        return NextResponse.json(
          { success: false, message: "Missing orderCode" },
          { status: 400 }
        );
      }
      console.log(
        "[DEBUG] orderCode:",
        orderCode,
        "transactionRef:",
        transactionRef
      );

      // Lấy đầy đủ thông tin đơn hàng
      const query = `*[_type == "order" && orderNumber == $orderCode][0]{
        _id, 
        clerkUserId, 
        totalPrice,
        shippingAddress,
        products[]{
          product,
          name,
          price,
          quantity
        }
      }`;
      const order = await serverWriteClient.fetch(query, { orderCode });
      console.log("[DEBUG] order from Sanity:", order);
      const orderId = order?._id;
      const clerkUserId = order?.clerkUserId;
      const products = order?.products || [];

      if (orderId) {
        await serverWriteClient
          .patch(orderId)
          .set({
            status: "paid",
            transactionCode: transactionRef,
            transactionDateTime: transactionDateTime || "",
          })
          .commit();

        console.log(`Đã cập nhật đơn hàng ${orderCode} thành công.`);

        // Gửi thông báo đơn hàng mới qua Telegram
        if (
          order?.totalPrice &&
          order?.shippingAddress &&
          products.length > 0
        ) {
          try {
            const shippingAddress =
              order.shippingAddress.fullAddress ||
              `${order.shippingAddress.address || ""}, ${order.shippingAddress.ward || ""}, ${order.shippingAddress.district || ""}, ${order.shippingAddress.city || ""}`.trim();

            await sendNewOrderNotification({
              orderNumber: orderCode,
              totalPrice: order.totalPrice,
              customerName: order.shippingAddress.fullName || "Khách hàng",
              customerPhone: order.shippingAddress.phone || "",
              shippingAddress: shippingAddress,
              products: products.map(
                (item: {
                  name?: string;
                  quantity?: number;
                  price?: number;
                }) => ({
                  name: item.name || "Sản phẩm",
                  quantity: item.quantity || 0,
                  price: item.price || 0,
                })
              ),
              transactionCode: transactionRef,
              transactionDateTime: transactionDateTime,
            });
          } catch (error) {
            console.error("Lỗi gửi thông báo Telegram đơn hàng:", error);
            // Không throw error để không ảnh hưởng đến quá trình xử lý đơn hàng
          }
        }

        // Cập nhật tồn kho cho từng sản phẩm
        if (products && products.length > 0) {
          for (const item of products) {
            // product có thể là reference object với _ref hoặc object đã resolve
            const productRef = item?.product?._ref || item?.product?._id;
            const quantity = item?.quantity || 0;

            if (productRef && quantity > 0) {
              try {
                // Lấy thông tin sản phẩm hiện tại để có stock hiện tại
                const productQuery = `*[_id == $productId][0]{_id, name, stock}`;
                const product = await serverWriteClient.fetch(productQuery, {
                  productId: productRef,
                });

                if (product) {
                  const currentStock = product.stock || 0;
                  const newStock = Math.max(0, currentStock - quantity); // Đảm bảo không âm

                  await serverWriteClient
                    .patch(productRef)
                    .set({ stock: newStock })
                    .commit();

                  console.log(
                    `Đã cập nhật tồn kho: Product ${productRef}, ${currentStock} -> ${newStock} (giảm ${quantity})`
                  );

                  // Gửi cảnh báo nếu tồn kho xuống dưới 3
                  if (newStock < 3) {
                    try {
                      await sendLowStockWarning({
                        productId: productRef,
                        productName: product.name || "Sản phẩm",
                        currentStock: newStock,
                      });
                    } catch (error) {
                      console.error(
                        `Lỗi gửi cảnh báo tồn kho thấp cho sản phẩm ${productRef}:`,
                        error
                      );
                      // Không throw error để không ảnh hưởng đến quá trình xử lý
                    }
                  }
                } else {
                  console.warn(`Không tìm thấy sản phẩm với ID: ${productRef}`);
                }
              } catch (error) {
                console.error(
                  `Lỗi cập nhật tồn kho cho sản phẩm ${productRef}:`,
                  error
                );
                // Tiếp tục xử lý các sản phẩm khác dù có lỗi
              }
            }
          }
        }

        // Xoá giỏ hàng sau khi thanh toán thành công (nếu có userId)
        if (clerkUserId) {
          const cartIdQuery = `*[_type == "cart" && userId == $userId][0]._id`;
          const cartId = await serverWriteClient.fetch(cartIdQuery, {
            userId: clerkUserId,
          });
          if (cartId) {
            await serverWriteClient.delete(cartId);
            console.log(
              `Đã xoá giỏ hàng userId=${clerkUserId}, cartId=${cartId}`
            );
          } else {
            console.log(`Không có giỏ hàng cho userId=${clerkUserId} để xoá.`);
          }
        }
      } else {
        console.warn(`Không tìm thấy order với orderNumber=${orderCode}.`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error: unknown) {
    console.error("Lỗi xử lý Webhook:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
