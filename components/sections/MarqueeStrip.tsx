"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";

const ROW1 = [
  "Technology Solutions", "Brand Systems", "Growth Engineering",
  "AI-Native Builds", "Digital Ecosystems", "Performance Architecture",
  "Market Domination", "System-First Thinking",
];

const SEP = "✦";

interface RowProps {
  items: string[];
  reverse?: boolean;
  speed?: number;
  dim?: boolean;
  paused?: boolean;
}

function MarqueeRow({ items, reverse = false, speed = 28, dim = false, paused = false }: RowProps) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden flex relative">
      <div
        className="flex shrink-0 whitespace-nowrap"
        style={{
          animation: `${reverse ? "marquee-reverse" : "marquee"} ${speed}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-5 mx-5">
            <span
              className={`font-mono text-[10.5px] uppercase tracking-[0.22em] transition-colors duration-400 cursor-default ${
                dim
                  ? "text-[#0D0D0B]/40 hover:text-[#0D0D0B]/65"
                  : "text-[#0D0D0B]/65 hover:text-[#0D0D0B]"
              }`}
            >
              {item}
            </span>
            <span
              className={`shrink-0 ${dim ? "text-[#0D0D0B]/20" : "text-[#FF5C00]/60"}`}
              style={{ fontSize: "6px" }}
            >
              {SEP}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MarqueeStrip() {
  const [paused, setPaused] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={stripRef}
      className="relative overflow-hidden select-none"
      style={{ background: "#F4F0E8" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Top border line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#0D0D0B]/[0.12] to-transparent" />
      {/* Bottom border line */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#0D0D0B]/[0.12] to-transparent" />

      {/* Left/right fade — desktop only */}
      <div className="hidden md:block absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#F4F0E8] to-transparent z-10 pointer-events-none" />
      <div className="hidden md:block absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-[#F4F0E8] to-transparent z-10 pointer-events-none" />

      {/* Pause indicator */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 pointer-events-none"
        animate={{ opacity: paused ? 1 : 0, scale: paused ? 1 : 0.7 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#0D0D0B]/40 bg-[#F4F0E8]/90 backdrop-blur-sm border border-[#0D0D0B]/[0.1] px-4 py-2 rounded-full">
          Paused
        </div>
      </motion.div>

      <div className="py-4">
        <MarqueeRow items={ROW1} speed={32} paused={paused} />
      </div>
    </div>
  );
}
