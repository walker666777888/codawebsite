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
       * lerp: interpolation factor per frame.
       * Lower = silkier / more momentum (butter-smooth).
       * 0.065 = liquid glide with minimal overshoot on desktop.
       */
      lerp: 0.065,

      /**
       * duration: easing duration cap in seconds.
       */
      duration: 1.4,

      /**
       * Easing: exponential-out — starts fast, decelerates gently
       * like butter sliding to a stop.
       */
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),

      /**
       * wheelMultiplier: slightly below 1 so per-tick motion feels
       * continuous rather than stepped.
       */
      wheelMultiplier: 0.9,

      /** Smooth wheel scrolling (mouse wheel / trackpad) */
      smoothWheel: true,

      /** Clean edges — no infinite loop */
      infinite: false,
    });

    lenisRef.current = lenis;

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis via GSAP's RAF — ensures perfect frame-sync with all animations
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

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
