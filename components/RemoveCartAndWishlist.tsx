"use client";
import { useAuth } from "@clerk/nextjs";
import useStore from "@/store";
import { useEffect, useRef } from "react";

const RemoveCartAndWishlist = () => {
  const { userId, isSignedIn } = useAuth();
  const {
    resetCart,
    resetFavorite,
    loadCartFromServer,
    loadWishlistFromServer,
    saveCartToServer,
    saveWishlistToServer,
    items,
    favoriteProduct,
  } = useStore();

  const previousUserId = useRef<string | null | undefined>(null);
  const saveCartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveWishlistTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedRef = useRef(false);

  // Load cart và wishlist khi user đăng nhập hoặc đổi user
  useEffect(() => {
    if (isSignedIn && userId) {
      // Nếu đổi user, reset và load cart/wishlist mới
      if (previousUserId.current && previousUserId.current !== userId) {
        console.log("Phát hiện đổi tài khoản -> Load cart/wishlist mới");
        resetCart();
        resetFavorite();
        hasLoadedRef.current = false;
      }

      // Load cart và wishlist từ server nếu chưa load
      if (!hasLoadedRef.current) {
        loadCartFromServer();
        loadWishlistFromServer();
        hasLoadedRef.current = true;
      }
    } else {
      // Nếu không đăng nhập, reset cart/wishlist
      if (previousUserId.current) {
        resetCart();
        resetFavorite();
        hasLoadedRef.current = false;
      }
    }

    previousUserId.current = userId;
  }, [
    userId,
    isSignedIn,
    resetCart,
    resetFavorite,
    loadCartFromServer,
    loadWishlistFromServer,
  ]);

  // Auto-save cart khi có thay đổi (với debounce)
  useEffect(() => {
    // Chỉ save nếu user đã đăng nhập và đã load cart từ server
    if (!isSignedIn || !userId || !hasLoadedRef.current) return;

    // Clear timeout trước đó
    if (saveCartTimeoutRef.current) {
      clearTimeout(saveCartTimeoutRef.current);
    }

    // Set timeout mới để save sau 1 giây
    saveCartTimeoutRef.current = setTimeout(() => {
      saveCartToServer();
    }, 1000);

    // Cleanup
    return () => {
      if (saveCartTimeoutRef.current) {
        clearTimeout(saveCartTimeoutRef.current);
      }
    };
  }, [items, isSignedIn, userId, saveCartToServer]);

  // Auto-save wishlist khi có thay đổi (với debounce)
  useEffect(() => {
    // Chỉ save nếu user đã đăng nhập và đã load wishlist từ server
    if (!isSignedIn || !userId || !hasLoadedRef.current) return;

    // Clear timeout trước đó
    if (saveWishlistTimeoutRef.current) {
      clearTimeout(saveWishlistTimeoutRef.current);
    }

    // Set timeout mới để save sau 1 giây
    saveWishlistTimeoutRef.current = setTimeout(() => {
      saveWishlistToServer();
    }, 1000);

    // Cleanup
    return () => {
      if (saveWishlistTimeoutRef.current) {
        clearTimeout(saveWishlistTimeoutRef.current);
      }
    };
  }, [favoriteProduct, isSignedIn, userId, saveWishlistToServer]);

  return null;
};

export default RemoveCartAndWishlist;
