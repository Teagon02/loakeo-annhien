"use client";
import React, { useEffect, useState, useMemo } from "react";
import HomeTabBar from "./HomeTabBar";
import { productType } from "@/constants/data";
import { client } from "@/sanity/lib/client";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import { AnimatePresence } from "motion/react";
import ProductCard from "./ProductCard";
import { Product } from "@/sanity.types";
import Pagination from "./Pagination";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0); // Tổng số sản phẩm
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Số sản phẩm mỗi trang

  const currentTabValue = productType.find(
    (item) => item.title === selectedTab
  )?.value;

  const params = useMemo(
    () => ({
      variant: currentTabValue,
    }),
    [currentTabValue]
  );

  // Fetch tổng số sản phẩm (chỉ khi tab thay đổi)
  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const countQuery = `count(*[_type == "product" && variant==$variant])`;
        const total = await client.fetch(countQuery, params, {
          next: { revalidate: 60 },
        });
        setTotalCount(total);
      } catch (error) {
        console.error("Error fetching total count", error);
      }
    };
    fetchTotalCount();
  }, [selectedTab, params]);

  // Fetch sản phẩm với pagination
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Tính toán offset và limit cho pagination
        const offset = (currentPage - 1) * itemsPerPage;
        const limit = itemsPerPage;

        // Query với pagination
        const paginatedQuery = `*[_type == "product" && variant==$variant] | order(name desc) [${offset}...${offset + limit}] {
    ...,"categories":categories[]->title
    }`;

        const respone = await client.fetch(
          paginatedQuery,
          params,
          { next: { revalidate: 60 } } // Cache 60 giây cho client-side fetch
        );
        setProducts(respone);
      } catch (error) {
        console.error("Product fetching error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab, currentPage, params, itemsPerPage]);

  // Reset về trang 1 khi tab thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab]);

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
      <HomeTabBar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 gap-4 bg-gray-100 w-full mt-10">
          <div className="space-x-2 flex items-center text-blue-600">
            <Loader2 className="w-5 h-6 animate-spin" />
            <span>Đang tải sản phẩm...</span>
          </div>
        </div>
      ) : products?.length ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-10">
            <>
              {products?.map((product) => (
                <AnimatePresence key={product?._id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                </AnimatePresence>
              ))}
            </>
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
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </div>
  );
};

export default ProductGrid;
