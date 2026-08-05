"use client";

import dynamic from "next/dynamic";
import type { Technology } from "@/components/TechSphere";

const TechSphere = dynamic(
  () =>
    import("@/components/TechSphere").then((module) => module.TechSphere),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto flex h-[min(70vw,28rem)] w-full max-w-3xl items-center justify-center text-sm text-ink-soft">
        Loading technologies…
      </div>
    ),
  },
);

type TechSphereLazyProps = {
  technologies: Technology[];
  assemble?: boolean;
};

export function TechSphereLazy({
  technologies,
  assemble = false,
}: TechSphereLazyProps) {
  return <TechSphere technologies={technologies} assemble={assemble} />;
}
