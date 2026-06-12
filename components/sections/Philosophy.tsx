"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useRef, useState, useCallback, useEffect } from "react";
import SectionLabel from "@/components/ui/SectionLabel";

/* ─── stats data ──────────────────────────────────────────── */
const STATS = [
  { value: "7+", label: "Years operating" },
  { value: "100%", label: "Systems approach" },
  { value: "∞", label: "Compounding" },
];

/* ─── draggable card data ─────────────────────────────────── */
const CARDS = [
  {
    id: 0,
    category: "FOUNDATION",
    dot: "#FF5C00",
    title: "System-first,",
    accent: "always.",
    body: "We never build features in isolation. Every touchpoint — code, design, copy, acquisition — is engineered as one compounding system.",
    tags: "SYSTEMS / THINKING / SCALE",
    bg: "#FEFCF2",
    border: "rgba(220,200,140,0.5)",
    shadow: "0 8px 40px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.9) inset",
    rotation: -3,
    x: 52,
    y: 48,
    pin: true,
    pinColor: "#C4973A",
    width: 268,
  },
  {
    id: 1,
    category: "STRATEGY",
    dot: "#3A8A4A",
    title: "Obsess over",
    accent: "leverage.",
    body: "One great system beats ten mediocre executions. We find the highest-leverage moves and go all-in — advantages compound over time.",
    tags: "LEVERAGE / FOCUS / ROI",
    bg: "#F2FAF4",
    border: "rgba(140,200,155,0.45)",
    shadow: "0 8px 40px rgba(0,0,0,0.09), 0 1px 0 rgba(255,255,255,0.9) inset",
    rotation: 2.2,
    x: 396,
    y: 18,
    pin: true,
    pinColor: "#4A8A5A",
    width: 255,
  },
  {
    id: 2,
    category: "CRAFT",
    dot: "#FF5C00",
    title: "Ship with",
    accent: "precision.",
    body: "Speed without craft is noise. We move fast and finish clean — every pixel, every API response, every sentence deliberate.",
    tags: "QUALITY / SPEED / DETAIL",
    bg: "#FEFCF8",
    border: "rgba(200,190,170,0.4)",
    shadow: "0 6px 32px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.85) inset",
    rotation: -1.4,
    x: 728,
    y: 58,
    pin: true,
    pinColor: "#8A7A5A",
    width: 270,
  },
  {
    id: 3,
    category: "INTEGRITY",
    dot: "#4A72C8",
    title: "Truth over",
    accent: "comfort.",
    body: "We say the hard thing. If a strategy won't work, you'll hear it from us first. That honesty is what makes the relationship last.",
    tags: "TRUST / CLARITY / HONESTY",
    bg: "#F2F4FC",
    border: "rgba(140,160,220,0.4)",
    shadow: "0 8px 40px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.9) inset",
    rotation: 2.8,
    x: 1020,
    y: 30,
    pin: true,
    pinColor: "#4A72C8",
    width: 248,
  },
  {
    id: 4,
    category: "VISION",
    dot: "#FF5C00",
    title: "Digital",
    accent: "ecosystems.",
    body: "We architect interconnected systems where every part amplifies every other — so the whole is always greater than the sum.",
    tags: "ECOSYSTEM / GROWTH / FUTURE",
    bg: "#FFF8F2",
    border: "rgba(255,140,80,0.3)",
    shadow: "0 8px 40px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.9) inset",
    rotation: -2.1,
    x: 188,
    y: 348,
    pin: true,
    pinColor: "#E05A00",
    width: 262,
  },
  {
    id: 5,
    category: "GROWTH",
    dot: "#8A5AC8",
    title: "Compound",
    accent: "everything.",
    body: "Every system we build is designed to outlast trends and compound month over month — giving clients an unfair, permanent advantage.",
    tags: "COMPOUNDING / RETURNS / EDGE",
    bg: "#FAF2FC",
    border: "rgba(170,130,210,0.4)",
    shadow: "0 8px 40px rgba(0,0,0,0.09), 0 1px 0 rgba(255,255,255,0.9) inset",
    rotation: 1.6,
    x: 548,
    y: 318,
    pin: true,
    pinColor: "#8A5AC8",
    width: 258,
  },
];

