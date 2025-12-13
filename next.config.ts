import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // Giới hạn các kích thước ảnh có thể để tối ưu
    // Next.js sẽ chỉ tạo ảnh với các kích thước này
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Configure webpack to handle Sanity better
  webpack: (config, { isServer }) => {
    // Exclude Sanity from server-side bundle if needed
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // External packages for server components
  serverExternalPackages: ["sanity"],
};

export default nextConfig;
