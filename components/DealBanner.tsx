"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, Gift, Percent, ArrowRight, Zap } from "lucide-react";
import { Button } from "./ui/button";

const DealBanner = () => {
  // Animated confetti particles
  const ConfettiParticle = ({
    delay = 0,
    x = 0,
    y = 0,
    color = "#FFD700",
  }: {
    delay?: number;
    x?: number;
    y?: number;
    color?: string;
  }) => (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`,
      }}
      initial={{ opacity: 0, y: -20, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, 100],
        x: [0, Math.random() * 40 - 20],
        scale: [0, 1, 1, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeOut",
      }}
    />
  );

  // Floating lanterns
  const Lantern = ({ delay = 0, x = 0 }: { delay?: number; x?: number }) => (
    <motion.div
      className="absolute text-4xl"
      style={{ left: `${x}%`, top: "10%" }}
      animate={{
        y: [0, -30, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      🏮
    </motion.div>
  );

  // Firecracker animation
  const Firecracker = ({
    delay = 0,
    x = 0,
  }: {
    delay?: number;
    x?: number;
  }) => (
    <motion.div
      className="absolute text-3xl"
      style={{ left: `${x}%`, top: "5%" }}
      animate={{
        scale: [1, 1.3, 1],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      🧨
    </motion.div>
  );

  return (
    <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #DC2626 0%, #F59E0B 50%, #DC2626 100%)",
            "linear-gradient(135deg, #F59E0B 0%, #DC2626 50%, #F59E0B 100%)",
            "linear-gradient(135deg, #DC2626 0%, #F59E0B 50%, #DC2626 100%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Animated overlay pattern */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
        animate={{
          x: [0, 40],
          y: [0, 40],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Confetti particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <ConfettiParticle
          key={i}
          delay={i * 0.2}
          x={Math.random() * 100}
          y={-10}
          color={i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FF6B6B" : "#4ECDC4"}
        />
      ))}

      {/* Floating decorations */}
      <Lantern delay={0} x={5} />
      <Lantern delay={1} x={90} />
      <Firecracker delay={0.5} x={15} />
      <Firecracker delay={1.5} x={85} />

      {/* Content */}
      <div className="relative z-10 px-6 py-8 md:px-12 md:py-16 lg:px-16 lg:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left content */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg mb-4"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </motion.div>
              <span className="text-sm font-bold text-white">
                🎉 KHUYẾN MÃI TẾT 2026 🎉
              </span>
            </motion.div>

            {/* Main title */}
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="block">🎊 XUÂN BÍNH NGỌ 2026🎊</span>
              <motion.span
                className="block mt-2 text-yellow-300 drop-shadow-lg"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                GIẢM GIÁ LÊN ĐẾN
              </motion.span>
              <motion.span
                className="block mt-2 text-6xl md:text-7xl lg:text-8xl font-black text-yellow-300 drop-shadow-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  textShadow: [
                    "0 0 20px rgba(255, 215, 0, 0.5)",
                    "0 0 40px rgba(255, 215, 0, 0.8)",
                    "0 0 20px rgba(255, 215, 0, 0.5)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                50%
              </motion.span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-white/90 mb-6 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              🎁 Mua sắm ngay để nhận ưu đãi đặc biệt! 🎁
            </motion.p>

            {/* Features */}
            <motion.div
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { icon: Percent, text: "Giảm giá sâu" },
                { icon: Zap, text: "Giao hàng nhanh" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 + idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <item.icon className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-semibold text-white">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            ></motion.div>
          </motion.div>

          {/* Right decorative elements */}
          <motion.div
            className="hidden md:flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Large decorative text */}
            <motion.div
              className="text-8xl md:text-9xl font-black text-white/20 select-none"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🐉
            </motion.div>
            <motion.div
              className="text-6xl md:text-7xl font-black text-white/20 select-none"
              animate={{
                rotate: [0, -5, 5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              🧧
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-16 bg-white/10"
        style={{
          clipPath: "polygon(0 50%, 100% 0%, 100% 100%, 0% 100%)",
        }}
        animate={{
          clipPath: [
            "polygon(0 50%, 100% 0%, 100% 100%, 0% 100%)",
            "polygon(0 40%, 100% 10%, 100% 100%, 0% 100%)",
            "polygon(0 50%, 100% 0%, 100% 100%, 0% 100%)",
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default DealBanner;
