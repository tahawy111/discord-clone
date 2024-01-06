"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import {} from "react";

interface MobileItemProps {
  href: string;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
  iconClassName?: string;
}

export default function MobileItem({
  href,
  icon: Icon,
  active,
  onClick,
  iconClassName,
}: MobileItemProps) {

    const handleClick = () => {
        if (onClick) {
          return onClick();
        }
      };


  return <Link onClick={handleClick} href={href} className={cn("group flex gap-x-3 text-sm leading-6 font-semibold w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-100",active && "bg-gray-100 text-black")}>
    <Icon className={cn(iconClassName)} />
  </Link>;
}
