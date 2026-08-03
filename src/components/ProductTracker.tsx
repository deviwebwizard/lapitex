"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProductTracker({ productId }: { productId: string }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) return;

    fetch("/api/user/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "VIEW_PRODUCT", productId })
    }).catch(() => {});
  }, [productId, session]);

  return null;
}
