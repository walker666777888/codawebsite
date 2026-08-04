## Mapping Complete

**Focus:** arch
**Analysis Date:** 2026-08-04

### Application Architecture
- **Paradigm**: Next.js App Router (React Server Components by default, Client Components where interactivity is needed).
- **Layout**: A global `app/layout.tsx` wraps the application, providing contextual providers (Lenis for scrolling, FormModal, VideoPreload).
- **Styling Architecture**: Tailwind CSS manages utility classes. Global CSS variables are used for theme customization and typography. Custom classes are defined in `app/globals.css`.

### Entry Points
- `app/layout.tsx`: Root layout and global providers.
- `app/page.tsx`: Home page entry.
- `components/layout/Navbar.tsx` & `Footer.tsx`: Persistent navigation and footer.

### Data Flow
- Largely static data flow for a marketing agency site. State is managed via React Context (e.g., `FormModalProvider`, `VideoPreloadProvider`) for global UI interactions.
- Complex scroll animations use GSAP/Motion hooked into the Lenis scroll loop.

<!-- refreshed: 2026-08-04 -->
