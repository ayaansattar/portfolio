import { ConstellationBackground } from "@/components/ConstellationBackground";
import { ExperienceSection } from "@/components/ExperienceSection";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SiteNav } from "@/components/SiteNav";
import { TechnologiesSection } from "@/components/TechnologiesSection";

const projects = [
  {
    title: "Portfolio website",
    description:
      "Personal site built with Next.js and Tailwind, deployed on Vercel.",
    href: "https://github.com/ayaansattar/portfolio",
    stack: "Next.js · Tailwind · Vercel",
  },
  {
    title: "Project coming soon",
    description: "A placeholder for the next thing I'm shipping.",
    href: "#projects",
    stack: "TBD",
  },
];

const technologies = [
  { name: "Python", logo: "/tech/python.svg" },
  { name: "TypeScript", logo: "/tech/typescript.svg" },
  { name: "JavaScript", logo: "/tech/javascript.svg" },
  { name: "HTML/CSS", logo: "/tech/html-css.svg" },
  { name: "SQL", logo: "/tech/sql.svg" },
  { name: "C/C++", logo: "/tech/cpp.svg" },
  { name: "Java", logo: "/tech/java.svg" },
  { name: "React", logo: "/tech/react.svg" },
  { name: "Next.js", logo: "/tech/nextjs.svg" },
  { name: "Expo", logo: "/tech/expo.svg" },
  { name: "Tailwind CSS", logo: "/tech/tailwind.svg" },
  { name: "FastAPI", logo: "/tech/fastapi.svg" },
  { name: "Prisma", logo: "/tech/prisma.svg" },
  { name: "Firebase", logo: "/tech/firebase.svg" },
  { name: "SQLite", logo: "/tech/sqlite.svg" },
  { name: "Redis", logo: "/tech/redis.svg" },
  { name: "MongoDB", logo: "/tech/mongodb.svg" },
  { name: "Docker", logo: "/tech/docker.svg" },
  { name: "Git", logo: "/tech/git.svg" },
];

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-col">
      <ConstellationBackground />
      <LoadingScreen />
      <div className="relative z-10 flex min-h-full flex-col">
        <header className="relative isolate flex min-h-svh flex-col overflow-hidden">
          <SiteNav />

          <main
            id="top"
            className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-6 pb-16 pt-24 sm:px-10 sm:pb-24"
          >
            <p className="animate-rise font-display text-7xl leading-none tracking-tight text-text-primary sm:text-8xl md:text-9xl">
              Ayaan
            </p>
            <h1 className="animate-rise-delay-1 mt-6 max-w-xl font-display text-2xl leading-snug text-text-secondary italic sm:text-3xl">
              Student learning to build with code.
            </h1>
            <p className="animate-rise-delay-2 mt-5 max-w-md text-base leading-relaxed text-text-secondary sm:text-lg">
              Projects, experience, and the tools I&apos;m learning—shared as I
              go.
            </p>
            <div className="animate-rise-delay-3 mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center justify-center bg-accent px-6 py-3 text-sm font-medium text-accent-on transition-colors hover:bg-accent-hover"
              >
                See projects
              </a>
              <a
                href="#experience"
                className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary"
              >
                Experience
              </a>
            </div>
          </main>
        </header>

        <section
          id="projects"
          className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10"
        >
          <h2 className="font-display text-4xl tracking-tight text-text-primary sm:text-5xl">
            Projects
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Things I&apos;ve built, shipped, or am actively working on.
          </p>
          <ul className="mt-12 divide-y divide-border-dim border-y border-border-dim">
            {projects.map((project) => (
              <li key={project.title}>
                <a
                  href={project.href}
                  target={project.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    project.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group flex flex-col gap-2 py-8 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-10"
                >
                  <div>
                    <h3 className="text-xl font-medium text-text-primary group-hover:text-text-primary">
                      {project.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-base leading-relaxed text-text-secondary">
                      {project.description}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm text-text-dim sm:text-right">
                    {project.stack}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <ExperienceSection />

        <TechnologiesSection technologies={technologies} />

        <footer className="border-t border-border-dim">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <p className="text-sm text-text-dim">
              © {new Date().getFullYear()} Ayaan
            </p>
            <a
              href="mailto:hello@example.com"
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              hello@example.com
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
