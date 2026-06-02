"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, animate } from "motion/react";
import SectionLabel from "@/components/ui/SectionLabel";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Atreya.ai",
    category: "AI Platform",
    gradient: "from-[#06061a] via-[#0a1030] to-[#0c1848]",
    accent: "#4F8EF7",
    year: "2024",
    tags: ["AI", "SaaS", "Dashboard"],
  },
  {
    title: "Homer",
    category: "PropTech App",
    gradient: "from-[#060e06] via-[#091809] to-[#112611]",
    accent: "#5FCF5F",
    year: "2024",
    tags: ["Mobile", "Maps", "PropTech"],
  },
  {
    title: "Florapark",
    category: "E-commerce System",
    gradient: "from-[#0e060e] via-[#1a0a1a] to-[#280d35]",
    accent: "#B87FFF",
    year: "2023",
    tags: ["E-comm", "Brand", "Growth"],
  },
  {
    title: "DMP Drone Fleet",
    category: "Enterprise Dashboard",
    gradient: "from-[#0e0900] via-[#1a1200] to-[#2a1c00]",
    accent: "#FF9A3C",
    year: "2023",
    tags: ["IoT", "Enterprise", "Ops"],
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 120, damping: 28 });
  const springRotY = useSpring(rotY, { stiffness: 120, damping: 28 });
  const rectRef = useRef<DOMRect | null>(null);

  const onMouseEnter = () => {
    rectRef.current = cardRef.current?.getBoundingClientRect() ?? null;
    setHovered(true);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    const r = rectRef.current;
    if (!r) return;
    rotX.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
    rotY.set(((e.clientX - r.left) / r.width - 0.5) * 8);
  };
  const onMouseLeave = () => {
    rotX.set(0); rotY.set(0);
    setHovered(false);
  };

  return (
    <div
      className="shrink-0 w-[80vw] sm:w-[60vw] md:w-[44vw] lg:w-[36vw] group"
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX: springRotX, rotateY: springRotY, transformStyle: "preserve-3d" }}
      >
        {/* Card image */}
        <div className={`aspect-[4/3] bg-gradient-to-br ${project.gradient} rounded-2xl mb-5 relative overflow-hidden cursor-pointer`}>
          {/* Noise */}
          <div className="absolute inset-[-8%] opacity-[0.055] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "180px 180px",
            }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

          {/* Accent glow */}
          <motion.div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] rounded-full pointer-events-none"
            style={{ background: project.accent }}
            animate={{ opacity: hovered ? 0.22 : 0.08, scale: hovered ? 1.4 : 1, filter: hovered ? "blur(60px)" : "blur(80px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />

          {/* Top line */}
          <motion.div className="absolute top-0 inset-x-0 h-[1px] pointer-events-none"
            style={{ background: `linear-gradient(90deg,transparent,${project.accent},transparent)` }}
            animate={{ opacity: hovered ? 0.7 : 0.15 }}
            transition={{ duration: 0.4 }} />

          {/* Shimmer */}
          <motion.div className="absolute inset-0 pointer-events-none"
            initial={{ x: "-120%", skewX: "-20deg" }}
            animate={hovered ? { x: "220%" } : { x: "-120%" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)", width: "55%" }} />

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
            <motion.span className="font-instrument text-white leading-none tracking-[-0.04em]"
              style={{ fontSize: "clamp(32px, 5vw, 64px)" }}
              animate={{ opacity: hovered ? 0.07 : 0.03 }}
              transition={{ duration: 0.4 }}>
              {project.title}
            </motion.span>
          </div>

          {/* Number label */}
          <div className="absolute top-5 left-5">
            <span className="font-mono text-[10px] text-white/30 tracking-[0.15em]">
              {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          {/* CTA */}
          <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}>
            <motion.div
              animate={{ scale: hovered ? 1 : 0.6, y: hovered ? 0 : 14 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>

          {/* Tags */}
          <div className="absolute inset-x-0 bottom-0 p-5 flex gap-2 flex-wrap"
            style={{ background: "linear-gradient(to top,rgba(0,0,0,0.6),transparent)" }}>
            {project.tags.map((tag) => (
              <span key={tag} className="font-mono text-[9px] uppercase tracking-widest text-white/45 border border-white/12 rounded-full px-3 py-1 backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-start px-1">
          <div>
            <h3 className="font-instrument text-[22px] text-[#0D0D0B] tracking-[-0.02em] leading-none mb-1.5 relative inline-block">
              {project.title}
              <span className="absolute inset-x-0 -bottom-0.5 h-[1px] bg-[#0D0D0B] origin-left scale-x-0 group-hover:scale-x-100"
                style={{ transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)" }} />
            </h3>
            <p className="font-sans text-[13px] text-[#9A9287] mt-0.5">{project.category}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-[11px] tracking-[0.1em] text-[#B0AA9F]">{project.year}</span>
            <motion.span className="font-mono text-[9px] tracking-[0.05em] text-[#FF5C00] opacity-0 group-hover:opacity-100"
              style={{ transition: "opacity 0.3s ease" }}>
              View →
            </motion.span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function WorkShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headingY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const x = useMotionValue(0);

  // Card width + gap — recalculated on mount/resize
  const cardW = useRef(0);
  const GAP = 24; // gap-6 = 24px

  const getCardWidth = useCallback(() => {
    const first = trackRef.current?.children[0] as HTMLElement | undefined;
    return first ? first.offsetWidth + GAP : 0;
  }, []);

  const snapTo = useCallback((index: number, instant = false) => {
    const w = getCardWidth();
    if (!w) return;
    const clamped = Math.max(0, Math.min(index, projects.length - 1));
    setActiveIndex(clamped);
    animate(x, -clamped * w, {
      duration: instant ? 0 : 0.55,
      ease: [0.16, 1, 0.3, 1],
    });
  }, [x, getCardWidth]);

  // Auto-advance
  const startAuto = useCallback(() => {
    autoRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % projects.length;
        const w = getCardWidth();
        if (w) animate(x, -next * w, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
        return next;
      });
    }, 3200);
  }, [x, getCardWidth]);

  const stopAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
  }, []);

  useEffect(() => {
    cardW.current = getCardWidth();
    startAuto();
    return () => stopAuto();
  }, [startAuto, stopAuto, getCardWidth]);

  // Snap to nearest card on drag end
  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    const w = getCardWidth();
    if (!w) return;
    const cur = -x.get();
    const nearest = Math.round(cur / w);
    snapTo(Math.max(0, Math.min(nearest, projects.length - 1)));
    startAuto();
  }, [x, getCardWidth, snapTo, startAuto]);

  const totalW = useCallback(() => getCardWidth() * projects.length, [getCardWidth]);

  return (
    <section ref={sectionRef} id="work"
      className="py-16 sm:py-24 lg:py-36 bg-[#F4F0E8] overflow-hidden relative">
      {/* Separators */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6D1CB] to-transparent" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{ backgroundImage: "linear-gradient(to right,#E6E1DA 1px,transparent 1px),linear-gradient(to bottom,#E6E1DA 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 relative mb-14">
        <motion.div style={{ y: headingY }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <SectionLabel index={5} className="mb-5 block">Selected Work</SectionLabel>
          <h2 className="font-instrument tracking-[-0.03em] text-[#0D0D0B] leading-[1.04]"
            style={{ fontSize: "clamp(36px, 5vw, 66px)" }}>
            Digital ecosystems{" "}
            <span className="italic text-[#FF5C00]">in action.</span>
          </h2>
        </motion.div>
      </div>

      {/* Drag carousel */}
      <div
        className="max-w-7xl mx-auto px-6 relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseEnter={stopAuto}
        onMouseLeave={() => { if (!isDragging) startAuto(); }}
      >
        {/* Left fade — desktop only */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right,#F4F0E8,transparent)" }} />
        {/* Right fade — desktop only */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left,#F4F0E8,transparent)" }} />

        <motion.div
          ref={trackRef}
          className="flex gap-6 w-max"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -(totalW() - getCardWidth()), right: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragStart={() => { setIsDragging(true); stopAuto(); }}
          onDragEnd={onDragEnd}
          whileTap={{ cursor: "grabbing" }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2.5 mt-8">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => { stopAuto(); snapTo(i); startAuto(); }}
            aria-label={`Go to project ${i + 1}`}
            style={{
              width: activeIndex === i ? "24px" : "7px",
              height: "7px",
              borderRadius: "99px",
              background: activeIndex === i ? "#FF5C00" : "rgba(13,13,11,0.2)",
              transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
