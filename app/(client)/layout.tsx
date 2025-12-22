import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { viVN } from "@clerk/localizations";
import RemoveCartAndWishlist from "@/components/RemoveCartAndWishlist";

export const metadata: Metadata = {
  title: "Loa Kéo An Nhiên - Chuyên Độ Chế Loa Kéo Chất Lượng Cao",
  description: "Loa Kéo An Nhiên - Chuyên Độ Chế Loa Kéo Chất Lượng Cao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={viVN}>
      <div className="flex flex-col min-h-screen">
        <RemoveCartAndWishlist />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ClerkProvider>
  );
}
