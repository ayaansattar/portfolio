"use client";

import { useEffect, useRef } from "react";

type Spec = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

type ConstellationBackgroundProps = {
  className?: string;
  /** fixed = whole viewport, absolute = fill parent */
  mode?: "fixed" | "absolute";
  /** accent for light pages, mist for dark hero */
  tone?: "accent" | "mist";
};

const LINK_DISTANCE = 120;
const CURSOR_DISTANCE = 150;
const MAX_SPECS = 90;

const TONES = {
  accent: "15, 107, 86",
  mist: "232, 240, 236",
} as const;

export function ConstellationBackground({
  className = "",
  mode = "fixed",
  tone = "accent",
}: ConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const color = TONES[tone];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let specs: Spec[] = [];
    let animationId = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    let mouseActive = false;

    const createSpecs = () => {
      const area = width * height;
      const count = Math.min(
        MAX_SPECS,
        Math.max(36, Math.floor(area / 18000)),
      );
      specs = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width =
        mode === "fixed" ? window.innerWidth : (parent?.clientWidth ?? window.innerWidth);
      height =
        mode === "fixed"
          ? window.innerHeight
          : (parent?.clientHeight ?? window.innerHeight);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createSpecs();
    };

    const getHole = () => {
      if (mode !== "fixed") return null;
      const el = document.querySelector("[data-constellation-hole]");
      if (!(el instanceof HTMLElement)) return null;

      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > height || rect.right < 0 || rect.left > width) {
        return null;
      }

      return {
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
        radius: Math.min(rect.width, rect.height) * 0.56,
      };
    };

    const inHole = (
      x: number,
      y: number,
      hole: { cx: number; cy: number; radius: number } | null,
    ) => {
      if (!hole) return false;
      return Math.hypot(x - hole.cx, y - hole.cy) < hole.radius;
    };

    const localMouse = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        inside:
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom,
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const hole = getHole();

      for (let i = 0; i < specs.length; i += 1) {
        const a = specs[i];

        if (!reduceMotion) {
          a.x += a.vx;
          a.y += a.vy;

          if (a.x < 0 || a.x > width) a.vx *= -1;
          if (a.y < 0 || a.y > height) a.vy *= -1;
          a.x = Math.max(0, Math.min(width, a.x));
          a.y = Math.max(0, Math.min(height, a.y));
        }

        // Keep specs outside the tech sphere area.
        if (hole && inHole(a.x, a.y, hole)) {
          const dx = a.x - hole.cx;
          const dy = a.y - hole.cy;
          const dist = Math.hypot(dx, dy) || 1;
          const push = hole.radius + 4;
          a.x = hole.cx + (dx / dist) * push;
          a.y = hole.cy + (dy / dist) * push;
          a.vx += (dx / dist) * 0.08;
          a.vy += (dy / dist) * 0.08;
        }

        const aBlocked = inHole(a.x, a.y, hole);

        for (let j = i + 1; j < specs.length; j += 1) {
          const b = specs[j];
          if (aBlocked || inHole(b.x, b.y, hole)) continue;

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * (tone === "mist" ? 0.22 : 0.28);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        if (mouseActive && !aBlocked && !inHole(mouseX, mouseY, hole)) {
          const dx = a.x - mouseX;
          const dy = a.y - mouseY;
          const dist = Math.hypot(dx, dy);

          if (dist < CURSOR_DISTANCE) {
            const alpha =
              (1 - dist / CURSOR_DISTANCE) * (tone === "mist" ? 0.45 : 0.55);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();

            if (!reduceMotion) {
              a.vx += dx * -0.00035;
              a.vy += dy * -0.00035;
              a.vx *= 0.98;
              a.vy *= 0.98;
            }
          }
        }

        if (aBlocked) continue;

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${tone === "mist" ? 0.45 : 0.55})`;
        ctx.fill();
      }

      animationId = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const point = localMouse(event);
      mouseActive = point.inside;
      mouseX = point.x;
      mouseY = point.y;
    };

    const onPointerLeave = () => {
      mouseActive = false;
      mouseX = -9999;
      mouseY = -9999;
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
    };
  }, [color, mode, tone]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${
        mode === "fixed" ? "fixed inset-0 z-0" : "absolute inset-0"
      } ${className}`}
      aria-hidden="true"
    />
  );
}
