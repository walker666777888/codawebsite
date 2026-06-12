"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "motion/react";
import SectionLabel from "@/components/ui/SectionLabel";
import { ArrowUpRight } from "lucide-react";
import { useVideoPreload } from "@/components/providers/VideoPreloadProvider";

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

/* ── ProjectCard ─────────────────────────────────────────────── */
function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  return (
    <div className="shrink-0 w-[78vw] sm:w-[55vw] md:w-[42vw] lg:w-[34vw] group select-none">
      <div className={`aspect-[4/3] bg-gradient-to-br ${project.gradient} rounded-2xl mb-5 relative overflow-hidden`}>
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        {/* Glow */}
        <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] rounded-full pointer-events-none opacity-[0.08]"
          style={{ background: project.accent, filter: "blur(80px)" }} />
        {/* Top line */}
        <div className="absolute top-0 inset-x-0 h-[1px] pointer-events-none opacity-20"
          style={{ background: `linear-gradient(90deg,transparent,${project.accent},transparent)` }} />
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
          <span className="font-instrument text-white leading-none tracking-[-0.04em] opacity-[0.04]"
            style={{ fontSize: "clamp(28px,4vw,56px)" }}>{project.title}</span>
        </div>
        {/* Number */}
        <div className="absolute top-5 left-5">
          <span className="font-mono text-[10px] text-white/30 tracking-[0.15em]">
            {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </div>
        {/* CTA */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-white" />
          </div>
        </div>
        {/* Tags */}
        <div className="absolute inset-x-0 bottom-0 p-5 flex gap-2 flex-wrap"
          style={{ background: "linear-gradient(to top,rgba(0,0,0,0.6),transparent)" }}>
          {project.tags.map((tag) => (
            <span key={tag} className="font-mono text-[9px] uppercase tracking-widest text-white/45 border border-white/12 rounded-full px-3 py-1 bg-black/20">{tag}</span>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="flex justify-between items-start px-1">
        <div>
          <h3 className="font-instrument text-[22px] text-[#0D0D0B] tracking-[-0.02em] leading-none mb-1.5">{project.title}</h3>
          <p className="font-sans text-[13px] text-[#9A9287] mt-0.5">{project.category}</p>
        </div>
        <span className="font-mono text-[11px] tracking-[0.1em] text-[#B0AA9F]">{project.year}</span>
      </div>
    </div>
  );
}

/* ── WorkShowcase ─────────────────────────────────────────────── */
export default function WorkShowcase() {
  const trackRef   = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const offsetRef  = useRef(0);
  const halfW      = useRef(0);
  const isDragging = useRef(false);
  const lastX      = useRef(0);
  const rafId      = useRef<number>(0);
  const speed      = 0.6;

  /* Trigger footer video preload as soon as this section is visible */
  const { triggerLoad } = useVideoPreload();
  const sectionInView = useInView(sectionRef, { once: true, margin: "0px" });
  useEffect(() => {
    if (sectionInView) triggerLoad();
  }, [sectionInView, triggerLoad]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    /* Measure half-width once content renders */
    const measure = () => { halfW.current = track.scrollWidth / 2; };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    /* RAF loop — runs every frame, updates only transform */
    const tick = () => {
      if (!isDragging.current) {
        offsetRef.current -= speed;
      }
      /* Seamless wrap — when we've scrolled one full set, reset */
      if (halfW.current > 0 && offsetRef.current <= -halfW.current) {
        offsetRef.current += halfW.current;
      }
      track.style.transform = `translateX(${offsetRef.current}px)`;
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId.current);
      ro.disconnect();
    };
  }, []);

  /* ── Pointer handlers (mouse + touch unified) ── */
  const onPointerDown = (clientX: number) => {
    isDragging.current = true;
    lastX.current = clientX;
  };
  const onPointerMove = (clientX: number) => {
    if (!isDragging.current) return;
    const dx = clientX - lastX.current;
    lastX.current = clientX;
    offsetRef.current += dx;
  };
  const onPointerUp = () => { isDragging.current = false; };

  return (
    <section id="work" ref={sectionRef} className="py-16 sm:py-24 lg:py-36 bg-[#F4F0E8] overflow-hidden relative">
      {/* Separators */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6D1CB] to-transparent" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{ backgroundImage: "linear-gradient(to right,#E6E1DA 1px,transparent 1px),linear-gradient(to bottom,#E6E1DA 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-14">
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <SectionLabel index={3} className="mb-5 block">Selected Work</SectionLabel>
          <h2 className="font-instrument tracking-[-0.03em] text-[#0D0D0B] leading-[1.04]"
            style={{ fontSize: "clamp(36px,5vw,66px)" }}>
            Digital ecosystems <span className="italic text-[#FF5C00]">in action.</span>
          </h2>
        </motion.div>
      </div>

      {/* ── Marquee ── */}
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Fade masks — desktop only */}
        <div className="absolute left-6 top-0 bottom-0 w-12 z-10 pointer-events-none hidden md:block"
          style={{ background: "linear-gradient(to right,#F4F0E8 10%,transparent)" }} />
        <div className="absolute right-6 top-0 bottom-0 w-12 z-10 pointer-events-none hidden md:block"
          style={{ background: "linear-gradient(to left,#F4F0E8 10%,transparent)" }} />

        <div
          className="overflow-hidden rounded-2xl"
          style={{ cursor: "grab" }}
          onMouseDown={e => { e.preventDefault(); onPointerDown(e.clientX); (e.currentTarget as HTMLDivElement).style.cursor = "grabbing"; }}
          onMouseMove={e => onPointerMove(e.clientX)}
          onMouseUp={e => { onPointerUp(); (e.currentTarget as HTMLDivElement).style.cursor = "grab"; }}
          onMouseLeave={e => { onPointerUp(); (e.currentTarget as HTMLDivElement).style.cursor = "grab"; }}
          onTouchStart={e => onPointerDown(e.touches[0].clientX)}
          onTouchMove={e => { e.preventDefault(); onPointerMove(e.touches[0].clientX); }}
          onTouchEnd={onPointerUp}
        >
          <div ref={trackRef} className="flex gap-5 pb-2" style={{ width: "max-content", willChange: "transform" }}>
            {projects.map((p, i) => <ProjectCard key={`a-${i}`} project={p} index={i} />)}
            {projects.map((p, i) => <ProjectCard key={`b-${i}`} project={p} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
