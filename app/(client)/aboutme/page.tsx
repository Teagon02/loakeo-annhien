"use client";

import Container from "@/components/Container";
import Logo from "@/components/Logo";
import SocialMedia from "@/components/SocialMedia";
import {
  Home,
  Sparkles,
  Award,
  Target,
  Users,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { aboutme_1, aboutme_2, aboutme_3 } from "@/images";

const AboutPage = () => {
  const values = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Chất Lượng",
      description:
        "Cam kết mang đến những sản phẩm loa kéo chất lượng cao, được độ chế tỉ mỉ theo từng yêu cầu của khách hàng.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Uy tín - Chất lượng",
      description:
        "Uy tín - Chất lượng là chữ ký vàng của chúng tôi, được khách hàng tin tưởng và yêu mến.",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Giá cả hợp lý",
      description:
        "Giá cả hợp lý, phù hợp với mọi nhu cầu và khả năng của khách hàng.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Độ Chế Theo Yêu Cầu",
      description:
        "Mỗi sản phẩm được độ chế riêng biệt theo yêu cầu cụ thể của từng khách hàng, đảm bảo độc đáo và phù hợp.",
    },
  ];

  const stats = [
    {
      number: "1000+",
      label: "Khách Hàng Tin Tưởng",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "10000+",
      label: "Sản Phẩm Đã Bán",
      icon: <Award className="w-6 h-6" />,
    },
    {
      number: "10+",
      label: "Năm Kinh Nghiệm",
      icon: <Sparkles className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-shop_light_pink via-white to-shop_light_bg py-12 md:py-20">
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

          {/* Hero Section */}
          <div className="text-center mb-16 md:mb-20 space-y-6 animate-fade-in">
            <div className="flex justify-center mb-6">
              <Logo className="text-4xl md:text-5xl" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-shop_dark_green mb-4">
              Về Chúng Tôi
            </h1>
            <p className="text-xl text-lightColor max-w-3xl mx-auto leading-relaxed">
              Chuyên độ chế loa kéo theo yêu cầu với chất lượng cao và dịch vụ
              tận tâm
            </p>
          </div>

          {/* Story Section */}
          <div
            className={cn(
              "mb-16 md:mb-20 p-8 md:p-12 bg-white rounded-2xl shadow-lg",
              "animate-fade-in-up"
            )}
            style={{
              animationDelay: "100ms",
              animationFillMode: "both",
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-shop_dark_green mb-6 text-center">
              Câu Chuyện Thương Hiệu
            </h2>
            <div className="space-y-4 text-lg text-lightColor leading-relaxed max-w-4xl mx-auto">
              <p>
                <strong className="text-shop_dark_green">
                  Loa Kéo An Nhiên
                </strong>{" "}
                được thành lập với niềm đam mê và tình yêu dành cho âm thanh
                chất lượng cao. Chúng tôi hiểu rằng mỗi khách hàng đều có những
                nhu cầu và sở thích riêng biệt về âm thanh.
              </p>
              <p>
                Chúng tôi không chỉ bán sản phẩm, mà còn mang đến trải nghiệm âm
                thanh hoàn hảo, giúp khách hàng tìm được chiếc loa kéo phù hợp
                nhất với nhu cầu và sở thích của mình.
              </p>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="mb-16 md:mb-20">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-shop_dark_green mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Khách Hàng Tin Tưởng
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                { src: aboutme_1, delay: 0.1 },
                { src: aboutme_2, delay: 0.2 },
                { src: aboutme_3, delay: 0.3 },
              ].map((image, index) => (
                <motion.div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: image.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -8 }}
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-linear-to-t from-shop_dark_green/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                    initial={false}
                  />

                  {/* Decorative border glow */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-shop_light_green/0 group-hover:border-shop_light_green/50 transition-all duration-500 z-20 pointer-events-none" />

                  {/* Image with smooth scale effect */}
                  <motion.div
                    className="relative w-full h-[300px] md:h-[400px] overflow-hidden"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Image
                      src={image.src}
                      alt={`Hình ảnh về chúng tôi ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    />
                  </motion.div>

                  {/* Floating decorative element */}
                  <motion.div
                    className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: image.delay,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-shop_dark_green mb-12 text-center animate-fade-in">
              Giá Trị Cốt Lõi
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={cn(
                    "group p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 ease-out",
                    "border border-transparent hover:border-shop_light_green/30",
                    "transform hover:-translate-y-2",
                    "animate-fade-in-up"
                  )}
                  style={{
                    animationDelay: `${(index + 1) * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-shop_light_green/10 rounded-lg text-shop_light_green group-hover:bg-shop_light_green group-hover:text-white transition-all duration-300 shrink-0">
                      {value.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-shop_dark_green mb-2 group-hover:text-shop_light_green transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="text-lightColor leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-16 md:mb-20">
            <div className="grid md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 ease-out",
                    "border border-transparent hover:border-shop_light_green/30",
                    "text-center transform hover:-translate-y-2",
                    "animate-fade-in-up"
                  )}
                  style={{
                    animationDelay: `${(index + 1) * 150}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex justify-center mb-4 text-shop_light_green">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-shop_dark_green mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lightColor font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-6 mb-16 md:mb-20">
            <div
              className={cn(
                "p-8 bg-linear-to-br from-shop_light_green/10 to-shop_light_pink/30 rounded-xl shadow-md",
                "border border-shop_light_green/20",
                "animate-fade-in-up"
              )}
              style={{
                animationDelay: "300ms",
                animationFillMode: "both",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-shop_light_green" />
                <h3 className="text-2xl font-bold text-shop_dark_green">
                  Sứ Mệnh
                </h3>
              </div>
              <p className="text-lightColor leading-relaxed">
                Mang đến những sản phẩm loa kéo chất lượng cao, được độ chế theo
                yêu cầu riêng biệt của từng khách hàng, giúp mọi người tận hưởng
                trải nghiệm âm thanh tuyệt vời nhất.
              </p>
            </div>

            <div
              className={cn(
                "p-8 bg-linear-to-br from-shop_light_pink/30 to-shop_light_green/10 rounded-xl shadow-md",
                "border border-shop_light_green/20",
                "animate-fade-in-up"
              )}
              style={{
                animationDelay: "400ms",
                animationFillMode: "both",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-shop_light_green" />
                <h3 className="text-2xl font-bold text-shop_dark_green">
                  Tầm Nhìn
                </h3>
              </div>
              <p className="text-lightColor leading-relaxed">
                Trở thành thương hiệu hàng đầu trong lĩnh vực độ chế loa kéo tại
                Việt Nam, được khách hàng tin tưởng và yêu mến nhờ chất lượng
                sản phẩm và dịch vụ vượt trội.
              </p>
            </div>
          </div>

          {/* Social Media Section */}
          <div
            className={cn(
              "p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 ease-out",
              "border border-transparent hover:border-shop_dark_green/30",
              "text-center animate-fade-in-up"
            )}
            style={{
              animationDelay: "500ms",
              animationFillMode: "both",
            }}
          >
            <h3 className="text-2xl font-bold text-shop_dark_green mb-6">
              Theo Dõi Chúng Tôi
            </h3>
            <div className="flex justify-center">
              <SocialMedia iconClassName="text-shop_dark_green hover:text-shop_dark_green hover:bg-shop_light_green/10" />
            </div>
            <p className="text-lightColor mt-6">
              Kết nối với chúng tôi để cập nhật những sản phẩm mới và tin tức
              mới nhất
            </p>
          </div>
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
            transform: translateY(30px);
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

export default AboutPage;
