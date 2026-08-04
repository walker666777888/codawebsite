## Mapping Complete

**Focus:** quality
**Analysis Date:** 2026-08-04

### Code Style
- Written in TypeScript with strict typing.
- Next.js ESLint configuration handles code linting (`eslint.config.mjs`).
- Tailwind CSS class sorting is likely managed by a prettier plugin (implied by typical Next.js setups, though not explicitly in package.json).
- `clsx` and `tailwind-merge` are used for dynamic class name merging in components.

### Patterns
- Context API used for global UI states instead of Redux/Zustand, which is appropriate for a presentation-heavy site.
- Heavy use of CSS variables (e.g., `--font-instrument-serif`) mapped to Tailwind config for typography.

### Error Handling
- Standard Next.js error boundaries (if `error.tsx` files exist) would manage runtime errors.
- Forms or APIs likely handle errors locally within components.

<!-- refreshed: 2026-08-04 -->
