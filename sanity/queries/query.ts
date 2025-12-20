import { defineQuery } from "next-sanity";

const LATEST_BLOGS_QUERY = defineQuery(
  `*[_type == "blog" && isLatest == true] | order(name desc) {
  ...,
  blogcategories[]->{
  title
  }
  }`
);

const DEAL_PRODUCTS_QUERY = defineQuery(
  `*[_type == 'product' && status == 'hot'] | order(name asc){
    ...,"categories": categories[]->title
  }`
);

const PAGINATED_DEAL_PRODUCTS_QUERY = defineQuery(
  `{
    "products": *[_type == 'product' && status == 'hot'] | order(name asc) [$start...$end] {
      ...,"categories": categories[]->title
    },
    "total": count(*[_type == 'product' && status == 'hot'])
  }`
);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug] | order(name asc)[0]`
);

const MY_ORDERS_QUERY =
  defineQuery(`*[_type == 'order' && clerkUserId == $userId] | order(orderDate desc){
...,
shippingAddress,
products[]{
  ...,product->
}
}`);

const BLOG_BY_SLUG_QUERY = defineQuery(
  `*[_type == "blog" && slug.current == $slug] | order(publishedAt desc)[0] {
    ...,
    author->{
      name,
      image
    },
    blogcategories[]->{
      title
    }
  }`
);

const ALL_BLOGS_QUERY = defineQuery(
  `*[_type == "blog" && defined(slug.current)] | order(publishedAt desc) {
    ...,
    blogcategories[]->{
      title
    }
  }`
);

const PAGINATED_BLOGS_QUERY = defineQuery(
  `{
    "blogs": *[_type == "blog" && defined(slug.current)] | order(publishedAt desc) [$start...$end] {
      ...,
      blogcategories[]->{
        title
      }
    },
    "total": count(*[_type == "blog" && defined(slug.current)])
  }`
);

export {
  LATEST_BLOGS_QUERY,
  DEAL_PRODUCTS_QUERY,
  PAGINATED_DEAL_PRODUCTS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  MY_ORDERS_QUERY,
  BLOG_BY_SLUG_QUERY,
  ALL_BLOGS_QUERY,
  PAGINATED_BLOGS_QUERY,
};
