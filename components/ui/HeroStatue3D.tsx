"use client";

import React, { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useIsLowEndDevice } from "@/hooks/useIsLowEndDevice";

export default function HeroStatue3D({
  className = "",
}: {
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isLowTier = useIsLowEndDevice();
  const prefersReducedMotion = useReducedMotion();
  const disableInteractive = isLowTier || prefersReducedMotion;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (disableInteractive) return;

    let rafId: number;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetTransX = 0;
    let targetTransY = 0;
    let targetLightX = 50;
    let targetLightY = 40;

    let currentRotX = 0;
    let currentRotY = 0;
    let currentTransX = 0;
    let currentTransY = 0;
    let currentLightX = 50;
    let currentLightY = 40;

    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;

      // Subtle, restrained luxury tilt (max 6deg)
      targetRotY = nx * 7;
      targetRotX = -ny * 5;
      targetTransX = nx * 12;
      targetTransY = ny * 8;

      targetLightX = (e.clientX / w) * 100;
      targetLightY = (e.clientY / h) * 100;
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      targetTransX = 0;
      targetTransY = 0;
      targetLightX = 50;
      targetLightY = 40;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      time += 0.015;

      // Organic breathing drift
      const floatY = Math.sin(time) * 6;
      const floatRot = Math.cos(time * 0.7) * 0.8;

      currentRotX = lerp(currentRotX, targetRotX + floatRot, 0.05);
      currentRotY = lerp(currentRotY, targetRotY, 0.05);
      currentTransX = lerp(currentTransX, targetTransX, 0.05);
      currentTransY = lerp(currentTransY, targetTransY + floatY, 0.05);
      currentLightX = lerp(currentLightX, targetLightX, 0.06);
      currentLightY = lerp(currentLightY, targetLightY, 0.06);

      if (cardRef.current) {
        cardRef.current.style.transform = `
          perspective(1400px)
          rotateX(${currentRotX.toFixed(2)}deg)
          rotateY(${currentRotY.toFixed(2)}deg)
          translate3d(${currentTransX.toFixed(1)}px, ${currentTransY.toFixed(1)}px, 0px)
        `;
      }

      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle 600px at ${currentLightX.toFixed(1)}% ${currentLightY.toFixed(1)}%, rgba(255, 92, 0, 0.22) 0%, rgba(255, 92, 0, 0.06) 40%, transparent 70%)`;
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
      aria-hidden="true"
      className={`hidden md:flex absolute inset-0 z-[2] items-center justify-center pointer-events-none overflow-hidden select-none ${className}`}
      style={{ perspective: "1400px" }}
    >
      <div
        ref={cardRef}
        className="relative w-full h-full max-w-5xl flex items-center justify-center transition-opacity duration-1000 ease-out"
        style={{
          transformStyle: "preserve-3d",
          opacity: mounted ? 1 : 0,
        }}
      >
        {/* Soft atmospheric ambient orange bloom */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-coda-accent/15 blur-[120px] pointer-events-none"
          style={{ transform: "translateZ(-60px)" }}
        />

        {/* Dynamic cursor lighting layer */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none mix-blend-screen transition-[background] duration-100 ease-out z-[3]"
          style={{
            transform: "translateZ(20px)",
            maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 40%, transparent 80%)",
          }}
        />

        {/* Neoclassical Sculpture */}
        <div
          className="relative flex items-center justify-center"
          style={{ transform: "translateZ(0px)" }}
        >
          <img
            src="/images/hero-statue.jpg"
            alt="Citizen Of Digital Age Sculpture"
            className="w-auto h-[84vh] max-h-[800px] object-contain opacity-75 mix-blend-screen pointer-events-none"
            style={{
              maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 35%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 35%, transparent 85%)",
            }}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  );
}
