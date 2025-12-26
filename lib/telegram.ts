/**
 * Telegram Bot Integration
 * Gửi thông báo qua Telegram Bot API
 *
 * Hỗ trợ gửi vào Group hoặc Chat cá nhân:
 * - Ưu tiên TELEGRAM_GROUP_CHAT_ID (nếu có) - để gửi vào group
 * - Nếu không có group, dùng TELEGRAM_CHAT_ID - để gửi vào chat cá nhân
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_GROUP_CHAT_ID = process.env.TELEGRAM_GROUP_CHAT_ID; // Chat ID của group (số âm, ví dụ: -1001234567890)
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // Chat ID cá nhân (số dương)

// Sử dụng Group Chat ID nếu có, nếu không thì dùng Chat ID cá nhân
const CHAT_ID = TELEGRAM_GROUP_CHAT_ID || TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !CHAT_ID) {
  console.warn(
    "⚠️ TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID/TELEGRAM_GROUP_CHAT_ID chưa được cấu hình trong .env"
  );
}

/**
 * Gửi tin nhắn đến Telegram
 * @param message - Nội dung tin nhắn
 * @returns Promise<boolean> - true nếu gửi thành công
 */
export async function sendTelegramMessage(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !CHAT_ID) {
    console.warn("⚠️ Telegram không được cấu hình, bỏ qua gửi tin nhắn");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Lỗi gửi Telegram:", response.status, errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Lỗi gửi Telegram:", error);
    return false;
  }
}

/**
 * Format số tiền VNĐ
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Gửi thông báo đơn hàng mới
 */
export async function sendNewOrderNotification(orderData: {
  orderNumber: number;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  products: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  transactionCode?: string;
  transactionDateTime?: string;
  paymentType?: "full" | "deposit";
  depositAmount?: number;
  remainingAmount?: number;
}): Promise<boolean> {
  const {
    orderNumber,
    totalPrice,
    customerName,
    customerPhone,
    shippingAddress,
    products,
    transactionCode,
    transactionDateTime,
    paymentType,
    depositAmount,
    remainingAmount,
  } = orderData;

  let message = `<b>🆕 ĐƠN HÀNG MỚI</b>\n\n`;
  message += `<b>Mã đơn:</b> ${orderNumber}\n`;
  message += `<b>Loại thanh toán:</b> ${paymentType === "deposit" ? "Cọc trước" : "Thanh toán hết"}\n`;
  message += `<b>Tổng tiền:</b> ${formatCurrency(totalPrice)}\n`;

  // Hiển thị thông tin cọc nếu khách hàng chọn cọc trước
  if (paymentType === "deposit" && depositAmount && remainingAmount) {
    // message += `\n<b>💰 Thông tin thanh toán:</b>\n`;
    message += `<b>Số tiền đã cọc:</b> ${formatCurrency(depositAmount)}\n`;
    message += `<b style="color: red">Số tiền cần thanh toán:</b> ${formatCurrency(remainingAmount)}\n`;
  }

  message += `\n<b>👤 Khách hàng:</b>\n`;
  message += `Tên: ${customerName}\n`;
  message += `SĐT: ${customerPhone}\n`;
  message += `Địa chỉ: ${shippingAddress}\n\n`;

  message += `<b>📦 Sản phẩm:</b>\n`;
  products.forEach((product, index) => {
    message += `${index + 1}. ${product.name}\n`;
    message += `   Số lượng: ${product.quantity} x ${formatCurrency(product.price)}\n`;
  });

  if (transactionCode) {
    message += `\n<b>💰 Mã giao dịch:</b> ${transactionCode}\n`;
  }

  if (transactionDateTime) {
    message += `<b>🕐 Thời gian:</b> ${transactionDateTime}\n`;
  }

  return sendTelegramMessage(message);
}

/**
 * Gửi cảnh báo tồn kho thấp
 */
export async function sendLowStockWarning(productData: {
  productId: string;
  productName: string;
  currentStock: number;
}): Promise<boolean> {
  const { productId, productName, currentStock } = productData;

  const message =
    `<b>⚠️ CẢNH BÁO TỒN KHO THẤP</b>\n\n` +
    `<b>Sản phẩm:</b> ${productName}\n` +
    `<b>ID:</b> ${productId}\n` +
    `<b>Tồn kho hiện tại:</b> ${currentStock}\n\n` +
    `<i>Sản phẩm sắp hết hàng, vui lòng nhập thêm!</i>`;

  return sendTelegramMessage(message);
}
