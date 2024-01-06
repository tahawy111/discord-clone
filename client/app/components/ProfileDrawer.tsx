"use client";
import {
  MouseEventHandler,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { GlobalContext } from "../context/GlobalContext";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Avatar from "./Avatar";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { buttonVariants } from "./ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AvatarGroup from "./AvatarGroup";
import Loader from "./Loader";
import { SocketContext } from "../context/SocketContext";

interface ProfileDrawerProps {}

export default function ProfileDrawer({}: ProfileDrawerProps) {
  const { setIsProfileDrawerOpen, isProfileDrawerOpen, conversation, session } =
    useContext(GlobalContext);
  const drawerId = useId();
  const containerId = useId();
  const router = useRouter();
  const { onlineUsers, socket } = useContext(SocketContext);

  const otherUser = conversation?.users.filter(
    (user) => user.email !== session?.user?.email
  )[0];
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    setIsActive(onlineUsers.includes(otherUser?.id!));
  }, [socket, onlineUsers, otherUser]);

  const handleClickOutside: MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === document.getElementById(containerId)) {
      setIsProfileDrawerOpen(false);
    }
  };

  const conversationContent = (
    conversation: Conversation & {
      users: User[];
    }
  ) => {
    // const statusText = useMemo(() => {
    //   if (conversation.isGroup) {
    //     return `${conversation.users.length} members`;
    //   }

    //   return conversation.userIds.includes(otherUser.id) ? "Active" : "Offline";
    // }, [conversation]);

    // const [isActive, setIsActive] = useState<boolean>(false);

    // useEffect(() => {
    //   setIsActive(onlineUsers.includes(otherUser.id!));
    // }, [socket, onlineUsers]);

    const otherUser = conversation.users.filter(
      (user) => user.email !== session?.user?.email
    )[0];

    const joinedDate = format(new Date(otherUser.createdAt), "PP");

    const onDelete = () => {
      setIsProfileDrawerOpen(false);
      axios
        .delete(`/api/conversations/${conversation.id}`)
        .then(() => {
          router.push(`/conversations`);
          router.refresh();
        })
        .catch(() => {
          toast.error("Something went wrong!");
        });
    };

    return (
      <div>
        <AlertDialog>
          <AlertDialogTrigger asChild></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex flex-col items-center">
          <div className="flex justify-center">
            {conversation.isGroup ? (
              <AvatarGroup users={conversation.users} />
            ) : (
              <Avatar user={otherUser} />
            )}
          </div>
          <div>{conversation.name || otherUser.name}</div> {/** Title */}
          <div className="text-sm text-neutral-500">
            {conversation.isGroup
              ? `${conversation.users.length} members`
              : isActive
              ? "Active"
              : "Offline"}
          </div>
          {/** Status Text */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="cursor-pointer">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex justify-center items-center mt-7">
                  <Trash2 />
                </div>
                <div className="text-sm font-light text-neutral-600">
                  Delete
                </div>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="z-[100]">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex gap-3 items-center">
                  <div className="flex rounded-full w-10 h-10 bg-red-300 justify-center items-center">
                    <AlertTriangle className={`text-red-500`} />
                  </div>
                  <span>Delete Conversation</span>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this conversation? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={onDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* <div className="w-10 h-10 bg-neutral-100 rounded-full flex justify-center items-center mt-7">
            <Trash2 />
          </div>
          <div className="text-sm font-light text-neutral-600">Delete</div> */}
        </div>
        <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
          {conversation.isGroup && (
            <div>
              <dt
                className="
                text-sm 
                font-medium 
                text-gray-500 
                sm:w-40 
                sm:flex-shrink-0
              "
              >
                Emails
              </dt>
              <dd
                className="
                mt-1 
                text-sm 
                text-gray-900 
                sm:col-span-2
              "
              >
                {conversation.users.map((user) => user.email).join(", ")}
              </dd>
            </div>
          )}
          {!conversation.isGroup && (
            <div className="">
              <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                {otherUser.email}
              </dd>
              <hr className="my-3" />
              <div className="">
                <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                  Joined
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  <time dateTime={joinedDate}>{joinedDate}</time>
                </dd>
              </div>
            </div>
          )}
        </dl>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "w-full h-screen bg-black/60 fixed z-[100] top-0 transition-all",
        isProfileDrawerOpen ? "block" : "hidden"
      )}
      onClick={handleClickOutside}
      id={containerId}
    >
      <motion.div
        id={drawerId}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed z-50 -right-full h-screen w-screen sm:w-96 bg-white transition duration-300"
          //   isProfileDrawerOpen && "right-0"
        )}
        animate={{ right: isProfileDrawerOpen ? 0 : "-100%" }}
      >
        <div className="flex flex-col">
          <div className="flex justify-end">
            <X
              className="m-5 hover:bg-slate-100 p-1 w-10 h-10 rounded-lg transition"
              onClick={() => setIsProfileDrawerOpen(false)}
            />
          </div>

          {conversation && session && conversation.users.length > 0 ? (
            conversationContent(conversation)
          ) : (
            <div className="flex justify-center items-center h-screen">
              <Loader />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
