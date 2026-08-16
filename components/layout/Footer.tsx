"use client";

import Link from "next/link";
import { motion } from "motion/react";
import React, { useRef, useEffect } from "react";
import ScrambleText from "@/components/ui/ScrambleText";
import { useVideoPreload } from "@/components/providers/VideoPreloadProvider";
import { lenisScrollTo } from "@/components/providers/LenisProvider";

/* ── Fit-text: waits for font load then fills container exactly ── */
function useFitText() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const roRef   = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const fit = () => {
      const wrap = wrapRef.current;
      const el   = textRef.current;
      if (!wrap || !el) return;
      const W = wrap.getBoundingClientRect().width;
      if (!W) return;
      // Use scrollWidth — gives real text width even inside overflow:hidden
      el.style.fontSize = "200px";
      const textW = el.scrollWidth;
      if (!textW) return;
      el.style.fontSize = Math.floor((W / textW) * 200) + "px";
    };

    // wait until fonts are ready so measurement is accurate
    document.fonts.ready.then(() => {
      fit();
      roRef.current = new ResizeObserver(fit);
      if (wrapRef.current) roRef.current.observe(document.body);
    });

    return () => roRef.current?.disconnect();
  }, []);

  return { wrapRef, textRef };
}

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  const el = document.getElementById(href.replace("#", ""));
  if (el) lenisScrollTo(el);
}

function AnimLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      onClick={(e) => scrollToSection(e, href)}
      className="inline-block font-sans text-sm text-white/40 no-underline transition-colors duration-300"
      whileHover={{ color: "#FF5C00" }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.a>
  );
}

const SOCIAL = [
  { label: "LinkedIn",  href: "#" },
  { label: "Instagram", href: "#" },
];

const LINKS = [
  { label: "Work",         href: "#work" },
  { label: "Philosophy",   href: "#philosophy" },
  { label: "Contact",      href: "#contact" },
];

const LEGAL = [
  { label: "Privacy Policy",   href: "#" },
  { label: "Terms of Service", href: "#" },
];

function VideoText({ shouldLoad }: { shouldLoad: boolean }) {
  const TEXT = "CITIZEN OF DIGITAL AGE";
  const { wrapRef, textRef } = useFitText();

  return (
    <div className="relative overflow-hidden select-none">
      {/* Video layer */}
      {shouldLoad && (
        <video
          autoPlay muted loop playsInline aria-hidden
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          src="/footervid/hero.mp4"
        />
      )}

      {/* Multiply blend: black bg + white text = video shows inside letters */}
      <div style={{ background: "#0A0A09", mixBlendMode: "multiply" }}>
        <div ref={wrapRef} className="w-full overflow-hidden pt-[10%] sm:pt-0 pb-[2%] sm:pb-0" style={{ lineHeight: 0, margin: 0 }}>
          <span
            ref={textRef}
            className="block whitespace-nowrap text-white uppercase scale-y-[1.8] sm:scale-y-100 origin-bottom transition-transform duration-300"
            style={{
              fontFamily: "var(--font-unbounded)",
              fontSize: "6vw",
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              display: "block",
              textAlign: "center",
              width: "100%",
            }}
          >
            {TEXT}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const { shouldLoad } = useVideoPreload();

  return (
    <footer id="contact" ref={containerRef} className="relative bg-[#0A0A09] text-white overflow-hidden">

      {/* ── Nav content ─────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16">

        <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_auto_auto] gap-10 md:gap-20 mb-16">
          
          {/* Logo (Top on mobile, Col 1 on desktop) */}
          <motion.div
            className="md:col-start-1 md:row-start-1 md:mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-baseline gap-[2px]">
              <span className="font-instrument text-[48px] text-white tracking-[-0.04em] leading-none">
                CODA
              </span>
              <motion.span
                className="font-mono text-[#FF5C00] text-[48px] leading-none"
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >.</motion.span>
            </div>
          </motion.div>

          <div className="flex flex-row justify-between md:justify-start gap-6 md:gap-0 md:contents">
            
            {/* Description & Connect (Left vertical on mobile, horizontal on desktop under logo) */}
            <motion.div
              className="md:col-start-1 md:row-start-2 flex flex-col justify-end md:block flex-shrink-0 md:pr-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            >
              <div className="md:max-w-[260px] [writing-mode:vertical-rl] rotate-180 md:[writing-mode:horizontal-tb] md:rotate-0 tracking-widest md:tracking-normal flex-shrink-0">
                <p className="font-sans text-[16px] md:text-[14px] text-white/40 leading-[1.75] whitespace-nowrap md:whitespace-normal">
                  Engineering high-performance digital ecosystems.
                </p>
                <p className="font-sans text-[16px] md:text-[14px] text-white/40 leading-[1.75] whitespace-nowrap md:whitespace-normal ml-3 md:ml-0 md:mt-2">
                  Dominate the Digital Age.
                </p>
                <motion.a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=Connect@citizenofdigitalage.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-mono text-[9px] md:text-[11px] text-white/35 hover:text-[#FF5C00] transition-colors duration-300 uppercase tracking-[0.18em] ml-6 md:ml-0 md:mt-6"
                  whileHover={{ x: -4, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  Connect@citizenofdigitalage.com
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:inline">→</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Right side on mobile / Cols 2 & 3 on desktop */}
            <div className="flex flex-col gap-10 flex-grow md:contents pt-2 md:pt-0">
              
              {/* Navigation */}
              <motion.div
                className="md:col-start-2 md:row-start-1 md:row-span-2 text-right md:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white mb-6">
                  Navigation
                </p>
                <ul className="space-y-4">
                  {LINKS.map(({ label, href }, i) => (
                    <motion.li key={label} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}>
                      <AnimLink href={href}>
                        {label}
                      </AnimLink>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Social */}
              <motion.div
                className="md:col-start-3 md:row-start-1 md:row-span-2 text-right md:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white mb-6">
                  Social
                </p>
                <ul className="space-y-4">
                  {SOCIAL.map(({ label, href }, i) => (
                    <motion.li key={label} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}>
                      <AnimLink href={href}>
                        {label}
                      </AnimLink>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.08] pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[9px] text-white/25 uppercase tracking-[0.22em]">
            © {new Date().getFullYear()} CODA. All rights reserved.
          </p>
          <div className="flex gap-7">
            {LEGAL.map(({ label, href }) => (
              <Link key={label} href={href} className="font-mono text-[9px] text-white/25 hover:text-white/60 uppercase tracking-[0.18em] transition-colors duration-200">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Video-inside-text — true edge to edge, all caps ── */}
      <VideoText shouldLoad={shouldLoad} />

    </footer>
  );
}
