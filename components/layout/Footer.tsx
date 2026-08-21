"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import React, { useRef, useEffect, useState } from "react";
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
      el.style.fontSize = "200px";
      const textW = el.scrollWidth;
      if (!textW) return;
      el.style.fontSize = Math.floor((W / textW) * 200) + "px";
    };

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
      className="inline-block font-sans text-sm text-[#FF5C00] no-underline transition-colors duration-300 hover:text-white"
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

/* ── Terminal Component ── */
function Terminal() {
  const [history, setHistory] = useState<{ id: number; type: 'cmd' | 'out'; text: React.ReactNode }[]>([
    { id: 1, type: 'out', text: "CODA_OS v1.0.0 initialized." },
    { id: 2, type: 'cmd', text: "help" },
    { id: 3, type: 'out', text: (
      <div className="flex flex-col gap-4 mt-2 mb-2">
        <div>
          <span className="text-white/40 block mb-1">Navigation //</span>
          <div className="flex gap-4">
            {LINKS.map(link => (
              <AnimLink key={link.label} href={link.href}>
                [{link.label}]
              </AnimLink>
            ))}
          </div>
        </div>
        <div>
          <span className="text-white/40 block mb-1">Social //</span>
          <div className="flex gap-4">
            {SOCIAL.map(link => (
              <AnimLink key={link.label} href={link.href}>
                [{link.label}]
              </AnimLink>
            ))}
          </div>
        </div>
        <div className="text-white/40 mt-2">
          Other commands: <span className="text-[#FF5C00]">clear</span>, <span className="text-[#FF5C00]">sudo easter_egg</span>
        </div>
      </div>
    )}
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cmdId, setCmdId] = useState(4);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const lowerCmd = cmd.toLowerCase();
    let output: React.ReactNode = "";
    let shouldClear = false;

    switch(lowerCmd) {
      case "help":
        output = (
          <div className="flex flex-col gap-4 mt-2 mb-2">
            <div>
              <span className="text-white/40 block mb-1">Navigation //</span>
              <div className="flex gap-4">
                {LINKS.map(link => (
                  <AnimLink key={link.label} href={link.href}>
                    [{link.label}]
                  </AnimLink>
                ))}
              </div>
            </div>
            <div>
              <span className="text-white/40 block mb-1">Social //</span>
              <div className="flex gap-4">
                {SOCIAL.map(link => (
                  <AnimLink key={link.label} href={link.href}>
                    [{link.label}]
                  </AnimLink>
                ))}
              </div>
            </div>
            <div className="text-white/40 mt-2">
              Other commands: <span className="text-[#FF5C00]">clear</span>, <span className="text-[#FF5C00]">sudo easter_egg</span>
            </div>
          </div>
        );
        break;
      case "run work":
      case "work":
        output = "Routing to work module...";
        setTimeout(() => {
          const el = document.getElementById("work");
          if (el) lenisScrollTo(el);
        }, 500);
        break;
      case "run philosophy":
      case "philosophy":
        output = "Routing to methodology...";
        setTimeout(() => {
          const el = document.getElementById("philosophy");
          if (el) lenisScrollTo(el);
        }, 500);
        break;
      case "execute contact":
      case "contact":
        output = "Opening secure communication channel...";
        setTimeout(() => {
          window.open("https://mail.google.com/mail/?view=cm&fs=1&to=Connect@citizenofdigitalage.com", "_blank");
        }, 500);
        break;
      case "clear":
        shouldClear = true;
        break;
      case "sudo easter_egg":
      case "easter_egg":
        output = (
          <div className="text-red-500 mt-1">
            [ACCESS DENIED] Unauthorized access attempt logged to SYS.CORE.
            <br />
            <span className="text-white/40 text-[10px] mt-2 block">Just kidding. You found it. Stay engineered.</span>
          </div>
        );
        break;
      default:
        output = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
    }

    if (shouldClear) {
      setHistory([]);
    } else {
      setHistory(prev => [
        ...prev, 
        { id: cmdId, type: 'cmd', text: cmd }, 
        { id: cmdId + 1, type: 'out', text: output }
      ]);
      setCmdId(prev => prev + 2);
    }
    setInput("");
  };

  return (
    <div 
      className="md:col-start-2 md:col-span-2 md:row-start-1 md:row-span-2 bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-sm overflow-hidden flex flex-col h-[280px] w-full max-w-[600px] shadow-2xl relative group cursor-text"
      onClick={() => inputRef.current?.focus()}
      data-cursor="terminal_block"
    >
      {/* Mac-like dots for aesthetic */}
      <div className="flex gap-2 mb-4 absolute top-4 right-4 opacity-30">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
      </div>

      <div className="text-[10px] uppercase tracking-widest text-white/30 border-b border-white/10 pb-2 mb-3">
        CODA // System Terminal
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2 scrollbar-hide">
        <AnimatePresence initial={false}>
          {history.map((line) => (
            <motion.div 
              key={line.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={line.type === 'cmd' ? "text-[#FF5C00]" : "text-white/70"}
            >
              {line.type === 'cmd' ? (
                <div className="flex gap-2">
                  <span className="text-white/40">C:\CODA&gt;</span>
                  <span>{line.text}</span>
                </div>
              ) : (
                <div>{line.text}</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Active Input Line */}
        <form onSubmit={handleCommand} className="flex gap-2 mt-2 items-center">
          <span className="text-white/40">C:\CODA&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-[#FF5C00] flex-1 font-mono caret-[#FF5C00] focus:ring-0"
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

/* ── Video-inside-text ── */
function VideoText({ shouldLoad }: { shouldLoad: boolean }) {
  const TEXT = "CITIZEN OF DIGITAL AGE";
  const { wrapRef, textRef } = useFitText();

  return (
    <motion.div 
      className="relative overflow-hidden select-none"
      initial={{ opacity: 0, filter: "blur(24px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {shouldLoad && (
        <video
          autoPlay muted loop playsInline aria-hidden
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          src="/footervid/hero.mp4"
        />
      )}

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
    </motion.div>
  );
}

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const { shouldLoad } = useVideoPreload();

  return (
    <footer id="contact" ref={containerRef} className="relative bg-[#0A0A09] text-white overflow-hidden">

      {/* ── Nav content ─────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16">

        <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_auto_auto] gap-10 md:gap-x-20 md:gap-y-6 mb-16">
          
          {/* Logo */}
          <motion.div
            className="md:col-start-1 md:row-start-1"
            initial={{ opacity: 0, filter: "blur(24px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-baseline gap-[2px]">
              <style>{`
                .coda-footer-logo {
                  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                  display: inline-block;
                  cursor: default;
                  filter: blur(2px);
                  opacity: 0.8;
                  transform: scale(0.98);
                }
                .coda-footer-logo:hover {
                  filter: blur(0px);
                  opacity: 1;
                  transform: scale(1);
                  color: #FF5C00;
                }
              `}</style>
              <span className="coda-footer-logo font-instrument text-5xl text-white tracking-[-0.04em] leading-none">
                CODA
              </span>
              <motion.span
                className="font-mono text-[#FF5C00] text-5xl leading-none"
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >.</motion.span>
            </div>
          </motion.div>

          {/* Description & Connect */}
          <motion.div
            className="md:col-start-1 md:row-start-2 flex flex-col justify-end md:block flex-shrink-0 md:pr-12"
            initial={{ opacity: 0, filter: "blur(24px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          >
            <div className="md:max-w-[260px] tracking-widest md:tracking-normal flex-shrink-0">
              <p className="font-sans text-base md:text-sm text-white/40 leading-[1.75]">
                Engineering high-performance digital ecosystems.
              </p>
              <p className="font-sans text-base md:text-sm text-[#FF5C00] leading-[1.75] mt-2">
                Dominate the Digital Age.
              </p>
              <motion.a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=Connect@citizenofdigitalage.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-mono text-[10px] text-white/35 hover:text-[#FF5C00] transition-colors duration-300 uppercase tracking-[0.18em] mt-6"
                whileHover={{ x: -4, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                Connect@citizenofdigitalage.com
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Terminal */}
          <motion.div
            className="md:col-start-2 md:col-span-2 md:row-start-1 md:row-span-2 flex items-center mt-10 md:mt-0"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(24px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <Terminal />
          </motion.div>

        </div>

        {/* Bottom bar */}
        <motion.div 
          className="border-t border-white/[0.08] pt-7 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0, filter: "blur(24px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: "transform, opacity, filter" }}
        >
          <p className="font-mono text-[10px] text-white/25 uppercase tracking-[0.22em]">
            © {new Date().getFullYear()} CODA. All rights reserved.
          </p>
          <div className="flex gap-7">
            {[{ label: "Privacy Policy", href: "#" }, { label: "Terms of Service", href: "#" }].map(({ label, href }) => (
              <Link key={label} href={href} className="font-mono text-[10px] text-white/25 hover:text-white/60 uppercase tracking-[0.18em] transition-colors duration-200">
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      <VideoText shouldLoad={shouldLoad} />

    </footer>
  );
}
