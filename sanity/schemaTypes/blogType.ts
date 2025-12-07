import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const blogType = defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tên bài viết",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "author",
      title: "Tác giả",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "mainImage",
      title: "Ảnh chính",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "blogcategories",
      title: "Danh mục bài viết",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: { type: "blogcategory" } }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Ngày xuất bản",
      type: "datetime",
    }),
    defineField({
      name: "isLatest",
      title: "Bài viết mới nhất",
      type: "boolean",
      description: "Bật/Tắt bài viết mới nhất",
      initialValue: true,
    }),
    defineField({
      name: "body",
      title: "Nội dung bài viết",
      type: "blockContent",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
      isLatest: "isLatest",
    },
    prepare(selection) {
      const { author, isLatest } = selection;
      return {
        ...selection,
        subtitle: author && `${isLatest ? "Latest | " : ""} By ${author}`,
      };
    },
  },
});
