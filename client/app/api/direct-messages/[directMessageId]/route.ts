import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { directMessageId: string } }
) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);
    const { content } = await req.json();
    const conversationId = searchParams.get("conversationId");

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse("Server ID missing", { status: 401 });
    }

    if (!content) {
      return new NextResponse("Content missing", { status: 401 });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          { memberOne: { userId: session.user.id } },
          { memberTwo: { userId: session.user.id } },
        ],
      },
      include: {
        memberOne: {
          include: { user: true },
        },
        memberTwo: {
          include: { user: true },
        },
      },
    });

    if (!conversation) {
      return new NextResponse("Converstaion not found", { status: 404 });
    }

    const member =
      conversation.memberOne.userId === session.user.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: params.directMessageId,
        conversationId,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return new NextResponse("Message not found", { status: 404 });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isMessageOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    directMessage = await db.directMessage.update({
      where: { id: params.directMessageId },
      data: { content },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(directMessage);
  } catch (error) {
    console.log("[UPDATE_MESSAGE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { directMessageId: string } }
) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");



    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse("Server ID missing", { status: 401 });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          { memberOne: { userId: session.user.id } },
          { memberTwo: { userId: session.user.id } },
        ],
      },
      include: {
        memberOne: {
          include: { user: true },
        },
        memberTwo: {
          include: { user: true },
        },
      },
    });



    if (!conversation) {
      return new NextResponse("Converstaion not found", { status: 404 });
    }

    const member =
      conversation.memberOne.userId === session.user.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: params.directMessageId,
        conversationId,
      },
      include: {
        member: {
          include: {
            user: true,
          },
        },
      },
    });

    

    if (!directMessage || directMessage.deleted) {
      return new NextResponse("Message not found", { status: 404 });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!isMessageOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    directMessage = await db.directMessage.update({
      where: { id: params.directMessageId },
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

    return NextResponse.json(directMessage);
  } catch (error) {
    console.log("[DIRECT_DELETE_MESSAGE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
