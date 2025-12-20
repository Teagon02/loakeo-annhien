import React from "react";
import { getCategories } from "@/sanity/queries";
import Shop from "@/components/Shop";

const ShopPage = async () => {
  const categories = await getCategories();
  return (
    <div className="bg-white pb-5">
      <Shop categories={categories} />
    </div>
  );
};

export default ShopPage;
