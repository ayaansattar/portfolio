import { ConstellationBackground } from "@/components/ConstellationBackground";
import { ExperienceSection } from "@/components/ExperienceSection";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SiteNav } from "@/components/SiteNav";
import { TechnologiesSection } from "@/components/TechnologiesSection";

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
            <div className="animate-rise-delay-1 mt-5 h-px w-20 bg-accent" />
            <h1 className="animate-rise-delay-1 mt-4 max-w-xl font-display text-2xl leading-snug text-text-secondary italic sm:text-3xl">
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
                className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
              >
                Experience
              </a>
            </div>
          </main>
        </header>

        <ProjectsSection />

        <ExperienceSection />

        <TechnologiesSection technologies={technologies} />

        <footer className="border-t border-border-dim">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <p className="text-sm text-text-dim">
              © {new Date().getFullYear()} Ayaan
            </p>
            <a
              href="mailto:hello@example.com"
              className="text-sm font-medium text-text-secondary transition-colors hover:text-accent"
            >
              hello@example.com
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
