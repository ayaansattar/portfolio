"use client";

import dynamic from "next/dynamic";

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
  technologies: string[];
};

export function TechSphereLazy({ technologies }: TechSphereLazyProps) {
  return <TechSphere technologies={technologies} />;
}
