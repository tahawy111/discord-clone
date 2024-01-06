"use client";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import { GlobalContext } from "@/app/context/GlobalContext";
import { SocketContext } from "@/app/context/SocketContext";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useContext, useMemo, useState } from "react";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

export default function Header({ conversation }: HeaderProps) {
  const otherUser = useOtherUser(conversation);
  const { setIsProfileDrawerOpen, setConversation } = useContext(GlobalContext);
  const { onlineUsers } = useContext(SocketContext);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return onlineUsers.includes(otherUser.id) ? "Active" : "Offline";
  }, [conversation,onlineUsers]);
  return (
    <div className="bg-white w-full flex border-b sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
      <div className="flex gap-3 items-center">
        <Link
          className="lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer"
          href={`/conversations`}
        >
          <ChevronLeft className="w-8 h-8" />
        </Link>
        {conversation.isGroup ? (
          <AvatarGroup users={conversation.users} />
        ) : (
          <Avatar user={otherUser} />
        )}

        <div className="flex flex-col">
          <div className="">{conversation.name || otherUser.name}</div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>
      
      <MoreHorizontal
        onClick={() => {
          setConversation(conversation);
          setIsProfileDrawerOpen((prev) => !prev);
        }}
        className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
      />
    </div>
  );
}
