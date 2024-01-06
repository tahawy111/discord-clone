"use client";
import { Suspense, useContext, useEffect, useState } from "react";
import { User } from "@prisma/client";
import Image from "next/image";
import { SocketContext } from "../context/SocketContext";

interface AvatarProps {
  user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const AvatarFallBack = (
    <>
      <Image fill src={"/images/placeholder-image.jpg"} alt="Avatar" />
    </>
  );
  const { onlineUsers, socket } = useContext(SocketContext);
  console.log(onlineUsers);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    setIsActive(onlineUsers.includes(user?.id!));
  }, [socket, onlineUsers]);

  // console.log({
  //   onlineUsers,
  //   isActive: onlineUsers.includes(session.data?.user.id as string),
  //   userId: session.data?.user.id,
  // });

  return (
    <div className="relative">
      <div
        className="
        relative
        inline-block 
        rounded-full 
        overflow-hidden
        h-9 
        w-9 
        md:h-11 
        md:w-11
        translate-y-1
        mx-1
        cursor-pointer
      "
      >
        <Suspense fallback={AvatarFallBack}>
          <Image
            fill
            src={user?.image || "/images/placeholder-image.jpg"}
            alt="Avatar"
          />
        </Suspense>
      </div>
      {isActive && (
        <span
          className="
            absolute 
            block 
            rounded-full 
            bg-green-500 
            ring-2 
            ring-white 
            top-0 
            right-0
            h-2 
            w-2 
            md:h-3 
            md:w-3
            translate-y-1
          "
        />
      )}
    </div>
  );
};

export default Avatar;
