"use client";
import React from "react";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { ShoppingCart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import useStore from "@/store";
import { toast } from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface Props {
  product: Product | null | undefined;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useStore();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const itemCount = getItemCount(product?._id ?? "");

  const isOutOfStock = product?.stock === 0;

  const handlerAddToCart = () => {
    if (isOutOfStock) {
      toast.error(`${product?.name?.substring(0, 12)}... đã hết hàng`);
      return;
    }

    // Nếu là khách vãng lai, redirect đến trang buy-now
    if (!isSignedIn) {
      if (product?.slug?.current) {
        router.push(`/buy-now/${product.slug.current}`);
      } else {
        toast.error("Không tìm thấy thông tin sản phẩm");
      }
      return;
    }

    // Nếu đã đăng nhập, thêm vào giỏ hàng như bình thường
    if ((product?.stock as number) > itemCount) {
      addItem(product as Product);
      toast.success(
        `${product?.name?.substring(0, 12)}... đã được thêm vào giỏ hàng`
      );
    } else {
      toast.error(`${product?.name?.substring(0, 12)}... đã hết hàng`);
    }
  };
  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className="w-full text-sm">
          <div className="flex items-center justify-between">
            <span className="=text-xs text-darkColor/80">Số lượng:</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="font-semibold text-xs">Tạm tính:</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={() => {
            handlerAddToCart();
          }}
          disabled={isOutOfStock}
          className={cn(
            "w-full bg-shop_btn_dark_green/80 text-shop_light_bg shadow-none border border-shop_dark_green/80 font-semibold tracking-wide hover:text-white hover:bg-shop_dark_green hover:border-shop_dark_green hoverEffect",
            className
          )}
        >
          {isSignedIn ? (
            <>
              <ShoppingCart /> {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
            </>
          ) : (
            <>
              <Zap /> {isOutOfStock ? "Hết hàng" : "Mua ngay"}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
