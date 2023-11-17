import InitialModal from "@/components/modals/initial-modal";
import { ModeToggle } from "@/components/mode-toggle";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          userId: profile?.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`servers/${server.id}`);
  }
  return (
      <InitialModal />
  );
}
