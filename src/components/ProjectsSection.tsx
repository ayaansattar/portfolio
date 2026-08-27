"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Folder from "@/components/Folder";
import { RevealLine } from "@/components/RevealLine";
import "./ProjectsSection.css";

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
    frame: "browser",
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
    frame: "browser",
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
    frame: "browser",
  },
];

function projectUrlLabel(project: ProjectItem) {
  if (!project.href) return project.title.toLowerCase();
  try {
    return new URL(project.href).host;
  } catch {
    return project.href;
  }
}

function ProjectMedia({
  project,
  className,
  controls = false,
}: {
  project: ProjectItem;
  className: string;
  controls?: boolean;
}) {
  if (project.video) {
    return (
      <video
        className={className}
        src={project.video}
        muted
        loop
        playsInline
        autoPlay
        controls={controls}
        preload="metadata"
        aria-hidden={!controls}
      />
    );
  }

  if (project.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={className}
        src={project.image}
        alt={controls ? `${project.title} preview` : ""}
        draggable={false}
      />
    );
  }

  return null;
}

function DeviceFrame({
  project,
  media,
  compact = false,
}: {
  project: ProjectItem;
  media: ReactNode;
  compact?: boolean;
}) {
  const isMobile = project.frame === "mobile";
  const prefix = compact ? "project-paper" : "project-detail";

  if (isMobile) {
    return (
      <div className={`${prefix}__phone`}>
        <div className={`${prefix}__phone-notch`} aria-hidden="true" />
        <div className={`${prefix}__phone-screen`}>{media}</div>
      </div>
    );
  }

  return (
    <div className={`${prefix}__browser`}>
      <div className={`${prefix}__browser-bar`} aria-hidden="true">
        <div className={`${prefix}__browser-dots`}>
          <span />
          <span />
          <span />
        </div>
        {!compact ? (
          <div className={`${prefix}__browser-url`}>{projectUrlLabel(project)}</div>
        ) : null}
      </div>
      <div className={`${prefix}__browser-screen`}>{media}</div>
    </div>
  );
}

function ProjectPaper({ project }: { project: ProjectItem }) {
  const isMobile = project.frame === "mobile";

  return (
    <div
      className={`project-paper${
        isMobile ? " project-paper--phone" : " project-paper--browser"
      }`}
    >
      <DeviceFrame
        project={project}
        compact
        media={<ProjectMedia project={project} className="project-paper__media" />}
      />
      <span className="project-paper__title">{project.title}</span>
    </div>
  );
}

function ProjectDetail({
  project,
  onBack,
}: {
  project: ProjectItem;
  onBack: () => void;
}) {
  const isMobile = project.frame === "mobile";

  return (
    <article className="project-detail">
      <button type="button" className="project-detail__back" onClick={onBack}>
        ← Back to folder
      </button>

      <div className="project-detail__grid">
        <div className="project-detail__copy">
          <h3 className="font-display text-3xl tracking-tight text-text-primary sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-3 text-lg text-text-secondary italic">{project.tagline}</p>
          <p className="mt-6 text-base leading-relaxed text-text-secondary">
            {project.description}
          </p>
          <p className="mt-6 text-sm tracking-wide text-text-dim sm:text-base">
            {project.stack}
          </p>
          {project.href || project.github ? (
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
          ) : null}
        </div>

        <div
          className={`project-detail__preview${
            isMobile
              ? " project-detail__preview--mobile"
              : " project-detail__preview--browser"
          }`}
        >
          <DeviceFrame
            project={project}
            media={
              <ProjectMedia
                project={project}
                className="project-detail__video"
                controls
              />
            }
          />
        </div>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  const [folderOpen, setFolderOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const selectedProject =
    selectedIndex !== null ? projects[selectedIndex] : null;

  const folderItems = useMemo(
    () => projects.map((project) => <ProjectPaper key={project.title} project={project} />),
    [],
  );

  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleBack = () => {
    setSelectedIndex(null);
    setFolderOpen(true);
  };

  return (
    <section id="projects" className="border-b border-border-dim">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
        <RevealLine>
          <h2 className="font-display text-4xl tracking-tight text-text-primary sm:text-5xl">
            Projects
          </h2>
          <div className="mt-3 h-px w-24 bg-accent" />
        </RevealLine>

        <RevealLine className="mt-20 sm:mt-24" threshold={0.1}>
          <div className="projects-stage">
            {selectedProject ? (
              <ProjectDetail project={selectedProject} onBack={handleBack} />
            ) : (
              <div
                className={`projects-folder-wrap${
                  folderOpen ? " projects-folder-wrap--open" : ""
                }`}
              >
                {isMobile && folderOpen ? (
                  <div
                    className="projects-mobile-curve"
                    role="list"
                    aria-label="Projects"
                  >
                    {projects.map((project, index) => (
                      <button
                        key={project.title}
                        type="button"
                        role="listitem"
                        className={`projects-mobile-curve__card projects-mobile-curve__card--${index + 1}`}
                        onClick={() => handleItemClick(index)}
                        aria-label={`Open ${project.title}`}
                      >
                        <ProjectPaper project={project} />
                      </button>
                    ))}
                  </div>
                ) : null}

                <Folder
                  color="#ff6b1a"
                  size={isMobile ? 2.1 : 2.75}
                  items={folderItems}
                  open={folderOpen}
                  onOpenChange={setFolderOpen}
                  onItemClick={handleItemClick}
                  clickMode
                  className={`projects-folder${
                    isMobile ? " projects-folder--mobile" : ""
                  }`}
                  label="Projects folder"
                />
              </div>
            )}
          </div>
        </RevealLine>
      </div>
    </section>
  );
}
