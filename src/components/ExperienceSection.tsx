"use client";

import { RevealLine } from "@/components/RevealLine";

type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  location?: string;
  mode?: string;
  bullets: string[];
};

const experiences: ExperienceItem[] = [
  {
    role: "Front-End Engineer",
    org: "No Bad Days Club — Gamified travel and experiences",
    period: "Nov 2025 – Present",
    location: "Remote",
    bullets: [
      "Collaborated with cross-functional teams to build a multi-page marketing site using Next.js 14, React 18, TypeScript, and Tailwind CSS for consumer and partner audiences, increasing user engagement by 73%.",
      "Implemented responsive, mobile-first layouts and optimized performance with image optimization, custom font loading, and smooth navigation.",
      "Refactored the app codebase from a monorepo to multiple repos, documenting workflows to clearly explain technical changes to collaborators and improve maintainability and CI/CD.",
    ],
  },
  {
    role: "Office Staff",
    org: "UMass Amherst New Student and Family Programs",
    period: "May 2026 – Present",
    location: "Amherst, MA",
    bullets: [
      "Managed front-line communications via Salesforce, responding to email and phone inquiries from 6,300+ students and 2,500+ family members regarding orientation logistics and program details.",
      "Awarded Office Staff of the Year for outstanding performance and reliability.",
    ],
  },
  {
    role: "Resident Assistant",
    org: "UMass Amherst",
    period: "Aug 2025 – Present",
    location: "Amherst, MA",
    bullets: [
      "Served as primary contact for 30+ residents, providing academic, personal, and housing support (15–20 hrs/week).",
      "Organized 5+ community events per semester (20–25 attendees) while upholding university policies.",
    ],
  },
  {
    role: "Orientation Leader",
    org: "UMass Amherst New Student and Family Programs",
    period: "May 2025 – Jan 2026",
    location: "Amherst, MA",
    bullets: [
      "Facilitated comprehensive campus tours and informational Q&A sessions to welcome 6,300+ students and 2,500+ family members, successfully fostering a positive transition to UMass Amherst.",
      "Supported staff recruitment through outreach campaigns targeting prospective student leaders and peer mentors.",
    ],
  },
];

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="border-y border-border-dim bg-surface/80"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
        <RevealLine>
          <h2 className="font-display text-4xl tracking-tight text-text-primary sm:text-5xl">
            Experience
          </h2>
          <div className="mt-3 h-px w-24 bg-accent" />
        </RevealLine>

        <div className="mt-14 space-y-16">
          {experiences.map((item) => (
            <article
              key={`${item.role}-${item.org}`}
              className="relative pl-8 sm:pl-10"
            >
              <div className="absolute top-2 bottom-0 left-0 w-px bg-border-dim" />
              <div className="absolute top-2 left-[-4px] h-2.5 w-2.5 rounded-full bg-accent" />

              <RevealLine>
                <h3 className="font-display text-3xl tracking-tight text-text-primary sm:text-4xl">
                  {item.role}
                </h3>
              </RevealLine>

              <RevealLine>
                <p className="mt-2 text-xl text-text-secondary">{item.org}</p>
              </RevealLine>

              <RevealLine>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-dim">
                  <span className="inline-flex items-center gap-2">
                    <CalendarIcon />
                    {item.period}
                  </span>
                  {item.location ? (
                    <span className="inline-flex items-center gap-2">
                      <PinIcon />
                      {item.location}
                    </span>
                  ) : null}
                  {item.mode ? (
                    <span className="inline-flex items-center gap-2">
                      <BriefcaseIcon />
                      {item.mode}
                    </span>
                  ) : null}
                </div>
              </RevealLine>

              <ul className="mt-6 space-y-3">
                {item.bullets.map((bullet) => (
                  <RevealLine key={bullet}>
                    <li className="flex gap-3 text-base leading-relaxed text-text-secondary">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                      <span>{bullet}</span>
                    </li>
                  </RevealLine>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.8 12 21 12 21z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 13h18" />
    </svg>
  );
}
