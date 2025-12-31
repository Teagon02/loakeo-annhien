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
      type: "text",
      options: {
        rows: 5, // textarea lớn hơn trong Studio
      } as any,
    }),
    defineField({
      name: "price",
      title: "Giá gốc",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "depositPrice",
      title: "Cọc trước",
      type: "number",
      validation: (Rule) => Rule.min(0),
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
      name: "soldOut",
      title: "Đã bán",
      type: "number",
      description: "Số lượng sản phẩm đã bán",
      initialValue: 0,
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
          { title: "Phụ kiện", value: "phu-kien" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images.0.asset",
      price: "price",
      stock: "stock",
    },
    prepare(selection) {
      const { title, price, media, stock } = selection;
      const priceText = price
        ? `${price.toLocaleString("vi-VN")} đ`
        : "Liên hệ";
      const stockText =
        stock !== undefined && stock !== null
          ? ` - Tồn kho: ${stock.toLocaleString("vi-VN")}`
          : "";
      return {
        title: title,
        // Format giá tiền: 5000000 -> 5.000.000 đ
        subtitle: `${priceText}${stockText}`,
        media: media,
      };
    },
  },
});
