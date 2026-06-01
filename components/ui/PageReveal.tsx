"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function PageReveal() {
  const [phase, setPhase] = useState<"show" | "exit">("show");
  const [hidden, setHidden] = useState(false);
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.style.overflow = "";
      setHidden(true);
      return;
    }

    document.body.style.overflow = "hidden";

    const startTime = performance.now();
    const duration = 1300;
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(p * 100));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const t1 = setTimeout(() => setPhase("exit"), 1700);
    const t2 = setTimeout(() => {
      setHidden(true);
      document.body.style.overflow = "";
    }, 2700);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  const panelEase = [0.76, 0, 0.24, 1] as const;

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-[#0D0D0B]"
        animate={phase === "exit" ? { x: "-100%" } : { x: 0 }}
        transition={phase === "exit" ? { duration: 0.95, ease: panelEase, delay: 0 } : {}}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-[#0D0D0B]"
        animate={phase === "exit" ? { x: "100%" } : { x: 0 }}
        transition={phase === "exit" ? { duration: 0.95, ease: panelEase, delay: 0.05 } : {}}
      />

      <AnimatePresence>
        {phase === "show" && (
          <motion.div
            className="absolute inset-x-0 top-0 h-[2px] bg-[#FF5C00] origin-left z-10"
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 1.3, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "show" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.35, ease: panelEase } }}
          >
            <div className="flex items-baseline gap-[2px] select-none">
              {"CODA".split("").map((char, i) => (
                <motion.span key={i}
                  className="font-instrument text-[clamp(56px,10vw,96px)] text-white tracking-[-0.04em] leading-none"
                  initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >{char}</motion.span>
              ))}
              <motion.span
                className="font-mono text-[clamp(56px,10vw,96px)] text-[#FF5C00] leading-none"
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.45, delay: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
              >.</motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "show" && (
          <motion.p
            className="absolute bottom-8 left-8 font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] z-10"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >Dominate the digital age</motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "show" && (
          <motion.p
            className="absolute bottom-8 right-8 font-mono text-[11px] text-white/25 tracking-[0.1em] z-10 tabular-nums"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >{String(count).padStart(3, "0")}</motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "show" && (
          <motion.p
            className="absolute top-8 right-8 font-mono text-[10px] text-white/15 uppercase tracking-[0.25em] z-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >© 2025</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
