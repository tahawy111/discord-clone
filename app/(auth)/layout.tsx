import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (session && session.user) {
    redirect("/");
  }

  return <div className="h-full">{children}</div>;
}

export default AuthLayout;
