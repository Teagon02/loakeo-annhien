import { NextRequest, NextResponse } from "next/server";
import {
  sendTelegramMessage,
  sendNewOrderNotification,
  sendLowStockWarning,
} from "@/lib/telegram";

export const dynamic = "force-dynamic";

/**
 * API Route để test Telegram Bot
 *
 * GET /api/test-telegram?type=simple - Test gửi tin nhắn đơn giản
 * GET /api/test-telegram?type=order - Test thông báo đơn hàng mới
 * GET /api/test-telegram?type=stock - Test cảnh báo tồn kho thấp
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "simple";

    switch (type) {
      case "simple": {
        // Test gửi tin nhắn đơn giản
        const testMessage =
          `🧪 <b>TEST TELEGRAM BOT</b>\n\n` +
          `Tin nhắn này được gửi từ API test.\n` +
          `Thời gian: ${new Date().toLocaleString("vi-VN")}\n\n` +
          `✅ Nếu bạn thấy tin nhắn này, Telegram Bot đã hoạt động thành công!`;

        const success = await sendTelegramMessage(testMessage);
        return NextResponse.json({
          success,
          message: success
            ? "Đã gửi tin nhắn test thành công! Kiểm tra Telegram của bạn (group hoặc chat cá nhân)."
            : "Không thể gửi tin nhắn. Kiểm tra lại TELEGRAM_BOT_TOKEN và TELEGRAM_GROUP_CHAT_ID/TELEGRAM_CHAT_ID trong .env",
          type: "simple",
        });
      }

      case "order": {
        // Test thông báo đơn hàng mới
        const testOrderData = {
          orderNumber: 9999999999,
          totalPrice: 1500000,
          customerName: "Nguyễn Văn Test",
          customerPhone: "0123456789",
          shippingAddress:
            "123 Đường Test, Phường Test, Quận Test, TP. Hồ Chí Minh",
          products: [
            {
              name: "Loa Kéo Test 1",
              quantity: 2,
              price: 500000,
            },
            {
              name: "Loa Kéo Test 2",
              quantity: 1,
              price: 500000,
            },
          ],
          transactionCode: "TEST123456",
          transactionDateTime: new Date().toLocaleString("vi-VN"),
        };

        const success = await sendNewOrderNotification(testOrderData);
        return NextResponse.json({
          success,
          message: success
            ? "Đã gửi thông báo đơn hàng test thành công! Kiểm tra Telegram của bạn."
            : "Không thể gửi thông báo đơn hàng. Kiểm tra lại cấu hình Telegram.",
          type: "order",
          testData: testOrderData,
        });
      }

      case "stock": {
        // Test cảnh báo tồn kho thấp
        const testStockData = {
          productId: "test-product-123",
          productName: "Loa Kéo Test - Sản phẩm sắp hết hàng",
          currentStock: 2,
        };

        const success = await sendLowStockWarning(testStockData);
        return NextResponse.json({
          success,
          message: success
            ? "Đã gửi cảnh báo tồn kho test thành công! Kiểm tra Telegram của bạn."
            : "Không thể gửi cảnh báo tồn kho. Kiểm tra lại cấu hình Telegram.",
          type: "stock",
          testData: testStockData,
        });
      }

      case "debug": {
        // Debug: Kiểm tra cấu hình
        return NextResponse.json({
          success: true,
          type: "debug",
          config: {
            hasBotToken: !!process.env.TELEGRAM_BOT_TOKEN,
            hasGroupChatId: !!process.env.TELEGRAM_GROUP_CHAT_ID,
            hasChatId: !!process.env.TELEGRAM_CHAT_ID,
            groupChatId: process.env.TELEGRAM_GROUP_CHAT_ID
              ? process.env.TELEGRAM_GROUP_CHAT_ID
              : "Không có",
            chatId: process.env.TELEGRAM_CHAT_ID
              ? process.env.TELEGRAM_CHAT_ID
              : "Không có",
            botTokenLength: process.env.TELEGRAM_BOT_TOKEN?.length || 0,
            // Không trả về token thực tế vì lý do bảo mật
          },
          message: "Thông tin cấu hình Telegram Bot",
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            message: "Invalid type. Use: simple, order, stock, or debug",
            examples: {
              simple: "/api/test-telegram?type=simple",
              order: "/api/test-telegram?type=order",
              stock: "/api/test-telegram?type=stock",
              debug: "/api/test-telegram?type=debug",
            },
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error testing Telegram:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error testing Telegram",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
