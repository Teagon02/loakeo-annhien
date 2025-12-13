import React from "react";
import Container from "@/components/Container";
import { Title } from "@/components/ui/text";
import { getPaginatedBlogs } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Blog } from "@/sanity.types";

// ISR: Revalidate mỗi 10 phút cho blog listing
export const revalidate = 600;

// Type for blog with populated categories
type BlogWithPopulatedCategories = Omit<Blog, "blogcategories"> & {
  blogcategories?: Array<{ title: string | null }> | null;
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

const BlogPage = async ({ searchParams }: BlogPageProps) => {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 6;

  const { blogs, total } = await getPaginatedBlogs(currentPage, pageSize);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <Container className="py-10">
      <div className="mb-8">
        <Title>Tất cả bài viết</Title>
        <p className="text-gray-600 mt-2">
          Khám phá các bài viết mới nhất và hữu ích từ chúng tôi
        </p>
      </div>

      {blogs && blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog: BlogWithPopulatedCategories) => (
            <article
              key={blog._id}
              className="rounded-lg overflow-hidden bg-white border border-gray-200 hover:border-shop_light_green hover:shadow-lg transition-all duration-300 group"
            >
              {/* Blog Image */}
              {blog.mainImage && (
                <Link href={`/blog/${blog.slug?.current}`}>
                  <div className="relative w-full h-64 overflow-hidden bg-shop_light_bg">
                    <Image
                      src={urlFor(blog.mainImage).width(1200).quality(85).format('webp').url()}
                      alt={blog.title || "Ảnh blog"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>
              )}

              {/* Blog Content */}
              <div className="p-5">
                {/* Categories & Date */}
                <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
                  {blog.blogcategories && blog.blogcategories.length > 0 && (
                    <div className="flex items-center gap-1">
                      {blog.blogcategories.map(
                        (category: { title: string | null }, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-shop_light_bg text-shop_dark_green rounded-full font-medium"
                          >
                            {category?.title}
                          </span>
                        )
                      )}
                    </div>
                  )}
                  {blog.publishedAt && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar size={12} />
                      <time dateTime={blog.publishedAt}>
                        {dayjs(blog.publishedAt).format("DD/MM/YYYY")}
                      </time>
                    </div>
                  )}
                </div>

                {/* Title */}
                <Link href={`/blog/${blog.slug?.current}`}>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-shop_light_green transition-colors">
                    {blog.title}
                  </h2>
                </Link>

                {/* Read More Button */}
                <Link href={`/blog/${blog.slug?.current}`}>
                  <Button
                    variant="ghost"
                    className="mt-4 text-sm bg-gray-200  hover:text-shop_light_green p-1 h-auto"
                  >
                    Đọc thêm
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-shop_light_bg flex items-center justify-center mb-6">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Chưa có bài viết nào
          </h3>
          <p className="text-gray-600 max-w-md">
            Các bài viết sẽ được cập nhật sớm. Hãy quay lại sau!
          </p>
        </div>
      )}

      {/* Pagination */}
      {blogs && blogs.length > 0 && totalPages > 1 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Hiển thị {blogs.length} / {total} bài viết
          </p>
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <Link
              href={`/blog${currentPage > 1 ? `?page=${currentPage - 1}` : ""}`}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg border transition-colors ${
                currentPage === 1
                  ? "border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                  : "border-gray-300 text-gray-700 hover:border-shop_light_green hover:text-shop_light_green"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  if (!showPage) {
                    // Show ellipsis
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <Link
                      key={page}
                      href={`/blog${page > 1 ? `?page=${page}` : ""}`}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        page === currentPage
                          ? "bg-shop_light_green text-white border-shop_light_green"
                          : "border-gray-300 text-gray-700 hover:border-shop_light_green hover:text-shop_light_green"
                      }`}
                    >
                      {page}
                    </Link>
                  );
                }
              )}
            </div>

            {/* Next Button */}
            <Link
              href={`/blog${currentPage < totalPages ? `?page=${currentPage + 1}` : ""}`}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg border transition-colors ${
                currentPage === totalPages
                  ? "border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                  : "border-gray-300 text-gray-700 hover:border-shop_light_green hover:text-shop_light_green"
              }`}
            >
              <span>Sau</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </Container>
  );
};

export default BlogPage;
