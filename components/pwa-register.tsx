"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Clear out any old broken service workers and register the safe cache v2
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.update();
        }
      });

      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      }
    }
  }, []);

  return null;
}
