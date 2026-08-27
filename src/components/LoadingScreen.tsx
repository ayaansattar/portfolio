"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const NAME = "Ayaan";
const HOLD_MS = 900;
const EXIT_MS = 500;
const FAILSAFE_MS = 4000;

type Stage = "enter" | "hold" | "exit" | "done";

function lockScroll() {
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}

function resetToTop() {
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

export function LoadingScreen() {
  const finished = useRef(false);
  const [stage, setStage] = useState<Stage>("enter");
  const [nameIn, setNameIn] = useState(false);

  const finishIntro = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    unlockScroll();
    resetToTop();
    window.dispatchEvent(new Event("portfolio-intro-done"));
    setStage("done");
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    lockScroll();
    resetToTop();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishIntro();
      return unlockScroll;
    }

    const enter = window.setTimeout(() => setNameIn(true), 40);
    const hold = window.setTimeout(() => setStage("hold"), 700);
    const failsafe = window.setTimeout(finishIntro, FAILSAFE_MS);

    return () => {
      window.clearTimeout(enter);
      window.clearTimeout(hold);
      window.clearTimeout(failsafe);
      unlockScroll();
    };
  }, [finishIntro]);

  useEffect(() => {
    if (stage !== "hold") return;

    const exitTimer = window.setTimeout(() => setStage("exit"), HOLD_MS);
    const doneTimer = window.setTimeout(finishIntro, HOLD_MS + EXIT_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [stage, finishIntro]);

  if (stage === "done") return null;

  return (
    <div
      className={`loading-screen${stage === "exit" ? " loading-screen-exit" : ""}`}
      aria-hidden={stage === "exit"}
    >
      <p
        className={`loading-screen-name font-script${
          nameIn ? " loading-screen-name-in" : ""
        }${stage === "exit" ? " loading-screen-name-out" : ""}`}
        aria-label={NAME}
      >
        {NAME}
      </p>
    </div>
  );
}
