import {} from "react";
import Header from "./Header";
import Body from "./Body";
import Form from "./Form";
import EmptyState from "@/app/components/EmptyState";
import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";

interface MessageContainerProps {
  conversationId: string;
}

export default async function MessageContainer({
  conversationId,
}: MessageContainerProps) {
  const conversation = await getConversationById(conversationId);
  const messages = await getMessages(conversationId);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-screen flex flex-col">
          <Header conversation={conversation} />
          <Body initialMessages={messages} />
          <Form conversation={conversation} />
      </div>
    </div>
  );
}
