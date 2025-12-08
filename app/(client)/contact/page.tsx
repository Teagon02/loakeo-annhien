"use client";

import Container from "@/components/Container";
import Logo from "@/components/Logo";
import SocialMedia from "@/components/SocialMedia";
import { Mail, Phone, MapPin, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ContactPage = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Nhấn vào đây để gửi email đến chúng tôi",
      content: "loakeoannhien@gmail.com",
      href: "mailto:loakeoannhien@gmail.com",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Điện thoại",
      content: "0937 639 663",
      href: "tel:+840937639663",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Địa chỉ",
      content: "Ấp 4, phường Tân Triều, tỉnh Đồng Nai (Địa chỉ mới)",
      oldContent:
        "Ấp 4 xã Thạnh Phú, huyện Vĩnh Cửu, tỉnh Đồng Nai (Địa chỉ cũ)",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-shop_light_pink via-white to-shop_light_bg py-12 md:py-20">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Back to Home Button */}
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-2 mb-8 text-shop_dark_green hover:text-shop_light_green",
              "font-medium transition-all duration-300 ease-out",
              "group animate-fade-in"
            )}
          >
            <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Quay về trang chủ</span>
          </Link>

          {/* Header Section with Logo */}
          <div className="text-center mb-12 md:mb-16 space-y-6 animate-fade-in">
            <div className="flex justify-center mb-6">
              <Logo className="text-3xl md:text-4xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-shop_dark_green mb-4">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="text-lg text-lightColor max-w-2xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với
              chúng tôi qua các thông tin bên dưới.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Contact Info Cards */}
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.href}
                className={cn(
                  "group block p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 ease-out",
                  "border border-transparent hover:border-shop_light_green/30",
                  "transform hover:-translate-y-1",
                  "animate-fade-in-up"
                )}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-shop_light_green/10 rounded-lg text-shop_light_green group-hover:bg-shop_light_green group-hover:text-white transition-all duration-300">
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-shop_dark_green mb-1 group-hover:text-shop_light_green transition-colors duration-300">
                      {info.title}
                    </h3>
                    <div className="text-lightColor group-hover:text-shop_dark_green transition-colors duration-300 space-y-1">
                      <p>{info.content}</p>
                      {info.oldContent && (
                        <p className="text-sm opacity-80">{info.oldContent}</p>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ))}

            {/* Social Media Section */}
            <div
              className={cn(
                "p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 ease-out",
                "border border-transparent hover:border-shop_dark_green/30 ",
                "transform hover:-translate-y-1",
                "animate-fade-in-up"
              )}
              style={{
                animationDelay: `${contactInfo.length * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <h3 className="font-semibold text-shop_dark_green mb-4">
                Theo Dõi Chúng Tôi
              </h3>
              <SocialMedia iconClassName="text-shop_dark_green hover:text-shop_dark_green hover:bg-shop_light_green/10" />
            </div>
          </div>

          {/* Back to Home Button at Bottom */}
          <div
            className="mt-12 text-center animate-fade-in-up"
            style={{ animationDelay: "400ms", animationFillMode: "both" }}
          ></div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
