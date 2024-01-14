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

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "getMessage",
      ({
        message,
        key,
      }: {
        message: MessageWithMemberWithUser;
        key: string;
      }) => {
        if (key.includes("update")) {
          // queryClient.setQueryData([queryKey], (oldData: any) => {
          //   if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          //     return oldData;
          //   }

          //   const newData = oldData.pages.map((page: any) => {
          //     return {
          //       ...page,
          //       items: page.items.map((item: MessageWithMemberWithUser) => {
          //         if (item.id === message.id) {
          //           return message;
          //         }
          //       }),
          //     };
          //   });

          //   return { ...oldData, pages: newData };
          // });
          queryClient.setQueryData([queryKey], (oldData: any) => {
            if (!oldData || !oldData.pages || oldData.pages.length === 0) {
              return oldData;
            }
    
            const newData = oldData.pages.map((page: any) => {
              return {
                ...page,
                items: page.items.map((item: MessageWithMemberWithUser) => {
                  if (item.id === message.id) {
                    return message;
                  }
                  return item;
                })
              }
            });
    
            return {
              ...oldData,
              pages: newData,
            }
          })
        } else {
          // queryClient.setQueryData([queryKey], (oldData: any) => {
          //   if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          //     return {
          //       pages: [
          //         {
          //           items: [message],
          //         },
          //       ],
          //     };
          //   }

          //   const newData = [...oldData.pages];

          //   newData[0] = {
          //     ...newData[0],
          //     items: [message, ...newData[0].items],
          //   };

          //   return {
          //     ...oldData,
          //     pages: newData,
          //   };
          // });
          queryClient.setQueryData([queryKey], (oldData: any) => {
            if (!oldData || !oldData.pages || oldData.pages.length === 0) {
              return {
                pages: [{
                  items: [message],
                }]
              }
            }
    
            const newData = [...oldData.pages];
    
            newData[0] = {
              ...newData[0],
              items: [
                message,
                ...newData[0].items,
              ]
            };
    
            return {
              ...oldData,
              pages: newData,
            };
          });
        }
      }
    );

    return () => {
      socket.off("getMessage");
    };
  }, [queryClient, addKey, queryKey, socket, updateKey]);
};
