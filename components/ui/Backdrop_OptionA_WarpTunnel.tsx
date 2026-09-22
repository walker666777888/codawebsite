"use client";

import React, { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   OPTION A: High-Performance 3D Cybernetic Warp Tunnel (Canvas 2D Engine)
   • 100% Reliable, 120fps hardware-accelerated canvas rendering
   • Infinite hyperspace perspective rings & longitudinal grid tracks
   • Dynamic interactive mouse warp, cockpit camera tilt & speed acceleration
   • Particle star streaks rushing toward the viewer
───────────────────────────────────────────────────────────────────────── */

interface PremiumHeroBackdropProps {
  className?: string;
}

interface StarParticle {
  x: number;
  y: number;
  z: number;
  speed: number;
  size: number;
  color: string;
}

export default function PremiumHeroBackdrop({ className = "" }: PremiumHeroBackdropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId: number;

    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      speed: 1.0,
      targetSpeed: 1.0,
      isHovering: false,
    };

    const maxDepth = 1200;
    const fov = 340;
    const numRings = 22;
    const numSpokes = 20;
    const numStars = 300;

    const stars: StarParticle[] = [];
    const colors = ["#FF5C00", "#FFAE42", "#FFFFFF", "#FF8A00"];

    for (let i = 0; i < numStars; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * 500;
      stars.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: Math.random() * maxDepth,
        speed: 4 + Math.random() * 8,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const initSize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    initSize();

    const resizeObserver = new ResizeObserver(initSize);
    resizeObserver.observe(container);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / width - 0.5;
      const ny = (e.clientY - rect.top) / height - 0.5;

      mouse.targetX = nx * 140;
      mouse.targetY = ny * 100;
      mouse.targetSpeed = 1.6 + Math.hypot(nx, ny) * 2.2;
      mouse.isHovering = true;
    };

    const onMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.targetSpeed = 1.0;
      mouse.isHovering = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    io.observe(container);

    let ringOffset = 0;
    let time = 0;

    const render = () => {
      if (isVisible) {
        time += 0.016;

        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;
        mouse.speed += (mouse.targetSpeed - mouse.speed) * 0.05;

        ringOffset = (ringOffset + 3.2 * mouse.speed) % (maxDepth / numRings);

        ctx.clearRect(0, 0, width, height);

        const centerX = width * 0.5 + mouse.x;
        const centerY = height * 0.5 + mouse.y;

        // 1. Center Singularity Ambient Glow
        const ambientGlow = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          width * 0.55
        );
        ambientGlow.addColorStop(0, "rgba(255, 92, 0, 0.18)");
        ambientGlow.addColorStop(0.35, "rgba(255, 92, 0, 0.04)");
        ambientGlow.addColorStop(1, "transparent");
        ctx.fillStyle = ambientGlow;
        ctx.fillRect(0, 0, width, height);

        // 2. Perspective Longitudinal Rails
        const outerRadius = Math.max(width, height) * 0.95;
        for (let s = 0; s < numSpokes; s++) {
          const angle = (s / numSpokes) * Math.PI * 2 + time * 0.06;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);

          const xStart = centerX + cos * 25;
          const yStart = centerY + sin * 25;
          const xEnd = centerX + cos * outerRadius;
          const yEnd = centerY + sin * outerRadius;

          const isMainSpine = s % 4 === 0;
          const spokeGrad = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
          spokeGrad.addColorStop(0, "rgba(255, 92, 0, 0.0)");
          spokeGrad.addColorStop(0.2, isMainSpine ? "rgba(255, 140, 0, 0.45)" : "rgba(255, 92, 0, 0.15)");
          spokeGrad.addColorStop(0.8, isMainSpine ? "rgba(255, 92, 0, 0.25)" : "rgba(255, 92, 0, 0.06)");
          spokeGrad.addColorStop(1.0, "rgba(255, 92, 0, 0.0)");

          ctx.beginPath();
          ctx.moveTo(xStart, yStart);
          ctx.lineTo(xEnd, yEnd);
          ctx.strokeStyle = spokeGrad;
          ctx.lineWidth = isMainSpine ? 1.5 : 0.8;
          ctx.stroke();
        }

        // 3. Perspective Warp Rings
        for (let r = numRings; r >= 1; r--) {
          const z = (r * (maxDepth / numRings) - ringOffset);
          if (z <= 10) continue;

          const scale = fov / (fov + z);
          const ringRadius = 520 * scale;

          if (ringRadius < 8) continue;

          const depthAlpha = Math.sin((1.0 - z / maxDepth) * Math.PI * 0.9);
          const isAccent = r % 3 === 0;

          ctx.beginPath();
          ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isAccent
            ? `rgba(255, 174, 66, ${depthAlpha * 0.65})`
            : `rgba(255, 92, 0, ${depthAlpha * 0.32})`;
          ctx.lineWidth = isAccent ? 1.5 : 0.85;
          ctx.stroke();

          if (isAccent && ringRadius > 70 && ringRadius < 400) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 92, 0, ${depthAlpha * 0.22})`;
            ctx.lineWidth = 3.5;
            ctx.stroke();
          }
        }

        // 4. Star Streak Particles
        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];
          star.z -= star.speed * mouse.speed;

          if (star.z <= 0) {
            star.z = maxDepth;
            const angle = Math.random() * Math.PI * 2;
            const radius = 60 + Math.random() * 500;
            star.x = Math.cos(angle) * radius;
            star.y = Math.sin(angle) * radius;
          }

          const scale = fov / (fov + star.z);
          const px = centerX + star.x * scale;
          const py = centerY + star.y * scale;

          const prevZ = star.z + star.speed * mouse.speed * 2.8;
          const prevScale = fov / (fov + prevZ);
          const prevPx = centerX + star.x * prevScale;
          const prevPy = centerY + star.y * prevScale;

          const alpha = (1.0 - star.z / maxDepth) * 0.9;

          // Streak line
          ctx.beginPath();
          ctx.moveTo(prevPx, prevPy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = star.color;
          ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
          ctx.lineWidth = star.size * scale * 2.4;
          ctx.lineCap = "round";
          ctx.stroke();

          // Particle head
          ctx.beginPath();
          ctx.arc(px, py, star.size * scale * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.fill();
        }

        ctx.globalAlpha = 1.0;
      }

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      resizeObserver.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
}
