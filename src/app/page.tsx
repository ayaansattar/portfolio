import { ConstellationBackground } from "@/components/ConstellationBackground";
import { ExperienceSection } from "@/components/ExperienceSection";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SiteNav } from "@/components/SiteNav";
import { SocialLinks } from "@/components/SocialLinks";
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
            className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 pb-16 pt-8 text-center sm:px-10"
          >
            <p className="animate-rise font-display text-7xl leading-none tracking-tight text-text-primary sm:text-8xl md:text-9xl">
              Ayaan
            </p>
            <div className="animate-rise-delay-1 mt-5 h-px w-20 bg-accent" />
            <div className="animate-rise-delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-accent px-6 py-3 text-sm font-medium text-accent-on transition-colors hover:bg-accent-hover"
              >
                Résumé
              </a>
              <SocialLinks variant="hero" />
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
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <SocialLinks variant="footer" />
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-text-secondary transition-colors hover:text-accent"
              >
                Résumé
              </a>
              <a
                href="mailto:aasattar@umass.edu"
                className="text-sm font-medium text-text-secondary transition-colors hover:text-accent"
              >
                aasattar@umass.edu
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
