"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LenisCtx {
  stop:  () => void;
  start: () => void;
}

const LenisContext = createContext<LenisCtx>({ stop: () => {}, start: () => {} });

export function useLenisControl() {
  return useContext(LenisContext);
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
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
  };

  return (
    <LenisContext.Provider value={ctrl}>
      {children}
    </LenisContext.Provider>
  );
}
