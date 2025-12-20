import Container from "@/components/Container";
import { Title } from "@/components/ui/text";
import React from "react";
import DealBanner from "@/components/DealBanner";
import DealProducts from "@/components/DealProducts";

const DealPage = async () => {
  return (
    <div className="py-10 bg-deal-bg">
      <Container>
        <DealBanner />
        <Title className="mt-10 mb-5 underline underline-offset-4 decoration text-base uppercase tracking-wide">
          Ưu đãi hấp dẫn cho bạn
        </Title>

        <DealProducts />
      </Container>
    </div>
  );
};

export default DealPage;
