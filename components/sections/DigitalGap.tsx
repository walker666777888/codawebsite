"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────────────────────
   Visual 1 — "Fragility"
   Premium pill nodes, animated dashed dead-channels, X breaks.
   SVG viewBox matches HTML % positions precisely.
───────────────────────────────────────────────────────────── */
function VisualFragility() {
  // Positions as % of 420×290 viewBox
  const nodes = [
    { cx: 20, cy: 24, label: "CRM",    hot: true  },
    { cx: 50, cy: 17, label: "EMAIL",  hot: true  },
    { cx: 80, cy: 24, label: "ADS",    hot: true  },
    { cx: 23, cy: 74, label: "SITE",   hot: false },
    { cx: 73, cy: 76, label: "SOCIAL", hot: true  },
  ];

  const links = [
    { x1: 20, y1: 24, x2: 50, y2: 17 },
    { x1: 50, y1: 17, x2: 80, y2: 24 },
    { x1: 20, y1: 24, x2: 23, y2: 74 },
    { x1: 50, y1: 17, x2: 50, y2: 58 },
    { x1: 80, y1: 24, x2: 73, y2: 76 },
  ];

  return (
    <div className="relative w-full h-full">
      {/* Lines — preserveAspectRatio none: coords match % positions */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
        {links.map((l, i) => (
          <motion.line key={i}
            x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke="#FF5C00" strokeWidth="0.3" strokeDasharray="1.4 2"
            animate={{ opacity: [0.4, 0.08, 0.4] }}
            transition={{ duration: 2.6, delay: i * 0.45, repeat: Infinity }}
          />
        ))}
      </svg>

      {/* X-break marks at midpoints */}
      {links.map((l, i) => {
        const mx = (l.x1 + l.x2) / 2;
        const my = (l.y1 + l.y2) / 2;
        return (
          <motion.div key={i}
            className="absolute z-10"
            style={{ left: `${mx}%`, top: `${my}%`, transform: "translate(-50%,-50%)" }}
            animate={{ opacity: [0.9, 0.3, 0.9] }}
            transition={{ duration: 2, delay: i * 0.4 + 0.5, repeat: Infinity }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <line x1="1.5" y1="1.5" x2="9.5" y2="9.5" stroke="#FF5C00" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="9.5" y1="1.5" x2="1.5" y2="9.5" stroke="#FF5C00" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </motion.div>
        );
      })}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <motion.div key={i}
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.cx}%`, top: `${n.cy}%` }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [0, -4, 0] }}
          transition={{
            opacity: { duration: 0.5, delay: i * 0.1 },
            y: { duration: 3.2 + i * 0.4, delay: i * 0.6 + 0.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="relative bg-[#FEFCF8] border border-[#E6E1DA] rounded-2xl px-4 py-2.5 shadow-[0_2px_14px_rgba(13,13,11,0.08),0_1px_3px_rgba(13,13,11,0.04)] whitespace-nowrap">
            <span className="font-mono text-[10px] font-medium tracking-[2px] text-[#3D3A35]">{n.label}</span>
            {n.hot && (
              <motion.div
                className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF5C00] rounded-full flex items-center justify-center text-white font-bold shadow-[0_0_8px_rgba(255,92,0,0.55)]"
                style={{ fontSize: "8px" }}
                animate={{ scale: [1, 1.32, 1] }}
                transition={{ duration: 1.8, delay: i * 0.5, repeat: Infinity }}
              >!</motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Visual 2 — "Chaos"
   8 nodes on a perfect circle. Conflicting directed arrows —
   most point to an overloaded centre, some misfire elsewhere.
───────────────────────────────────────────────────────────── */
function VisualChaos() {
  const W = 420, H = 290;
  const hcx = 210, hcy = 148, hr = 102;
  const labels = ["CRM", "EMAIL", "ADS", "SEO", "API", "DB", "UI", "ML"];

  const nodes = labels.map((label, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return { x: hcx + hr * Math.cos(a), y: hcy + hr * Math.sin(a), label };
  });

  // Some fire to centre (correct), some misfire to wrong node
  const connections = nodes.map((n, i) => {
    const misfire = i % 3 === 1;
    const target = misfire ? nodes[(i + 3) % 8] : { x: hcx, y: hcy };
    return { from: n, to: target, misfire };
  });

  return (
    <div className="relative w-full h-full">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${W} ${H}`} fill="none">
        {connections.map((c, i) => (
          <g key={i}>
            <motion.line
              x1={c.from.x} y1={c.from.y} x2={c.to.x} y2={c.to.y}
              stroke={c.misfire ? "#C8C3BB" : "#FF5C00"}
              strokeWidth={c.misfire ? "0.8" : "1.1"}
              strokeDasharray={c.misfire ? "4 4" : undefined}
              animate={{ opacity: c.misfire ? [0.18, 0.38, 0.18] : [0.4, 0.75, 0.4] }}
              transition={{ duration: 1.6 + i * 0.12, delay: i * 0.1, repeat: Infinity }}
            />
            {/* Packet dot */}
            <motion.circle r="2.8" fill={c.misfire ? "#C8C3BB" : "#FF5C00"}
              animate={{ cx: [c.from.x, c.to.x], cy: [c.from.y, c.to.y], opacity: [0, 1, 0] }}
              transition={{ duration: 1 + i * 0.07, delay: i * 0.15, repeat: Infinity, ease: "linear" }}
            />
          </g>
        ))}

        {/* Overloaded centre rings — fast, erratic */}
        {[46, 30, 16].map((r, i) => (
          <motion.circle key={i} cx={hcx} cy={hcy} r={r} fill="#FF5C00"
            animate={{ r: [r, r * 1.3, r], opacity: [0.06 + i * 0.04, 0.22 + i * 0.06, 0.06 + i * 0.04] }}
            transition={{ duration: 0.6 + i * 0.18, repeat: Infinity }}
          />
        ))}
        <circle cx={hcx} cy={hcy} r="8" fill="#FF5C00" opacity="0.75" />
      </svg>

      {nodes.map((n, i) => (
        <motion.div key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: i * 0.07, type: "spring", stiffness: 200 }}
        >
          <div className="w-12 h-12 rounded-full bg-[#FEFCF8] border border-[#E6E1DA] shadow-[0_2px_10px_rgba(13,13,11,0.07)] flex items-center justify-center">
            <span className="font-mono text-[7.5px] font-medium tracking-[1px] text-[#4A463F]">{n.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Visual 3 — "Ecosystem"
   CODA hub. Curved quadratic bezier spokes. Glowing data
   packets trace the exact curve using precomputed keyframes.
───────────────────────────────────────────────────────────── */
function VisualEcosystem() {
  const hcx = 210, hcy = 145, hr = 96;
  const labels = ["TECH", "GROW", "DATA", "SITE", "BRAND", "OPS"];
  const nodes = labels.map((label, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return { x: hcx + hr * Math.cos(a), y: hcy + hr * Math.sin(a), label };
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 290"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {/* Spokes */}
      {nodes.map((n, i) => (
        <line key={`s${i}`} x1={hcx} y1={hcy} x2={n.x} y2={n.y}
          stroke="#FF5C00" strokeWidth="1" opacity="0.3" />
      ))}

      {/* Hex ring */}
      {nodes.map((n, i) => {
        const nx = nodes[(i + 1) % 6];
        return <line key={`r${i}`} x1={n.x} y1={n.y} x2={nx.x} y2={nx.y}
          stroke="#C8C3BB" strokeWidth="0.7" strokeDasharray="3 5" opacity="0.5" />;
      })}

      {/* Hub */}
      <circle cx={hcx} cy={hcy} r="32" fill="#FF5C00" opacity="0.12" />
      <circle cx={hcx} cy={hcy} r="22" fill="#FF5C00" />
      <text x={hcx} y={hcy + 4} textAnchor="middle" fill="white"
        fontSize="8" fontFamily="monospace" fontWeight="700" letterSpacing="1">
        CODA
      </text>

      {/* Nodes */}
      {nodes.map((n, i) => (
        <g key={`n${i}`}>
          <circle cx={n.x} cy={n.y} r="22" fill="#FEFCF8" stroke="#FF5C00" strokeOpacity="0.3" strokeWidth="1" />
          <text x={n.x} y={n.y + 3.5} textAnchor="middle" fill="#1a1a18"
            fontSize="7" fontFamily="monospace" fontWeight="600" letterSpacing="1">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ── Section ───────────────────────────────────────────────── */
export default function DigitalGap() {
  // ── Desktop refs ──────────────────────────────────────────
  const desktopContainerRef = useRef<HTMLDivElement>(null);
  const textRef             = useRef<HTMLDivElement>(null);
  const visualsRef          = useRef<HTMLDivElement>(null);
  const progressRef         = useRef<HTMLDivElement>(null);

  // ── Mobile refs ───────────────────────────────────────────
  const mobileContainerRef  = useRef<HTMLDivElement>(null);
  const mobileTextRef       = useRef<HTMLDivElement>(null);
  const mobileVisualRef     = useRef<HTMLDivElement>(null);
  const mobileProgressRef   = useRef<HTMLDivElement>(null);

  // ── Desktop GSAP (md+) ────────────────────────────────────
  useEffect(() => {
    if (window.innerWidth < 768) return;
    const ctx = gsap.context(() => {
      if (!desktopContainerRef.current || !textRef.current || !visualsRef.current) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: desktopContainerRef.current,
          start: "top top", end: "+=150%",
          pin: true, pinSpacing: true,
          pinType: "transform", scrub: 1.2,
          anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current)
              progressRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      const texts   = textRef.current.children;
      const visuals = visualsRef.current.children;
      gsap.set([...Array.from(texts), ...Array.from(visuals)], { willChange: "transform, opacity", transform: "translateZ(0)" });
      gsap.set(texts,      { opacity: 0.15, y: 0 });
      gsap.set(visuals,    { opacity: 0, y: 40, scale: 0.95 });
      gsap.set(visuals[0], { opacity: 1, y: 0, scale: 1 });
      gsap.set(texts[0],   { opacity: 1 });
      tl
        .to(texts[0],   { opacity: 0.15, duration: 1 })
        .to(visuals[0], { opacity: 0, y: -40, scale: 0.95, duration: 1 }, "<")
        .to(texts[1],   { opacity: 1, y: 0, duration: 1 }, "<")
        .to(visuals[1], { opacity: 1, y: 0, scale: 1, duration: 1 }, "<")
        .to(texts[1],   { opacity: 0.15, duration: 1 })
        .to(visuals[1], { opacity: 0, y: -40, scale: 0.95, duration: 1 }, "<")
        .to(texts[2],   { opacity: 1, y: 0, duration: 1 }, "<")
        .to(visuals[2], { opacity: 1, y: 0, scale: 1, duration: 1 }, "<");
      gsap.delayedCall(0.15, () => ScrollTrigger.refresh());
    }, desktopContainerRef);
    return () => ctx.revert();
  }, []);

  // ── Mobile GSAP (<md) ─────────────────────────────────────
  useEffect(() => {
    if (window.innerWidth >= 768) return;
    if (!mobileContainerRef.current || !mobileTextRef.current || !mobileVisualRef.current) return;

    const texts   = Array.from(mobileTextRef.current.children) as HTMLElement[];
    const visuals = Array.from(mobileVisualRef.current.children) as HTMLElement[];

    // Hard-set initial states — never clearProps (would flash all visible)
    gsap.set(texts[0],          { opacity: 1 });
    gsap.set(texts.slice(1),    { opacity: 0 });
    gsap.set(visuals[0],        { opacity: 1 });
    gsap.set(visuals.slice(1),  { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mobileContainerRef.current,
        start: "top top",
        end: "+=150%",
        pin: true,
        pinSpacing: true,
        // NO pinType:"transform" on mobile — Lenis is disabled on touch devices,
        // so native scroll drives ScrollTrigger. pinType:"transform" fights the
        // browser's off-thread scroll and causes jitter. Default (fixed) is correct.
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (mobileProgressRef.current)
            mobileProgressRef.current.style.transform = `scaleX(${self.progress})`;
        },
      },
    });

    tl
      .to(texts[0],   { opacity: 0, duration: 1 })
      .to(visuals[0], { opacity: 0, duration: 1 }, "<")
      .to(texts[1],   { opacity: 1, duration: 1 }, "<")
      .to(visuals[1], { opacity: 1, duration: 1 }, "<")
      .to(texts[1],   { opacity: 0, duration: 1 })
      .to(visuals[1], { opacity: 0, duration: 1 }, "<")
      .to(texts[2],   { opacity: 1, duration: 1 }, "<")
      .to(visuals[2], { opacity: 1, duration: 1 }, "<");

    gsap.delayedCall(0.15, () => ScrollTrigger.refresh());

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === mobileContainerRef.current) st.kill();
      });
      tl.kill();
    };
  }, []);

  const BG = (
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: "linear-gradient(to right,#E6E1DA 1px,transparent 1px),linear-gradient(to bottom,#E6E1DA 1px,transparent 1px)",
      backgroundSize: "40px 40px",
    }} />
  );

  const VISUALS = [<VisualFragility key="frag" />, <VisualChaos key="chaos" />, <VisualEcosystem key="eco" />];
  const TEXTS = [
    { pre: "Most businesses are", em: "digitally fragile." },
    { pre: "Disconnected tools create", em: "chaos." },
    { pre: "We engineer", em: "ecosystems." },
  ];

  return (<>
    {/* ═══════════════════════════════════════════════════
        DESKTOP  (md+)  — original side-by-side animation
    ═══════════════════════════════════════════════════ */}
    <section
      ref={desktopContainerRef}
      className="hidden md:block h-screen bg-[#F4F0E8] text-[#0D0D0B] overflow-hidden border-b border-[#E6E1DA] relative"
    >
      {BG}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#E6E1DA] z-10 overflow-hidden">
        <div ref={progressRef} className="absolute inset-0 bg-[#FF5C00] origin-left" style={{ transform: "scaleX(0)" }} />
      </div>
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <SectionLabel index={1} className="mb-12 inline-flex w-fit px-3 py-1.5 rounded-full"
          style={{ background: "rgba(244,240,232,0.92)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(13,13,11,0.12)", color: "#3D3A35" }}
        >The Digital Gap</SectionLabel>
        <div className="grid grid-cols-2 gap-20 items-center">
          <div ref={textRef} className="space-y-10">
            {TEXTS.map(({ pre, em }, i) => (
              <h2 key={i} className="font-instrument leading-[1.1] tracking-[-0.03em]"
                style={{ fontSize: "clamp(30px, 4vw, 54px)" }}>
                {pre}{" "}<span className="italic text-[#FF5C00]">{em}</span>
              </h2>
            ))}
          </div>
          <div ref={visualsRef} className="relative h-[360px] w-full">
            {VISUALS.map((v, i) => (
              <div key={i} className="absolute inset-0 rounded-2xl border border-[#E6E1DA] bg-white shadow-[0_0_40px_8px_rgba(255,92,0,0.09),0_4px_40px_rgba(0,0,0,0.05)] overflow-hidden p-6">
                {v}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <span className="font-mono text-[11px] text-[#0D0D0B]/55 uppercase tracking-[0.3em]">Scroll to explore</span>
      </div>
    </section>

    {/* ═══════════════════════════════════════════════════
        MOBILE  (<md)  — same scrub animation, stacked
    ═══════════════════════════════════════════════════ */}
    <section
      ref={mobileContainerRef}
      className="md:hidden h-screen bg-[#F4F0E8] text-[#0D0D0B] overflow-hidden border-b border-[#E6E1DA] relative"
    >
      {BG}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#E6E1DA] z-10 overflow-hidden">
        <div ref={mobileProgressRef} className="absolute inset-0 bg-[#FF5C00] origin-left" style={{ transform: "scaleX(0)" }} />
      </div>
      <div className="relative z-10 h-full max-w-7xl mx-auto px-5 flex flex-col justify-center pt-10 pb-16 gap-6">
        <SectionLabel index={1} className="inline-flex w-fit px-3 py-1.5 rounded-full shrink-0"
          style={{ background: "rgba(244,240,232,0.92)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(13,13,11,0.12)", color: "#3D3A35" }}
        >The Digital Gap</SectionLabel>

        {/* Texts — overlapping, hidden by default, GSAP shows one at a time */}
        <div ref={mobileTextRef} className="relative shrink-0" style={{ height: 110 }}>
          {TEXTS.map(({ pre, em }, i) => (
            <h2 key={i} className="absolute inset-x-0 top-0 font-instrument leading-[1.15] tracking-[-0.03em]"
              style={{ fontSize: "clamp(32px, 9vw, 44px)", opacity: i === 0 ? 1 : 0 }}>
              {pre}{" "}<span className="italic text-[#FF5C00]">{em}</span>
            </h2>
          ))}
        </div>

        {/* Visuals — fixed height matching desktop aspect ratio */}
        <div ref={mobileVisualRef} className="relative w-full" style={{ height: 260 }}>
          {VISUALS.map((v, i) => (
            <div key={i} className="absolute inset-0 rounded-2xl border border-[#E6E1DA] bg-white shadow-[0_0_40px_8px_rgba(255,92,0,0.09),0_4px_40px_rgba(0,0,0,0.05)] overflow-hidden p-6"
              style={{ opacity: i === 0 ? 1 : 0 }}>
              {v}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <span className="font-mono text-[10px] text-[#0D0D0B]/55 uppercase tracking-[0.3em]">Scroll to explore</span>
      </div>
    </section>
  </>);
}
