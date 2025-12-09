"use client";
import React from "react";
import { Product } from "@/sanity.types";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import useStore from "@/store";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

const AddToWishList = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const { isSignedIn } = useAuth();
  const { addToFavorite, removeFromFavorite, favoriteProduct } = useStore();
  const [existingProduct, setExistingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const availableProduct = favoriteProduct?.find(
      (item) => item._id === product._id
    );
    setExistingProduct(availableProduct || null);
  }, [product, favoriteProduct]);

  const handleFavorite = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Kiểm tra đăng nhập trước khi thêm vào wishlist
    if (!isSignedIn) {
      toast.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích");
      return;
    }

    if (product?._id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct
            ? "Đã xóa khỏi danh sách yêu thích "
            : "Đã thêm vào danh sách yêu thích"
        );
      });
    }
  };

  // Nếu chưa đăng nhập, chuyển đến trang wishlist
  if (!isSignedIn) {
    return (
      <div
        className={cn(
          "absolute top-2 right-2 z-10 hover:cursor-pointer",
          className
        )}
      >
        <Link href="/wishlist">
          <div className="p-2.5 rounded-full bg-white text-black hover:bg-shop_orange hoverEffect">
            <Heart size={15} />
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "absolute top-2 right-2 z-10 hover:cursor-pointer",
        className
      )}
    >
      <div
        onClick={handleFavorite}
        className={`p-2.5 rounded-full hover:bg-shop_orange hover:text-white hoverEffect ${existingProduct ? "bg-shop_orange text-white" : "bg-white"}`}
      >
        <Heart size={15} fill={existingProduct ? "white" : "none"} />
      </div>
    </div>
  );
};

export default AddToWishList;
