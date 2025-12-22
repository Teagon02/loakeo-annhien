import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import NoAccess from "@/components/NoAccess";
import WishListProducts from "@/components/WishListProducts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sản phẩm yêu thích - Loa Kéo An Nhiên",
  description: "Sản phẩm yêu thích - Loa Kéo An Nhiên",
};

const WishlistPage = async () => {
  const user = await currentUser();
  return (
    <>
      {user ? (
        <WishListProducts />
      ) : (
        <NoAccess details="Đăng nhập để xem danh sách yêu thích của bạn. Đừng bỏ lỡ những sản phẩm tuyệt vời nhé!" />
      )}
    </>
  );
};

export default WishlistPage;
