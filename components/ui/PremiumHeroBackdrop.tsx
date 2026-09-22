"use client";

import React, { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   OPTION C: 3D High-Contrast Morphing Topography & Liquid CAD Wireframe
   (Guaranteed 100% visible on all displays with crisp 60fps 2D canvas)
───────────────────────────────────────────────────────────────────────── */

interface PremiumHeroBackdropProps {
  className?: string;
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
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      isHovering: false,
      shockwaves: [] as { x: number; y: number; r: number; alpha: number }[],
    };

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
        alpha: 1.0,
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

    // Grid configuration
    const cols = 45;
    const rows = 36;

    const render = () => {
      if (isVisible) {
        time += 0.022;

        if (mouse.isHovering) {
          mouse.x += (mouse.targetX - mouse.x) * 0.12;
          mouse.y += (mouse.targetY - mouse.y) * 0.12;
        } else {
          mouse.x = -9999;
          mouse.y = -9999;
        }

        ctx.clearRect(0, 0, width, height);

        // 1. Ambient Warm Bottom Glow
        const bgGlow = ctx.createRadialGradient(
          width * 0.5,
          height * 0.85,
          0,
          width * 0.5,
          height * 0.85,
          width * 0.65
        );
        bgGlow.addColorStop(0, "rgba(255, 92, 0, 0.18)");
        bgGlow.addColorStop(0.5, "rgba(255, 92, 0, 0.04)");
        bgGlow.addColorStop(1, "transparent");
        ctx.fillStyle = bgGlow;
        ctx.fillRect(0, 0, width, height);

        // 2. Cursor Spotlight
        if (mouse.isHovering && mouse.x > 0) {
          const spotGlow = ctx.createRadialGradient(
            mouse.x,
            mouse.y,
            0,
            mouse.x,
            mouse.y,
            240
          );
          spotGlow.addColorStop(0, "rgba(255, 140, 0, 0.22)");
          spotGlow.addColorStop(0.6, "rgba(255, 92, 0, 0.04)");
          spotGlow.addColorStop(1, "transparent");
          ctx.fillStyle = spotGlow;
          ctx.fillRect(0, 0, width, height);
        }

        // 3. Shockwave propagation
        for (let s = mouse.shockwaves.length - 1; s >= 0; s--) {
          const sw = mouse.shockwaves[s];
          sw.r += 14;
          sw.alpha *= 0.95;

          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 92, 0, ${sw.alpha * 0.75})`;
          ctx.lineWidth = 2.0;
          ctx.stroke();

          if (sw.alpha < 0.01) {
            mouse.shockwaves.splice(s, 1);
          }
        }

        // 4. 3D Perspective Wireframe Mesh Projection
        const points: { x: number; y: number; elevation: number; alpha: number }[][] = [];

        const horizonY = height * 0.32;
        const bottomY = height * 1.05;
        const gridWidth = width * 1.6;
        const gridOffsetLeft = -width * 0.3;

        for (let r = 0; r < rows; r++) {
          points[r] = [];
          const progressZ = r / (rows - 1); // 0 (horizon) -> 1 (foreground)
          const py = horizonY + Math.pow(progressZ, 1.8) * (bottomY - horizonY);
          const currentSpread = gridWidth * (0.2 + 0.8 * progressZ);
          const currentLeft = width * 0.5 - currentSpread * 0.5;

          for (let c = 0; c < cols; c++) {
            const progressX = c / (cols - 1);
            const px = currentLeft + progressX * currentSpread;

            // Undulating wave mathematics
            const wave1 = Math.sin(progressX * 6.0 + time + progressZ * 4.0) * 16.0;
            const wave2 = Math.cos(progressX * 10.0 - time * 0.8 + progressZ * 6.0) * 8.0;
            let elevation = (wave1 + wave2) * progressZ;

            // Mouse ripple deformation
            if (mouse.isHovering && mouse.x > 0) {
              const mDist = Math.hypot(px - mouse.x, py - mouse.y);
              if (mDist < 180) {
                const mouseForce = Math.sin(mDist * 0.08 - time * 6.0) * (1.0 - mDist / 180);
                elevation += mouseForce * 28.0;
              }
            }

            // Shockwave deformation
            for (let s = 0; s < mouse.shockwaves.length; s++) {
              const sw = mouse.shockwaves[s];
              const swDist = Math.hypot(px - sw.x, py - sw.y);
              if (Math.abs(swDist - sw.r) < 35) {
                const swForce = (1.0 - Math.abs(swDist - sw.r) / 35) * sw.alpha;
                elevation += Math.sin(swForce * Math.PI) * 35.0;
              }
            }

            // Foreground alpha attenuation
            const alpha = Math.min(1.0, (0.15 + 0.85 * progressZ));

            points[r][c] = {
              x: px,
              y: py - elevation,
              elevation,
              alpha,
            };
          }
        }

        // Draw horizontal mesh lines
        for (let r = 0; r < rows; r++) {
          const progressZ = r / (rows - 1);
          ctx.beginPath();
          ctx.moveTo(points[r][0].x, points[r][0].y);
          for (let c = 1; c < cols; c++) {
            ctx.lineTo(points[r][c].x, points[r][c].y);
          }

          // Luminous color grading from horizon to foreground
          const lineAlpha = (0.05 + 0.55 * Math.pow(progressZ, 1.4)).toFixed(3);
          ctx.strokeStyle = `rgba(255, 92, 0, ${lineAlpha})`;
          ctx.lineWidth = progressZ > 0.65 ? 1.4 : 0.8;
          ctx.stroke();
        }

        // Draw longitudinal perspective grid lines
        for (let c = 0; c < cols; c++) {
          ctx.beginPath();
          ctx.moveTo(points[0][c].x, points[0][c].y);
          for (let r = 1; r < rows; r++) {
            ctx.lineTo(points[r][c].x, points[r][c].y);
          }
          ctx.strokeStyle = "rgba(255, 140, 0, 0.18)";
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }

        // Draw glowing crest vertex points
        for (let r = 5; r < rows; r += 2) {
          for (let c = 2; c < cols; c += 3) {
            const pt = points[r][c];
            if (pt.elevation > 8.0) {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 1.6, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255, 200, 100, 0.85)";
              ctx.fill();
            }
          }
        }
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






