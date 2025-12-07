"use client";
import React, { useState } from "react";
import useStore from "@/store";
import Container from "./Container";
import { Heart, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Product } from "@/sanity.types";
import { toast } from "react-hot-toast";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();
  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteProduct.length));
  };

  return (
    <Container>
      {favoriteProduct.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b">
                <tr className="bg-black/5">
                  <th className="p-2 text-left">Ảnh</th>
                  <th className="p-2 text-left hidden md:table-cell">
                    Danh mục
                  </th>
                  <th className="p-2 text-left">Giá</th>
                  <th className="p-2 text-left hidden md:table-cell">
                    Trạng thái
                  </th>
                  <th className="p-2 text-center md:text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {favoriteProduct
                  .slice(0, visibleProducts)
                  .map((product: Product) => (
                    <tr key={product._id} className="border-b">
                      <td className="px-2 py-4 flex items-center gap-2">
                        <X
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromFavorite(product?._id as string);
                            toast.success("Đã xóa khỏi danh sách yêu thích");
                          }}
                          size={18}
                          className="hover:text-red-600 hover:cursor-pointer hoverEffect shrink-0"
                        />
                        {product?.images && (
                          <Link
                            href={`/product/${product?.slug?.current}`}
                            className="border rounded-md group shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Image
                              src={urlFor(product?.images[0]).url()}
                              alt="Ảnh sản phẩm"
                              width={80}
                              height={80}
                              className="rounded-md group-hover:scale-105 hoverEffect h-16 w-16 sm:h-20 sm:w-20 object-contain"
                            />
                          </Link>
                        )}
                        <Link
                          href={`/product/${product?.slug?.current}`}
                          className=" hover:text-shop_light_green transition-colors flex-1 min-w-0"
                        >
                          {product?.name}
                        </Link>
                      </td>
                      <td className="p-2 capitalize hidden md:table-cell">
                        {product?.categories && (
                          <p className="uppercase line-clamp-1 text-xs font-medium">
                            {product?.categories
                              .map((category) => {
                                // Xử lý cả string và object
                                if (typeof category === "string") {
                                  return category;
                                }
                                // Nếu là object, lấy title hoặc name
                                const categoryObj = category as
                                  | { title?: string; name?: string }
                                  | string;
                                if (
                                  typeof categoryObj === "object" &&
                                  categoryObj !== null
                                ) {
                                  return (
                                    categoryObj.title ||
                                    categoryObj.name ||
                                    String(category)
                                  );
                                }
                                return String(category);
                              })
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </td>
                      <td className="p-2">
                        <PriceFormatter amount={product?.price as number} />
                      </td>
                      <td
                        className={`p-2 w-24 ${(product?.stock as number) > 0 ? "text-green-600" : "text-red-600"} font-medium text-sm hidden md:table-cell`}
                      >
                        {(product?.stock as number) > 0
                          ? "Còn hàng"
                          : "Hết hàng"}
                      </td>
                      <td className="p-2">
                        <AddToCartButton product={product} className="w-36" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* Xem thêm sản phẩm */}
          <div className="flex items-center justify-center gap-2">
            {visibleProducts < favoriteProduct.length && (
              <div className="my-5">
                <Button variant="outline" onClick={loadMore}>
                  Xem thêm
                </Button>
              </div>
            )}
            {visibleProducts > 10 && (
              <div className="my-5">
                <Button
                  variant="outline"
                  onClick={() => setVisibleProducts(visibleProducts - 5)}
                >
                  Ẩn bớt
                </Button>
              </div>
            )}
          </div>
          {/* Reset danh sách yêu thích */}
          {favoriteProduct.length > 0 && (
            <div className="my-5">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="font-semibold"
                  >
                    Reset danh sách yêu thích
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Bạn có chắc chắn muốn xoá tất cả sản phẩm khỏi danh sách
                      yêu thích?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Hành động này không thể hoàn tác. Điều này sẽ xóa tất cả
                      sản phẩm khỏi danh sách yêu thích của bạn.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={resetFavorite}>
                      Xoá
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-muted-foreground/20" />
            <Heart
              className="h-12 w-12 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Danh sách yêu thích của bạn đang trống
            </h2>
            <p className="text-sm text-muted-foreground">
              Các sản phẩm bạn yêu thích sẽ hiển thị ở đây.
            </p>
          </div>
          <Button asChild>
            <Link href="/shop">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WishListProducts;
