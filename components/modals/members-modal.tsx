"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";
import { ServerWithMembersWithUsers } from "@/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";

const MembersModal = () => {
  const { isOpen, onClose, onOpen, type, data } = useModal();
  const { server } = data as { server: ServerWithMembersWithUsers };
  const isModalOpen = isOpen && type === "members";

  const origin = useOrigin();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white text-black overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Manage Members
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              {server?.members.length} Members
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="mt-8 max-h-[420px] pr-6">
            {server?.members?.map((member) => (
              <div className="flex items-center gap-x-2 mb-2" key={member.id}>
                <UserAvatar key={member.id} src={member.user.image} />
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersModal;
