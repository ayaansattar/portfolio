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
    github: "https://github.com/ayaansattar/FixSpotify",
  },
  {
    number: "02",
    title: "Project Two",
    tagline: "Short hook for what this does.",
    description:
      "Swap this blurp for the real story — problem, what you built, and the outcome.",
    stack: "React · Expo · Firebase",
    href: "#projects",
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
                <p className="mt-6 text-sm tracking-wide text-text-dim">
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
  if (project.video) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
        <video
          src={project.video}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  if (project.image) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={`${project.title} preview`}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>
    );
  }

  return (
    <div className="relative flex aspect-[16/10] w-full items-end overflow-hidden bg-surface px-6 py-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 40%, rgba(255,107,26,0.12) 100%), radial-gradient(ellipse at 20% 0%, rgba(212,212,208,0.08), transparent 55%)",
        }}
      />
      <p className="relative text-xs tracking-[0.18em] text-text-dim uppercase">
        Add preview — /public/projects/{project.number.toLowerCase()}
      </p>
    </div>
  );
}
