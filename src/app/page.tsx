import Image from "next/image";
import { SiteNav } from "@/components/SiteNav";
import { TechSphereLazy } from "@/components/TechSphereLazy";

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

const experiences = [
  {
    role: "Student",
    org: "Learning software development",
    period: "Present",
    detail:
      "Building foundations in programming, web development, and shipping personal projects.",
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
    <div className="flex min-h-full flex-col">
      <header className="relative isolate flex min-h-svh flex-col overflow-hidden">
        <div className="absolute inset-0 -z-10 animate-fade">
          <Image
            src="/hero.jpg"
            alt="Laptop and coffee on a desk by a window"
            fill
            priority
            sizes="100vw"
            className="animate-drift object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#13241c]/92 via-[#13241c]/72 to-[#13241c]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#13241c]/55 via-transparent to-[#13241c]/25" />
        </div>

        <SiteNav tone="light" />

        <main
          id="top"
          className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-6 pb-16 pt-24 sm:px-10 sm:pb-24"
        >
          <p className="animate-rise font-display text-7xl leading-none tracking-tight text-white sm:text-8xl md:text-9xl">
            Ayaan
          </p>
          <h1 className="animate-rise-delay-1 mt-6 max-w-xl font-display text-2xl leading-snug text-mist italic sm:text-3xl">
            Student learning to build with code.
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-md text-base leading-relaxed text-mist/85 sm:text-lg">
            Projects, experience, and the tools I&apos;m learning—shared as I
            go.
          </p>
          <div className="animate-rise-delay-3 mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center justify-center bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              See projects
            </a>
            <a
              href="#experience"
              className="inline-flex items-center justify-center border border-mist/40 px-6 py-3 text-sm font-medium text-mist transition-colors hover:border-white hover:text-white"
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
        <h2 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Projects
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Things I&apos;ve built, shipped, or am actively working on.
        </p>
        <ul className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
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
                  <h3 className="text-xl font-medium text-ink group-hover:text-accent">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-base leading-relaxed text-ink-soft">
                    {project.description}
                  </p>
                </div>
                <p className="shrink-0 text-sm text-ink-soft sm:text-right">
                  {project.stack}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="experience"
        className="border-y border-ink/10 bg-highlight"
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
          <h2 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
            Experience
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Roles, school, and anything that shaped how I work.
          </p>
          <ol className="mt-12 space-y-10">
            {experiences.map((item) => (
              <li
                key={`${item.role}-${item.org}`}
                className="grid gap-3 sm:grid-cols-[8rem_1fr] sm:gap-10"
              >
                <p className="text-sm font-medium tracking-wide text-ink-soft uppercase">
                  {item.period}
                </p>
                <div>
                  <h3 className="text-xl font-medium text-ink">{item.role}</h3>
                  <p className="mt-1 text-base text-accent">{item.org}</p>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="technologies"
        className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10"
      >
        <h2 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Technologies
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Drag the sphere to explore the tools I use and what I&apos;m learning
          next.
        </p>
        <div className="mt-10">
          <TechSphereLazy technologies={technologies} />
        </div>
      </section>

      <footer className="border-t border-ink/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="text-sm text-ink-soft">
            © {new Date().getFullYear()} Ayaan
          </p>
          <a
            href="mailto:hello@example.com"
            className="text-sm font-medium text-ink transition-colors hover:text-accent"
          >
            hello@example.com
          </a>
        </div>
      </footer>
    </div>
  );
}
