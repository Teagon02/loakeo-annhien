"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  maxVisiblePages?: number; // Số trang tối đa hiển thị
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  maxVisiblePages = 7,
}) => {
  // Tính toán các trang cần hiển thị
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      // Nếu tổng số trang ít hơn max, hiển thị tất cả
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Luôn hiển thị trang đầu
    pages.push(1);

    // Tính toán điểm bắt đầu và kết thúc
    let start = Math.max(2, currentPage - halfVisible);
    let end = Math.min(totalPages - 1, currentPage + halfVisible);

    // Điều chỉnh nếu gần đầu hoặc cuối
    if (currentPage <= halfVisible + 1) {
      end = maxVisiblePages - 1;
    }
    if (currentPage >= totalPages - halfVisible) {
      start = totalPages - maxVisiblePages + 2;
    }

    // Thêm dấu "..." nếu cần
    if (start > 2) {
      pages.push("...");
    }

    // Thêm các trang ở giữa
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Thêm dấu "..." nếu cần
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // Luôn hiển thị trang cuối
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null; // Không hiển thị nếu chỉ có 1 trang hoặc ít hơn
  }

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {/* Nút Previous */}
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="h-9 w-9 rounded-md"
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Các số trang */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-1 text-shop_light_text"
              >
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <Button
              key={pageNumber}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageClick(pageNumber)}
              className={cn(
                "h-9 min-w-9 px-3 rounded-md font-semibold transition-all",
                isActive
                  ? "bg-shop_btn_dark_green text-white hover:bg-shop_btn_dark_green shadow-md"
                  : "hover:bg-shop_light_bg hover:border-shop_dark_green"
              )}
              aria-label={`Trang ${pageNumber}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      {/* Nút Next */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="h-9 w-9 rounded-md"
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
