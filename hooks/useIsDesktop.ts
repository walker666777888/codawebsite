"use client";

import { useEffect, useState } from "react";

/**
 * `null` until mounted, then whether the md breakpoint (≥768px) matches.
 *
 * Several sections ship a desktop and a mobile variant and hide one with
 * `hidden md:block` / `md:hidden`. CSS-hidden subtrees stay mounted and keep
 * running their hooks (scroll trackers, observers, motion values) every
 * frame. Render both while `null` — identical to the server HTML, so
 * hydration matches — then drop the variant that can't be seen:
 *
 *   {isDesktop !== false && <DesktopOnly />}
 *   {isDesktop !== true && <MobileOnly />}
 */
export function useIsDesktop(): boolean | null {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}
