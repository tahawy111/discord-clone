import { ReactNode } from "react";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { User } from "@prisma/client";
import SidebarContainer from "./SidebarContainer";

interface SidebarProps {
  children: ReactNode;
}

export default async function Sidebar({ children }: SidebarProps) {
  const currentUser = await getCurrentUser();
  return (
    <div>
      <SidebarContainer currentUser={currentUser!} />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}

