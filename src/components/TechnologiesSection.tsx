"use client";

import { useCallback, useState } from "react";
import type { Technology } from "@/components/TechSphere";
import { TechSphereLazy } from "@/components/TechSphereLazy";
import { RevealLine } from "@/components/RevealLine";

type TechnologiesSectionProps = {
  technologies: Technology[];
};

export function TechnologiesSection({ technologies }: TechnologiesSectionProps) {
  const [assemble, setAssemble] = useState(false);

  const handleSphereReveal = useCallback(() => {
    setAssemble(true);
  }, []);

  return (
    <section id="technologies" className="bg-surface/45">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
        <RevealLine>
          <h2 className="font-display text-4xl tracking-tight text-text-primary sm:text-5xl">
            Technologies
          </h2>
          <div className="mt-3 h-px w-24 bg-accent" />
        </RevealLine>
        <RevealLine
          className="mt-12 overflow-visible"
          threshold={0.25}
          onReveal={handleSphereReveal}
        >
          <TechSphereLazy technologies={technologies} assemble={assemble} />
        </RevealLine>
      </div>
    </section>
  );
}
