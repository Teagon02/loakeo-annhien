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

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(productType[0]?.title || "");

  // truy vấn
  const query = `*[_type == "product" && variant==$variant] | order(name desc) {
    ...,"categories":categories[]->title
    }`;

  const currentTabValue = productType.find(
    (item) => item.title === selectedTab
  )?.value;

  const params = useMemo(
    () => ({
      variant: currentTabValue,
    }),
    [currentTabValue]
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const respone = await client.fetch(
          query,
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
  }, [selectedTab, query, params]);
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
      ) : (
        <NoProductAvailable selectedTab={selectedTab} />
      )}
    </div>
  );
};

export default ProductGrid;
