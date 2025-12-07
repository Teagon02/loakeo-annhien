# Báo Cáo Bảo Mật - Loakeo An Nhiên

## 🔴 Vấn Đề Nghiêm Trọng (Critical)

### 1. CORS Quá Rộng (CORS Wildcard)

**Vị trí:**

- `app/api/cart/route.ts` (dòng 143)
- `app/api/wishlist/route.ts` (dòng 146)
- `app/api/addresses/route.ts` (dòng 146)

**Vấn đề:**

```typescript
"Access-Control-Allow-Origin": "*"
```

Cho phép tất cả domain truy cập API, dễ bị tấn công CSRF.

**Khuyến nghị:**

```typescript
"Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "https://yourdomain.com"
```

### 2. Webhook Không Có IP Whitelist

**Vị trí:** `app/api/payos/webhook/route.ts`

**Vấn đề:**
Chỉ verify signature, không kiểm tra IP nguồn gốc của PayOS.

**Khuyến nghị:**

- Thêm IP whitelist cho PayOS webhook
- Hoặc sử dụng webhook secret từ PayOS dashboard

## 🟠 Vấn Đề Quan Trọng (High)

### 4. Thiếu Rate Limiting

**Vấn đề:**
Không có giới hạn số lượng request, dễ bị tấn công DDoS hoặc brute force.

**Khuyến nghị:**

- Sử dụng `@upstash/ratelimit` hoặc `next-rate-limit`
- Thêm rate limiting cho các API routes quan trọng (cart, wishlist, checkout)

### 5. Input Validation Chưa Đầy Đủ

**Vị trí:**

- `app/api/payos/route.ts` - Không validate `totalAmount`, `items`
- `actions/createCheckoutSession.ts` - Thiếu validation cho `address` fields

**Khuyến nghị:**

```typescript
// Validate totalAmount
if (typeof totalAmount !== "number" || totalAmount <= 0) {
  throw new Error("Invalid totalAmount");
}

// Validate items array
if (!Array.isArray(items) || items.length === 0) {
  throw new Error("Items must be a non-empty array");
}

// Validate address structure
if (address && typeof address !== "object") {
  throw new Error("Invalid address format");
}
```

### 6. Error Messages Có Thể Leak Thông Tin

**Vị trí:**

- `app/api/payos/route.ts` (dòng 23)
- `actions/createCheckoutSession.ts` (dòng 18)

**Vấn đề:**
Error messages có thể tiết lộ thông tin về cấu trúc hệ thống.

**Khuyến nghị:**

```typescript
// Production
return NextResponse.json(
  { error: "Không thể tạo link thanh toán." },
  { status: 400 }
);

// Development
if (process.env.NODE_ENV === "development") {
  console.error("Detailed error:", error);
}
```

## 🟡 Vấn Đề Trung Bình (Medium)

### 8. Thiếu CSRF Protection

**Vấn đề:**
Mặc dù Next.js có một số protection, nhưng cần thêm CSRF tokens cho các API quan trọng.

**Khuyến nghị:**

- Sử dụng `@edge-runtime/csrf` hoặc implement custom CSRF protection
- Đặc biệt cho các routes POST/PUT/DELETE

### 9. Sanity Queries - Cần Kiểm Tra Injection

**Vị trí:**

- `app/api/cart/route.ts` (dòng 18, 89)
- `app/api/wishlist/route.ts` (dòng 18, 86)

**Tình trạng:**
Sanity đã có protection chống injection, nhưng nên sử dụng parameterized queries (đã làm đúng).

**Khuyến nghị:**

- Tiếp tục sử dụng parameterized queries
- Validate `userId` trước khi query

### 10. Thiếu Input Sanitization

**Vị trí:**

- `app/api/addresses/route.ts` - Chỉ trim, không sanitize HTML/XSS

**Khuyến nghị:**

```typescript
import DOMPurify from "isomorphic-dompurify";

const sanitizedFullName = DOMPurify.sanitize(body.fullName.trim());
```

### 11. Thiếu Content Security Policy (CSP)

**Vị trí:** `next.config.ts`

**Khuyến nghị:**

```typescript
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
];
```

## 🟢 Cải Thiện Bảo Mật (Low)

### 12. Logging Nhạy Cảm

**Vị trí:**

- `app/api/payos/webhook/route.ts` (dòng 9)

**Vấn đề:**
Log webhook data có thể chứa thông tin nhạy cảm.

**Khuyến nghị:**

```typescript
console.log("PayOS webhook verified:", {
  code: webhookData?.code,
  desc: webhookData?.desc,
  // Không log toàn bộ data
});
```

### 13. Thiếu Request Size Limiting

**Khuyến nghị:**

```typescript
// next.config.ts
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
```

### 14. Environment Variables Validation

**Khuyến nghị:**

- Sử dụng `zod` để validate env variables
- Tạo file `lib/env.ts` để validate tất cả env vars

## ✅ Điểm Tốt

1. ✅ Sử dụng Clerk cho authentication - tốt
2. ✅ Sanity queries sử dụng parameterized queries - an toàn
3. ✅ Server-side tokens không expose ra client
4. ✅ Validation cho phone number format
5. ✅ Kiểm tra authentication ở các API routes quan trọng
6. ✅ Webhook verify signature (PayOS)

## 📋 Checklist Hành Động

- [x] Sửa CORS từ `*` sang specific domain
- [ ] Thêm rate limiting
- [ ] Cải thiện input validation
- [ ] Sanitize error messages trong production
- [ ] Thêm CSP headers
- [ ] Thêm request size limiting
- [ ] Review và sanitize logging
- [ ] Thêm IP whitelist cho webhook (nếu PayOS hỗ trợ)

## 🔗 Tài Liệu Tham Khảo

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Clerk Security](https://clerk.com/docs/security)
- [Sanity Security](https://www.sanity.io/docs/security)
