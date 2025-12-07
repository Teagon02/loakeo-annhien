"use client";
import { Facebook, Youtube } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import React from "react";
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "./ui/tooltip";
import { HiMiniUserGroup } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}
const socialLink = [
  {
    title: "Youtube",
    href: "https://www.youtube.com/@Vlog1993",
    icon: <Youtube className="w-5 h-5" />,
  },
  {
    title: "Tiktok",
    href: "https://www.tiktok.com/@youtubevlog1993?_t=ZS-90kzih0Hw6K&_r=1",
    icon: <FaTiktok className="w-5 h-5" />,
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/youtubevlog1993",
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    title: "Nhóm Facebook",
    href: "https://www.facebook.com/groups/335792308542117",
    icon: <HiMiniUserGroup className="w-5 h-5" />,
  },
];

const SocialMedia = ({ className, iconClassName, tooltipClassName }: Props) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5")}>
        {socialLink?.map((item) => (
          <Tooltip key={item?.title}>
            <TooltipTrigger asChild>
              <Link
                key={item?.title}
                target="_blank"
                rel="noopener noreferrer"
                href={item?.href}
                className={cn(
                  "p-2 border rounded-full hover:text-white hover:border-shop_light_green hoverEffect",
                  iconClassName
                )}
              >
                {item?.icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "bg-white text-darkColor font-semibold",
                tooltipClassName
              )}
            >
              {item?.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
