"use client";
import { useSession } from "next-auth/react";
import {
  ReactNode,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  createContext,
} from "react";
import { Socket, io } from "socket.io-client";
import { FullMessageType } from "../types";

interface SocketContextInterface {
  socket: Socket | undefined;
  setSocket: Dispatch<SetStateAction<Socket | undefined>>;
  messages: FullMessageType[] | [];
  setMessages: Dispatch<SetStateAction<FullMessageType[]>>;
  onlineUsers: string[];
  setOnlineUsers: Dispatch<SetStateAction<string[]>>;
}

export const SocketContext = createContext<SocketContextInterface>({
  socket: undefined,
  messages: [],
} as SocketContextInterface);

type UserType = {
  userId: string;
  socketId: string;
};

export function SocketContextProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const [socket, setSocket] = useState<Socket>();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<FullMessageType[]>([]);

  useEffect(() => {
    socket?.emit("addUser", session.data?.user.id);
  }, [session]);
  
  
  useEffect(() => {
    socket?.on("getUsers", (users: UserType[]) => {
      setOnlineUsers(users.map((user) => user.userId));
    });
  }, [socket]);

  useEffect(() => {
    const socket2 = io(process.env.NEXT_PUBLIC_SOCKET_SERVER!);
    setSocket(socket2);
    return () => {
      socket2.close();
    };
  }, []);
  return (
    <SocketContext.Provider
      value={{
        socket,
        setSocket,
        messages,
        setMessages,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
