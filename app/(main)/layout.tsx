"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
function MainLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  console.log(status);

  if (status !== "authenticated") {
    router.push("/login");
  }
  return <div className="h-full">{children}</div>;
}

export default MainLayout;
