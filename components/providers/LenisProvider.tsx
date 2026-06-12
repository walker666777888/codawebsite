"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LenisCtx {
  stop:  () => void;
  start: () => void;
  lenis: () => Lenis | null;
}

const LenisContext = createContext<LenisCtx>({
  stop:  () => {},
  start: () => {},
  lenis: () => null,
});

export function useLenisControl() {
  return useContext(LenisContext);
}

/* ─────────────────────────────────────────────────────────────────
   Module-level instance + smooth scrollTo helper.
   Lets non-component helpers (nav/footer anchor handlers) glide via
   Lenis instead of native `scrollIntoView`, which would fight Lenis
   and cause a janky double-animation. Falls back to native smooth
   scroll on touch devices where Lenis is intentionally disabled.
───────────────────────────────────────────────────────────────── */
let lenisInstance: Lenis | null = null;

export function lenisScrollTo(
  target: string | HTMLElement,
  { offset = -88 }: { offset?: number } = {}
) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset,
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    return;
  }
  // Touch / no-Lenis fallback — native smooth scroll with header offset
  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (el instanceof HTMLElement) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // ─── Mobile: skip Lenis entirely ───────────────────────────────────────
    // Lenis replaces native touch scroll with a JS animation loop, which
    // cannot match the GPU-accelerated 60-120 fps of native browser scroll.
    // On touch devices we let the browser handle scroll natively — it's
    // hardware-accelerated and already butter-smooth.
    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    if (isTouchDevice) return; // native scroll on mobile — no Lenis needed

    // ─── Desktop: full butter-smooth Lenis ─────────────────────────────────
    const lenis = new Lenis({
      /**
       * lerp: linear interpolation factor per frame (0–1).
       * 0.08 → silkier glide than 0.09 — a touch more "weight" that
       * reads as buttery, without feeling laggy on fast scrolls.
       * Do NOT set duration when using lerp — they conflict.
       */
      lerp: 0.08,

      /**
       * Easing: smooth cubic — organic deceleration, no abrupt stop.
       * (Applies to programmatic scrollTo; lerp drives wheel/trackpad.)
       */
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

      /**
       * wheelMultiplier: 1.0 — natural, controlled steps per wheel notch.
       * Above 1 adds a jumpy feel that fights the smooth interpolation.
       */
      wheelMultiplier: 1.0,

      /**
       * touchMultiplier: for trackpads.
       */
      touchMultiplier: 1.0,

      /** Smooth wheel scrolling (mouse wheel / trackpad) */
      smoothWheel: true,

      /** Clean edges — no infinite loop */
      infinite: false,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position.
    // Lenis v1.3 updates window.scrollY natively on each frame, so no
    // scrollerProxy is needed — just notify ScrollTrigger on each scroll event.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis via GSAP's RAF — ensures perfect frame-sync with all animations.
    // GSAP passes time in seconds; lenis.raf() expects milliseconds.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    // Prevent GSAP from throttling frames during heavy animation (kills jank)
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
      lenisRef.current = null;
      lenisInstance = null;
    };
  }, []);

  const ctrl: LenisCtx = {
    stop:  () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
    lenis: () => lenisRef.current,
  };

  return (
    <LenisContext.Provider value={ctrl}>
      {children}
    </LenisContext.Provider>
  );
}
