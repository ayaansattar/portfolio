import Link from "next/link";

const links = [
  { href: "#top", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#technologies", label: "Technologies" },
] as const;

export function SiteNav() {
  return (
    <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6 sm:px-10">
      <Link
        href="#top"
        className="text-sm font-medium tracking-[0.18em] text-accent uppercase transition-colors hover:text-accent-hover"
      >
        Ayaan
      </Link>
      <div className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm text-text-dim">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-accent"
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
