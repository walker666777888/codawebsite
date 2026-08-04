"use client";

import { useState, useEffect } from "react";

export function useIsLowEndDevice() {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    // 1. Check if user prefers reduced motion (accessibility)
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // 2. Hardware concurrency (logical CPU cores)
    // Most modern mid/high-end devices have 8+. Budget/old devices often have 2-4.
    const cores = navigator.hardwareConcurrency || 4;
    
    // 3. Device Memory (RAM in GB)
    // Note: This maxes out at 8 for privacy reasons in most browsers, 
    // so < 4 indicates a very low-end device.
    // @ts-ignore - deviceMemory is not in all TS definitions
    const memory = navigator.deviceMemory || 4;

    // 4. Touch device check (optional, but often correlates with mobile where we already disable WebGL)
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // If it's a mobile touch device, or it has limited cores/RAM, or user prefers reduced motion
    if (prefersReducedMotion || cores < 4 || memory < 4 || isTouch) {
      setIsLowEnd(true);
    }
  }, []);

  return isLowEnd;
}
