## Mapping Complete

**Focus:** arch
**Analysis Date:** 2026-08-04

### Directory Organization
- `app/`: Next.js App Router root (contains layout, page, globals.css, SEO meta files like robots.ts/sitemap.ts).
- `components/`: UI components broken down into categories.
  - `layout/`: Navbar, Footer, global shells.
  - `providers/`: React Context providers (Lenis, FormModal, VideoPreload).
  - `sections/`: Page sections (hero, about, services, etc).
  - `ui/`: Reusable primitive components (buttons, custom cursors, overlays).
- `hooks/`: Custom React hooks (likely for animations, viewport intersection, window size).
- `public/`: Static assets (images, fonts, videos).

### Naming Conventions
- React components use PascalCase (e.g., `CustomCursor.tsx`).
- Directories use kebab-case.

<!-- refreshed: 2026-08-04 -->
