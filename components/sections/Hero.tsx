"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useRef, useEffect, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useFormModal } from "@/components/providers/FormModalProvider";

const METRICS = [
  { value: 45, suffix: "%", label: "Visibility Lift" },
  { value: 40, suffix: "%", label: "Engagement Gain" },
  { value: 3,  suffix: "×", label: "Faster Launch" },
  { value: 12, suffix: "+", label: "Systems Built" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { open: openForm } = useFormModal();

  // Detect touch device — disable all JS-driven parallax on mobile
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  /* ── Scroll parallax (desktop only) ──────────────────── */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y    = useTransform(scrollYProgress, [0, 1], isTouch ? ["0%", "0%"] : ["0%", "20%"]);
  const fade = useTransform(scrollYProgress, [0, 0.55], isTouch ? [1, 1] : [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], isTouch ? ["0%", "0%"] : ["0%", "8%"]);

  /* ── Mouse parallax (desktop only) ───────────────────── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 30, damping: 30, mass: 1.2 });
  const smoothY = useSpring(mouseY, { stiffness: 30, damping: 30, mass: 1.2 });

  // Layer 1 — background orb (subtle, far)
  const orb1X = useTransform(smoothX, [-700, 700], [-18, 18]);
  const orb1Y = useTransform(smoothY, [-500, 500], [-14, 14]);
  // Layer 2 — near orb (most movement)
  const orb2X = useTransform(smoothX, [-700, 700], [-40, 40]);
  const orb2Y = useTransform(smoothY, [-500, 500], [-32, 32]);

  useEffect(() => {
    if (isTouch) return; // skip mouse tracking on mobile entirely
    const section = ref.current;
    if (!section) return;
    const heroRect = { current: section.getBoundingClientRect() };
    const onResize = () => { heroRect.current = section.getBoundingClientRect(); };
    const onMove = (e: MouseEvent) => {
      const rect = heroRect.current;
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    };
    window.addEventListener("resize", onResize, { passive: true });
    section.addEventListener("mousemove", onMove, { passive: true });
    return () => { section.removeEventListener("mousemove", onMove); window.removeEventListener("resize", onResize); };
  }, [mouseX, mouseY, isTouch]);

  const headlineWords = [
    { text: "Dominate", white: true },
    { text: "the", white: true },
    { text: "Digital Age.", italic: true, accent: true },
  ];

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-[100svh] overflow-hidden flex flex-col"
      style={{ background: "#F4F0E8" }}
    >
      {/* ── Warm ambient mesh — layer 1 (far, parallax) ─── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[2] gpu"
        style={{ x: orb1X, y: orb1Y }}
      >
        <div
          className="absolute top-[-14%] left-[50%] -translate-x-1/2 w-[1100px] h-[820px] rounded-full blur-[160px] opacity-[0.34]"
          style={{ background: "radial-gradient(ellipse, rgba(255,138,61,0.9) 0%, transparent 62%)" }}
        />
      </motion.div>

      {/* ── Warm ambient mesh — layer 2 (near, parallax) ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[2] gpu"
        style={{ x: orb2X, y: orb2Y }}
      >
        <div
          className="absolute bottom-[6%] right-[6%] w-[560px] h-[560px] rounded-full blur-[130px] opacity-[0.22]"
          style={{ background: "radial-gradient(circle, rgba(255,92,0,0.7) 0%, transparent 66%)" }}
        />
      </motion.div>

      {/* ── Fine dot grid ────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-[2] opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(13,13,11,0.07) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 75% 70% at 50% 45%, #000 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 50% 45%, #000 25%, transparent 75%)",
        }}
      />

      {/* Edge vignette — feather into the paper base */}
      <div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{ background: "radial-gradient(ellipse 90% 90% at 50% 45%, transparent 45%, rgba(244,240,232,0.85) 100%)" }}
      />

      {/* ── Side vertical label ───────────────────────────── */}
      <motion.div
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-3"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-[#0D0D0B]/15" />
        <span
          className="font-mono text-[9px] text-[#6F6A60] uppercase tracking-[0.3em] whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          01 / Hero
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-t from-transparent to-[#0D0D0B]/15" />
      </motion.div>

      {/* ── Right vertical label ──────────────────────────── */}
      <motion.div
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-3"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-[#0D0D0B]/15" />
        <span
          className="font-mono text-[9px] text-[#9A9488] uppercase tracking-[0.3em] whitespace-nowrap"
          style={{ writingMode: "vertical-rl" }}
        >
          CODA. 2025
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-t from-transparent to-[#0D0D0B]/15" />
      </motion.div>

      {/* ── Main content ─────────────────────────────────── */}
      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-20"
      >

        {/* Brand name */}
        <h1
          className="font-instrument tracking-[-0.04em] leading-[1.04] mb-5 sm:mb-7 text-center"
          style={{ fontSize: "clamp(44px, 8.5vw, 118px)" }}
        >
          {(["Citizen", "Of", "Digital Age."] as Array<string>).map((word, wi) => (
            <span
              key={wi}
              className={["inline-block mr-[0.2em] last:mr-0", wi === 2 ? "block mt-1" : ""].join(" ")}
            >
              <div className="overflow-hidden -mx-3 px-3 pb-[0.18em] pt-[0.05em]">
                <motion.span
                  className={["inline-block", wi === 2 ? "italic text-[#FF5C00] animate-chromatic" : "text-[#0D0D0B]"].join(" ")}
                  initial={{ y: "108%", skewY: 4 }}
                  animate={{ y: "0%", skewY: 0 }}
                  transition={{ duration: 1.05, delay: 1.6 + wi * 0.13, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              </div>
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <motion.div
          className="flex items-center gap-4 mb-6 sm:mb-10 -mt-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="h-[1px] w-10 bg-[#0D0D0B]/30 block shrink-0" />
          <p className="font-instrument italic text-[#0D0D0B]/70 text-[20px] sm:text-[28px] tracking-[-0.02em] text-center">
            Dominate the <span className="text-[#FF5C00]">Digital Age.</span>
          </p>
          <span className="h-[1px] w-10 bg-[#0D0D0B]/30 block shrink-0" />
        </motion.div>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[15px] sm:text-[17px] text-[#4A463F] max-w-[480px] leading-[1.7] sm:leading-[1.75] mb-8 sm:mb-12"
        >
          We don&apos;t just build products. We architect the unfair advantage your competitors can&apos;t copy.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-5"
        >
          <MagneticButton variant="primary" onClick={openForm}>
            <span className="flex items-center gap-2 font-sans font-semibold text-[14px] px-8 py-3.5 tracking-[-0.01em]">
              Start a project
              <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
            </span>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* ── Bottom metrics bar ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 grid grid-cols-2 md:grid-cols-4 border-t border-[#0D0D0B]/[0.1] overflow-hidden"
      >
        {METRICS.map((m, i) => (
          <motion.div
            key={i}
            className={`relative group flex flex-col items-center justify-center py-7 cursor-default overflow-hidden ${
              i > 0 ? "border-l border-[#0D0D0B]/[0.1]" : ""
            }`}
            whileHover="hovered"
            initial="idle"
          >
            {/* Spotlight fill on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              variants={{
                idle:    { opacity: 0 },
                hovered: { opacity: 1 },
              }}
              transition={{ duration: 0.4 }}
              style={{ background: "radial-gradient(ellipse 80% 100% at 50% 120%, rgba(255,92,0,0.10) 0%, transparent 70%)" }}
            />

            {/* Top orange bar that draws in on hover */}
            <motion.div
              className="absolute top-0 inset-x-0 h-[2px] origin-left"
              style={{ background: "linear-gradient(90deg, #FF5C00, rgba(255,92,0,0.3))" }}
              variants={{
                idle:    { scaleX: 0 },
                hovered: { scaleX: 1 },
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Number */}
            <motion.span
              className="font-instrument leading-none mb-2 tabular-nums"
              style={{ fontSize: "clamp(28px, 3vw, 42px)" }}
              variants={{
                idle:    { color: "#0D0D0B", y: 0 },
                hovered: { color: "#FF5C00", y: -3 },
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatedCounter value={m.value} suffix={m.suffix} />
            </motion.span>

            {/* Label */}
            <motion.span
              className="font-mono text-[9px] uppercase tracking-[0.22em]"
              variants={{
                idle:    { color: "rgba(111,106,96,1)", y: 0, opacity: 1 },
                hovered: { color: "rgba(13,13,11,0.7)", y: -2, opacity: 1 },
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {m.label}
            </motion.span>

            {/* Underline that draws under label */}
            <motion.div
              className="mt-2 h-px rounded-full bg-[#FF5C00] origin-center"
              variants={{
                idle:    { scaleX: 0, opacity: 0 },
                hovered: { scaleX: 1, opacity: 0.5 },
              }}
              style={{ width: "40px" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────────── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-[86px] flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 1.2 }}
      >
        <div className="w-[1px] h-10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0D0B]/20 to-transparent" />
          <motion.div
            className="w-full h-[35%] bg-[#0D0D0B]/50"
            animate={{ y: ["0%", "230%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.3 }}
          />
        </div>
      </motion.div>
    </section>
  );
}
