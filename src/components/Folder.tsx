"use client";

import {
  useCallback,
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import "./Folder.css";

const darkenColor = (hex: string, percent: number) => {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(color.slice(0, 6), 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
};

type FolderProps = {
  color?: string;
  size?: number;
  items?: ReactNode[];
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onItemClick?: (index: number) => void;
  clickMode?: boolean;
  label?: string;
};

export default function Folder({
  color = "#5227FF",
  size = 1,
  items = [],
  className = "",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onItemClick,
  clickMode = true,
  label = "Projects folder",
}: FolderProps) {
  const count = Math.max(items.length, 1);
  const papers = items.slice(0, count);
  while (papers.length < count) {
    papers.push(null);
  }

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;

  const [paperOffsets, setPaperOffsets] = useState(
    Array.from({ length: count }, () => ({ x: 0, y: 0 })),
  );

  useEffect(() => {
    setPaperOffsets(Array.from({ length: count }, () => ({ x: 0, y: 0 })));
  }, [count]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
      if (!next) {
        setPaperOffsets(Array.from({ length: count }, () => ({ x: 0, y: 0 })));
      }
    },
    [count, onOpenChange, openProp],
  );

  const handleToggle = () => {
    setOpen(!open);
  };

  const handlePaperMouseMove = (event: MouseEvent<HTMLDivElement>, index: number) => {
    if (!open) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (event.clientX - centerX) * 0.15;
    const offsetY = (event.clientY - centerY) * 0.15;
    setPaperOffsets((prev) => {
      const next = [...prev];
      next[index] = { x: offsetX, y: offsetY };
      return next;
    });
  };

  const handlePaperMouseLeave = (index: number) => {
    setPaperOffsets((prev) => {
      const next = [...prev];
      next[index] = { x: 0, y: 0 };
      return next;
    });
  };

  const handlePaperClick = (event: MouseEvent<HTMLDivElement>, index: number) => {
    event.stopPropagation();
    if (!open) return;
    onItemClick?.(index);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
    }
  };

  const folderBackColor = darkenColor(color, 0.08);
  const paper1 = darkenColor("#ffffff", 0.1);
  const paper2 = darkenColor("#ffffff", 0.05);
  const paper3 = "#ffffff";
  const paper4 = darkenColor("#ffffff", 0.02);

  const folderStyle = {
    "--folder-color": color,
    "--folder-back-color": folderBackColor,
    "--paper-1": paper1,
    "--paper-2": paper2,
    "--paper-3": paper3,
    "--paper-4": paper4,
    "--paper-count": count,
  } as CSSProperties;

  const folderClassName = [
    "folder",
    open ? "open" : "",
    clickMode ? "folder--click" : "",
    `folder--count-${count}`,
  ]
    .filter(Boolean)
    .join(" ");

  const scaleStyle = { transform: `scale(${size})` };
  const hintId = useId();

  return (
    <div style={scaleStyle} className={className}>
      <div
        className={folderClassName}
        style={folderStyle}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        role="button"
        aria-expanded={open}
        aria-label={open ? `Close ${label}` : `Open ${label}`}
        aria-describedby={!open ? hintId : undefined}
      >
        <div className="folder__back">
          {papers.map((item, index) => (
            <div
              key={index}
              className={`paper paper-${index + 1}`}
              onMouseMove={(event) => handlePaperMouseMove(event, index)}
              onMouseLeave={() => handlePaperMouseLeave(index)}
              onClick={(event) => handlePaperClick(event, index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  if (open) onItemClick?.(index);
                }
              }}
              role={item ? "button" : undefined}
              tabIndex={open && item ? 0 : -1}
              aria-label={item ? `Open project ${index + 1}` : undefined}
              style={
                open
                  ? ({
                      "--magnet-x": `${paperOffsets[index]?.x ?? 0}px`,
                      "--magnet-y": `${paperOffsets[index]?.y ?? 0}px`,
                    } as CSSProperties)
                  : undefined
              }
            >
              {item}
            </div>
          ))}
          <div className="folder__front" />
          <div className="folder__front right" />
        </div>
      </div>
      {!open ? (
        <p id={hintId} className="folder__hint">
          Click to open
        </p>
      ) : null}
    </div>
  );
}
