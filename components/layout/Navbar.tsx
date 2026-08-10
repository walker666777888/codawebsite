"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useFormModal } from "@/components/providers/FormModalProvider";
import { lenisScrollTo } from "@/components/providers/LenisProvider";

const NAV_ANCHOR_LINKS = [
  { label: "Work",       href: "#work" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Contact",    href: "#contact" },
];

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault();
  const el = document.getElementById(href.replace("#", ""));
  if (el) lenisScrollTo(el);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { open: openForm } = useFormModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed z-50 top-0 left-0 right-0 w-full flex justify-center pointer-events-none"
      >
        <motion.div 
          layout
          className={`relative max-w-[1400px] flex items-center h-[56px] px-6 pointer-events-auto ${scrolled ? "w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] mt-3" : "w-full mt-0"}`}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ originY: 0 }}
        >
          
          {/* ── GPU-Accelerated Pill Background ── */}
          <motion.div 
            layout
            className="absolute inset-0 rounded-2xl bg-white/75 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(255,92,0,0.1),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] pointer-events-none"
            initial={false}
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Orange glow top edge on pill */}
          <motion.div 
            layout
            className="absolute inset-x-6 top-0 h-px rounded-full pointer-events-none"
            style={{ background: "linear-gradient(90deg,transparent,rgba(255,92,0,0.45) 50%,transparent)" }}
            initial={false}
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Logo */}
          <motion.div layout className="relative z-10 flex shrink-0">
            <Link href="/" className="flex items-baseline gap-[1px] group">
            <span className={`font-instrument text-[20px] tracking-[-0.025em] transition-colors duration-500 group-hover:opacity-60 ${scrolled || mobileMenuOpen ?"text-[#14130F]" : "text-white"}`}>
              CODA
            </span>
            <motion.span
              className="font-mono text-[#FF5C00] text-[20px] leading-none"
              whileHover={{ scale: 1.5, rotate: 15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >.</motion.span>
          </Link>
          </motion.div>
            {/* Desktop nav — absolutely centered */}
            <motion.nav layout className="hidden sm:flex items-center gap-2 text-[16px] font-instrument absolute left-1/2 -translate-x-1/2">
              {NAV_ANCHOR_LINKS.map((link, i) => (
                <motion.div key={link.label}
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.9 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`relative group px-3 py-1.5 rounded-lg transition-colors duration-200 hover:bg-[#0D0D0B]/[0.04] ${scrolled ?"text-[#6F6A60] hover:text-[#14130F]" : "text-[#6F6A60] md:text-white/60 hover:text-[#14130F] md:hover:text-white"}`}
                  >
                    {link.label}
                    <span className="absolute inset-x-3 bottom-0.5 h-[1.5px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full bg-[#FF5C00]" />
                  </a>
                </motion.div>
              ))}
            </motion.nav>

            {/* CTA */}
            <motion.div layout className="hidden sm:flex items-center gap-3 ml-auto z-10">
              <motion.button
                onClick={openForm}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative overflow-hidden inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold tracking-[-0.01em] px-5 py-2 rounded-full bg-[#FF5C00] text-white shadow-[0_2px_16px_rgba(255,92,0,0.35)] hover:shadow-[0_4px_24px_rgba(255,92,0,0.5)] transition-shadow duration-300 cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Start a build
                  <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
                </span>
                <motion.span
                  aria-hidden
                  className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-120%" }}
                  whileHover={{ x: "120%" }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                />
              </motion.button>
            </motion.div>

            {/* Mobile hamburger */}
            <motion.button
              layout
              className={`relative z-10 flex sm:hidden ml-auto min-w-[44px] min-h-[44px] items-center justify-center p-2 transition-colors duration-300 ${scrolled || mobileMenuOpen ? "text-[#14130F]" : "text-white"}`}
              onClick={() => setMobileMenuOpen((v) => !v)}
              whileTap={{ scale: 0.88 }}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span key="x" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <X size={22} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <Menu size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-40 bg-[#F4F0E8] flex flex-col items-center justify-center sm:hidden overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: 0.15 } }}
          >
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(255,92,0,0.15) 0%, transparent 70%)" }}
            />
            <nav className="relative flex flex-col items-center gap-0">
              {NAV_ANCHOR_LINKS.map((link, i) => (
                <motion.div key={link.label}
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ opacity: 0, y: 10, transition: { duration: 0.25, delay: i * 0.04, ease: "easeOut" } }}
                >
                  <a href={link.href}
                    onClick={(e) => { scrollToSection(e, link.href); setMobileMenuOpen(false); }}
                    className="block font-instrument text-[52px] leading-[1.15] tracking-[-0.04em] text-[#0D0D0B]/70 hover:text-[#FF5C00] transition-colors duration-200">
                    {link.label}
                  </a>
                </motion.div>
              ))}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] } }} 
                exit={{ opacity: 0, y: 10, transition: { duration: 0.25, delay: 0.16, ease: "easeOut" } }}
                className="mt-12"
              >
                <MagneticButton variant="primary" onClick={() => { setMobileMenuOpen(false); openForm(); }}>
                  <span className="flex items-center gap-2 font-sans font-semibold text-[16px] px-8 py-3.5">
                    Start a build
                    <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
                  </span>
                </MagneticButton>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
