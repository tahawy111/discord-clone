import { redirect } from "next/navigation";
import { getAuthSession } from "./auth";
import { db } from "./db";

export const initialProfile = async () => {
  const currentUser = await getAuthSession();
  if (!currentUser?.user) return redirect("/login");
  const profile = await db.user.findUnique({
    where: { id: currentUser.user.id },
  });

  return profile;
};
