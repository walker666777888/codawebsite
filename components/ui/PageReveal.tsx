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
  const logRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.style.overflow = "";
      setTimeout(() => setHidden(true), 0);
      return;
    }

    document.body.style.overflow = "hidden";

    const startTime = performance.now();
    const duration = 1800; // Total loading time

    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      
      // Update percentage counter
      if (countRef.current) {
        countRef.current.textContent = String(Math.floor(p * 100)).padStart(3, "0");
      }

      // Update terminal log based on percentage
      if (logRef.current) {
        const logIndex = Math.min(
          Math.floor(p * BOOT_LOGS.length),
          BOOT_LOGS.length - 1
        );
        logRef.current.textContent = BOOT_LOGS[logIndex];
      }

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        if (logRef.current) logRef.current.textContent = "SYSTEM READY_";
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    const t1 = setTimeout(() => setPhase("exit"), 2100);
    const t2 = setTimeout(() => {
      setHidden(true);
      document.body.style.overflow = "";
    }, 3400);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (hidden) return null;

  // Intense, heavy snapping physical motion
  const panelEase = [0.86, 0, 0.07, 1] as const;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
      
      {/* ── Background Jaws (Horizontal split, cinematic opening) ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[50.1%] bg-[#060605]"
        animate={phase === "exit" ? { y: "-100%" } : { y: 0 }}
        transition={phase === "exit" ? { duration: 1.1, ease: panelEase, delay: 0 } : {}}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[50.1%] bg-[#060605]"
        animate={phase === "exit" ? { y: "100%" } : { y: 0 }}
        transition={phase === "exit" ? { duration: 1.1, ease: panelEase, delay: 0.05 } : {}}
      />

      {/* ── Central Glow Line (Loads, then flashes bright orange on open) ── */}
      <AnimatePresence>
        {phase === "show" && (
          <motion.div
            className="absolute top-[calc(50%-0.5px)] left-0 right-0 origin-left z-20 flex"
            initial={{ scaleX: 0, height: 1, backgroundColor: "rgba(255,255,255,0.1)", boxShadow: "none" }} 
            animate={{ scaleX: 1 }}
            exit={{ 
              height: [1, 4, 0], 
              backgroundColor: ["rgba(255,255,255,0.1)", "rgba(255,92,0,1)", "rgba(255,92,0,0)"],
              boxShadow: ["none", "0 0 40px 4px #FF5C00", "none"],
              opacity: [1, 1, 0],
              transition: { duration: 0.8, ease: "easeOut" } 
            }}
            transition={{ duration: 1.8, ease: "linear" }}
          >
            {/* Blinking playhead at the edge */}
            <motion.div 
              className="absolute inset-y-0 right-0 w-[6px] bg-[#FF5C00] shadow-[0_0_12px_#FF5C00]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.2, 1] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Typography & Logs ── */}
      <AnimatePresence>
        {phase === "show" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(12px)", transition: { duration: 0.45, ease: panelEase } }}
          >
            <div className="flex items-baseline gap-[2px] select-none overflow-hidden pb-4">
              {"CODA".split("").map((char, i) => (
                <motion.span key={i}
                  className="font-instrument text-[clamp(64px,12vw,140px)] text-white tracking-[-0.04em] leading-none block"
                  initial={{ opacity: 0, y: "100%" }} 
                  animate={{ opacity: 1, y: "0%" }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >{char}</motion.span>
              ))}
              <motion.span
                className="font-mono text-[clamp(64px,12vw,140px)] text-[#FF5C00] leading-none block"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7, type: "spring", stiffness: 200, damping: 15 }}
              >.</motion.span>
            </div>
            
            {/* Terminal logs below logo */}
            <motion.div 
              className="mt-2 font-mono text-xs sm:text-sm text-[#FF5C00] tracking-widest uppercase h-4 shadow-[0_0_10px_rgba(255,92,0,0.4)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span ref={logRef}>INITIALIZING...</span>
              <motion.span 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.4 }}
              >_</motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── System Variables (Corners) ── */}
      <AnimatePresence>
        {phase === "show" && (
          <motion.p
            className="absolute bottom-12 left-8 font-mono text-[10px] text-white/30 uppercase tracking-[0.3em] z-10 hidden sm:block"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >SYS.REQ.001</motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "show" && (
          <motion.div
            className="absolute bottom-8 right-8 flex items-baseline gap-1 z-10"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <span ref={countRef} className="font-mono text-[32px] sm:text-[48px] font-bold text-white tracking-[0.05em] tabular-nums drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
              000
            </span>
            <span className="font-mono text-[#FF5C00] text-lg">%</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "show" && (
          <motion.p
            className="absolute top-10 left-8 font-mono text-[10px] text-white/30 uppercase tracking-[0.25em] z-10 hidden sm:block"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >NODE_ENV: PRODUCTION</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
