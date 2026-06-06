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
       * 0.09 → smooth but responsive — the sweet spot.
       * Too low (0.05) = laggy feel on fast scrolls.
       * Do NOT set duration when using lerp — they conflict.
       */
      lerp: 0.09,

      /**
       * Easing: smooth cubic — organic deceleration, no abrupt stop.
       */
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

      /**
       * wheelMultiplier: slightly above 1 for a more responsive feel.
       */
      wheelMultiplier: 1.1,

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

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position.
    // Lenis v1.3 updates window.scrollY natively on each frame, so no
    // scrollerProxy is needed — just notify ScrollTrigger on each scroll event.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis via GSAP's RAF — ensures perfect frame-sync with all animations.
    // GSAP passes time in seconds; lenis.raf() expects milliseconds.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    // Tell GSAP to fire every frame (60/120fps) — never drop below.
    gsap.ticker.fps(120);

    // Prevent GSAP from throttling frames during heavy animation (kills jank)
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
      lenisRef.current = null;
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
