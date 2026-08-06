"use client";

import { RevealLine } from "@/components/RevealLine";

export type ProjectItem = {
  number: string;
  title: string;
  tagline: string;
  description: string;
  stack: string;
  /** Primary / live demo URL */
  href?: string;
  github?: string;
  /** Image path under /public, e.g. /projects/foo.png */
  image?: string;
  /** Video path under /public, e.g. /projects/foo.mp4 */
  video?: string;
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
    title: "Project Three",
    tagline: "Short hook for what this does.",
    description:
      "Swap this blurp for the real story — problem, what you built, and the outcome.",
    stack: "Python · FastAPI · Postgres",
    href: "#projects",
  },
  {
    number: "04",
    title: "Project Four",
    tagline: "Short hook for what this does.",
    description:
      "Swap this blurp for the real story — problem, what you built, and the outcome.",
    stack: "TypeScript · Prisma · Docker",
    href: "#projects",
  },
  {
    number: "05",
    title: "Project Five",
    tagline: "Short hook for what this does.",
    description:
      "Swap this blurp for the real story — problem, what you built, and the outcome.",
    stack: "Next.js · Tailwind · Vercel",
    href: "#projects",
  },
  {
    number: "06",
    title: "Project Six",
    tagline: "Short hook for what this does.",
    description:
      "Swap this blurp for the real story — problem, what you built, and the outcome.",
    stack: "JavaScript · HTML · CSS",
    href: "#projects",
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
        <RevealLine>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Case studies as you scroll — title stays put while the work moves
            beside it.
          </p>
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
                        Demo ↗
                      </a>
                    ) : null}
                    {project.github ? (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-secondary transition-colors hover:text-accent"
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
    <video
      src={project.video}
      className="absolute inset-0 h-full w-full scale-[1.1] object-cover object-[center_18%]"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
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
