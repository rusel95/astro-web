# Deferred & Out of Scope — Zorya Platform Redesign

**Source**: `spec.md` (001-astromix-redesign)
**Created**: 2026-02-26
**Purpose**: Track everything excluded from Phase 1 for future implementation

---

## Deferred Requirements (will be built later)

### Payments & Monetization
- **FR-006**: Full AI-powered horoscope reports (30+ sections), delivered on-screen within 60s of payment
- **SC-004**: Report delivery speed metric (requires payments)
- **Order entity**: Purchase tracking, order history, order management
- Payment processing integration (LiqPay, Stripe, or other)
- Refund processing workflow
- Duplicate purchase prevention (show existing report instead)

### Email & Notifications
- **FR-007**: Email delivery of reports and notifications (Resend integration)
- **SC-005**: Email delivery success rate metric
- Email sending: newsletters, discount campaigns, transactional emails
- Email marketing automation sequences (Resend campaigns)
- PDF report delivery via email
- Retargeting abandoned quiz sessions via email
- Push notifications

### Authentication
- **FR-017**: Magic link (passwordless) authentication
- Social login (Google, Apple, etc.)

---

## Out of Scope (no plans yet)

### Platform
- Mobile native app (iOS/Android)
- Multi-language support (Ukrainian only for now)

### Blog, Reviews & Content (US7 — Phase 9)
- **FR-018**: Blog with categorized articles and reviews page with ratings
- Blog listing page (`/blog`) with category filters
- BlogCard, BlogCategoryFilter components
- Reviews page (`/reviews`) with ratings, product filter, "Залишити відгук" form
- Reviews API (`GET/POST /api/reviews`)
- 2026 yearly horoscope page (`/2026`)
- BlogPreviewSection on landing page (replace with simpler CTA or remove)
- Sample/seed reviews data
- **Tasks**: T074, T075, T076, T077, T078, T079, T080

### Marketing & Growth
- A/B testing implementation
- Affiliate/partner program
- SEO content creation (blog articles — placeholder content only at launch)

### Admin & Operations
- Admin panel for product/order management
- Content management system for blog

### AI Search Optimization (AEO)
- Schema.org structured data (FAQPage, Article, WebApplication)
- `llms.txt` file for AI crawler guidance
- Structured content optimized for AI answer engines (ChatGPT, Perplexity, Google AI Overviews)

---

## Suggested Implementation Order (after Phase 1)

| Priority | Feature | Dependencies |
|----------|---------|-------------|
| **Next** | Payment integration (LiqPay/Stripe) | Paywall UI already built |
| **Next** | Full AI report generation + PDF | Payments must be live |
| **Next** | Order management & purchase history | Payments + reports |
| **Soon** | Magic link auth | Independent |
| **Soon** | Email sending (Resend) | Email addresses already collected |
| **Soon** | Blog, Reviews & 2026 page (US7) | Landing page + products must exist |
| **Soon** | AEO / structured data | Blog + content pages must exist |
| **Later** | Email marketing automation | Resend must be integrated |
| **Later** | A/B testing | Analytics baseline needed first |
| **Later** | Admin panel | Payments + orders must exist |
| **Later** | Push notifications | Dashboard must be active |
| **Future** | Multi-language | Full platform stable first |
| **Future** | Mobile native app | Web platform mature |
