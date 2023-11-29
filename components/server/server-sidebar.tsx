import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import ServerHeader from "@/components/server/server-header";

interface ServerSidebarProps {
  serverId: string;
}

export default async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const session = await getAuthSession();

  if (!session?.user) return redirect("/login");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          user: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.channelType === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.channelType === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.channelType === ChannelType.VIDEO
  );

  const members = server?.members.filter(
    (member) => member.userId !== session.user.id
  );
  const role = server?.members.find(
    (member) => member.userId === session.user.id
  )?.role;

  if (!server) return redirect("/");

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
}
