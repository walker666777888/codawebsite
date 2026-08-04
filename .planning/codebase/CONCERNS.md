## Mapping Complete

**Focus:** concerns
**Analysis Date:** 2026-08-04

### Technical Debt & Concerns
- **Performance**: High reliance on heavy animation libraries (GSAP, Three.js, Framer Motion) could impact performance on low-end devices if not optimized (e.g., via lazy loading or `react-three-fiber` optimization techniques).
- **SEO**: Currently uses `next/font/google` and standard metadata API which is good, but complex GSAP animations sometimes hide content from initial DOM parsing. Ensure critical text is rendered server-side.
- **Testing**: Lack of automated tests means visual regressions from CSS/Tailwind changes or GSAP timing changes must be caught manually.
- **Complexity**: Multiple animation libraries are installed simultaneously (`motion`, `gsap`, `three`). This could lead to a bloated bundle size if they are used redundantly across different components.

<!-- refreshed: 2026-08-04 -->
