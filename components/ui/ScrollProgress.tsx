"use client";

import { useScroll, motion, useSpring, useTransform } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Fade the bar in only after 2% scroll (avoids flash on load)
  const barOpacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  return (
    <motion.div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={undefined}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#FF5C00] origin-left z-[9999] pointer-events-none"
      style={{ scaleX, opacity: barOpacity }}
    />
  );
}
