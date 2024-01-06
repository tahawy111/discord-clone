"use client";
import { Conversation, User } from "@prisma/client";
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

interface SettingsContextInterface {
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const SettingsContext = createContext<SettingsContextInterface>({
  isSettingsModalOpen: false,
} as SettingsContextInterface);

export function SettingsContextProvider({ children }: { children: ReactNode }) {
  const [isSettingsModalOpen, setIsSettingsModalOpen] =
    useState<boolean>(false);

  return (
    <SettingsContext.Provider
      value={{
        isSettingsModalOpen,
        setIsSettingsModalOpen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
