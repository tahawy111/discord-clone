import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);
    const { content } = await req.json();
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

    let message = await db.message.findFirst({
      where: {
        id: params.messageId,
        channelId,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return new NextResponse("Message not found", { status: 404 });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isMessageOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    message = await db.message.update({
      where: { id: params.messageId },
      data: { content },
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
    console.log("[UPDATE_MESSAGE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {

    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);
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

    let message = await db.message.findFirst({
      where: {
        id: params.messageId,
        channelId,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return new NextResponse("Message not found", { status: 404 });
    }    

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    message = await db.message.update({
      where: { id: params.messageId },
      data: {
        content: "This message has been deleted.",
        fileUrl: null,
        deleted: true,
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
    console.log("[DELETE_MESSAGE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
