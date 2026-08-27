"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lanyard = dynamic(() => import("@/components/Lanyard"), {
  ssr: false,
});

const CARD_INFO = {
  name: "Ayaan",
  title: "Turns non-issues into full-stack apps.",
  website: "aasattar.dev",
  backNote: "Building things on the web.",
} as const;

const CARD_ASSETS = [
  "/lanyard/card.glb",
  "/lanyard/lanyard.png",
  "/id/portrait.jpg",
] as const;

function warmLanyardAssets() {
  void import("@/components/Lanyard");
  for (const href of CARD_ASSETS) {
    void fetch(href, { method: "GET", credentials: "same-origin" }).catch(
      () => {},
    );
  }
}

export function HeroLanyard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    warmLanyardAssets();
  }, []);

  return (
    <div
      className={
        isMobile
          ? "pointer-events-none absolute inset-x-0 top-0 z-[5] h-[52%]"
          : "pointer-events-none absolute inset-0 z-30"
      }
      aria-hidden="true"
    >
      <Lanyard
        position={isMobile ? [0, -0.35, 14] : [0, -1.6, 13]}
        gravity={[0, -40, 0]}
        fov={isMobile ? 22 : 20}
        transparent
        frontImage="/id/portrait.jpg"
        imageFit="cover"
        lanyardWidth={isMobile ? 1.15 : 1.25}
        hangOffset={isMobile ? [0, 3.35, 0] : [2.15, 4, 0]}
        cardInfo={CARD_INFO}
        interactive={!isMobile}
      />
    </div>
  );
}
