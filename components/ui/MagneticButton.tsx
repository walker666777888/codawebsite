"use client";

import { useRef } from "react";
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
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  onClick?: (e?: React.MouseEvent) => void;
}

export default function MagneticButton({
  children,
  variant = "primary",
  size = "md",
  className,
  href,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Spotlight is written straight to the DOM — no React re-render per mousemove.
  const spotRef = useRef<HTMLSpanElement>(null);

  // Subtle magnetic pull toward the cursor (desktop)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 220, damping: 20, mass: 0.1 });
  const springY = useSpring(my, { stiffness: 220, damping: 20, mass: 0.1 });
  const tx = useTransform(springX, [-100, 100], [-8, 8], { clamp: true });
  const ty = useTransform(springY, [-100, 100], [-8, 8], { clamp: true });
  
  // Inner content drifts with deeper parallax
  const lx = useTransform(springX, [-100, 100], [-4, 4], { clamp: true });
  const ly = useTransform(springY, [-100, 100], [-4, 4], { clamp: true });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const relX = clientX - left;
    const relY = clientY - top;
    
    mx.set(clientX - (left + width / 2));
    my.set(clientY - (top + height / 2));
    const spot = spotRef.current;
    if (spot) {
      spot.style.background = `radial-gradient(circle 80px at ${relX}px ${relY}px, rgba(255,255,255,0.32), transparent 70%)`;
      spot.style.opacity = "1";
    }
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
    if (spotRef.current) spotRef.current.style.opacity = "0";
  };

  const baseStyles =
    "group inline-flex items-center justify-center relative rounded-full font-sans font-semibold text-center overflow-hidden " +
    "transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00] " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--coda-bg)] cursor-pointer select-none active:scale-[0.96]";

  const sizeStyles = {
    sm: "text-[13px] tracking-tight",
    md: "text-[14px] sm:text-[15px] tracking-tight",
    lg: "text-[15px] sm:text-[17px] tracking-tight",
  };

  const variantStyles = {
    primary:
      "text-white bg-[linear-gradient(180deg,#FF7020_0%,#FF5C00_50%,#EA4800_100%)] " +
      "border border-white/25 " +
      "shadow-[0_8px_24px_-4px_rgba(255,92,0,0.45),0_0_16px_2px_rgba(255,92,0,0.2),inset_0_1px_1.5px_0_rgba(255,255,255,0.45),inset_0_-2px_4px_0_rgba(0,0,0,0.25)] " +
      "hover:shadow-[0_16px_36px_-6px_rgba(255,92,0,0.65),0_0_24px_4px_rgba(255,92,0,0.35),inset_0_1px_1.5px_0_rgba(255,255,255,0.55),inset_0_-2px_4px_0_rgba(0,0,0,0.25)]",
    accent:
      "text-white bg-[linear-gradient(180deg,#242422_0%,#141412_100%)] " +
      "border border-white/15 " +
      "shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.18),inset_0_-1px_2px_0_rgba(0,0,0,0.4)] " +
      "hover:border-white/25 hover:shadow-[0_14px_34px_-6px_rgba(0,0,0,0.7),0_0_20px_rgba(255,92,0,0.25)]",
    ghost:
      "bg-transparent text-[var(--coda-ink)] border border-[var(--coda-hairline)] hover:bg-[var(--coda-ink)]/[0.05] " +
      "shadow-sm hover:shadow-md",
  };

  // Sheen gradient
  const sheenGradient =
    variant === "ghost"
      ? "linear-gradient(105deg, transparent 20%, var(--coda-hairline) 50%, transparent 80%)"
      : "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.3) 48%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.3) 52%, transparent 80%)";

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: tx, y: ty }}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      onClick={onClick}
    >
      {/* Interactive cursor spotlight (desktop) */}
      <span
        ref={spotRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: 0,
          background: "radial-gradient(circle 80px at 0px 0px, rgba(255,255,255,0.32), transparent 70%)",
        }}
      />

      {/* Glass bevel top highlight line */}
      <span
        aria-hidden="true"
        className="absolute top-0 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
      />

      {/* Ambient sweeping light sheen */}
      {/* 1.6s sweep + 3.8s rest, on the compositor (see coda-sheen in globals.css) */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: sheenGradient,
          width: "60%",
          transform: "translateX(-150%) skewX(-20deg)",
          animation: "coda-sheen 5.4s linear infinite",
        }}
      />

      {/* Parallax inner content */}
      <motion.span style={{ x: lx, y: ly }} className="relative z-10 flex items-center justify-center pointer-events-none">
        {children}
      </motion.span>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a className="inline-block">{content}</a>
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-0 border-0 bg-transparent focus-visible:outline-none rounded-full cursor-pointer inline-block"
    >
      {content}
    </button>
  );
}

