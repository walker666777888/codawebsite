"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Use framer-motion values to avoid React re-renders on mousemove
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the outer ring
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch devices
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    const updateMousePosition = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if we are hovering over something clickable
      const isClickable =
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button");
      
      setIsHovering(!!isClickable);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* ── Main Cursor Frame ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center rounded-full"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: isHovering ? 64 : 12,
          height: isHovering ? 64 : 12,
          backgroundColor: isHovering ? "#FF5C00" : "#14130F",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Inner Label (Only visible on hover) */}
        <motion.div
          className="text-[#FEFCF8] font-mono text-[10px] tracking-[0.1em] uppercase whitespace-nowrap flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: isHovering ? 1 : 0,
            scale: isHovering ? 1 : 0.5,
          }}
          transition={{ duration: 0.3, ease: "easeOut", delay: isHovering ? 0.1 : 0 }}
        >
          {isHovering ? (
            <span className="flex items-center">
              Tap <span className="ml-1 text-[12px] leading-none">↗</span>
            </span>
          ) : null}
        </motion.div>
      </motion.div>

      {/* ── Magnetic Trailing Aura ── */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
        style={{
          x: useSpring(mouseX, { damping: 40, stiffness: 150, mass: 0.8 }),
          y: useSpring(mouseY, { damping: 40, stiffness: 150, mass: 0.8 }),
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: isHovering ? 0 : 40,
          height: isHovering ? 0 : 40,
          border: "1px solid rgba(20, 19, 15, 0.15)",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </>
  );
}
