"use client";
import { User } from "@prisma/client";
import { useContext } from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import { SettingsContext } from "@/app/context/SettingsContext";
import SettingsModal from "../SettingsModal";

interface SidebarContainerProps {
  currentUser: User;
}

export default function SidebarContainer({
  currentUser,
}: SidebarContainerProps) {
  const { isSettingsModalOpen, setIsSettingsModalOpen } =
    useContext(SettingsContext);
  return (
    <>
      {isSettingsModalOpen && <SettingsModal currentUser={currentUser} setIsOpen={setIsSettingsModalOpen} />}
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter currentUser={currentUser!} />
    </>
  );
}

/**
 * 
 * "use client"

interface SidebarContainerProps {
  currentUser: User;
}

function SidebarContainer({currentUser}: SidebarContainerProps) {
  return (
    <>
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
    </>
  );
}

 * 
 */
