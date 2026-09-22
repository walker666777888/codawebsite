"use client";

import React, { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useIsLowEndDevice } from "@/hooks/useIsLowEndDevice";

export default function HeroStatueShowcase({
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
    let targetLightX = 50;
    let targetLightY = 50;

    let currentRotX = 0;
    let currentRotY = 0;
    let currentLightX = 50;
    let currentLightY = 50;

    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;

      targetRotY = nx * 10;
      targetRotX = -ny * 8;
      targetLightX = (e.clientX / w) * 100;
      targetLightY = (e.clientY / h) * 100;
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
      targetLightX = 50;
      targetLightY = 50;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      time += 0.018;

      const floatY = Math.sin(time) * 5;
      const floatRot = Math.cos(time * 0.8) * 0.9;

      currentRotX = lerp(currentRotX, targetRotX + floatRot, 0.06);
      currentRotY = lerp(currentRotY, targetRotY, 0.06);
      currentLightX = lerp(currentLightX, targetLightX, 0.07);
      currentLightY = lerp(currentLightY, targetLightY, 0.07);

      if (cardRef.current) {
        cardRef.current.style.transform = `
          perspective(1200px)
          rotateX(${currentRotX.toFixed(2)}deg)
          rotateY(${currentRotY.toFixed(2)}deg)
          translateY(${floatY.toFixed(1)}px)
        `;
      }

      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle 350px at ${currentLightX.toFixed(1)}% ${currentLightY.toFixed(1)}%, rgba(255, 92, 0, 0.28) 0%, rgba(255, 92, 0, 0.05) 45%, transparent 70%)`;
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
      className={`hidden lg:flex items-center justify-center pointer-events-none select-none relative ${className}`}
      style={{ perspective: "1200px" }}
    >
      {/* ── 3D Showcase Card ── */}
      <div
        ref={cardRef}
        className="relative w-[380px] xl:w-[420px] h-[520px] xl:h-[560px] rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-black/60 backdrop-blur-xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col items-center justify-between p-7 transition-opacity duration-1000 ease-out"
        style={{
          transformStyle: "preserve-3d",
          opacity: mounted ? 1 : 0,
        }}
      >
        {/* Ambient Backlight Glow */}
        <div
          className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-coda-accent/20 blur-[90px] pointer-events-none"
          style={{ transform: "translateZ(-40px)" }}
        />

        {/* Dynamic Specular Light Sweep */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none mix-blend-screen transition-[background] duration-75 ease-out z-[2]"
          style={{ transform: "translateZ(10px)" }}
        />

        {/* Card Header Info */}
        <div
          className="w-full flex items-center justify-between font-mono text-[10px] tracking-widest text-white/50 z-[3]"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-coda-accent shadow-[0_0_8px_#FF5C00]" />
            <span className="text-white/80 font-medium tracking-wider">SCULPTURE // 01</span>
          </div>
          <span className="text-white/40">EST. DIGITAL ERA</span>
        </div>

        {/* Marble Sculpture */}
        <div
          className="relative flex-1 w-full flex items-center justify-center my-2"
          style={{ transform: "translateZ(30px)" }}
        >
          <img
            src="/images/hero-statue.jpg"
            alt="Citizen Of Digital Age Sculpture"
            className="w-auto h-[380px] xl:h-[420px] object-contain opacity-90 mix-blend-screen drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] pointer-events-none"
            style={{
              maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 45%, transparent 90%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 45%, transparent 90%)",
            }}
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Card Footer Info */}
        <div
          className="w-full flex items-center justify-between font-mono text-[10px] tracking-widest text-white/40 z-[3] pt-3 border-t border-white/5"
          style={{ transform: "translateZ(20px)" }}
        >
          <span>MONOLITHIC CRAFT</span>
          <span className="text-coda-accent font-semibold">100% UNFAIR ADVANTAGE</span>
        </div>
      </div>
    </div>
  );
}
