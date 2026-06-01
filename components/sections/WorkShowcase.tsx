"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import SectionLabel from "@/components/ui/SectionLabel";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Atreya.ai",
    category: "AI Platform",
    gradient: "from-[#06061a] via-[#0a1030] to-[#0c1848]",
    accent: "#4F8EF7",
    year: "2024",
    tags: ["AI", "SaaS", "Dashboard"],
    desc: "Intelligent AI-powered platform with real-time data processing and predictive analytics.",
  },
  {
    title: "Homer",
    category: "PropTech App",
    gradient: "from-[#060e06] via-[#091809] to-[#112611]",
    accent: "#5FCF5F",
    year: "2024",
    tags: ["Mobile", "Maps", "PropTech"],
    desc: "Hyper-local property discovery with map-first UX and smart neighborhood insights.",
  },
  {
    title: "Florapark",
    category: "E-commerce System",
    gradient: "from-[#0e060e] via-[#1a0a1a] to-[#280d35]",
    accent: "#B87FFF",
    year: "2023",
    tags: ["E-comm", "Brand", "Growth"],
    desc: "Luxury botanical brand system with conversion-optimised checkout and CRM integration.",
  },
  {
    title: "DMP Drone Fleet",
    category: "Enterprise Dashboard",
    gradient: "from-[#0e0900] via-[#1a1200] to-[#2a1c00]",
    accent: "#FF9A3C",
    year: "2023",
    tags: ["IoT", "Enterprise", "Ops"],
    desc: "Real-time fleet management dashboard for autonomous drone operations at scale.",
  },
];

