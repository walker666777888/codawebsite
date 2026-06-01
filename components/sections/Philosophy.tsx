"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useRef, useState, useCallback, useEffect } from "react";
import SectionLabel from "@/components/ui/SectionLabel";

/* ─── data ──────────────────────────────────────────────── */
const PRINCIPLES = [
  {
    num: "01",
    title: "System-first,",
    accent: "always.",
    body: "We never build features in isolation. Every touchpoint code, design, copy, acquisition is engineered as a single compounding system. That's what separates durable growth from one-off wins.",
    glyph: "∑",
    tag: "Foundation",
  },
  {
    num: "02",
    title: "Obsess over",
    accent: "leverage.",
    body: "One great system beats ten mediocre executions. We ruthlessly identify the highest-leverage moves and go all-in so our clients gain unfair advantages that multiply over time.",
    glyph: "×",
    tag: "Strategy",
  },
  {
    num: "03",
    title: "Ship with",
    accent: "precision.",
    body: "Speed without craft is noise. We move fast and finish clean every pixel, every API response, every sentence deliberate. Quality is the only thing that compounds.",
    glyph: "◎",
    tag: "Craft",
  },
  {
    num: "04",
    title: "Truth over",
    accent: "comfort.",
    body: "We say the hard thing. If a strategy won't work, you'll hear it from us first. That honesty is what makes the relationship valuable and what keeps clients coming back.",
    glyph: "→",
    tag: "Integrity",
  },
];

const STATS = [
  { value: "7+", label: "Years operating" },
  { value: "100%", label: "Systems approach" },
  { value: "∞", label: "Compounding" },
];

/* ─── count-up hook ─────────────────────────────────────── */
function useCountUp(target: number | null, inView: boolean, delay: number) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView || target === null) return;
    let raf: number;
    let startTime: number | null = null;
    const DURATION = 1400;
    const id = setTimeout(() => {
      const step = (ts: number) => {
        if (!startTime) startTime = ts;
        const p = Math.min((ts - startTime) / DURATION, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setCount(Math.round(eased * target));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay * 1000);
    return () => { clearTimeout(id); cancelAnimationFrame(raf); };
  }, [inView, target, delay]);
  return count;
}

