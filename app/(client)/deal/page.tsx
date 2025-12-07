import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { getDealProducts } from "@/sanity/queries";
import { Title } from "@/components/ui/text";
import React from "react";
import DealBanner from "@/components/DealBanner";

const DealPage = async () => {
  const products = await getDealProducts();
  return (
    <div className="py-10 bg-deal-bg">
      <Container>
        <DealBanner />
        <Title className="mt-10 mb-5 underline underline-offset-4 decoration text-base uppercase tracking-wide">
          Ưu đãi hấp dẫn cho bạn
        </Title>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {products?.map((product) => (
            <ProductCard key={product?._id} product={product as any} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default DealPage;
