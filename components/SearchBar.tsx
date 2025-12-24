"use client";

import { Search, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import PriceView from "./PriceView";

const SearchBar = () => {
  const searchParams = useSearchParams();
  const searchParamFromUrl = searchParams?.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchParamFromUrl);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useRef<NodeJS.Timeout | undefined>(undefined);
  const cacheRef = useRef<
    Map<string, { suggestions: string[]; products: Product[] }>
  >(new Map());
  const isUserTypingRef = useRef(false);
  const isSearchingRef = useRef(false);

  // Đồng bộ searchInput với URL khi component mount hoặc URL thay đổi từ bên ngoài
  useEffect(() => {
    const urlSearchValue = searchParams?.get("search") || "";
    // Chỉ sync khi URL thay đổi từ bên ngoài, không sync khi user đang gõ
    if (!isUserTypingRef.current && urlSearchValue !== searchInput) {
      setSearchInput(urlSearchValue);
      // Đóng suggestions khi URL thay đổi (sau khi search hoặc navigate)
      setShowSuggestions(false);
      // Reset flag search sau khi URL đã thay đổi
      isSearchingRef.current = false;
    }
  }, [searchParams]);

  // Fetch suggestions và products khi searchInput thay đổi
  useEffect(() => {
    if (debouncedSearch.current) {
      clearTimeout(debouncedSearch.current);
    }

    const trimmedInput = searchInput.trim();

    // Minimum 2 ký tự để tìm kiếm
    if (!trimmedInput || trimmedInput.length < 2) {
      setSuggestions([]);
      setSuggestedProducts([]);
      setShowSuggestions(false);
      return;
    }

    // Kiểm tra cache trước
    const cacheKey = trimmedInput.toLowerCase();
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setSuggestions(cached.suggestions);
      setSuggestedProducts(cached.products);
      // Chỉ hiển thị suggestions nếu không đang trong quá trình search
      if (!isSearchingRef.current) {
        setShowSuggestions(true);
      }
      return;
    }

    debouncedSearch.current = setTimeout(async () => {
      isUserTypingRef.current = false; // Reset flag sau khi debounce
      try {
        const searchPattern = `*${trimmedInput}*`;

        // Gộp thành 1 query duy nhất để tối ưu hiệu năng
        // match operator trong Sanity đã case-insensitive, không cần lower()
        const combinedQuery = `*[_type == "product" && name match $searchPattern && defined(slug.current)] | order(name asc) [0...10] {
            ...,
            "categories": categories[]->title
          }`;

        const productsData = await client.fetch(
          combinedQuery,
          {
            searchPattern,
          },
          { next: { revalidate: 60 } } // Cache 60 giây
        );

        // Extract keywords từ products (5 keywords đầu tiên)
        const uniqueKeywords = Array.from(
          new Set(
            productsData
              .map((p: Product) => p.name)
              .filter(Boolean)
              .slice(0, 5)
          )
        ) as string[];

        // Lấy 5 sản phẩm đầu tiên
        const products = (productsData || []).slice(0, 5);

        // Lưu vào cache (giới hạn cache size để tránh memory leak)
        if (cacheRef.current.size > 50) {
          const firstKey = cacheRef.current.keys().next().value;
          if (firstKey) {
            cacheRef.current.delete(firstKey);
          }
        }
        cacheRef.current.set(cacheKey, {
          suggestions: uniqueKeywords,
          products: products,
        });

        setSuggestions(uniqueKeywords);
        setSuggestedProducts(products);
        // Chỉ hiển thị suggestions nếu không đang trong quá trình search
        if (!isSearchingRef.current) {
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions", error);
        setSuggestions([]);
        setSuggestedProducts([]);
      }
    }, 300);

    return () => {
      if (debouncedSearch.current) {
        clearTimeout(debouncedSearch.current);
      }
    };
  }, [searchInput]);

  // Đóng suggestions khi click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (keyword?: string) => {
    isUserTypingRef.current = false; // Reset flag khi submit
    isSearchingRef.current = true; // Đánh dấu đang trong quá trình search
    const trimmedValue = keyword || searchInput.trim();
    if (trimmedValue) {
      router.push(`/shop?search=${encodeURIComponent(trimmedValue)}`);
      setShowSuggestions(false);
    } else {
      router.push("/shop");
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (keyword: string) => {
    isUserTypingRef.current = false;
    isSearchingRef.current = true; // Đánh dấu đang trong quá trình search
    setShowSuggestions(false); // Đóng suggestions ngay lập tức
    setSearchInput(keyword);
    handleSearch(keyword);
  };

  return (
    <div
      ref={searchRef}
      className="flex-1 max-w-md md:max-w-full mx-2 md:mx-4 relative"
    >
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none z-10" />
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchInput}
            onChange={(e) => {
              isUserTypingRef.current = true;
              isSearchingRef.current = false; // Reset flag khi user bắt đầu gõ
              setSearchInput(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              isSearchingRef.current = false; // Reset flag khi focus vào input
              if (suggestions.length > 0 || suggestedProducts.length > 0) {
                setShowSuggestions(true);
              }
            }}
            className="w-full touch-manipulation pl-10 pr-10 h-9 text-base md:text-sm border-0 hover:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
          />
          {searchInput && (
            <button
              onClick={() => {
                isUserTypingRef.current = false;
                isSearchingRef.current = false; // Reset flag khi xóa input
                setSearchInput("");
                setSuggestions([]);
                setSuggestedProducts([]);
                setShowSuggestions(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
        <div className="w-px h-6 bg-gray-300"></div>
        <Button
          onClick={() => handleSearch()}
          className="h-9 px-4 bg-white text-shop_light_green hover:bg-shop_light_green/30 shrink-0 border-0 shadow-none rounded-none"
        >
          Tìm kiếm
        </Button>
      </div>

      {/* Dropdown Suggestions */}
      {showSuggestions &&
        (suggestions.length > 0 || suggestedProducts.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
            {/* Từ khóa gợi ý */}
            {suggestions.length > 0 && (
              <div className="p-2 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-500 mb-2 px-2">
                  Từ khóa gợi ý
                </p>
                <div className="space-y-1">
                  {suggestions.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(keyword)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
                    >
                      <Search className="w-3 h-3 text-gray-400" />
                      <span>{keyword}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sản phẩm gợi ý */}
            {suggestedProducts.length > 0 && (
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-500 mb-2 px-2">
                  Sản phẩm liên quan
                </p>
                <div className="space-y-1">
                  {suggestedProducts.map((product) => (
                    <Link
                      key={product._id}
                      href={`/product/${product.slug?.current}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-md transition-colors group"
                    >
                      {product.images && product.images[0] && (
                        <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={urlFor(product.images[0])
                              .width(96)
                              .height(96)
                              .quality(85)
                              .format("webp")
                              .url()}
                            alt={product.name || "Sản phẩm"}
                            fill
                            sizes="48px"
                            unoptimized
                            className="object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-shop_light_green transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="mt-1">
                          <PriceView
                            price={product.price as number}
                            discount={product.discount as number}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default SearchBar;
