import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithUser = Message & {
  member: Member & {
    user: User;
  };
};

export const useChatSocket = ({
  addKey,
  queryKey,
  updateKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  console.log({ addKey, queryKey, updateKey });

  useEffect(() => {
    console.log("use chat socket");

    if (!socket) return;

    socket.on(updateKey, (message: MessageWithMemberWithUser) => {
      console.log(message);

      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.item.map((item: MessageWithMemberWithUser) => {
              if (item.id === message.id) {
                return message;
              }
            }),
          };
        });

        return { ...oldData, pages: newData };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithUser) => {
      console.log(message);

      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        newData[0] = { ...newData[0], items: [message, ...newData[0].items] };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, queryKey, socket, updateKey]);
};
