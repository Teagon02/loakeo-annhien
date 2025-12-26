import { BasketIcon, CreditCardIcon, UserIcon } from "@sanity/icons";
import { MapPinIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Đơn hàng",
  type: "document",
  icon: BasketIcon,
  groups: [
    {
      name: "main",
      title: "Trạng thái & Tiền",
      default: true,
      icon: BasketIcon,
    },
    { name: "admin", title: "Mã giao dịch", icon: CreditCardIcon },
  ],
  fields: [
    // --- NHÓM 1: TRẠNG THÁI (Để bạn quản lý công việc) ---
    defineField({
      name: "orderNumber",
      title: "Mã đơn hàng",
      type: "number",
      group: "main",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Trạng thái xử lý", // Cái này để BẠN xem
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "🔄 Chờ thanh toán", value: "pending" },
          { title: "🔴 Đã thanh toán", value: "paid" },
          { title: "✅ Đã gửi hàng", value: "shipped" },
          { title: "❌ Đã hủy", value: "cancelled" },
        ],
        layout: "radio", // Bấm nhanh
      },
    }),
    defineField({
      name: "totalPrice",
      title: "Tổng giá trị đơn hàng (VNĐ)",
      type: "number",
      group: "main",
      readOnly: true,
      validation: (Rule) => Rule.required(),
      description: "Tổng giá trị đơn hàng",
    }),
    defineField({
      name: "paymentType",
      title: "Loại thanh toán",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "Thanh toán đủ", value: "full" },
          { title: "Cọc trước", value: "deposit" },
        ],
        layout: "radio",
      },
      readOnly: true,
      initialValue: "full",
    }),
    defineField({
      name: "depositAmount",
      title: "Số tiền đã cọc (VNĐ)",
      type: "number",
      group: "main",
      readOnly: true,
      description: "Số tiền khách hàng đã cọc",
    }),
    defineField({
      name: "remainingAmount",
      title: "Số tiền còn lại (VNĐ)",
      type: "number",
      group: "main",
      readOnly: true,
      description: "Số tiền còn lại cần thanh toán",
    }),
    defineField({
      name: "orderDate",
      title: "Ngày khách đặt",
      type: "datetime",
      group: "main",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "transactionDateTime",
      title: "Ngày thanh toán",
      type: "string",
      group: "main",
      initialValue: "",
      readOnly: true,
    }),
    defineField({
      name: "clerkUserId",
      title: "ID người dùng (nếu có)",
      type: "string",
      group: "main",
      description:
        "ID của người dùng đã đăng nhập. Để trống nếu là khách vãng lai.",
      readOnly: true,
    }),

    // --- NHÓM 2: THÔNG TIN GIAO HÀNG (Quan trọng để Ship) ---
    // Gom hết vào 1 object để khi fetch API bạn chỉ cần lấy order.shippingAddress là đủ
    defineField({
      name: "shippingAddress",
      title: "Địa chỉ nhận hàng",
      type: "object",
      group: "main",
      fields: [
        defineField({
          name: "fullName",
          title: "Tên người nhận",
          type: "string",
          readOnly: true,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "phone",
          title: "Số điện thoại (Bắt buộc)",
          type: "string",
          readOnly: true,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "address",
          title: "Địa chỉ chi tiết (Số nhà, đường)",
          type: "string",
          description: "Số nhà, tên đường, khu/phố/thôn.",
          readOnly: true,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "ward",
          title: "Phường/Xã",
          type: "string",
          readOnly: true,
        }),
        defineField({
          name: "district",
          title: "Quận/Huyện",
          type: "string",
          readOnly: true,
        }),
        defineField({
          name: "city",
          title: "Tỉnh/Thành phố",
          type: "string",
          readOnly: true,
        }),
        defineField({
          name: "fullAddress",
          title: "Địa chỉ đầy đủ",
          type: "string",
          description: "Ghép từ Số nhà/đường, Phường/Xã, Quận/Huyện, Tỉnh/TP.",
          readOnly: true,
        }),
      ],
    }),

    // --- NHÓM 3: SẢN PHẨM (Để biết nhặt đồ gì gói hàng) ---
    defineField({
      name: "products",
      title: "Danh sách sản phẩm",
      type: "array",
      group: "main",
      readOnly: true,
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              type: "reference",
              to: [{ type: "product" }],
              readOnly: true,
            }),
            // Snapshot
            defineField({
              name: "name",
              title: "Tên SP",
              type: "string",
              readOnly: true,
            }),
            defineField({
              name: "price",
              title: "Giá",
              type: "number",
              readOnly: true,
            }),
            defineField({
              name: "quantity",
              title: "Số lượng",
              type: "number",
              readOnly: true,
            }),
            defineField({
              name: "image",
              title: "Ảnh",
              type: "image",
              readOnly: true,
            }),
          ],
          preview: {
            select: {
              title: "name",
              quantity: "quantity",
              media: "image",
            },
            prepare({ title, quantity, media }) {
              return {
                title: `${quantity} x ${title}`,
                media: media,
              };
            },
          },
        }),
      ],
    }),

    // --- NHÓM 4: PAYOS (tối giản, chỉ lưu các giá trị cần theo dõi) ---
    defineField({
      name: "transactionCode",
      title: "Mã giao dịch ngân hàng",
      type: "string",
      group: "admin",
      readOnly: true,
      description: "Mã giao dịch ngân hàng.",
      // validation: (Rule) => Rule.required(),
    }),
  ],

  // PREVIEW: Hiển thị danh sách đơn hàng ngoài dashboard
  preview: {
    select: {
      orderId: "orderNumber",
      amount: "totalPrice",
      status: "status",
      fullName: "shippingAddress.fullName", // Select trực tiếp field fullName từ object
      phone: "shippingAddress.phone",
    },
    prepare({ orderId, amount, status, fullName, phone }) {
      const statusIcons: any = {
        pending: "🔄",
        paid: "🔴", // Màu xanh lá -> Chưa giao hàng
        shipped: "✅", // Tích xanh -> Đã giao hàng
        cancelled: "❌",
      };

      const customerInfo = fullName || "Khách lạ";
      const phoneNumber = phone ? `(${phone})` : "";

      return {
        title: `${statusIcons[status] || "📦"} ${customerInfo} ${phoneNumber}`,
        subtitle: `Mã đơn: ${orderId}`,
        media: MapPinIcon, // Icon xe tải cho đúng tính chất
      };
    },
  },
});
