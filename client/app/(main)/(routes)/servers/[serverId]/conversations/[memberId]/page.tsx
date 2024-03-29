import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { getAuthSession } from "@/lib/auth";
import { getOrCreateConversation } from "@/lib/conversation";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

export default async function MemberIdPage({
  params,
  searchParams,
}: MemberIdPageProps) {
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

      {searchParams.video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}

      {!searchParams.video && (
        <>
          <ChatMessages
            name={otherMember.user.name}
            member={currentMember}
            chatId={conversation.id}
            apiUrl={"/api/direct-messages"}
            socketUrl={"/api/socket/direct-messages"}
            socketQuery={{ conversationId: conversation.id }}
            paramKey={"conversationId"}
            paramValue={conversation.id}
            type={"conversation"}
          />

          <ChatInput
            apiUrl={"/api/direct-messages/sendMessage"}
            query={{ conversationId: conversation.id }}
            name={otherMember.user.name}
            type={"conversation"}
          />
        </>
      )}
    </div>
  );
}
