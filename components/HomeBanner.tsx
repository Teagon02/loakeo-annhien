"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";

const HomeBanner = () => {
  return (
    <div className="relative w-full min-h-[320px] md:min-h-[400px] lg:min-h-[480px] overflow-hidden rounded-lg md:rounded-xl lg:rounded-2xl">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-shop_light_pink via-white to-shop_light_bg">
        <div className="absolute inset-0 bg-linear-to-r from-shop_orange/10 via-transparent to-shop_light_green/10" />
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-shop_light_green/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-shop_orange/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full overflow-visible">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 h-full min-h-[320px] md:min-h-[400px] lg:min-h-[480px] py-6 md:py-8 lg:py-10 overflow-visible">
          {/* Left Section - CTA */}
          <div className="flex flex-col items-center lg:items-start gap-6 lg:gap-8 flex-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-shop_dark_green leading-tight">
              Tìm kiếm những sản phẩm{" "}
              <span className="text-shop_light_green">chất lượng cao</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-shop_light_text max-w-lg">
              Cung cấp linh kiện, phụ kiện và các thành phẩm loa kéo chất lượng
              cao với giá cả hợp lý
            </p>
            <div>
              <Button
                size="lg"
                className="group text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link href="/shop" className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Mua ngay</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Section - Brand */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-8 flex-1 w-full min-w-0">
            <div className="flex items-center justify-center gap-4">
              <div className="relative shrink-0">
                <Logo
                  className="w-auto h-8 sm:h-12 md:h-16 lg:h-18 xl:h-22"
                  imageClassName="h-8 sm:h-12 md:h-16 lg:h-18 xl:h-30 w-auto drop-shadow-lg"
                />
              </div>
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-black text-shop_dark_green leading-tight tracking-tight text-center sm:text-left min-w-0 flex-1 -ml-1 sm:ml-0">
                <span className="whitespace-nowrap">LOA KÉO</span>{" "}
                <span className="text-shop_light_green whitespace-nowrap">
                  AN NHIÊN
                </span>
              </h1>
            </div>
            <p className="text-lg md:text-xl lg:text-2xl text-center text-shop_light_text font-medium max-w-md">
              Ráp và độ chế loa kéo theo yêu cầu
            </p>
            <div className="flex items-center gap-2 text-shop_light_green mt-2">
              <div className="w-12 h-0.5 bg-shop_light_green" />
              <span className="text-sm sm:text-base font-semibold">
                UY TÍN - CHẤT LƯỢNG
              </span>
              <div className="w-12 h-0.5 bg-shop_light_green" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
