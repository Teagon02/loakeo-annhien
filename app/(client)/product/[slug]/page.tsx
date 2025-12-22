import React from "react";
import { getProductBySlug } from "@/sanity/queries";
import Container from "@/components/Container";
import ImageView from "@/components/ImageView";
import { StarIcon } from "lucide-react";
import PriceView from "@/components/PriceView";
import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import { CornerDownLeft, Truck, PlayCircle } from "lucide-react";
import { MdPriceChange } from "react-icons/md";
import Link from "next/link";
import type { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Hàm extract YouTube video ID từ URL
const getYouTubeVideoId = (url: string | undefined): string | null => {
  if (!url) return null;

  // Nếu chỉ là ID (không có URL)
  if (
    !url.includes("youtube.com") &&
    !url.includes("youtu.be") &&
    !url.includes("/")
  ) {
    return url;
  }

  // Pattern cho các format YouTube URL
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// ISR: Revalidate mỗi giờ để giảm API calls nhưng vẫn có data mới
export const revalidate = 3600;

// Dynamic metadata theo từng sản phẩm
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
      description: "Sản phẩm bạn tìm không còn tồn tại hoặc đã bị xoá.",
    };
  }

  const name = product.name || "Sản phẩm";
  const description =
    product.description ||
    `Mua ${name} chất lượng cao tại Loa Kéo An Nhiên. Giá cả hợp lý, giao hàng toàn quốc.`;

  return {
    title: name + " - Loa Kéo An Nhiên",
    description: description + " - Loa Kéo An Nhiên",
    openGraph: {
      title: name + " - Loa Kéo An Nhiên",
      description: description + " - Loa Kéo An Nhiên",
      type: "website",
      images: [
        urlFor(product?.images?.[0] as SanityImageSource)
          .width(1200)
          .quality(85)
          .format("webp")
          .url(),
      ],
    },
  };
}

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const youtubeVideoId = getYouTubeVideoId(product?.linkYoutube);

  return (
    <Container className="flex flex-col gap-10 py-10">
      {/* Hình ảnh sản phẩm và thông tin */}
      <div className="flex flex-col md:flex-row gap-10">
        {product?.images && (
          <ImageView images={product?.images} isStock={product?.stock} />
        )}
        {/* Thông tin sản phẩm */}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          {/* Tên sản phẩm & mô tả & đánh giá */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{product?.name}</h2>
            <p className="text-sm text-gray-600 tracking-wide">
              {product?.description}
            </p>
            <div className="flex items-center gap-0.5 text-xs">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  size={12}
                  key={index}
                  className="text-shop_lighter_green"
                  fill="#ffd700"
                />
              ))}
              {/* <p className="font-semibold">{`(120)`}</p> */}
            </div>
          </div>

          {/* Giá & tình trạng sản phẩm */}
          <div className="space-y-2 border-t border-b border-gray-200 py-5 ">
            <div className="flex items-center gap-2.5">
              <PriceView
                price={product?.price as number}
                discount={product?.discount as number}
                className="text-lg font-bold"
              />
              {product?.discount ? (
                <span className="text-xs font-semibold text-shop_orange border border-shop_orange/60 px-2 py-0.5 rounded-full shrink-0">
                  Giảm -{product.discount}%
                </span>
              ) : null}
            </div>
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-linear-to-r from-shop_dark_green/80 to-shop_btn_dark_green/80 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Đã bao gồm phí vận chuyển
            </span>
            <p
              className={`block w-fit px-4 py-1.5 text-sm text-center font-semibold rounded-lg ${product?.stock === 0 ? "bg-red-100 text-red-600" : "text-green-600 bg-green-100"}`}
            >{`${(product?.stock as number) > 0 ? "Có sẵn" : "Hết hàng"}`}</p>
          </div>

          {/* Thêm vào giỏ & yêu thích */}
          <div className="flex items-center gap-2.5 lg:gap-3">
            <AddToCartButton product={product} />
            <FavoriteButton showProduct={true} product={product} />
          </div>

          {/* Giao hàng toàn quốc & Đổi trả miễn phí */}
          <div className="flex flex-col">
            <div className="border border-lightColor/25 border-b-0 p-3 flex items-center gap-2.5">
              <Truck size={30} className="text-shop_orange" />
              <div>
                <p className="text-base font-semibold text-black">
                  Giao hàng toàn quốc
                </p>
                <p className="text-sm text-gray-500 ">
                  Giao hàng toàn quốc trong vòng 3-5 ngày.
                </p>
              </div>
            </div>
            <div className="border border-lightColor/25 p-3 flex items-center gap-2.5">
              <CornerDownLeft size={30} className="text-shop_orange" />
              <div>
                <p className="text-base font-semibold text-black">
                  Đổi trả miễn phí
                </p>
                <p className="text-sm text-gray-500 ">
                  Đổi trả miễn phí trong vòng 7 ngày.{" "}
                </p>
              </div>
            </div>
            <div className="border border-lightColor/25 p-3 flex items-center gap-2.5">
              <MdPriceChange size={30} className="text-shop_orange" />
              <div>
                <p className="text-base font-semibold text-black">
                  Giá cả hợp lý
                </p>
                <p className="text-sm text-gray-500 ">
                  Giá cả hợp lý và phù hợp với mọi đối tượng khách hàng.{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col"></div>
        </div>
      </div>

      {/* YouTube Video Review */}
      {youtubeVideoId ? (
        <div className="w-full space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 rounded-full p-2">
              <PlayCircle className="w-5 h-5 text-white" fill="white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Video đánh giá sản phẩm
            </h3>
          </div>
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          {product?.linkYoutube && (
            <div className="text-center">
              <Link
                href={product.linkYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-red-600 hover:text-red-700 hover:underline transition-colors inline-flex items-center gap-1"
              >
                Xem trên YouTube
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-400 rounded-full p-2">
              <PlayCircle className="w-5 h-5 text-white" fill="white" />
            </div>
            <h3 className="text-xl font-bold text-gray-600">
              Video đánh giá sản phẩm
            </h3>
          </div>
          <div
            className="relative w-full bg-gray-100 rounded-lg"
            style={{ paddingBottom: "56.25%" }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <PlayCircle className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg font-semibold">Chưa có video đánh giá</p>
              <p className="text-sm mt-2">
                Video đánh giá sản phẩm này sẽ được cập nhật sớm
              </p>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default SingleProductPage;
