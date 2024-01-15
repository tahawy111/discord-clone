import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);
    const { content, fileUrl } = await req.json();
    const conversationId = searchParams.get("conversationId");

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!content) {
      return new NextResponse("Content missing", { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse("Conversation ID missing", { status: 401 });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: { userId: session.user.id },
          },
          {
            memberTwo: { userId: session.user.id },
          },
        ],
      },
      include: {
        memberOne: { include: { user: true } },
        memberTwo: { include: { user: true } },
      },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    const member =
      conversation.memberOne.userId === session.user.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return new NextResponse("Member not found", { status: 404 });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId,
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
    console.log("[DIRECT_SEND_MESSAGE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
