"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";

export default function UserTracker() {
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const prevItemsRef = useRef(items);

  // Ping server every 5 minutes to keep lastOnline updated
  useEffect(() => {
    if (!session?.user) return;

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
  }, [session]);

  // Sync cart when it changes
  useEffect(() => {
    if (!session?.user) return;

    // Check if cart actually changed to avoid unnecessary requests
    if (JSON.stringify(items) !== JSON.stringify(prevItemsRef.current)) {
      fetch("/api/user/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SYNC_CART", cartItems: items })
      }).catch(() => {});
      
      prevItemsRef.current = items;
    }
  }, [items, session]);

  return null;
}
