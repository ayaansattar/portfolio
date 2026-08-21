"use client";

type RocketConfig = {
  id: number;
  mode: "across" | "liftoff";
  delay: string;
  duration: string;
  size: number;
  top?: string;
  left?: string;
};

const heroRockets: RocketConfig[] = [
  {
    id: 1,
    mode: "across",
    top: "22%",
    delay: "0s",
    duration: "11s",
    size: 56,
  },
  {
    id: 2,
    mode: "liftoff",
    left: "18%",
    delay: "2.5s",
    duration: "9s",
    size: 48,
  },
  {
    id: 3,
    mode: "across",
    top: "58%",
    delay: "5s",
    duration: "13s",
    size: 44,
  },
  {
    id: 4,
    mode: "liftoff",
    left: "72%",
    delay: "7s",
    duration: "10s",
    size: 52,
  },
  {
    id: 5,
    mode: "across",
    top: "38%",
    delay: "9.5s",
    duration: "12s",
    size: 40,
  },
];

export function HeroRockets() {
  return (
    <div
      className="hero-rockets pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {heroRockets.map((rocket) => (
        <span
          key={rocket.id}
          className={
            rocket.mode === "liftoff"
              ? "hero-rocket hero-rocket-liftoff absolute"
              : "hero-rocket hero-rocket-across absolute"
          }
          style={{
            top: rocket.top,
            left: rocket.left,
            width: rocket.size,
            height: rocket.size * 0.45,
            animationDelay: rocket.delay,
            animationDuration: rocket.duration,
          }}
        >
          <RocketWithJet id={`hero-${rocket.id}`} />
        </span>
      ))}
    </div>
  );
}

function RocketWithJet({ id }: { id: string }) {
  const jetCore = `jetCore-${id}`;
  const jetOuter = `jetOuter-${id}`;

  return (
    <svg viewBox="0 0 80 36" fill="none" className="h-full w-full overflow-visible">
      <g className="hero-rocket-jet">
        <path
          d="M28 18C16 14 8 15 1 18c7 3 15 4 27 0Z"
          fill={`url(#${jetCore})`}
          opacity="0.95"
        />
        <path
          d="M30 18C14 12 6 13 -2 18c8 5 16 6 32 0Z"
          fill={`url(#${jetOuter})`}
          opacity="0.55"
        />
        <path
          d="M26 18c-8-2.5-14-2-20 0 6 2 12 2.5 20 0Z"
          fill="#FFD4A8"
          opacity="0.85"
        />
      </g>

      <g transform="translate(28 6)">
        <path
          d="M8 4h18l10 8-10 8H8c-2.5 0-4.5-2-4.5-4.5v-7C3.5 6 5.5 4 8 4Z"
          fill="#D4D4D0"
        />
        <path d="M36 12 26 6v12l10-6Z" fill="var(--accent)" />
        <rect x="10" y="9" width="8" height="6" rx="3" fill="#0B0C0E" opacity="0.35" />
        <circle cx="14" cy="12" r="2" fill="#8A8A82" />
        <path d="M10 5 4 1 6 8M10 19l-6 4 2-7" fill="#8A8A82" />
        <path
          d="M8 8H4c-1.2 2-1.2 6 0 8h4"
          stroke="#5A5A54"
          strokeWidth="1"
          opacity="0.8"
        />
      </g>

      <defs>
        <linearGradient
          id={jetCore}
          x1="28"
          y1="18"
          x2="0"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6B1A" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#FF6B1A" stopOpacity="0.45" />
          <stop offset="1" stopColor="#FF6B1A" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={jetOuter}
          x1="30"
          y1="18"
          x2="-2"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6B1A" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FF6B1A" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
