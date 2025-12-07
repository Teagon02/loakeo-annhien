import React from "react";
import { getBlogBySlug } from "@/sanity/queries";
import Container from "@/components/Container";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { PortableText } from "@portabletext/react";
import { BlockContent, Blogcategory } from "@/sanity.types";
import { notFound } from "next/navigation";

// ISR: Revalidate mỗi giờ để giảm API calls nhưng vẫn có data mới
export const revalidate = 3600;

// Custom components for PortableText
type ImageValue = Extract<BlockContent[number], { _type: "image" }>;

type LinkValue = {
  href?: string;
  _type: "link";
  _key: string;
};

const PortableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset) return null;
      return (
        <div className="my-8">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Blog image"}
            width={800}
            height={600}
            className="w-full h-auto rounded-lg"
          />
          {value.alt && (
            <p className="text-sm text-gray-500 mt-2 text-center italic">
              {value.alt}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-3xl font-bold mt-6 mb-3 text-gray-900">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-900">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-xl font-semibold mt-4 mb-2 text-gray-900">
        {children}
      </h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-shop_light_green pl-4 py-2 my-4 italic text-gray-700 bg-shop_light_bg rounded-r">
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 ml-4">
        {children}
      </ul>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: LinkValue;
    }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-shop_light_green hover:text-shop_dark_green underline transition-colors"
        >
          {children}
        </a>
      );
    },
  },
};

const SingleBlogPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <Container className="py-10">
      {/* Back button */}
      <Link href="/blog">
        <Button variant="ghost" className="mb-6 hover:text-shop_light_green">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách bài viết
        </Button>
      </Link>

      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          {/* Categories */}
          {blog.blogcategories && blog.blogcategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {blog.blogcategories.map(
                (category: { title: string | null }, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-shop_light_bg text-shop_dark_green rounded-full text-sm font-medium"
                  >
                    <Tag className="w-3 h-3" />
                    {category?.title}
                  </span>
                )
              )}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            {blog.author && (
              <div className="flex items-center gap-3">
                {blog.author.image ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-shop_light_green">
                    <Image
                      src={urlFor(blog.author.image)
                        .width(100)
                        .height(100)
                        .url()}
                      alt={blog.author.name || "Tác giả"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-shop_light_bg flex items-center justify-center border-2 border-shop_light_green">
                    <User className="w-5 h-5 text-shop_dark_green" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    {blog.author.name || "Tác giả"}
                  </p>
                </div>
              </div>
            )}
            {blog.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={blog.publishedAt}>
                  {dayjs(blog.publishedAt).format("DD/MM/YYYY")}
                </time>
              </div>
            )}
          </div>

          {/* Main Image */}
          {blog.mainImage && (
            <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-8">
              <Image
                src={urlFor(blog.mainImage).width(1200).height(600).url()}
                alt={blog.title || "Blog image"}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        {/* Content */}
        {blog.body && (
          <div className="prose prose-lg max-w-none">
            <PortableText
              value={blog.body as BlockContent}
              components={PortableTextComponents}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {blog.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Đăng ngày {dayjs(blog.publishedAt).format("DD/MM/YYYY")}
                  </span>
                </div>
              )}
            </div>
            <Link href="/blog">
              <Button variant="outline" className="hover:text-shop_light_green">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Xem thêm bài viết
              </Button>
            </Link>
          </div>
        </footer>
      </article>
    </Container>
  );
};

export default SingleBlogPage;
