"use client";
import Link from "next/link";
import React from "react";
import { Heart } from "lucide-react";
import { Product } from "@/sanity.types";
import useStore from "@/store";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth, SignInButton } from "@clerk/nextjs";

const FavoriteButton = ({
  showProduct = false,
  product,
}: {
  showProduct?: boolean;
  product?: Product | null | undefined;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const availableProduct = favoriteProduct?.find(
      (item) => item?._id === product?._id
    );
    setExistingProduct(availableProduct || null);
  }, [product, favoriteProduct]);

  const handleFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Kiểm tra đăng nhập trước khi thêm vào wishlist
    if (!isSignedIn) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào yêu thích");
      return;
    }

    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích"
        );
      });
    }
  };

  return (
    <>
      {!showProduct ? (
        <Link href={"/wishlist"} className="group relative">
          <Heart className="w-5 h-5 hover:text-shop_light_green hoverEffect" />
          <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
            {favoriteProduct?.length ? favoriteProduct?.length : 0}
          </span>
        </Link>
      ) : isSignedIn ? (
        <button
          onClick={handleFavorite}
          className="group relative hover:text-shop_light_green hoverEffect border border-shop_light_green/80 hover:border-shop_light_green p-1.5 rounded-sm"
        >
          {existingProduct ? (
            <Heart
              fill="#3b9c3c"
              className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect mt-.5 w-5 h-5"
            />
          ) : (
            <Heart className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect mt-.5 w-5 h-5" />
          )}
        </button>
      ) : (
        <SignInButton mode="modal">
          <button
            type="button"
            className="group relative hover:text-shop_light_green hoverEffect border border-shop_light_green/80 hover:border-shop_light_green p-1.5 rounded-sm"
          >
            <Heart className="text-shop_light_green/80 group-hover:text-shop_light_green hoverEffect mt-.5 w-5 h-5" />
          </button>
        </SignInButton>
      )}
    </>
  );
};

export default FavoriteButton;
