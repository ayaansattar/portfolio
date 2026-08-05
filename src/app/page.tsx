import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="relative isolate min-h-svh overflow-hidden">
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

        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
          <a
            href="#top"
            className="text-sm font-medium tracking-[0.18em] text-mist uppercase"
          >
            Portfolio
          </a>
          <div className="flex items-center gap-6 text-sm text-mist/90">
            <a href="#about" className="transition-colors hover:text-white">
              About
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>
          </div>
        </nav>

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
            I&apos;m exploring software development—turning curiosity into
            projects, one page at a time.
          </p>
          <div className="animate-rise-delay-3 mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#about"
              className="inline-flex items-center justify-center bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              About me
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center border border-mist/40 px-6 py-3 text-sm font-medium text-mist transition-colors hover:border-white hover:text-white"
            >
              Get in touch
            </a>
          </div>
        </main>
      </header>

      <section
        id="about"
        className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10"
      >
        <h2 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          About
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          I&apos;m a student and aspiring software developer. This site is
          where I&apos;ll share what I&apos;m building as I learn—starting
          small, shipping often, and getting better with every project.
        </p>
      </section>

      <section
        id="contact"
        className="border-t border-ink/10 bg-highlight"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-20 sm:flex-row sm:items-end sm:justify-between sm:px-10">
          <div>
            <h2 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
              Let&apos;s talk
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
              Open to learning opportunities, collaborations, and conversations
              about code.
            </p>
          </div>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center justify-center bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            hello@example.com
          </a>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-6 py-8 text-sm text-ink-soft sm:px-10">
        © {new Date().getFullYear()} Ayaan
      </footer>
    </div>
  );
}
