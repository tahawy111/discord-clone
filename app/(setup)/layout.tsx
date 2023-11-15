"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
function MainLayout({ children }: { children: React.ReactNode }) {
  const { status, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    console.log(data);
  }, [status]);

  return <div className="h-full">{children}</div>;
}

export default MainLayout;
