"use client";

import { useEffect, useRef, useState } from "react";

type RevealLineProps = {
  children: React.ReactNode;
  /** Controlled mode — if provided, parent drives visibility */
  show?: boolean;
  delayMs?: number;
  className?: string;
  /** How much of the line must be visible before it reveals (self mode only) */
  threshold?: number;
  /** Fires once when this line reveals (self or controlled) */
  onReveal?: () => void;
};

export function RevealLine({
  children,
  show,
  delayMs = 0,
  className = "",
  threshold = 0.45,
  onReveal,
}: RevealLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const revealedRef = useRef(false);
  const controlled = show !== undefined;
  const visible = controlled ? Boolean(show) : inView;

  useEffect(() => {
    if (controlled) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -12% 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [controlled, threshold]);

  useEffect(() => {
    if (!visible || revealedRef.current) return;
    revealedRef.current = true;
    onReveal?.();
  }, [visible, onReveal]);

  return (
    <div
      ref={ref}
      className={`reveal-line ${visible ? "reveal-line-visible" : ""} ${className}`}
      style={{ transitionDelay: controlled ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
