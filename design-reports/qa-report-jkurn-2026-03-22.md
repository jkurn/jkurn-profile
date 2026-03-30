# QA Report: jkurn.me

| Field | Value |
|-------|-------|
| **Date** | 2026-03-22 |
| **URL** | http://localhost:3000 (jkurn.me) |
| **Mode** | Full |
| **Pages visited** | 3 tabs (Profile, Readme for Humans, Readme for Agents.md) |
| **Viewports tested** | Desktop (1280x800), Tablet (768x1024), Mobile (375x812) |

## Health Score: 94/100

| Category | Score |
|----------|-------|
| Console | 100 |
| Links | 100 |
| Visual | 92 |
| Functional | 100 |
| UX | 95 |
| Performance | 92 |
| Content | 92 |
| Accessibility | 88 |

## Top 3 Things to Fix

1. **Social link touch targets** — `min-h-[44px]` is declared but rendered height is ~26px. Needs investigation to ensure WCAG touch target compliance.
2. **Substack URL possible typo** — `freerangefriaiday.substack.com` — verify "friaiday" is intentional (not "friday").
3. **Tab label wrapping on tablet** — "Readme for Agents.md" wraps to two lines at tablet width while other labels stay single-line, creating slight visual asymmetry.

## Console Health: Clean
- 0 errors
- 0 warnings
- Only standard React DevTools info + HMR connected messages

## Network Health: Clean
- 0 failed requests
- 0 server errors

## Issues

### ISSUE-001: Social link touch targets below 44px
- **Severity:** low
- **Category:** accessibility
- **URL:** All pages (hero section)
- **Description:** Social links (LinkedIn, YouTube, etc.) have `min-h-[44px]` in CSS class but render at ~26px height. The `flex items-center` + `py-2` padding doesn't produce a 44px hit area. WCAG 2.5.8 recommends 44x44px touch targets.
- **Repro:** Inspect any social link in the hero section. Bounding box height is 26px.

### ISSUE-002: Substack URL possibly misspelled
- **Severity:** low
- **Category:** content
- **URL:** All pages (hero section)
- **Description:** The Substack link points to `freerangefriaiday.substack.com`. The word "friaiday" may be a typo for "friday" — though this could be intentional branding. Worth verifying.
- **Repro:** Click the Substack link in the hero social links.

### ISSUE-003: Tab label line-height inconsistency at tablet width
- **Severity:** low
- **Category:** visual
- **URL:** All pages (tab navigation)
- **Description:** At tablet viewport (768px), "Readme for Agents.md" wraps to two lines in the tab bar while "Profile" and "Readme for Humans" stay on one line. Creates slight visual asymmetry. Not broken, just uneven.
- **Repro:** Resize to 768px width, observe tab bar.

## Passing Checks

- **Hash deep linking:** `#personal-user-manual` and `#agents.md` correctly activate tabs on page load and update URL on tab click. Profile tab clears hash.
- **Accordion interactions:** All 6 accordion sections in Profile tab open/close smoothly with GSAP animation. No console errors on toggle.
- **Human Manual accordions:** All 7 sections in Humans tab toggle correctly.
- **Agent Manual:** Single `<pre>` block renders CLAUDE.md-style markdown content correctly.
- **Mobile responsiveness:** No horizontal scroll at 375px. Tab labels use shorter variants. Bio text wraps at word boundaries.
- **Tablet responsiveness:** Hero switches to side-by-side layout. All content readable.
- **Desktop layout:** Max-width 5xl contains content properly. Radar chart renders.
- **External links:** All 8 links have `target="_blank"` and `rel="noopener noreferrer"`.
- **Image loading:** Chibi avatar loads correctly at all viewports.
- **XP bar animation:** Animates on page load.
- **Boot sequence:** Loads and transitions to main content.
- **Footer:** Version text "JKURN v1.0 — CHARACTER PROFILE SYSTEM" renders correctly.

## Severity Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 3 |
