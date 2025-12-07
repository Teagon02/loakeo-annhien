"use client";
import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

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

  return (
    <div className="w-full md:w-1/2 flex flex-col gap-1.5">
      <AnimatePresence mode="wait">
        <motion.div
          key={active?._key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-h-[550px] min-h-[400px] border border-darkColor/10 rounded-md group overflow-hidden"
        >
          <Image
            src={urlFor(active).url()}
            alt="Ảnh sản phẩm"
            width={700}
            height={700}
            priority
            className={`w-full h-96 max-h-[550px] min-h-[500px] object-contain group-hover:scale-110 hoverEffect rounded-md ${isStock === 0 ? "opacity-50" : ""}`}
          />
        </motion.div>
      </AnimatePresence>
      <div className="grid grid-cols-6 gap-2 h-20 md:h-24">
        {images?.map((image) => (
          <button
            key={image?._key}
            onClick={() => setActive(image)}
            className={`border rounded-md overflow-hidden ${active?._key === image?._key ? " border-darkColor opacity-100" : "opacity-70"}`}
          >
            <Image
              src={urlFor(image).url()}
              alt={`Ảnh sản phẩm ${image?._key}`}
              width={100}
              height={100}
              className="w-full h-auto object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageView;
