import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

// Helper function để tối ưu ảnh với Sanity CDN (tránh Next.js Image Optimization)
// Sử dụng khi muốn tối ưu chi phí trên Vercel
export const urlForOptimized = (
  source: SanityImageSource,
  width?: number,
  height?: number,
  quality: number = 85
) => {
  let imageBuilder = builder.image(source);
  
  if (width) imageBuilder = imageBuilder.width(width);
  if (height) imageBuilder = imageBuilder.height(height);
  
  return imageBuilder.quality(quality);
}

// Helper function để build URL với width, quality và format WebP
// Sử dụng thay vì loader prop trong Client Components
export const urlForWithParams = (
  source: SanityImageSource,
  width: number,
  quality: number = 85
) => {
  // Giới hạn maxWidth để tránh ảnh quá lớn
  const absoluteMaxWidth = 1920;
  const optimizedWidth = Math.min(width, absoluteMaxWidth);
  
  return builder
    .image(source)
    .width(optimizedWidth)
    .quality(quality)
    .format('webp')
    .url();
}
