import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  return <div className="h-full">{children}</div>;
}

export default MainLayout;
