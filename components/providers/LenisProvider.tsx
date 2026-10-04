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

/* ─────────────────────────────────────────────────────────────────
   Native scrolling is used everywhere. Lenis moves the page from a
   main-thread requestAnimationFrame loop, so on this page (which does a
   lot of per-frame paint/layer work) every frame that ran over budget
   froze the scroll itself — measured ~50–60% of frames stalling while
   wheel-scrolling. Native scroll runs on the compositor thread and stays
   smooth regardless; the browser still smooths mouse-wheel input itself.
   Flip this to re-enable the Lenis glide on desktop.
───────────────────────────────────────────────────────────────── */
const USE_LENIS = false;

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

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!USE_LENIS || isTouchDevice || prefersReducedMotion) return; // native scroll

    // ─── Desktop: full butter-smooth Lenis ─────────────────────────────────
    const lenis = new Lenis({
      /**
       * lerp: linear interpolation factor per frame (0–1).
       * 0.1 is Lenis' tuned default — still a smooth glide, but the page
       * tracks the wheel closely. 0.05 trailed the input by ~1s, which read
       * as input lag and kept every scroll-linked animation running twice
       * as long per wheel tick.
       */
      lerp: 0.1,

      wheelMultiplier: 1,
      touchMultiplier: 1.5,

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

  // With native scrolling, "stop" (e.g. while the build-form modal is open)
  // simply locks the page scroll.
  const ctrl: LenisCtx = {
    stop:  () => {
      if (lenisRef.current) lenisRef.current.stop();
      else document.documentElement.style.overflow = "hidden";
    },
    start: () => {
      if (lenisRef.current) lenisRef.current.start();
      else document.documentElement.style.overflow = "";
    },
    lenis: () => lenisRef.current,
  };

  return (
    <LenisContext.Provider value={ctrl}>
      {children}
    </LenisContext.Provider>
  );
}
