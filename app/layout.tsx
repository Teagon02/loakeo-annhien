import "./globals.css";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loa Kéo An Nhiên",
  description: "Ráp và độ chế loa kéo",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="vi">
      <body className="font-poppins antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#fff",
              color: "#000",
            },
          }}
        ></Toaster>
      </body>
    </html>
  );
};

export default RootLayout;
