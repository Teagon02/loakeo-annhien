import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const blogCategoryType = defineType({
  name: "blogcategory",
  title: "Danh mục bài viết",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tên danh mục",
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
      name: "description",
      title: "Mô tả",
      type: "text",
    }),
  ],
});
