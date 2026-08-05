import Link from "next/link";

const links = [
  { href: "#top", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#technologies", label: "Technologies" },
] as const;

type SiteNavProps = {
  tone?: "light" | "dark";
};

export function SiteNav({ tone = "light" }: SiteNavProps) {
  const isLight = tone === "light";

  return (
    <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6 sm:px-10">
      <Link
        href="#top"
        className={`text-sm font-medium tracking-[0.18em] uppercase ${
          isLight ? "text-mist" : "text-ink"
        }`}
      >
        Ayaan
      </Link>
      <div
        className={`flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm ${
          isLight ? "text-mist/90" : "text-ink-soft"
        }`}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={
              isLight
                ? "transition-colors hover:text-white"
                : "transition-colors hover:text-ink"
            }
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
