"use client"

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export default function MediaRoom({ audio, chatId, video }: MediaRoomProps) {
  const { data: session } = useSession();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!session?.user.name) return;

    (async () => {
      const res = await fetch(
        `/api/livekit?room=${chatId}&username=${session.user.name}`
      );
      const data = await res.json();
      setToken(data.token);
    })();
  }, [session?.user, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: "100dvh" }}
      connect
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
