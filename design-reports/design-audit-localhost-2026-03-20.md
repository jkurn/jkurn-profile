# Design Audit — jkurn.me (localhost:3000)
**Date:** 2026-03-20
**Mode:** Full
**Scope:** All 3 tabs (Profile, Readme for Humans, Readme for Agents.md)
**Viewports:** Mobile (375), Tablet (768), Desktop (1280)

---

## First Impression

- The site communicates **technical competence with personality** — a cyberpunk RPG character sheet that's memorable and distinctive.
- I notice **the hero section dominates mobile**, consuming 65% of the viewport before any content appears.
- The first 3 things my eye goes to are: **1) Chibi avatar**, **2) Gold pixel-font name**, **3) Colorful social link buttons**. The role tags get lost.
- If I had to describe this in one word: **distinctive**.

---

## Design Score: B
## AI Slop Score: A

---

## Inferred Design System

**Fonts (3):** Geist Mono (body), Press Start 2P (headings/labels), ui-sans-serif (fallback) — Good: exactly 3 fonts with clear hierarchy.

**Color Palette (warm dark):**
- Background: `#0a0b1a` (deep navy)
- Panel: `#111827` (dark slate)
- Text primary: `#e8dcc8` (warm cream)
- Text muted: `#8892a8` (cool gray)
- Gold accent: `#dcc06e` (headings)
- Cyan accent: `#22d3ee` (links, highlights)
- Purple accent: `#8b5cf6` (tags)
- Green accent: `#22c55e` (success/strengths)
- Red: `#ef4444`, Blue: `#3b82f6`, Pink: `#ec4899`, Amber: `#f59e0b`

**Verdict:** 12+ unique colors. Coherent cyberpunk palette but borderline on color count.

**Heading Scale:** H1 = 18px Press Start 2P (desktop), 0.6rem mobile. No h2-h6 semantic hierarchy — accordions use custom section headers instead.

---

## Findings

### FINDING-001 — Social link touch targets too small (27px height)
**Impact:** High | **Category:** Interaction States / Responsive
All 8 social links are 27px tall — well below the 44px minimum for touch targets. The "X" link is only 29px wide. On mobile, these are hard to tap accurately.
**Fix:** Increase padding on social links to achieve minimum 44px touch height.

### FINDING-002 — Tab font size too small on mobile (0.5rem = 8px)
**Impact:** High | **Category:** Typography / Responsive
Tab labels render at 8px (0.5rem) with Press Start 2P — extremely small on mobile. Below the 12px minimum for caption/label text.
**Fix:** Increase tab font size to at least 0.55rem on mobile.

### FINDING-003 — No `prefers-reduced-motion` respect on scanline/shimmer animations
**Impact:** Medium | **Category:** Motion
The scanline overlay and stat bar shimmer animations run regardless of user preference. The boot sequence respects it, but CSS animations don't.
**Fix:** Add `@media (prefers-reduced-motion: reduce)` to disable scanline and shimmer.

### FINDING-004 — Accordion section header text wraps awkwardly on mobile
**Impact:** Medium | **Category:** Typography / Responsive
"GROWTH EDGES & HOW TO HELP ME" wraps to 2 lines with "ME" orphaned. Press Start 2P at 0.6rem is too large for long section titles on 375px screens.
**Fix:** Reduce accordion header font size further on mobile, or shorten titles.

### FINDING-005 — No `focus-visible` ring on tab buttons
**Impact:** Medium | **Category:** Interaction States
Tab buttons have no visible focus indicator for keyboard navigation. `outline: none` without replacement.
**Fix:** Add `focus-visible` ring style matching the tab's active color.

### FINDING-006 — Social link hover uses inline JS style manipulation
**Impact:** Polish | **Category:** Code Quality
`onMouseEnter`/`onMouseLeave` handlers set inline styles for hover. Should use CSS `:hover` for better performance and `prefers-reduced-motion` respect.
**Fix:** Move hover styles to CSS class with transition.

### FINDING-007 — Footer text centered but accordion content left-aligned
**Impact:** Polish | **Category:** Visual Hierarchy
The footer "Profile powered by AI-assisted self-analysis..." is centered, creating an alignment inconsistency with the left-aligned content above it.
**Fix:** Left-align footer or add visual separation to justify centering.

### FINDING-008 — `scroll-behavior: smooth` blocks programmatic scrolling
**Impact:** Medium | **Category:** Performance
The global `scroll-behavior: smooth` on `html` prevents instant scroll-to-top when switching tabs, causing the page to appear stuck.
**Fix:** Remove global smooth scroll or scope it to user-initiated navigation only.

### FINDING-009 — Version footer uses absolute pixel font at tiny size
**Impact:** Polish | **Category:** Typography
"JKURN v1.0 — CHARACTER PROFILE SYSTEM" at 11px in Press Start 2P is very hard to read on any viewport.
**Fix:** Slightly increase or switch to mono font for version string.

### FINDING-010 — Avatar frame overflows container by 15px
**Impact:** Polish | **Category:** Spacing & Layout
Avatar container is 100px wide but content measures 115px (scrollWidth), meaning the decorative frame border extends beyond its bounds.
**Fix:** Add `overflow: hidden` to avatar container or increase container width.

---

## Quick Wins (Top 5)

1. **FINDING-001:** Increase social link padding → 44px touch targets (5 min CSS fix)
2. **FINDING-002:** Bump tab font to 0.55rem on mobile (2 min CSS fix)
3. **FINDING-005:** Add focus-visible ring on tabs (3 min CSS fix)
4. **FINDING-008:** Remove `scroll-behavior: smooth` from html (1 min CSS fix)
5. **FINDING-003:** Add reduced-motion media query for animations (5 min CSS fix)
