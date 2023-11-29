import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user)
      return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId)
      return new NextResponse("Server ID Missing", { status: 400 });

    const server = await db.server.update({
      where: {
        id: params.serverId,
        userId: session.user.id,
      },
      data: {
        inviteCode: crypto.randomUUID(),
      },
    });

    return  NextResponse.json(server)
  } catch (error) {
    console.log("[SERVER_ID]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
