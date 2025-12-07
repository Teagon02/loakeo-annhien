import { MapPin } from "lucide-react";
import { defineField, defineType } from "sanity";

export const addressType = defineType({
  name: "address",
  title: "Địa chỉ",
  type: "document",
  icon: MapPin,
  fields: [
    // 1. ĐỊNH DANH (Quan trọng nhất để biết địa chỉ của ai)
    defineField({
      name: "userId",
      title: "User ID (Clerk)",
      type: "string",
      description: "ID người dùng từ hệ thống Clerk (không đổi)",
      validation: (Rule) => Rule.required(),
      readOnly: true, // Không cho sửa tay để tránh mất kết nối
    }),
    defineField({
      name: "email",
      title: "Email người dùng",
      type: "email",
      readOnly: true, // Chỉ để Admin xem cho dễ biết, không dùng để query chính
    }),

    // 2. THÔNG TIN NGƯỜI NHẬN
    defineField({
      name: "fullName",
      title: "Họ và tên người nhận",
      type: "string",
      validation: (Rule) => Rule.required().error("Phải nhập tên người nhận"),
    }),
    defineField({
      name: "phone",
      title: "Số điện thoại",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .regex(
            /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/,
            {
              name: "vietnam phone",
              invert: false,
            }
          )
          .error("Số điện thoại không hợp lệ"),
    }),

    // 3. ĐỊA CHỈ HÀNH CHÍNH (3 CẤP VIỆT NAM)
    defineField({
      name: "province",
      title: "Tỉnh / Thành phố",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "district",
      title: "Quận / Huyện",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ward",
      title: "Phường / Xã",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // 4. CHI TIẾT & CẤU HÌNH
    defineField({
      name: "addressLine",
      title: "Địa chỉ cụ thể",
      description: "Số nhà, tên đường, khu phố, thôn/ấp...",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Loại địa chỉ",
      type: "string",
      options: {
        list: [
          { title: "Nhà riêng", value: "home" },
          { title: "Văn phòng", value: "office" },
          { title: "Khác", value: "other" },
        ],
      },
      initialValue: "home",
    }),
    defineField({
      name: "isDefault",
      title: "Đặt làm mặc định",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "createAt",
      title: "Ngày tạo",
      type: "datetime",
      initialValue: new Date().toISOString(),
      readOnly: true,
    }),
  ],

  // Cấu hình hiển thị trong Admin cho đẹp
  preview: {
    select: {
      title: "fullName",
      phone: "phone",
      address: "addressLine",
      province: "province",
      district: "district",
      ward: "ward",
      isDefault: "isDefault",
    },
    prepare({ title, phone, address, province, district, ward, isDefault }) {
      // Tạo chuỗi địa chỉ đầy đủ: "123 Đường A, P.1, Q.GV, TP.HCM"
      const fullAddress = [address, ward, district, province]
        .filter(Boolean) // Lọc bỏ giá trị null/undefined
        .join(", ");

      return {
        title: `${title} (${phone})`,
        subtitle: fullAddress,
        media: MapPin,
      };
    },
  },
});
