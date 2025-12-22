import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";
import HomeCategories from "@/components/HomeCategories";
import { getCategories } from "@/sanity/queries";
import LatestBlog from "@/components/LatestBlog";

// ISR: Revalidate mỗi 10 phút cho trang home
// - Categories ít thay đổi, có thể cache lâu hơn
// - Blogs mới vẫn được update đủ nhanh (10 phút)
export const revalidate = 600;

const Home = async () => {
  const categories = await getCategories(12);
  console.log(categories);
  return (
    <Container className="bg-shop-light-pink">
      <div className="pt-2">
        <HomeBanner />
      </div>
      <div className="py-5">
        <ProductGrid />
        <HomeCategories categories={categories} />
        <LatestBlog />
      </div>
    </Container>
  );
};

export default Home;
