import "./globals.css";
import { Toaster } from "react-hot-toast";
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
