# Hướng Dẫn Cấu Hình Bảo Mật

Sau khi cập nhật bảo mật, bạn cần cấu hình các biến môi trường sau:

## Biến Môi Trường Bắt Buộc

### 1. CORS Configuration

```env
# Domain được phép truy cập API (thay bằng domain thực tế của bạn)
ALLOWED_ORIGIN=https://yourdomain.com

# Hoặc nếu không set, sẽ dùng NEXT_PUBLIC_BASE_URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 2. PayOS Webhook IP Whitelist (Tùy chọn)

```env
# IP addresses của PayOS webhook (nếu PayOS cung cấp)
# Phân cách bằng dấu phẩy
PAYOS_WHITELIST_IPS=203.171.20.1,203.171.20.2
```

**Lưu ý:** Nếu không set `PAYOS_WHITELIST_IPS`, webhook vẫn hoạt động nhưng sẽ chỉ dựa vào signature verification.

## Các Cải Tiến Bảo Mật Đã Thực Hiện

### ✅ 1. Webhook Route (`/api/payos/webhook`)

- ✅ IP whitelist checking (nếu có cấu hình)
- ✅ Validate request body
- ✅ Signature verification (PayOS)
- ✅ Log an toàn (không log dữ liệu nhạy cảm)
- ✅ Auto-update order status từ webhook

### ✅ 2. PayOS Checkout Route (`/api/payos`)

- ✅ Validate items array đầy đủ
- ✅ Validate totalAmount (giới hạn tối đa 1 tỷ VNĐ)
- ✅ Validate address format
- ✅ Validate description length
- ✅ Validate URL format
- ✅ Error handling an toàn

### ✅ 3. Create Checkout Session Action

- ✅ Validate items và quantity
- ✅ Validate product price
- ✅ Validate totalAmount
- ✅ Sanitize input (description, name, phone)
- ✅ Validate URL format
- ✅ Error handling an toàn

### ✅ 4. CORS Configuration

- ✅ Sửa từ `*` sang specific domain
- ✅ Thêm `Access-Control-Allow-Credentials`
- ✅ Tất cả API routes đã được cập nhật

## Testing

Sau khi cấu hình, hãy test các chức năng sau:

1. **Webhook:**
   - Test với PayOS webhook → Phải verify thành công
   - Test với request giả mạo → Phải reject

2. **Checkout:**
   - Test với dữ liệu hợp lệ → Phải tạo được checkout link
   - Test với dữ liệu không hợp lệ → Phải trả về error rõ ràng

## Lưu Ý Quan Trọng

1. **Không commit file `.env`** vào git
2. **Thay đổi mật khẩu/keys** nếu đã commit nhầm
3. **Monitor logs** để phát hiện các request đáng ngờ
4. **Cập nhật PayOS IP whitelist** nếu PayOS thay đổi

## Next Steps (Tùy chọn)

Các cải tiến bảo mật bổ sung có thể thực hiện:

1. **Rate Limiting:** Sử dụng `@upstash/ratelimit` hoặc `next-rate-limit`
2. **Content Security Policy:** Thêm CSP headers trong `next.config.ts`
3. **Request Size Limiting:** Giới hạn kích thước request body
4. **Input Sanitization:** Sử dụng `DOMPurify` cho HTML content
5. **Security Headers:** Thêm các security headers khác

Xem thêm trong `SECURITY_REPORT.md` để biết chi tiết.
