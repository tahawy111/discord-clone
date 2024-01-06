"use client";
import useConversation from "@/app/hooks/useCoversation";
import useRoutes from "@/app/hooks/useRoutes";
import { useContext } from "react";
import MobileItem from "./MobileItem";
import Avatar from "../Avatar";
import { User } from "@prisma/client";
import { SettingsContext } from "@/app/context/SettingsContext";

interface MobileFooterProps {
  currentUser: User;
}

export default function MobileFooter({ currentUser }: MobileFooterProps) {
  const routes = useRoutes();
  const { isOpen } = useConversation();
  const { isSettingsModalOpen, setIsSettingsModalOpen } =
    useContext(SettingsContext);

  if (isOpen) return null;

  return (
    <div className="justify-between fixed w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">
      <div className="mx-5" onClick={() => setIsSettingsModalOpen(true)}>
        <Avatar user={currentUser} />
      </div>
      {routes.map((route) => (
        <MobileItem
          key={route.label}
          href={route.href}
          active={route.active}
          icon={route.icon}
          iconClassName={route.iconClassName}
          onClick={route.onClick}
        />
      ))}
    </div>
  );
}
