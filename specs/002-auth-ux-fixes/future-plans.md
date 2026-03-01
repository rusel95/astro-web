# Future Plans: Post-Launch Enhancements

**Feature Branch**: `002-auth-ux-fixes`
**Created**: 2026-02-28
**Status**: Deferred — not in current implementation scope

Items here are validated requirements that were intentionally deferred from the initial release to keep scope focused. They should be implemented as separate features/PRs after the core platform launches.

---

## SEO & AEO Optimization (deferred from FR-040)

**Priority**: High (post-launch)
**Rationale**: SEO is important for organic growth but not blocking for initial launch. Basic Ukrainian page titles are sufficient initially.

### Requirements

- Every page MUST export Next.js metadata: `title`, `description`, and Open Graph tags
- Zodiac sign pages use per-sign OG images (existing OG image generation at `/api/og/[sign]`)
- Feature category pages use category-level OG images
- Structured data (JSON-LD) for horoscope content (Article, FAQPage schemas)
- AEO (Answer Engine Optimization): structured content that AI search engines can extract
- Sitemap generation for all feature pages
- Canonical URLs for all pages
- Ukrainian-language `hreflang` tags

### Implementation Notes

- Existing OG image generation infrastructure can be reused (`/api/og/[sign]`, `/api/share-image/`)
- Next.js App Router metadata API supports all required tags natively
- Consider dynamic OG images for chart result pages

---

## Deep-Linking & URL Shareability (deferred from FR-036)

**Priority**: Medium (post-launch)
**Rationale**: Sharing drives viral growth but requires auth architecture decisions. Core product must work first.

### Requirements

- **Sign-based pages** (zodiac, horoscopes by sign) are shareable via URL — no auth required
- **Personal result pages** (natal chart, personal horoscope, readings) require auth
- Shared URL without auth shows login prompt with context: "Увійдіть, щоб побачити цей результат"
- Social share buttons on shareable pages (copy link, Telegram, Viber, Facebook)
- Share preview cards with OG metadata (depends on SEO work above)

### Implementation Notes

- Sign-based pages are already public routes — just need share buttons
- Personal results need a share-token system OR auth-wall
- Consider short URLs for social sharing

---

## Print/Export (deferred from Out of Scope)

**Priority**: Low
**Rationale**: Users may want to save readings offline. Not critical for launch.

### Requirements

- PDF export for natal chart results (chart SVG + data tables + report)
- PDF export for analysis reports
- Print-friendly CSS for all feature pages
- Export tarot readings as images

---

## Multi-Language Support (deferred from Out of Scope)

**Priority**: Low
**Rationale**: Ukrainian-only for launch. Architecture supports future i18n.

### Requirements

- i18n framework integration (next-intl or similar)
- String extraction from all components to locale files
- Language switcher component
- Per-language SEO metadata
- RTL support consideration for future languages

### Current Preparation

- UI strings are in constants files (not inline), per current architecture
- No i18n framework needed now

---

## Other Deferred Items

| Item | Priority | Notes |
| ---- | -------- | ----- |
| Payment integration | High | Required for monetization |
| Push notifications | Medium | Daily horoscope reminders |
| Email newsletters | Medium | Weekly digests via Resend |
| Admin panel | Medium | Content management, user management |
| Mobile native app | Low | React Native or PWA |
| Pet insights | Low | Lowest priority API namespace |
| AI chat widget | Low | Conversational astrology assistant |
