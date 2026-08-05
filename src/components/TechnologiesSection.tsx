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
    <section
      id="technologies"
      className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10"
    >
      <RevealLine>
        <h2 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Technologies
        </h2>
      </RevealLine>
      <RevealLine>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Drag the sphere to explore the tools I use and what I&apos;m learning
          next.
        </p>
      </RevealLine>
      <RevealLine className="mt-10" threshold={0.25} onReveal={handleSphereReveal}>
        <TechSphereLazy technologies={technologies} assemble={assemble} />
      </RevealLine>
    </section>
  );
}
