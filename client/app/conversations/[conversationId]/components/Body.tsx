"use client";
import { FullMessageType } from "@/app/types";
import useConversation from "@/app/hooks/useCoversation";
import { useContext, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { find } from "lodash";
import { SocketContext } from "@/app/context/SocketContext";

interface BodyProps {
  initialMessages: FullMessageType[];
}

export default function Body({ initialMessages }: BodyProps) {
  // const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { socket, messages, setMessages } = useContext(SocketContext);

  const { conversationId } = useConversation();

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    socket?.on("getMessage", (data) => {
      console.log({data});
      
      setMessages((current) => [...current, data]);
    });
  }, [socket]);

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // useEffect(() => {
  //   // pusherClient.subscribe(conversationId);
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  //   const messageHandler = (message: FullMessageType) => {
  //     axios.post(`/api/conversations/${conversationId}/seen`);
  //     setMessages((current) => {
  //       if (find(current, { id: message.id })) {
  //         return current;
  //       }
  //       return [...current, message];
  //     });

  //     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  //   };

  //   const updateMessageHandler = (newMessage: FullMessageType) => {
  //     setMessages((current) =>
  //       current.map((currentMessage) => {
  //         if (currentMessage.id === newMessage.id) {
  //           return newMessage;
  //         }

  //         return currentMessage;
  //       })
  //     );
  //     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  //   };

  //   pusherClient.bind("messages:new", messageHandler);
  //   pusherClient.bind("message:update", updateMessageHandler);

  //   return () => {
  //     pusherClient.unsubscribe(conversationId);
  //     pusherClient.unbind("messages:new", messageHandler);
  //     pusherClient.unbind("messages:update", messageHandler);
  //   };
  // }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <div className="mb-3" key={message.id} ref={bottomRef}>
          <MessageBox isLast={i === messages.length - 1} data={message} />
        </div>
      ))}
    </div>
  );
}
