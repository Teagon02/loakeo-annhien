"use client";

import React from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import { banner_1 } from "@/images";
import {
  Speaker,
  Volume2,
  Music,
  Radio,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const HomeBanner = () => {
  // Modern sound wave animation
  const SoundWave = ({ delay = 0 }: { delay?: number }) => (
    <div className="flex items-end gap-1 h-12">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{
            background: "linear-gradient(to top, #063c28, #3b9c3c, #93d991)",
            boxShadow: "0 0 10px rgba(59, 156, 60, 0.5)",
          }}
          initial={{ height: 4 }}
          animate={{
            height: [4, 32, 4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: delay + i * 0.1,
            ease: [0.4, 0, 0.6, 1],
          }}
        />
      ))}
    </div>
  );

  // Animated gradient orb
  const GradientOrb = ({
    delay = 0,
    size = 200,
    x = 0,
    y = 0,
  }: {
    delay?: number;
    size?: number;
    x?: number;
    y?: number;
  }) => (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-30"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background:
          "radial-gradient(circle, rgba(59, 156, 60, 0.4), transparent)",
      }}
      animate={{
        x: [0, 30, 0],
        y: [0, -20, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );

  return (
    <div className="relative py-16 md:py-20 lg:py-24 min-h-[500px] md:min-h-[600px] overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #fcf0e4 0%, #ffffff 50%, #f6f6f6 100%)",
            "linear-gradient(135deg, #f6f6f6 0%, #fcf0e4 50%, #ffffff 100%)",
            "linear-gradient(135deg, #ffffff 0%, #f6f6f6 50%, #fcf0e4 100%)",
            "linear-gradient(135deg, #fcf0e4 0%, #ffffff 50%, #f6f6f6 100%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Animated gradient orbs */}
      <GradientOrb delay={0} size={300} x={-10} y={10} />
      <GradientOrb delay={2} size={250} x={90} y={80} />
      <GradientOrb delay={4} size={200} x={50} y={-10} />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-xl" />

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Content Section */}
          <motion.div
            className="flex-1 space-y-8 lg:max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md rounded-full border border-shop_dark_green/10 shadow-lg"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-shop_light_green" />
              </motion.div>
              <span className="text-sm font-semibold text-shop_dark_green">
                Sản phẩm chất lượng cao
              </span>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                <motion.span
                  className="block bg-linear-to-r from-shop_dark_green via-shop_light_green to-shop_dark_green bg-clip-text text-transparent bg-size-[200%_auto]"
                  animate={{
                    backgroundPosition: [
                      "0% center",
                      "200% center",
                      "0% center",
                    ],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  Mua loa kéo
                </motion.span>
                <span className="block text-shop_dark_green mt-2">
                  với giá cực tốt
                </span>
                <span className="block text-shop_light_text text-2xl md:text-3xl font-normal mt-4">
                  Hãy chọn sản phẩm yêu thích của bạn
                </span>
              </h1>
            </motion.div>

            {/* Sound wave animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-4 py-4"
            >
              <SoundWave delay={0} />
              <motion.div
                className="relative p-3 rounded-full bg-white/60 backdrop-blur-md shadow-lg"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Volume2 size={32} className="text-shop_dark_green" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-shop_light_green/30"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
              <SoundWave delay={0.3} />
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <Link
                href="/shop"
                className="group relative inline-flex items-center gap-3 bg-shop_dark_green text-white px-8 py-4 rounded-2xl text-base font-bold overflow-hidden shadow-2xl hover:shadow-shop_dark_green/50 transition-all duration-500"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-shop_dark_green via-shop_light_green to-shop_dark_green"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <Speaker
                  size={20}
                  className="relative z-10 group-hover:scale-110 transition-transform"
                />
                <span className="relative z-10">Mua ngay</span>
              </Link>

              {/* Feature badges */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {[
                  {
                    colorClass: "bg-shop_light_green",
                    text: "Giá cả tốt nhất",
                  },
                  { colorClass: "bg-shop_orange", text: "Uy tín - Chất lượng" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + idx * 0.1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-shop_dark_green/10 shadow-sm"
                  >
                    <motion.div
                      className={`w-2 h-2 ${item.colorClass} rounded-full`}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.7, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: idx * 0.5,
                      }}
                    />
                    <span className="text-shop_light_text font-medium">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="relative hidden lg:block shrink-0"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Floating decorative icons */}
            {[
              { Icon: Speaker, delay: 0, position: "top-0 -left-8", size: 40 },
              {
                Icon: Volume2,
                delay: 1,
                position: "-bottom-8 -right-8",
                size: 36,
              },
              {
                Icon: Music,
                delay: 2,
                position: "top-1/2 -right-12",
                size: 28,
              },
            ].map(({ Icon, delay, position, size }, idx) => (
              <motion.div
                key={idx}
                className={`absolute ${position} p-3 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-shop_dark_green/10`}
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, idx % 2 === 0 ? 5 : -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay,
                  ease: "easeInOut",
                }}
              >
                <Icon size={size} className="text-shop_dark_green" />
              </motion.div>
            ))}

            {/* Image with smooth animation */}
            <motion.div
              className="relative"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 1, -1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: [0.4, 0, 0.6, 1],
              }}
            >
              <motion.div
                className="relative"
                whileHover={{
                  scale: 1.05,
                  rotate: 2,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="absolute inset-0 bg-shop_light_green/10 rounded-3xl blur-3xl" />
                <Image
                  src={banner_1}
                  alt="Banner loa kéo"
                  className="relative z-10 w-full max-w-lg drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
