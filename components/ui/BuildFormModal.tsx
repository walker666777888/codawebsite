"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { X, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback, type FormEvent } from "react";

/* ── types ─────────────────────────────────────────────── */
type Status = "idle" | "submitting" | "success";
interface Props { isOpen: boolean; onClose: () => void; }

/* ── data ───────────────────────────────────────────────── */
const PROJECT_TYPES = [
  { id: "web",    label: "Web Platform",   sub: "Sites & apps" },
  { id: "ai",     label: "AI Integration", sub: "LLM & automation" },
  { id: "design", label: "Design System",  sub: "Brand & UI kit" },
  { id: "full",   label: "Full System",    sub: "End-to-end" },
];
const NEXT_STEPS = [
  { n: "01", text: "We review your brief within 24 hours." },
  { n: "02", text: "A focused discovery call to map the system." },
  { n: "03", text: "Proposal + timeline delivered in 48 hours." },
];

const E = [0.16, 1, 0.3, 1] as const;

/* ── field ──────────────────────────────────────────────── */
function Field({
  id, label, type = "text", value, onChange, placeholder, required,
  inputRef, textarea, maxLength,
}: {
  id: string; label: string; type?: string;
  value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  textarea?: boolean; maxLength?: number;
}) {
  const fMv  = useMotionValue(0);
  const fSpr = useSpring(fMv, { stiffness: 260, damping: 28 });

  /* box-shadow encodes border + glow — no overlay div needed */
  const shadow = useTransform(fSpr, [0, 1], [
    "0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.04)",
    "0 0 0 1px rgba(255,92,0,0.7), 0 0 28px rgba(255,92,0,0.13), inset 0 1px 0 rgba(255,255,255,0.07)",
  ]);
  const bg = useTransform(fSpr, [0, 1], [
    "rgba(255,255,255,0.035)",
    "rgba(255,92,0,0.055)",
  ]);

  const sharedEvents = {
    onFocus: () => fMv.set(1),
    onBlur:  () => fMv.set(0),
  };
  const inputClass =
    "w-full bg-transparent rounded-[14px] px-4 py-4 text-white text-[15px] font-sans outline-none border-0 placeholder-white/20 resize-none leading-relaxed";

  const charsLeft = maxLength !== undefined ? maxLength - value.length : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
          {label}{required && <span className="text-[#FF5C00] ml-0.5">*</span>}
        </label>
        {charsLeft !== null && (
          <span className="font-mono text-[9px] text-white/20 tabular-nums">
            {charsLeft}
          </span>
        )}
      </div>
      <motion.div className="relative rounded-[14px]" style={{ background: bg, boxShadow: shadow }}>
        {textarea ? (
          <textarea id={id} value={value} rows={5} placeholder={placeholder}
            maxLength={maxLength}
            onChange={e => onChange(e.target.value)}
            className={inputClass} {...sharedEvents} />
        ) : (
          <input ref={inputRef} id={id} type={type} value={value} required={required}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            className={inputClass} {...sharedEvents} />
        )}
      </motion.div>
    </div>
  );
}

