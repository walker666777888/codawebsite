"use client";

import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useRef, useCallback, useState, type PointerEvent } from "react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import HoverCanvas, { type CanvasEffect } from "@/components/ui/HoverCanvas";

interface StatDef {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  description: string;
}

const stats: StatDef[] = [
  {
    value: 45,
    suffix: "%",
    label: "Visibility Lift",
    sub: "SEO + Paid",
    description:
      "Average organic and paid search visibility gain across all active client portfolios.",
  },
  {
    value: 40,
    suffix: "%",
    label: "Engagement Uplift",
    sub: "UX Systems",
    description:
      "Mean increase in user engagement depth after deploying CODA's interaction architecture.",
  },
  {
    value: 3,
    suffix: "×",
    label: "Faster to Market",
    sub: "Engineering",
    description:
      "Speed advantage over industry average from day-one design system coverage.",
  },
  {
    value: 12,
    suffix: "+",
    label: "Systems Delivered",
    sub: "Production",
    description:
      "High-performance digital products shipped end-to-end at production grade.",
  },
];

interface TileProps {
  stat: StatDef;
  index: number;
  className?: string;
  large?: boolean;
  /** Parallax travel (px) for the metric — varied per tile to build depth. */
  depth?: number;
  /** Distinct canvas hover effect for this tile. */
  effect: CanvasEffect;
}

const FLOAT_DELAY = [0, 0.6, 1.2, 1.8]; // stagger idle floats per tile

