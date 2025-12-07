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

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  let orders = null;
  if (userId) {
    orders = await getMyOrders(userId);
  }

  return (
    <header className="bg-white/70 py-5 sticky top-0 z-50 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lightColor">
        {/* Logo */}
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>
        {/* HeaderMenu */}
        <HeaderMenu />
        {/* Others */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
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
      </Container>
    </header>
  );
};

export default Header;
