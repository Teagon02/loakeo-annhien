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
  console.log("🚀 [DEBUG] Code đã CHẠY VÀO file route.ts thành công!");
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
