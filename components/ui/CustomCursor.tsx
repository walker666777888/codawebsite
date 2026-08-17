"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<"default" | "click" | "text" | "video">("default");
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Advanced fluid spring physics for the outer shell
  const springConfig = { damping: 25, stiffness: 400, mass: 0.15 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Instant physics for the precision dot
  const dotSpringConfig = { damping: 40, stiffness: 800, mass: 0.02 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  useEffect(() => {
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
      
      // Look up the DOM tree for our new contextual cursor attributes
      const customCursorEl = target.closest('[data-cursor]');
      if (customCursorEl) {
        const type = customCursorEl.getAttribute('data-cursor');
        const text = customCursorEl.getAttribute('data-cursor-text') || "";
        
        if (type === "video") {
          setCursorState("video");
          return;
        }
        if (type === "text") {
          setCursorState("text");
          setCursorText(text);
          return;
        }
      }

      // Check standard interactive elements
      const isClickable =
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button");
      
      if (isClickable) {
        setCursorState("click");
      } else {
        setCursorState("default");
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice) return null;

  // Geometric morphing states
  const cursorVariants = {
    default: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      backgroundColor: "transparent",
      border: "1px solid rgba(255, 255, 255, 0.4)",
      backdropFilter: "blur(2px)",
      mixBlendMode: "normal" as any,
    },
    click: {
      width: 72,
      height: 72,
      borderRadius: "50%",
      backgroundColor: "#FFFFFF",
      border: "0px solid transparent",
      backdropFilter: "blur(0px)",
      mixBlendMode: "difference" as any,
    },
    video: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      backgroundColor: "#FF5C00", // CODA Flame Orange
      border: "0px solid transparent",
      backdropFilter: "blur(4px)",
      mixBlendMode: "normal" as any,
    },
    text: {
      width: "auto",
      height: 48,
      borderRadius: 9999,
      backgroundColor: "#FFFFFF",
      border: "0px solid transparent",
      backdropFilter: "blur(0px)",
      mixBlendMode: "difference" as any,
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[10000] overflow-hidden">
      {/* Morphing Outer Shell */}
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center whitespace-nowrap shadow-2xl overflow-hidden"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        variants={cursorVariants}
        animate={cursorState}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          mass: 0.15 
        }}
      >
        <AnimatePresence mode="wait">
          {cursorState === "click" && (
            <motion.div
              key="click"
              initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Black punches a hole in the white difference bubble, revealing true colors underneath */}
              <ArrowUpRight size={32} color="black" strokeWidth={1.5} />
            </motion.div>
          )}
          {cursorState === "video" && (
            <motion.div
              key="video"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-1"
            >
              <Play size={32} color="white" fill="white" />
            </motion.div>
          )}
          {cursorState === "text" && (
            <motion.div
              key="text"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-black font-mono font-bold tracking-widest text-sm uppercase px-6"
            >
              {cursorText}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* High Precision Tracking Dot */}
      <motion.div
        className="absolute top-0 left-0 bg-[#FF5C00] rounded-full mix-blend-normal shadow-[0_0_8px_rgba(255,92,0,0.8)]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
          width: 5,
          height: 5,
        }}
        animate={{
          scale: cursorState === "default" ? 1 : 0,
          opacity: cursorState === "default" ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </div>
  );
}
