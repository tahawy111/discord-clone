import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import {} from "react";

interface InviteCodePageProps {
  params: { inviteCode: string };
}

export default async function InviteCodePage({ params }: InviteCodePageProps) {
  const session = await getAuthSession();

  if (!session?.user) return redirect("/login");
  if (!params?.inviteCode) return redirect("/");

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            userId: session.user.id,
          },
        ],
      },
    },
  });

  return <div>InviteCodePage</div>;
}
