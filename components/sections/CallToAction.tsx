"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useMotionTemplate } from "motion/react";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";
import { useFormModal } from "@/components/providers/FormModalProvider";
import dynamic from "next/dynamic";

const Particles = dynamic(() => import("@/components/ui/Particles"), {
  ssr: false,
});

/* ── Wave text — letters cascade up on hover ── */
function WaveText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1200);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const active = hovered || pulse;

  return (
    <span
      className={className}
      style={{ ...style, display: "inline-block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: ch === " " ? "pre" : undefined }}
          animate={active ? { y: -10, color: "#FF5C00" } : { y: 0, color: "#ffffff" }}
          transition={{ type: "spring", stiffness: 400, damping: 18, delay: i * 0.035 }}
        >{ch}</motion.span>
      ))}
    </span>
  );
}

export default function CallToAction() {
  const { open: openForm } = useFormModal();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  /* ── 3D tilt on mouse move ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], prefersReducedMotion ? [0, 0] : [6, -6]),  { stiffness: 200, damping: 28 });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], prefersReducedMotion ? [0, 0] : [-6, 6]), { stiffness: 200, damping: 28 });
  const spotX   = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const spotY   = useSpring(mouseY, { stiffness: 200, damping: 25 });

  const textX = useTransform(spotX, [-1, 1], prefersReducedMotion ? [0, 0] : [-12, 12]);
  const textY = useTransform(spotY, [-1, 1], prefersReducedMotion ? [0, 0] : [-12, 12]);

  const shadowX = useTransform(spotX, [-1, 1], [20, -20]);
  const shadowY = useTransform(spotY, [-1, 1], [20, -20]);

  const maskX = useTransform(spotX, [-1, 1], ["0%", "100%"]);
  const maskY = useTransform(spotY, [-1, 1], ["0%", "100%"]);
  const glowMask = useMotionTemplate`radial-gradient(500px circle at ${maskX} ${maskY}, black, transparent)`;

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width  - 0.5) * 2);
    mouseY.set(((e.clientY - rect.top)  / rect.height - 0.5) * 2);
  }, [mouseX, mouseY]);

  const onMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  /* Single IntersectionObserver — no JS animation loop, no framer scroll tracking */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "-60px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes cta-rise {
          from { opacity: 0; transform: translateY(48px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cta-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cta-slide-up {
          from { transform: translateY(105%); }
          to   { transform: translateY(0%); }
        }
        @keyframes cta-ring {
          0%   { transform: scale(0.13); opacity: 0.45; }
          100% { transform: scale(1);    opacity: 0; }
        }
        @keyframes cta-shine {
          0%   { transform: translateX(-150%) skewX(-20deg); }
          15%, 100% { transform: translateX(200%) skewX(-20deg); }
        }
        
        .cta-btn-shine {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          overflow: hidden;
          border-radius: inherit;
        }
        .cta-btn-shine::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
          animation: cta-shine 4s infinite;
        }

        .cta-card { opacity: 0; }
        .cta-card.in { animation: cta-rise 0.75s cubic-bezier(0.16,1,0.3,1) 0.05s forwards; }

        .cta-eyebrow { opacity: 0; }
        .cta-eyebrow.in { animation: cta-fade 0.6s ease 0.2s forwards; }

        .cta-line-wrap { overflow: hidden; padding-bottom: 0.3em; }
        .cta-line { display: block; transform: translateY(105%); will-change: transform; }
        .cta-line.in-0 { animation: cta-slide-up 0.85s cubic-bezier(0.16,1,0.3,1) 0.25s forwards; }
        .cta-line.in-1 { animation: cta-slide-up 0.85s cubic-bezier(0.16,1,0.3,1) 0.36s forwards; }

        .cta-sub { opacity: 0; }
        .cta-sub.in { animation: cta-fade 0.7s ease 0.48s forwards; }

        .cta-btn { opacity: 0; }
        .cta-btn.in { animation: cta-fade 0.7s ease 0.58s forwards; }

        .cta-note { opacity: 0; }
        .cta-note.in { animation: cta-fade 0.7s ease 0.68s forwards; }

        @media (min-width: 768px) {
          .cta-ring {
            position: absolute;
            width: 900px;
            height: 900px;
            border-radius: 9999px;
            border: 1px solid rgba(13,13,11,0.07);
            animation: cta-ring 4s ease-out infinite;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center py-24 sm:py-32 px-6 bg-black [&_*::selection]:bg-coda-accent [&_*::selection]:text-white overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Particles
              particleCount={1000}
              particleSpread={10}
              speed={0.6}
              particleColors={["#F97316"]}
              moveParticlesOnHover={true}
              particleHoverFactor={1}
              alphaParticles={false}
              particleBaseSize={100}
              sizeRandomness={1}
              cameraDistance={20}
              disableRotation={false}
            />
          </div>
          <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none z-10">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="cta-ring" style={{ animationDelay: `${i}s` }} />
            ))}
          </div>
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none z-10"
            style={{
              backgroundImage:
                "linear-gradient(to right,#0D0D0B 1px,transparent 1px),linear-gradient(to bottom,#0D0D0B 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Galaxy removed for performance */}

        <div className="relative z-10 w-full flex flex-col items-center">
          <motion.div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`cta-card${visible ?" in" : ""} relative w-full max-w-4xl text-center flex flex-col items-center gap-14 sm:gap-20 px-6 sm:px-10 py-10 z-10`}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              perspective: 800,
            }}
          >
            {/* Soft backdrop to separate text */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
              <div className="absolute w-[800px] h-[500px] bg-black/60 blur-[100px] rounded-full" />
            </div>

            {/* Content Group (Headline + Sub-copy) */}
            <div className="flex flex-col items-center gap-6 sm:gap-8 relative z-10">
              {/* Premium Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="px-5 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md"
              >
                <span className="font-mono text-micro sm:text-label text-coda-accent tracking-[0.2em] uppercase font-semibold">
                  Let's Build the Future
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div style={{ x: textX, y: textY }} className="flex flex-col gap-2">
                <div className="cta-line-wrap">
                  <WaveText
                    text="Ready to"
                    className={`cta-line${visible ?" in-0" : ""} font-instrument tracking-tight leading-[1.0]`}
                    style={{ fontSize: "clamp(56px, 9vw, 110px)" }}
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.85, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
                >
                  <WaveText
                    text="Dominate!"
                    className="font-instrument tracking-tight leading-[1.0]"
                    style={{ fontSize: "clamp(56px, 9vw, 110px)" }}
                  />
                </motion.div>
              </motion.div>

              {/* Sub-copy with gradient */}
              <p
                className={`cta-sub${visible ?" in" : ""} font-sans text-base sm:text-2xl max-w-[320px] sm:max-w-2xl leading-[1.5] sm:leading-[1.6]`}
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.4) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Most agencies build features. We build systems that outlast them.
              </p>
            </div>

            {/* Action Group (Button + Footer Note) */}
            <div className="flex flex-col items-center gap-6 sm:gap-8 relative z-10">
              {/* CTA button */}
              <div className={`cta-btn${visible ?" in" : ""} flex flex-col items-center`}>
                <MagneticButton variant="accent" onClick={openForm}>
                  <span
                    className="flex items-center gap-2 sm:gap-3 text-white px-8 py-3.5 sm:px-10 sm:py-4 rounded-full font-sans font-semibold text-base sm:text-lg tracking-tight relative overflow-hidden transition-transform duration-300 hover:scale-105"
                    style={{ 
                      background: "linear-gradient(135deg, var(--color-coda-accent) 0%, color-mix(in srgb, var(--color-coda-accent) 80%, black) 100%)",
                      boxShadow: "0 12px 32px color-mix(in srgb, var(--color-coda-accent) 40%, transparent), inset 0 1px 1px rgba(255,255,255,0.4)",
                      border: "1px solid rgba(255,255,255,0.15)"
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                      Start a project
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <div className="cta-btn-shine" />
                  </span>
                </MagneticButton>
              </div>

              {/* Footer note */}
              <div
                className={`cta-note${visible ?" in" : ""} flex items-center gap-3 sm:gap-4 font-mono text-micro sm:text-xs text-white/50 tracking-[0.2em] uppercase`}
              >
                <span>No retainers</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
                <span>No bloat</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
                <span>Just results</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
