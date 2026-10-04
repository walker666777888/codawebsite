/* ─────────────────────────────────────────────────────────────────
   Filter-free ambient glows.

   These soft orange glows were radial-gradient blobs with a huge
   `filter: blur(100–160px)` on top. Large blur filters are among the most
   expensive things to keep on a page: they cost paint/layer work every
   frame and kept scroll frames over budget. Each glow below is the same
   blob pre-blurred numerically (original gradient → Gaussian blur of the
   same radius → fitted with an explicit radial-gradient), so it looks the
   same with zero filter cost. Because the blur spread the glow beyond its
   box, each keeps its original box/position and is enlarged with the
   `scale` property (which composes with any translate/transform).
   Max fitted alpha error per glow is ≤ 0.06 before the element’s own
   5–11% opacity is applied — below what can be seen.
───────────────────────────────────────────────────────────────── */
import type { CSSProperties } from "react";

/** Philosophy — 700px, blur 160px */
export const PHILOSOPHY_GLOW_A: CSSProperties = { background: "radial-gradient(49.02% 49.02% at 50% 50%, rgba(255,92,0,0.4044) 0%, rgba(255,92,0,0.4016) 3.6%, rgba(255,92,0,0.3887) 8.8%, rgba(255,92,0,0.3615) 14.9%, rgba(255,92,0,0.3192) 21.6%, rgba(255,92,0,0.2649) 28.9%, rgba(255,92,0,0.2043) 36.6%, rgba(255,92,0,0.1448) 44.7%, rgba(255,92,0,0.0933) 53.2%, rgba(255,92,0,0.0539) 62%, rgba(255,92,0,0.0276) 71.1%, rgba(255,92,0,0.0124) 80.5%, rgba(255,92,0,0.0048) 90.1%, rgba(255,92,0,0) 100%)", scale: "1.941" };
/** Philosophy — 500px warm, blur 130px */
export const PHILOSOPHY_GLOW_B: CSSProperties = { background: "radial-gradient(49.02% 49.02% at 50% 50%, rgba(255,144,64,0.3457) 0%, rgba(255,144,64,0.3432) 3.6%, rgba(255,144,64,0.3318) 8.8%, rgba(255,144,64,0.3078) 14.9%, rgba(255,144,64,0.2709) 21.6%, rgba(255,144,64,0.2238) 28.9%, rgba(255,144,64,0.1717) 36.6%, rgba(255,144,64,0.121) 44.7%, rgba(255,144,64,0.0776) 53.2%, rgba(255,144,64,0.0448) 62%, rgba(255,144,64,0.023) 71.1%, rgba(255,144,64,0.0104) 80.5%, rgba(255,144,64,0.0041) 90.1%, rgba(255,144,64,0) 100%)", scale: "2.113" };
/** Statement spread backdrop — 900×600, blur 140px */
export const SPREAD_GLOW_A: CSSProperties = { background: "radial-gradient(41.47% 49.02% at 50% 50%, rgba(255,92,0,0.5101) 0%, rgba(255,92,0,0.5101) 3.6%, rgba(255,92,0,0.5037) 8.8%, rgba(255,92,0,0.4868) 14.9%, rgba(255,92,0,0.4565) 21.6%, rgba(255,92,0,0.4126) 28.9%, rgba(255,92,0,0.3564) 36.6%, rgba(255,92,0,0.2921) 44.7%, rgba(255,92,0,0.2253) 53.2%, rgba(255,92,0,0.162) 62%, rgba(255,92,0,0.1072) 71.1%, rgba(255,92,0,0.0646) 80.5%, rgba(255,92,0,0.0351) 90.1%, rgba(255,92,0,0) 100%)", scale: "1.674" };
/** Statement spread backdrop — 500px, blur 120px */
export const SPREAD_GLOW_B: CSSProperties = { background: "radial-gradient(49.02% 49.02% at 50% 50%, rgba(255,92,0,0.4161) 0%, rgba(255,92,0,0.4133) 3.6%, rgba(255,92,0,0.3999) 8.8%, rgba(255,92,0,0.372) 14.9%, rgba(255,92,0,0.3287) 21.6%, rgba(255,92,0,0.273) 28.9%, rgba(255,92,0,0.2107) 36.6%, rgba(255,92,0,0.1495) 44.7%, rgba(255,92,0,0.0964) 53.2%, rgba(255,92,0,0.0557) 62%, rgba(255,92,0,0.0285) 71.1%, rgba(255,92,0,0.0128) 80.5%, rgba(255,92,0,0.0049) 90.1%, rgba(255,92,0,0) 100%)", scale: "2.056" };
/** Statement ambient — 700px, blur 160px */
export const STATEMENT_GLOW_A: CSSProperties = { background: "radial-gradient(49.02% 49.02% at 50% 50%, rgba(255,92,0,0.4044) 0%, rgba(255,92,0,0.4016) 3.6%, rgba(255,92,0,0.3887) 8.8%, rgba(255,92,0,0.3615) 14.9%, rgba(255,92,0,0.3192) 21.6%, rgba(255,92,0,0.2649) 28.9%, rgba(255,92,0,0.2043) 36.6%, rgba(255,92,0,0.1448) 44.7%, rgba(255,92,0,0.0933) 53.2%, rgba(255,92,0,0.0539) 62%, rgba(255,92,0,0.0276) 71.1%, rgba(255,92,0,0.0124) 80.5%, rgba(255,92,0,0.0048) 90.1%, rgba(255,92,0,0) 100%)", scale: "1.941" };
/** Statement ambient — 500px, blur 130px */
export const STATEMENT_GLOW_B: CSSProperties = { background: "radial-gradient(49.02% 49.02% at 50% 50%, rgba(255,92,0,0.3457) 0%, rgba(255,92,0,0.3432) 3.6%, rgba(255,92,0,0.3318) 8.8%, rgba(255,92,0,0.3078) 14.9%, rgba(255,92,0,0.2709) 21.6%, rgba(255,92,0,0.2238) 28.9%, rgba(255,92,0,0.1717) 36.6%, rgba(255,92,0,0.121) 44.7%, rgba(255,92,0,0.0776) 53.2%, rgba(255,92,0,0.0448) 62%, rgba(255,92,0,0.023) 71.1%, rgba(255,92,0,0.0104) 80.5%, rgba(255,92,0,0.0041) 90.1%, rgba(255,92,0,0) 100%)", scale: "2.113" };
/** CTA text backdrop — 800×500 black/60, blur 100px */
export const CTA_TEXT_BACKDROP: CSSProperties = { background: "radial-gradient(44.93% 49.02% at 50% 50%, rgba(0,0,0,0.5898) 0%, rgba(0,0,0,0.5898) 3.6%, rgba(0,0,0,0.5887) 8.8%, rgba(0,0,0,0.5855) 14.9%, rgba(0,0,0,0.5785) 21.6%, rgba(0,0,0,0.5659) 28.9%, rgba(0,0,0,0.544) 36.6%, rgba(0,0,0,0.5087) 44.7%, rgba(0,0,0,0.4555) 53.2%, rgba(0,0,0,0.3819) 62%, rgba(0,0,0,0.2937) 71.1%, rgba(0,0,0,0.2015) 80.5%, rgba(0,0,0,0.1209) 90.1%, rgba(0,0,0,0) 100%)", scale: "1.53" };

