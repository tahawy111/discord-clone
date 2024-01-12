import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);
    const { content, fileUrl } = await req.json();
    const channelId = searchParams.get("channelId");
    const serverId = searchParams.get("serverId");

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 401 });
    }
    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 401 });
    }
    if (!content) {
      return new NextResponse("Content missing", { status: 401 });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return new NextResponse("Server not found", { status: 404 });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return new NextResponse("Channel not found", { status: 404 });
    }

    const member = server.members.find(
      (member) => member.userId === session.user.id
    );

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member?.id as string,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.log("[SEND_MESSAGE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
