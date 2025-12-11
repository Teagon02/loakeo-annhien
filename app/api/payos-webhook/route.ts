import { NextRequest, NextResponse } from "next/server";
import payos from "@/lib/payos";
import { serverWriteClient } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ ok: true, message: "PayOS webhook endpoint" });
}

export function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      Allow: "POST, GET, OPTIONS",
    },
  });
}

// 1. Định nghĩa kiểu dữ liệu Webhook
type PayOSWebhookData = {
  code: string;
  desc: string;
  success: boolean;
  data: {
    orderCode: number;
    amount: number;
    description: string;
    accountNumber: string;
    reference: string; // Đây là mã giao dịch ngân hàng
    transactionDateTime: string;
    currency: string;
    paymentLinkId: string;
    code: string;
    desc: string;
    counterAccountBankId?: string | null;
    counterAccountBankName?: string | null;
    counterAccountName?: string | null;
    counterAccountNumber?: string | null;
    virtualAccountName?: string | null;
    virtualAccountNumber?: string | null;
  };
  signature: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 2. Ép kiểu kết quả trả về (as unknown as PayOSWebhookData)
    // Lưu ý: payos.webhooks.verify là hàm đồng bộ (không cần await), nhưng nếu bạn để await cũng không sao.
    const webhookData = payos.webhooks.verify(
      body
    ) as unknown as PayOSWebhookData;

    console.log("Nhận Webhook từ PayOS:", webhookData);

    if (webhookData.code === "00") {
      // 3. Lúc này TypeScript sẽ hiểu .data và .orderCode là gì, không báo lỗi nữa
      const orderCode = webhookData.data.orderCode;
      const transactionRef = webhookData.data.reference;

      const query = `*[_type == "order" && orderNumber == $orderCode][0]._id`;
      const orderId = await serverWriteClient.fetch(query, { orderCode });

      if (orderId) {
        await serverWriteClient
          .patch(orderId)
          .set({
            status: "paid",
            transactionCode: transactionRef,
          })
          .commit();

        console.log(`✅ Đã cập nhật đơn hàng ${orderCode} thành công.`);
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
