"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, useState } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import { Code2, PenTool, TrendingUp } from "lucide-react";

const cards = [
  {
    num: "01",
    icon: Code2,
    title: "Build Fast.",
    subtitle: "Ship Faster.",
    desc: "From zero to production in weeks, not months. We cut the bloat, ship clean code, and architect systems your team can actually own long-term.",
    tags: ["Next.js", "Node.js", "AI / ML", "TypeScript"],
    glow: "rgba(96,165,250,0.14)",
    accent: "rgba(96,165,250,0.5)",
    shimmer: "rgba(147,197,253,0.08)",
  },
  {
    num: "02",
    icon: PenTool,
    title: "Look Premium.",
    subtitle: "Convert Better.",
    desc: "Design that makes people stop scrolling. Every pixel earns its place — from your first impression to your checkout flow.",
    tags: ["Brand", "Motion", "UI Systems", "Figma"],
    glow: "rgba(255,92,0,0.14)",
    accent: "rgba(255,92,0,0.6)",
    shimmer: "rgba(255,92,0,0.06)",
  },
  {
    num: "03",
    icon: TrendingUp,
    title: "Grow Smarter.",
    subtitle: "Scale Harder.",
    desc: "We don't run campaigns. We build acquisition machines — funnels, SEO, and paid systems engineered to compound month over month.",
    tags: ["Paid Ads", "SEO", "CRO", "Funnels"],
    glow: "rgba(167,139,250,0.14)",
    accent: "rgba(167,139,250,0.5)",
    shimmer: "rgba(167,139,250,0.07)",
  },
];

function TiltCard({ card, index }: { card: typeof cards[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [hovered, setHovered] = useState(false);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);

  const springRotX = useSpring(rotX, { stiffness: 140, damping: 28 });
  const springRotY = useSpring(rotY, { stiffness: 140, damping: 28 });

  const onMouseEnter = () => {
    rectRef.current = cardRef.current?.getBoundingClientRect() ?? null;
    setHovered(true);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = rectRef.current;
    if (!rect) return;
    const cx = (e.clientX - rect.left) / rect.width;
    const cy = (e.clientY - rect.top) / rect.height;
    rotX.set(-(cy - 0.5) * 10);
    rotY.set((cx - 0.5) * 10);
    glowX.set(cx * 100);
    glowY.set(cy * 100);
  };

  const onMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    glowX.set(50);
    glowY.set(50);
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX: springRotX,
          rotateY: springRotY,
          transformStyle: "preserve-3d",
        }}
        className="group relative rounded-2xl overflow-hidden cursor-default"
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-[1] animate-border-rotate"
          style={{
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            padding: "1px",
            background: `conic-gradient(from var(--border-angle), transparent 30%, ${card.accent} 50%, transparent 70%)`,
          }}
        />

        {/* Base card */}
        <div
          className="relative rounded-2xl border border-[#0D0D0B]/[0.1] overflow-hidden"
          style={{ background: "rgba(255,255,255,0.96)" }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 inset-x-0 h-[1px] transition-all duration-700 z-[2]"
            style={{
              background: hovered
                ? `linear-gradient(to right, transparent, ${card.accent}, transparent)`
                : "linear-gradient(to right, transparent, rgba(13,13,11,0.12), transparent)",
            }}
          />

          {/* Mouse-tracked inner glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${card.glow} 0%, transparent 65%)`,
            }}
          />

          {/* Corner glow */}
          <div
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-[2]"
            style={{ background: card.glow }}
          />

          {/* Shimmer sweep */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-[3]">
            <motion.div
              className="absolute inset-y-0 w-[60%] skew-x-[-20deg]"
              style={{
                background: `linear-gradient(105deg, transparent 20%, ${card.shimmer} 50%, transparent 80%)`,
              }}
              animate={{ x: hovered ? "250%" : "-100%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* Content */}
          <div className="relative z-[10] p-5 sm:p-8 flex flex-col min-h-[300px] sm:min-h-[360px] justify-between" style={{ transform: "translateZ(20px)" }}>
            <div>
              {/* Header row */}
              <div className="flex items-center justify-between mb-6 sm:mb-10">
                <span className="font-mono text-[11px] text-[#6F6A60] tracking-widest">{card.num}</span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#0D0D0B]/[0.1] bg-[#0D0D0B]/[0.04] group-hover:border-[#0D0D0B]/30 transition-all duration-400"
                  style={{ boxShadow: hovered ? `0 0 20px ${card.glow}` : "none" }}
                >
                  <card.icon className="w-4.5 h-4.5 text-[#4A463F] group-hover:text-[#0D0D0B]/80 transition-colors duration-400" />
                </div>
              </div>

              {/* Title */}
              <h3
                className="font-instrument leading-[1.08] tracking-[-0.025em] text-[#0D0D0B]/80 group-hover:text-[#0D0D0B] transition-colors duration-400 mb-4"
                style={{ fontSize: "clamp(22px, 5vw, 32px)" }}
              >
                {card.title}
                <br />
                <span className="italic text-[#FF5C00]">{card.subtitle}</span>
              </h3>

              <div
                className="relative rounded-2xl overflow-hidden p-4"
                style={{
                  background: "rgba(255,255,255,0.45)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.6)",
                }}
              >
                <p className="font-sans text-[14px] text-[#4A463F] leading-[1.7] group-hover:text-[#0D0D0B]/65 transition-colors duration-500">
                  {card.desc}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8">
              {card.tags.map((tag, ti) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.82 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.08 + ti * 0.05 }}
                  className="font-mono text-[10px] uppercase tracking-widest text-[#6F6A60] border border-[#0D0D0B]/[0.12] rounded-full px-3 py-1 group-hover:border-[#0D0D0B]/20 group-hover:text-[#4A463F] transition-all duration-300"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Bottom gradient */}
          <div
            className="absolute inset-x-0 bottom-0 h-28 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[2]"
            style={{ background: `linear-gradient(to top, ${card.glow.replace("0.14)", "0.1)")}, transparent)` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6" style={{ background: "#F4F0E8" }}>
      {/* Top line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#0D0D0B]/15 to-transparent" />

      {/* Ambient */}
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[130px] opacity-[0.07] pointer-events-none animate-glow-pulse"
        style={{ background: "radial-gradient(ellipse, #FF5C00 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 sm:mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel index={4} className="mb-4">Capabilities</SectionLabel>
            <h2
              className="font-instrument text-[#0D0D0B] tracking-[-0.03em] leading-[1.05]"
              style={{ fontSize: "clamp(36px, 4.5vw, 60px)" }}
            >
              Your stack.
              <br />
              <span className="italic text-[#FF5C00]">Rebuilt right.</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-sans text-[15px] text-[#4A463F] leading-[1.7] max-w-xs"
          >
            No bloat, no fluff. Just the three pillars that actually move the needle.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <TiltCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
