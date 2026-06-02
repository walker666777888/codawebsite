"use client";

import { useEffect, useRef } from "react";

interface Props {
  quantity?: number;
  className?: string;
  color?: string;       // dot color as "r,g,b"
  ease?: number;        // easing toward mouse (higher = slower)
  staticity?: number;   // resistance to mouse (higher = less movement)
  connections?: boolean; // draw lines between nearby dots
  connectionDistance?: number;
}

export default function ParticleCanvas({
  quantity = 100,
  className,
  color = "13,13,11",
  ease = 80,
  staticity = 50,
  connections = false,
  connectionDistance = 120,
}: Props) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse        = useRef({ x: -9999, y: -9999 });
  const canvasSize   = useRef({ w: 0, h: 0 });
  const dpr          = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── resize ── */
    const initCanvas = () => {
      const w = container.offsetWidth  || window.innerWidth;
      const h = container.offsetHeight || window.innerHeight;
      canvasSize.current = { w, h };
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };
    initCanvas();
    const ro = new ResizeObserver(initCanvas);
    ro.observe(container);

    /* ── mouse ── */
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);

    /* ── particle type ── */
    type Circle = {
      x: number; y: number;
      tx: number; ty: number;
      size: number;
      alpha: number;
      targetAlpha: number;
      dx: number; dy: number;
      magnetism: number;
    };

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const makeCircle = (): Circle => {
      const { w, h } = canvasSize.current;
      return {
        x: rand(0, w),
        y: rand(0, h),
        tx: 0,
        ty: 0,
        size: rand(0.8, 2.4),
        alpha: 0,
        targetAlpha: parseFloat(rand(0.12, 0.55).toFixed(2)),
        dx: (Math.random() - 0.5) * 0.18,
        dy: (Math.random() - 0.5) * 0.18,
        magnetism: 0.1 + Math.random() * 4,
      };
    };

    const circles: Circle[] = [];
    for (let i = 0; i < quantity; i++) circles.push(makeCircle());

    let raf: number;

    const animate = () => {
      const { w, h } = canvasSize.current;
      ctx.clearRect(0, 0, w, h);

      /* ── draw connections ── */
      if (connections) {
        for (let i = 0; i < circles.length; i++) {
          for (let j = i + 1; j < circles.length; j++) {
            const a = circles[i];
            const b = circles[j];
            const ax = a.x + a.tx, ay = a.y + a.ty;
            const bx = b.x + b.tx, by = b.y + b.ty;
            const dist = Math.hypot(ax - bx, ay - by);
            if (dist < connectionDistance) {
              const lineAlpha = (1 - dist / connectionDistance) * 0.12;
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(bx, by);
              ctx.strokeStyle = `rgba(${color},${lineAlpha.toFixed(3)})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      }

      /* ── draw & update dots ── */
      for (const c of circles) {
        c.alpha += (c.targetAlpha - c.alpha) * 0.064;
        c.x += c.dx;
        c.y += c.dy;

        c.tx += (mouse.current.x / (staticity / c.magnetism) - c.tx) / ease;
        c.ty += (mouse.current.y / (staticity / c.magnetism) - c.ty) / ease;

        ctx.beginPath();
        ctx.arc(c.x + c.tx, c.y + c.ty, c.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${c.alpha.toFixed(3)})`;
        ctx.fill();

        if (
          c.x + c.tx < -20 || c.x + c.tx > w + 20 ||
          c.y + c.ty < -20 || c.y + c.ty > h + 20
        ) {
          Object.assign(c, makeCircle());
        }
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [quantity, color, ease, staticity, connections, connectionDistance, dpr]);

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}