/* ── pill selector ──────────────────────────────────────── */
function Pills({
  options, value, onChange,
}: {
  options: { id: string; label: string; sub?: string }[];
  value: string; onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(opt => {
        const on = value === opt.id;
        return (
          <motion.button key={opt.id} type="button" onClick={() => onChange(on ? "" : opt.id)}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="relative flex flex-col gap-1 rounded-[14px] px-4 py-3.5 text-left cursor-pointer outline-none overflow-hidden"
            style={{
              background: on ? "rgba(255,92,0,0.10)" : "rgba(255,255,255,0.035)",
              boxShadow: on
                ? "0 0 0 1px rgba(255,92,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)"
                : "0 0 0 1px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.04)",
              transition: "background 0.18s, box-shadow 0.18s",
            }}
          >
            {/* left accent bar */}
            <motion.span
              className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-[#FF5C00]"
              initial={false}
              animate={{ opacity: on ? 1 : 0, scaleY: on ? 1 : 0.4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            />
            <span className={`font-sans text-[13px] font-medium leading-tight transition-colors duration-150 ${on ? "text-white" : "text-white/70"}`}>
              {opt.label}
            </span>
            {opt.sub && (
              <span className={`font-mono text-[9px] uppercase tracking-[0.16em] transition-colors duration-150 ${on ? "text-[#FF5C00]/70" : "text-white/25"}`}>
                {opt.sub}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ── animated checkmark ─────────────────────────────────── */
function SuccessCheck() {
  return (
    <motion.svg width="72" height="72" viewBox="0 0 72 72" fill="none"
      initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.05 }}
    >
      <motion.circle cx="36" cy="36" r="33" stroke="#FF5C00" strokeWidth="1.5"
        fill="rgba(255,92,0,0.09)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.55, ease: E, delay: 0.1 }}
      />
      <motion.path d="M23 37l10 10 16-19" stroke="#FF5C00" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: E, delay: 0.52 }}
      />
    </motion.svg>
  );
}

/* ── stagger wrapper ─────────────────────────────────────── */
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, delay, ease: E }}>
      {children}
    </motion.div>
  );
}

/* ══ main component ════════════════════════════════════════ */
export default function BuildFormModal({ isOpen, onClose }: Props) {
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [name,   setName]   = useState("");
  const [email,  setEmail]  = useState("");
  const [phone,  setPhone]  = useState("");
  const [brief,  setBrief]  = useState("");
  const [ptype,  setPtype]  = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;
    const t = setTimeout(() => {
      setStatus("idle");
      setName(""); setEmail(""); setPhone(""); setBrief(""); setPtype("");
    }, 600);
    return () => clearTimeout(t);
  }, [isOpen]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus("submitting");
    await new Promise(r => setTimeout(r, 1800));
    setStatus("success");
  }, [name, email]);

  const panelSpring = { type: "spring" as const, stiffness: 260, damping: 34, mass: 1.0 };
  const exitSpring  = { type: "spring" as const, stiffness: 400, damping: 44 };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            key="bd"
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-[10px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden
          />

          {/* sheet panel */}
          <motion.div
            key="panel"
            role="dialog" aria-modal="true" aria-label="Start a project"
            className="fixed inset-x-0 bottom-0 z-[201]"
            style={{
              height: "92dvh",
              background: "#0C0C0A",
              borderRadius: "24px 24px 0 0",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            initial={{ y: reduced ? 0 : "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: exitSpring }}
            transition={reduced ? { duration: 0 } : panelSpring}
          >
            {/* subtle graph grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.028]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* top orange line */}
            <motion.div className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,92,0,0.75) 50%,transparent)" }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.65, delay: 0.15, ease: E }}
            />

            {/* handle */}
            <div className="flex justify-center pt-3 shrink-0 relative z-10">
              <div className="w-9 h-[3px] rounded-full bg-white/10" />
            </div>

            {/* close btn */}
            <motion.button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center text-white/35 hover:text-white/70 transition-colors duration-200 cursor-pointer"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.04)" }}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 380, damping: 24 }}
            >
              <X size={14} strokeWidth={1.5} />
            </motion.button>

            {/* scrollable body */}
            <div
              className="flex-1 overflow-y-auto relative z-10"
              data-lenis-prevent
              style={{ overscrollBehavior: "contain" }}
            >
              <div className="min-h-full grid grid-cols-1 lg:grid-cols-[400px_1fr]">

                {/* LEFT panel */}
                <div className="hidden lg:flex flex-col justify-between p-10 xl:p-12 border-r border-white/[0.06] relative">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 60% 50% at 0% 0%, rgba(255,92,0,0.09) 0%, transparent 70%)" }}
                  />
                  <div className="relative">
                    <FadeUp delay={0.22}>
                      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#FF5C00]/80">
                        CODA · Start a project
                      </span>
                    </FadeUp>
                    <FadeUp delay={0.3}>
                      <h2 className="font-instrument text-white leading-[1.04] tracking-[-0.03em] mt-8"
                        style={{ fontSize: "clamp(30px, 3vw, 50px)" }}>
                        Let&apos;s build something<br />
                        that <span className="italic text-[#FF5C00]">compounds.</span>
                      </h2>
                    </FadeUp>
                    <FadeUp delay={0.38}>
                      <p className="font-sans text-[14px] text-white/40 leading-[1.8] mt-5 max-w-[280px]">
                        One focused conversation is all it takes. Tell us what you&apos;re
                        building and we&apos;ll map the system together.
                      </p>
                    </FadeUp>
                  </div>

                  <div className="relative">
                    <FadeUp delay={0.46}>
                      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/20 mb-6">
                        What happens next
                      </p>
                    </FadeUp>
                    <div className="space-y-5">
                      {NEXT_STEPS.map((s, i) => (
                        <FadeUp key={s.n} delay={0.52 + i * 0.07}>
                          <div className="flex items-start gap-4">
                            <span className="font-mono text-[10px] text-[#FF5C00]/70 mt-0.5 shrink-0">{s.n}</span>
                            <p className="font-sans text-[13px] text-white/40 leading-[1.65]">{s.text}</p>
                          </div>
                        </FadeUp>
                      ))}
                    </div>
                    <FadeUp delay={0.74}>
                      <a href="mailto:infocoda@gmail.com"
                        className="inline-flex items-center gap-2 mt-10 font-mono text-[9px] uppercase tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors duration-300">
                        infocoda@gmail.com <ArrowRight size={9} />
                      </a>
                    </FadeUp>
                  </div>
                </div>

                {/* RIGHT: form */}
                <div className="p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col">

                  {/* mobile header */}
                  <div className="lg:hidden mb-8">
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FF5C00]/80">
                      Start a project
                    </span>
                    <h2 className="font-instrument text-white text-[28px] tracking-[-0.025em] leading-tight mt-3">
                      Let&apos;s build something that{" "}
                      <span className="italic text-[#FF5C00]">compounds.</span>
                    </h2>
                  </div>

                  <AnimatePresence mode="wait">
                    {status === "success" ? (

                      /* success */
                      <motion.div key="success"
                        className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-16"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <SuccessCheck />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.65, duration: 0.45, ease: E }}
                        >
                          <h3 className="font-instrument text-white text-[30px] tracking-[-0.02em] mb-3">
                            We&apos;re on it.
                          </h3>
                          <p className="font-sans text-[15px] text-white/40 max-w-[260px] leading-[1.75]">
                            Expect a reply within 24 hours. We&apos;ll come prepared.
                          </p>
                        </motion.div>
                        <motion.button onClick={onClose}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          transition={{ delay: 1.1 }}
                          className="mt-4 font-mono text-[9px] uppercase tracking-[0.22em] text-white/20 hover:text-white/50 transition-colors duration-300 cursor-pointer"
                        >
                          Close ×
                        </motion.button>
                      </motion.div>

                    ) : (

                      /* form */
                      <motion.form key="form" onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* name + email */}
                        <FadeUp delay={0.25}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field id="name" label="Your name" required value={name}
                              onChange={setName} placeholder="Alex Chen" inputRef={nameRef} />
                            <Field id="email" label="Work email" type="email" required
                              value={email} onChange={setEmail} placeholder="alex@company.com" />
                          </div>
                        </FadeUp>

                        {/* phone */}
                        <FadeUp delay={0.31}>
                          <Field id="phone" label="Phone — optional" type="tel" value={phone}
                            onChange={setPhone} placeholder="+1 415 000 0000" />
                        </FadeUp>

                        {/* project type */}
                        <FadeUp delay={0.37}>
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2.5">
                              What are we building?
                            </p>
                            <Pills options={PROJECT_TYPES} value={ptype} onChange={setPtype} />
                          </div>
                        </FadeUp>

                        {/* brief */}
                        <FadeUp delay={0.44}>
                          <Field id="brief" label="Tell us about your project" textarea
                            value={brief} onChange={setBrief} maxLength={600}
                            placeholder="Describe what you're building, the problem you're solving, and what success looks like…"
                          />
                        </FadeUp>

                        {/* submit */}
                        <FadeUp delay={0.51}>
                          <motion.button
                            type="submit"
                            disabled={status === "submitting" || !name.trim() || !email.trim()}
                            whileHover={{ scale: status === "idle" ? 1.012 : 1 }}
                            whileTap={{ scale: status === "idle" ? 0.978 : 1 }}
                            transition={{ type: "spring", stiffness: 360, damping: 26 }}
                            className="relative w-full flex items-center justify-center gap-3 rounded-2xl py-[15px] font-sans font-semibold text-[14px] tracking-[0.04em] text-white overflow-hidden disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                            style={{
                              background: "linear-gradient(135deg,#FF7A2E 0%,#FF5C00 55%,#E84000 100%)",
                              boxShadow: "0 1px 0 rgba(255,255,255,0.18) inset, 0 10px 40px rgba(255,92,0,0.28)",
                            }}
                          >
                            {/* shimmer sweep */}
                            <motion.span aria-hidden
                              className="absolute inset-0 -skew-x-12 pointer-events-none"
                              style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.11),transparent)" }}
                              initial={{ x: "-150%" }}
                              whileHover={{ x: "150%" }}
                              transition={{ duration: 0.6, ease: "easeInOut" }}
                            />
                            <span className="relative z-10 flex items-center gap-2.5">
                              {status === "submitting" ? (
                                <>
                                  <motion.span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
                                  />
                                  Sending…
                                </>
                              ) : (
                                <>Send brief <ArrowRight size={15} strokeWidth={1.75} /></>
                              )}
                            </span>
                          </motion.button>

                          <p className="text-center font-mono text-[9px] uppercase tracking-[0.18em] text-white/18 mt-3.5">
                            No commitment · We respond within 24 hours
                          </p>
                        </FadeUp>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
