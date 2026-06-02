"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";
import { useFormModal } from "@/components/providers/FormModalProvider";

const RINGS = [0, 1, 2, 3];

export default function CallToAction() {
  const ref = useRef<HTMLElement>(null);
  const { open: openForm } = useFormModal();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rectRef = useRef<DOMRect | null>(null);
  const smoothX = useSpring(mouseX, { stiffness: 25, damping: 28 });
  const smoothY = useSpring(mouseY, { stiffness: 25, damping: 28 });
  const bgX = useTransform(smoothX, [-600, 600], [-20, 20]);
  const bgY = useTransform(smoothY, [-400, 400], [-15, 15]);

  const onMouseEnter = () => { rectRef.current = ref.current?.getBoundingClientRect() ?? null; };
  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = rectRef.current;
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <section
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      className="relative py-40 px-6 [&_*::selection]:bg-[#39FF14] [&_*::selection]:text-[#0D0D0B] [&::selection]:bg-[#39FF14] [&::selection]:text-[#0D0D0B]"
      style={{ background: "#FF5C00" }}
    >
      {/* Clip only the bg layer — not the text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* ── Pulsing rings ─────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {RINGS.map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-[#0D0D0B]/[0.07] gpu"
            style={{ width: 900, height: 900 }}
            animate={{
              scale: [0.13, 1],
              opacity: [0.45, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 1,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* ── Mouse-tracked blobs ───────────────────────────── */}
      <motion.div className="hidden md:block absolute inset-0 pointer-events-none" style={{ x: bgX, y: bgY }}>
        <div
          className="absolute -top-1/3 -left-1/4 w-[900px] h-[900px] rounded-full blur-[180px] opacity-35"
          style={{ background: "#FF7A2F" }}
        />
        <div
          className="absolute -bottom-1/3 -right-1/4 w-[800px] h-[800px] rounded-full blur-[160px] opacity-45"
          style={{ background: "#E84000" }}
        />
      </motion.div>

      {/* ── Grid ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right,#0D0D0B 1px,transparent 1px),linear-gradient(to bottom,#0D0D0B 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      </div>{/* end bg clip wrapper */}

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Card — opacity+translateY only, no scale, no backdrop-blur (both kill scroll perf) */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl text-center flex flex-col items-center gap-8 sm:gap-10 rounded-3xl px-6 sm:px-10 py-10 sm:py-14 shadow-[0_0_80px_rgba(0,0,0,0.45)]"
          style={{
            background: "#1a0d00",
            border: "1px solid rgba(255,255,255,0.07)",
            willChange: "transform, opacity",
          }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 border border-white/10 bg-white/[0.05] rounded-full px-5 py-2.5">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 0.6, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
              Ready when you are
            </p>
          </div>

          {/* Headline — single parent drives both lines, no per-line scroll observers */}
          <div>
            {["Ready to", "Dominate?"].map((line, li) => (
              <div key={li} className="overflow-hidden -mx-8 px-8" style={{ paddingBottom: "0.45em", paddingTop: "0.08em" }}>
                <motion.div
                  initial={{ y: "105%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, delay: 0.1 + li * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-instrument tracking-[-0.04em] leading-[1.0] ${li === 1 ? "italic text-[#FF5C00]" : "text-white"}`}
                  style={{ fontSize: "clamp(40px, 10vw, 130px)" }}
                >
                  {line}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-sans text-[17px] text-white/60 max-w-md leading-[1.7]"
          >
            Most agencies build features. We build systems that outlast them.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <MagneticButton variant="accent" onClick={openForm}>
              <span className="flex items-center gap-3 bg-[#FF5C00] text-white px-9 py-4 rounded-xl font-sans font-semibold text-[15px] shadow-[0_12px_40px_rgba(255,92,0,0.45)] tracking-[-0.01em]">
                Start a project
                <ArrowRight className="w-4 h-4" />
              </span>
            </MagneticButton>
            
          </motion.div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-center gap-4 font-mono text-[10px] text-white/30 tracking-widest uppercase"
          >
            <span>No retainers</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>No bloat</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Just results</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
