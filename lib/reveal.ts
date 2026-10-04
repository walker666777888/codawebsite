/* ─────────────────────────────────────────────────────────────────
   Intro-loader lifecycle signal.

   While the full-screen PageReveal intro is up, everything under it is
   invisible, yet it used to run anyway — competing with page load,
   hydration and font layout and making the intro stutter. Effects that
   are hidden behind the intro (hero canvas, light pillar, scroll pinning)
   wait on these signals instead:

     onRevealOpen  — the shutters start opening (first moment the page
                     underneath becomes visible)
     onRevealDone  — the intro is gone and the page is interactive

   PageReveal marks each phase; if it never runs (reduced motion, other
   routes) the signals fire immediately.
───────────────────────────────────────────────────────────────── */

type Phase = "open" | "done";

const fired: Record<Phase, boolean> = { open: false, done: false };
const waiting: Record<Phase, Set<() => void>> = { open: new Set(), done: new Set() };

function subscribe(phase: Phase, cb: () => void): () => void {
  if (fired[phase]) {
    cb();
    return () => {};
  }
  waiting[phase].add(cb);
  return () => waiting[phase].delete(cb);
}

export function markReveal(phase: Phase) {
  // "done" implies "open"
  const phases: Phase[] = phase === "done" ? ["open", "done"] : ["open"];
  for (const p of phases) {
    if (fired[p]) continue;
    fired[p] = true;
    waiting[p].forEach((cb) => cb());
    waiting[p].clear();
  }
}

export const onRevealOpen = (cb: () => void) => subscribe("open", cb);
export const onRevealDone = (cb: () => void) => subscribe("done", cb);

/**
 * Milliseconds since the intro choreography started. The intro and the
 * hero/nav entrances are CSS animations that start at first paint, which
 * can be well before React hydrates; JS-timed pieces of the same
 * choreography (e.g. the hero typewriter) use this to stay in sync.
 */
let introStartedAt: number | null = null; // performance.now() timestamp

export function introElapsedMs(): number {
  if (typeof document === "undefined") return 0;
  if (introStartedAt === null) {
    // The clock is an infinite CSS animation (no delay) inside PageReveal,
    // so its currentTime is "time since first paint" — finite animations
    // would stop counting once finished.
    const clock = document.querySelector<HTMLElement>("[data-intro-clock]");
    const t = clock?.getAnimations?.()[0]?.currentTime;
    if (typeof t !== "number") return 0;
    introStartedAt = performance.now() - t;
  }
  return performance.now() - introStartedAt;
}

/** A delay (ms, from intro start) converted to "from now". */
export function introDelay(msFromIntroStart: number): number {
  return Math.max(0, msFromIntroStart - introElapsedMs());
}
