"use client";

import React, { useEffect, useRef } from "react";

interface PremiumHeroBackdropProps {
  className?: string;
}

interface Star {
  x: number;
  y: number;
  r: number;
  theta: number;
  speed: number;
  size: number;
  color: string;
  alpha: number;
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
    let stars: Star[] = [];

    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      isHovering: false,
      shockwaves: [] as { x: number; y: number; r: number; alpha: number }[],
    };

    const colors = [
      "#FF5C00", // Signature Flame
      "#FF8A00", // Warm Amber
      "#FFAE42", // Golden Core
      "#FFFFFF", // Pure Star White
      "#FF3D00", // Deep Vermillion
    ];

    const initSize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      initStars();
    };

    const initStars = () => {
      stars = [];
      const count = Math.min(1200, Math.floor((width * height) / 1200));
      const maxRadius = Math.hypot(width, height) * 0.52;

      for (let i = 0; i < count; i++) {
        // Spiral galaxy logarithmic arms distribution
        const armIndex = i % 3;
        const armOffset = (armIndex * 2 * Math.PI) / 3;
        const distRatio = Math.pow(Math.random(), 1.8);
        const r = distRatio * maxRadius + 30;
        const spiralAngle = r * 0.0035 + (Math.random() - 0.5) * 0.85;
        const theta = armOffset + spiralAngle;

        stars.push({
          x: 0,
          y: 0,
          r,
          theta,
          speed: (0.003 + (1.0 - distRatio) * 0.006) * (Math.random() * 0.4 + 0.8),
          size: Math.random() < 0.12 ? Math.random() * 2.8 + 2.0 : Math.random() * 1.6 + 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.6 + 0.35,
        });
      }
    };

    initSize();

    const resizeObserver = new ResizeObserver(initSize);
    resizeObserver.observe(container);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovering = true;
    };

    const onMouseLeave = () => {
      mouse.targetX = -9999;
      mouse.targetY = -9999;
      mouse.isHovering = false;
    };

    const onPointerDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.shockwaves.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        r: 10,
        alpha: 0.9,
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("pointerdown", onPointerDown);

    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    io.observe(container);

    let time = 0;

    const render = () => {
      if (isVisible) {
        time += 0.01;

        if (mouse.isHovering) {
          mouse.x += (mouse.targetX - mouse.x) * 0.1;
          mouse.y += (mouse.targetY - mouse.y) * 0.1;
        } else {
          mouse.x = -9999;
          mouse.y = -9999;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = "screen";

        const centerX = width * 0.5;
        const centerY = height * 0.5;

        // 1. Core Accretion Disk Ambient Glow
        const coreGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 380);
        coreGlow.addColorStop(0, "rgba(255, 92, 0, 0.22)");
        coreGlow.addColorStop(0.3, "rgba(255, 140, 0, 0.08)");
        coreGlow.addColorStop(0.7, "rgba(255, 92, 0, 0.02)");
        coreGlow.addColorStop(1, "transparent");
        ctx.fillStyle = coreGlow;
        ctx.fillRect(0, 0, width, height);

        // 2. Cursor Gravitational Glow
        if (mouse.isHovering && mouse.x > 0 && mouse.y > 0) {
          const cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
          cursorGlow.addColorStop(0, "rgba(255, 92, 0, 0.28)");
          cursorGlow.addColorStop(0.5, "rgba(255, 92, 0, 0.06)");
          cursorGlow.addColorStop(1, "transparent");
          ctx.fillStyle = cursorGlow;
          ctx.fillRect(0, 0, width, height);
        }

        // 3. Render Shockwaves
        for (let s = mouse.shockwaves.length - 1; s >= 0; s--) {
          const sw = mouse.shockwaves[s];
          sw.r += 12;
          sw.alpha *= 0.94;

          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 92, 0, ${sw.alpha * 0.7})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          if (sw.alpha < 0.01) {
            mouse.shockwaves.splice(s, 1);
          }
        }

        // 4. Update & Draw Orbiting Galaxy Particles
        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];

          // Orbital velocity
          star.theta += star.speed;

          // Default orbital position
          let px = centerX + Math.cos(star.theta) * star.r;
          let py = centerY + Math.sin(star.theta) * star.r * 0.58; // Perspective tilt

          // Mouse Gravitational Attraction
          if (mouse.isHovering && mouse.x > 0) {
            const dx = mouse.x - px;
            const dy = mouse.y - py;
            const dist = Math.hypot(dx, dy);

            if (dist < 220 && dist > 1) {
              const pull = (1.0 - dist / 220) * 45;
              px += (dx / dist) * pull;
              py += (dy / dist) * pull;

              // Tangent orbital vortex
              const tx = -dy / dist;
              const ty = dx / dist;
              px += tx * pull * 0.75;
              py += ty * pull * 0.75;
            }
          }

          // Shockwave dispersion
          for (let s = 0; s < mouse.shockwaves.length; s++) {
            const sw = mouse.shockwaves[s];
            const dx = px - sw.x;
            const dy = py - sw.y;
            const dist = Math.hypot(dx, dy);
            if (Math.abs(dist - sw.r) < 30) {
              const push = (1.0 - Math.abs(dist - sw.r) / 30) * sw.alpha * 20;
              px += (dx / (dist + 0.001)) * push;
              py += (dy / (dist + 0.001)) * push;
            }
          }

          // Pulse brightness
          const pulse = Math.sin(time * 3.0 + i) * 0.15 + 0.85;
          const finalAlpha = star.alpha * pulse;

          ctx.beginPath();
          ctx.arc(px, py, star.size, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = finalAlpha;
          ctx.fill();

          // Luminous halo on bright stars
          if (star.size > 2.0) {
            ctx.beginPath();
            ctx.arc(px, py, star.size * 2.8, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = finalAlpha * 0.25;
            ctx.fill();
          }
        }

        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = "source-over";
      }

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("pointerdown", onPointerDown);
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




