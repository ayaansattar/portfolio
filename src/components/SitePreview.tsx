type SitePreviewProps = {
  url: string;
  video: string;
  label: string;
};

export function SitePreview({ url, video, label }: SitePreviewProps) {
  return (
    <div className="min-w-0 overflow-hidden bg-bg">
      <div className="flex items-center gap-2 bg-surface px-2 py-2 sm:gap-3 sm:px-3">
        <div className="flex shrink-0 gap-1 sm:gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-[#5a5a54] sm:h-2.5 sm:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-[#5a5a54] sm:h-2.5 sm:w-2.5" />
          <span className="h-2 w-2 rounded-full bg-accent/80 sm:h-2.5 sm:w-2.5" />
        </div>
        <div className="min-w-0 flex-1 truncate bg-bg px-2 py-0.5 text-[10px] text-text-dim sm:px-3 sm:py-1 sm:text-xs">
          {label}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[10px] font-medium text-accent transition-colors hover:text-accent-hover sm:text-xs"
        >
          Open ↗
        </a>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-video w-full overflow-hidden bg-surface"
        aria-label={`Open ${label} demo`}
      >
        <video
          src={video}
          className="absolute inset-0 h-full w-full scale-[1.08] object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </a>
    </div>
  );
}

type DemoItem = {
  src: string;
  label: string;
  url: string;
};

type SitePreviewRowProps = {
  demos: DemoItem[];
};

export function SitePreviewRow({ demos }: SitePreviewRowProps) {
  return (
    <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
      {demos.map((demo) => (
        <SitePreview
          key={demo.src}
          url={demo.url}
          video={demo.src}
          label={demo.label}
        />
      ))}
    </div>
  );
}
