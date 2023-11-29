import ServerSidebar from "@/components/server/server-sidebar";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ServerIdLayoutProps {
  children: React.ReactNode;
  params: { serverId: string };
}

export default async function ServerIdLayout({
  children,
  params,
}: ServerIdLayoutProps) {
  const session = await getAuthSession();

  if (!session?.user) return redirect("/login");

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!server) return redirect("/");

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <div className="h-full md:pl-60">{children}</div>
    </div>
  );
}
