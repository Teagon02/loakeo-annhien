import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";
import { categoriesData, quickLinksData } from "@/constants/data";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Social Media */}
          <div className="space-y-4">
            <Logo />
            <SubText>Chuyên độ chế loa kéo theo yêu cầu.</SubText>
            <SocialMedia
              className="text-darkColor/60"
              iconClassName="text-darkColor/60 hover:border-shop_light_green hover:text-shop_light_green"
              tooltipClassName="text-white bg-darkColor"
            />
          </div>

          {/* Quick Links */}
          <div>
            <SubTitle>Liên kết nhanh</SubTitle>
            <ul className="space-y-3 mt-4">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="hover:text-shop_light_green hoverEffect font-medium"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Categories */}
          <div>
            <SubTitle className="text-center">Danh mục sản phẩm</SubTitle>
            <ul className="grid grid-cols-2 gap-3 mt-4">
              {categoriesData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/shop?category=${item?.href}`}
                    className="hover:text-shop_light_green hoverEffect font-medium"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div className="space-y-4">
            <SubTitle>Sản phẩm mới & quà tặng</SubTitle>
            <SubText>
              Nhập email để nhận thông báo khuyến mãi và quà tặng đặc biệt.
            </SubText>
            <form className="space-y-3">
              <Input type="email" placeholder="Nhập Email của bạn" />
              <Button className="w-full">Chấp nhận</Button>
            </form>
          </div>
        </div>
        <div className="text-center py-4 border-t text-sm text-gray-600">
          <div>
            © {new Date().getFullYear()} <Logo className="text-sm" />
            {""} - All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
