# Design System Rules: АстроКарта

**Purpose:** Reference guide for implementing new features consistently. Concise, practical rules focused on what implementers need to know.

---

## Color Palette

### Backgrounds
- **Primary (dark mode):** `cosmic-900` (#0a0a1a) — page backgrounds, body
- **Secondary:** `cosmic-800` (#12122a) — secondary surfaces, slightly elevated
- **Tertiary:** `cosmic-700` (#1a1a3e) — hover states, layered elements

### Accent Colors
- **Violet (primary):** `zorya-violet` (#9966E6) — primary interactions, highlights
- **Purple:** `zorya-purple` (#6C3CE1) — buttons, gradients (darker variant of violet)
- **Gold:** `zorya-gold` (#d4af37) — premium features, accents, shimmer effects
- **Blue:** `zorya-blue` (#4D80E6) — secondary highlights, alternative accents

### Status Colors
- **Success:** `zorya-success` (#4DB380) — confirmation, positive feedback
- **Error:** `zorya-error` (#dc2626) — validation, destructive actions

### Text Colors
- **Primary:** `#eeeef5` (var(--color-text-primary)) — headings, body text
- **Secondary:** `rgba(238,238,245,0.65)` (var(--color-text-secondary)) — subtext, descriptions
- **Muted:** `rgba(238,238,245,0.38)` (var(--color-text-muted)) — labels, hints, timestamps

### Glass Effect
- **Base:** `rgba(255,255,255,0.07)` background with `backdrop-blur-[16px] saturate-[1.3]`
- **Border:** `rgba(255,255,255,0.10)` with subtle top highlight `rgba(255,255,255,0.16)`

---

## Typography

### Font Families
- **Display (headings):** Cormorant Garamond (`--font-cormorant`) — h1, h2, hero text, section titles
- **Body (everything else):** Inter (`--font-inter`) — paragraphs, labels, UI text, buttons

### Font Sizing
- **Hero heading:** `text-4xl md:text-6xl lg:text-7xl` (responsive, Cormorant, -0.02em letter-spacing)
- **Section title:** `text-3xl md:text-4xl` (Cormorant, -0.01em letter-spacing)
- **Large body:** `text-base` (16px default, 14px on mobile via media query)
- **Body:** `text-sm` to `text-base` (14-16px)
- **Small/label:** `text-xs` (12px, absolute minimum for accessibility)
- **Mobile override:** All body text reduces to 14px on screens <640px

### Text Styling Classes
- `.text-display` — Cormorant, font-weight 600, -0.02em letter-spacing, line-height 1.1
- `.text-display-sm` — Cormorant, font-weight 500, -0.01em letter-spacing

---

## Spacing & Layout

### Section Padding
- **Standard:** `py-16 md:py-24 px-4`
- **Compact:** `py-8 md:py-12 px-4`
- **Spacious:** `py-24 md:py-32 px-4`

### Container Widths
- **Narrow:** `max-w-3xl` (for single-column, focused content)
- **Standard:** `max-w-5xl` (most pages, good readability)
- **Wide:** `max-w-6xl` (full-width dashboards, product catalogs)
- All containers should be centered with `mx-auto`

### Grid Layouts
- **2-column pairs:** `grid-cols-1 md:grid-cols-2`
- **3-column lists:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **4-column dashboard:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

### Gaps
- **Tight spacing:** `gap-4` (related items, visual grouping)
- **Normal spacing:** `gap-6` (default grid/flex spacing)
- **Spacious:** `gap-8` (between major sections within a container)
- **Section separation:** `gap-12` or `gap-16` (between distinct sections)

---

## Components

### Core UI Components (use these)

#### GlassCard
- **Default variant:** `.glass-card` — standard container
- **Premium variant:** `.glass-card shadow-lg shadow-zorya-purple/20`
- **Accent variant:** `.glass-card border-zorya-purple/30 bg-zorya-purple/5`
- **Subtle variant:** `.glass-card border-white/10 backdrop-blur-sm`
- Always use with `className="...px-6 py-6..."` for padding

```tsx
<GlassCard variant="default" hover>
  <h3 className="text-lg font-semibold">Title</h3>
  <p className="text-secondary">Content</p>
</GlassCard>
```

#### CosmicBackground
- **Wrapper component** for entire pages
- **Three variants:**
  - `variant="default"` — standard cosmic orbs (4 medium orbs)
  - `variant="intense"` — stronger visual effect (larger, more opaque orbs)
  - `variant="calm"` — subtle background (small orbs, minimal animation)

```tsx
<CosmicBackground variant="default">
  {/* page content */}
</CosmicBackground>
```

#### Button (Primary)
- **Class:** `.btn-primary`
- **Height:** 56px desktop, 48px mobile
- **Padding:** `0 2rem` (adjusts on mobile to `0 1.5rem`)
- **Styling:** Gradient #6C3CE1 → #9966E6, glow shadow, rounded-full
- **Always use button element or semantic anchor** — do NOT use divs as buttons

```tsx
<button className="btn-primary">Create Chart</button>
<a href="/chart/new" className="btn-primary">Get Started</a>
```

#### Skeleton (Loading)
- **Use for placeholder content:**
  ```tsx
  <div className="animate-pulse bg-white/5 rounded-lg h-12 w-full" />
  ```
- Apply `animate-pulse` with `bg-white/5` or `bg-white/8` for visibility

#### ProgressDots
- Multi-step form indicator
- Shows current step visually (dots, step N of M text)
- Applies to wizards, quizzes, onboarding flows

---

## Icons

### Critical Rules
1. **NEVER use unicode zodiac symbols** (♈♉♊♋♌♍♎♏♐♑♒♓)
2. **NEVER use emoji for zodiac** (just ugly, not consistent)
3. Always use **`<ZodiacIcon>`** component in React contexts

### ZodiacIcon Component
```tsx
import ZodiacIcon from '@/components/icons/ZodiacIcon';

<ZodiacIcon
  sign="Aries"           // required: zodiac sign name
  size={24}              // optional: defaults to 24
  color="currentColor"   // optional: stroke color
  className="text-zorya-violet"  // optional: apply Tailwind
/>
```

### PlanetIcon Component
- Same pattern as ZodiacIcon
- `sign` prop accepts planet names (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto)

### ProductIcon (Lucide)
- For UI elements (settings, close, menu, check, etc.)
- Import from `@/components/icons/ProductIcon`
- Examples: gem, calendar, star, heart, filter

### SVG Context (OG images, Satori)
- Use `ZODIAC_SVG_PATHS` export from ZodiacIcon
- Use `PLANET_SVG_PATHS` export from PlanetIcon
- Pass raw SVG path strings to Satori components

```tsx
import { ZODIAC_SVG_PATHS } from '@/components/icons/ZodiacIcon';

const path = ZODIAC_SVG_PATHS['Aries'];  // returns SVG path string
```

---

## Buttons & Forms

### Primary Buttons
- **Always use:** `.btn-primary` class or semantic button element
- **Hover state:** translateY(-2px) scale(1.02), enhanced glow
- **Active state:** translateY(0) scale(0.99)
- **Disabled state:** opacity 0.45, cursor not-allowed
- **Mobile:** height reduces to 48px, padding to 1.5rem

### Secondary Buttons (outline)
- **Variant:** `border-2 border-zorya-violet text-zorya-violet bg-transparent`
- **Hover:** `bg-zorya-violet/10`

### Input Fields (Dark Theme)
- **Background:** `bg-white/[0.07]`
- **Border:** `border-white/[0.12]` (1.5px solid)
- **Border radius:** `rounded-xl`
- **Focus state:** `border-zorya-violet` with `box-shadow: 0 0 0 3px rgba(108,60,225,0.15)`
- **Placeholder:** `text-white/40`
- **Disabled:** `opacity-0.4` cursor-not-allowed

### DateInputPicker (Custom)
- **Drum-style scroll interface** (not native input)
- **Returns:** YYYY-MM-DD string format
- **Focused field states:** color animation, glow highlight
- **Validation error border:** red (#f87171) when invalid

```tsx
import DateInputPicker from '@/components/DateInputPicker';

<DateInputPicker
  value="1995-03-21"
  onChange={(date) => setDate(date)}
/>
```

### TimePicker (Custom)
- **Drum-style hour/minute scroll**
- **Format:** HH:mm (24-hour)
- **Special option:** "Невідомо" (Unknown) for unknown birth time
- **Focused field:** violet highlight, glow

```tsx
import TimePicker from '@/components/TimePicker';

<TimePicker
  value="14:30"
  onChange={(time) => setTime(time)}
/>
```

### CitySearch (Geocoding)
- **API:** Nominatim (free, no key needed)
- **Debounce:** 500ms after user stops typing
- **Returns:** { city: string, latitude: number, longitude: number, timezone?: string }
- **Always test** with international city names (Київ, Львів, Москва, etc.)

---

## Shadows & Effects

### Card Shadows
- **Default:** `shadow-card` (0 2px 20px rgba(0,0,0,0.45), inset highlight)
- **Hover:** `shadow-card-hover` (0 8px 40px rgba(0,0,0,0.55), elevated effect)
- **Transition:** 0.35s cubic-bezier(0.34, 1.2, 0.64, 1)

### Glow Shadows
- **Small:** `shadow-glow-sm` — subtle accent
- **Medium:** `shadow-glow` — standard highlight
- **Large:** `shadow-glow-lg` — prominent effect (use sparingly)

### Glass Effect Shadows
- Apply to `.glass-card` — managed by component
- **Inset light edge:** `0 1px 0 rgba(255,255,255,0.04)` (subtle top highlight)

### Button Shadows
- **Rest:** `0 4px 24px rgba(108,60,225,0.45), 0 0 50px rgba(108,60,225,0.22), inset light`
- **Hover:** `0 8px 36px rgba(108,60,225,0.55), 0 0 80px rgba(108,60,225,0.28), inset light`

---

## Animations

### Framer Motion Rules
- **Standard enter animation:**
  ```tsx
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  ```

- **Card transitions:** 0.35s cubic-bezier(0.34, 1.2, 0.64, 1)
- **Quick interactions:** 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)
- **Always wrap with `AnimatePresence`** for exit animations

### Decorative Animations (CSS)
- **Floating orbs:** `animation: orb-float 20s ease-in-out infinite;`
- **Twinkle (stars):** `animation: twinkle 0.6s 50% 100% infinite;` (opacity + scale)
- **Shimmer (text):** `animation: shimmer 6s linear infinite;`
- **Spin (loaders):** `animation: spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;`

### Accessibility: Respect `prefers-reduced-motion`
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

All animations should respect this by default (not overriding).

---

## Responsive Breakpoints (Mobile-First)

### Tailwind Breakpoints
- **Default (mobile):** < 640px — PRIMARY TARGET for feature work
- **sm:** 640px — tablet portrait
- **md:** 768px — tablet landscape / small desktop
- **lg:** 1024px — desktop
- **xl:** 1280px — wide desktop

### Mobile-First Pattern
```tsx
{/* Default mobile, then add desktop overrides */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(...)}
</div>
```

### Table Overflow on Mobile
- **Wrapper:** `overflow-x-auto -mx-4`
- **Content:** `min-w-[400px]` to prevent mobile collapse
- **Text sizing:** Text reduces to 14px on mobile automatically via CSS

### Touch Targets
- **Minimum:** 44px × 44px on mobile (button height 48px)
- **Padding override:** `button, a[href] { min-height: 44px; }`

---

## Accessibility

### ARIA Labels
- **All SVG icons:** `aria-label={sign/planet/icon name}`
  ```tsx
  <ZodiacIcon sign="Aries" aria-label="Aries sign icon" />
  ```
- **Navigation:** `aria-label="Головна навігація"` (main nav)
- **Skip link:** visible on focus, allows jump to main content

### Focus Management
- **Visible focus ring:** colored (purple), not hidden
- **Tab order:** logical, left-to-right
- **Modal focus trap:** focus stays within modal, trap on close button

### Color Contrast
- **Text/background:** AA minimum 4.5:1 (normal text)
- **Large text:** 3:1 minimum
- **Border/background:** 3:1 where possible
- Test with tools: WebAIM Contrast Checker, Lighthouse

### Reduced Motion
- All animated components should respect `prefers-reduced-motion: reduce`
- Provide static alternative instantly (no animations)

---

## Form Patterns

### Birth Data Collection (3-step or full)
1. **Date picker:** DateInputPicker (drum-style)
2. **Time picker:** TimePicker (drum-style) + "Невідомо" option for unknown
3. **City search:** CitySearch with Nominatim API
4. **Validation:** client-side before submit (date range 1900-2030, time 00:00-23:59)

### Checkbox/Radio
- **Styled with Tailwind,** NOT browser default
- **Custom implementation:** check icon (ProductIcon), highlight on focus
- **Accessible:** always paired with `<label>` or `aria-label`

### Dropdown/Select
- **Custom styling:** `appearance-none` with custom SVG dropdown arrow
- **Dark theme:** `bg-white/[0.07] border-white/[0.12]`
- **Focus:** `border-zorya-violet box-shadow: 0 0 0 3px rgba(108,60,225,0.15)`

### Email Input
- **Validation:** basic email regex or server validation
- **Error state:** red border (#dc2626), error message below
- **Success state:** green checkmark (ProductIcon) or `zorya-success` border

---

## Ukrainian Text (Constants)

### Always Import from Constants
```tsx
import {
  ZODIAC_NAMES_UK,  // Овен, Телець, ...
  PLANET_NAMES_UK,  // Сонце, Місяць, ...
  ASPECT_NAMES_UK,  // Кон'юнкція, Опозиція, ...
  ZODIAC_SYMBOLS,   // ♈, ♉, ... (never use in UI)
} from '@/lib/constants';
```

### Common Text
- **Zodiac:** always use `ZODIAC_NAMES_UK[sign]` — never hardcode
- **Planets:** use `PLANET_NAMES_UK[planet]`
- **Aspects:** use `ASPECT_NAMES_UK[aspect]`
- All user-facing UI text in **Ukrainian**
- All code comments and variables in **English**

---

## Page Template

Every new feature page should follow this minimal pattern:

```tsx
import { Metadata } from 'next';
import CosmicBackground from '@/components/ui/CosmicBackground';
import GlassCard from '@/components/ui/GlassCard';

export const metadata: Metadata = {
  title: 'Feature Title | АстроКарта',
  description: 'Brief description in Ukrainian',
};

export default function FeaturePage() {
  return (
    <CosmicBackground variant="default">
      <div className="container mx-auto max-w-5xl py-16 md:py-24 px-4">
        <h1 className="text-4xl md:text-6xl font-display mb-6">
          Заголовок Сторінки
        </h1>

        <GlassCard variant="default" className="p-6 mb-8">
          <p className="text-secondary mb-4">
            Опис функції або вступний текст.
          </p>
          <button className="btn-primary">Дія</button>
        </GlassCard>

        {/* Feature content */}
      </div>
    </CosmicBackground>
  );
}
```

### Page Requirements
1. **Metadata export:** title (with " | АстроКарта" suffix), description
2. **CosmicBackground wrapper:** with appropriate variant
3. **Container:** `mx-auto max-w-5xl` (or adjust max-w based on content)
4. **Section padding:** `py-16 md:py-24 px-4`
5. **All text:** Ukrainian (user-facing), English (code)
6. **Mobile support:** test at 375px viewport
7. **Desktop support:** test at 1280px+ viewport

---

## Key Takeaways

- **Components first:** use GlassCard, CosmicBackground, ZodiacIcon — don't reinvent
- **Mobile-first:** write for 375px default, add breakpoints for larger screens
- **Dark cosmic theme:** cosmic-900 bg, zorya-violet accents, glass cards
- **Animations:** Framer Motion for interactions, respect reduced-motion
- **Icons:** never use unicode zodiac, always use components
- **Text:** Ukrainian UI, English code, import constants for astrology terms
- **Accessibility:** visible focus rings, ARIA labels, 4.5:1 contrast minimum
- **Shadows:** card shadows on hover, glow on interactive elements
- **Spacing:** use Tailwind utilities, follow gap/padding system
- **Buttons:** always `.btn-primary`, min 44px mobile touch target
