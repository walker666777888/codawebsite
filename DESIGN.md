---
name: Citizen Of Digital Age
description: High-performance digital ecosystems — web platforms, AI products, design systems.
colors:
  primary: "#FF5C00"
  primary-mid: "#FF7A1A"
  primary-light: "#FF9E42"
  primary-dark: "#E65300"
  neutral-bg: "#F4F0E8"
  ink: "#0D0D0B"
  ink-dark: "#14130F"
  muted: "#4D4A45"
  grid: "#E6E1DA"
  viz-amber: "#F59E0B"
  viz-yellow: "#FCD34D"
  viz-green: "#22C55E"
  glitch-r: "#FF1500"
  glitch-g: "#00FF88"
  glitch-b: "#00E5FF"
  glitch-blue: "#008CFF"
  dark-overlay: "#3D3A35"
  modal-dark: "#26160C"
  modal-darker: "#23140A"
  philosophy-1: "#DCC88C"
  philosophy-2: "#8CC89B"
  philosophy-3: "#C8BEAA"
  philosophy-4: "#8CA0DC"
  philosophy-5: "#FF8C50"
  philosophy-6: "#AA82D2"
  philosophy-7: "#FF9040"
  pillar-grey: "#888888"
typography:
  display:
    fontFamily: "Playfair Display, serif"
    fontWeight: 400
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Montserrat, sans-serif"
    fontWeight: 600
  body:
    fontFamily: "Montserrat, sans-serif"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Space Mono, monospace"
    fontWeight: 400
    letterSpacing: "0.15em"
rounded:
  xs: "4px"
  sm: "8px"
  md: "16px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "16px 32px"
    typography: "{typography.label}"
---

# Design System: Citizen Of Digital Age

## Overview

**Creative North Star: "The Engineered Gallery"**

This system represents absolute digital precision blended with warm, tactile sophistication. It is unapologetically high-tech and sleek but deliberately offsets the coldness of raw data with organic, editorial typography (Playfair Display) and warm paper-like background colors. It is built to compound and scale without ever feeling generic.

**Key Characteristics:**
- Tactical use of a vibrant accent color (#FF5C00) against muted paper backgrounds.
- High-contrast, editorial display typography paired with technical monospace labels.
- Micro-interactions that feel buttery smooth and responsive.
- Fluid, physics-driven animations (WebGL and spring-based UI) rather than static layouts.

## Colors

The palette balances the warmth of a creative studio with the sharp precision of a high-tech engineering firm.

### Primary
- **Digital Flame** (#FF5C00): The single accent color. Used sparingly to draw the eye, signal interactive states, or create stark contrast.

### Neutral
- **Paper Warmth** (#F4F0E8): The primary background color for the entire surface.
- **Deep Ink** (#0D0D0B): The primary text color for all headings and major readable body copy.
- **Technical Grid** (#E6E1DA): Used for fine lines, borders, and structural dividers that shouldn't compete with content.

### Named Rules
**The Surgical Accent Rule.** Digital Flame (#FF5C00) must never be used as a large background fill. It is a highlighter, a laser pointer, and a call to action.

## Typography

**Display Font:** Clash Display (sans-serif)
**Body Font:** Satoshi (sans-serif)
**Label/Mono Font:** Space Mono (monospace)

**Character:** A high-end tech ecosystem meets a digital gallery. The high-tech, geometric sans-serifs combine with utilitarian monospace to create the signature sleekness of the brand.

### Hierarchy
- **Display** (400-600, clamp(64px, 11vw, 150px), 1.04): Used exclusively for hero statements and massive section headers. Extremely tight letter-spacing (-0.04em).
- **Headline** (500-600, clamp(36px, 5vw, 66px), 1.04): For secondary section headers.
- **Body** (400-500, 16px, 1.65): Main reading text. Highly legible and breathable.
- **Label** (400, 10px - 12px, 0.15em, uppercase): Used for metadata, technical readouts, overlines, and tiny navigational elements.

### Named Rules
**The Typographic Tech Rule.** Ensure tight letter-spacing for large expressive headlines to maintain the engineered feel. Use Space Mono strictly for technical UI elements.

## Layout

The spatial model relies on a fixed maximal width (`max-w-7xl`) centered in the viewport, but elements frequently break the container to bleed to the edges (like the marquee and fluid backgrounds). Density is comfortable, with massive padding (often `py-24` or `py-36`) separating distinct vertical sections.

## Elevation & Depth

The system uses hybrid depth: surfaces are completely flat by default, relying on fine 1px grid lines for separation, but interactive elements employ soft, diffuse shadows or WebGL fluid distortion for physical depth.

### Shadow Vocabulary
- **Interactive Glow** (`0 16px 40px -12px rgba(255, 92, 0, 0.35)`): Used on primary buttons and interactive accents.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, elevation, focus) or as abstract ambient lighting.

## Shapes

Forms are geometric and deliberate. Components use full-rounded pills (`9999px`) for buttons to feel approachable, but cards and structural containers use tight, engineered corners (`16px`). 

## Components

### Buttons
- **Shape:** Full pill radius (`9999px`)
- **Primary:** Digital Flame background, white text, bold sans-serif.
- **Hover / Focus:** Magnetic physics attraction (via Framer Motion) with a slight scale-up and inner glow.

### Cards / Containers
- **Corner Style:** 16px
- **Background:** Subtle dark gradients for premium project showcase.
- **Border:** Occasional 1px semi-transparent white lines to establish structure.

## Do's and Don'ts

### Do:
- **Do** rely on generous vertical spacing (`py-24`, `py-36`) to let sections breathe.
- **Do** mix the Playfair serif with Space Mono for technical metadata.

### Don't:
- **Don't** use drop shadows to separate static content containers; use 1px grid lines instead.
- **Don't** center-align body copy longer than 3 lines.
- **Don't** overuse the #FF5C00 accent; its rarity is its power.
