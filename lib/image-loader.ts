// Custom loader cho Next.js Image component
// Nhận src là URL string từ Sanity và optimize với width/quality
export default function sanityLoader({
  src,
  width,
  quality = 85,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Nếu src là URL từ Sanity CDN, thêm query params để optimize
  if (src.includes("cdn.sanity.io")) {
    try {
      const url = new URL(src);

      // Next.js tự động scale width dựa trên DPR (Device Pixel Ratio)
      // Cách tốt nhất: Cho phép scale hợp lý để đảm bảo chất lượng trên Retina
      // nhưng giới hạn maxWidth để tránh ảnh quá lớn không cần thiết

      // Next.js đã tự tính toán width dựa trên DPR và responsive breakpoints
      // Ta chỉ cần giới hạn maxWidth để tránh ảnh quá lớn
      // Ví dụ: width={700} trên DPR=2 → width = 1400 (OK)
      //        width={700} trên DPR=3 → width = 2100 → giới hạn ở 1920
      const absoluteMaxWidth = 1920; // Giới hạn tuyệt đối (phù hợp với màn hình Full HD)
      const optimizedWidth = Math.min(width, absoluteMaxWidth);

      // Thêm hoặc cập nhật query params
      url.searchParams.set("w", optimizedWidth.toString());
      url.searchParams.set("q", quality.toString());
      url.searchParams.set("fm", "webp"); // Format WebP để giảm kích thước
      return url.toString();
    } catch (error) {
      console.warn("Error processing Sanity image URL:", error);
      return src;
    }
  }

  // Nếu không phải URL Sanity, trả về nguyên src
  return src;
}
