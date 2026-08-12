"use client";

import { LazyVideo } from "@/components/LazyVideo";
import { RevealLine } from "@/components/RevealLine";

type ProjectItem = {
  number: string;
  title: string;
  tagline: string;
  description: string;
  stack: string;
  href?: string;
  github?: string;
  image?: string;
  video?: string;
  /** browser = desktop chrome (default), mobile = phone bezel */
  frame?: "browser" | "mobile";
};

const projects: ProjectItem[] = [
  {
    number: "01",
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
    number: "02",
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
    number: "03",
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
    number: "04",
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
  return (
    <section id="projects" className="border-b border-border-dim">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
        <RevealLine>
          <h2 className="font-display text-4xl tracking-tight text-text-primary sm:text-5xl">
            Projects
          </h2>
          <div className="mt-3 h-px w-24 bg-accent" />
        </RevealLine>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-8 sm:px-10">
        {projects.map((project) => (
          <article
            key={project.number}
            className="grid gap-10 border-t border-border-dim py-16 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14 md:py-24 lg:gap-20"
          >
            <div className="md:sticky md:top-28 md:self-start">
              <RevealLine>
                <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
                  {project.number}
                </p>
              </RevealLine>
              <RevealLine>
                <h3 className="mt-4 font-display text-3xl tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
                  {project.title}
                </h3>
              </RevealLine>
              <RevealLine>
                <p className="mt-3 text-lg text-text-secondary italic">
                  {project.tagline}
                </p>
              </RevealLine>
              <RevealLine>
                <p className="mt-6 text-base tracking-wide text-text-dim">
                  {project.stack}
                </p>
              </RevealLine>
              {(project.href || project.github) && (
                <RevealLine>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
                    {project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent transition-colors hover:text-accent-hover"
                      >
                        Web App ↗
                      </a>
                    ) : null}
                    {project.github ? (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          project.href
                            ? "text-text-secondary transition-colors hover:text-accent"
                            : "text-accent transition-colors hover:text-accent-hover"
                        }
                      >
                        GitHub ↗
                      </a>
                    ) : null}
                  </div>
                </RevealLine>
              )}
            </div>

            <div className="min-w-0 space-y-6">
              <RevealLine threshold={0.2}>
                <ProjectMedia project={project} />
              </RevealLine>
              <RevealLine>
                <p className="max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
                  {project.description}
                </p>
              </RevealLine>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectMedia({ project }: { project: ProjectItem }) {
  const link = project.href || project.github;
  const isMobile = project.frame === "mobile";

  let chromeLabel = project.title;
  if (project.href) {
    try {
      const parsed = new URL(project.href);
      chromeLabel = parsed.host;
    } catch {
      chromeLabel = project.href;
    }
  }

  const media = project.video ? (
    <LazyVideo
      src={project.video}
      className={
        isMobile
          ? "absolute inset-0 h-full w-full object-cover"
          : "absolute inset-0 h-full w-full scale-[1.02] object-cover object-center"
      }
    />
  ) : project.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={project.image}
      alt={`${project.title} preview`}
      className="absolute inset-0 h-full w-full object-cover object-top"
    />
  ) : (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 40%, rgba(255,107,26,0.12) 100%), radial-gradient(ellipse at 20% 0%, rgba(212,212,208,0.08), transparent 55%)",
        }}
      />
      <p className="absolute bottom-5 left-6 text-xs tracking-[0.18em] text-text-dim uppercase">
        Add preview — /public/projects/{project.number.toLowerCase()}
      </p>
    </>
  );

  if (isMobile) {
    const phoneBody = (
      <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[280px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-[#0B0C0E] p-2 sm:rounded-[2.25rem] sm:p-2.5">
          <div
            aria-hidden="true"
            className="absolute top-3 left-1/2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-[#0B0C0E] sm:top-3.5 sm:h-6 sm:w-24"
          />
          <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.5rem] bg-surface sm:rounded-[1.75rem]">
            {media}
          </div>
        </div>
      </div>
    );

    return (
      <div className="flex min-h-[28rem] items-center justify-center py-2 sm:min-h-[32rem]">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-[280px] transition-opacity hover:opacity-95"
            aria-label={`Open ${project.title}`}
          >
            {phoneBody}
          </a>
        ) : (
          phoneBody
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-surface">
      <div className="flex items-center gap-2 px-3 py-2.5 sm:gap-3">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#5a5a54]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#5a5a54]" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
        </div>
        <div className="min-w-0 flex-1 truncate bg-bg px-3 py-1 text-xs text-text-dim">
          {chromeLabel}
        </div>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Open ↗
          </a>
        ) : null}
      </div>

      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-[16/10] w-full overflow-hidden bg-bg"
          aria-label={`Open ${project.title}`}
        >
          {media}
        </a>
      ) : (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg">
          {media}
        </div>
      )}
    </div>
  );
}
