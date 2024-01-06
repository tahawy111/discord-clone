import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, imageUrl, cldPublicId } = await req.json();
    const session = await getAuthSession();
    if (!session?.user)
      return new NextResponse("Unauthorized", { status: 500 });
    const { user } = session;

    const server = await db.server.create({
      data: {
        userId: user.id,
        name,
        cldPublicId,
        imageUrl,
        inviteCode: crypto.randomUUID(),
        channels: {
          create: [{ name: "general", userId: user.id }],
        },
        members: {
          create: [{ userId: user.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
