"use client";

import { Search, Loader2, X } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import sanityLoader from "@/lib/image-loader";
import Link from "next/link";
import PriceView from "./PriceView";

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSuggested, setLoadingSuggested] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch suggested products when dialog opens
  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      if (!open) return;

      setLoadingSuggested(true);
      try {
        // Fetch suggested products: featured, hot, new, or latest products
        // Priority: featured > hot/new status > recently created
        const query = `*[_type == "product" && defined(slug.current)] | order(
          isFeatured desc,
          _createdAt desc
        ) [0...5] {
          ...,
          "categories": categories[]->title
        }`;

        const data = await client.fetch(query);
        setSuggestedProducts(data || []);
      } catch (error) {
        console.error("Error fetching suggested products:", error);
        setSuggestedProducts([]);
      } finally {
        setLoadingSuggested(false);
      }
    };

    fetchSuggestedProducts();
  }, [open]);

  // Search products
  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedTerm.trim()) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        // Use parameterized query for safety
        const searchPattern = `*${debouncedTerm}*`;
        const searchPatternLower = `*${debouncedTerm.toLowerCase()}*`;
        const query = `*[_type == "product" && (lower(name) match $searchPatternLower || name match $searchPattern) && defined(slug.current)] | order(name asc) [0...10] {
          ...,
          "categories": categories[]->title
        }`;

        const data = await client.fetch(query, {
          searchPattern,
          searchPatternLower,
        });

        setProducts(data || []);
      } catch (error) {
        console.error("Error searching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [debouncedTerm]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearchTerm("");
    setProducts([]);
    setSuggestedProducts([]);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Input search bar - Desktop & Mobile */}
      <div className="relative flex-1 max-w-md mx-2 md:mx-4 group">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-shop_light_green transition-colors" />
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setOpen(true)}
            className="w-full pl-10 pr-10 h-9 text-sm border-gray-300 hover:border-shop_light_green focus-visible:ring-1 focus-visible:ring-shop_light_green transition-colors hoverEffect"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setProducts([]);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          {loading && !searchTerm && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 text-shop_light_green animate-spin" />
            </div>
          )}
        </div>
      </div>
      <DialogContent className="max-w-2xl w-[calc(100%-2rem)] p-0 gap-0 max-h-[85vh] flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Tìm kiếm sản phẩm</DialogTitle>
        </DialogHeader>
        {/* Search Input Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-12 bg-transparent"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Xóa tìm kiếm"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              {loading && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-shop_light_green animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4">
            {!debouncedTerm.trim() ? (
              loadingSuggested ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-shop_light_green animate-spin mb-4" />
                  <p className="text-gray-500 text-sm">Đang tải sản phẩm...</p>
                </div>
              ) : suggestedProducts.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sản phẩm gợi ý
                    </p>
                    <p className="text-xs text-gray-500">
                      {suggestedProducts.length} sản phẩm
                    </p>
                  </div>
                  <div className="space-y-2">
                    {suggestedProducts.map((product) => (
                      <Link
                        key={product._id}
                        href={`/product/${product.slug?.current}`}
                        onClick={handleClose}
                        className="group flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-shop_light_green hover:bg-shop_light_bg/50 transition-all duration-200"
                      >
                        {/* Product Image */}
                        {product.images && product.images[0] && (
                          <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-md overflow-hidden bg-shop_light_bg">
                            <Image
                              src={urlFor(product.images[0]).url()}
                              alt={product.name || "Sản phẩm"}
                              loader={sanityLoader}
                              fill
                              sizes="(max-width: 768px) 64px, 80px"
                              className="object-contain group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        )}

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-100 group-hover:text-shop_light_green transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          {product.categories &&
                            product.categories.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {product.categories.join(", ")}
                              </p>
                            )}
                          <div className="mt-2">
                            <PriceView
                              price={product.price as number}
                              discount={product.discount as number}
                              className="text-sm"
                            />
                          </div>
                        </div>

                        {/* Stock Status */}
                        <div className="shrink-0">
                          {product.stock === 0 ? (
                            <span className="text-xs font-bold bg-gray-100 text-red-600 rounded-md px-2 py-1">
                              Hết hàng
                            </span>
                          ) : (
                            <span className="text-xs font-bold bg-gray-100 text-green-600 rounded-md px-2 py-1">
                              Có sẵn
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-shop_light_bg flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Nhập từ khóa để tìm kiếm sản phẩm
                  </p>
                </div>
              )
            ) : loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-shop_light_green animate-spin mb-4" />
                <p className="text-gray-500 text-sm">Đang tìm kiếm...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-shop_light_bg flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-1">
                  Không tìm thấy sản phẩm
                </p>
                <p className="text-gray-500 text-sm">
                  Thử tìm kiếm với từ khóa khác
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 mb-3">
                  Tìm thấy {products.length} sản phẩm
                </p>
                <div className="space-y-2">
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      href={`/product/${product.slug?.current}`}
                      onClick={handleClose}
                      className="group flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-shop_light_green hover:bg-shop_light_bg/50 transition-all duration-200"
                    >
                      {/* Product Image */}
                      {product.images && product.images[0] && (
                        <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-md overflow-hidden bg-shop_light_bg">
                          <Image
                            src={urlFor(product.images[0]).url()}
                            alt={product.name || "Sản phẩm"}
                            loader={sanityLoader}
                            fill
                            sizes="(max-width: 768px) 64px, 80px"
                            className="object-contain group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-100 group-hover:text-shop_light_green transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        {product.categories &&
                          product.categories.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {product.categories.join(", ")}
                            </p>
                          )}
                        <div className="mt-2">
                          <PriceView
                            price={product.price as number}
                            discount={product.discount as number}
                            className="text-sm"
                          />
                        </div>
                      </div>

                      {/* Stock Status */}
                      <div className="shrink-0">
                        {product.stock === 0 ? (
                          <span className="text-xs text-red-600 font-medium">
                            Hết hàng
                          </span>
                        ) : (
                          <span className="text-xs text-shop_light_green font-medium">
                            Còn hàng
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SearchBar;
