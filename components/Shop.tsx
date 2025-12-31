"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Category, Product } from "@/sanity.types";
import Container from "./Container";
import { Title } from "./ui/text";
import CategoryList from "./shop/CategoryList";
import PriceList from "./shop/PriceList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import Pagination from "./Pagination";

interface Props {
  categories: Category[];
}
const Shop = ({ categories }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryParams = searchParams?.get("category");
  const searchParam = searchParams?.get("search");
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0); // Tổng số sản phẩm
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Số sản phẩm mỗi trang
  // State tạm thời cho filter trong dialog
  const [tempSelectedCategory, setTempSelectedCategory] = useState<
    string | null
  >(null);
  const [tempSelectedPrice, setTempSelectedPrice] = useState<string | null>(
    null
  );
  // Ref cho container scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Khởi tạo temp state khi mở dialog
  useEffect(() => {
    if (isFilterOpen) {
      setTempSelectedCategory(selectedCategory);
      setTempSelectedPrice(selectedPrice);
    }
  }, [isFilterOpen, selectedCategory, selectedPrice]);

  // Đồng bộ slug category lên URL (?category=slug)
  useEffect(() => {
    if (!router || !pathname) return;

    const params = new URLSearchParams(searchParams?.toString());
    const currentParam = params.get("category") || "";
    const nextValue = selectedCategory || "";

    if (nextValue) {
      params.set("category", nextValue);
    } else {
      params.delete("category");
    }

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // Chỉ push khi giá trị thực sự thay đổi để tránh loop
    if (currentParam === nextValue || (!currentParam && !nextValue)) {
      return;
    }

    router.push(targetUrl, { scroll: false });
  }, [selectedCategory, searchParams, pathname, router]);

  const handleApplyFilter = () => {
    setSelectedCategory(tempSelectedCategory);
    setSelectedPrice(tempSelectedPrice);
    setIsFilterOpen(false);
    setCurrentPage(1); // Reset về trang 1 khi filter thay đổi
  };

  // Fetch tổng số sản phẩm (chỉ khi filter thay đổi)
  const fetchTotalCount = useCallback(async () => {
    try {
      let minPrice = 0;
      let maxPrice = 1000000000;
      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }

      // Xử lý pattern tìm kiếm theo tên sản phẩm
      // match operator trong Sanity đã case-insensitive, không cần lower()
      let searchPattern: string | null = null;
      if (searchParam && searchParam.trim()) {
        searchPattern = `*${searchParam}*`;
      }

      const countQuery = `
  count(*[
    _type == "product"
    && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
    && (!defined($minPrice) || price >= $minPrice)
    && (!defined($searchPattern) || name match $searchPattern)
    && price <= ${maxPrice}
  ])
`;

      const total = await client.fetch(
        countQuery,
        {
          selectedCategory,
          minPrice,
          searchPattern,
        },
        { next: { revalidate: 10 } }
      );

      setTotalCount(total);
    } catch (error) {
      console.error("Error fetching total count", error);
    }
  }, [selectedCategory, selectedPrice, searchParam]);

  // Fetch sản phẩm với pagination
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

      // Xử lý pattern tìm kiếm theo tên sản phẩm
      // match operator trong Sanity đã case-insensitive, không cần lower()
      let searchPattern: string | null = null;
      if (searchParam && searchParam.trim()) {
        searchPattern = `*${searchParam}*`;
      }

      // Tính toán offset và limit cho pagination
      const offset = (currentPage - 1) * itemsPerPage;
      const limit = itemsPerPage;

      // Query để lấy sản phẩm với pagination
      const productsQuery = `
  *[
    _type == "product"
    && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
    && (!defined($minPrice) || price >= $minPrice)
    && (!defined($searchPattern) || name match $searchPattern)
    && price <= ${maxPrice}
  ] | order(name asc) [${offset}...${offset + limit}] {
    ...,
    "categories":categories[]->title
  }
`;

      const data = await client.fetch(
        productsQuery,
        {
          selectedCategory,
          minPrice,
          searchPattern,
        },
        { next: { revalidate: 10 } }
      );

      setProducts(data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedPrice, currentPage, itemsPerPage, searchParam]);

  // Reset về trang 1 và fetch lại count khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
    fetchTotalCount();
  }, [selectedCategory, selectedPrice, searchParam, fetchTotalCount]);

  // Fetch products khi filter hoặc page thay đổi
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Scroll window về đầu khi chuyển trang
  useEffect(() => {
    const scrollToTop = () => {
      // Scroll window về đầu - hỗ trợ tốt trên cả desktop và mobile
      if (window.scrollTo) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      // Fallback cho các trình duyệt cũ
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Scroll ngay khi trang thay đổi
    scrollToTop();

    // Scroll lại sau khi products được render (nếu đang loading)
    if (loading) {
      const timer = setTimeout(() => {
        scrollToTop();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Nếu không loading, scroll sau một chút để đảm bảo DOM đã render
      const timer = setTimeout(() => {
        scrollToTop();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentPage, loading]);

  // Tính tổng số trang dựa trên totalCount
  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / itemsPerPage);
  }, [totalCount, itemsPerPage]);

  return (
    <div>
      <Container className="mt-5">
        {/* Filter tiêu đề & Reset */}
        <div className="border py-2 px-1 rounded-sm bg-shop_light_green/30">
          {/* Tiêu đề */}
          <Title className="text-lg uppercase tracking-wide text-center">
            Danh sách sản phẩm
          </Title>
        </div>
        <div className="flex items-center gap-2 py-2">
          {/* Nút Lọc - chỉ hiển thị trên mobile */}
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden flex items-center gap-2 bg-blue-300/60 font-bold border"
              >
                <Filter className="w-4 h-4" />
                Lọc
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] flex flex-col max-w-[calc(100%-2rem)] sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="border-b pb-2">
                  Lọc sản phẩm
                </DialogTitle>
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
                setCurrentPage(1); // Reset về trang 1 khi reset filter
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
          <div className="flex-1 pt-5 flex flex-col">
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto pr-2 scrollbar-hide min-h-0"
            >
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
            {/* Pagination - hiển thị bên ngoài scroll container */}
            {!loading && products?.length > 0 && totalPages > 1 && (
              <div className="mt-6 pb-5 pt-4 border-t border-t-shop_dark_green/20">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Shop;
