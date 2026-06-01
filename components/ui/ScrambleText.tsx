"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

const CHARS = "!@#$%^&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export default function ScrambleText({
  text,
  delay = 0,
  speed = 0.32,
  className = "",
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const spanRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(spanRef, { once: true });
  const triggered = useRef(false);
  const rafRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isInView || triggered.current) return;
    triggered.current = true;

    const timeout = setTimeout(() => {
      let iteration = 0;
      const chars = text.split("");

      const animate = () => {
        if (!mountedRef.current) return;
        setDisplay(
          chars.map((c, i) => {
            if (c === " ") return " ";
            if (i < Math.floor(iteration)) return c;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join("")
        );
        iteration += speed;
        if (iteration < text.length) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setDisplay(text);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, text, delay, speed]);

  return (
    <span ref={spanRef} className={className} aria-label={text}>
      {display}
    </span>
  );
}
