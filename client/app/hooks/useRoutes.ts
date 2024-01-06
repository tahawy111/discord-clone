import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import useConversation from "./useCoversation";
import { LogOut, MessageCircle, Users2 } from "lucide-react";
import { signOut } from "next-auth/react";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();
  // const router = useRouter()

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/conversations",
        icon: MessageCircle,
        active: pathname === "/conversation" || !!conversationId,
      },
      {
        label: "Users",
        href: "/users",
        icon: Users2,
        active: pathname === "/users",
      },
      {
        label: "Logout",
        href: "#",
        icon: LogOut,
        onClick: () => {
          signOut()
          // router.push("/")
        },
        iconClassName:"rotate-180"
      },
    ],
    [pathname, conversationId]
  );
  

  return routes;
};

export default useRoutes;
