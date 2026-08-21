"use client";

import { useEffect, useState } from "react";
import PillNav from "@/components/PillNav";

const NAV_ITEMS = [
  { id: "top", label: "Home", href: "#top" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "technologies", label: "Technologies", href: "#technologies" },
] as const;

export function SiteNav() {
  const [activeHref, setActiveHref] = useState("#top");

  useEffect(() => {
    let frame = 0;

    const updateActive = () => {
      frame = 0;

      const sections = NAV_ITEMS.map((item) => {
        const el = document.getElementById(item.id);
        return el ? { href: item.href, el } : null;
      }).filter(Boolean) as Array<{ href: string; el: HTMLElement }>;

      if (sections.length === 0) return;

      const viewH = window.innerHeight;
      const scrollBottom =
        viewH + window.scrollY >= document.documentElement.scrollHeight - 8;

      if (scrollBottom) {
        const last = sections[sections.length - 1];
        setActiveHref((prev) => (prev === last.href ? prev : last.href));
        return;
      }

      // Prefer the section that occupies the most of the upper viewport band.
      // This tracks Projects/Experience correctly even with a tall Home hero.
      const bandTop = 0;
      const bandBottom = viewH * 0.55;
      let active = sections[0];
      let bestVisible = -1;

      for (const section of sections) {
        const rect = section.el.getBoundingClientRect();
        const visible =
          Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop);
        if (visible > bestVisible) {
          bestVisible = visible;
          active = section;
        }
      }

      setActiveHref((prev) => (prev === active.href ? prev : active.href));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", updateActive);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", updateActive);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <PillNav
      items={NAV_ITEMS.map(({ label, href }) => ({ label, href }))}
      activeHref={activeHref}
      ease="power2.easeOut"
      baseColor="#ff6b1a"
      pillColor="#0b0c0e"
      pillTextColor="#d4d4d0"
      hoveredPillTextColor="#0b0c0e"
      initialLoadAnimation
    />
  );
}
