"use client";

import React, { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   OPTION D: Sleek Interactive Laser Spotlight Matrix & Kinetic Spark Trails
   (Note: Option B is preserved in Backdrop_OptionB_Galaxy.tsx,
          Option C is preserved in Backdrop_OptionC_Topography.tsx)
   
   • Minimalist, high-end architectural quantum grid
   • Ethereal ribbon of luminous flame orange laser light following cursor
   • Kinetic spark particle explosions on movement and clicks
   • Proximity intersection illumination with surgical precision
───────────────────────────────────────────────────────────────────────── */

interface PremiumHeroBackdropProps {
  className?: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
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

    const trail: TrailPoint[] = [];
    let sparks: Spark[] = [];

    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      lastX: -9999,
      lastY: -9999,
      speed: 0,
      isHovering: false,
    };

    const sparkColors = ["#FF5C00", "#FF8A00", "#FFAE42", "#FFFFFF", "#FF3D00"];

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

    const spawnSparks = (x: number, y: number, count: number, speedMult = 1.0) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 4.5 + 1.5) * speedMult;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.4 + 1.0,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
          alpha: 1.0,
          decay: Math.random() * 0.03 + 0.015,
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

      if (mouse.lastX > 0) {
        const dist = Math.hypot(newX - mouse.lastX, newY - mouse.lastY);
        mouse.speed = dist;
        if (dist > 8) {
          spawnSparks(newX, newY, Math.min(6, Math.floor(dist / 6)), 0.7);
        }
      }

      mouse.lastX = newX;
      mouse.lastY = newY;
      mouse.targetX = newX;
      mouse.targetY = newY;
      mouse.isHovering = true;
    };

    const onMouseLeave = () => {
      mouse.targetX = -9999;
      mouse.targetY = -9999;
      mouse.lastX = -9999;
      mouse.lastY = -9999;
      mouse.isHovering = false;
    };

    const onPointerDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      spawnSparks(e.clientX - rect.left, e.clientY - rect.top, 35, 2.2);
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
    const gridSize = 56;

    const render = () => {
      if (isVisible) {
        time += 0.016;

        if (mouse.isHovering) {
          mouse.x += (mouse.targetX - mouse.x) * 0.18;
          mouse.y += (mouse.targetY - mouse.y) * 0.18;

          trail.unshift({ x: mouse.x, y: mouse.y, age: 1.0 });
          if (trail.length > 32) trail.pop();
        } else {
          mouse.x = -9999;
          mouse.y = -9999;
        }

        ctx.clearRect(0, 0, width, height);

        // 1. Subtle Center Ambient Light
        const centerGlow = ctx.createRadialGradient(
          width * 0.5,
          height * 0.5,
          0,
          width * 0.5,
          height * 0.5,
          width * 0.55
        );
        centerGlow.addColorStop(0, "rgba(255, 92, 0, 0.08)");
        centerGlow.addColorStop(0.5, "rgba(255, 92, 0, 0.015)");
        centerGlow.addColorStop(1, "transparent");
        ctx.fillStyle = centerGlow;
        ctx.fillRect(0, 0, width, height);

        // 2. Cursor Dynamic Laser Spotlight
        if (mouse.isHovering && mouse.x > 0) {
          const spotGlow = ctx.createRadialGradient(
            mouse.x,
            mouse.y,
            0,
            mouse.x,
            mouse.y,
            280
          );
          spotGlow.addColorStop(0, "rgba(255, 92, 0, 0.25)");
          spotGlow.addColorStop(0.4, "rgba(255, 140, 0, 0.06)");
          spotGlow.addColorStop(1, "transparent");
          ctx.fillStyle = spotGlow;
          ctx.fillRect(0, 0, width, height);
        }

        // 3. Precision Quantum Architectural Grid with Proximity Illumination
        const numCols = Math.ceil(width / gridSize) + 1;
        const numRows = Math.ceil(height / gridSize) + 1;

        for (let i = 0; i < numCols; i++) {
          const x = i * gridSize;
          let colAlpha = 0.04;

          if (mouse.isHovering && mouse.x > 0) {
            const dist = Math.abs(x - mouse.x);
            if (dist < 180) {
              colAlpha = 0.04 + (1.0 - dist / 180) * 0.22;
            }
          }

          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.strokeStyle = `rgba(255, 92, 0, ${colAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }

        for (let j = 0; j < numRows; j++) {
          const y = j * gridSize;
          let rowAlpha = 0.04;

          if (mouse.isHovering && mouse.y > 0) {
            const dist = Math.abs(y - mouse.y);
            if (dist < 180) {
              rowAlpha = 0.04 + (1.0 - dist / 180) * 0.22;
            }
          }

          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.strokeStyle = `rgba(255, 92, 0, ${rowAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }

        // 4. Grid Intersections (Crosshairs / Nodes)
        for (let i = 0; i < numCols; i++) {
          for (let j = 0; j < numRows; j++) {
            const x = i * gridSize;
            const y = j * gridSize;

            let nodeAlpha = 0.08;
            let nodeSize = 1.2;

            if (mouse.isHovering && mouse.x > 0) {
              const dist = Math.hypot(x - mouse.x, y - mouse.y);
              if (dist < 200) {
                const prox = 1.0 - dist / 200;
                nodeAlpha = 0.08 + prox * 0.85;
                nodeSize = 1.2 + prox * 2.2;
              }
            }

            ctx.beginPath();
            ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 140, 50, ${nodeAlpha})`;
            ctx.fill();
          }
        }

        // 5. Draw Glowing Laser Fluid Ribbon Trail
        if (trail.length > 2) {
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let k = 1; k < trail.length - 1; k++) {
            const xc = (trail[k].x + trail[k + 1].x) * 0.5;
            const yc = (trail[k].y + trail[k + 1].y) * 0.5;
            ctx.quadraticCurveTo(trail[k].x, trail[k].y, xc, yc);
          }
          ctx.strokeStyle = "rgba(255, 92, 0, 0.65)";
          ctx.lineWidth = 3.5;
          ctx.lineCap = "round";
          ctx.stroke();

          // Inner white core
          ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // 6. Update & Draw Sparks
        for (let s = sparks.length - 1; s >= 0; s--) {
          const sp = sparks[s];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vx *= 0.95;
          sp.vy *= 0.95;
          sp.alpha -= sp.decay;

          if (sp.alpha <= 0) {
            sparks.splice(s, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fillStyle = sp.color;
          ctx.globalAlpha = Math.max(0, sp.alpha);
          ctx.fill();

          // Spark glow
          if (sp.size > 1.8) {
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.size * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = sp.color;
            ctx.globalAlpha = Math.max(0, sp.alpha * 0.3);
            ctx.fill();
          }
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







