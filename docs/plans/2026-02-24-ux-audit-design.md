# UX Audit & Optimization — Design Document
**Date:** 2026-02-24
**Project:** Зоря (astro-web)
**Approach:** Option C — Parallel (Tests + Static Analysis simultaneously)

## Goal
Full audit of the Зоря web app covering:
1. Test suite health (Playwright public + mobile)
2. Accessibility (WCAG 2.1 AA via axe-core)
3. UX improvements (onboarding, navigation, feedback, mobile)
4. Performance (Core Web Vitals, animation, image loading)

## Phase 1: Parallel Discovery

### Thread A — Live Test Run
- `npm install` (install deps)
- `npm run dev` (start dev server in background)
- `npm test` (run Playwright public + mobile projects)
- Capture: failures, console errors, visual regressions

### Thread B — Static Code Audit
Areas to review:
- `src/app/layout.tsx` — nav landmarks, skip link, `<img>` vs `next/image`
- `src/app/page.tsx` — `use client` boundary, SSR potential
- `src/app/globals.css` — `prefers-reduced-motion` completeness
- `src/app/chart/new/page.tsx` — form a11y (labels, ARIA), keyboard nav
- All components — focus styles, color contrast, touch targets

## Phase 2: Fix Priority Order

### P1 — Broken Tests / Runtime Errors
Fix anything that causes test failures or console errors.

### P2 — Accessibility Violations
- Add skip-to-content link
- Add `aria-label` to `<nav>`
- Replace `<img>` with `next/image` for logo
- Ensure all form inputs have associated labels
- Verify focus ring visibility

### P3 — UX Improvements
- Improve mobile navigation (Moon link hidden on mobile without label)
- Better error states in forms
- Loading skeleton improvements
- Onboarding flow clarity

### P4 — Performance
- Convert direct `<img>` to `next/image` (LCP improvement)
- Review `use client` on homepage (SSR opportunity)
- Check `body::before` starfield paint cost on mobile
- Ensure `prefers-reduced-motion` is respected in Framer Motion components

## Known Issues (from code review)
1. `src/app/page.tsx:1` — `'use client'` prevents SSR on homepage
2. `src/app/layout.tsx` — `<img>` tag used for logo (not `next/image`)
3. `src/app/layout.tsx` — `<nav>` missing `aria-label`
4. `src/app/layout.tsx` — No skip-to-main-content link
5. `src/app/chart/new/page.tsx` — name input missing `<label>` element
6. `src/app/chart/new/page.tsx` — gender buttons missing `aria-pressed`
7. Framer Motion animations lack programmatic `prefers-reduced-motion` check
