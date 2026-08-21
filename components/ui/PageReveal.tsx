"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

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

export default function PageReveal() {
  const [phase, setPhase] = useState<"show" | "exit">("show");
  const [hidden, setHidden] = useState(false);
  const countRef = useRef<HTMLSpanElement>(null);
  const logRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.style.overflow = "";
      setTimeout(() => setHidden(true), 0);
      return;
    }

    document.body.style.overflow = "hidden";

    const startTime = performance.now();
    const duration = 1800; // Duration of progress animation in ms

    // Smooth cubic ease-out curve for fluid deceleration
    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const linearP = Math.min(elapsed / duration, 1);
      const smoothP = easeOutCubic(linearP);
      
      // Update percentage counter smoothly
      if (countRef.current) {
        countRef.current.textContent = String(Math.floor(smoothP * 100)).padStart(3, "0");
      }

      // Update hardware-accelerated progress bar smoothly
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${smoothP})`;
      }

      // Update terminal log step
      if (logRef.current) {
        if (linearP >= 1) {
          logRef.current.textContent = "SYSTEM READY";
        } else {
          const logIndex = Math.min(
            Math.floor(linearP * (BOOT_LOGS.length - 1)),
            BOOT_LOGS.length - 2
          );
          logRef.current.textContent = BOOT_LOGS[logIndex];
        }
      }

      if (linearP < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    // Brief hold upon reaching 100% / SYSTEM READY, then initiate smooth exit
    const t1 = setTimeout(() => setPhase("exit"), 2100);
    const t2 = setTimeout(() => {
      setHidden(true);
      document.body.style.overflow = "";
    }, 3100);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  // Ultra-smooth physical easing curve
  const panelEase = [0.86, 0, 0.07, 1] as const;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden select-none">
      
      {/* ── Background Shutter Panels (Smooth split exit) ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[50.1%] bg-[#060605] will-change-transform"
        animate={phase === "exit" ? { y: "-100%" } : { y: "0%" }}
        transition={phase === "exit" ? { duration: 0.95, ease: panelEase, delay: 0 } : {}}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[50.1%] bg-[#060605] will-change-transform"
        animate={phase === "exit" ? { y: "100%" } : { y: "0%" }}
        transition={phase === "exit" ? { duration: 0.95, ease: panelEase, delay: 0.04 } : {}}
      />

      {/* ── Main Center Content ── */}
      <AnimatePresence>
        {phase === "show" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4"
            exit={{ 

              opacity: 0, 
              y: -10, 
              scale: 0.98,
              transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
            }}
          >
            {/* Brand Logo Display */}
            <div className="flex items-baseline gap-[2px] overflow-hidden pb-1">
              {"CODA".split("").map((char, i) => (
                <motion.span 
                  key={i}
                  className="font-instrument text-[clamp(64px,11vw,130px)] text-white tracking-[-0.04em] leading-none block font-semibold"
                  initial={{ opacity: 0, y: "100%" }} 
                  animate={{ opacity: 1, y: "0%" }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  {char}
                </motion.span>
              ))}
              <motion.span
                className="font-mono text-[clamp(64px,11vw,130px)] text-[#FF5C00] leading-none block font-bold"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.55, type: "spring", stiffness: 220, damping: 18 }}
              >
                .
              </motion.span>
            </div>

            {/* Smooth Slim Progress Bar Track */}
            <motion.div 
              className="mt-6 w-48 sm:w-60 h-[2px] bg-white/10 rounded-full overflow-hidden relative"
              initial={{ opacity: 0, scaleX: 0.8 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div 
                ref={progressRef}
                className="absolute inset-0 bg-[#FF5C00] origin-left rounded-full will-change-transform"
                style={{ transform: "scaleX(0)" }}
              />
            </motion.div>
            
            {/* Terminal status line (Clean, simple, no box glow/shadow) */}
            <motion.div 
              className="mt-4 font-mono text-[11px] sm:text-xs text-[#FF5C00] tracking-[0.2em] uppercase flex items-center justify-center gap-1 min-h-[20px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <span ref={logRef}>INITIALIZING...</span>
              <motion.span 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
                className="inline-block text-[#FF5C00] font-bold"
              >
                _
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── System Variables (Top Left) ── */}
      <AnimatePresence>
        {phase === "show" && (
          <motion.div
            className="absolute top-8 left-8 font-mono text-[10px] text-white/30 uppercase tracking-[0.25em] z-10 hidden sm:flex items-center gap-2"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]/80 animate-pulse inline-block" />
            <span>NODE_ENV // PRODUCTION</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom Left Label ── */}
      <AnimatePresence>
        {phase === "show" && (
          <motion.p
            className="absolute bottom-8 left-8 font-mono text-[10px] text-white/30 uppercase tracking-[0.3em] z-10 hidden sm:block"
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            SYS.STATUS // OK
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Percentage Counter (Bottom Right, Crisp, No Glow) ── */}
      <AnimatePresence>
        {phase === "show" && (
          <motion.div
            className="absolute bottom-8 right-8 flex items-baseline gap-1 z-10"
            initial={{ opacity: 0, x: 10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <span 
              ref={countRef} 
              className="font-mono text-3xl sm:text-5xl font-bold text-white tracking-[0.04em] tabular-nums"
            >
              000
            </span>
            <span className="font-mono text-[#FF5C00] text-sm sm:text-lg font-semibold">%</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
