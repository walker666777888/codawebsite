"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useLenisControl } from "@/components/providers/LenisProvider";
import BuildFormModal from "@/components/ui/BuildFormModal";

interface FormModalCtx {
  open: () => void;
}

const FormModalContext = createContext<FormModalCtx>({ open: () => {} });

export function useFormModal() {
  return useContext(FormModalContext);
}

export default function FormModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const lenis = useLenisControl();

  const open = useCallback(() => {
    lenis.stop();
    setIsOpen(true);
  }, [lenis]);

  const close = useCallback(() => {
    setIsOpen(false);
    // Small delay matches the panel exit spring so Lenis restarts
    // only after the modal has slid back down.
    setTimeout(() => lenis.start(), 500);
  }, [lenis]);

  return (
    <FormModalContext.Provider value={{ open }}>
      {children}
      <BuildFormModal isOpen={isOpen} onClose={close} />
    </FormModalContext.Provider>
  );
}
