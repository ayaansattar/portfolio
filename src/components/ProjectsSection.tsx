"use client";

import { useMemo, useState } from "react";
import DepthCarousel from "@/components/DepthCarousel";
import { RevealLine } from "@/components/RevealLine";

type ProjectItem = {
  title: string;
  tagline: string;
  description: string;
  stack: string;
  href?: string;
  github?: string;
  image?: string;
  video?: string;
  frame?: "mobile" | "browser";
};

const projects: ProjectItem[] = [
  {
    title: "FixSpotify",
    tagline: "Full-stack Spotify management with smarter playlist intelligence.",
    description:
      "A full-stack Spotify management platform with OAuth, hourly playlist sync, and a SQLite history layer — deployed with Docker Compose and GitHub Actions. Resolves duplicate tracks by ISRC/title, mixes playlists with a weighted shuffle (batched for Spotify’s API limits), and uses Gemini to flag misfiled songs against your playlist intents.",
    stack: "Next.js · TypeScript · NextAuth · Prisma · SQLite · Docker · Gemini API",
    href: "https://fixspotify.duckdns.org",
    github: "https://github.com/ayaansattar/FixSpotify",
    video: "/projects/FixSpotify.mp4",
  },
  {
    title: "OneStopProf",
    tagline: "RAG course-planning assistant grounded in Rate My Professors reviews.",
    description:
      "Scrapes Rate My Professors via GraphQL, embeds reviews locally with sentence-transformers, and stores vectors in ChromaDB for semantic search. Course- and professor-aware filters (e.g. CS220) narrow evidence for recommendations and Q&A, then Groq’s Llama 3.3 returns cited answers in a multi-mode Streamlit app.",
    stack:
      "Python · Streamlit · ChromaDB · Groq API · sentence-transformers · httpx",
    href: "https://onestopprof.streamlit.app/",
    github: "https://github.com/ayaansattar/OneStopProf",
    video: "/projects/OneStopProf.mp4",
  },
  {
    title: "UAppen",
    tagline: "Campus events app for UMass — filtered across 50+ locations.",
    description:
      "Team-built React Native app with @umass.edu-restricted Supabase auth and dynamic event filtering across campus. A FastAPI pipeline scrapes and syncs events every two hours (paginated API, SQLite dedup, under 10s sync latency). Regex location parsing mapped 50+ buildings and 30+ raw event types into 10 categories, cutting parsing errors by 90%.",
    stack:
      "React Native · TypeScript · Expo · FastAPI · Python · Supabase · SQLite",
    github: "https://github.com/ayaansattar/UAppen",
    video: "/projects/UAppen.mp4",
    frame: "mobile",
  },
  {
    title: "CineLog",
    tagline: "Full-stack movie and TV tracker with mood-aware recommendations.",
    description:
      "A movie/TV tracker with TMDB search, watch states, ratings, and season progress — on Render with Neon Postgres. Imports Letterboxd CSVs and PDF lists with auto-enrichment. Gemini ranks real TMDB candidates against mood queries as taste-matches or popular picks.",
    stack: "React · Vite · Express · Prisma · PostgreSQL · Neon · Render",
    href: "https://cinelog-q45t.onrender.com/",
    github: "https://github.com/ayaansattar/CineLog",
    video: "/projects/CineLog.mp4",
  },
];

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = projects[activeIndex] ?? projects[0];

  const carouselItems = useMemo(
    () =>
      projects.map((project) => {
        let label = project.title;
        if (project.href) {
          try {
            label = new URL(project.href).host;
          } catch {
            label = project.href;
          }
        }

        return {
          video: project.video,
          image: project.image,
          alt: `${project.title} preview`,
          frame: project.frame ?? "browser",
          label,
          zoom: project.title === "OneStopProf" ? 1.2 : undefined,
        };
      }),
    [],
  );

  return (
    <section id="projects" className="border-b border-border-dim">
      <div className="mx-auto w-full max-w-[100rem] px-6 py-24 sm:px-10">
        <RevealLine>
          <h2 className="font-display text-4xl tracking-tight text-text-primary sm:text-5xl">
            Projects
          </h2>
          <div className="mt-3 h-px w-24 bg-accent" />
        </RevealLine>

        <div className="mt-6 grid items-start gap-8 lg:mt-8 lg:grid-cols-[minmax(0,22rem)_minmax(50vw,1fr)] xl:grid-cols-[minmax(0,26rem)_minmax(50vw,1fr)] lg:gap-8">
          <article className="min-w-0 lg:pr-2">
            <RevealLine>
              <h3 className="font-display text-3xl tracking-tight text-text-primary sm:text-4xl xl:text-5xl">
                {active.title}
              </h3>
            </RevealLine>
            <RevealLine>
              <p className="mt-3 text-lg text-text-secondary italic">
                {active.tagline}
              </p>
            </RevealLine>
            <RevealLine>
              <p className="mt-6 text-base leading-relaxed text-text-secondary">
                {active.description}
              </p>
            </RevealLine>
            <RevealLine>
              <p className="mt-6 text-sm tracking-wide text-text-dim sm:text-base">
                {active.stack}
              </p>
            </RevealLine>
            {active.href || active.github ? (
              <RevealLine>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
                  {active.href ? (
                    <a
                      href={active.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent transition-colors hover:text-accent-hover"
                    >
                      Web App ↗
                    </a>
                  ) : null}
                  {active.github ? (
                    <a
                      href={active.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        active.href
                          ? "text-text-secondary transition-colors hover:text-accent"
                          : "text-accent transition-colors hover:text-accent-hover"
                      }
                    >
                      GitHub ↗
                    </a>
                  ) : null}
                </div>
              </RevealLine>
            ) : null}
          </article>

          <RevealLine className="min-w-0 overflow-visible" threshold={0.1}>
            <div className="relative aspect-[16/10] w-full min-h-[18rem] overflow-visible sm:min-h-[22rem]">
              <DepthCarousel
                className="depth-carousel--spread-arrows"
                items={carouselItems}
                cardWidth={900}
                cardHeight={562}
                radius={16}
                tint="#0b0c0e"
                depth={220}
                spread={100}
                tilt={18}
                tiltDirection="right"
                perspective={1500}
                visibleCards={3}
                falloff={0.2}
                blur={5}
                align="top"
                autoplay
                autoplayDelay={4200}
                loop
                onChange={(index) => setActiveIndex(index)}
              />
            </div>
          </RevealLine>
        </div>
      </div>
    </section>
  );
}
