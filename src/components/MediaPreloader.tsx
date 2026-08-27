"use client";

import { useEffect } from "react";

const PROJECT_VIDEOS = [
  "/projects/FixSpotify.mp4",
  "/projects/OneStopProf.mp4",
  "/projects/UAppen.mp4",
  "/projects/CineLog.mp4",
];

const EXPERIENCE_VIDEOS = [
  "/experience/NBDC_landing.mp4",
  "/experience/NBDC_partners.mp4",
  "/experience/NBDC.mp4",
];

type MediaPreloaderProps = {
  logos: string[];
};

/**
 * Warms caches after the intro finishes so it never competes with first paint.
 */
export function MediaPreloader({ logos }: MediaPreloaderProps) {
  useEffect(() => {
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback.bind(window)
        : (cb: IdleRequestCallback) =>
            window.setTimeout(
              () => cb({ didTimeout: false, timeRemaining: () => 0 }),
              200,
            );

    const cancelIdle =
      typeof window.cancelIdleCallback === "function"
        ? window.cancelIdleCallback.bind(window)
        : window.clearTimeout.bind(window);

    const controllers: AbortController[] = [];
    const imageCache: HTMLImageElement[] = [];
    let idleId = 0;
    let laterId = 0;
    let started = false;

    const preloadLogos = () => {
      for (const src of logos) {
        const img = new Image();
        img.decoding = "async";
        img.src = src;
        imageCache.push(img);
      }
    };

    const warmVideo = (src: string) => {
      const controller = new AbortController();
      controllers.push(controller);
      void fetch(src, {
        method: "GET",
        headers: { Range: "bytes=0-1500000" },
        signal: controller.signal,
      }).catch(() => {});
    };

    const startWarming = () => {
      if (started) return;
      started = true;

      idleId = idle(() => {
        preloadLogos();
        warmVideo(PROJECT_VIDEOS[0]!);
      }) as number;

      laterId = window.setTimeout(() => {
        for (const src of PROJECT_VIDEOS.slice(1)) warmVideo(src);
        for (const src of EXPERIENCE_VIDEOS) warmVideo(src);
        void import("@/components/TechSphere");
      }, 1200);
    };

    window.addEventListener("portfolio-intro-done", startWarming);
    const fallback = window.setTimeout(startWarming, 7000);

    return () => {
      window.removeEventListener("portfolio-intro-done", startWarming);
      window.clearTimeout(fallback);
      cancelIdle(idleId);
      window.clearTimeout(laterId);
      for (const controller of controllers) controller.abort();
    };
  }, [logos]);

  return null;
}
