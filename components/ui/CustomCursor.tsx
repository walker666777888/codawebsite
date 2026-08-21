"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Play, RefreshCw } from "lucide-react";

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<"default" | "click" | "text" | "video" | "text_bracket" | "project_view" | "terminal_block" | "refresh">("default");
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
      setTimeout(() => setIsTouchDevice(true), 0);
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
        
        if (type === "video") { setCursorState("video"); return; }
        if (type === "text") { setCursorState("text"); setCursorText(text); return; }
        if (type === "project_view") { setCursorState("project_view"); return; }
        if (type === "terminal_block") { setCursorState("terminal_block"); return; }
        if (type === "refresh") { setCursorState("refresh"); return; }
      }

      // Check standard interactive elements with fast attribute and tag checks (NO getComputedStyle)
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.getAttribute("role") === "button" ||
        target.getAttribute("role") === "link" ||
        Boolean(target.closest("a, button, [role='button'], input, textarea, select"));
      
      if (isClickable) {
        setCursorState("click");
        return;
      }
      
      setCursorState("default");
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
      border: "1px solid rgba(255, 92, 0, 0.5)", // Brand orange border is visible on both light and dark
      backdropFilter: "blur(2px)",
      mixBlendMode: "normal",
    },
    click: {
      width: 72,
      height: 72,
      borderRadius: "50%",
      backgroundColor: "#FFFFFF",
      border: "0px solid transparent",
      backdropFilter: "blur(0px)",
      mixBlendMode: "difference",
    },
    video: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      backgroundColor: "#FF5C00", // CODA Flame Orange
      border: "0px solid transparent",
      backdropFilter: "blur(4px)",
      mixBlendMode: "normal",
    },
    text: {
      width: "auto",
      height: 48,
      borderRadius: 9999,
      backgroundColor: "#FFFFFF",
      border: "0px solid transparent",
      backdropFilter: "blur(0px)",
      mixBlendMode: "difference",
    },
    text_bracket: {
      width: 14,
      height: 32,
      borderRadius: "0%",
      backgroundColor: "transparent",
      border: "0px solid transparent",
      backdropFilter: "blur(0px)",
      mixBlendMode: "normal",
    },
    project_view: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      backgroundColor: "#FFFFFF",
      border: "0px solid transparent",
      backdropFilter: "blur(0px)",
      mixBlendMode: "normal",
    },
    terminal_block: {
      width: 10,
      height: 20,
      borderRadius: "0%",
      backgroundColor: "transparent",
      border: "0px solid transparent",
      backdropFilter: "blur(0px)",
      mixBlendMode: "normal",
    },
    refresh: {
      width: 72,
      height: 72,
      borderRadius: "50%",
      backgroundColor: "#FFFFFF",
      border: "0px solid transparent",
      backdropFilter: "blur(0px)",
      mixBlendMode: "difference",
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
          {cursorState === "text_bracket" && (
            <motion.div
              key="text_bracket"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[#FF5C00] font-mono text-3xl font-light leading-none drop-shadow-[0_0_8px_rgba(255,92,0,0.8)]"
              style={{ transform: 'translateY(-2px)' }}
            >
              [
            </motion.div>
          )}
          {cursorState === "project_view" && (
            <motion.div
              key="project_view"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-[#0D0D0B] font-sans text-xs font-bold tracking-[0.2em] uppercase"
            >
              VIEW
            </motion.div>
          )}
          {cursorState === "terminal_block" && (
            <motion.div
              key="terminal_block"
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-[#FF5C00]"
            />
          )}
          {cursorState === "refresh" && (
            <motion.div
              key="refresh"
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <RefreshCw size={32} color="black" strokeWidth={1.5} />
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
          scale: (cursorState === "default" || cursorState === "text_bracket" || cursorState === "terminal_block") ? 1 : 0,
          opacity: (cursorState === "default" || cursorState === "text_bracket" || cursorState === "terminal_block") ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </div>
  );
}
