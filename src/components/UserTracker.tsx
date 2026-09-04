"use client";

import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { COOKIE_CONSENT_COOKIE, getCookieConsent } from "@/lib/cookieConsent";

export default function UserTracker() {
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const prevItemsRef = useRef(items);
  const [cookieConsent, setCookieConsent] = useState<"allow" | "deny" | null>(null);

  useEffect(() => {
    const syncConsent = () => setCookieConsent(getCookieConsent());
    syncConsent();
    window.addEventListener(`${COOKIE_CONSENT_COOKIE}-changed`, syncConsent);
    return () => window.removeEventListener(`${COOKIE_CONSENT_COOKIE}-changed`, syncConsent);
  }, []);

  // Ping server every 5 minutes to keep lastOnline updated
  useEffect(() => {
    if (!session?.user || cookieConsent !== "allow") return;

    const pingServer = () => {
      fetch("/api/user/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "PING" })
      }).catch(() => {});
    };

    pingServer(); // initial ping
    const interval = setInterval(pingServer, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cookieConsent, session]);

  // Sync cart when it changes
  useEffect(() => {
    if (!session?.user || cookieConsent !== "allow") return;

    // Check if cart actually changed to avoid unnecessary requests
    if (JSON.stringify(items) !== JSON.stringify(prevItemsRef.current)) {
      fetch("/api/user/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SYNC_CART", cartItems: items })
      }).catch(() => {});
      
      prevItemsRef.current = items;
    }
  }, [cookieConsent, items, session]);

  return null;
}
