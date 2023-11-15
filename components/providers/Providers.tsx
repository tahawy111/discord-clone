"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/theme-provider";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="discord-theme"
        >
          {children}
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}

export default Providers;
