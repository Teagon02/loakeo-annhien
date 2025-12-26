"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

const DealProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Số sản phẩm mỗi trang

  // Fetch tổng số sản phẩm deal (chỉ khi component mount)
  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const countQuery = `count(*[_type == 'product' && status == 'hot'])`;
        const total = await client.fetch(
          countQuery,
          {},
          { next: { revalidate: 60 } }
        );
        setTotalCount(total);
      } catch (error) {
        console.error("Error fetching total count", error);
      }
    };
    fetchTotalCount();
  }, []);

  // Fetch sản phẩm với pagination
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Tính toán offset và limit cho pagination
      const offset = (currentPage - 1) * itemsPerPage;
      const limit = itemsPerPage;

      // Query để lấy sản phẩm với pagination
      const productsQuery = `
  *[_type == 'product' && status == 'hot'] | order(name asc) [${offset}...${offset + limit}] {
    ...,"categories": categories[]->title
  }
`;

      const data = await client.fetch(
        productsQuery,
        {},
        { next: { revalidate: 60 } }
      );

      setProducts(data);
    } catch (error) {
      console.error("Error fetching deal products", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  // Fetch products khi page thay đổi
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
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 gap-4 bg-deal-bg w-full">
          <div className="space-x-2 flex items-center text-shop_dark_green">
            <Loader2 className="w-5 h-6 animate-spin" />
            <span>Đang tải sản phẩm...</span>
          </div>
        </div>
      ) : products?.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {products?.map((product) => (
              <ProductCard key={product?._id} product={product} />
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 mb-5">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <NoProductAvailable />
      )}
    </>
  );
};

export default DealProducts;
