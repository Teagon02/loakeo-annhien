import { Heart } from "lucide-react";
import { defineField, defineType } from "sanity";

export const wishlistType = defineType({
  name: "wishlist",
  title: "Danh sách yêu thích",
  type: "document",
  icon: Heart,
  fields: [
    defineField({
      name: "userId",
      title: "User ID (Clerk)",
      type: "string",
      description: "ID người dùng từ hệ thống Clerk",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "Email người dùng",
      type: "email",
      readOnly: true,
    }),
    defineField({
      name: "products",
      title: "Sản phẩm yêu thích",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
    }),
    defineField({
      name: "updatedAt",
      title: "Cập nhật lần cuối",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      userId: "userId",
      email: "email",
      productCount: "products",
    },
    prepare({ userId, email, productCount }: any) {
      const count = Array.isArray(productCount) ? productCount.length : 0;
      return {
        title: email || userId || "Danh sách yêu thích",
        subtitle: `${count} sản phẩm`,
        media: Heart,
      };
    },
  },
});
