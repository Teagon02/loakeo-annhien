import { PayOS } from "@payos/node";
import { NextResponse } from "next/server";
import payos from "@/lib/payos";
import { serverWriteClient } from "@/sanity/lib/server-client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Verify Webhook (Bắt buộc)
    const webhookData = await payos.webhooks.verify(body);

    // Chỉ xử lý khi code == "00" (Thành công)
    if (webhookData.code === "00") {
      const orderCode = Number(webhookData.orderCode);

      // 2. Tìm đơn hàng "Pending" trong Sanity
      const query = `*[_type == "order" && payosOrderCode == $orderCode][0]`;
      const order = await serverWriteClient.fetch(query, { orderCode });

      if (!order) {
        return NextResponse.json({
          success: false,
          message: "Order not found",
        });
      }

      // 3. Idempotency Check (Nếu đã Paid rồi thì thôi)
      if (order.status === "paid" || order.status === "shipped") {
        return NextResponse.json({
          success: true,
          message: "Order already processed",
        });
      }

      // 4. Transaction: Update Status + Trừ tồn kho cùng lúc
      const tx = serverWriteClient.transaction();

      // 4.1 Update Order sang Paid
      tx.patch(order._id, (p) =>
        p.set({
          status: "paid",
          paymentMethod: "PayOS",
          paymentDate: new Date().toISOString(),
          amountPaid: webhookData.amount, // Lưu số tiền thực tế nhận được
        })
      );

      // 4.2 Trừ tồn kho (Inventory)
      const products = order.products || [];
      for (const item of products) {
        const productRef = item?.product?._ref || item?.product?._id;
        const quantity = Number(item?.quantity) || 0;

        if (productRef && quantity > 0) {
          // Giảm stock an toàn
          tx.patch(productRef, (p) => p.inc({ stock: -quantity }));
        }
      }

      // Commit transaction
      await tx.commit();
      console.log(`Order ${orderCode} updated to PAID and stock adjusted.`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
