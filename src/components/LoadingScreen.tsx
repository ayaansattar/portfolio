"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const NAME = "Ayaan";
const LETTERS = NAME.split("");
const STAGGER_MS = 95;
const LETTER_DURATION_MS = 700;
const HOLD_MS = 700;
const LETTER_SCREEN_FADE_MS = 450;

const INTRO_MP4 = "/intro/crt-enter.mp4";
/** Cut to the name intro this many seconds before video end. */
const VIDEO_HANDOFF_LEAD_S = 0.35;

type Phase = "boot" | "video" | "enter" | "hold" | "exit" | "gone";

function unlockScroll() {
  document.body.style.overflow = "";
}

export function LoadingScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoHandoffStarted = useRef(false);
  const [phase, setPhase] = useState<Phase>("boot");
  const [mode, setMode] = useState<"video" | "letters">("video");

  /** Opaque cut: video → name intro. Never fade the overlay away here or the site flashes. */
  const startLetters = useCallback(() => {
    if (videoHandoffStarted.current) return;
    videoHandoffStarted.current = true;
    setMode("letters");
    setPhase("boot");
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      videoHandoffStarted.current = true;
      setMode("letters");
    } else {
      setPhase("video");
    }

    return () => unlockScroll();
  }, []);

  // Name intro → homepage (only place we fade the overlay to reveal the site).
  useEffect(() => {
    if (mode !== "letters") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setPhase("enter");
      const timer = window.setTimeout(() => {
        setPhase("gone");
        unlockScroll();
      }, 350);
      return () => window.clearTimeout(timer);
    }

    setPhase("boot");
    const enterStart = 50;
    const enterDone =
      enterStart + (LETTERS.length - 1) * STAGGER_MS + LETTER_DURATION_MS;
    const exitStart = enterDone + HOLD_MS;
    const exitDone =
      exitStart + (LETTERS.length - 1) * STAGGER_MS + LETTER_DURATION_MS;

    const enterTimer = window.setTimeout(() => setPhase("enter"), enterStart);
    const holdTimer = window.setTimeout(() => setPhase("hold"), enterDone);
    const exitTimer = window.setTimeout(() => setPhase("exit"), exitStart);
    const goneTimer = window.setTimeout(() => {
      setPhase("gone");
      unlockScroll();
    }, exitDone + LETTER_SCREEN_FADE_MS);

    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
      window.clearTimeout(goneTimer);
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== "video" || phase !== "video") return;
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => startLetters());
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
      return () => video.removeEventListener("canplay", tryPlay);
    }
  }, [mode, phase, startLetters]);

  if (phase === "gone") return null;

  if (mode === "video") {
    return (
      <div className="loading-screen loading-screen--crt" aria-hidden="true">
        {phase === "video" ? (
          <video
            ref={videoRef}
            className="loading-screen-crt-video"
            src={INTRO_MP4}
            muted
            playsInline
            autoPlay
            preload="auto"
            onTimeUpdate={() => {
              const video = videoRef.current;
              if (
                !video ||
                videoHandoffStarted.current ||
                !Number.isFinite(video.duration)
              ) {
                return;
              }
              if (video.currentTime >= video.duration - VIDEO_HANDOFF_LEAD_S) {
                startLetters();
              }
            }}
            onEnded={startLetters}
            onError={startLetters}
          />
        ) : null}
      </div>
    );
  }

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
      aria-hidden={phase === "exit"}
    >
      <p className="loading-screen-name font-script" aria-label={NAME}>
        {LETTERS.map((letter, index) => {
          const delay = `${index * STAGGER_MS}ms`;

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
