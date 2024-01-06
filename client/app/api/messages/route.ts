import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, message, image } = body;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: { seen: true, sender: true },
    });

    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(newMessage));
  } catch (error) {
    console.log(error, "ERROR_MESSAGES");
    return new Response("InternalError", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const conversationId = new URL(req.url).searchParams.get("conversationId");
    if (!conversationId) {
      return new Response("Invalid data passed", { status: 401 });
    }

    if (!currentUser?.id || !currentUser?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: true, seen: true },
      orderBy: { createdAt: "asc" },
    });

    return new Response(JSON.stringify(messages));
  } catch (error) {
    console.log(error, "ERROR_MESSAGES");
    return new Response("InternalError", { status: 500 });
  }
}
