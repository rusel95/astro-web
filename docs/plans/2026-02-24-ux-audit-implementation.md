# UX Audit & Optimization — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Run a parallel test + static audit of the Зоря astro web app, then fix all discovered accessibility, UX, and performance issues.

**Architecture:** Option C — Parallel (tests against production Vercel URL + static code analysis), then fix by P1→P4 priority order. All fixes are small, targeted edits to existing files — no new files unless required.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Supabase, PostHog, Playwright + axe-core

---

## Task 1: Run Playwright Test Suite (Thread A)

**Files:**
- Read: `playwright.config.ts` (baseURL = `https://astro-web-five.vercel.app`)
- Run: `npm test` (projects: public + mobile)

**Step 1: Install dependencies**

```bash
cd /Users/Ruslan_Popesku/Desktop/astro-web
npm install
```

Expected: clean install (packages already cached)

**Step 2: Run public + mobile tests**

```bash
npm test 2>&1 | tee /tmp/playwright-results.txt
```

Expected: output shows passed/failed per spec file

**Step 3: Review failures**

```bash
cat /tmp/playwright-results.txt | grep -E "FAIL|PASS|Error|✓|✗|×" | head -60
```

Record every failing test name and error message.

**Step 4: Commit test results log (no code change)**

```bash
git add -A
git commit -m "chore: baseline test run before ux audit"
```

---

## Task 2: Static Accessibility Audit (Thread B — run in parallel with Task 1)

**Files:**
- Read: `src/app/layout.tsx`
- Read: `src/app/page.tsx`
- Read: `src/app/chart/new/page.tsx`
- Read: `src/app/globals.css`

**Step 1: Audit layout.tsx**

Check for:
- [ ] `<nav>` has `aria-label`
- [ ] Skip-to-main-content link present
- [ ] Logo uses `next/image` not raw `<img>`
- [ ] `<main>` has `id="main-content"` for skip link

**Step 2: Audit chart/new/page.tsx**

Check for:
- [ ] Name `<input>` has associated `<label>` (not just placeholder)
- [ ] Gender buttons have `aria-pressed` attribute
- [ ] "Unknown time" checkbox has a proper `<label>`
- [ ] Back button `aria-label="Назад"` ✓ (already present)

**Step 3: Audit page.tsx**

Check for:
- [ ] `'use client'` at top — blocks SSR. Can be removed if no client hooks used on initial render (uses `useEffect` and `track` — needs client)
- [ ] Zodiac ring animation — `prefers-reduced-motion` handled by CSS? Verify Framer Motion also respects it

**Step 4: Audit globals.css**

Verify `@media (prefers-reduced-motion: reduce)` covers all animation selectors.

---

## Task 3: Fix P2-A — Add Skip Link + Nav ARIA Label

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Add skip-to-content link and fix nav aria-label**

In `layout.tsx`, before the `<nav>`, add:

```tsx
{/* Skip to main content — a11y */}
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-zorya-purple focus:text-white focus:rounded-lg focus:font-semibold focus:text-sm"
>
  Перейти до основного вмісту
</a>
```

Then add `aria-label="Основна навігація"` to the `<nav>` element.

Then change `<main className="min-h-[calc(100vh-56px)]">` to:

```tsx
<main id="main-content" className="min-h-[calc(100vh-56px)]">
```

**Step 2: Verify with grep**

```bash
grep -n "main-content\|aria-label\|skip\|sr-only" src/app/layout.tsx
```

Expected: 3+ matches

**Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "a11y: add skip link, nav aria-label, main id"
```

---

## Task 4: Fix P2-B — Replace img with next/image for Logo

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Add Image import**

At the top of `layout.tsx`, add:

```tsx
import Image from 'next/image';
```

**Step 2: Replace the img tag**

Change:
```tsx
<img src="/logo-64.png" alt="Зоря" className="w-8 h-8 rounded-xl" />
```

To:
```tsx
<Image src="/logo-64.png" alt="Зоря" width={32} height={32} className="rounded-xl" priority />
```

**Step 3: Verify**

```bash
grep -n "next/image\|<img\|<Image" src/app/layout.tsx
```

Expected: `next/image` import + `<Image` usage, no raw `<img>`

**Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "perf: replace img with next/image for logo (LCP improvement)"
```

---

## Task 5: Fix P2-C — Form Accessibility in chart/new

**Files:**
- Modify: `src/app/chart/new/page.tsx`

**Step 1: Add label for name input**

Find the name input (Step 3, step === 3):

