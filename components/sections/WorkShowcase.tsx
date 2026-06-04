"use client";

import { motion } from "motion/react";
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

/* ── ProjectCard ─────────────────────────────────────────────── */
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  return (
    <div className="shrink-0 w-[78vw] sm:w-[55vw] md:w-[42vw] lg:w-[34vw] group">
      {/* Card image */}
      <div
        className={`aspect-[4/3] bg-gradient-to-br ${project.gradient} rounded-2xl mb-5 relative overflow-hidden`}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Accent glow */}
        <div
          className="absolute top-1/4 left-1/4 w-[200px] h-[200px] rounded-full pointer-events-none opacity-[0.08]"
          style={{ background: project.accent, filter: "blur(80px)" }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 inset-x-0 h-[1px] pointer-events-none opacity-20"
          style={{ background: `linear-gradient(90deg,transparent,${project.accent},transparent)` }}
        />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
          <span
            className="font-instrument text-white leading-none tracking-[-0.04em] opacity-[0.04]"
            style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
          >
            {project.title}
          </span>
        </div>

        {/* Number label */}
        <div className="absolute top-5 left-5">
          <span className="font-mono text-[10px] text-white/30 tracking-[0.15em]">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>

        {/* CTA overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Tags */}
        <div
          className="absolute inset-x-0 bottom-0 p-5 flex gap-2 flex-wrap"
          style={{ background: "linear-gradient(to top,rgba(0,0,0,0.6),transparent)" }}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[9px] uppercase tracking-widest text-white/45 border border-white/12 rounded-full px-3 py-1 bg-black/20"
            >
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
            <span
              className="absolute inset-x-0 -bottom-0.5 h-[1px] bg-[#0D0D0B] origin-left scale-x-0 group-hover:scale-x-100"
              style={{ transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)" }}
            />
          </h3>
          <p className="font-sans text-[13px] text-[#9A9287] mt-0.5">{project.category}</p>
        </div>
        <span className="font-mono text-[11px] tracking-[0.1em] text-[#B0AA9F]">{project.year}</span>
      </div>
    </div>
  );
}

/* ── WorkShowcase ─────────────────────────────────────────────── */
export default function WorkShowcase() {
  return (
    <section
      id="work"
      className="py-16 sm:py-24 lg:py-36 bg-[#F4F0E8] overflow-hidden relative"
    >
      <style>{`
        @keyframes wk-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .wk-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: wk-scroll 32s linear infinite;
          will-change: transform;
        }
        /* Pause on hover/touch */
        .wk-wrap:hover .wk-track,
        .wk-wrap.paused .wk-track {
          animation-play-state: paused;
        }
      `}</style>

      {/* Separators */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6D1CB] to-transparent" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#E6E1DA 1px,transparent 1px),linear-gradient(to bottom,#E6E1DA 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel index={5} className="mb-5 block">
            Selected Work
          </SectionLabel>
          <h2
            className="font-instrument tracking-[-0.03em] text-[#0D0D0B] leading-[1.04]"
            style={{ fontSize: "clamp(36px, 5vw, 66px)" }}
          >
            Digital ecosystems{" "}
            <span className="italic text-[#FF5C00]">in action.</span>
          </h2>
        </motion.div>
      </div>

      {/* ── Infinite marquee — aligned with site content ── */}
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Fade masks on edges */}
        <div
          className="absolute left-6 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #F4F0E8 10%, transparent)" }}
        />
        <div
          className="absolute right-6 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #F4F0E8 10%, transparent)" }}
        />

        <div
          className="wk-wrap overflow-hidden rounded-2xl"
          onTouchStart={e => e.currentTarget.classList.add("paused")}
          onTouchEnd={e => e.currentTarget.classList.remove("paused")}
        >
          <div className="wk-track pb-2">
            {/* Original set */}
            {projects.map((project, i) => (
              <ProjectCard key={`a-${i}`} project={project} index={i} />
            ))}
            {/* Duplicate — seamless loop */}
            {projects.map((project, i) => (
              <ProjectCard key={`b-${i}`} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
