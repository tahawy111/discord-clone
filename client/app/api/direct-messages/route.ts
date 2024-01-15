import { NextResponse } from "next/server";
import { DirectMessage, Message } from "@prisma/client";

import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

const MESSAGES_BATCH = 15;

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse("Conversation ID missing", { status: 400 });
    }

    let directMessage: DirectMessage[] = [];

    if (cursor) {
      directMessage = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: { conversationId },
        include: { member: { include: { user: true } } },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      directMessage = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: { conversationId },
        include: { member: { include: { user: true } } },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (directMessage.length === MESSAGES_BATCH) {
      nextCursor = directMessage[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: directMessage,
      nextCursor,
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
