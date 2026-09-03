"use client";

import { useEffect } from "react";

const sessionStorageKey = "lapitex-admin-session-id";
const deviceStorageKey = "lapitex-admin-device-key";

function getDeviceKey() {
  let deviceKey = window.localStorage.getItem(deviceStorageKey);
  if (!deviceKey) {
    deviceKey = crypto.randomUUID();
    window.localStorage.setItem(deviceStorageKey, deviceKey);
  }
  return deviceKey;
}

export function AdminSessionTracker() {
  useEffect(() => {
    let sessionId = window.localStorage.getItem(sessionStorageKey);
    const startSession = async () => {
      if (!sessionId) {
        const response = await fetch("/api/admin/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceKey: getDeviceKey() }),
        });
        if (response.ok) {
          const data = await response.json();
          if (typeof data.sessionId === "string") {
            sessionId = data.sessionId;
            window.localStorage.setItem(sessionStorageKey, data.sessionId);
          }
        }
      }
    };

    void startSession();
    const heartbeat = window.setInterval(() => {
      if (sessionId) {
        void fetch("/api/admin/sessions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      }
    }, 60_000);
    return () => window.clearInterval(heartbeat);
  }, []);

  return null;
}

export const ADMIN_SESSION_STORAGE_KEY = sessionStorageKey;
