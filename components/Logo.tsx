import React from "react";
import Link from "next/link";
import Image from "next/image";
import banner from "@/images/banner/banner.svg";
import { cn } from "@/lib/utils";

const Logo = ({
  className,
  spanDesign,
  imageClassName,
}: {
  className?: string;
  spanDesign?: string;
  imageClassName?: string;
}) => {
  return (
    // <Link href={"/"} className="inline-flex">
    //   <h2
    //     className={cn(
    //       "text-2xl text-shop_dark_green font-black tracking-wider uppercase hover:text-shop_light_green hoverEffect group font-sans",
    //       className
    //     )}
    //   >
    //     Loa Kéo{" "}
    //     <span
    //       className={cn(
    //         "text-shop_light_green group-hover:text-shop_dark_green hoverEffect",
    //         spanDesign
    //       )}
    //     >
    //       An Nhiên
    //     </span>
    //   </h2>
    // </Link>
    <Link href={"/"} className={cn("inline-flex items-center", className)}>
      <Image
        src={banner}
        alt="Loa Kéo An Nhiên"
        priority
        className={cn("h-12 w-auto object-contain", imageClassName)}
      />
      <span className="sr-only">
        Loa Kéo <span className={spanDesign}>An Nhiên</span>
      </span>
    </Link>
  );
};

export default Logo;
