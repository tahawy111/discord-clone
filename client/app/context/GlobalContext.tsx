"use client";
import { Conversation, User } from "@prisma/client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

export type conversationType =
  | (Conversation & {
      users: User[];
    })
  | null;

interface GlobalContextInterface {
  isProfileDrawerOpen: boolean;
  setIsProfileDrawerOpen: Dispatch<SetStateAction<boolean>>;
  isGroupAddModalOpen: boolean;
  setIsGroupAddModalOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  conversation: conversationType;
  setConversation: Dispatch<SetStateAction<conversationType>>;
  session: Session | null;
}

export const GlobalContext = createContext<GlobalContextInterface>({
  isProfileDrawerOpen: false,
  conversation: null,
  isGroupAddModalOpen: false,
} as GlobalContextInterface);

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] =
    useState<boolean>(false);
  const [conversation, setConversation] = useState<conversationType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGroupAddModalOpen, setIsGroupAddModalOpen] =
    useState<boolean>(false);
  const { data: session } = useSession();

  return (
    <GlobalContext.Provider
      value={{
        isProfileDrawerOpen,
        setIsProfileDrawerOpen,
        conversation,
        setConversation,
        session,
        isLoading,
        setIsLoading,
        isGroupAddModalOpen,
        setIsGroupAddModalOpen,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
