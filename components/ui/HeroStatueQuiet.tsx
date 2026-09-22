"use client";

import React from "react";
import { motion } from "motion/react";

export default function HeroStatueQuiet({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`hidden md:flex absolute inset-0 z-[1] items-center justify-center pointer-events-none overflow-hidden select-none ${className}`}
    >
      {/* Subtle deep ambient glow behind the sculpture */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none" />

      {/* Understated, Quiet Luxury Sculpture Watermark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.38 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full max-w-4xl flex items-center justify-center"
      >
        <img
          src="/images/hero-statue.jpg"
          alt=""
          className="w-auto h-[80vh] max-h-[750px] object-contain opacity-35 mix-blend-screen pointer-events-none grayscale contrast-125"
          style={{
            maskImage: "radial-gradient(ellipse 65% 65% at 50% 50%, black 20%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 65% 65% at 50% 50%, black 20%, transparent 75%)",
          }}
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>
    </div>
  );
}
