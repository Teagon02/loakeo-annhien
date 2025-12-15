"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Category, Product } from "@/sanity.types";
import Container from "./Container";
import { Title } from "./ui/text";
import CategoryList from "./shop/CategoryList";
import PriceList from "./shop/PriceList";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { Loader2, Filter } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // State tạm thời cho filter trong dialog
  const [tempSelectedCategory, setTempSelectedCategory] = useState<
    string | null
  >(null);
  const [tempSelectedPrice, setTempSelectedPrice] = useState<string | null>(
    null
  );

  // Khởi tạo temp state khi mở dialog
  useEffect(() => {
    if (isFilterOpen) {
      setTempSelectedCategory(selectedCategory);
      setTempSelectedPrice(selectedPrice);
    }
  }, [isFilterOpen, selectedCategory, selectedPrice]);

  const handleApplyFilter = () => {
    setSelectedCategory(tempSelectedCategory);
    setSelectedPrice(tempSelectedPrice);
    setIsFilterOpen(false);
  };

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
    <div>
      <Container className="mt-5">
        {/* Filter tiêu đề & Reset */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 border py-5 px-2 rounded-lg bg-white">
          {/* Tiêu đề */}
          <Title className="text-lg uppercase tracking-wide">
            Chọn sản phẩm theo nhu cầu của bạn
          </Title>
        </div>
        <div className="flex items-center gap-2 py-2">
          {/* Nút Lọc - chỉ hiển thị trên mobile */}
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Lọc
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Lọc sản phẩm</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                <CategoryList
                  categories={categories}
                  selectedCategory={tempSelectedCategory}
                  setSelectedCategory={setTempSelectedCategory}
                />
                <PriceList
                  selectedPrice={tempSelectedPrice}
                  setSelectedPrice={setTempSelectedPrice}
                />
              </div>
              <div className="flex gap-2 pt-4 border-t mt-4">
                <Button
                  onClick={handleApplyFilter}
                  className="flex-1 bg-shop_dark_green hover:bg-shop_light_green"
                >
                  Áp dụng
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Reset tất cả */}
          {(selectedCategory !== null || selectedPrice !== null) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedPrice(null);
              }}
              className="text-shop_dark_green underline-offset-2 text-sm font-bold hover:bg-red-500/30 border border-red-500 py-2 px-2 rounded-lg bg-red-500/10 hoverEffect w-36 md:w-auto"
            >
              Reset tất cả
            </button>
          )}
        </div>

        {/* Filter danh mục - Ẩn trên mobile, hiển thị trong dialog */}
        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          <div className="hidden md:block md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 md:border-r border-r-shop_dark_green/50 scrollbar-hide">
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