/** Discipline card / landscape tile hover glow — 192px, blur 60px */
export const CARD_HOVER_GLOW: CSSProperties = { background: "radial-gradient(49.02% 49.02% at 50% 50%, rgba(255,92,0,0.0656) 0%, rgba(255,92,0,0.0651) 3.6%, rgba(255,92,0,0.0628) 8.8%, rgba(255,92,0,0.0581) 14.9%, rgba(255,92,0,0.0509) 21.6%, rgba(255,92,0,0.0418) 28.9%, rgba(255,92,0,0.0319) 36.6%, rgba(255,92,0,0.0223) 44.7%, rgba(255,92,0,0.0142) 53.2%, rgba(255,92,0,0.0082) 62%, rgba(255,92,0,0.0042) 71.1%, rgba(255,92,0,0.0019) 80.5%, rgba(255,92,0,0.0007) 90.1%, rgba(255,92,0,0) 100%)", scale: "2.465" };

const WORK_GLOW_STOPS: [number, number][] = [[0.5425,0],[0.5384,3.6],[0.5206,8.8],[0.4837,14.9],[0.4266,21.6],[0.3534,28.9],[0.2719,36.6],[0.1921,44.7],[0.1233,53.2],[0.071,62],[0.0363,71.1],[0.0162,80.5],[0.0063,90.1],[0,100]];
/** Work card accent glow — 200px solid, blur 80px */
export function workGlow(hex: string): CSSProperties {
  const n = parseInt(hex.replace("#", ""), 16);
  const rgb = `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  return {
    background: `radial-gradient(49.02% 49.02% at 50% 50%, ${WORK_GLOW_STOPS.map(([a, p]) => `rgba(${rgb},${a}) ${p}%`).join(", ")})`,
    scale: "3.162",
  };
}
