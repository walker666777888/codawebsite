"use client";

import { motion } from "motion/react";
import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
  rotation?: number;
  bgColor?: "terracotta" | "sage" | "lavender" | "sticky" | "white";
  tapePosition?: "top-center" | "top-left" | "top-right" | "none";
}

export default function PaperCard({
  children,
  className,
  rotation = 0,
  bgColor = "white",
  tapePosition = "top-center",
}: PaperCardProps) {
  
  const bgColors = {
    terracotta: "bg-[#C58F63] text-white",
    sage: "bg-[#E2DFD5] text-[#0D0D0B]",
    lavender: "bg-[#BAB3C8] text-[#0D0D0B]",
    sticky: "bg-[#F6F3E6] text-[#0D0D0B]",
    white: "bg-white text-[#0D0D0B]",
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.02, rotate: rotation, zIndex: 50, cursor: "grabbing" }}
      style={{ rotate: rotation }}
      className={cn(
        "relative p-8 rounded-sm shadow-md cursor-grab transition-shadow hover:shadow-lg",
        bgColors[bgColor],
        className
      )}
    >
      {/* Tape Skeuomorphism */}
      {tapePosition !== "none" && (
        <div 
          className={cn(
            "absolute w-12 h-4 bg-white/40 backdrop-blur-sm shadow-sm",
            tapePosition === "top-center" && "-top-2 left-1/2 -translate-x-1/2 rotate-[-2deg]",
            tapePosition === "top-left" && "-top-2 left-4 rotate-[4deg]",
            tapePosition === "top-right" && "-top-2 right-4 rotate-[-4deg]"
          )}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10 pointer-events-none">
        {children}
      </div>
    </motion.div>
  );
}
