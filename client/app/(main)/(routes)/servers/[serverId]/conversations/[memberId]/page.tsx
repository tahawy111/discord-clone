import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { getAuthSession } from "@/lib/auth";
import { getOrCreateConversation } from "@/lib/conversation";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

export default async function MemberIdPage({ params }: MemberIdPageProps) {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/login");
  }

  const currentMember = await db.member.findFirst({
    where: { serverId: params.serverId, userId: session.user.id },
    include: { user: true },
  });

  if (!currentMember) {
    redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.userId === session.user.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={otherMember.user.name}
        imageUrl={otherMember.user.image}
        serverId={params.serverId}
        type="conversation"
      />

      <div className="flex-1">Future Messages</div>

      {/* <ChatInput /> */}
    </div>
  );
}
