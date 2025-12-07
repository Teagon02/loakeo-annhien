import { ShoppingCart } from "lucide-react";
import { defineField, defineType } from "sanity";

export const cartType = defineType({
  name: "cart",
  title: "Giỏ hàng",
  type: "document",
  icon: ShoppingCart,
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
      name: "items",
      title: "Sản phẩm trong giỏ hàng",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "product",
              title: "Sản phẩm",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "quantity",
              title: "Số lượng",
              type: "number",
              validation: (Rule: any) => Rule.required().min(1),
              initialValue: 1,
            },
          ],
          preview: {
            select: {
              productName: "product.name",
              quantity: "quantity",
            },
            prepare({ productName, quantity }: any) {
              return {
                title: productName || "Sản phẩm",
                subtitle: `Số lượng: ${quantity || 1}`,
              };
            },
          },
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
      itemCount: "items",
    },
    prepare({ userId, email, itemCount }: any) {
      const count = Array.isArray(itemCount) ? itemCount.length : 0;
      return {
        title: email || userId || "Giỏ hàng",
        subtitle: `${count} sản phẩm`,
        media: ShoppingCart,
      };
    },
  },
});
