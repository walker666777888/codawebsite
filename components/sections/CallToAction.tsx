"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowRight } from "lucide-react";
import { useFormModal } from "@/components/providers/FormModalProvider";

export default function CallToAction() {
  const { open: openForm } = useFormModal();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

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
        className="relative py-28 sm:py-40 px-6 [&_*::selection]:bg-[#39FF14] [&_*::selection]:text-[#0D0D0B]"
        style={{ background: "#FF5C00" }}
      >
        {/* Background — desktop only decorations, zero mobile cost */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hidden md:flex absolute inset-0 items-center justify-center">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="cta-ring" style={{ animationDelay: `${i}s` }} />
            ))}
          </div>
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right,#0D0D0B 1px,transparent 1px),linear-gradient(to bottom,#0D0D0B 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Card — CSS animated, GPU composited */}
          <div
            className={`cta-card${visible ? " in" : ""} w-full max-w-2xl text-center flex flex-col items-center gap-8 sm:gap-10 rounded-3xl px-6 sm:px-10 py-10 sm:py-14`}
            style={{
              background: "#1a0d00",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
            }}
          >
            {/* Eyebrow */}
            <div
              className={`cta-eyebrow${visible ? " in" : ""} inline-flex items-center gap-3 border border-white/10 bg-white/[0.05] rounded-full px-5 py-2.5`}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.6, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
                Ready when you are
              </p>
            </div>

            {/* Headline — pure CSS transform, no JS per-frame cost */}
            <div>
              {["Ready to", "Dominate?"].map((line, li) => (
                <div key={li} className="cta-line-wrap">
                  <span
                    className={`cta-line${visible ? ` in-${li}` : ""} font-instrument tracking-[-0.04em] leading-[1.0] ${
                      li === 1 ? "italic text-[#FF5C00]" : "text-white"
                    }`}
                    style={{ fontSize: "clamp(40px, 10vw, 130px)" }}
                  >
                    {line}
                  </span>
                </div>
              ))}
            </div>

            {/* Sub-copy */}
            <p
              className={`cta-sub${visible ? " in" : ""} font-sans text-[17px] text-white/60 max-w-md leading-[1.7]`}
            >
              Most agencies build features. We build systems that outlast them.
            </p>

            {/* CTA button */}
            <div className={`cta-btn${visible ? " in" : ""} flex flex-col items-center gap-4`}>
              <MagneticButton variant="accent" onClick={openForm}>
                <span
                  className="flex items-center gap-3 bg-[#FF5C00] text-white px-9 py-4 rounded-xl font-sans font-semibold text-[15px] tracking-[-0.01em]"
                  style={{ boxShadow: "0 8px 24px rgba(255,92,0,0.4)" }}
                >
                  Start a project
                  <ArrowRight className="w-4 h-4" />
                </span>
              </MagneticButton>
            </div>

            {/* Footer note */}
            <div
              className={`cta-note${visible ? " in" : ""} flex items-center gap-4 font-mono text-[10px] text-white/30 tracking-widest uppercase`}
            >
              <span>No retainers</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>No bloat</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Just results</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
