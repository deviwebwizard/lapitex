"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import UserTracker from "./UserTracker";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <UserTracker />
      {children}
    </SessionProvider>
  );
}
