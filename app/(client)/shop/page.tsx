import React from "react";
import { getCategories } from "@/sanity/queries";
import Shop from "@/components/Shop";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm - Loa Kéo An Nhiên",
  description: "Tất cả sản phẩm - Loa Kéo An Nhiên",
};

const ShopPage = async () => {
  const categories = await getCategories();
  return (
    <div className="bg-white pb-5">
      <Shop categories={categories} />
    </div>
  );
};

export default ShopPage;
