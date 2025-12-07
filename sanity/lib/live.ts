// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;
if (!token) {
  throw new Error("SANITY_API_READ_TOKEN is not set");
}
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  fetchOptions: {
    // Cache 60 giây - cân bằng giữa fresh data và performance
    // Có thể tăng lên 300 (5 phút) hoặc 3600 (1 giờ) tùy nhu cầu
    revalidate: 60,
  },
});
