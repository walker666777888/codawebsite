"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLenisControl } from "@/components/providers/LenisProvider";

/* The build form (~1,300 lines + flag sprites) is only needed once someone
   clicks a CTA, so it is code-split out of the initial bundle. It is
   prefetched as soon as the page goes idle, so the first open is still
   instant; it mounts on first open (AnimatePresence plays its normal enter
   animation on mount) and then stays mounted for the exit animation. */
const loadModal = () => import("@/components/ui/BuildFormModal");
const BuildFormModal = dynamic(loadModal, { ssr: false });

const FLAG_ICONS_CSS = "https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css";

/** Country-flag sprites for the phone picker — previously a render-blocking
    <link> in <head> on every page view. Appended after load instead. */
function loadFlagIcons() {
  if (document.querySelector(`link[href="${FLAG_ICONS_CSS}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = FLAG_ICONS_CSS;
  document.head.appendChild(link);
}

interface FormModalCtx {
  open: () => void;
}

const FormModalContext = createContext<FormModalCtx>({ open: () => {} });

export function useFormModal() {
  return useContext(FormModalContext);
}

export default function FormModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenisControl();

  useEffect(() => {
    const prefetch = () => {
      loadModal();
      loadFlagIcons();
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 5000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(prefetch, 3000);
    return () => clearTimeout(t);
  }, []);

  const open = useCallback(() => {
    lenis.stop();
    loadFlagIcons();
    setMounted(true);
    setIsOpen(true);
  }, [lenis]);

  const close = useCallback(() => {
    setIsOpen(false);
    // Small delay matches the panel exit transition so Lenis restarts
    // only after the modal has slid back down.
    setTimeout(() => lenis.start(), 600);
  }, [lenis]);

  return (
    <FormModalContext.Provider value={{ open }}>
      {children}
      {mounted && <BuildFormModal isOpen={isOpen} onClose={close} />}
    </FormModalContext.Provider>
  );
}
