"use client";

import { useEffect, useState, useRef } from "react";
import { markReveal, introElapsedMs } from "@/lib/reveal";

const BOOT_LOGS = [
  "SYS.CORE.INIT [OK]",
  "ALLOCATING VRAM [OK]",
  "DECRYPTING ASSETS...",
  "ESTABLISHING SECURE LINK [OK]",
  "MOUNTING COMPONENT TREE...",
  "SYNCING GLOBAL STATE [OK]",
  "INJECTING STYLES...",
  "SYSTEM READY_"
];

/* Timeline (ms from first paint) — unchanged from the original motion version */
const PROGRESS_MS = 1800; // counter + bar fill
const EXIT_AT = 2100;     // shutters start opening
const DONE_AT = 3100;     // overlay removed, scroll unlocked

/* ─────────────────────────────────────────────────────────────────
   Every visual here is a CSS animation (keyframes in globals.css), so the
   intro runs on the compositor from the very first paint and stays smooth
   while React hydrates and the page lays out underneath. JS only updates
   the counter/log text — synced to the progress bar's own animation clock
   — and removes the overlay when it is finished.
───────────────────────────────────────────────────────────────── */
export default function PageReveal() {
  const [hidden, setHidden] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);
  const logRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.style.overflow = "";
      markReveal("done");
      setTimeout(() => setHidden(true), 0);
      return;
    }

    document.body.style.overflow = "hidden";

    // The CSS timeline started at first paint, possibly well before
    // hydration — read where it actually is instead of assuming 0.
    const startOffset = introElapsedMs();
    const elapsed = introElapsedMs;

    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
    let raf = 0;
    const tick = () => {
      const linearP = Math.min(elapsed() / PROGRESS_MS, 1);
      if (countRef.current) {
        countRef.current.textContent = String(Math.floor(easeOutCubic(linearP) * 100)).padStart(3, "0");
      }
      if (logRef.current) {
        logRef.current.textContent = linearP >= 1
          ? "SYSTEM READY"
          : BOOT_LOGS[Math.min(Math.floor(linearP * (BOOT_LOGS.length - 1)), BOOT_LOGS.length - 2)];
      }
      if (linearP < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const t1 = setTimeout(() => markReveal("open"), Math.max(0, EXIT_AT - startOffset));
    const t2 = setTimeout(() => {
      markReveal("done");
      setHidden(true);
      document.body.style.overflow = "";
    }, Math.max(0, DONE_AT - startOffset));

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  const anim = (name: string, durationS: number, delayS: number, ease = "var(--ease-expo)", fill = "both") =>
    `${name} ${durationS}s ${ease} ${delayS}s ${fill}`;
  const exitAt = EXIT_AT / 1000;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden select-none">

      {/* ── Background Shutter Panels (Smooth split exit) ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[50.1%] bg-[#060605] will-change-transform"
        style={{ animation: anim("coda-shutter-up", 0.95, exitAt, "cubic-bezier(0.86, 0, 0.07, 1)", "forwards") }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[50.1%] bg-[#060605] will-change-transform"
        style={{ animation: anim("coda-shutter-down", 0.95, exitAt + 0.04, "cubic-bezier(0.86, 0, 0.07, 1)", "forwards") }}
      />

      {/* ── Main Center Content ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4"
        style={{ animation: anim("coda-content-out", 0.4, exitAt, "var(--ease-expo)", "forwards") }}
      >
        {/* Brand Logo Display */}
        <div className="flex items-baseline gap-[2px] overflow-hidden pb-1">
          {"CODA".split("").map((char, i) => (
            <span
              key={i}
              className="font-instrument text-[clamp(64px,11vw,130px)] text-white tracking-[-0.04em] leading-none block font-semibold"
              style={{ animation: anim("coda-rise-full", 0.7, 0.15 + i * 0.07) }}
            >
              {char}
            </span>
          ))}
          <span
            className="font-mono text-[clamp(64px,11vw,130px)] text-[#FF5C00] leading-none block font-bold"
            style={{ animation: `coda-pop 0.658s var(--ease-reveal-spring) 0.55s both` }}
          >
            .
          </span>
        </div>

        {/* Smooth Slim Progress Bar Track */}
        <div
          className="mt-6 w-48 sm:w-60 h-[2px] bg-white/10 rounded-full overflow-hidden relative"
          style={{ animation: anim("coda-track-in", 0.4, 0.4, "var(--ease-motion-out)") }}
        >
          <div
            ref={progressRef}
            className="absolute inset-0 bg-[#FF5C00] origin-left rounded-full will-change-transform"
            style={{ transform: "scaleX(0)", animation: `coda-progress ${PROGRESS_MS / 1000}s cubic-bezier(0.33, 1, 0.68, 1) 0s forwards` }}
          />
        </div>

        {/* Terminal status line (Clean, simple, no box glow/shadow) */}
        <div
          className="mt-4 font-mono text-[11px] sm:text-xs text-[#FF5C00] tracking-[0.2em] uppercase flex items-center justify-center gap-1 min-h-[20px]"
          style={{ animation: anim("coda-fade-in", 0.3, 0.5, "var(--ease-motion-out)") }}
        >
          <span ref={logRef}>INITIALIZING...</span>
          <span
            data-intro-clock
            className="inline-block text-[#FF5C00] font-bold"
            style={{ animation: "coda-blink 0.5s cubic-bezier(0.42, 0, 0.58, 1) infinite" }}
          >
            _
          </span>
        </div>
      </div>

      {/* ── System Variables (Top Left) ── */}
      <div
        className="absolute top-8 left-8 font-mono text-[10px] text-white/30 uppercase tracking-[0.25em] z-10 hidden sm:flex items-center gap-2"
        style={{ animation: `${anim("coda-fade-in", 0.4, 0.6, "var(--ease-motion-out)")}, ${anim("coda-fade-out", 0.4, exitAt + 0.6, "var(--ease-motion-out)", "forwards")}` }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]/80 animate-pulse inline-block" />
        <span>NODE_ENV // PRODUCTION</span>
      </div>

      {/* ── Bottom Left Label ── */}
      <p
        className="absolute bottom-8 left-8 font-mono text-[10px] text-white/30 uppercase tracking-[0.3em] z-10 hidden sm:block"
        style={{ animation: `${anim("coda-slide-in-l", 0.4, 0.6, "var(--ease-motion-out)")}, ${anim("coda-fade-out", 0.4, exitAt + 0.6, "var(--ease-motion-out)", "forwards")}` }}
      >
        SYS.STATUS // OK
      </p>

      {/* ── Percentage Counter (Bottom Right, Crisp, No Glow) ── */}
      <div
        className="absolute bottom-8 right-8 flex items-baseline gap-1 z-10"
        style={{ animation: `${anim("coda-slide-in-r", 0.4, 0.4, "var(--ease-motion-out)")}, ${anim("coda-fade-out", 0.4, exitAt + 0.4, "var(--ease-motion-out)", "forwards")}` }}
      >
        <span
          ref={countRef}
          className="font-mono text-3xl sm:text-5xl font-bold text-white tracking-[0.04em] tabular-nums"
        >
          000
        </span>
        <span className="font-mono text-[#FF5C00] text-sm sm:text-lg font-semibold">%</span>
      </div>
    </div>
  );
}
