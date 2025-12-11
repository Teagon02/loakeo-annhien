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
      Allow: "POST, GET, OPTIONS, HEAD",
    },
  });
}

export function HEAD() {
  return NextResponse.json(null, { status: 200 });
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
  console.log("🚀 [DEBUG] Code đã CHẠY VÀO file route.ts thành công!");
  try {
    const body = await req.json();

    // 2. Xác thực Webhook. Thư viện trả Promise → cần await để nhận object, tránh log Promise pending.
    const webhookData = (await payos.webhooks.verify(
      body
    )) as unknown as PayOSWebhookData;

    console.log("Nhận Webhook từ PayOS:", webhookData);

    if (webhookData.code === "00") {
      // 3. Lúc này TypeScript sẽ hiểu .data và .orderCode là gì, không báo lỗi nữa
      const orderCode = webhookData.data.orderCode;
      const transactionRef = webhookData.data.reference;
      console.log(
        "[DEBUG] orderCode:",
        orderCode,
        "transactionRef:",
        transactionRef
      );

      const query = `*[_type == "order" && orderNumber == $orderCode][0]._id`;
      const orderId = await serverWriteClient.fetch(query, { orderCode });
      console.log("[DEBUG] orderId from Sanity:", orderId);

      if (orderId) {
        await serverWriteClient
          .patch(orderId)
          .set({
            status: "paid",
            transactionCode: transactionRef,
          })
          .commit();

        console.log(`✅ Đã cập nhật đơn hàng ${orderCode} thành công.`);
      } else {
        console.warn(`⚠️ Không tìm thấy order với orderNumber=${orderCode}.`);
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
