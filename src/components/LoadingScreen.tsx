"use client";

import { useEffect, useState } from "react";

const NAME = "Ayaan";
const LETTERS = NAME.split("");
const STAGGER_MS = 95;
const LETTER_DURATION_MS = 700;
const HOLD_MS = 700;

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
      }, 350);
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = previousOverflow;
      };
    }

    const enterStart = 50;
    const enterDone =
      enterStart + (LETTERS.length - 1) * STAGGER_MS + LETTER_DURATION_MS;
    const exitStart = enterDone + HOLD_MS;
    const exitDone =
      exitStart + (LETTERS.length - 1) * STAGGER_MS + LETTER_DURATION_MS;
    const screenFade = 450;

    const enterTimer = window.setTimeout(() => setPhase("enter"), enterStart);
    const holdTimer = window.setTimeout(() => setPhase("hold"), enterDone);
    const exitTimer = window.setTimeout(() => setPhase("exit"), exitStart);
    const goneTimer = window.setTimeout(() => {
      setPhase("gone");
      document.body.style.overflow = previousOverflow;
    }, exitDone + screenFade);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(goneTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`loading-screen ${phase === "exit" ? "loading-screen-exit" : ""}`}
      style={
        phase === "exit"
          ? {
              transitionDelay: `${
                (LETTERS.length - 1) * STAGGER_MS + LETTER_DURATION_MS * 0.35
              }ms`,
            }
          : undefined
      }
      aria-hidden={phase === "exit" || phase === "gone"}
    >
      <p className="loading-screen-name font-script" aria-label={NAME}>
        {LETTERS.map((letter, index) => {
          const delay =
            phase === "exit"
              ? `${index * STAGGER_MS}ms`
              : `${index * STAGGER_MS}ms`;

          let letterClass = "loading-screen-letter";
          if (phase === "enter" || phase === "hold") {
            letterClass += " loading-screen-letter-in";
          } else if (phase === "exit") {
            letterClass += " loading-screen-letter-out";
          }

          return (
            <span
              key={`${letter}-${index}`}
              className={letterClass}
              style={{ transitionDelay: delay }}
              aria-hidden="true"
            >
              {letter}
            </span>
          );
        })}
      </p>
    </div>
  );
}
