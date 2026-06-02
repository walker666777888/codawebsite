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
    // Detect touch / mobile devices for tuned feel
    const isMobile =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const lenis = new Lenis({
      /**
       * lerp: interpolation factor per frame.
       * Lower = silkier / more momentum (butter-smooth).
       * Desktop: 0.065  — liquid glide, minimal overshoot
       * Mobile : 0.08   — slightly snappier so it feels responsive on touch
       */
      lerp: isMobile ? 0.08 : 0.065,

      /**
       * duration: easing duration in seconds (used when lerp is undefined).
       * We keep lerp as primary control but set this as a safety cap.
       */
      duration: 1.4,

      /**
       * Easing: custom cubic-bezier for a premium deceleration curve.
       * Starts fast, decelerates gently — like butter sliding to a stop.
       */
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),

      /**
       * wheelMultiplier: scroll distance per wheel tick.
       * 0.9 slightly reduces the per-tick jump so motion feels continuous.
       */
      wheelMultiplier: 0.9,

      /**
       * touchMultiplier: finger drag amplification on mobile.
       * 2 gives a natural 1:1-ish feel with a little extra glide.
       */
      touchMultiplier: 2,

      /** Smooth wheel scrolling (mouse wheel / trackpad) */
      smoothWheel: true,

      /** Prevent over-scrolling past content boundaries */
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
