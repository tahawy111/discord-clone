import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface DesktopItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
  iconClassName?: string;
}

export default function DesktopItem({
  href,
  label,
  icon: Icon,
  active,
  onClick,
  iconClassName,
}: DesktopItemProps) {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };
  return (
    <li onClick={handleClick}>
      <Link
        href={href}
        className={cn(
          "flex group gap-x-3 rounded-md px-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100",
          active && "bg-gray-100 text-black"
        )}
      >
        <Icon className={cn(iconClassName, "shrink-0 my-3")} />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
}