function ProjectCard({
  project,
  index,
  totalCount,
}: {
  project: (typeof projects)[0];
  index: number;
  totalCount: number;
}) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3-D tilt
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 120, damping: 28 });
  const springRotY = useSpring(rotY, { stiffness: 120, damping: 28 });
  const rectRef = useRef<DOMRect | null>(null);

  const onMouseEnter = () => { rectRef.current = cardRef.current?.getBoundingClientRect() ?? null; };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = rectRef.current;
    if (!r) return;
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;
    rotX.set(-cy * 8);
    rotY.set(cx * 8);
  };

  const onMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    setHovered(false);
  };

  const numLabel = `${String(index + 1).padStart(2, "0")} / ${String(totalCount).padStart(2, "0")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="flex-[0_0_88%] sm:flex-[0_0_72%] md:flex-[0_0_56%] lg:flex-[0_0_46%] min-w-0 group"
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => { onMouseEnter(); setHovered(true); }}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX: springRotX,
          rotateY: springRotY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Image area */}
        <div
          className={`aspect-[4/3] bg-gradient-to-br ${project.gradient} rounded-2xl mb-6 relative overflow-hidden cursor-pointer`}
        >
          {/* Animated noise */}
          <div
            className="absolute inset-[-8%] opacity-[0.055] mix-blend-overlay animate-noise pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "180px 180px",
            }}
          />

          {/* Fine grid */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Accent glow — mouse-tracked via hovered */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-[200px] h-[200px] rounded-full pointer-events-none"
            style={{ background: project.accent }}
            animate={{
              opacity: hovered ? 0.22 : 0.08,
              scale: hovered ? 1.4 : 1,
              filter: hovered ? "blur(60px)" : "blur(80px)",
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Second accent blob (opposite corner) */}
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[120px] h-[120px] rounded-full pointer-events-none"
            style={{ background: project.accent }}
            animate={{
              opacity: hovered ? 0.12 : 0.03,
              scale: hovered ? 1.2 : 0.8,
              filter: "blur(50px)",
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Top edge glow line */}
          <motion.div
            className="absolute top-0 inset-x-0 h-[1px] pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`,
            }}
            animate={{ opacity: hovered ? 0.7 : 0.15 }}
            transition={{ duration: 0.4 }}
          />

          {/* Diagonal shimmer sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: "-120%", skewX: "-20deg" }}
            animate={hovered ? { x: "220%" } : { x: "-120%" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
              width: "55%",
            }}
          />

          {/* Title watermark */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
            <motion.span
              className="font-instrument text-white leading-none tracking-[-0.04em]"
              style={{ fontSize: "clamp(36px, 5.5vw, 68px)" }}
              animate={{ opacity: hovered ? 0.07 : 0.03 }}
              transition={{ duration: 0.4 }}
            >
              {project.title}
            </motion.span>
          </div>

          {/* Number label — top left */}
          <div className="absolute top-5 left-5">
            <motion.span
              className="font-mono text-[10px] text-white/30 tracking-[0.15em]"
              animate={{ opacity: hovered ? 0.6 : 0.3 }}
              transition={{ duration: 0.3 }}
            >
              {numLabel}
            </motion.span>
          </div>

          {/* Hover arrow CTA */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ scale: hovered ? 1 : 0.6, y: hovered ? 0 : 14 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
            >
              <ArrowUpRight className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>

          {/* Tags */}
          <div
            className="absolute inset-x-0 bottom-0 p-5 flex gap-2 flex-wrap"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
            }}
          >
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] uppercase tracking-widest text-white/45 border border-white/12 rounded-full px-3 py-1 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Card footer */}
        <div className="flex justify-between items-start px-1">
          <div>
            <h3 className="font-instrument text-[22px] text-[#0D0D0B] tracking-[-0.02em] leading-none mb-1.5 relative inline-block">
              {project.title}
              <span
                className="absolute inset-x-0 -bottom-0.5 h-[1px] bg-[#0D0D0B] origin-left scale-x-0 group-hover:scale-x-100"
                style={{ transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
            </h3>
            <p className="font-sans text-[13px] text-[#9A9287] mt-0.5">{project.category}</p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <motion.span
              className="font-mono text-[11px] tracking-[0.1em] text-[#B0AA9F]"
              animate={{ opacity: hovered ? 0.9 : 0.4 }}
              transition={{ duration: 0.3 }}
            >
              {project.year}
            </motion.span>
            <motion.span
              className="font-mono text-[9px] tracking-[0.05em] text-[#FF5C00] opacity-0 group-hover:opacity-100"
              style={{ transition: "opacity 0.3s ease" }}
            >
              View →
            </motion.span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WorkShowcase() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    update();
  }, [emblaApi]);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="py-16 sm:py-24 lg:py-36 bg-[#F4F0E8] overflow-hidden relative"
    >
      {/* Top separator */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6D1CB] to-transparent" />

      {/* Subtle graph paper */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #E6E1DA 1px, transparent 1px),linear-gradient(to bottom, #E6E1DA 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div style={{ y: headingY }} className="flex justify-between items-end mb-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel index={5} className="mb-5 block">Selected Work</SectionLabel>
            <h2
              className="font-instrument tracking-[-0.03em] text-[#0D0D0B] leading-[1.04]"
              style={{ fontSize: "clamp(36px, 5vw, 66px)" }}
            >
              Digital ecosystems{" "}
              <span className="italic text-[#FF5C00]">in action.</span>
            </h2>
          </motion.div>

          {/* Nav arrows + counter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden md:flex flex-col items-end gap-3"
          >
            <span className="font-mono text-[11px] text-[#9A9287] tracking-[0.15em]">
              {String(selectedIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              {[
                { fn: scrollPrev, can: canPrev, Icon: ArrowLeft,  label: "Previous project" },
                { fn: scrollNext, can: canNext, Icon: ArrowRight, label: "Next project"     },
              ].map(({ fn, can, Icon, label }, i) => (
                <motion.button
                  key={i}
                  onClick={fn}
                  disabled={!can}
                  aria-label={label}
                  whileHover={can ? { scale: 1.08, backgroundColor: "#0D0D0B", color: "#fff" } : {}}
                  whileTap={can ? { scale: 0.92 } : {}}
                  transition={{ duration: 0.22 }}
                  className="w-11 h-11 rounded-full border border-[#D8D3CC] flex items-center justify-center text-[#4D4A45] transition-colors duration-200 disabled:opacity-20 disabled:pointer-events-none"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Carousel */}
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          ref={emblaRef}
        >
          <div className="flex gap-6">
            {projects.map((project, i) => (
              <ProjectCard
                key={i}
                project={project}
                index={i}
                totalCount={projects.length}
              />
            ))}
          </div>
        </div>

        {/* Progress bar + dots */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center gap-3 mt-12"
        >
          {projects.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              animate={{
                width: i === selectedIndex ? 32 : 8,
                backgroundColor:
                  i === selectedIndex ? "#0D0D0B" : "#C8C3BB",
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-[3px] rounded-full"
            />
          ))}
          <span className="ml-auto font-mono text-[10px] text-[#B0AA9F] tracking-[0.15em]">
            Drag to explore
          </span>
        </motion.div>
      </div>
    </section>
  );
}
