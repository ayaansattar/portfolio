"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LightTunnel = dynamic(() => import("@/components/LightTunnel"), {
  ssr: false,
});

export function HeroLightTunnel() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setEnabled(!reduceMotion);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 opacity-55"
    >
      <LightTunnel
        cableColor="#C45A28"
        pulseColor="#FF7A33"
        tunnelColor="#8B3A12"
        tunnelOpacity={0}
        speed={0.08}
        flowDirection="outward"
        pulseSpeed={1.5}
        pulseLength={0.24}
        pulseBlend={1}
        pulseWidth={0.9}
        cableCount={18}
        thickness={0.3}
        rimWidth={0.12}
        waviness={0.25}
        sway={0.35}
        size={1.05}
        centerX={0.0}
        centerY={0.0}
        glow={0.7}
        fadeNear={0.55}
        fadeFar={1.9}
        brightness={0.75}
        colorVariance
        grain
        grainIntensity={0.035}
        opacity={0.85}
        mouseInteraction={false}
        mouseStrength={0.1}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,var(--bg)_82%)]" />
    </div>
  );
}
