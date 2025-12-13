import React from "react";
import { Title } from "./ui/text";
import { Category } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import sanityLoader from "@/lib/image-loader";
import Link from "next/link";

// Type for category with productCount from query
type CategoryWithProductCount = Category & {
  productCount?: number;
};

const HomeCategories = ({
  categories,
}: {
  categories: CategoryWithProductCount[];
}) => {
  // Ưu tiên 6 danh mục "hot" (theo slug chuẩn hóa), fallback 6 cuối
  const hotKeys = [
    "loa-keo-binh-ac-quy",
    "loa-keo-dien",
    "loa-xach-tay",
    "bass",
    "micro",
    "vo-loa",
  ];

  const normalize = (value?: string | null) =>
    (value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");

  const hotCategories = (categories ?? [])
    .map((cat) => ({
      cat,
      rank: hotKeys.indexOf(
        normalize(cat?.slug?.current) || normalize(cat?.title)
      ),
    }))
    .filter((item) => item.rank >= 0)
    .sort((a, b) => a.rank - b.rank)
    .map((item) => item.cat)
    .slice(0, 6);

  const displayCategories =
    hotCategories.length > 0 ? hotCategories : (categories?.slice(-6) ?? []);

  return (
    <div className="bg-white border border-shop_light_green/20 my-10 md:my-20 p-5 lg:p-7 rounded-md">
      <Title className="border-b pb-3">Danh mục sản phẩm</Title>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayCategories?.map((category: CategoryWithProductCount) => (
          <div
            key={category?._id}
            className="bg-shop_light_bg p-5 flex items-center gap-3 group"
          >
            {/* Ảnh danh mục */}
            {category?.image && (
              <div className="overflow-hidden border border-shop_orange/30 hover:border-shop_orange hoverEffect w-20 h-20 p-1">
                <Link
                  href={{
                    pathname: "/shop",
                    query: { category: category?.slug?.current },
                  }}
                >
                  <Image
                    src={urlFor(category?.image).url()}
                    alt="Ảnh danh mục"
                    loader={sanityLoader}
                    width={500}
                    height={500}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-full object-contain group-hover:scale-110 hoverEffect"
                  />
                </Link>
              </div>
            )}
            <div className="space-y-1">
              <Link
                href={{
                  pathname: "/shop",
                  query: { category: category?.slug?.current },
                }}
                className="text-base font-semibold hover:text-shop_dark_green hoverEffect"
              >
                {category?.title}
              </Link>
              <p className="text-sm">
                <span className="font-bold text-shop_dark_green">{`(${category?.productCount ?? 0})`}</span>{" "}
                hàng có sẵn
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
