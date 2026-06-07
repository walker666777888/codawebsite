"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   MOTION GRAPHICS — one per discipline
═══════════════════════════════════════════════════════════ */

/** Technology — premium network topology */
function TechGraphic({ active }: { active: boolean }) {
  const W = 420, H = 220;
  const CX = 210, CY = 110;
  // Elliptical layout so nodes fill the wide container
  const RX = 168, RY = 82;

  const outerNodes = [
    { angle: -90,  label: "UI"   },
    { angle: -30,  label: "API"  },
    { angle:  30,  label: "DB"   },
    { angle:  90,  label: "AI"   },
    { angle:  150, label: "CDN"  },
    { angle: -150, label: "AUTH" },
  ].map((n, i) => ({
    ...n,
    x: Math.round(CX + RX * Math.cos((n.angle * Math.PI) / 180)),
    y: Math.round(CY + RY * Math.sin((n.angle * Math.PI) / 180)),
    delay: i * 0.09,
  }));

  // Spoke + ring connections
  const connections = [
    ...outerNodes.map((n, i) => ({ x1: CX, y1: CY, x2: n.x, y2: n.y, cross: false, i })),
    // Two cross chords for web feel
    { x1: outerNodes[0].x, y1: outerNodes[0].y, x2: outerNodes[3].x, y2: outerNodes[3].y, cross: true, i: 6 },
    { x1: outerNodes[1].x, y1: outerNodes[1].y, x2: outerNodes[4].x, y2: outerNodes[4].y, cross: true, i: 7 },
    { x1: outerNodes[2].x, y1: outerNodes[2].y, x2: outerNodes[5].x, y2: outerNodes[5].y, cross: true, i: 8 },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="tg-hub" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </radialGradient>
        <filter id="tg-hub-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="tg-node-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Faint dot grid */}
      {[0,1,2,3,4].map(i => [0,1,2,3].map(j => (
        <circle key={`d${i}${j}`} cx={i * 75} cy={j * 88} r="1.2"
          fill="rgba(96,165,250,0.12)" />
      )))}

      {/* Rotating dashed orbit ellipse */}
      <motion.ellipse cx={CX} cy={CY} rx={RX} ry={RY}
        stroke="rgba(96,165,250,0.18)" strokeWidth="1" strokeDasharray="5 9" fill="none"
        animate={active ? { rotate: 360 } : {}}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      {/* Counter-rotating inner ring */}
      <motion.ellipse cx={CX} cy={CY} rx={RX * 0.5} ry={RY * 0.5}
        stroke="rgba(96,165,250,0.1)" strokeWidth="1" strokeDasharray="3 7" fill="none"
        animate={active ? { rotate: -360 } : {}}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />

      {/* Connection lines + animated flow dots */}
      {connections.map((c, i) => (
        <g key={i}>
          <motion.line
            x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
            stroke={c.cross ? "rgba(96,165,250,0.1)" : "rgba(96,165,250,0.25)"}
            strokeWidth={c.cross ? "0.8" : "1.2"}
            strokeDasharray={c.cross ? "3 6" : undefined}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.25 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          />
          {!c.cross && active && (
            <motion.circle r="2.8" fill="#60A5FA"
              animate={{ cx: [c.x1, c.x2, c.x1], cy: [c.y1, c.y2, c.y1], opacity: [0, 0.9, 0] }}
              transition={{ duration: 2.2, delay: 1 + i * 0.38, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
            />
          )}
        </g>
      ))}

      {/* Hub pulse rings */}
      {active && [38, 28, 18].map((r, i) => (
        <motion.circle key={i} cx={CX} cy={CY} r={r}
          fill="rgba(59,130,246,0.06)" stroke="rgba(96,165,250,0.22)" strokeWidth="1"
          animate={{ r: [r, r * 1.55, r], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.8 + i * 0.4, delay: i * 0.7, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* Hub core */}
      <motion.circle cx={CX} cy={CY} r="24"
        fill="url(#tg-hub)" filter="url(#tg-hub-glow)"
        initial={{ scale: 0, opacity: 0 }}
        animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      />
      <motion.text x={CX} y={CY + 4} textAnchor="middle"
        fill="white" fontSize="9.5" fontFamily="monospace" fontWeight="700" letterSpacing="1"
        initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >CORE</motion.text>

      {/* Outer nodes */}
      {outerNodes.map((n, i) => (
        <g key={i}>
          {active && (
            <motion.circle cx={n.x} cy={n.y} r="14"
              fill="none" stroke="rgba(96,165,250,0.35)" strokeWidth="1"
              animate={{ r: [14, 26, 14], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3.5, delay: i * 0.55, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <motion.circle cx={n.x} cy={n.y} r="16"
            fill="rgba(255,255,255,0.92)" stroke="rgba(96,165,250,0.45)" strokeWidth="1.5"
            filter="url(#tg-node-glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={active ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            transition={{ duration: 0.55, delay: 0.15 + n.delay, ease: [0.34, 1.56, 0.64, 1] }}
          />
          <motion.text x={n.x} y={n.y + 4} textAnchor="middle"
            fill="rgba(37,99,235,0.85)" fontSize="8" fontFamily="monospace" fontWeight="700"
            letterSpacing="0.5"
            initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.5 + n.delay }}
          >{n.label}</motion.text>
        </g>
      ))}
    </svg>
  );
}

/** Design — morphing colour blocks filling the full wide container */
function DesignGraphic({ active }: { active: boolean }) {
  const VW = 420, VH = 220;
  // 4 blocks spread across full width
  const BW = 84, BH = 76, GAP = 16;
  const startX = (VW - 4 * BW - 3 * GAP) / 2; // ~18px margin each side
  const xs = [0, 1, 2, 3].map(i => Math.round(startX + i * (BW + GAP)));

  const colorSeqs = [
    ["#FF5C00", "#F43F5E", "#6366F1", "#F59E0B", "#FF5C00"],
    ["#4F8EF7", "#8B5CF6", "#EF4444", "#06B6D4", "#4F8EF7"],
    ["#B87FFF", "#EC4899", "#84CC16", "#A855F7", "#B87FFF"],
    ["#5FCF5F", "#14B8A6", "#F97316", "#10B981", "#5FCF5F"],
  ];
  const rxSeqs = [
    [8, 38, 8, 18, 42, 8],
    [8, 18, 42, 8, 26, 8],
    [42, 8, 26, 42, 8, 18],
    [8, 42, 8, 10, 38, 8],
  ];
  const wSeqs = [
    [BW, BW - 12, BW, BW + 10, BW],
    [BW, BW + 12, BW, BW - 10, BW],
    [BW, BW, BW - 10, BW, BW + 14],
    [BW, BW - 14, BW + 10, BW, BW - 8],
  ];
  const labels = ["Brand", "Tech", "UI", "Data"];

  const wireRows = [
    { y: 152, w: VW - 36, h: 12, opacity: 0.07 },
    { y: 169, w: VW - 80, h: 10, opacity: 0.05 },
    { y: 184, w: VW - 50, h: 10, opacity: 0.05 },
    { y: 199, w: VW - 120, h: 10, opacity: 0.04 },
  ];
  const swatchColors = ["#FF5C00", "#4F8EF7", "#B87FFF", "#5FCF5F", "#F59E0B"];

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">

      {/* Morphing colour blocks — full width */}
      {labels.map((label, i) => (
        <g key={i}>
          <motion.rect
            x={xs[i]} y={12} height={BH}
            initial={{ width: 0, opacity: 0, rx: 8 }}
            animate={active ? {
              width: wSeqs[i],
              fill: colorSeqs[i],
              rx: rxSeqs[i],
              opacity: 0.9,
            } : { width: 0, opacity: 0 }}
            transition={{
              width:   { duration: 5,  times: [0,.25,.5,.75,1], repeat: Infinity, ease: "easeInOut", delay: i * 0.35 },
              fill:    { duration: 9,  times: [0,.25,.5,.75,1], repeat: Infinity, ease: "easeInOut", delay: i * 0.55 },
              rx:      { duration: 6,  times: [0,.2,.4,.6,.8,1], repeat: Infinity, ease: "easeInOut", delay: i * 0.28 },
              opacity: { duration: 0.45, delay: i * 0.07 },
            }}
          />
          <motion.text
            x={xs[i] + BW / 2} y={12 + BH / 2 + 4}
            textAnchor="middle" fill="rgba(255,255,255,0.95)"
            fontSize="9" fontFamily="monospace" fontWeight="600"
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
          >{label}</motion.text>
        </g>
      ))}

      {/* Component / Token row */}
      {[
        { x: startX, w: (VW / 2) - startX - 6, label: "Component" },
        { x: VW / 2 + 6, w: VW - startX - (VW / 2 + 6), label: "Token" },
      ].map((b, i) => (
        <g key={i}>
          <motion.rect x={b.x} y={100} height={38} rx={7}
            fill="rgba(13,13,11,0.06)"
            initial={{ width: 0, opacity: 0 }}
            animate={active ? { width: b.w, opacity: 1 } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.65, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.text x={b.x + 14} y={100 + 24}
            fill="rgba(13,13,11,0.4)" fontSize="9" fontFamily="monospace"
            initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
          >{b.label}</motion.text>
        </g>
      ))}

      {/* Wireframe rows — full width */}
      {wireRows.map((r, i) => (
        <motion.rect key={i} x={startX} y={r.y} height={r.h} rx={4}
          fill="rgba(13,13,11,0.6)"
          initial={{ width: 0, opacity: 0 }}
          animate={active ? { width: r.w, opacity: r.opacity } : { width: 0, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.45 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}

      {/* CTA button */}
      <motion.rect x={startX} y={VH - 20} width={120} height={18} rx={9}
        fill="rgba(255,92,0,0.75)"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={active ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        style={{ transformOrigin: `${startX + 60}px ${VH - 11}px` }}
        transition={{ duration: 0.45, delay: 0.85, ease: [0.34, 1.56, 0.64, 1] }}
      />
      <motion.text x={startX + 60} y={VH - 8} textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace"
        initial={{ opacity: 0 }} animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.05 }}
      >Get started →</motion.text>

      {/* Swatch strip */}
      {swatchColors.map((c, i) => {
        const sw = 32, sg = 8;
        const swStartX = startX + 132;
        return (
          <motion.rect key={i} x={swStartX + i * (sw + sg)} y={VH - 20} width={sw} height={18}
            initial={{ rx: 5, opacity: 0, y: VH - 12 }}
            animate={active ? {
              fill: [c, swatchColors[(i + 2) % 5], swatchColors[(i + 4) % 5], c],
              rx: [5, 16, 5, 12, 5],
              opacity: 0.88,
              y: VH - 20,
            } : { opacity: 0, y: VH - 12 }}
            transition={{
              fill:    { duration: 7, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
              rx:      { duration: 4.5, times: [0,.25,.5,.75,1], repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
              opacity: { duration: 0.4, delay: 0.9 + i * 0.07 },
              y:       { duration: 0.4, delay: 0.9 + i * 0.07, ease: [0.16, 1, 0.3, 1] },
            }}
          />
        );
      })}
    </svg>
  );
}

/** Digital Strategy — roadmap phase tracker */
function StrategyGraphic({ active }: { active: boolean }) {
  const AMBER  = "#F59E0B";
  const CYCLE  = 3.8;
  const REPEAT = 1.2;

  const kpis = [
    { label: "Clarity",  value: "97%" },
    { label: "Fit Score", value: "92" },
    { label: "Velocity", value: "↑84" },
  ];

  const phases = [
    { label: "Discovery",  pct: 1.0,  done: true,  active: false, delay: 0    },
    { label: "Strategy",   pct: 1.0,  done: true,  active: false, delay: 0.12 },
    { label: "Activation", pct: 0.65, done: false, active: true,  delay: 0.24 },
    { label: "Scale",      pct: 0.18, done: false, active: false, delay: 0.36 },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-[5px] px-1 justify-center">

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-1">
        {kpis.map((k, i) => (
          <motion.div key={k.label}
            style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: "7px", padding: "3px 4px", textAlign: "center" }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ fontFamily: "monospace", fontSize: "6.5px", color: "rgba(13,13,11,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1px" }}>{k.label}</div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: AMBER }}>{k.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Phase rows */}
      <div className="flex flex-col gap-[4px]">
        {phases.map((p, i) => (
          <motion.div key={i}
            className="flex items-center gap-2"
            style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(245,158,11,0.14)", borderRadius: "7px", padding: "4px 7px" }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.5, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}>

            {/* Status dot */}
            <div style={{
              width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
              background: p.done ? AMBER : "transparent",
              border: p.done ? "none" : p.active ? `1.5px solid ${AMBER}` : "1.5px solid rgba(245,158,11,0.3)",
              boxShadow: p.active ? `0 0 5px rgba(245,158,11,0.5)` : "none",
            }} />

            {/* Label */}
            <span style={{ fontFamily: "sans-serif", fontSize: "9px", fontWeight: p.active ? 700 : 500, color: p.done || p.active ? "#14130F" : "rgba(13,13,11,0.4)", minWidth: "58px", flexShrink: 0 }}>{p.label}</span>

            {/* Progress bar */}
            <div style={{ flex: 1, height: "3px", background: "rgba(245,158,11,0.12)", borderRadius: "99px", overflow: "hidden" }}>
              <motion.div style={{ height: "100%", borderRadius: "99px", transformOrigin: "left", background: `linear-gradient(90deg,${AMBER},#FCD34D)` }}
                animate={active ? { scaleX: [0, p.pct, p.pct, 0] } : { scaleX: 0 }}
                transition={{ duration: CYCLE, times: [0, 0.25, 0.75, 0.97], delay: p.delay + 0.28, repeat: Infinity, repeatDelay: REPEAT, ease: [0.16, 1, 0.3, 1] }} />
            </div>

            {/* Status label */}
            <span style={{ fontFamily: "monospace", fontSize: "8px", fontWeight: 600, color: p.done ? AMBER : "rgba(13,13,11,0.3)", flexShrink: 0, minWidth: "22px", textAlign: "right" }}>
              {p.done ? "✓" : `${Math.round(p.pct * 100)}%`}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LANDSCAPE TILE GRAPHICS
═══════════════════════════════════════════════════════════ */

function EcommerceGraphic({ active }: { active: boolean }) {
  const ORANGE = "#FF5C00";
  const CYCLE  = 3.2;
  const REPEAT = 1.4;
  const products = [
    { label: "Wireless Earbuds Pro", rank: "#1", old: "#4",  delay: 0    },
    { label: "Minimal Desk Lamp",    rank: "#2", old: "#7",  delay: 0.14 },
    { label: "Leather Wallet Slim",  rank: "#3", old: "#11", delay: 0.28 },
  ];
  return (
    <div className="w-full h-full flex flex-col justify-center gap-[6px] px-1">
      {/* Header — static once active */}
      <div className="flex items-center justify-between">
        <span style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(13,13,11,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Marketplace Rankings</span>
        <motion.span style={{ fontFamily: "monospace", fontSize: "8px", color: ORANGE, letterSpacing: "0.1em" }}
          animate={active ? { opacity: [0.4, 1, 0.4] } : { opacity: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>● LIVE</motion.span>
      </div>

      {products.map((p, i) => (
        /* Card appears once and stays */
        <motion.div key={i} className="flex items-center gap-3"
          style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,92,0,0.14)", borderRadius: "10px", padding: "5px 10px" }}
          animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
          transition={{ duration: 0.55, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
        >
          <span style={{ fontFamily: "monospace", fontSize: "10px", fontWeight: 700, color: ORANGE, minWidth: "28px", textAlign: "center" }}>{p.rank}</span>
          <div className="flex-1 min-w-0">
            <div style={{ fontFamily: "sans-serif", fontSize: "10px", fontWeight: 600, color: "#14130F", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.label}</div>
            {/* Only the bar fill loops */}
            <div style={{ height: "3px", background: "rgba(255,92,0,0.12)", borderRadius: "99px", overflow: "hidden" }}>
              <motion.div style={{ height: "100%", borderRadius: "99px", background: `linear-gradient(90deg,${ORANGE},#FF9A3C)`, transformOrigin: "left" }}
                animate={active ? { scaleX: [0, 1, 1, 0] } : { scaleX: 0 }}
                transition={{ duration: CYCLE, times: [0, 0.28, 0.75, 0.97], delay: p.delay + 0.3, repeat: Infinity, repeatDelay: REPEAT, ease: [0.16, 1, 0.3, 1] }} />
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span style={{ color: "#22C55E", fontSize: "9px", fontWeight: 700 }}>↑</span>
            <span style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(13,13,11,0.35)", textDecoration: "line-through" }}>{p.old}</span>
          </div>
        </motion.div>
      ))}

      <div className="flex items-center justify-between pt-1.5" style={{ borderTop: "1px solid rgba(255,92,0,0.12)" }}>
        <span style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(13,13,11,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Avg. CVR lift</span>
        <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: ORANGE }}>+34%</span>
      </div>
    </div>
  );
}

function PerformanceGraphic({ active }: { active: boolean }) {
  const ORANGE = "#FF5C00";
  const CYCLE  = 3.5;
  const REPEAT = 1.2;
  const stages = [
    { label: "Awareness",     value: "12,400", color: "rgba(255,92,0,0.22)", scaleX: 1.0,  delay: 0    },
    { label: "Interest",      value: "6,820",  color: "rgba(255,92,0,0.32)", scaleX: 0.76, delay: 0.12 },
    { label: "Consideration", value: "3,110",  color: "rgba(255,92,0,0.44)", scaleX: 0.56, delay: 0.24 },
    { label: "Conversion",    value: "1,240",  color: ORANGE,                scaleX: 0.36, delay: 0.36 },
  ];
  const kpis = [
    { label: "ROAS", value: "4.2×"  },
    { label: "CPL",  value: "↓38%" },
    { label: "ROI",  value: "+210%"},
  ];
  return (
    <div className="w-full h-full flex flex-col justify-center gap-2 px-1">
      {/* KPI cards — appear once and stay */}
      <div className="grid grid-cols-3 gap-2 mb-1">
        {kpis.map((k, i) => (
          <motion.div key={k.label}
            style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,92,0,0.18)", borderRadius: "8px", padding: "6px 8px", textAlign: "center" }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(13,13,11,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px" }}>{k.label}</div>
            <div style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: ORANGE }}>{k.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Label — static */}
      <div style={{ fontFamily: "monospace", fontSize: "8px", color: "rgba(13,13,11,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "2px" }}>Conversion Funnel</div>

      {/* Funnel rows — labels static, only bar fills loop */}
      <div className="flex flex-col gap-1.5">
        {stages.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div style={{ fontFamily: "monospace", fontSize: "7.5px", color: "rgba(13,13,11,0.45)", width: "68px", flexShrink: 0 }}>{s.label}</div>
            <div style={{ flex: 1, height: "18px", background: "rgba(255,92,0,0.06)", borderRadius: "6px", overflow: "hidden" }}>
              <motion.div style={{ height: "100%", width: `${s.scaleX * 100}%`, borderRadius: "6px", background: s.color, display: "flex", alignItems: "center", paddingLeft: "6px", transformOrigin: "left" }}
                animate={active ? { scaleX: [0, 1, 1, 0] } : { scaleX: 0 }}
                transition={{ duration: CYCLE, times: [0, 0.25, 0.75, 0.97], delay: s.delay + 0.2, repeat: Infinity, repeatDelay: REPEAT, ease: [0.16, 1, 0.3, 1] }}>
                <motion.span style={{ fontFamily: "monospace", fontSize: "8px", fontWeight: 700, color: i === 3 ? "#fff" : "#14130F", whiteSpace: "nowrap" }}
                  animate={active ? { opacity: [0, 0, 1, 1, 0] } : { opacity: 0 }}
                  transition={{ duration: CYCLE, times: [0, 0.28, 0.38, 0.75, 0.96], delay: s.delay + 0.2, repeat: Infinity, repeatDelay: REPEAT }}>
                  {s.value}
                </motion.span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const LANDSCAPE_TILES = [
  {
    num: "04",
    title: "Ecommerce Growth",
    subtitle: "& Management",
    tagline: "We optimize ecommerce for performance, not just presence.",
    capabilities: [
      "Product Listing Optimization",
      "Keyword Research & Marketplace SEO",
      "Catalog & Inventory Structuring",
      "Conversion Rate Optimization",
    ],
    tags: ["Amazon", "Shopify", "Flipkart", "CRO"],
    Graphic: EcommerceGraphic,
  },
  {
    num: "05",
    title: "Performance &",
    subtitle: "Growth Systems",
    tagline: "Built for performance, optimized for scale, driven by measurable ROI.",
    capabilities: [
      "Marketing Consultancy & Strategy",
      "Performance Marketing",
      "Lead Generation & Funnel Design",
      "SEO & Organic Growth",
      "Marketing Automation & Social Media",
    ],
    tags: ["Meta Ads", "Google Ads", "SEO", "Funnels"],
    Graphic: PerformanceGraphic,
  },
] as const;

function LandscapeTile({ tile, index }: { tile: typeof LANDSCAPE_TILES[number]; index: number }) {
  const ORANGE      = "#FF5C00";
  const ORANGE_SOFT = "rgba(255,92,0,0.25)";
  const ORANGE_DIM  = "rgba(255,92,0,0.08)";

  const cardRef  = useRef<HTMLDivElement>(null);
  const rectRef  = useRef<DOMRect | null>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const springRotX = useSpring(rotX, { stiffness: 140, damping: 28 });
  const springRotY = useSpring(rotY, { stiffness: 140, damping: 28 });

  const onMouseEnter = () => { rectRef.current = cardRef.current?.getBoundingClientRect() ?? null; setHovered(true); };
  const onMouseMove  = (e: React.MouseEvent) => {
    const r = rectRef.current; if (!r) return;
    const cx = (e.clientX - r.left) / r.width;
    const cy = (e.clientY - r.top)  / r.height;
    rotX.set(-(cy - 0.5) * 8); rotY.set((cx - 0.5) * 8);
    glowX.set(cx * 100); glowY.set(cy * 100);
  };
  const onMouseLeave = () => { rotX.set(0); rotY.set(0); glowX.set(50); glowY.set(50); setHovered(false); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseEnter={onMouseEnter} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
        style={{
          rotateX: springRotX, rotateY: springRotY, transformStyle: "preserve-3d",
          background: "linear-gradient(160deg,#FFFFFF 0%,#FFFCF9 60%,#FFF8F4 100%)",
          border: `1px solid ${ORANGE_SOFT}`,
          boxShadow: `0 1px 0 rgba(255,255,255,1) inset,0 12px 40px -12px rgba(255,92,0,0.18),0 4px 16px -4px rgba(43,33,20,0.10),0 1px 3px rgba(43,33,20,0.06)`,
        }}
        className="group/card relative rounded-[28px] overflow-hidden cursor-default transition-shadow duration-500 h-full"
      >
        <div className="absolute top-0 inset-x-0 h-[2.5px] z-10"
          style={{ background: `linear-gradient(90deg,transparent 0%,${ORANGE} 30%,${ORANGE} 70%,transparent 100%)` }} />
        <motion.div className="absolute inset-0 pointer-events-none z-[2] rounded-[28px]"
          style={{ opacity: hovered ? 1 : 0, background: `radial-gradient(circle at ${glowX}% ${glowY}%,rgba(255,92,0,0.08) 0%,transparent 60%)`, transition: "opacity 0.5s ease" }} />
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-[60px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(255,92,0,0.22),transparent 70%)" }} />

        <div className="relative z-[10] p-5 xl:p-6 grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-5 h-full items-stretch" style={{ transform: "translateZ(18px)" }}>
          {/* LEFT */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-[0.25em] text-[#9A9488]">{tile.num}</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                style={{ color: ORANGE, border: `1px solid ${ORANGE_SOFT}`, background: ORANGE_DIM }}>{tile.tags[0]}</span>
            </div>
            <h3 className="font-instrument tracking-[-0.03em] leading-[1.04] text-[#14130F]" style={{ fontSize: "clamp(24px,1.9vw,36px)" }}>
              {tile.title}<br /><span className="italic" style={{ color: ORANGE }}>{tile.subtitle}</span>
            </h3>
            <p className="font-sans text-[12.5px] text-[#4A463F] leading-[1.65]">{tile.tagline}</p>
            <div className="space-y-1.5">
              {tile.capabilities.map((cap, ci) => (
                <motion.div key={cap} className="flex items-center gap-2.5"
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                  transition={{ duration: 0.5, delay: 0.3 + ci * 0.07, ease: [0.16, 1, 0.3, 1] }}>
                  <motion.span className="w-3 h-[1.5px] shrink-0 rounded-full" style={{ background: ORANGE }}
                    initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 + ci * 0.07 }} />
                  <span className="font-sans text-[12px] text-[#4A463F]">{cap}</span>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-auto pt-1">
              {tile.tags.map((tag, ti) => (
                <motion.span key={tag}
                  className="font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] rounded-full px-3.5 py-1.5"
                  style={{ color: ORANGE, border: "1.5px solid rgba(255,92,0,0.45)", background: ORANGE_DIM }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: 0.6 + ti * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.06, borderColor: "rgba(255,92,0,0.7)" }}>{tag}</motion.span>
              ))}
            </div>
          </div>

          {/* RIGHT — graphic */}
          <div className="relative rounded-2xl overflow-hidden flex items-center justify-center p-4 h-full min-h-[200px]"
            style={{ border: `1px solid ${ORANGE_SOFT}`, background: ORANGE_DIM }}>
            {([[8,8],[8,"auto"],["auto",8],["auto","auto"]] as const).map(([t,l], i) => (
              <motion.div key={i} className="absolute w-1 h-1 rounded-full"
                style={{ top: typeof t==="number"?t:undefined, bottom: typeof t==="string"?8:undefined, left: typeof l==="number"?l:undefined, right: typeof l==="string"?8:undefined, background: "rgba(255,92,0,0.35)" }}
                initial={{ opacity: 0, scale: 0 }} animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.06, ease: [0.34, 1.56, 0.64, 1] }} />
            ))}
            <div className="w-full h-full"><tile.Graphic active={isInView} /></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DISCIPLINE DATA
═══════════════════════════════════════════════════════════ */

const DISCIPLINES = [
  {
    num: "01",
    title: "Design &",
    subtitle: "Brand Systems",
    description:
      "Cohesive visual identities and UI/UX systems that command attention, drive conversion, and express a brand with precision.",
    capabilities: [
      "Visual identity & brand",
      "UI/UX system design",
      "Motion & interaction",
      "Design token systems",
    ],
    tags: ["Figma", "Framer", "Motion", "Identity", "Systems"],
    Graphic: DesignGraphic,
    accentColor: "#FF5C00",
    accentRgb: "255,92,0",
    borderColor: "rgba(255,92,0,0.15)",
  },
  {
    num: "02",
    title: "Technology",
    subtitle: "Solutions",
    description:
      "High-performance architectures, AI-native platforms, and production-grade web applications built for scale and longevity.",
    capabilities: [
      "Full-stack development",
      "AI & LLM integrations",
      "API design & backends",
      "Performance architecture",
    ],
    tags: ["React", "Next.js", "Node.js", "TypeScript", "AI / ML"],
    Graphic: TechGraphic,
    accentColor: "#4F8EF7",
    accentRgb: "96,165,250",
    borderColor: "rgba(96,165,250,0.15)",
  },
  {
    num: "03",
    title: "Digital",
    subtitle: "Strategy",
    description:
      "Clarity before execution. We map your market, architect your positioning, and build a compounding roadmap before a single pixel is designed.",
    capabilities: [
      "Market research & positioning",
      "Digital ecosystem architecture",
      "Go-to-market planning",
      "Systems audit & roadmapping",
    ],
    tags: ["Strategy", "Consulting", "Roadmap", "GTM", "Systems"],
    Graphic: StrategyGraphic,
    accentColor: "#F59E0B",
    accentRgb: "245,158,11",
    borderColor: "rgba(245,158,11,0.15)",
  },
] as const;

/* ═══════════════════════════════════════════════════════════
   DISCIPLINE STRIP
═══════════════════════════════════════════════════════════ */

function DisciplineStrip({
  d,
  index,
}: {
  d: (typeof DISCIPLINES)[number];
  index: number;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stripRef, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  // Mouse-track for hover glow (position only, no spring needed)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = stripRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set((e.clientX - r.left) / r.width);
    mouseY.set((e.clientY - r.top) / r.height);
  };


  /* ── Replaced useScroll+useSpring chains with a simple intersection-triggered
     animation. Each strip had 2 useScroll + 4 useSpring hooks = 6 scroll
     event listeners firing during scroll. With 3 strips that's 18 listeners
     constantly updating. Now it's 0 — all handled by CSS on the compositor. */

  return (
    <motion.div
      ref={stripRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group/strip relative rounded-[28px] overflow-hidden border border-[var(--coda-hairline)] elevation-md transition-shadow duration-500 hover:[box-shadow:var(--shadow-lg)]"
      style={
        prefersReduced
          ? { background: "linear-gradient(180deg, var(--coda-surface-2) 0%, var(--coda-surface) 100%)" }
          : {
              background: "linear-gradient(180deg, var(--coda-surface-2) 0%, var(--coda-surface) 100%)",
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateY(0px) scale(1)" : "translateY(60px) scale(0.97)",
              transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }
      }
    >

      {/* Hover background tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 100% at 50% 50%, rgba(${d.accentRgb},0.04) 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{
          background: `linear-gradient(to bottom, transparent, ${d.accentColor}, transparent)`,
          opacity: isInView ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] lg:grid-cols-[80px_1fr_420px] gap-0 min-h-[300px]">

        {/* ── Number column ── */}
        <div className="flex items-start justify-center pt-10 md:pt-14 border-r border-[#0D0D0B]/[0.08]">
          <motion.span
            className="font-mono text-[11px] tracking-[0.25em] text-[#6F6A60]"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
          >
            {d.num}
          </motion.span>
        </div>

        {/* ── Text column ── */}
        <div className="py-10 md:py-14 px-7 md:px-10 flex flex-col justify-between border-r border-[#0D0D0B]/[0.08]">
          {/* Title */}
          <div>
            <div className="overflow-hidden mb-0.5">
              <motion.h3
                className="font-instrument tracking-[-0.03em] leading-[1.05] text-[#0D0D0B]"
                style={{ fontSize: "clamp(36px, 4vw, 58px)" }}
                initial={{ y: "105%" }}
                animate={isInView ? { y: "0%" } : { y: "105%" }}
                transition={{ duration: 0.85, delay: 0.15 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {d.title}
              </motion.h3>
            </div>
            <div className="overflow-hidden">
              <motion.h3
                className="font-instrument italic tracking-[-0.03em] leading-[1.05]"
                style={{ fontSize: "clamp(36px, 4vw, 58px)", color: d.accentColor }}
                initial={{ y: "105%" }}
                animate={isInView ? { y: "0%" } : { y: "105%" }}
                transition={{ duration: 0.85, delay: 0.22 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {d.subtitle}
              </motion.h3>
            </div>

            {/* Description */}
            <motion.p
              className="mt-6 font-sans text-[14px] text-[#4A463F] leading-[1.8] max-w-sm"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.8, delay: 0.35 + index * 0.1 }}
            >
              {d.description}
            </motion.p>
          </div>

          {/* Capabilities list */}
          <div className="mt-8 space-y-2">
            {d.capabilities.map((cap, ci) => (
              <motion.div
                key={ci}
                className="flex items-center gap-3 group/cap"
                initial={{ opacity: 0, x: -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                transition={{ duration: 0.55, delay: 0.5 + index * 0.08 + ci * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="w-4 h-[1px] shrink-0"
                  style={{ background: d.accentColor }}
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 + index * 0.08 + ci * 0.07, ease: [0.16, 1, 0.3, 1] }}
                />
                <span className="font-sans text-[13px] text-[#4A463F] group-hover/cap:text-[#0D0D0B]/75 transition-colors duration-300">
                  {cap}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {d.tags.map((tag, ti) => (
              <motion.span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-widest border rounded-full px-3 py-1"
                style={{
                  color: `rgba(${d.accentRgb},0.55)`,
                  borderColor: `rgba(${d.accentRgb},0.18)`,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.07 + ti * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                whileHover={{ scale: 1.06, borderColor: `rgba(${d.accentRgb},0.5)` }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* ── Graphic column ── */}
        <div className="relative py-10 px-8 flex items-center justify-center min-h-[260px] overflow-hidden">
          {/* Radial glow behind graphic */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(${d.accentRgb},0.1) 0%, transparent 65%)`,
            }}
            animate={{ opacity: hovered ? 1 : 0.4 }}
            transition={{ duration: 0.5 }}
          />

          {/* Decorative corner dots */}
          {[[8,8],[8,"auto"],[`auto`,8],[`auto`,`auto`]].map(([t,b], i) => (
            <motion.div key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                top:    typeof t === "number" ? t : undefined,
                bottom: typeof b === "number" ? b : undefined,
                right:  [1,3].includes(i) ? 8 : undefined,
                left:   [0,2].includes(i) ? 8 : undefined,
                background: `rgba(${d.accentRgb},0.35)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}
            />
          ))}

          {/* Border on graphic area */}
          <motion.div
            className="absolute inset-2 rounded-xl border pointer-events-none"
            style={{ borderColor: d.borderColor }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
          />

          {/* The actual graphic — triggers when in view */}
          <motion.div
            className="relative w-full max-w-[280px] h-[200px]"
          >
            <d.Graphic active={isInView} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PINNED FAN-OUT (desktop ≥ lg) — cards spread from centre → row
═══════════════════════════════════════════════════════════ */

/** Portrait card body — shared visual used by the spread + reduced-motion grid. */
function DisciplineCardBody({
  d,
  active,
}: {
  d: (typeof DISCIPLINES)[number];
  active: boolean;
}) {
  // Orange is the single brand accent — same on all three cards.
  const ORANGE      = "#FF5C00";
  const ORANGE_SOFT = "rgba(255,92,0,0.25)";
  const ORANGE_MID  = "#CC4A00";
  const ORANGE_DIM  = "rgba(255,92,0,0.08)";

  return (
    <div
      className="group/card relative h-full rounded-[28px] overflow-hidden flex flex-col transition-all duration-500"
      style={{
        background: "linear-gradient(160deg,#FFFFFF 0%,#FFFCF9 60%,#FFF8F4 100%)",
        border: `1px solid ${ORANGE_SOFT}`,
        boxShadow: `0 1px 0 rgba(255,255,255,1) inset`,
      }}
    >
      {/* Top accent bar — orange, full width */}
      <div
        className="absolute top-0 inset-x-0 h-[2.5px] z-10"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${ORANGE} 30%, ${ORANGE} 70%, transparent 100%)` }}
      />


      {/* Subtle warm corner glow, reveals on hover */}
      <div
        className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-[60px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle, rgba(255,92,0,0.22), transparent 70%)` }}
      />

      <div className="relative p-5 xl:p-6 flex flex-col gap-3 h-full overflow-hidden">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-[0.25em] text-[#9A9488]">{d.num}</span>
          <span
            className="font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full transition-colors duration-300"
            style={{
              color: ORANGE,
              border: `1px solid ${ORANGE_SOFT}`,
              background: ORANGE_DIM,
            }}
          >
            {d.tags[0]}
          </span>
        </div>

        {/* Title — italic subtitle always orange */}
        <h3
          className="font-instrument tracking-[-0.03em] leading-[1.04] text-[#14130F]"
          style={{ fontSize: "clamp(24px, 1.9vw, 36px)" }}
        >
          {d.title}
          <br />
          <span className="italic" style={{ color: ORANGE }}>{d.subtitle}</span>
        </h3>

        {/* Graphic area — orange border */}
        <div
          className="relative flex-1 min-h-[130px] rounded-2xl overflow-hidden flex items-center justify-center transition-colors duration-500"
          style={{
            border: `1px solid ${ORANGE_SOFT}`,
            background: ORANGE_DIM,
          }}
        >
          <div className="w-full max-w-[260px] h-[165px]">
            <d.Graphic active={active} />
          </div>
        </div>

        {/* Description */}
        <p className="font-sans text-[12.5px] text-[#4A463F] leading-[1.65]">{d.description}</p>

        {/* Capabilities — orange dash */}
        <div className="space-y-1.5">
          {d.capabilities.map((cap) => (
            <div key={cap} className="flex items-center gap-2.5">
              <span className="w-3 h-[1.5px] shrink-0 rounded-full" style={{ background: ORANGE }} />
              <span className="font-sans text-[12px] text-[#4A463F]">{cap}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-1">
          {d.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9.5px] font-medium uppercase tracking-[0.12em] rounded-full px-3.5 py-1.5 transition-all duration-300"
              style={{
                color: "#FF5C00",
                border: "1.5px solid rgba(255,92,0,0.45)",
                background: "rgba(255,92,0,0.06)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** One card in the pinned spread — drives its own scroll-linked transform. */
function SpreadCard({
  d,
  index,
  progress,
  active,
}: {
  d: (typeof DISCIPLINES)[number];
  index: number;
  progress: MotionValue<number>;
  active: boolean;
}) {
  const dir = index - 1; // -1 (left) | 0 (centre) | 1 (right)
  const cardRef = useRef<HTMLDivElement>(null);

  // Each card fans out at a slightly different scroll range → staggered spread.
  const spreadStart = 0;
  const spreadEnd   = 0.6 + Math.abs(dir) * 0.08; // side cards finish slightly later

  const x       = useTransform(progress, [spreadStart, spreadEnd], [`${-dir * 105}%`, "0%"]);
  const rotate  = useTransform(progress, [spreadStart, spreadEnd], [dir * 6, 0]);
  const scale   = useTransform(progress, [spreadStart, spreadEnd], [0.84, 1]);
  // All cards stay fully opaque — no washed-out transparency
  const opacity = useTransform(progress, [0, 0.18], [0.92, 1]);
  const z = dir === 0 ? 30 : 20 - Math.abs(dir);

  // Subtle 3D tilt toward cursor while in the spread state
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springTiltX = useSpring(tiltX, { stiffness: 180, damping: 22 });
  const springTiltY = useSpring(tiltY, { stiffness: 180, damping: 22 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    tiltY.set((px - 0.5) * 9);
    tiltX.set(-(py - 0.5) * 9);
  };
  const onMouseLeave = () => { tiltX.set(0); tiltY.set(0); };

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        x, rotate, scale, opacity, zIndex: z,
        rotateX: springTiltX,
        rotateY: springTiltY,
        transformPerspective: 1000,
        willChange: "transform, opacity",
      }}
    >
      <DisciplineCardBody d={d} active={active} />
    </motion.div>
  );
}

function DisciplineSpread() {
  const trackRef    = useRef<HTMLDivElement>(null);
  const barRef      = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const dotRef      = useRef<HTMLDivElement>(null);
  const reduced     = useReducedMotion();

  const { scrollYProgress: progress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const inView = useInView(trackRef, { margin: "-120px" });

  /* Direct DOM writes — zero React re-renders, zero JS frame budget */
  useEffect(() => {
    return progress.on("change", (v) => {
      if (barRef.current)      barRef.current.style.transform      = `scaleX(${v})`;
      if (railFillRef.current) railFillRef.current.style.transform  = `scaleY(${v})`;
      if (dotRef.current)      dotRef.current.style.top             = `${v * 100}%`;
    });
  }, [progress]);

  // Keep dotY for any remaining useTransform uses
  const dotY = useTransform(progress, [0, 1], ["0%", "100%"]);

  // Parallax layer behind cards — drifts opposite to scroll
  const bgY = useTransform(progress, [0, 1], ["-8%", "8%"]);

  // Section label fades out as spread completes
  const labelOpacity = useTransform(progress, [0, 0.35], [1, 0]);
  const labelY       = useTransform(progress, [0, 0.35], [0, -24]);

  if (reduced) {
    return (
      <div className="max-w-7xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-3 gap-6 items-stretch">
          {DISCIPLINES.map((d) => (
            <div key={d.num} className="relative">
              <DisciplineCardBody d={d} active />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={trackRef} className="relative z-10 h-[240vh]">
      <div className="sticky top-0 h-[100svh] flex items-center pt-[72px] pb-6 overflow-hidden">

        {/* ── Parallax warm-glow backdrop ───────────────────── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: bgY }}
        >
          <div
            className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[140px] opacity-[0.07]"
            style={{ background: "radial-gradient(ellipse, #FF5C00 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.05]"
            style={{ background: "radial-gradient(circle, #FF9A3C 0%, transparent 70%)" }}
          />
        </motion.div>

        {/* ── Floating section label — fades as spread opens ─ */}
        <motion.div
          className="absolute top-[80px] left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 pointer-events-none"
          style={{ opacity: labelOpacity, y: labelY }}
        >
          <div className="h-px w-8 bg-[#FF5C00]" />
          <span className="font-mono text-[10px] text-[#6F6A60] uppercase tracking-[0.3em] whitespace-nowrap">
            [ 03 ] — What we do
          </span>
          <div className="h-px w-8 bg-[#FF5C00]" />
        </motion.div>

        {/* ── Vertical scroll-progress rail (right edge) ────── */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 h-32 w-[1px] bg-[#0D0D0B]/10 z-20">
          <div
            ref={railFillRef}
            className="absolute left-0 top-0 w-full bg-[#FF5C00] origin-top rounded-full"
            style={{ transform: "scaleY(0)", height: "100%", willChange: "transform" }}
          />
          <div
            ref={dotRef}
            className="absolute -left-[3px] w-[7px] h-[7px] rounded-full bg-[#FF5C00]"
            style={{ top: "0%", willChange: "top" }}
          />
        </div>

        {/* ── Cards ─────────────────────────────────────────── */}
        <div className="w-full max-w-7xl mx-auto px-6">
          <div
            className="grid grid-cols-3 gap-5 items-stretch"
            style={{ maxHeight: "calc(100svh - 104px)" }}
          >
            {DISCIPLINES.map((d, i) => (
              <SpreadCard key={d.num} d={d} index={i} progress={progress} active={inView} />
            ))}
          </div>

          {/* ── Scroll-driven progress bar under the grid ───── */}
          <div className="mt-5 h-[2px] bg-[#0D0D0B]/[0.08] relative overflow-hidden rounded-full">
            <div
              ref={barRef}
              className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-[#FF5C00] to-[#FF9A3C] rounded-full origin-left"
              style={{ transform: "scaleX(0)", willChange: "transform" }}
            />
          </div>

        </div>
      </div>

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PREMIUM HEADER BLOCK
═══════════════════════════════════════════════════════════ */

const WORDS = ["Systems", "Brands", "Products", "Growth", "Futures"];

/* ── System orbit — fully SVG-driven so rings + nodes always align ── */
function SystemOrbit({ inView }: { inView: boolean }) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  // Mouse tracking for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [8, -8]), { stiffness: 80, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-8, 8]), { stiffness: 80, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set(((e.clientX - r.left) / r.width) * 2 - 1);
    mouseY.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const C = 260;
  const R = 165;
  const SIZE = 520;

  const NODES = [
    { label: "Technology", sub: "Full-stack & AI",  angle: -90, stat: "45%", statLabel: "Visibility", color: "#4F8EF7" },
    { label: "Design",     sub: "Brand & Motion",   angle:  30, stat: "40%", statLabel: "Engagement", color: "#B87FFF" },
    { label: "Strategy",   sub: "GTM & Roadmap",     angle: 150, stat: "3×",  statLabel: "Speed",      color: "#F59E0B" },
  ];

  const positions = NODES.map(n => {
    const rad = (n.angle * Math.PI) / 180;
    return { x: C + R * Math.cos(rad), y: C + R * Math.sin(rad) };
  });

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative mx-auto select-none"
      style={{ width: "100%", maxWidth: 580, aspectRatio: "1", perspective: 1000 }}
      aria-hidden
    >
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          rotateX: reduced ? 0 : rotateX,
          rotateY: reduced ? 0 : rotateY,
        }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[70%] h-[70%] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,92,0,0.22) 0%, transparent 70%)", filter: "blur(50px)" }}
            animate={reduced ? {} : { scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* SVG */}
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 w-full h-full pointer-events-none"
             preserveAspectRatio="xMidYMid meet">

          {/* Outermost faint ring */}
          <motion.circle cx={C} cy={C} r={R * 1.38} fill="none"
            stroke="rgba(255,92,0,0.07)" strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 2.2, ease: [0.16,1,0.3,1], delay: 0.1 }}
          />

          {/* Outer dashed ring — slowly rotates */}
          <motion.circle cx={C} cy={C} r={R} fill="none"
            stroke="rgba(255,92,0,0.22)" strokeWidth="1.5" strokeDasharray="6 9"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1, rotate: reduced ? 0 : 360 } : { pathLength: 0, opacity: 0 }}
            style={{ transformOrigin: `${C}px ${C}px` }}
            transition={{
              pathLength: { duration: 2.0, ease: [0.16,1,0.3,1], delay: 0.2 },
              opacity:    { duration: 1.0, delay: 0.2 },
              rotate:     { duration: 28, repeat: Infinity, ease: "linear" },
            }}
          />

          {/* Middle ring — counter-rotates */}
          <motion.circle cx={C} cy={C} r={R * 0.55} fill="none"
            stroke="rgba(255,92,0,0.13)" strokeWidth="1" strokeDasharray="3 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1, rotate: reduced ? 0 : -360 } : {}}
            style={{ transformOrigin: `${C}px ${C}px` }}
            transition={{
              pathLength: { duration: 1.6, ease: [0.16,1,0.3,1], delay: 0.4 },
              opacity:    { duration: 0.8, delay: 0.4 },
              rotate:     { duration: 18, repeat: Infinity, ease: "linear" },
            }}
          />

          {/* Inner ring */}
          <motion.circle cx={C} cy={C} r={R * 0.25} fill="none"
            stroke="rgba(255,92,0,0.08)" strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.0, ease: [0.16,1,0.3,1], delay: 0.55 }}
          />

          {/* Spokes */}
          {positions.map((p, i) => (
            <motion.line key={`spoke${i}`}
              x1={C} y1={C} x2={p.x} y2={p.y}
              stroke={hovered === i ? NODES[i].color : "rgba(255,92,0,0.25)"}
              strokeWidth={hovered === i ? 1.5 : 1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.7 + i * 0.15, ease: [0.16,1,0.3,1] }}
            />
          ))}

          {/* Data particles */}
          {inView && !reduced && positions.map((p, i) => (
            [0, 0.5].map((_off, j) => (
              <motion.circle key={`pkt${i}${j}`} r={2.5}
                fill={NODES[i].color}
                animate={{ cx: [C, p.x, C], cy: [C, p.y, C], opacity: [0, 0.9, 0] }}
                transition={{
                  duration: 2.8 + i * 0.4, delay: 1.2 + i * 0.6 + j * 1.4,
                  repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8,
                }}
              />
            ))
          ))}

          {/* Node dots */}
          {positions.map((p, i) => (
            <g key={`nodedot${i}`}>
              <motion.circle cx={p.x} cy={p.y} r={hovered === i ? 7 : 5}
                fill={NODES[i].color}
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 0.85 } : {}}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                transition={{ duration: 0.5, delay: 0.95 + i * 0.12, ease: [0.34,1.56,0.64,1] }}
              />
              {hovered === i && (
                <motion.circle cx={p.x} cy={p.y} r={7} fill="none"
                  stroke={NODES[i].color} strokeWidth="1"
                  animate={{ r: [7, 22], opacity: [0.7, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
            </g>
          ))}
        </svg>

        {/* CODA center */}
        <motion.div
          className="absolute flex flex-col items-center justify-center rounded-full z-20"
          style={{
            width: 100, height: 100,
            left: "50%", top: "50%",
            translate: "-50% -50%",
            background: "linear-gradient(145deg,#FF7A2E 0%,#FF5C00 100%)",
            boxShadow: "0 0 0 16px rgba(255,92,0,0.09), 0 0 0 32px rgba(255,92,0,0.04), 0 16px 48px rgba(255,92,0,0.45)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.85, delay: 0.35, ease: [0.34,1.56,0.64,1] }}
          whileHover={{ scale: 1.08 }}
        >
          {!reduced && (
            <>
              <motion.div className="absolute inset-0 rounded-full border-2 border-[#FF5C00]/40"
                animate={{ scale: [1, 2.0], opacity: [0.5, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }} />
              <motion.div className="absolute inset-0 rounded-full border-2 border-[#FF5C00]/30"
                animate={{ scale: [1, 2.0], opacity: [0.5, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: 1.3 }} />
            </>
          )}
          <span className="font-instrument text-white text-[18px] leading-none tracking-[-0.03em] z-10">CODA</span>
          <span className="font-mono text-white/50 text-[8px] uppercase tracking-[0.2em] mt-1 z-10">System</span>
        </motion.div>

        {/* Node pills */}
        {NODES.map((n, i) => {
          const p = positions[i];
          const isHovered = hovered === i;
          return (
            <motion.div
              key={n.label}
              className="absolute z-10"
              style={{ left: `${(p.x / SIZE) * 100}%`, top: `${(p.y / SIZE) * 100}%`, translate: "-50% -50%" }}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.65, delay: 0.95 + i * 0.13, ease: [0.34,1.56,0.64,1] }}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
            >
              <motion.div
                className="flex flex-col items-center gap-2"
                animate={reduced ? {} : { y: [0, i % 2 === 0 ? -8 : 8, 0] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="rounded-2xl px-5 py-3 flex flex-col items-center gap-1 whitespace-nowrap cursor-pointer"
                  animate={{
                    background: isHovered ? "#FFFFFF" : "rgba(255,255,255,0.92)",
                    boxShadow: isHovered
                      ? `0 12px 40px ${n.color}30, 0 2px 0 rgba(255,255,255,1) inset, 0 0 0 1.5px ${n.color}55`
                      : "0 6px 24px rgba(255,92,0,0.10), 0 1px 0 rgba(255,255,255,1) inset, 0 0 0 1px rgba(255,92,0,0.18)",
                    scale: isHovered ? 1.06 : 1,
                    y: isHovered ? -3 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
                >
                  <span className="font-instrument text-[#14130F] text-[16px] leading-tight">{n.label}</span>
                  <span className="font-mono text-[#9A9488] text-[9px] uppercase tracking-[0.2em]">{n.sub}</span>
                </motion.div>

                <motion.div
                  className="px-3 py-1 rounded-full flex items-center gap-2 whitespace-nowrap"
                  animate={{
                    background: isHovered ? `${n.color}18` : "rgba(255,92,0,0.07)",
                    borderColor: isHovered ? `${n.color}55` : "rgba(255,92,0,0.20)",
                    scale: isHovered ? 1.08 : 1,
                  }}
                  style={{ border: "1px solid" }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.span
                    className="font-instrument text-[14px] leading-none font-semibold"
                    animate={{ color: isHovered ? n.color : "#FF5C00" }}
                    transition={{ duration: 0.3 }}
                  >{n.stat}</motion.span>
                  <span className="font-mono text-[#9A9488] text-[8px] uppercase tracking-[0.16em]">{n.statLabel}</span>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ── Clean rotating word — smooth vertical roll, no clutter ── */
function KineticWord({
  words, interval = 2600, onIndex, reduced,
}: {
  words: string[];
  interval?: number;
  onIndex?: (i: number) => void;
  fontSize?: string;
  reduced: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % words.length;
        onIndex?.(next);
        return next;
      });
    }, interval);
    return () => clearInterval(t);
  }, [words.length, interval, onIndex]);

  const word = words[index];

  return (
    <span className="inline-block overflow-hidden align-bottom pb-[0.18em] pt-[0.04em] -mx-2 px-2" style={{ minWidth: "max-content" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          className="inline-block italic text-[#FF5C00]"
          initial={reduced ? { opacity: 0 } : { y: "105%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: "-105%", opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── Headline block ── */
/* Entrance-only fade+rise — no scroll-linked parallax springs (those ran a
   physics sim every scroll frame on huge text, which made the section feel
   heavy). whileInView fires once, then the block is static = light scroll. */
function HeadlineBlock({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const FS  = "clamp(52px, 6vw, 92px)";
  const FS3 = "clamp(40px, 4.8vw, 72px)";
  const ease = [0.16, 1, 0.3, 1] as const;

  const anim = (props: Record<string, unknown>) => props;

  return (
    <div className="relative flex flex-col gap-0">

      {/* Line 1 — "We engineer" — flush left, lighter weight feel */}
      <div className="-mx-3 px-3 pt-[0.04em] pb-[0.08em]">
        <motion.span
          className="block font-instrument text-[#14130F] leading-[1.0]"
          style={{ fontSize: FS, letterSpacing: "-0.04em" }}
          {...anim({
            initial: { y: "108%", opacity: 0 },
            whileInView: { y: "0%", opacity: 1 },
            viewport: { once: true },
            transition: { duration: 1.0, ease },
          })}
        >
          We engineer
        </motion.span>
      </div>

      {/* Line 2 — rotating word */}
      <div className="overflow-visible pl-0 pr-4">
        <motion.span
          className="block font-instrument italic text-[#FF5C00] leading-[1.0]"
          style={{ fontSize: `calc(${FS} * 1.08)`, letterSpacing: "-0.05em" }}
          {...anim({
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.9, delay: 0.14, ease },
          })}
        >
          <KineticWord words={WORDS} interval={2800} reduced={reduced} />
        </motion.span>
      </div>

      {/* Line 3 — "that dominate." — simple opacity fade (no clip-reveal mask,
          so it can never get stranded hidden) */}
      <div className="overflow-visible pl-0 mt-3 pb-[0.18em] pt-[0.04em]">
        <motion.span
          className="block font-instrument text-[#C4BDB4] leading-[1.0]"
          style={{ fontSize: FS3, letterSpacing: "-0.03em" }}
          {...anim({
            initial: { opacity: 0, y: 24 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.1 },
            transition: { duration: 0.9, delay: 0.26, ease },
          })}
        >
          that dominate.
        </motion.span>
      </div>

    </div>
  );
}

function HeaderBlock({
  lineW,
}: {
  lineW: MotionValue<string>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // ── Mobile / smaller screens (< lg) ──────────────────────────────
  // Collapse the many per-element scroll animations into ONE simple fade-up
  // on the whole block. Lighter and less busy than 5+ staggered reveals.
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const anim = (props: Record<string, unknown>) => props;

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-20 relative z-10">

      {/* ── Two-column layout ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center overflow-visible">

        {/* LEFT — label + headline + copy + stats.
            key={mobile} forces a clean remount when the breakpoint is detected
            after mount, so children never get stranded at opacity:0 by losing
            their reveal props mid-life. */}
        <motion.div
          key={mobile ? "mobile" : "desktop"}
          className="overflow-visible"
        >
          {/* Label */}
          <motion.div
            {...anim({
              initial: { opacity: 0, x: -24 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
            })}
            className="flex items-center gap-4 mb-12"
          >
            <motion.div
              {...anim({
                initial: { scaleX: 0 }, whileInView: { scaleX: 1 }, viewport: { once: true },
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              })}
              className="h-[1px] w-12 bg-[#FF5C00] origin-left"
            />
            <span className="font-mono text-[10px] text-[#6F6A60] uppercase tracking-[0.32em]">What we do</span>
            <div className="relative">
              <span className="block w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
              {/* Pulsing halo — desktop only (one less continuous loop on mobile) */}
              {!mobile && (
                <motion.span className="absolute inset-0 rounded-full bg-[#FF5C00]"
                  animate={{ scale: [1, 2.8, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }} />
              )}
            </div>
          </motion.div>

          {/* ── Creative headline ─────────────────────────── */}
          <HeadlineBlock reduced={!!reduced} mobile={mobile} />

          {/* Sub-copy */}
          <motion.p
            {...anim({
              initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true },
              transition: { duration: 0.9, delay: 0.38, ease: [0.16, 1, 0.3, 1] },
            })}
            className="mt-10 font-sans text-[14.5px] text-[#4A463F] max-w-full sm:max-w-[380px] leading-[1.9]">
            Three disciplines Technology, Design, and Growth.  unified into one
            system that compounds over time and gives our clients an unfair advantage.
          </motion.p>

          {/* Stats — premium light card */}
          <motion.div
            className="mt-10 relative rounded-2xl overflow-hidden"
            {...anim({
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] },
            })}
            style={{
              background: "linear-gradient(160deg, #FFFFFF 0%, #FAF7F2 100%)",
              border: "1px solid rgba(13,13,11,0.09)",
              boxShadow: "0 2px 0 rgba(255,255,255,0.9) inset, 0 8px 40px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            {/* Top orange hairline */}
            <div className="absolute inset-x-0 top-0 h-[2px]"
              style={{ background: "linear-gradient(90deg, transparent 5%, #FF5C00 40%, #FF9A3C 60%, transparent 95%)" }} />

            <div className="relative grid grid-cols-3 divide-x divide-[#0D0D0B]/[0.07]">
              {[{ n: "3", label: "Disciplines" }, { n: "1", label: "System" }, { n: "∞", label: "Compounds" }].map(({ n, label }, i) => (
                <motion.div
                  key={label}
                  className="relative flex flex-col items-center justify-center px-3 py-8 gap-2 text-center cursor-default overflow-hidden"
                  whileHover="hovered"
                  initial="idle"
                >
                  {/* Hover warm wash from bottom */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    variants={{ idle: { opacity: 0 }, hovered: { opacity: 1 } }}
                    transition={{ duration: 0.35 }}
                    style={{ background: "radial-gradient(ellipse 100% 140% at 50% 115%, rgba(255,92,0,0.09) 0%, transparent 65%)" }}
                  />
                  {/* Hover top bar */}
                  <motion.div
                    className="absolute top-0 inset-x-0 h-[2px] origin-left"
                    style={{ background: "linear-gradient(90deg, #FF5C00, rgba(255,154,60,0.4))" }}
                    variants={{ idle: { scaleX: 0 }, hovered: { scaleX: 1 } }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  />

                  <motion.span
                    className="font-instrument leading-none tracking-[-0.04em] tabular-nums"
                    style={{ fontSize: "clamp(32px,5vw,52px)" }}
                    variants={{ idle: { color: "#0D0D0B", y: 0 }, hovered: { color: "#FF5C00", y: -3 } }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >{n}</motion.span>

                  <motion.span
                    className="font-mono text-[9px] uppercase tracking-[0.22em]"
                    variants={{ idle: { color: "#9A9488" }, hovered: { color: "#4A463F" } }}
                    transition={{ duration: 0.3 }}
                  >{label}</motion.span>

                  <motion.div
                    className="h-px rounded-full bg-[#FF5C00] origin-center"
                    style={{ width: 28 }}
                    variants={{ idle: { scaleX: 0, opacity: 0 }, hovered: { scaleX: 1, opacity: 0.45 } }}
                    transition={{ duration: 0.35 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT — animated system orbit diagram (desktop only — not mounted on
            mobile so its many infinite loops never run on touch devices) */}
        {!mobile && (
          <motion.div
            className="hidden lg:flex relative items-center justify-center w-full"
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <SystemOrbit inView={isInView} />
          </motion.div>
        )}
      </div>

      {/* ── Scroll-driven divider ─────────────────────────── */}
      <div className="mt-16 relative">
        <div className="h-px bg-[#0D0D0B]/[0.08] rounded-full overflow-hidden">
          <motion.div style={{ width: lineW }}
            className="h-full bg-gradient-to-r from-[#FF5C00] via-[#FF7A2E] to-transparent rounded-full origin-left" />
        </div>
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FF5C00]"
          style={{ left: lineW, boxShadow: "0 0 8px rgba(255,92,0,0.6)" }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MOBILE STICKY STACK
═══════════════════════════════════════════════════════════ */

function MobileDisciplineStack() {
  const allCards = [
    ...DISCIPLINES,
    ...LANDSCAPE_TILES.map(t => ({
      num: t.num,
      title: t.title,
      subtitle: t.subtitle,
      description: t.tagline,
      capabilities: t.capabilities as unknown as string[],
      tags: t.tags as unknown as string[],
      Graphic: t.Graphic,
      accentColor: "#FF5C00",
      accentRgb: "255,92,0",
      borderColor: "rgba(255,92,0,0.15)"
    }))
  ];

  return (
    <div className="lg:hidden max-w-7xl mx-auto px-5 pb-8 flex flex-col relative z-10" style={{ gap: "35vh" }}>
      {allCards.map((d, i) => (
        <div
          key={d.num}
          className="sticky"
          style={{
            top: `calc(8vh + ${i * 12}px)`, // Tighter offset so 5 cards fit elegantly at the top
            zIndex: i,
          }}
        >
          {/* We wrap DisciplineCardBody in a div with a fixed viewport height to guarantee 
              all 5 cards are exactly the same height, completely hiding the cards behind them. */}
          <div className="rounded-[28px] h-[78vh] min-h-[540px] w-full bg-[#FFFCF9]">
            <DisciplineCardBody d={d as any} active />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION
═══════════════════════════════════════════════════════════ */

export default function Statement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineW = useTransform(scrollYProgress, [0.05, 0.5], ["0%", "100%"]);
  const bgY   = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  // No `overflow-hidden` on this <section> — it would break the desktop sticky
  // pin. Decorative layers are clipped by their own wrapper below instead.
  return (
    <section ref={ref} className="relative" style={{ background: "#F4F0E8" }}>
      {/* Top separator */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#0D0D0B]/[0.12] to-transparent z-[1]" />

      {/* Decorative layers — clipped here so blur/grid can't cause overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ambient parallax orbs — disabled on mobile to preserve scroll framerate */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 hidden md:block">
          <div className="absolute top-[-20%] right-[-5%] w-[700px] h-[700px] rounded-full blur-[160px] opacity-[0.045] animate-glow-pulse"
            style={{ background: "radial-gradient(circle, #FF5C00 0%, transparent 65%)" }} />
          <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.03]"
            style={{ background: "radial-gradient(circle, #4F8EF7 0%, transparent 65%)" }} />
        </motion.div>

        {/* Subtle grid — kept very faint */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "linear-gradient(to right,#0D0D0B 1px,transparent 1px),linear-gradient(to bottom,#0D0D0B 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* ── Header ───────────────────────────────────────────── */}
      <HeaderBlock lineW={lineW} />

      {/* ── Discipline cards ─────────────────────────────────────
          Mobile / tablet: Premium sticky stack effect
          Desktop (lg+): pinned fan-out — cards spread centre → row. */}
      <MobileDisciplineStack />
      <div className="hidden lg:block">
        <DisciplineSpread />
      </div>

      {/* ── Landscape tiles ─────────────────────────────────── */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 pb-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          {LANDSCAPE_TILES.map((tile, i) => (
            <LandscapeTile key={tile.num} tile={tile} index={i} />
          ))}
        </div>
      </div>

      {/* ── Bottom tagline ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-16 lg:py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 border-t border-[#0D0D0B]/[0.1]"
        >
          <p className="font-mono text-[10px] text-[#6F6A60] uppercase tracking-[0.25em]">
            Every engagement touches all three disciplines
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF5C00] animate-ping-expand" />
            <span className="font-mono text-[10px] text-[#6F6A60] uppercase tracking-[0.2em]">
              That&apos;s how systems compound
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
