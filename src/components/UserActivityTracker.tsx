"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export function UserActivityTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const query = searchParams.toString();

  useEffect(() => {
    if (status !== "authenticated" || !pathname) return;

    void fetch("/api/user/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "NAVIGATE",
        path: pathname,
        query: query ? `?${query}` : "",
      }),
    }).catch(() => undefined);
  }, [pathname, query, status]);

  return null;
}
