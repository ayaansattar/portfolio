"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [phase, setPhase] = useState<
    "boot" | "enter" | "hold" | "exit" | "gone"
  >("boot");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setPhase("enter");
      const timer = window.setTimeout(() => {
        setPhase("gone");
        document.body.style.overflow = previousOverflow;
      }, 400);
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = previousOverflow;
      };
    }

    const enterTimer = window.setTimeout(() => setPhase("enter"), 40);
    const exitTimer = window.setTimeout(() => setPhase("exit"), 1700);
    const goneTimer = window.setTimeout(() => {
      setPhase("gone");
      document.body.style.overflow = previousOverflow;
    }, 2500);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(goneTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (phase === "gone") return null;

  const nameVisible = phase === "enter" || phase === "hold";

  return (
    <div
      className={`loading-screen ${phase === "exit" ? "loading-screen-exit" : ""}`}
      aria-hidden={phase === "exit"}
    >
      <p
        className={`loading-screen-name font-display ${
          nameVisible ? "loading-screen-name-visible" : ""
        }`}
      >
        Ayaan
      </p>
    </div>
  );
}
