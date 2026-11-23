"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/effects";

// `useLayoutEffect` warns during server rendering; fall back to `useEffect` there.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ----------------------------------------------------------------------------
 * AnimatedNumber — counts smoothly to a new value whenever it changes
 * -------------------------------------------------------------------------- */
export function AnimatedNumber({
  value,
  decimals = 0,
  duration = 700,
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const currentRef = useRef(value);

  useEffect(() => {
    const from = currentRef.current;
    if (from === value) return;
    const total = prefersReducedMotion() ? 0 : duration;
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = total > 0 ? Math.min(1, (now - start) / total) : 1;
      const eased = 1 - Math.pow(1 - t, 3);
      const next = t >= 1 ? value : from + (value - from) * eased;
      currentRef.current = next;
      setDisplay(next);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span className={`tabular-nums ${className ?? ""}`}>
      {display.toFixed(decimals)}
    </span>
  );
}

/* ----------------------------------------------------------------------------
 * ProgressBar — GPU-friendly bar (animates `transform`, not `width`)
 * -------------------------------------------------------------------------- */
export function ProgressBar({
  percent,
  trackClassName = "bg-slate-100",
  barClassName = "bg-teal-600",
  heightClassName = "h-2",
  label,
}: {
  percent: number;
  trackClassName?: string;
  barClassName?: string;
  heightClassName?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(percent) ? percent : 0));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={`w-full rounded-full overflow-hidden ${heightClassName} ${trackClassName}`}
    >
      <div
        className={`h-full w-full rounded-full transition-transform duration-700 ease-smooth ${barClassName}`}
        style={{ transform: `translateX(-${100 - clamped}%)` }}
      />
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * ScoreRing — circular gauge used on the result banner
 * -------------------------------------------------------------------------- */
export function ScoreRing({
  score,
  max = 10,
  size = 132,
}: {
  score: number;
  max?: number;
  size?: number;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const ratio = max > 0 ? Math.max(0, Math.min(1, score / max)) : 0;
  const offset = circumference * (1 - ratio);
  const tone =
    ratio >= 0.8 ? "#34d399" : ratio >= 0.5 ? "#fbbf24" : "#fb7185";

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Điểm ${score.toFixed(2)} trên ${max}`}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgb(255 255 255 / 0.12)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring-progress"
          style={
            { "--ring-circumference": circumference } as React.CSSProperties
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <AnimatedNumber
          value={score}
          decimals={2}
          duration={1100}
          className="font-mono text-2xl sm:text-3xl font-extrabold text-white"
        />
        <span className="mt-1 text-[11px] font-semibold text-slate-300">
          / {max} điểm
        </span>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Reveal — fades/slides content in the first time it scrolls into view.
 *
 * The reveal is tracked per `id` for the lifetime of the page, so coming back
 * to a tab does not replay the animation (content is simply there).
 * The "revealed" flag is written straight to the DOM (data attribute) instead
 * of React state, so revealing never triggers a re-render.
 * -------------------------------------------------------------------------- */
const revealedIds = new Set<string>();

export function Reveal({
  id,
  delay = 0,
  className,
  children,
}: {
  id: string;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      revealedIds.has(id) ||
      typeof IntersectionObserver === "undefined" ||
      prefersReducedMotion()
    ) {
      revealedIds.add(id);
      el.dataset.revealed = "instant";
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealedIds.add(id);
            el.dataset.revealed = "true";
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ""}`}
      style={
        delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined
      }
    >
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * useSlidingIndicator — animated "active tab" pill.
 *
 * Put the returned ref on the tab container. Inside it:
 *   - mark the active tab with `data-active="true"`
 *   - render one `<span data-indicator className="tab-indicator …" />`
 * The indicator glides to the active tab and follows resizes / font loading.
 * -------------------------------------------------------------------------- */
export function useSlidingIndicator<T extends HTMLElement>(activeKey: string) {
  const ref = useRef<T | null>(null);

  useIsomorphicLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;
    const indicator = container.querySelector<HTMLElement>("[data-indicator]");
    if (!indicator) return;

    let frame = 0;
    const update = () => {
      const active = container.querySelector<HTMLElement>('[data-active="true"]');
      if (!active || active.offsetWidth === 0) {
        indicator.style.opacity = "0";
        return;
      }
      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.height = `${active.offsetHeight}px`;
      indicator.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
      indicator.style.opacity = "1";
      if (!indicator.hasAttribute("data-ready")) {
        // Enable the glide only after the first placement, so the pill does
        // not fly in from the corner on page load.
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() =>
            indicator.setAttribute("data-ready", "")
          );
        });
      }
    };

    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(container);
    for (const child of Array.from(container.children)) {
      if (child !== indicator) observer.observe(child);
    }
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [activeKey]);

  return ref;
}
