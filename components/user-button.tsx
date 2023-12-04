"use client";

import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import {} from "react";

interface UserButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export default function UserButton({ className, ...props }: UserButtonProps) {
  const { data } = useSession();
  const logout = () => {
    signOut().then(() => {
      return redirect("/login");
    });
  };

  return (
    <div className={cn("w-12 h-12 relative", className)} {...props}>
      <button onClick={logout}>
        {data?.user && (
          <Image
            className="rounded-full"
            fill
            src={(data.user?.image && data.user.image) || ""}
            alt="Profile Picture"
          />
        )}
      </button>
    </div>
  );
}
