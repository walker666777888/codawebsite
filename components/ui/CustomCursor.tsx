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
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" className="overflow-visible">
          {/* Rotating Outer Dashed Ring */}
          <motion.circle
            cx="32"
            cy="32"
            r="20"
            fill="none"
            stroke="#FF5C00"
            strokeWidth="1"
            strokeDasharray="4 8"
            animate={{
              rotate: 360,
              stroke: isHovering ? "#39FF14" : "#FF5C00", // turns neon green on hover
              r: isHovering ? 28 : 20,
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              stroke: { duration: 0.3 },
              r: { duration: 0.3, ease: "easeOut" },
            }}
            style={{ originX: "32px", originY: "32px" }}
          />

          {/* Crosshairs that contract on hover */}
          <motion.g
            stroke={isHovering ? "#39FF14" : "#FF5C00"}
            strokeWidth="1.5"
            animate={{
              x: isHovering ? 0 : 0,
            }}
          >
            {/* Top */}
            <motion.line x1="32" y1="0" x2="32" y2="10" animate={{ y1: isHovering ? 16 : 0, y2: isHovering ? 22 : 10 }} transition={{ duration: 0.3 }} />
            {/* Bottom */}
            <motion.line x1="32" y1="64" x2="32" y2="54" animate={{ y1: isHovering ? 48 : 64, y2: isHovering ? 42 : 54 }} transition={{ duration: 0.3 }} />
            {/* Left */}
            <motion.line x1="0" y1="32" x2="10" y2="32" animate={{ x1: isHovering ? 16 : 0, x2: isHovering ? 22 : 10 }} transition={{ duration: 0.3 }} />
            {/* Right */}
            <motion.line x1="64" y1="32" x2="54" y2="32" animate={{ x1: isHovering ? 48 : 64, x2: isHovering ? 42 : 54 }} transition={{ duration: 0.3 }} />
          </motion.g>

          {/* Center Target - morphs from circle to square on hover */}
          <motion.rect
            x="30"
            y="30"
            width="4"
            height="4"
            fill={isHovering ? "#39FF14" : "#FF5C00"}
            animate={{
              rx: isHovering ? 0 : 4,
              scale: isHovering ? 1.5 : 1,
              rotate: isHovering ? 45 : 0,
            }}
            style={{ originX: "32px", originY: "32px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
      
      {/* ── Exact pinpoint dot so user still knows exactly where they are clicking ── */}
      <motion.div
        className="fixed top-0 left-0 w-[2px] h-[2px] bg-white rounded-full pointer-events-none z-[9999]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
}