function SpotlightTile({ stat, index, className = "", large = false, depth = 26, effect }: TileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  /* ── Scroll-scrubbed entrance ── */
  const { scrollYProgress: enterRaw } = useScroll({
    target: tileRef,
    offset: ["start 0.92", "start 0.5"],
  });
  const enter = useSpring(enterRaw, { stiffness: 80, damping: 30, mass: 0.5 });
  const revealOpacity = useTransform(enter, [0, 0.55], [0, 1]);
  const revealY = useTransform(enter, [0, 1], [60, 0]);
  const revealScale = useTransform(enter, [0, 1], [0.94, 1]);

  /* ── Parallax (reduced depth for performance) ── */
  const { scrollYProgress: passRaw } = useScroll({
    target: tileRef,
    offset: ["start end", "end start"],
  });
  const pass = useSpring(passRaw, { stiffness: 50, damping: 30, mass: 0.6 });
  const numberY = useTransform(pass, [0, 1], [depth * 0.6, -depth * 0.6]);

  /* ── Cursor spotlight ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { damping: 30, stiffness: 120 });
  const y = useSpring(rawY, { damping: 30, stiffness: 120 });
  const spotOpacity = useMotionValue(0);
  const smoothOpacity = useSpring(spotOpacity, { damping: 35, stiffness: 120 });

  const spotlight = useMotionTemplate`radial-gradient(240px circle at ${x}px ${y}px, rgba(255,92,0,0.11) 0%, transparent 70%)`;
  const borderGlow = useMotionTemplate`radial-gradient(200px circle at ${x}px ${y}px, rgba(255,92,0,0.40) 0%, transparent 65%)`;

  /* ── Tilt (lower stiffness = fewer RAF updates) ── */
  const rawTiltX = useMotionValue(0);
  const rawTiltY = useMotionValue(0);
  const tiltX = useSpring(rawTiltX, { stiffness: 100, damping: 22 });
  const tiltY = useSpring(rawTiltY, { stiffness: 100, damping: 22 });

  // Cache rect on enter, refresh on resize — never call getBCR in the hot move path
  const onPointerEnter = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      rectRef.current = tileRef.current?.getBoundingClientRect() ?? null;
      const rect = rectRef.current;
      if (!rect) return;
      rawX.set(e.clientX - rect.left);
      rawY.set(e.clientY - rect.top);
      spotOpacity.set(1);
      setHovered(true);
    },
    [rawX, rawY, spotOpacity]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const rect = rectRef.current;
      if (!rect) return;
      rawX.set(e.clientX - rect.left);
      rawY.set(e.clientY - rect.top);
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      rawTiltY.set((px - 0.5) * 6);
      rawTiltX.set(-(py - 0.5) * 6);
    },
    [rawX, rawY, rawTiltX, rawTiltY]
  );

  const onPointerLeave = useCallback(() => {
    spotOpacity.set(0);
    rawTiltX.set(0);
    rawTiltY.set(0);
    setHovered(false);
  }, [spotOpacity, rawTiltX, rawTiltY]);

  return (
    <motion.div
      ref={tileRef}
      className={`group relative overflow-hidden rounded-2xl cursor-default select-none ${className}`}
      style={
        reduced
          ? { boxShadow: "0 20px 60px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(13,13,11,0.07)" }
          : {
              opacity: revealOpacity,
              y: revealY,
              scale: revealScale,
              rotateX: tiltX,
              rotateY: tiltY,
              transformPerspective: 900,
              willChange: "transform, opacity",
            }
      }
      animate={reduced ? {} : {
        y: [0, -5, 0],
        boxShadow: "0 24px 60px -10px rgba(210, 120, 80, 0.25), 0 0 0 1px rgba(13,13,11,0.07)",
      }}
      transition={hovered ? { duration: 0.3, ease: [0.16, 1, 0.3, 1] } : {
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: FLOAT_DELAY[index] },
        boxShadow: { duration: 0.4, ease: "easeOut" },
      }}

      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Gradient border via mask */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ padding: "1px", background: "rgba(13,13,11,0.08)" }}
        aria-hidden
      >
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: borderGlow, opacity: smoothOpacity }}
        />
        <div
          className="absolute inset-[1px] rounded-[14px]"
          style={{ background: "linear-gradient(180deg,#FFFFFF 0%,#FBF9F4 100%)" }}
        />
      </div>


      {/* Premium canvas hover effect — fades in behind the text, clipped to radius */}
      {!reduced && <HoverCanvas effect={effect} active={hovered} />}

      {/* Spotlight fill (above canvas, still behind text) */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-[3]"
        style={{ background: spotlight, opacity: smoothOpacity }}
        aria-hidden
      />

      {/* Top sheen */}
      <div
        className="absolute inset-x-0 top-0 h-px rounded-t-2xl opacity-60 z-[3]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)",
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-7 md:p-9">
        {/* Top meta */}
        <div className="flex items-start justify-between gap-2 mb-6">
          <span className="font-mono text-[10px] tracking-[0.24em] text-[#9A9488] uppercase">
            {String(index + 1).padStart(2, "0")}
          </span>
          <motion.span
            className="font-mono text-[9px] tracking-[0.18em] text-[#6F6A60] uppercase border rounded-full px-3 py-1 transition-colors duration-300 group-hover:bg-[#FBF9F4]/60"
            style={{ borderColor: "rgba(13,13,11,0.1)" }}
            animate={{ borderColor: ["rgba(13,13,11,0.1)", "rgba(255,92,0,0.4)", "rgba(13,13,11,0.1)"] }}
            transition={{ duration: 4, repeat: Infinity, delay: index * 0.8 }}
          >
            {stat.sub}
          </motion.span>
        </div>

        {/* Metric — extra large, gentle parallax + glass plate for legibility */}
        <motion.div
          className="my-auto py-2"
          style={reduced ? undefined : { y: numberY }}
        >
          <div
            className="font-instrument text-[#14130F] leading-[0.88] tracking-[-0.03em] tabular-nums transition-colors duration-500 group-hover:text-[#FF5C00]"
            style={{ fontSize: large ? "clamp(80px, 11vw, 140px)" : "clamp(64px, 8vw, 110px)" }}
          >
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </div>
        </motion.div>

        {/* Bottom — glass plate keeps copy crisp over the animation */}
        <div className="mt-auto -mx-2 px-2 py-1.5 rounded-xl transition-colors duration-300 group-hover:bg-[#FBF9F4]/60">
          <p className="font-sans text-[15px] font-medium text-[#14130F] leading-tight mb-2">
            {stat.label}
          </p>
          <p className="font-sans text-[12px] text-[#6F6A60] leading-relaxed">
            {stat.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function BentoMetrics() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });
  const reduced = useReducedMotion();

  // Subtle parallax drift on the ambient glow.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section ref={sectionRef} className="relative bg-[#F4F0E8] px-6 py-10 overflow-hidden">
      {/* Ambient top glow */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[340px] pointer-events-none"
        style={{
          y: reduced ? 0 : glowY,
          background:
            "radial-gradient(ellipse at center top, rgba(255,92,0,0.14) 0%, transparent 68%)",
        }}
      />

      {/* Contained to match the rest of the site (no longer edge-to-edge) */}
      <div className="max-w-7xl mx-auto w-full">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-6 border-t border-[#0D0D0B]/[0.1] pt-8"
        >
          <div>
            <p className="font-mono text-[10px] text-[#6F6A60] uppercase tracking-[0.28em] mb-3">
              Impact Metrics
            </p>
            <h2
              className="font-instrument text-[#14130F] leading-[1.05] tracking-[-0.025em]"
              style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
            >
              Results that compound.
            </h2>
          </div>
          <motion.span
            className="font-mono text-[10px] text-[#9A9488] uppercase tracking-[0.25em] hidden sm:block"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            CODA / Performance
          </motion.span>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 auto-rows-[minmax(220px,auto)] gap-4">
          <SpotlightTile stat={stats[0]} index={0} className="lg:col-span-3 lg:row-span-2" large depth={16} effect="matrix" />
          <SpotlightTile stat={stats[1]} index={1} className="lg:col-span-9" depth={34} effect="spheres" />
          <SpotlightTile stat={stats[2]} index={2} className="lg:col-span-6" depth={28} effect="network" />
          <SpotlightTile stat={stats[3]} index={3} className="lg:col-span-3" depth={22} effect="plasma" />
        </div>
      </div>
    </section>
  );
}
