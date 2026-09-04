"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getSession, useSession } from "next-auth/react";
import { getCookieConsent } from "@/lib/cookieConsent";

export function UserActivityTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const query = searchParams.toString();
  const lastSessionRefreshRef = useRef(0);

  useEffect(() => {
    if (status !== "authenticated" || !pathname || getCookieConsent() !== "allow") return;

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

  // NextAuth refreshes the JWT cookie when the session endpoint is read. Tie
  // that refresh to real activity so an idle tab still expires after one hour.
  useEffect(() => {
    if (status !== "authenticated") return;

    const refreshSessionOnActivity = () => {
      const now = Date.now();
      if (now - lastSessionRefreshRef.current < 5 * 60 * 1000) return;
      lastSessionRefreshRef.current = now;
      void getSession();
    };

    const activityEvents = ["pointerdown", "keydown", "scroll", "touchstart", "focus"] as const;
    activityEvents.forEach((eventName) => window.addEventListener(eventName, refreshSessionOnActivity, { passive: true }));

    return () => activityEvents.forEach((eventName) => window.removeEventListener(eventName, refreshSessionOnActivity));
  }, [status]);

  return null;
}