/* ─── Pushpin SVG ─────────────────────────────────────────── */
function Pushpin({ color }: { color: string }) {
  return (
    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 drop-shadow-md">
      <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
        <circle cx="11" cy="10" r="9" fill={color} />
        <circle cx="11" cy="10" r="6" fill="rgba(255,255,255,0.22)" />
        <circle cx="8.5" cy="7.5" r="2.5" fill="rgba(255,255,255,0.45)" />
        <rect x="10" y="18" width="2.2" height="9" rx="1.1" fill={color} opacity="0.65" />
      </svg>
    </div>
  );
}

/* ─── Single draggable card ───────────────────────────────── */
function DraggableCard({
  card,
  zIndex,
  constraintsRef,
  onDragStart,
}: {
  card: typeof CARDS[0];
  zIndex: number;
  constraintsRef: React.RefObject<HTMLDivElement | null>;
  onDragStart: () => void;
}) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      dragConstraints={constraintsRef}
      dragTransition={{ power: 0, timeConstant: 0 }}
      onDragStart={onDragStart}
      className="absolute select-none"
      style={{
        left: card.x,
        top: card.y,
        width: card.width,
        zIndex,
        rotate: card.rotation,
        cursor: "grab",
      }}
      whileDrag={{ scale: 1.06, cursor: "grabbing" }}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ scale: { type: "spring", stiffness: 300, damping: 24 }, opacity: { duration: 0.3 } }}
    >
      {/* Paper card */}
      <div
        className="relative rounded-2xl overflow-visible"
        style={{
          background: card.bg,
          border: `1px solid ${card.border}`,
          boxShadow: card.shadow,
          padding: "28px 24px 22px",
        }}
      >
        {card.pin && <Pushpin color={card.pinColor} />}

        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: card.dot, boxShadow: `0 0 5px ${card.dot}` }}
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#6F6A60]">
            {card.category}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-instrument tracking-[-0.03em] leading-[1.05] text-[#0D0D0B] mb-3"
          style={{ fontSize: "clamp(22px, 2.2vw, 28px)" }}
        >
          {card.title}{" "}
          <span className="italic text-[#FF5C00]">{card.accent}</span>
        </h3>

        {/* Body */}
        <p className="font-sans text-[13px] text-[#4A463F] leading-[1.75] mb-5">
          {card.body}
        </p>

        {/* Divider + tags */}
        <div
          className="border-t pt-3"
          style={{ borderColor: "rgba(13,13,11,0.08)" }}
        >
          <span className="font-mono text-[8.5px] tracking-[0.18em] text-[#9A9488] uppercase">
            {card.tags}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Draggable board (desktop only) ─────────────────────── */
function DraggableBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState(CARDS.map((c) => c.id));
  const bringToFront = useCallback(
    (id: number) => setOrder((prev) => [...prev.filter((x) => x !== id), id]),
    []
  );

  return (
    <div className="hidden lg:block relative">
      {/* Board */}
      <div
        ref={boardRef}
        className="relative w-full overflow-hidden rounded-3xl"
        style={{
          height: 640,
          background: "#F4F0E8",
          backgroundImage:
            "linear-gradient(to right,rgba(13,13,11,0.05) 1px,transparent 1px), linear-gradient(to bottom,rgba(13,13,11,0.05) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
          border: "1px solid rgba(13,13,11,0.08)",
          boxShadow: "0 2px 0 rgba(255,255,255,0.6) inset, 0 24px 80px rgba(0,0,0,0.07)",
        }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right,rgba(13,13,11,0.04) 1px,transparent 1px), linear-gradient(to bottom,rgba(13,13,11,0.04) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Corner crosshairs */}
        {[[24, 24], [24, "auto"], ["auto", 24], ["auto", "auto"]].map(([t, l], i) => (
          <div
            key={i}
            className="absolute pointer-events-none opacity-20"
            style={{
              top: typeof t === "number" ? t : undefined,
              bottom: t === "auto" ? 24 : undefined,
              left: typeof l === "number" ? l : undefined,
              right: l === "auto" ? 24 : undefined,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <line x1="6" y1="0" x2="6" y2="12" stroke="#0D0D0B" strokeWidth="0.8" />
              <line x1="0" y1="6" x2="12" y2="6" stroke="#0D0D0B" strokeWidth="0.8" />
            </svg>
          </div>
        ))}

        {/* Cards */}
        {CARDS.map((card) => (
          <DraggableCard
            key={card.id}
            card={card}
            zIndex={order.indexOf(card.id) + 1}
            constraintsRef={boardRef}
            onDragStart={() => bringToFront(card.id)}
          />
        ))}

        {/* Drag hint */}
        <div
          className="absolute bottom-5 right-6 flex items-center gap-2 pointer-events-none"
          style={{ opacity: 0.35 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="#0D0D0B" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M4 4l-3 3 3 3M10 4l3 3-3 3" stroke="#0D0D0B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#0D0D0B]">
            Drag the cards
          </span>
        </div>
      </div>
    </div>
  );
}

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
  const numMatch = value.match(/^(\d+)/);
  const numericTarget = numMatch ? parseInt(numMatch[1]) : null;
  const numericSuffix = numericTarget !== null ? value.slice(numMatch![0].length) : null;
  const isSymbol = numericTarget === null;
  const count = useCountUp(reduced ? null : numericTarget, triggered, delay);
  const displayValue = isSymbol ? value : reduced ? `${numericTarget}${numericSuffix}` : `${count}${numericSuffix}`;

  return (
    <div className="flex flex-col items-center gap-1 w-full">
      <motion.span
        className="font-instrument leading-none tracking-[-0.03em] tabular-nums text-white"
        style={{ fontSize: "clamp(28px, 7vw, 64px)" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ color: hovered ? "#FF5C00" : "#FFFFFF" }}
        transition={{ duration: 0.25 }}
      >
        {displayValue}
      </motion.span>
      <span className="font-mono uppercase tracking-[0.18em] leading-tight block text-center text-white/35"
        style={{ fontSize: "clamp(7px, 1.8vw, 9px)" }}>
        {label}
      </span>
    </div>
  );
}

/* ─── section ────────────────────────────────────────────── */
export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef    = useRef<HTMLDivElement>(null);
  const reduced    = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "-40px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes phil-fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes phil-slide-up {
          from { transform: translateY(108%); }
          to   { transform: translateY(0%); }
        }
        @keyframes phil-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .phil-label { opacity: 0; }
        .phil-label.in { animation: phil-fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 0s forwards; }
        .phil-line-wrap { overflow: hidden; padding-bottom: 0.2em; }
        .phil-line { display: block; transform: translateY(108%); will-change: transform; }
        .phil-line.in-0 { animation: phil-slide-up 1s cubic-bezier(0.16,1,0.3,1) 0.1s forwards; }
        .phil-line.in-1 { animation: phil-slide-up 1s cubic-bezier(0.16,1,0.3,1) 0.19s forwards; }
        .phil-line.in-2 { animation: phil-slide-up 1s cubic-bezier(0.16,1,0.3,1) 0.28s forwards; }
        .phil-para { opacity: 0; }
        .phil-para.in { animation: phil-fade 0.8s ease 0.35s forwards; }
        .phil-stats { opacity: 0; }
        .phil-stats.in { animation: phil-fade-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.45s forwards; }
      `}</style>

      <section
        id="philosophy"
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{ background: "#F4F0E8" }}
      >
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-[10%] top-[20%] w-[700px] h-[700px] rounded-full blur-[160px] opacity-[0.11]"
            style={{ background: "radial-gradient(circle, #FF5C00 0%, transparent 65%)" }} />
          <div className="absolute -left-[5%] -top-[5%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #FF9040 0%, transparent 65%)" }} />
        </div>

        {/* Fine grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(to right,#0D0D0B 1px,transparent 1px),linear-gradient(to bottom,#0D0D0B 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

        {/* Section label */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 md:pt-28 pb-10">
          <div ref={heroRef} className={`phil-label${visible ? " in" : ""}`}>
            <SectionLabel index={2}>Our Philosophy</SectionLabel>
          </div>
        </div>

        {/* ── Draggable board (desktop only) ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 md:pb-28">
          <DraggableBoard />

          {/* Mobile fallback — simple stacked cards */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CARDS.map((card, i) => (
              <div key={card.id} className={`rounded-2xl p-6${i >= 4 ? " hidden sm:block" : ""}`}
                style={{ background: card.bg, border: `1px solid ${card.border}`, boxShadow: card.shadow }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: card.dot }} />
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#6F6A60]">{card.category}</span>
                </div>
                <h3 className="font-instrument text-[28px] tracking-[-0.03em] text-[#0D0D0B] mb-2">
                  {card.title} <span className="italic text-[#FF5C00]">{card.accent}</span>
                </h3>
                <p className="font-sans text-[13px] text-[#4A463F] leading-[1.75] mb-4">{card.body}</p>
                <div className="border-t pt-3" style={{ borderColor: "rgba(13,13,11,0.08)" }}>
                  <span className="font-mono text-[8.5px] tracking-[0.18em] text-[#9A9488] uppercase">{card.tags}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
