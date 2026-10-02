"use client";

import React, { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   OPTION C: 3D High-Contrast Morphing Topography & Liquid CAD Wireframe
   (Guaranteed 100% visible on all displays with crisp 60fps 2D canvas)

   Perf notes: vertex data lives in pre-allocated typed arrays (no per-frame
   garbage), per-row styles and gradients are built once, same-style strokes
   are batched, and the RAF loop fully stops while the hero is off-screen.
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
    let rafId = 0;
    let running = false;

    // Grid configuration
    const cols = 45;
    const rows = 36;
    const N = rows * cols;

    // Pre-allocated vertex buffers
    const ptX = new Float32Array(N);
    const ptY = new Float32Array(N);
    const ptE = new Float32Array(N);

    // Per-row constants (depend only on the row index)
    const rowZ = new Float32Array(rows);
    const rowCurve = new Float32Array(rows);
    const rowWidth = new Float32Array(rows);
    const rowStroke: string[] = [];
    for (let r = 0; r < rows; r++) {
      const progressZ = r / (rows - 1);
      rowZ[r] = progressZ;
      rowCurve[r] = Math.pow(progressZ, 1.8);
      rowWidth[r] = progressZ > 0.65 ? 1.4 : 0.8;
      // Luminous color grading from horizon to foreground
      rowStroke[r] = `rgba(255, 92, 0, ${(0.05 + 0.55 * Math.pow(progressZ, 1.4)).toFixed(3)})`;
    }

    let bgGlow: CanvasGradient | null = null;

    // Cursor spotlight gradient built once around the origin and positioned
    // with a translate each frame (identical pixels, no per-frame allocation).
    const spotGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 240);
    spotGlow.addColorStop(0, "rgba(255, 140, 0, 0.22)");
    spotGlow.addColorStop(0.6, "rgba(255, 92, 0, 0.04)");
    spotGlow.addColorStop(1, "transparent");

    const mouse = {
      x: -9999,
      y: -9999,
      clientX: 0,
      clientY: 0,
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 1. Ambient warm bottom glow — only depends on size
      bgGlow = ctx.createRadialGradient(
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
    };

    initSize();

    const resizeObserver = new ResizeObserver(initSize);
    resizeObserver.observe(container);

    // Only record the pointer here; the container rect is read once per
    // frame inside render instead of forcing layout on every mousemove.
    const onMouseMove = (e: MouseEvent) => {
      mouse.clientX = e.clientX;
      mouse.clientY = e.clientY;
      mouse.isHovering = true;
    };

    const onMouseLeave = () => {
      mouse.isHovering = false;
    };

    const onPointerDown = (e: MouseEvent) => {
      if (!running) return;
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
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.022;

      if (mouse.isHovering) {
        const rect = container.getBoundingClientRect();
        const targetX = mouse.clientX - rect.left;
        const targetY = mouse.clientY - rect.top;
        mouse.x += (targetX - mouse.x) * 0.12;
        mouse.y += (targetY - mouse.y) * 0.12;
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Ambient Warm Bottom Glow
      if (bgGlow) {
        ctx.fillStyle = bgGlow;
        ctx.fillRect(0, 0, width, height);
      }

      const hoverActive = mouse.isHovering && mouse.x > 0;
      const mx = mouse.x;
      const my = mouse.y;

      // 2. Cursor Spotlight
      if (hoverActive) {
        ctx.translate(mx, my);
        ctx.fillStyle = spotGlow;
        ctx.fillRect(-mx, -my, width, height);
        ctx.translate(-mx, -my);
      }

      // 3. Shockwave propagation
      const waves = mouse.shockwaves;
      for (let s = waves.length - 1; s >= 0; s--) {
        const sw = waves[s];
        sw.r += 14;
        sw.alpha *= 0.95;

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 92, 0, ${sw.alpha * 0.75})`;
        ctx.lineWidth = 2.0;
        ctx.stroke();

        if (sw.alpha < 0.01) {
          waves.splice(s, 1);
        }
      }
      const waveCount = waves.length;

      // 4. 3D Perspective Wireframe Mesh Projection
      const horizonY = height * 0.32;
      const bottomY = height * 1.05;
      const gridWidth = width * 1.6;

      for (let r = 0; r < rows; r++) {
        const progressZ = rowZ[r]; // 0 (horizon) -> 1 (foreground)
        const py = horizonY + rowCurve[r] * (bottomY - horizonY);
        const currentSpread = gridWidth * (0.2 + 0.8 * progressZ);
        const currentLeft = width * 0.5 - currentSpread * 0.5;
        const base = r * cols;

        for (let c = 0; c < cols; c++) {
          const progressX = c / (cols - 1);
          const px = currentLeft + progressX * currentSpread;

          // Undulating wave mathematics
          const wave1 = Math.sin(progressX * 6.0 + time + progressZ * 4.0) * 16.0;
          const wave2 = Math.cos(progressX * 10.0 - time * 0.8 + progressZ * 6.0) * 8.0;
          let elevation = (wave1 + wave2) * progressZ;

          // Mouse ripple deformation
          if (hoverActive) {
            const dx = px - mx;
            const dy = py - my;
            const mDist = Math.sqrt(dx * dx + dy * dy);
            if (mDist < 180) {
              const mouseForce = Math.sin(mDist * 0.08 - time * 6.0) * (1.0 - mDist / 180);
              elevation += mouseForce * 28.0;
            }
          }

          // Shockwave deformation
          for (let s = 0; s < waveCount; s++) {
            const sw = waves[s];
            const dx = px - sw.x;
            const dy = py - sw.y;
            const ring = Math.abs(Math.sqrt(dx * dx + dy * dy) - sw.r);
            if (ring < 35) {
              const swForce = (1.0 - ring / 35) * sw.alpha;
              elevation += Math.sin(swForce * Math.PI) * 35.0;
            }
          }

          const i = base + c;
          ptX[i] = px;
          ptY[i] = py - elevation;
          ptE[i] = elevation;
        }
      }

      // Draw horizontal mesh lines (per-row colour grading)
      for (let r = 0; r < rows; r++) {
        const base = r * cols;
        ctx.beginPath();
        ctx.moveTo(ptX[base], ptY[base]);
        for (let c = 1; c < cols; c++) {
          ctx.lineTo(ptX[base + c], ptY[base + c]);
        }
        ctx.strokeStyle = rowStroke[r];
        ctx.lineWidth = rowWidth[r];
        ctx.stroke();
      }

      // Draw longitudinal perspective grid lines — one style, and the
      // columns never overlap, so a single batched stroke is pixel-identical.
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        ctx.moveTo(ptX[c], ptY[c]);
        for (let r = 1; r < rows; r++) {
          const i = r * cols + c;
          ctx.lineTo(ptX[i], ptY[i]);
        }
      }
      ctx.strokeStyle = "rgba(255, 140, 0, 0.18)";
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // Draw glowing crest vertex points (batched into one fill)
      ctx.beginPath();
      for (let r = 5; r < rows; r += 2) {
        for (let c = 2; c < cols; c += 3) {
          const i = r * cols + c;
          if (ptE[i] > 8.0) {
            ctx.moveTo(ptX[i] + 1.6, ptY[i]);
            ctx.arc(ptX[i], ptY[i], 1.6, 0, Math.PI * 2);
          }
        }
      }
      ctx.fillStyle = "rgba(255, 200, 100, 0.85)";
      ctx.fill();

      rafId = requestAnimationFrame(render);
    };

    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(render);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    // Fully stop the loop (not just skip drawing) once the hero leaves view.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    io.observe(container);

    return () => {
      stop();
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
