"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "ghost";
  className?: string;
  href?: string;
  onClick?: () => void;
}

export default function MagneticButton({ children, variant = "primary", className, href, onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Subtle magnetic pull toward the cursor.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 200, damping: 20, mass: 0.1 });
  const springY = useSpring(my, { stiffness: 200, damping: 20, mass: 0.1 });
  const tx = useTransform(springX, [-100, 100], [-9, 9], { clamp: true });
  const ty = useTransform(springY, [-100, 100], [-9, 9], { clamp: true });
  // Inner label drifts a touch more than the shell → premium parallax depth.
  const lx = useTransform(springX, [-100, 100], [-4, 4], { clamp: true });
  const ly = useTransform(springY, [-100, 100], [-4, 4], { clamp: true });

  // Re-trigger the sheen sweep on each hover.
  const [shimmerKey, setShimmerKey] = useState(0);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    mx.set(clientX - (left + width / 2));
    my.set(clientY - (top + height / 2));
  };

  const handleEnter = () => {
    setHovered(true);
    setShimmerKey((k) => k + 1);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  };

  const baseStyles =
    "group inline-block relative rounded-full font-sans font-semibold text-[14px] text-center overflow-hidden " +
    "transition-shadow duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F0E8]";

  const variantStyles = {
    primary:
      "text-white bg-[linear-gradient(180deg,#FF7A2E_0%,#FF5C00_52%,#F0500A_100%)] " +
      "shadow-[0_6px_20px_-6px_rgba(255,92,0,0.55),inset_0_1px_0_rgba(255,255,255,0.32)] " +
      "hover:shadow-[0_14px_34px_-8px_rgba(255,92,0,0.62),inset_0_1px_0_rgba(255,255,255,0.34)]",
    accent:
      "text-white bg-[linear-gradient(180deg,#2A2A2A_0%,#161616_100%)] " +
      "shadow-[0_6px_20px_-6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] " +
      "hover:shadow-[0_14px_34px_-8px_rgba(0,0,0,0.5)]",
    ghost: "bg-transparent text-[#0D0D0B] hover:bg-[#0D0D0B]/[0.05]",
  };

  // White sheen for dark fills; warm-dark sheen for the ghost variant.
  const sheen =
    variant === "ghost"
      ? "linear-gradient(90deg, transparent 0%, rgba(13,13,11,0.05) 50%, transparent 100%)"
      : "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)";

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ x: tx, y: ty }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(baseStyles, variantStyles[variant], className)}
      onClick={onClick}
    >
      {/* Soft sheen sweep - continuous loop for premium aesthetic */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        initial={{ x: "-120%", skewX: "-18deg" }}
        animate={{ x: "220%" }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
        style={{ background: sheen, width: "60%" }}
      />

      <motion.span style={{ x: lx, y: ly }} className="relative block pointer-events-none">
        {children}
      </motion.span>
    </motion.div>
  );

  if (href) {
    return <Link href={href} passHref legacyBehavior><a>{content}</a></Link>;
  }
  return <button type="button" onClick={onClick} className="p-0 border-0 bg-transparent">{content}</button>;
}
