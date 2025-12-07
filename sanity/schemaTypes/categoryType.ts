import { defineField, defineType } from "sanity";
import { TagIcon } from "lucide-react";

export const categoryType = defineType({
  name: "category",
  title: "Danh mục",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tên danh mục",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Mô tả",
      type: "text",
    }),
    defineField({
      name: "featured",
      title: "Danh mục nổi bật",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "image",
      title: "Hình ảnh",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
});
