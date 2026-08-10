"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion
} from "motion/react";
import { useRef, useEffect, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useFormModal } from "@/components/providers/FormModalProvider";
import { useIsLowEndDevice } from "@/hooks/useIsLowEndDevice";
import dynamic from "next/dynamic";
const LiquidEther = dynamic(() => import("@/components/ui/LiquidEther"), { ssr: false });
import TextType from "@/components/ui/TextType";
import WarpText from "@/components/ui/WarpText";

const PARTICLES = Array.from({ length: 25 }).map((_, i) => ({
  id: i,
  left: `${(i * 33.7) % 100}%`,
  duration: 12 + (i % 10),
  delay: (i * 0.6) % 8,
  size: i % 5 === 0 ? 5 : (i % 3 === 0 ? 3.5 : 2.5),
  isOrange: i % 4 === 0,
  yOffset: -(100 + (i % 30))
}));

function DataParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1] md:hidden">
      <style>{`
        @keyframes particleUp {
          0% { transform: translateY(0vh); }
          100% { transform: translateY(var(--y-offset, -100vh)); }
        }
      `}</style>
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full ${p.isOrange ?'bg-coda-accent' : 'bg-white'}`}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            bottom: "-10%",
            opacity: p.isOrange ? 0.7 : 0.25,
            "--y-offset": `${p.yOffset}vh`,
            animation: `particleUp ${p.duration}s linear ${p.delay}s infinite`
          } as React.CSSProperties}
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
      className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-coda-accent to-transparent z-[15] pointer-events-none opacity-40 mix-blend-screen md:hidden"
      style={{
        boxShadow: "0 0 20px 1px rgba(255,92,0,0.4)",
        animation: "laser-scan-line 6s linear infinite",
      }}
    />
  );
}

function DynamicHex() {
  const hexRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const chars = "0123456789ABCDEF";
    let animationFrameId: number;
    let lastTime = 0;
    let isVisible = false;

    const animate = (time: number) => {
      if (!isVisible) return;

      if (time - lastTime > 80) {
        if (hexRef.current) {
          let result = "";
          for (let i = 0; i < 12; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
          hexRef.current.innerText = result;
        }
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver((entries) => {
      const wasVisible = isVisible;
      isVisible = entries[0].isIntersecting;
      if (isVisible && !wasVisible) {
        animationFrameId = requestAnimationFrame(animate);
      }
    });

    if (hexRef.current) observer.observe(hexRef.current);

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return <div ref={hexRef} className="text-coda-accent opacity-70">A4B9C2D1E8F3</div>;
}

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
    <div className={`absolute z-20 text-white/40 font-mono text-[10px] tracking-widest block md:hidden ${className}`}>
      <div>{title}</div>
      <DynamicHex />
      <div>{subtitle}</div>
    </div>
  );
}


export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { open: openForm } = useFormModal();

  // Detect touch device — disable all JS-driven parallax on mobile
  const [isTouch, setIsTouch] = useState(false);
  const [isInteractMode, setIsInteractMode] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    
    const handleResize = () => setIsMobileScreen(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    if (isInteractMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, [isInteractMode]);

  const isLowTier = useIsLowEndDevice();
  const prefersReducedMotion = useReducedMotion();
  const shouldDisableParallax = isTouch || isLowTier || prefersReducedMotion;

  /* ── Scroll parallax (desktop only) ──────────────────── */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y    = useTransform(scrollYProgress, [0, 1], shouldDisableParallax ? ["0%", "0%"] : ["0%", "20%"]);
  const fade = useTransform(scrollYProgress, [0, 0.55], shouldDisableParallax ? [1, 1] : [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], shouldDisableParallax ? ["0%", "0%"] : ["0%", "8%"]);


  const headlineWords = [
    { text: "Dominate", white: true },
    { text: "the", white: true },
    { text: "Digital Age.", italic: true, accent: true },
  ];

  return (
    <section
      ref={ref}
      id="hero"
      className={`relative h-[100svh] overflow-hidden flex flex-col bg-coda-bg ${isInteractMode ? "touch-none" : ""}`}
    >
      {/* ── Dark base for desktop (LiquidEther sits on top) ── */}
      <div className="absolute inset-0 z-[0] bg-black" />

      {/* ── Mobile Fluid Interact Toggle ── */}
      <button
        onClick={() => setIsInteractMode(!isInteractMode)}
        className="absolute bottom-6 right-6 z-30 md:hidden flex items-center justify-center w-12 h-12 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(13,13,11,0.6)] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-colors"
        aria-label={isInteractMode ? "Unlock Screen" : "Lock Screen"}
      >
        {isInteractMode ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#FF5C00]">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/70">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </svg>
        )}
      </button>

      {/* ── LiquidEther fluid background ── */}
      {!isLowTier && (
        <div className={`absolute inset-0 z-[1] ${isInteractMode ? "pointer-events-auto" : "pointer-events-none md:pointer-events-auto"}`}>
          <LiquidEther
            colors={["#ffaeae", "#ff9851", "#fed553"]}
            mouseForce={25}
            cursorSize={isMobileScreen ? 40 : 100}
            isViscous={false}
            viscous={100}
            iterationsViscous={8} // Drastically reduced from 32
            iterationsPoisson={8} // Drastically reduced from 32
            autoDemo={true}
            autoSpeed={0.4}
            autoIntensity={1.3}
            isBounce={true}
            resolution={0.25} // Reduced from 0.5 to cut pixels calculated by 4x
          />
        </div>
      )}






      <TechnicalOverlay />
      <TechnicalOverlay 
        className="bottom-10 left-6 text-left"
        title="DATA.STREAM.SYNC" 
        subtitle="LATENCY: 12ms" 
      />


      <DataParticles />



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

      {/* ── Vignette for Text Readability ────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-[3] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.65)_0%,transparent_70%)]" />




      {/* ── Main content ─────────────────────────────────── */}
      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 sm:pt-20 gap-4 md:gap-6 pointer-events-none"
      >

        {/* Brand name Desktop (WarpText) */}
        <div className="hidden md:flex w-full justify-center font-instrument pointer-events-auto">
          <WarpText
            text="Citizen Of Digital Age."
            color="#FF5C00"
            warpStrength={0.05}
            warpScale={0.8}
            speed={1.5}
            pointerInfluence={0.75}
            pointerStrength={0.57}
            refraction={0.02}
            ripple
            fontSize="clamp(64px, 11vw, 150px)"
            fontWeight={600}
            style={{ height: '300px', width: '100%', maxWidth: '1400px' }}
            fontFamily="inherit"
            letterSpacing="-0.04em"
            lineHeight={1.04}
          />
        </div>

        {/* Brand name Mobile (Original) */}
        <h1
          className="md:hidden font-instrument tracking-[-0.04em] leading-[1.04] text-center drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
          style={{ fontSize: "clamp(62px, 10.5vw, 118px)" }}
        >
          {(["Citizen", "Of", "Digital Age."] as Array<string>).map((word, wi) => (
            <span
              key={wi}
              className={["inline-block mr-[0.2em] last:mr-0", wi === 2 ? "block -mt-7" : ""].join(" ")}
            >
              <div className="overflow-hidden -mx-3 px-3 pb-[0.18em] pt-[0.05em] relative">
                <motion.span
                  className={["inline-block relative", wi === 2 ? "text-coda-accent animate-chromatic" : "text-white"].join(" ")}
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
                      <span aria-hidden className="absolute inset-0 pointer-events-none select-none font-instrument"
                        style={{ color: "#FF1500", animation: "glitch-r 2s linear infinite" }}>{word}</span>
                      <span aria-hidden className="absolute inset-0 pointer-events-none select-none font-instrument"
                        style={{ color: "#00E5FF", animation: "glitch-b 2s linear infinite", animationDelay: "0.035s" }}>{word}</span>
                      <span aria-hidden className="absolute inset-0 pointer-events-none select-none font-instrument"
                        style={{ color: "#00FF88", animation: "glitch-g 2s linear infinite", animationDelay: "0.07s" }}>{word}</span>
                    </>
                  )}
                </motion.span>
              </div>
            </span>
          ))}
        </h1>

        <div className="flex flex-col items-center gap-5 sm:gap-7 md:-mt-12">
          {/* Tagline */}
          <motion.div
            className="flex items-center gap-2 sm:gap-4 max-w-full"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="h-[1px] w-4 sm:w-10 bg-white/20 block shrink" />
            <p className="font-instrument text-white/95 text-[18px] min-[390px]:text-[20px] sm:text-[28px] md:text-[40px] tracking-[-0.02em] text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <TextType 
                text="Engineer your " 
                as="span" 
                showCursor={false} 
                initialDelay={2600} 
                typingSpeed={50} 
              />
              <span className="text-coda-accent">
                <TextType 
                  text="unfair advantage." 
                  as="span" 
                  showCursor={false} 
                  initialDelay={2600 + (14 * 50)} 
                  typingSpeed={50} 
                  cursorClassName="bg-coda-accent" 
                />
              </span>
            </p>
            <span className="h-[1px] w-4 sm:w-10 bg-white/20 block shrink" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-[14px] sm:text-[16px] text-white/80 max-w-[340px] sm:max-w-[480px] leading-[1.65] sm:leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            <TextType 
              text="We unify technology, design, and growth into compounding digital ecosystems that outpace your competition." 
              as="span" 
              showCursor={false} 
              initialDelay={4200} 
              typingSpeed={10} 
            />
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-5 pointer-events-auto"
          >
            <MagneticButton variant="primary" onClick={openForm}>
              <span className="flex items-center gap-2 font-sans font-semibold text-[14px] px-8 py-3.5 tracking-[-0.01em]">
                Start a project
                <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
              </span>
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>


      {/* ── Scroll indicator — pinned to very bottom ─────── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-6 flex flex-col items-center gap-2 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 1.2 }}
      >
        <div className="w-[1px] h-10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-coda-ink/20 md:via-white/20 to-transparent" />
          <motion.div
            className="w-full h-[35%] bg-coda-ink/50 md:bg-white/50"
            animate={{ y: ["0%", "230%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.3 }}
          />
        </div>
      </motion.div>
    </section>
  );
}
