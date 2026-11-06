"use client";

import { useEffect } from "react";

export default function ScreenWakeLock() {
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    let disposed = false;
    let requesting = false;

    const requestWakeLock = async () => {
      if (
        disposed ||
        requesting ||
        document.visibilityState !== "visible" ||
        !("wakeLock" in navigator)
      ) {
        return;
      }

      if (wakeLock && !wakeLock.released) return;

      requesting = true;

      try {
        const sentinel = await navigator.wakeLock.request("screen");

        if (disposed) {
          await sentinel.release();
          return;
        }

        wakeLock = sentinel;

        sentinel.addEventListener(
          "release",
          () => {
            if (wakeLock === sentinel) {
              wakeLock = null;
            }
          },
          { once: true },
        );
      } catch (error) {
        console.warn("Screen Wake Lock unavailable:", error);
      } finally {
        requesting = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };

    const handlePageShow = () => {
      requestWakeLock();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    window.addEventListener("pageshow", handlePageShow);

    requestWakeLock();

    return () => {
      disposed = true;

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      window.removeEventListener("pageshow", handlePageShow);

      if (wakeLock && !wakeLock.released) {
        wakeLock.release();
        wakeLock = null;
      }
    };
  }, []);

  return null;
}
