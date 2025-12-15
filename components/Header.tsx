import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import Carticon from "./Carticon";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Logs } from "lucide-react";
import Link from "next/link";
import { getMyOrders } from "@/sanity/queries";
import HeaderWrapper from "./HeaderWrapper";

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  let orders = null;
  if (userId) {
    orders = await getMyOrders(userId);
  }

  return (
    <HeaderWrapper>
      <header className="bg-white/70 pt-2 backdrop-blur-md w-full">
        <Container className="flex flex-col gap-4 text-lightColor">
          {/* Hàng 1: Logo, SearchBar và các icon */}
          <div className="flex items-center justify-between w-full gap-4">
            {/* Logo */}
            <div className="w-auto flex items-center gap-2.5 justify-start shrink-0">
              <Logo />
            </div>
            {/* SearchBar ở giữa */}
            <div className="flex-1 flex justify-center">
              <SearchBar />
            </div>
            {/* Others */}
            <div className="w-auto flex items-center justify-end gap-5 shrink-0">
              <Carticon />
              <FavoriteButton />
              <ClerkLoaded>
                <SignedIn>
                  <Link
                    href="/orders"
                    className="group relative hover:text-shop_light_green hoverEffect"
                  >
                    <Logs />
                    <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                      {orders?.length ? orders?.length : 0}
                    </span>
                  </Link>
                  <UserButton />
                </SignedIn>
              </ClerkLoaded>
              {!user && <SignIn />}
            </div>
          </div>
        </Container>
        {/* Hàng 2: HeaderMenu - border kéo dài sát 2 bên màn hình */}
        <div className="w-full mt-4 border-t border-b">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
            <MobileMenu />
            <HeaderMenu />
          </div>
        </div>
      </header>
    </HeaderWrapper>
  );
};

export default Header;