```tsx
<input
  type="text"
  value={name}
  onChange={e => setName(e.target.value)}
  placeholder="Ваше ім'я"
  autoFocus
  className="w-full px-6 py-4 rounded-2xl text-white text-center text-lg placeholder-white/30 focus:outline-none transition-all"
  style={INPUT_STYLE}
/>
```

Change to:

```tsx
<label htmlFor="birth-name" className="sr-only">Ваше ім&apos;я</label>
<input
  id="birth-name"
  type="text"
  value={name}
  onChange={e => setName(e.target.value)}
  placeholder="Ваше ім'я"
  autoFocus
  className="w-full px-6 py-4 rounded-2xl text-white text-center text-lg placeholder-white/30 focus:outline-none transition-all"
  style={INPUT_STYLE}
/>
```

**Step 2: Add aria-pressed to gender buttons**

Find the gender button map and add `aria-pressed`:

```tsx
{(['male', 'female'] as const).map(g => (
  <button
    key={g}
    onClick={() => setGender(g)}
    aria-pressed={gender === g}
    className="py-4 rounded-2xl font-semibold text-base transition-all"
    ...
  >
```

**Step 3: Add label for email input (Step 4)**

Find the email input (step === 4) and add:

```tsx
<label htmlFor="birth-email" className="sr-only">Електронна пошта</label>
<input
  id="birth-email"
  type="email"
  ...
/>
```

**Step 4: Add label for "unknown time" checkbox**

Find the unknown-time button and convert to proper checkbox:

```tsx
<label className="flex items-center gap-3 group cursor-pointer">
  <input
    type="checkbox"
    checked={unknownTime}
    onChange={() => {
      const next = !unknownTime;
      setUnknownTime(next);
      if (next) setBirthTime('12:00');
    }}
    className="sr-only"
  />
  <div
    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
    aria-hidden="true"
    style={{
      background: unknownTime ? '#6C3CE1' : 'transparent',
      border: unknownTime ? '1px solid #9966E6' : '1px solid rgba(255,255,255,0.3)',
    }}
  >
    {unknownTime && (
      <span className="text-white text-xs font-bold">✓</span>
    )}
  </div>
  <span className="text-sm select-none" style={{ color: 'rgba(255,255,255,0.55)' }}>
    Не знаю час народження
  </span>
</label>
```

**Step 5: Verify**

```bash
grep -n "sr-only\|aria-pressed\|htmlFor\|label" src/app/chart/new/page.tsx | head -20
```

**Step 6: Commit**

```bash
git add src/app/chart/new/page.tsx
git commit -m "a11y: add labels and aria-pressed to chart/new form"
```

---

## Task 6: Fix P3-A — UX: Add Focus Ring Styles

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Add focus-visible ring to global CSS**

Add at the bottom of `globals.css`:

```css
/* ===== Focus visible ring (keyboard navigation) ===== */
:focus-visible {
  outline: 2px solid rgba(153, 102, 230, 0.8);
  outline-offset: 3px;
  border-radius: 4px;
}

/* Remove outline for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

**Step 2: Verify**

```bash
grep -n "focus-visible" src/app/globals.css
```

Expected: 2+ matches

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "a11y: add focus-visible ring for keyboard navigation"
```

---

## Task 7: Fix P3-B — UX: Mobile Nav Moon Label

**Files:**
- Modify: `src/app/layout.tsx`

**Problem:** Moon nav link shows only emoji on mobile with no text, and `<span className="hidden md:inline">Місяць</span>` hides text below md breakpoint. Screen reader users on mobile get no context.

**Step 1: Add aria-label to moon link**

Change the moon nav link from:

```tsx
<a
  href="/moon"
  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-white/80 hover:text-white text-sm font-medium rounded-full transition-all hover:bg-white/[0.05]"
>
  <span>🌙</span>
  <span className="hidden md:inline">Місяць</span>
</a>
```

To:

```tsx
<a
  href="/moon"
  aria-label="Місячний календар"
  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-white/80 hover:text-white text-sm font-medium rounded-full transition-all hover:bg-white/[0.05]"
>
  <span aria-hidden="true">🌙</span>
  <span className="hidden md:inline">Місяць</span>
</a>
```

Also add `aria-label` to the "Розрахувати карту" button link:

```tsx
<a
  href="/chart/new"
  aria-label="Розрахувати натальну карту"
  ...
>
```

**Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "a11y: add aria-labels to nav links for screen readers"
```

---

## Task 8: Fix P4-A — Performance: prefers-reduced-motion in Framer Motion

**Files:**
- Modify: `src/app/page.tsx`

**Problem:** The animated zodiac ring on the homepage uses Framer Motion with `animate={{ rotate: 360 }}` but doesn't check `prefers-reduced-motion`. The CSS `@media (prefers-reduced-motion: reduce)` covers CSS animations but Framer Motion uses JS-driven transforms.

**Step 1: Add useReducedMotion hook**

At the top of `Home` component, import and use:

```tsx
import { motion, useReducedMotion } from 'framer-motion';

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  // ...
```

**Step 2: Apply to zodiac ring animation**

Change the zodiac ring `<motion.div>`:

```tsx
<motion.div
  className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] opacity-[0.08]"
  animate={shouldReduceMotion ? {} : { rotate: 360 }}
  transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
>
```

**Step 3: Apply to hero section entrance animations**

Change `initial/animate` pattern for motion elements — if `shouldReduceMotion`, skip the y-offset:

```tsx
<motion.div
  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: shouldReduceMotion ? 0.1 : 0.5 }}
>
```

Apply this pattern to the 4 motion elements in the hero (badge, h1, p, CTA div).

**Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "perf/a11y: respect prefers-reduced-motion in framer motion animations"
```

---

## Task 9: Fix P4-B — Performance: prefers-reduced-motion in chart/new

**Files:**
- Modify: `src/app/chart/new/page.tsx`

**Step 1: Add useReducedMotion**

```tsx
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function NewChartPage() {
  const shouldReduceMotion = useReducedMotion();
  // ...
```

**Step 2: Apply to desktop panel zodiac wheel**

```tsx
<motion.div
  className="absolute inset-0"
  animate={shouldReduceMotion ? {} : { rotate: 360 }}
  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
>
```

**Step 3: Apply to loading screen zodiac wheel**

```tsx
<motion.div
  className="absolute inset-0"
  animate={shouldReduceMotion ? {} : { rotate: 360 }}
  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
>
```

**Step 4: Commit**

```bash
git add src/app/chart/new/page.tsx
git commit -m "perf/a11y: respect prefers-reduced-motion in chart/new animations"
```

---

## Task 10: Fix P3-C — UX: Improve Error State Visibility

**Files:**
- Modify: `src/app/chart/new/page.tsx`

**Problem:** When `error` is set, it shows as a small red text below the input. There's no `role="alert"` so screen readers won't announce it.

**Step 1: Add role="alert" to error messages**

Find each error display in chart/new:

```tsx
{error && (
  <p className="text-red-400 text-sm text-center">{error}</p>
)}
```

Change to:

```tsx
{error && (
  <p role="alert" aria-live="polite" className="text-red-400 text-sm text-center">{error}</p>
)}
```

**Step 2: Same fix in login page**

In `src/app/auth/login/page.tsx`, add `role="alert"` to the error div:

```tsx
{error && (
  <div
    role="alert"
    className="rounded-xl px-4 py-3 text-sm text-center"
    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
  >
    {error}
  </div>
)}
```

Also add `aria-live="polite"` to success message:

```tsx
{success && (
  <div
    role="status"
    aria-live="polite"
    ...
  >
```

**Step 3: Commit**

```bash
git add src/app/chart/new/page.tsx src/app/auth/login/page.tsx
git commit -m "a11y: add role=alert and aria-live to error/success messages"
```

---

## Task 11: Run Tests Again to Verify Fixes

**Step 1: Re-run full test suite**

```bash
npm test 2>&1 | tee /tmp/playwright-results-after.txt
```

**Step 2: Compare with baseline**

```bash
diff /tmp/playwright-results.txt /tmp/playwright-results-after.txt | head -40
```

**Step 3: If accessibility tests pass, done. If new failures, investigate.**

```bash
cat /tmp/playwright-results-after.txt | grep -E "FAIL|Error" | head -20
```

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: ux audit complete - a11y, perf, and UX fixes applied"
```

---

## Summary of All Changes

| File | Changes |
|------|---------|
| `src/app/layout.tsx` | Skip link, nav aria-label, main#id, next/image logo, moon/chart aria-labels |
| `src/app/globals.css` | focus-visible ring styles |
| `src/app/page.tsx` | useReducedMotion for zodiac ring + hero animations |
| `src/app/chart/new/page.tsx` | Labels for name/email, aria-pressed for gender, proper checkbox for unknown time, useReducedMotion, role=alert on errors |
| `src/app/auth/login/page.tsx` | role=alert on errors, aria-live on success |

## Expected Test Improvements
- `accessibility.spec.ts` → all axe violations resolved
- `public-pages.spec.ts` → keyboard navigation tests pass
- `chart-new.spec.ts` → form a11y tests pass
