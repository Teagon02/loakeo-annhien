import React from "react";
import Link from "next/link";
import { productType } from "@/constants/data";

interface Props {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const HomeTabBar = ({ selectedTab, setSelectedTab }: Props) => {
  console.log(selectedTab);
  return (
    <div className="flex items-center justify-between flex-wrap gap-5">
      <div className="flex items-stretch gap-3 text-sm font-semibold">
        {productType?.map((item) => (
          <button
            onClick={() => setSelectedTab(item?.title)}
            key={item?.title}
            className={`flex items-center justify-center border border-shop_light_green/20 px-4 py-1.5 md:px-6 md:py-2 rounded-lg hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect ${selectedTab === item?.title ? "bg-shop_light_green text-white border-shop_light_green" : "bg-shop_light_green/20"}`}
          >
            {item?.title}
          </button>
        ))}
      </div>
      <Link
        href={"/shop"}
        className={`border border-shop_light_green/30 bg-gray-200 px-4 py-1.5 md:px-6 md:py-2 rounded-lg hover:bg-shop_light_green hover:border-shop_light_green hover:text-white hoverEffect`}
      >
        Xem tất cả
      </Link>
    </div>
  );
};

export default HomeTabBar;
