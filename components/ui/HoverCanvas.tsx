"use client";

import { useEffect, useRef } from "react";

export type CanvasEffect = "matrix" | "spheres" | "network" | "plasma";

type Size = () => { width: number; height: number };
type Mouse = { x: number; y: number; has: boolean };
type StepFn = (t: number) => void;
type Builder = (ctx: CanvasRenderingContext2D, size: Size, mouse: Mouse) => StepFn;

/* ════════════════════════════════════════════════════════════════
   EFFECT BUILDERS
═══════════════════════════════════════════════════════════════ */
const builders: Record<CanvasEffect, Builder> = {

  /* ── Card 1: Matrix rain — denser, darker, faster ── */
  matrix(ctx, size) {
    const fontSize = 9;
    const glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\|{}[]!@#$%^&*".split("");
    let cols = 0;
    // Each column gets its own speed so they fall at different rates
    let drops: number[] = [];
    let speeds: number[] = [];
    let lastW = -1;

    return () => {
      const { width, height } = size();
      if (width !== lastW) {
        lastW = width;
        cols = Math.max(1, Math.floor(width / fontSize));
        drops  = Array.from({ length: cols }, () => Math.random() * -60);
        speeds = Array.from({ length: cols }, () => 0.38 + Math.random() * 0.72);
      }

      // Very light paper wash — long bright trails
      ctx.fillStyle = "rgba(251,249,244,0.14)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px ui-monospace, monospace`;
      ctx.textBaseline = "top";

      for (let i = 0; i < cols; i++) {
        const ch = glyphs[(Math.random() * glyphs.length) | 0];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Top glyph in each stream is bright white-orange, rest fade down
        const rand = Math.random();
        if (rand > 0.88) {
          ctx.fillStyle = "rgba(255,255,220,0.98)";   // bright white lead
        } else if (rand > 0.72) {
          ctx.fillStyle = "rgba(255,92,0,0.90)";       // orange
        } else if (rand > 0.50) {
          ctx.fillStyle = "rgba(255,150,60,0.70)";     // mid orange
        } else if (rand > 0.28) {
          ctx.fillStyle = "rgba(200,100,20,0.55)";     // dark amber
        } else {
          ctx.fillStyle = "rgba(74,70,63,0.42)";       // muted ink tail
        }
        ctx.fillText(ch, x, y);

        if (y > height && Math.random() > 0.965) {
          drops[i] = Math.random() * -20;
        }
        drops[i] += speeds[i];
      }
    };
  },

  /* ── Card 2: Continuously falling spheres — keep spawning forever ── */
  spheres(ctx, size) {
    type Ball = {
      x: number; y: number; vy: number; vx: number;
      r: number; alpha: number; col: string;
    };
    const GRAV = 0.28;
    const BOUNCE = 0.52;
    const MAX_BALLS = 55;
    let balls: Ball[] = [];
    let inited = false;
    let frameCount = 0;

    const spawn = (w: number, startY = -20): Ball => {
      const palette = [
        "255,92,0", "255,130,50", "220,80,0",
        "255,160,80", "180,60,0", "255,200,120",
      ];
      return {
        x: 10 + Math.random() * Math.max(1, w - 20),
        y: startY - Math.random() * 60,
        vy: 1.2 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.6,
        r: 3.5 + Math.random() * 6,
        alpha: 0.9 + Math.random() * 0.1,
        col: palette[(Math.random() * palette.length) | 0],
      };
    };

    return () => {
      const { width: w, height: h } = size();
      frameCount++;

      if (!inited) {
        // Pre-seed balls spread across the card height
        balls = Array.from({ length: 28 }, () => {
          const b = spawn(w);
          b.y = Math.random() * h;
          b.vy = 1.0 + Math.random() * 1.8;
          return b;
        });
        inited = true;
      }

      ctx.clearRect(0, 0, w, h);

      // Spawn new ball every ~6 frames if under cap
      if (frameCount % 6 === 0 && balls.length < MAX_BALLS) {
        balls.push(spawn(w));
      }

      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        b.vy += GRAV;
        b.y += b.vy;
        b.x += b.vx;

        const floor = h - b.r - 1;
        if (b.y >= floor) {
          b.y = floor;
          b.vy *= -BOUNCE;
          // after enough bounces, gently fade and remove
          if (Math.abs(b.vy) < 0.8) {
            b.alpha -= 0.035;
          }
        }

        // Remove and respawn off-screen top
        if (b.alpha <= 0 || b.x < -20 || b.x > w + 20) {
          balls.splice(i, 1);
          balls.push(spawn(w));
          continue;
        }

        // Shiny sphere gradient
        const g = ctx.createRadialGradient(
          b.x - b.r * 0.35, b.y - b.r * 0.4, b.r * 0.05,
          b.x, b.y, b.r
        );
        g.addColorStop(0,    `rgba(255,255,255,${0.7 * b.alpha})`);
        g.addColorStop(0.3,  `rgba(${b.col},${0.9 * b.alpha})`);
        g.addColorStop(0.75, `rgba(${b.col},${0.7 * b.alpha})`);
        g.addColorStop(1,    `rgba(${b.col},0)`);

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Subtle shadow beneath ball
        if (b.y > h - b.r * 5) {
          const shadowAlpha = (1 - (h - b.r - b.y) / (b.r * 4)) * 0.18 * b.alpha;
          if (shadowAlpha > 0.01) {
            ctx.beginPath();
            ctx.ellipse(b.x, h - 2, b.r * 0.9, b.r * 0.2, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,0,0,${shadowAlpha})`;
            ctx.fill();
          }
        }
      }
    };
  },

  /* ── Card 3: Dense constellation network, high contrast, mouse-reactive ── */
  network(ctx, size, mouse) {
    type Node = { x: number; y: number; vx: number; vy: number; pulse: number };
    let nodes: Node[] = [];
    let inited = false;
    const MAX_D = 110;
    const MAX_D2 = MAX_D * MAX_D;
    const MOUSE_D = 130;
    const MOUSE_D2 = MOUSE_D * MOUSE_D;

    return () => {
      const { width: w, height: h } = size();
      if (!inited) {
        // More nodes — fixed minimum 40
        const count = Math.max(40, Math.min(70, Math.floor((w * h) / 4500)));
        nodes = Array.from({ length: count }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          pulse: Math.random() * Math.PI * 2,
        }));
        inited = true;
      }
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.04;
        if (n.x <= 0 || n.x >= w) n.vx *= -1;
        if (n.y <= 0 || n.y >= h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));

        // Mouse attraction
        if (mouse.has) {
          const dx = mouse.x - n.x, dy = mouse.y - n.y, d2 = dx * dx + dy * dy;
          if (d2 < 22000 && d2 > 1) {
            const f = 0.018 / Math.sqrt(d2);
            n.vx += dx * f;
            n.vy += dy * f;
          }
        }
        n.vx = Math.max(-0.9, Math.min(0.9, n.vx));
        n.vy = Math.max(-0.9, Math.min(0.9, n.vy));
      }

      // Draw lines between close nodes
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < MAX_D2) {
            const alpha = (1 - d2 / MAX_D2) * 0.55;
            ctx.strokeStyle = `rgba(255,92,0,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Mouse connection lines (orange, bold)
        if (mouse.has) {
          const dx = a.x - mouse.x, dy = a.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < MOUSE_D2) {
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = `rgba(255,92,0,${(1 - d2 / MOUSE_D2) * 0.85})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.lineWidth = 1;
          }
        }
      }

      // Draw nodes — pulsing size, warm orange
      for (const n of nodes) {
        const r = 2.2 + Math.sin(n.pulse) * 0.8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,92,0,0.85)";
        ctx.fill();
      }

      // Draw cursor dot
      if (mouse.has && mouse.x > 0) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,92,0,0.9)";
        ctx.fill();
        // Outer ring
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,92,0,0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };
  },

  /* ── Card 4: Orange wave lines only — no color fill ── */
  plasma(ctx, size) {
    return (t) => {
      const { width: w, height: h } = size();
      const time = t * 0.0007;
      ctx.clearRect(0, 0, w, h);

      for (let k = 0; k < 12; k++) {
        const amp   = h * (0.04 + k * 0.018);
        const base  = h * (0.06 + k * 0.082);
        const freq  = 0.007 + k * 0.002;
        const phase = time * (0.9 + k * 0.4);
        const alpha = 0.45 - k * 0.025;

        ctx.beginPath();
        ctx.lineWidth = 1.4 - k * 0.07;

        for (let x = 0; x <= w; x += 3) {
          const y =
            base +
            Math.sin(x * freq + phase) * amp +
            Math.sin(x * freq * 0.55 + phase * 1.4) * amp * 0.45 +
            Math.cos(x * freq * 1.3 + phase * 0.7) * amp * 0.2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255,${80 + k * 10},0,${alpha})`;
        ctx.stroke();
      }
    };
  },
};

/* ════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function HoverCanvas({
  effect,
  active,
}: {
  effect: CanvasEffect;
  active: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<{ start: () => void; scheduleStop: () => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0, height = 0;
    let raf: number | null = null;
    let stopTimer: number | null = null;
    let running = false;
    let step: StepFn = () => {};
    const mouse: Mouse = { x: -9999, y: -9999, has: false };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width  = Math.max(1, Math.round(width  * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const loop = (t: number) => {
      step(t);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
      if (running) return;
      running = true;
      resize();
      step = builders[effect](ctx, () => ({ width, height }), mouse);
      raf = requestAnimationFrame(loop);
    };

    const hardStop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      ctx.clearRect(0, 0, width, height);
    };

    const scheduleStop = () => {
      if (stopTimer) clearTimeout(stopTimer);
      stopTimer = window.setTimeout(hardStop, 480);
    };

    const parent = canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.has = true;
    };
    const onLeave = () => { mouse.has = false; mouse.x = -9999; mouse.y = -9999; };

    parent?.addEventListener("pointermove", onMove);
    parent?.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    apiRef.current = { start, scheduleStop };

    return () => {
      parent?.removeEventListener("pointermove", onMove);
      parent?.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      if (stopTimer) clearTimeout(stopTimer);
      if (raf) cancelAnimationFrame(raf);
      apiRef.current = null;
    };
  }, [effect]);

  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    if (active) api.start();
    else api.scheduleStop();
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{
        opacity: active ? 1 : 0,
        transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    />
  );
}
