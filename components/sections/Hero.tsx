"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useEffect, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useFormModal } from "@/components/providers/FormModalProvider";

const PARTICLES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  left: `${(i * 33.7) % 100}%`,
  duration: 12 + (i % 10),
  delay: (i * 0.6) % 8,
  size: i % 5 === 0 ? 3 : (i % 3 === 0 ? 2 : 1.5),
  isOrange: i % 4 === 0,
  yOffset: -(100 + (i % 30))
}));

function DataParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1] md:hidden">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${p.isOrange ? 'bg-[#FF5C00]' : 'bg-[#0D0D0B]'}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            bottom: "-10%",
            opacity: p.isOrange ? 0.7 : 0.25,
          }}
          animate={{ y: [`0vh`, `${p.yOffset}vh`] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DESKTOP INTERACTIVE FIELD
   Single canvas — replaces 180 DOM particle nodes.
   • ~55 particles with damped Newtonian physics
   • Constellation lines between nearby particles
   • Mouse repulsion: particles scatter on hover
   • Closest particle to cursor gets orange accent glow
   • Cursor spotlight: soft radial gradient light
   • DPR-aware (sharp on retina), respects prefers-reduced-motion
───────────────────────────────────────────────────────────── */




function LaserScan() {
  return (
    /* Pure CSS animation — no JS rAF, no re-renders */
    <div
      className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5C00] to-transparent z-[15] pointer-events-none opacity-40 mix-blend-screen md:hidden"
      style={{
        boxShadow: "0 0 20px 1px rgba(255,92,0,0.4)",
        animation: "laser-scan-line 6s linear infinite",
      }}
    />
  );
}

// Pure-CSS scramble — avoids setInterval setState that forces 12 React re-renders/s
function TechnicalOverlay({ 
  className = "top-24 right-6 text-right", 
  title = "SYS.CORE.INIT", 
  subtitle = "V 1.0.9" 
}: { 
  className?: string; 
  title?: string; 
  subtitle?: string; 
}) {
  return (
    <div className={`absolute z-20 text-[#0D0D0B]/40 font-mono text-[10px] tracking-widest block md:hidden ${className}`}>
      <div>{title}</div>
      <div className="text-[#FF5C00] opacity-70">A4B9C2D1E8F3</div>
      <div>{subtitle}</div>
    </div>
  );
}


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
      {/* ── Warm ambient mesh — layer 1 ─── */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <div
          className="absolute top-[-14%] left-[50%] -translate-x-1/2 w-[700px] h-[560px] rounded-full blur-[70px] opacity-[0.30]"
          style={{ background: "radial-gradient(ellipse, rgba(255,138,61,0.9) 0%, transparent 62%)" }}
        />
      </div>

      {/* ── Warm ambient mesh — layer 2 ── */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        <div
          className="absolute bottom-[6%] right-[6%] w-[380px] h-[380px] rounded-full blur-[55px] opacity-[0.18]"
          style={{ background: "radial-gradient(circle, rgba(255,92,0,0.7) 0%, transparent 66%)" }}
        />
      </div>




      <TechnicalOverlay />
      <TechnicalOverlay 
        className="bottom-32 left-6 text-left" 
        title="DATA.STREAM.SYNC" 
        subtitle="LATENCY: 12ms" 
      />


      <DataParticles />
      <LaserScan />

      {/* ── Dynamic Kinetic Orb — pure CSS animations (no JS rAF) ── */}
      <div className="absolute inset-0 pointer-events-none z-[2]" aria-hidden="true">
        <div
          className="absolute w-[140vw] h-[140vw] md:w-[60vw] md:h-[60vw] rounded-full blur-[80px] md:blur-[60px] opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(255,92,0,0.50) 0%, rgba(255,138,61,0.22) 40%, transparent 70%)",
            animation: "hero-orb-a 15s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute top-[40%] right-[-40%] w-[120vw] h-[120vw] md:w-[50vw] md:h-[50vw] rounded-full blur-[70px] md:blur-[50px] opacity-45"
          style={{
            background: "radial-gradient(circle, rgba(255,138,61,0.45) 0%, rgba(255,92,0,0.18) 50%, transparent 70%)",
            animation: "hero-orb-b 18s ease-in-out infinite",
            willChange: "transform",
          }}
        />
      </div>


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
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 sm:pt-20"
      >

        {/* Brand name */}
        <h1
          className="font-instrument tracking-[-0.04em] leading-[1.04] mb-2 sm:mb-3 text-center"
          style={{ fontSize: "clamp(44px, 8.5vw, 118px)" }}
        >
          {(["Citizen", "Of", "Digital Age."] as Array<string>).map((word, wi) => (
            <span
              key={wi}
              className={["inline-block mr-[0.2em] last:mr-0", wi === 2 ? "block mt-1" : ""].join(" ")}
            >
              <div className="overflow-hidden -mx-3 px-3 pb-[0.18em] pt-[0.05em] relative">
                <motion.span
                  className={["inline-block relative", wi === 2 ? "italic text-[#FF5C00] animate-chromatic" : "text-[#0D0D0B]"].join(" ")}
                  initial={{ y: "108%", skewY: 4 }}
                  animate={{ y: "0%", skewY: 0 }}
                  transition={{ duration: 1.05, delay: 1.6 + wi * 0.13, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                  {wi === 2 && (
                    <>
                      <style>{`
                        @keyframes glitch-r {
                          0%,2.9%,3.3%,3.7%,4.1%,4.5%,4.9%,5.3%,5.7%,6.1%,6.5%,8%,100%{opacity:0;transform:translate(0,0);clip-path:inset(0 0 0 0)}
                          3%  {opacity:1;transform:translate(-14px,3px) skewX(-8deg);clip-path:inset(8%  0 50% 0)}
                          3.4%{opacity:1;transform:translate( 12px,-4px) skewX( 6deg);clip-path:inset(55% 0  6% 0)}
                          3.8%{opacity:1;transform:translate(-16px,2px) skewX(-10deg);clip-path:inset(22% 0 38% 0)}
                          4.2%{opacity:1;transform:translate( 10px,-2px) skewX( 4deg);clip-path:inset(65% 0  3% 0)}
                          4.6%{opacity:0;transform:translate(0,0)}
                          5%  {opacity:1;transform:translate(-18px,4px) skewX(-12deg);clip-path:inset(40% 0 25% 0)}
                          5.4%{opacity:1;transform:translate( 14px,-3px) skewX(  8deg);clip-path:inset(10% 0 58% 0)}
                          5.8%{opacity:1;transform:translate(-10px,1px) skewX(-5deg);clip-path:inset(75% 0  2% 0)}
                          6.2%{opacity:1;transform:translate(  8px,-5px) skewX(  3deg);clip-path:inset(30% 0 42% 0)}
                          6.6%{opacity:1;transform:translate(-12px,2px);clip-path:inset(52% 0 15% 0)}
                        }
                        @keyframes glitch-b {
                          0%,2.9%,3.3%,3.7%,4.1%,4.5%,4.9%,5.3%,5.7%,6.1%,6.5%,8%,100%{opacity:0;transform:translate(0,0);clip-path:inset(0 0 0 0)}
                          3%  {opacity:1;transform:translate( 14px,-3px) skewX( 8deg);clip-path:inset(55% 0  6% 0)}
                          3.4%{opacity:1;transform:translate(-12px, 4px) skewX(-6deg);clip-path:inset( 8% 0 50% 0)}
                          3.8%{opacity:1;transform:translate( 16px,-2px) skewX(10deg);clip-path:inset(68% 0  2% 0)}
                          4.2%{opacity:1;transform:translate(-10px, 2px) skewX(-4deg);clip-path:inset(20% 0 42% 0)}
                          4.6%{opacity:0;transform:translate(0,0)}
                          5%  {opacity:1;transform:translate( 18px,-4px) skewX(12deg);clip-path:inset(12% 0 55% 0)}
                          5.4%{opacity:1;transform:translate(-14px, 3px) skewX(-8deg);clip-path:inset(60% 0  8% 0)}
                          5.8%{opacity:1;transform:translate( 10px,-1px) skewX( 5deg);clip-path:inset(35% 0 32% 0)}
                          6.2%{opacity:1;transform:translate( -8px, 5px) skewX(-3deg);clip-path:inset(78% 0  1% 0)}
                          6.6%{opacity:1;transform:translate( 12px,-2px);clip-path:inset(25% 0 48% 0)}
                        }
                        @keyframes glitch-g {
                          0%,4.4%,4.8%,5.2%,5.6%,7%,100%{opacity:0;transform:translate(0,0);clip-path:inset(0 0 0 0)}
                          4.5%{opacity:.7;transform:translate(-6px,5px);clip-path:inset(33% 0 33% 0)}
                          4.9%{opacity:.7;transform:translate( 8px,-4px);clip-path:inset(66% 0  4% 0)}
                          5.3%{opacity:.7;transform:translate(-4px, 2px);clip-path:inset(15% 0 60% 0)}
                          5.7%{opacity:.7;transform:translate( 6px,-3px);clip-path:inset(50% 0 20% 0)}
                        }
                      `}</style>
                      <span aria-hidden className="absolute inset-0 pointer-events-none select-none font-instrument italic"
                        style={{ color: "#FF1500", animation: "glitch-r 2s linear infinite" }}>{word}</span>
                      <span aria-hidden className="absolute inset-0 pointer-events-none select-none font-instrument italic"
                        style={{ color: "#00E5FF", animation: "glitch-b 2s linear infinite", animationDelay: "0.035s" }}>{word}</span>
                      <span aria-hidden className="absolute inset-0 pointer-events-none select-none font-instrument italic"
                        style={{ color: "#00FF88", animation: "glitch-g 2s linear infinite", animationDelay: "0.07s" }}>{word}</span>
                    </>
                  )}
                </motion.span>
              </div>
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <motion.div
          className="flex items-center gap-4 mb-6 sm:mb-10 -mt-6 sm:-mt-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="h-[1px] w-10 bg-[#0D0D0B]/30 block shrink-0" />
          <p className="font-instrument italic text-[#0D0D0B]/70 text-[24px] sm:text-[34px] tracking-[-0.02em] text-center">
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


      {/* ── Scroll indicator ─────────────────────────────── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-[110px] flex flex-col items-center gap-2 z-10"
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
