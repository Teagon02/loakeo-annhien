import React from "react";
import { getCategories } from "@/sanity/queries";
import Container from "@/components/Container";
import { Title } from "@/components/ui/text";
import CategoryProducts from "@/components/CategoryProducts";
import { Category } from "@/sanity.types";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const categories = await getCategories();
  const { slug } = await params;
  return (
    <div className="py-10">
      <Container>
        <Title>
          Danh mục sản phẩm:{" "}
          <span className="font-bold text-green-600 capitalize tracking-wide">
            {
              categories?.find((item: Category) => item?.slug?.current === slug)
                ?.title
            }
          </span>
        </Title>
        <CategoryProducts categories={categories} slug={slug} />
      </Container>
    </div>
  );
};

export default CategoryPage;
