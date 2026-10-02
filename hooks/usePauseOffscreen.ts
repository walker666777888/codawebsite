"use client";

import { useEffect, type RefObject } from "react";

/**
 * Toggles the global `anim-paused` class (see globals.css) on an element
 * while it is outside the viewport, freezing every CSS animation inside it.
 *
 * Browsers keep ticking CSS animations on SVG elements (and any non-
 * composited property) even when they are off-screen, so a section full of
 * ambient loops costs style/paint time on every frame of the whole page.
 * Pausing is invisible — the loops resume the moment the section returns.
 */
export function usePauseOffscreen(ref: RefObject<Element | null>, rootMargin = "100px") {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle("anim-paused", !entry.isIntersecting),
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
}
