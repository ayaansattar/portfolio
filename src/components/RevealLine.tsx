"use client";

import { useEffect, useRef, useState } from "react";

type RevealLineProps = {
  children: React.ReactNode;
  className?: string;
  /** How much of the line must be visible before it reveals */
  threshold?: number;
  /** Fires once when this line reveals */
  onReveal?: () => void;
};

export function RevealLine({
  children,
  className = "",
  threshold = 0.45,
  onReveal,
}: RevealLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const revealedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
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
  }, [threshold]);

  useEffect(() => {
    if (!visible || revealedRef.current) return;
    revealedRef.current = true;
    onReveal?.();
  }, [visible, onReveal]);

  return (
    <div
      ref={ref}
      className={`reveal-line ${visible ? "reveal-line-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
