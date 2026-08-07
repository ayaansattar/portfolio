const socials = [
  {
    label: "GitHub",
    href: "https://github.com/ayaansattar",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ayaansattar/",
  },
] as const;

type SocialLinksProps = {
  /** compact = icon-style text row for hero; footer = labeled links */
  variant?: "hero" | "footer";
};

export function SocialLinks({ variant = "footer" }: SocialLinksProps) {
  if (variant === "hero") {
    return (
      <>
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:border-accent hover:text-accent"
          >
            {social.label}
          </a>
        ))}
      </>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-text-secondary transition-colors hover:text-accent"
        >
          {social.label}
        </a>
      ))}
    </div>
  );
}
