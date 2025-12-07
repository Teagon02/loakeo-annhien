import React from "react";
import { Title } from "./ui/text";
import { getLatestBlogs } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import { Blog, Blogcategory } from "@/sanity.types";

const LatestBlog = async () => {
  const blogs = await getLatestBlogs(4);
  return (
    <div className="mb-10 lg:mb-20">
      <Title>Bài viết mới nhất</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
        {blogs?.map(
          (
            blog: Blog & {
              blogcategories?: Array<Blogcategory | { title?: string }>;
            }
          ) => (
            // hiển thị khối blog
            <div
              key={blog?._id}
              className="rounded-lg overflow-hidden hover:scale-105 hoverEffect"
            >
              {blog?.mainImage && (
                // hiển thị ảnh blog
                <Link href={`/blog/${blog?.slug?.current}`}>
                  <Image
                    src={urlFor(blog?.mainImage).url()}
                    alt="Ảnh blog"
                    width={500}
                    height={500}
                    className="w-full max-h-80 object-cover"
                  />
                </Link>
              )}
              <div className="bg-shop_light_bg p-5">
                {/* hiển thị danh mục & ngày xuất bản */}
                <div className="text-xs flex items-center gap-5">
                  {/* hiển thị danh mục bài viết */}
                  <div className="flex items-center relative group cursor-pointer">
                    {blog?.blogcategories?.map(
                      (
                        item: Blogcategory | { title?: string },
                        index: number
                      ) => (
                        <p
                          key={index}
                          className="font-semibold text-shop_dark_green tracking-wider"
                        >
                          {item?.title}
                        </p>
                      )
                    )}
                    <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hover:cursor-pointer hoverEffect" />
                  </div>
                  {/* hiển thị ngày xuất bản */}
                  <div>
                    <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
                      <Calendar size={15} />{" "}
                      {dayjs(blog?.publishedAt).format("DD/MM/YYYY")}
                      <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
                    </p>
                  </div>
                </div>
                {/* hiển thị tiêu đề bài viết */}
                <Link
                  href={`/blog/${blog?.slug?.current}`}
                  className="text-base font-semibold tracking-wide mt-5 line-clamp-2 hover:text-shop_dark_green hoverEffect"
                >
                  {blog?.title}
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LatestBlog;
