"use client";

import { useEffect, type RefObject } from "react";
import { useMotionValue, type MotionValue } from "motion/react";

/* ─────────────────────────────────────────────────────────────────
   Layout-free replacement for motion's `useScroll({ target, offset })`.

   motion re-measures every tracked element on every scroll frame
   (walking offsetTop/offsetParent and reading scrollHeight), which forces
   a synchronous layout per tracker per frame — the main source of mobile
   scroll jank on this page. Here each element's document position is
   measured only when layout can actually have changed (resize, content
   size change), and on scroll the progress is pure arithmetic on
   `window.scrollY`. One shared passive listener serves every tracker.

   Semantics match motion: offsets are ["<target edge> <viewport edge>",
   ...] with start = 0, center = 0.5, end = 1, and progress is clamped
   to 0–1.
───────────────────────────────────────────────────────────────── */

type Edge = "start" | "center" | "end";
export type ScrollOffset = [`${Edge} ${Edge}`, `${Edge} ${Edge}`];

const EDGE: Record<Edge, number> = { start: 0, center: 0.5, end: 1 };

interface Tracker {
  el: HTMLElement;
  a0: number; v0: number; a1: number; v1: number;
  top: number;
  height: number;
  value: MotionValue<number>;
}

const trackers = new Set<Tracker>();
let viewportH = 0;
let listening = false;
let ro: ResizeObserver | null = null;

function measure(t: Tracker) {
  // Same position source as motion: layout offsets, unaffected by transforms
  let top = 0;
  let node: HTMLElement | null = t.el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  t.top = top;
  t.height = t.el.offsetHeight;
}

function update(t: Tracker) {
  const start = t.top + t.a0 * t.height - t.v0 * viewportH;
  const end = t.top + t.a1 * t.height - t.v1 * viewportH;
  const span = end - start;
  const p = span === 0 ? (window.scrollY >= end ? 1 : 0) : (window.scrollY - start) / span;
  t.value.set(p < 0 ? 0 : p > 1 ? 1 : p);
}

function onScroll() {
  trackers.forEach(update);
}

function remeasureAll() {
  viewportH = document.documentElement.clientHeight;
  trackers.forEach(measure);
  trackers.forEach(update);
}

function ensureListening() {
  if (listening) return;
  listening = true;
  viewportH = document.documentElement.clientHeight;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", remeasureAll, { passive: true });
  // Body size changes cover font swaps, lazy sections and GSAP pin spacers.
  ro = new ResizeObserver(remeasureAll);
  ro.observe(document.body);
}

function stopListening() {
  if (!listening || trackers.size) return;
  listening = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", remeasureAll);
  ro?.disconnect();
  ro = null;
}

export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  offset: ScrollOffset
): MotionValue<number> {
  const value = useMotionValue(0);
  const [first, second] = offset;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const [a0, v0] = first.split(" ") as [Edge, Edge];
    const [a1, v1] = second.split(" ") as [Edge, Edge];
    const t: Tracker = {
      el, value, top: 0, height: 0,
      a0: EDGE[a0], v0: EDGE[v0], a1: EDGE[a1], v1: EDGE[v1],
    };
    ensureListening();
    trackers.add(t);
    measure(t);
    update(t);
    // The element's own height can change without the body changing size.
    const own = new ResizeObserver(() => { measure(t); update(t); });
    own.observe(el);
    return () => {
      own.disconnect();
      trackers.delete(t);
      stopListening();
    };
  }, [ref, value, first, second]);

  return value;
}
