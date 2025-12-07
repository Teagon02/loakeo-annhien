"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Category, Product } from "@/sanity.types";
import Container from "./Container";
import { Title } from "./ui/text";
import CategoryList from "./shop/CategoryList";
import PriceList from "./shop/PriceList";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";

interface Props {
  categories: Category[];
}
const Shop = ({ categories }: Props) => {
  const searchParams = useSearchParams();
  const categoryParams = searchParams?.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let minPrice = 0;
      let maxPrice = 1000000000;
      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }
      const query = `
  *[
    _type == "product"
    && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
    && (!defined($minPrice) || price >= $minPrice)
    && price <= ${maxPrice}
  ] | order(name asc) {
    ...,"categories":categories[]->title
  }
`;
      const data = await client.fetch(
        query,
        {
          selectedCategory,
          minPrice,
        },
        { next: { revalidate: 60 } } // Cache 60 giây cho client-side fetch
      );
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="border-t">
      <Container className="mt-5">
        {/* Filter tiêu đề & Reset */}
        <div className="sticky top-0 z-10 mb-5">
          <div className="flex items-center justify-between">
            {/* Tiêu đề */}
            <Title className="text-lg uppercase tracking-wide">
              Chọn sản phẩm theo nhu cầu của bạn
            </Title>

            {/* Reset tất cả */}
            {(selectedCategory !== null || selectedPrice !== null) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedPrice(null);
                }}
                className="text-shop_dark_green underline underline-offset-2 text-sm mt-2 font-medium hover:text-shop_orange hoverEffect"
              >
                Reset tất cả
              </button>
            )}
          </div>
        </div>

        {/* Filter danh mục */}
        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          <div className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_dark_green/50 scrollbar-hide">
            {/* Danh sách danh mục */}
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            {/* Danh sách giá */}
            <PriceList
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
            />
          </div>
          <div className="flex-1 pt-5">
            <div className="h-[calc(100vh-160px)] overflow-y-auto pr-2 scrollbar-hide">
              {loading ? (
                <div className="p-20 flex flex-col gap-2 items-center justify-center bg-white">
                  <Loader2 className="w-10 h-10 text-shop_dark_green animate-spin" />
                  <p className="font-semibold tracking-wide text-base">
                    Đang tải sản phẩm...
                  </p>
                </div>
              ) : products?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {products?.map((product) => (
                    <ProductCard key={product?._id} product={product} />
                  ))}
                </div>
              ) : (
                <NoProductAvailable className="bg-white mt-0 w-full" />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
