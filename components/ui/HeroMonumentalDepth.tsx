"use client";

import React, { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useIsLowEndDevice } from "@/hooks/useIsLowEndDevice";

export default function HeroMonumentalDepth({
  className = "",
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const statueRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  const isLowTier = useIsLowEndDevice();
  const prefersReducedMotion = useReducedMotion();
  const disableInteractive = isLowTier || prefersReducedMotion;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (disableInteractive) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;

      targetX = nx * 16;
      targetY = ny * 10;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      time += 0.015;
      const ambientY = Math.sin(time) * 4;

      currentX = lerp(currentX, targetX, 0.05);
      currentY = lerp(currentY, targetY + ambientY, 0.05);

      if (statueRef.current) {
        statueRef.current.style.transform = `
          perspective(1000px)
          rotateY(${(currentX * 0.4).toFixed(2)}deg)
          rotateX(${(-currentY * 0.3).toFixed(2)}deg)
          translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0px)
        `;
      }

      if (lightRef.current) {
        lightRef.current.style.transform = `translate3d(${(-currentX * 1.5).toFixed(1)}px, ${(-currentY * 1.5).toFixed(1)}px, 0px)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [disableInteractive]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`hidden md:flex absolute inset-0 z-[2] items-center justify-center pointer-events-none overflow-hidden select-none ${className}`}
    >
      {/* Background Volumetric Aura */}
      <div
        ref={lightRef}
        className="absolute w-[640px] h-[640px] rounded-full bg-gradient-to-tr from-coda-accent/20 via-coda-accent/5 to-transparent blur-[130px] pointer-events-none transition-transform duration-75 ease-out"
      />

      {/* The High-Resolution Sculpture Layer */}
      <div
        ref={statueRef}
        className="relative w-full h-full max-w-5xl flex items-center justify-center transition-opacity duration-1000 ease-out"
        style={{
          transformStyle: "preserve-3d",
          opacity: mounted ? 1 : 0,
        }}
      >
        <img
          src="/images/hero-statue.jpg"
          alt="Citizen Of Digital Age Sculpture"
          className="w-auto h-[88vh] max-h-[850px] object-contain opacity-80 mix-blend-screen drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)] pointer-events-none"
          style={{
            maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 45%, transparent 88%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 45%, transparent 88%)",
          }}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </div>
  );
}
