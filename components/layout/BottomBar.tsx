"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function BottomBar() {
  const [visible, setVisible] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(y > 400);
      setScrollPct(max > 0 ? Math.round((y / max) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="complementary"
          aria-label="Quick contact bar"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <motion.div
            className="relative bg-[#F4F0E8]/95 backdrop-blur-xl border border-[#0D0D0B]/[0.12] shadow-[0_8px_40px_rgba(0,0,0,0.12)] rounded-full p-1.5 flex items-center gap-2 pointer-events-auto"
            whileHover={{ boxShadow: "0 14px 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,92,0,0.25)" }}
            transition={{ duration: 0.3 }}
          >
            {/* Scroll % indicator arc on left */}
            <div className="hidden sm:flex items-center gap-3 pl-4 pr-3.5 border-r border-[#0D0D0B]/[0.1]">
              {/* Live dot */}
              <div className="relative flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
                <motion.span
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#39FF14]"
                  animate={{ scale: [1, 2.6, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  aria-hidden="true"
                />
              </div>
              <span className="font-instrument text-[16px] text-[#0D0D0B]/75 whitespace-nowrap">
                Start building
              </span>
              {/* Scroll progress badge */}
              <span className="font-mono text-[9px] text-[#0D0D0B]/35 tracking-[0.15em] tabular-nums ml-1">
                {String(scrollPct).padStart(2, "0")}%
              </span>
            </div>

            <MagneticButton variant="primary">
              <span className="flex items-center gap-1.5 font-sans font-semibold text-[13px] px-5 py-2.5 whitespace-nowrap tracking-[-0.01em]">
                Claim your edge
                <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
              </span>
            </MagneticButton>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
