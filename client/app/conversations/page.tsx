"use client";

import { useEffect, useRef, useState } from "react";
import EmptyState from "../components/EmptyState";
import { cn } from "@/lib/utils";
import useConversation from "@/app/hooks/useCoversation";
import { Socket, io } from "socket.io-client";
import { useSession } from "next-auth/react";

interface ConversationProps {}

export default function Conversation({}: ConversationProps) {
  const { isOpen } = useConversation();

  return (
    <div
      className={cn("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
}
