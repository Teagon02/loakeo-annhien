"use client";
import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset"; // eslint-disable-line @typescript-eslint/no-explicit-any
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  isStock?: number | undefined;
}

const ImageView = ({ images = [], isStock = undefined }: Props) => {
  const [active, setActive] = useState(images[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const nextImage = () => {
    if (images && images.length > 0) {
      setFullscreenIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images && images.length > 0) {
      setFullscreenIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swipe left - next image
      nextImage();
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous image
      prevImage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentFullscreenImage = images?.[fullscreenIndex];

  return (
    <>
      <div className="w-full md:w-1/2 flex flex-col gap-1.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?._key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-h-[550px] min-h-[400px] border border-darkColor/10 rounded-md group overflow-hidden relative"
          >
            <Image
              src={urlFor(active).url()}
              alt="Ảnh sản phẩm"
              width={700}
              height={700}
              priority
              className={`w-full h-96 max-h-[550px] min-h-[500px] object-contain group-hover:scale-110 hoverEffect rounded-md ${isStock === 0 ? "opacity-50" : ""}`}
            />
            <button
              onClick={() => {
                const currentIndex = images?.findIndex(
                  (img) => img?._key === active?._key
                );
                if (currentIndex !== undefined && currentIndex !== -1) {
                  openFullscreen(currentIndex);
                }
              }}
              className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 active:bg-black/80 text-white p-2 md:p-2.5 rounded-full transition-all opacity-100 hoverEffect z-10 touch-manipulation"
              aria-label="Phóng to ảnh"
            >
              <Maximize2 size={18} className="md:w-5 md:h-5" />
            </button>
          </motion.div>
        </AnimatePresence>
        <div className="grid grid-cols-6 gap-2 h-20 md:h-24">
          {images?.map((image, index) => (
            <button
              key={image?._key}
              onClick={() => setActive(image)}
              className={`border rounded-md overflow-hidden relative group/thumb ${active?._key === image?._key ? " border-darkColor opacity-100" : "opacity-70"}`}
            >
              <Image
                src={urlFor(image).url()}
                alt={`Ảnh sản phẩm ${image?._key}`}
                width={100}
                height={100}
                className="w-full h-auto object-contain"
              />
              {active?._key === image?._key ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openFullscreen(index);
                  }}
                  className="absolute inset-0 bg-black/40 hover:bg-black/60 active:bg-black/70 text-white flex items-center justify-center transition-all opacity-100 hoverEffect touch-manipulation"
                  aria-label="Phóng to ảnh"
                >
                  <Maximize2 size={14} className="md:w-4 md:h-4" />
                </button>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && currentFullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeFullscreen}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 md:top-4 md:right-4 text-white hover:text-gray-300 active:text-gray-400 p-2.5 md:p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-all z-10 touch-manipulation"
              aria-label="Đóng"
            >
              <X size={28} className="md:w-8 md:h-8" />
            </button>

            {/* Navigation Buttons */}
            {images && images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 md:left-4 text-white hover:text-gray-300 active:text-gray-400 p-3 md:p-3 rounded-full hover:bg-white/10 active:bg-white/20 transition-all z-10 touch-manipulation"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft size={28} className="md:w-8 md:h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 md:right-4 text-white hover:text-gray-300 active:text-gray-400 p-3 md:p-3 rounded-full hover:bg-white/10 active:bg-white/20 transition-all z-10 touch-manipulation"
                  aria-label="Ảnh sau"
                >
                  <ChevronRight size={28} className="md:w-8 md:h-8" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={urlFor(currentFullscreenImage).url()}
                alt="Ảnh sản phẩm full màn hình"
                width={1200}
                height={1200}
                className="max-w-full max-h-full object-contain"
                priority
              />
            </motion.div>

            {/* Image Counter */}
            {images && images.length > 1 && (
              <div className="absolute bottom-4 md:bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs md:text-sm bg-black/50 px-3 md:px-4 py-1.5 md:py-2 rounded-full">
                {fullscreenIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageView;
