"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { Home, Briefcase, Compass } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const SPRING_PRESS = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const;

export const SPRING_SWAP = {
  type: "spring",
  stiffness: 460,
  damping: 30,
  mass: 0.55,
} as const;

export const SPRING_PANEL = {
  type: "spring",
  stiffness: 420,
  damping: 40,
  mass: 0.5,
} as const;

export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const;

export const SPRING_MOUSE = {
  stiffness: 200,
  damping: 15,
  mass: 0.3,
} as const;

const NOT_FOUND_DEFAULTS = {
  code: "404",
  title: "Oops! Page Not Found",
  description: "The page you are looking for does not exist, has been removed, or the link might be broken.",
  homeHref: "/",
  homeLabel: "Back to Home",
  browseHref: "/jobs",
  browseLabel: "Explore All Jobs",
};

export interface NotFoundProps {
  className?: string;
  code?: string;
  title?: string;
  description?: string;
  homeHref?: string;
  homeLabel?: string;
  browseHref?: string;
  browseLabel?: string;
}

interface NotFoundStageProps {
  className?: string;
  children: ReactNode;
}

function NotFoundStage({ className, children }: NotFoundStageProps) {
  return (
    <section
      className={cn(
        "flex min-h-[70vh] w-full flex-col items-center justify-center gap-8 px-6 py-16 text-center relative overflow-hidden",
        className,
      )}
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      {children}
    </section>
  );
}

interface NotFoundActionsProps {
  homeHref?: string;
  homeLabel?: string;
  browseHref?: string;
  browseLabel?: string;
}

function NotFoundActions({
  homeHref = NOT_FOUND_DEFAULTS.homeHref,
  homeLabel = NOT_FOUND_DEFAULTS.homeLabel,
  browseHref = NOT_FOUND_DEFAULTS.browseHref,
  browseLabel = NOT_FOUND_DEFAULTS.browseLabel,
}: NotFoundActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
      <Link
        href={homeHref}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 text-sm font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Home className="h-4 w-4" />
        <span>{homeLabel}</span>
      </Link>

      <Link
        href={browseHref}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card hover:bg-secondary px-6 text-sm font-bold text-foreground transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
      >
        <Briefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <span>{browseLabel}</span>
      </Link>

      <Link
        href="/career-tools"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/40 hover:bg-indigo-100/60 dark:hover:bg-indigo-900/60 px-5 text-sm font-bold text-indigo-700 dark:text-indigo-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Compass className="h-4 w-4" />
        <span>Free Career Tools</span>
      </Link>
    </div>
  );
}

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/\\";
const SCRAMBLE_MS = 700;
const TICK_MS = 45;

function Scramble({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduce) {
      setDisplay(text);
      return;
    }

    const chars = text.split("");
    const start = performance.now();
    let raf = 0;
    let last = 0;

    const loop = (now: number) => {
      if (now - last >= TICK_MS) {
        last = now;

        const progress = Math.min((now - start) / SCRAMBLE_MS, 1);
        const settled = Math.floor(progress * chars.length);

        setDisplay(
          chars
            .map((ch, i) =>
              i < settled || ch === " "
                ? ch
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join(""),
        );
      }

      if (now - start < SCRAMBLE_MS) {
        raf = requestAnimationFrame(loop);
      } else {
        setDisplay(text);
      }
    };

    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, [text, reduce]);

  return <span className="tabular-nums">{display}</span>;
}

export function NotFoundGlitch({
  className,
  code = NOT_FOUND_DEFAULTS.code,
  title = NOT_FOUND_DEFAULTS.title,
  description = NOT_FOUND_DEFAULTS.description,
  homeHref,
  homeLabel,
  browseHref,
  browseLabel,
}: NotFoundProps) {
  return (
    <NotFoundStage className={className}>
      <div className="group relative select-none font-mono font-extrabold leading-none tracking-tighter text-foreground [font-size:clamp(5.5rem,18vw,11rem)]">
        {/* FreshersBridge Brand Glitch Layers */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 text-indigo-500 opacity-0 mix-blend-screen transition-[transform,opacity] duration-150 ease-out group-hover:translate-x-[4px] group-hover:opacity-75 motion-reduce:hidden"
        >
          <Scramble text={code} />
        </span>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 text-cyan-400 opacity-0 mix-blend-screen transition-[transform,opacity] duration-150 ease-out group-hover:-translate-x-[4px] group-hover:opacity-75 motion-reduce:hidden"
        >
          <Scramble text={code} />
        </span>

        <h1 className="relative bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent drop-shadow-sm">
          <Scramble text={code} />
        </h1>
      </div>

      <div className="flex flex-col items-center gap-2 max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <NotFoundActions
        homeHref={homeHref}
        homeLabel={homeLabel}
        browseHref={browseHref}
        browseLabel={browseLabel}
      />
    </NotFoundStage>
  );
}
