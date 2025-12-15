"use client";

import React, { useState, useEffect, useRef } from "react";

interface HeaderWrapperProps {
  children: React.ReactNode;
}

const HeaderWrapper = ({ children }: HeaderWrapperProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Đo chiều cao header khi component mount và resize
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hiển thị header khi ở đầu trang hoặc scroll lên
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Ẩn header khi scroll xuống (sau khi scroll quá 100px)
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Hiển thị header khi scroll lên
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      {/* Spacer để tránh layout shift khi header fixed */}
      <div style={{ height: headerHeight || "auto" }} aria-hidden="true" />
      {/* Fixed header */}
      <div
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default HeaderWrapper;

