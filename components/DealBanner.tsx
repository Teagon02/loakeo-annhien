"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import Logo from "./Logo";

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const timeUnits = [
    { label: "Ngày", value: timeLeft.days },
    { label: "Giờ", value: timeLeft.hours },
    { label: "Phút", value: timeLeft.minutes },
    { label: "Giây", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-shop_dark_green" />
      <div className="flex items-center gap-2 sm:gap-3">
        {timeUnits.map((unit, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="bg-white rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-md min-w-[50px] sm:min-w-[60px]">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-shop_dark_green">
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-shop_light_text mt-1 font-medium">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DealBanner = () => {
  // Đặt thời gian kết thúc deal (ví dụ: 7 ngày từ bây giờ)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 12);
  targetDate.setHours(23, 59, 59, 999);

  return (
    <div className="relative w-full bg-yellow-200/80 min-h-[320px] md:min-h-[400px] lg:min-h-[480px] overflow-hidden rounded-lg md:rounded-xl lg:rounded-2xl">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full overflow-visible">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 h-full min-h-[320px] md:min-h-[400px] lg:min-h-[480px] py-6 md:py-8 lg:py-10 overflow-visible">
          {/* Left Section - Deal Info */}
          <div className="flex flex-col items-center lg:items-start gap-6 lg:gap-8 flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full border border-red-200">
              <span className="text-sm font-bold text-red-600">
                KHUYẾN MÃI ĐẶC BIỆT
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-shop_dark_green leading-tight">
              Giảm giá <span className="text-red-600">lên đến 50%</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-shop_light_text max-w-lg">
              Ưu đãi đặc biệt cho các sản phẩm loa kéo chất lượng cao. Nhanh tay
              đặt hàng để nhận được giá tốt nhất!
            </p>

            {/* Countdown Timer */}
            <div className="flex flex-col gap-3">
              <p className="text-sm sm:text-base font-semibold text-shop_dark_green">
                Còn lại:
              </p>
              <CountdownTimer targetDate={targetDate} />
            </div>
          </div>

          {/* Right Section - Decorative */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-8 flex-1 w-full min-w-0">
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
              <Logo
                className="w-auto h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56"
                imageClassName="h-24 sm:h-32 md:h-40 lg:h-48 xl:h-56 w-auto"
              />
            </div>
            <p className="text-lg md:text-xl lg:text-2xl text-center text-shop_light_text font-medium max-w-md">
              Ưu đãi có hạn - Đừng bỏ lỡ!
            </p>
            <div className="flex items-center gap-2 text-red-600 mt-2">
              <div className="w-12 h-0.5 bg-red-600" />
              <span className="text-sm sm:text-base font-semibold">
                SALE SỐC
              </span>
              <div className="w-12 h-0.5 bg-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealBanner;
