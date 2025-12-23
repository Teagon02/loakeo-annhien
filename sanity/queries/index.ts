import { sanityFetch } from "../lib/live";
import {
  LATEST_BLOGS_QUERY,
  MY_ORDERS_QUERY,
  DEAL_PRODUCTS_QUERY,
  PAGINATED_DEAL_PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  BLOG_BY_SLUG_QUERY,
  ALL_BLOGS_QUERY,
  PAGINATED_BLOGS_QUERY,
} from "./query";

const getCategories = async (quantity?: number) => {
  try {
    const query = quantity
      ? `*[_type == "category"] | order(name asc) [0...$quantity] {...,
    "productCount": count(*[_type == "product" && references(^._id)])
    }`
      : `*[_type == "category"] | order(name asc){
      ...,
      "productCount": count(*[_type == "product" && references(^._id)])
      }`;
    const { data } = await sanityFetch({
      query,
      params: quantity ? { quantity } : {},
    });
    return data;
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
  }
};

const getLatestBlogs = async (quantity?: number) => {
  try {
    const { data } = await sanityFetch({
      query: LATEST_BLOGS_QUERY,
    });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching latest blogs", error);
    return [];
  }
};

const getDealProducts = async () => {
  try {
    const { data } = await sanityFetch({
      query: DEAL_PRODUCTS_QUERY,
    });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching deal products", error);
    return [];
  }
};

const getProductBySlug = async (slug: string) => {
  try {
    const product = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });
    return product.data ?? null;
  } catch (error) {
    console.error("Error fetching product by slug", error);
    return null;
  }
};

const getMyOrders = async (userId: string) => {
  try {
    if (!userId) {
      console.warn("getMyOrders: userId is missing");
      return [];
    }
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });
    console.log("getMyOrders: fetched orders count:", orders.data?.length || 0);
    return orders.data || [];
  } catch (error) {
    console.error("Error fetching my orders", error);
    return [];
  }
};

const getBlogBySlug = async (slug: string) => {
  try {
    const blog = await sanityFetch({
      query: BLOG_BY_SLUG_QUERY,
      params: { slug },
    });
    return blog.data ?? null;
  } catch (error) {
    console.error("Error fetching blog by slug", error);
    return null;
  }
};

const getAllBlogs = async () => {
  try {
    const { data } = await sanityFetch({
      query: ALL_BLOGS_QUERY,
    });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching all blogs", error);
    return [];
  }
};

const getPaginatedBlogs = async (page: number = 1, pageSize: number = 6) => {
  try {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const { data } = await sanityFetch({
      query: PAGINATED_BLOGS_QUERY,
      params: { start, end },
    });
    return {
      blogs: data?.blogs ?? [],
      total: data?.total ?? 0,
    };
  } catch (error) {
    console.error("Error fetching paginated blogs", error);
    return {
      blogs: [],
      total: 0,
    };
  }
};

const getPaginatedDealProducts = async (
  page: number = 1,
  pageSize: number = 20
) => {
  try {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const { data } = await sanityFetch({
      query: PAGINATED_DEAL_PRODUCTS_QUERY,
      params: { start, end },
    });
    return {
      products: data?.products ?? [],
      total: data?.total ?? 0,
    };
  } catch (error) {
    console.error("Error fetching paginated deal products", error);
    return {
      products: [],
      total: 0,
    };
  }
};

export {
  getCategories,
  getLatestBlogs,
  getDealProducts,
  getPaginatedDealProducts,
  getProductBySlug,
  getMyOrders,
  getBlogBySlug,
  getAllBlogs,
  getPaginatedBlogs,
};
