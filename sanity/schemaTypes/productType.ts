import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Sản phẩm",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Tên sản phẩm",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Ảnh sản phẩm",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description",
      title: "Mô tả",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Giá",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "linkYoutube",
      title: "Link Youtube",
      type: "string",
    }),
    defineField({
      name: "discount",
      title: "Giảm giá (%)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "categories",
      title: "Danh mục",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "stock",
      title: "Tồn kho",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "status",
      title: "Trạng thái sản phẩm",
      type: "string",
      options: {
        list: [
          { title: "Mới", value: "new" },
          { title: "Hot", value: "hot" },
          { title: "Giảm giá", value: "sale" },
        ],
      },
    }),
    defineField({
      name: "variant",
      title: "Loại sản phẩm",
      type: "string",
      options: {
        list: [
          { title: "Loa kéo", value: "loa-keo" },
          { title: "Linh kiện lắp ráp", value: "linh-kien-lap-rap" },
          { title: "Phụ kiện & Thay thế", value: "phu-kien-thay-the" },
        ],
      },
    }),
    defineField({
      name: "isFeatured",
      title: "Sản phẩm nổi bật",
      type: "boolean",
      description: "Bật/Tắt sản phẩm nổi bật",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images.0.asset",
      price: "price",
    },
    prepare(selection) {
      const { title, price, media } = selection;
      return {
        title: title,
        // Format giá tiền: 5000000 -> 5.000.000 đ
        subtitle: price ? `${price.toLocaleString("vi-VN")} đ` : "Liên hệ",
        media: media,
      };
    },
  },
});
