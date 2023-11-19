import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import NavigationAction from "@/components/navigation/navigation-action";

const NavigationSidebar = async () => {
  const session = await getAuthSession();

  if (!session?.user) return redirect("/login");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1f22] py-3">
      <NavigationAction />
    </div>
  );
};

export default NavigationSidebar;
