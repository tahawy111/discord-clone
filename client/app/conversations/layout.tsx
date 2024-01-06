import { ReactNode } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import getConversations from "../actions/getConversations";
import { FullConversationType } from "../types";
import getUsers from "../actions/getUsers";

interface layoutProps {
  children: ReactNode;
}

export default async function ConversationsLayout({ children }: layoutProps) {
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList initialItems={conversations} users={users} />
        {children}
      </div>
    </Sidebar>
  );
}
