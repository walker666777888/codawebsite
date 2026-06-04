"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useRef, useEffect } from "react";
import ScrambleText from "@/components/ui/ScrambleText";
import { useInView } from "motion/react";

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

function AnimLink({ href, children }: { href: string; children: string }) {
  return (
    <motion.a
      href={href}
      className="relative inline-block font-sans text-sm text-white/40 hover:text-white transition-colors duration-300 group"
      whileHover="hover"
    >
      {children}
      <motion.span
        className="absolute inset-x-0 -bottom-px h-[1px] bg-[#FF5C00] origin-left"
        initial={{ scaleX: 0 }}
        variants={{ hover: { scaleX: 1 } }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.a>
  );
}

const SOCIAL = [
  { label: "LinkedIn",  href: "#" },
  { label: "Instagram", href: "#" },
];

const LINKS = [
  { label: "Work",         href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Philosophy",   href: "#philosophy" },
  { label: "Contact",      href: "#contact" },
];

const LEGAL = [
  { label: "Privacy Policy",   href: "#" },
  { label: "Terms of Service", href: "#" },
];

function VideoText() {
  const TEXT = "CITIZEN OF DIGITAL AGE";
  const { wrapRef, textRef } = useFitText();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "600px" });

  return (
    <div ref={containerRef} className="relative overflow-hidden select-none">
      {/* Video layer */}
      {isInView && (
        <video
          autoPlay muted loop playsInline aria-hidden
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          src="/footervid/hero.mp4"
        />
      )}

      {/* Multiply blend: black bg + white text = video shows inside letters */}
      <div style={{ background: "#0A0A09", mixBlendMode: "multiply" }}>
        <div ref={wrapRef} style={{ width: "100%", overflow: "hidden", lineHeight: 0, padding: 0, margin: 0 }}>
          <span
            ref={textRef}
            className="block whitespace-nowrap text-white uppercase"
            style={{
              fontFamily: "var(--font-unbounded)",
              fontSize: "6vw",          /* fallback until JS kicks in — Unbounded is wide so needs less */
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              display: "block",
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
  const ref = useRef<HTMLElement>(null);

  return (
    <footer id="contact" ref={ref} className="relative bg-[#0A0A09] text-white overflow-hidden">

      {/* ── Nav content ─────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16">

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-12 md:gap-20 mb-16">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-baseline gap-[2px] mb-5">
              <span className="font-instrument text-[32px] text-white tracking-[-0.04em] leading-none">
                <ScrambleText text="CODA" delay={0.3} />
              </span>
              <motion.span
                className="font-mono text-[#FF5C00] text-[32px] leading-none"
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >.</motion.span>
            </div>
            <p className="font-sans text-[14px] text-white/40 max-w-[260px] leading-[1.75]">
              Engineering high-performance digital ecosystems. Dominate the Digital Age.
            </p>
            <motion.a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=Connect@citizenofdigitalage.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 mt-6 font-mono text-[11px] text-white/35 hover:text-[#FF5C00] transition-colors duration-300 uppercase tracking-[0.18em]"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.25 }}
            >
              Connect@citizenofdigitalage.com
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
            </motion.a>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25 mb-6">Navigation</p>
            <ul className="space-y-4">
              {LINKS.map(({ label, href }, i) => (
                <motion.li key={label} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}>
                  <AnimLink href={href}>{label}</AnimLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25 mb-6">Social</p>
            <ul className="space-y-4">
              {SOCIAL.map(({ label, href }, i) => (
                <motion.li key={label} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}>
                  <AnimLink href={href}>{label}</AnimLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col justify-end"
          >
            <div className="inline-flex items-center gap-2.5 border border-white/10 bg-white/[0.04] rounded-full px-4 py-2.5 self-start">
              <div className="relative flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
                <motion.span
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#39FF14]"
                  animate={{ scale: [1, 2.8, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                />
              </div>
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.18em]">Available</span>
            </div>
          </motion.div>
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
      <VideoText />

    </footer>
  );
}