/* ─── stat pill ─────────────────────────────────────────── */
function StatPill({ value, label, delay, triggered, index }: {
  value: string; label: string; delay: number; triggered: boolean; index: number;
}) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  /* count-up */
  const numMatch = value.match(/^(\d+)/);
  const numericTarget = numMatch ? parseInt(numMatch[1]) : null;
  const numericSuffix = numericTarget !== null ? value.slice(numMatch![0].length) : null;
  const isSymbol = numericTarget === null;
  const count = useCountUp(reduced ? null : numericTarget, triggered, delay);
  const displayValue = isSymbol
    ? value
    : reduced
      ? `${numericTarget}${numericSuffix}`
      : `${count}${numericSuffix}`;

  const numFontSize = "clamp(28px, 6.5vw, 72px)";

  return (
    <div
      className="relative flex flex-col cursor-default px-4 py-5 sm:px-7 sm:py-8"
      style={{ minHeight: "clamp(120px, 20vw, 188px)" }}
    >
      {/* index tag */}
      <span className="font-mono text-[9px] tracking-[0.28em] text-[#C8C2B8] self-start">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* number wrapper — fixed height so all 3 cells stay vertically even */}
      <div className="flex items-center" style={{ height: "clamp(50px, 10vw, 90px)", marginTop: 6 }}>
        <motion.span
          className="font-instrument leading-none tracking-[-0.03em] tabular-nums block"
          style={{ fontSize: numFontSize }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          animate={{ color: hovered ? "#FF5C00" : "#14130F" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {displayValue}
        </motion.span>
      </div>

      {/* orange hairline + label — pinned consistently below number area */}
      <div className="mt-3 pt-3 sm:mt-5 sm:pt-4 border-t" style={{ borderColor: "rgba(255,92,0,0.2)" }}>
        <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.18em] sm:tracking-[0.28em] text-[#6F6A60] leading-tight block">
          {label}
        </span>
      </div>
    </div>
  );
}

/* ─── principle row ─────────────────────────────────────────
   Height: CSS grid 0fr→1fr (smooth, doesn't touch siblings)
   Content: AnimatePresence springs (tag badge + body stagger)
   Hover:   motion values only — zero React re-renders
──────────────────────────────────────────────────────────── */
function PrincipleRow({
  p, index, reduced,
}: {
  p: (typeof PRINCIPLES)[number];
  index: number;
  reduced: boolean;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [open, setOpen] = useState(false);

  /* ── spring configs ── */
  const MED    = { stiffness: 150, damping: 22, mass: 0.5 } as const;
  const SOFT   = { stiffness: 80,  damping: 18, mass: 0.6 } as const;
  const SNAPPY = { stiffness: 260, damping: 24, mass: 0.4 } as const;

  /* ── hover motion values — all micro-interactions, zero re-renders ── */
  const hMv         = useMotionValue(0);
  const washOpacity = useSpring(useTransform(hMv, [0, 1], [0, 1]),        MED);
  const barScaleY   = useSpring(useTransform(hMv, [0, 1], [0, 1]),        MED);
  const barOpacity  = useSpring(useTransform(hMv, [0, 1], [0, 1]),        MED);
  const accentX     = useSpring(useTransform(hMv, [0, 1], [0, 9]),        SNAPPY);
  const glyphBgMv   = useSpring(useTransform(hMv, [0, 1], [0.05, 0.13]), MED);
  const glyphScale  = useSpring(useTransform(hMv, [0, 1], [1, 1.12]),     SNAPPY);
  const glyphRot    = useSpring(useTransform(hMv, [0, 1], [0, 22]),       SOFT);
  const numOpacity  = useSpring(useTransform(hMv, [0, 1], [0.3, 1]),      MED);

  const glyphBg = useTransform(glyphBgMv, (a) => `rgba(255,92,0,${a.toFixed(3)})`);

  const onEnter = useCallback(() => { hMv.set(1); setOpen(true);  }, [hMv]);
  const onLeave = useCallback(() => { hMv.set(0); setOpen(false); }, [hMv]);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative border-b border-[#0D0D0B]/[0.07] cursor-default"
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.07, ease }}
    >
      {/* hover wash — motion value opacity, compositor-only */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg,rgba(255,92,0,0.06) 0%,transparent 70%)",
          opacity: washOpacity,
        }}
      />

      {/* left accent bar — spring scaleY from top */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full origin-top"
        style={{
          background: "linear-gradient(to bottom,#FF5C00,rgba(255,92,0,0.15))",
          scaleY: barScaleY,
          opacity: barOpacity,
        }}
      />

      <div className="relative flex items-start gap-3 md:gap-10 py-6 md:py-9 px-4 md:px-8">

        {/* index number */}
        <motion.span
          className="font-mono text-[11px] tracking-[0.25em] shrink-0 w-7 mt-2 text-[#FF5C00]"
          style={{ opacity: numOpacity }}
        >
          {p.num}
        </motion.span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 pt-1">
            <span
              className="font-instrument text-[#0D0D0B] leading-[1.05] tracking-[-0.03em]"
              style={{ fontSize: "clamp(22px, 3.5vw, 52px)" }}
            >
              {p.title}
            </span>
            <motion.span
              className="font-instrument italic text-[#FF5C00] leading-[1.05] tracking-[-0.03em]"
              style={{ fontSize: "clamp(22px, 3.5vw, 52px)", x: accentX }}
            >
              {p.accent}
            </motion.span>
          </div>

          {/* CSS grid reveal */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: open ? "1fr" : "0fr",
              transition: reduced ? "none" : "grid-template-rows 460ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div className="overflow-hidden">
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="body"
                    className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6 mt-4 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6, transition: { duration: 0.14, ease: [0.4, 0, 1, 0.6] } }}
                    transition={{ opacity: { duration: 0.25, ease }, y: { type: "spring", stiffness: 400, damping: 32 } }}
                  >
                    <motion.span
                      className="shrink-0 font-mono text-[8px] uppercase tracking-[0.22em] text-[#FF5C00] border border-[rgba(255,92,0,0.3)] rounded-full px-2.5 py-1"
                      initial={{ opacity: 0, scale: 0.75, x: -8 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 360, damping: 24, delay: 0.06 }}
                    >
                      {p.tag}
                    </motion.span>
                    <motion.p
                      className="font-sans text-[13px] md:text-[15px] text-[#4A463F] leading-[1.8] max-w-lg"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 320, damping: 28, delay: 0.1 }}
                    >
                      {p.body}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* glyph circle — hidden on mobile to save space */}
        <motion.div
          className="relative shrink-0 w-12 h-12 md:w-16 md:h-16 items-center justify-center rounded-full mt-1 hidden md:flex"
          style={{ background: glyphBg, scale: glyphScale }}
        >
          <motion.span
            className="font-instrument text-[#FF5C00] select-none leading-none"
            style={{ fontSize: "clamp(18px, 2vw, 28px)", rotate: glyphRot }}
          >
            {p.glyph}
          </motion.span>
        </motion.div>

        {/* + → × indicator */}
        <div className="shrink-0 w-7 h-7 rounded-full border border-[#0D0D0B]/15 flex items-center justify-center mt-2 overflow-hidden">
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 24 }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <line x1="5.5" y1="0" x2="5.5" y2="11" stroke="#0D0D0B" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="0" y1="5.5" x2="11" y2="5.5" stroke="#0D0D0B" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── section ────────────────────────────────────────────── */
export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef    = useRef<HTMLDivElement>(null);
  const reduced    = useReducedMotion();
  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const springProg = useSpring(scrollYProgress, { stiffness: 30, damping: 25 });
  const bgY        = useTransform(springProg, [0, 1], ["0%", "12%"]);
  const headlineY  = useTransform(springProg, [0, 1], ["3%", "-3%"]);
  const sideY      = useTransform(springProg, [0, 1], ["-2%", "2%"]);

  const e = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "#F4F0E8" }}
    >
      {/* ── background ──────────────────────────────────── */}
      {/* glows */}
      <motion.div
        style={reduced ? {} : { y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* warm right glow */}
        <div
          className="absolute -right-[10%] top-[20%] w-[700px] h-[700px] rounded-full blur-[160px] opacity-[0.11]"
          style={{ background: "radial-gradient(circle, #FF5C00 0%, transparent 65%)" }}
        />
        {/* cool top-left glow */}
        <div
          className="absolute -left-[5%] -top-[5%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #FF9040 0%, transparent 65%)" }}
        />
      </motion.div>

      {/* fine grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "linear-gradient(to right,#0D0D0B 1px,transparent 1px),linear-gradient(to bottom,#0D0D0B 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── hero top ────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 md:pt-36 pb-12 sm:pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-8 items-end">

          {/* LEFT — label + headline */}
          <motion.div ref={heroRef} style={reduced ? {} : { y: headlineY }}>
            <motion.div
              className="mb-14"
              initial={{ opacity: 0, x: -18 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, ease: e }}
            >
              <SectionLabel index={2}>Our Philosophy</SectionLabel>
            </motion.div>

            <h2
              className="font-instrument leading-[1.0] tracking-[-0.04em]"
              style={{ fontSize: "clamp(50px, 7.5vw, 104px)" }}
              aria-label="We build systems, not just assets."
            >
              {/* line 1 */}
              <div className="overflow-hidden -mx-3 px-3 pb-[0.18em] pt-[0.04em]">
                <motion.span
                  className="block text-[#0D0D0B]"
                  initial={{ y: "108%" }}
                  animate={heroInView ? { y: "0%" } : {}}
                  transition={{ duration: 1.05, ease: e }}
                >
                  We build
                </motion.span>
              </div>
              {/* line 2 — orange italic */}
              <div className="overflow-hidden -mx-3 px-3 pb-[0.18em] pt-[0.04em]">
                <motion.span
                  className="block italic text-[#FF5C00]"
                  initial={{ y: "108%" }}
                  animate={heroInView ? { y: "0%" } : {}}
                  transition={{ duration: 1.05, delay: 0.09, ease: e }}
                >
                  systems,
                </motion.span>
              </div>
              {/* line 3 — muted, smaller */}
              <div className="overflow-hidden -mx-3 px-3 pb-[0.18em] pt-[0.04em]">
                <motion.span
                  className="block text-[#B0AA9E]"
                  style={{ fontSize: "clamp(36px, 5.5vw, 76px)" }}
                  initial={{ y: "108%" }}
                  animate={heroInView ? { y: "0%" } : {}}
                  transition={{ duration: 1.05, delay: 0.18, ease: e }}
                >
                  not just assets.
                </motion.span>
              </div>
            </h2>
          </motion.div>

          {/* RIGHT — copy + stats */}
          <motion.div
            style={reduced ? {} : { y: sideY }}
            className="flex flex-col gap-12"
          >
            <p className="font-sans text-[16px] md:text-[17px] text-[#4A463F] leading-[2.0] max-w-full sm:max-w-md tracking-[0.005em] flex flex-wrap gap-x-[0.28em]">
              {("Every system we build is designed to outlast a trend, compound over time, and give our clients an unfair advantage not just for this quarter, but every one after it.").split(" ").map((word, i) => (
                <span key={i} className="overflow-hidden inline-block" style={{ paddingBottom: "0.08em" }}>
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%", opacity: 0 }}
                    animate={heroInView ? { y: "0%", opacity: 1 } : {}}
                    transition={{ duration: 0.65, delay: 0.28 + i * 0.028, ease: e }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </p>

            {/* stats */}
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(13,13,11,0.07)",
                background: "linear-gradient(150deg, #FEFCF8 0%, #F5F1E9 100%)",
                boxShadow: "0 12px 56px -16px rgba(43,33,20,0.18), 0 2px 8px rgba(43,33,20,0.05), inset 0 1px 0 rgba(255,255,255,1)",
              }}
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 1.0, delay: 0.45, ease: e }}
            >
              {/* top orange line draws in */}
              <motion.div
                className="absolute inset-x-0 top-0 h-px origin-center"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,92,0,0.7) 50%, transparent)" }}
                initial={{ scaleX: 0 }} animate={heroInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.0, delay: 0.7, ease: e }}
              />

              <div className="grid grid-cols-3">
                {STATS.map((s, i) => (
                  <div key={s.label} className="relative">
                    {i > 0 && (
                      <div className="absolute left-0 top-6 bottom-6 w-px hidden sm:block"
                        style={{ background: "linear-gradient(to bottom, transparent, rgba(13,13,11,0.09) 30%, rgba(13,13,11,0.09) 70%, transparent)" }}
                      />
                    )}
                    <StatPill value={s.value} label={s.label} delay={0.5 + i * 0.12} triggered={heroInView} index={i} />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
