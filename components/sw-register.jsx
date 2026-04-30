"use client";

import { useEffect } from "react";

/**
 * Service Worker Registration Component
 * - Only registers SW in PRODUCTION to avoid Workbox NetworkFirst errors in dev
 * - Safely unregisters any stale SW found in development
 */
export default function SWRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const isDev = process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isDev) {
      // In development: unregister any old service workers to prevent stale cache issues
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length > 0) {
          registrations.forEach((reg) => {
            reg.unregister();
            console.log("[SW] Unregistered stale service worker in dev mode:", reg.scope);
          });
        }
      });
      return; // Do NOT register SW in development
    }

    // Production only: register the service worker
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[SW] Registered successfully:", reg.scope);
        })
        .catch((err) => {
          console.error("[SW] Registration failed:", err);
        });
    });
  }, []);

  return null; // This component renders nothing
}
