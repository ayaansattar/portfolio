"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const NAME = "Ayaan";
const HOLD_MS = 1000;
const EXIT_MS = 500;
const VIDEO_FADE_MS = 400;

const INTRO_MP4 = "/intro/crt-enter.mp4";
/** Start the seamless name handoff this many seconds before video end. */
const HANDOFF_LEAD_S = 0.08;

type Stage = "video" | "name" | "exit" | "done";

export function LoadingScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const handedOff = useRef(false);
  const [stage, setStage] = useState<Stage>("video");
  const [showVideo, setShowVideo] = useState(true);
  const [videoOut, setVideoOut] = useState(false);

  const finishIntro = useCallback(() => {
    document.body.style.overflow = "";
    window.dispatchEvent(new Event("portfolio-intro-done"));
    setStage("done");
  }, []);

  const goToName = useCallback(() => {
    if (handedOff.current) return;
    handedOff.current = true;

    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
      } catch {
        // ignore
      }
    }

    // Overlay stays opaque black. Name appears instantly; video fades under it.
    setVideoOut(true);
    setStage("name");
  }, []);

  // Lock scroll for the whole intro. Do not unlock on effect cleanup —
  // React Strict Mode remount was unlocking early and flashing the homepage.
  useEffect(() => {
    document.body.style.overflow = "hidden";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      handedOff.current = true;
      setShowVideo(false);
      setStage("name");
    }
  }, []);

  // After video fade completes, drop the video element.
  useEffect(() => {
    if (!videoOut) return;
    const timer = window.setTimeout(() => setShowVideo(false), VIDEO_FADE_MS);
    return () => window.clearTimeout(timer);
  }, [videoOut]);

  // Name hold → fade overlay → site.
  useEffect(() => {
    if (stage !== "name") return;

    const exitTimer = window.setTimeout(() => setStage("exit"), HOLD_MS);
    const doneTimer = window.setTimeout(finishIntro, HOLD_MS + EXIT_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [stage, finishIntro]);

  // Start playback; hand off near the end via rAF (reliable under load).
  useEffect(() => {
    if (stage !== "video") return;
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;

    const watch = () => {
      if (handedOff.current) return;
      if (
        Number.isFinite(video.duration) &&
        video.duration > 0 &&
        video.currentTime >= video.duration - HANDOFF_LEAD_S
      ) {
        goToName();
        return;
      }
      raf = window.requestAnimationFrame(watch);
    };

    const tryPlay = () => {
      video
        .play()
        .then(() => {
          raf = window.requestAnimationFrame(watch);
        })
        .catch(() => {
          goToName();
        });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    return () => {
      window.cancelAnimationFrame(raf);
      video.removeEventListener("canplay", tryPlay);
    };
  }, [stage, goToName]);

  if (stage === "done") return null;

  return (
    <div
      className={`loading-screen loading-screen--crt${
        stage === "exit" ? " loading-screen-exit" : ""
      }`}
      aria-hidden={stage === "exit"}
    >
      {showVideo ? (
        <video
          ref={videoRef}
          className={`loading-screen-crt-video${
            videoOut ? " loading-screen-crt-video--out" : ""
          }`}
          src={INTRO_MP4}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onEnded={goToName}
          onError={goToName}
        />
      ) : null}

      {(stage === "name" || stage === "exit") && (
        <p
          className={`loading-screen-name font-script loading-screen-name--seamless${
            stage === "exit" ? " loading-screen-name-out" : ""
          }`}
          aria-label={NAME}
        >
          {NAME}
        </p>
      )}
    </div>
  );
}
