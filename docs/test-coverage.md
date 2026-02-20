# Test Coverage Overview

**Last Updated:** 2026-02-20  
**Total Coverage:** ~70% E2E + Visual + A11y

---

## 📊 Test Suites

| Suite | Files | Tests | Coverage |
|-------|-------|-------|----------|
| **Public Pages** | 3 | 45+ | All public routes |
| **Zodiac Pages** | 1 | 48+ | All 12 signs × 4 tests |
| **Horoscope Types** | 1 | 36+ | All 6 types × 6 tests |
| **Chart Creation** | 2 | 25+ | Form flow + chart view |
| **Authentication** | 2 | 12+ | Login + protected routes |
| **Visual Regression** | 1 | 24+ | Screenshots (desktop + mobile) |
| **Accessibility** | 1 | 18+ | WCAG 2.1 AA compliance |
| **Total** | **11 files** | **208+ tests** | **70%** |

---

## ✅ Covered Features

### Pages & Routes (100% public pages)
- ✅ Homepage (`/`)
- ✅ Compatibility (`/compatibility`)
- ✅ Login (`/auth/login`)
- ✅ Chart creation (`/chart/new`) — all 4 steps
- ✅ Chart view (`/chart/[id]`)
- ✅ All 12 zodiac signs (`/zodiac/[sign]`)
- ✅ All 6 horoscope types (`/horoscopes/[type]`)
- ✅ Birthday forecast page structure (`/birthday-forecast/[id]`)

### Functionality
- ✅ Multi-step form navigation (forward/back)
- ✅ Date picker interaction
- ✅ City autocomplete
- ✅ Chart generation
- ✅ Chart wheel rendering (SVG/canvas)
- ✅ Planet positions display
- ✅ Aspects display
- ✅ Social sharing button
- ✅ OAuth redirect (Google)
- ✅ Protected route guards

### Quality
- ✅ Mobile responsiveness (all pages)
- ✅ No horizontal scroll
- ✅ Console error detection
- ✅ Page load performance (<3s)
- ✅ Screenshot comparison (visual regression)
- ✅ WCAG 2.1 AA compliance
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast validation
- ✅ Focus management

---

## ❌ Not Covered (30%)

### Features (pending implementation)
- ❌ Birthday Forecast AI generation (requires OpenAI API in CI)
- ❌ PDF export
- ❌ Email notifications
- ❌ Chart editing
- ❌ Chart deletion
- ❌ Settings page
- ❌ Profile management
- ❌ Payment flows
- ❌ Subscription management

### Authenticated Flows (partial)
- 🟡 Dashboard (basic coverage only)
- ❌ Saved charts history
- ❌ User preferences
- ❌ Notification settings

---

## 🎯 Priority Test Additions

**Q1 2026:**
1. Birthday Forecast full flow (when #77 implemented)
2. PDF download tests
3. Chart history (view/delete)

**Q2 2026:**
4. Payment integration tests
5. Email notification mocks
6. Settings page E2E

---

## 📈 Coverage Goals

| Quarter | Target | Status |
|---------|--------|--------|
| Q4 2025 | 30% | ✅ Achieved |
| Q1 2026 | 70% | ✅ **Current** |
| Q2 2026 | 90% | 🎯 In Progress |
| Q3 2026 | 95% | 📋 Planned |

---

## 🚀 Running Tests

### All suites
```bash
npm test
```

### Specific suite
```bash
npx playwright test zodiac.spec.ts
```

### Accessibility only
```bash
npx playwright test accessibility.spec.ts
```

### Visual regression
```bash
npx playwright test visual-regression.spec.ts
```

### Update visual baselines
```bash
npx playwright test visual-regression.spec.ts --update-snapshots
```

### Interactive mode
```bash
npm run test:ui
```

---

## 📊 Daily Automation

**GitHub Actions:** Runs daily at 08:00 Kyiv
- All E2E tests
- Accessibility audit
- Visual regression (with baseline comparison)
- Creates issue on failure
- Stores artifacts (screenshots, reports)

**PR Validation:** Runs on every PR
- Lint
- Build
- E2E tests (public + mobile)
- Blocks merge if failing

---

## 🐛 Known Issues

### Visual Regression
- ❌ Baselines not yet created — first run will fail (expected)
  - **Fix:** Run `npx playwright test visual-regression.spec.ts --update-snapshots` locally
  - Commit baselines to repo

### Accessibility
- 🟡 Some color contrast warnings (non-critical)
  - Focus indicators on dark backgrounds
  - Will fix in next design pass

### Flaky Tests
- 🟡 `chart-view.spec.ts` — city autocomplete timing
  - **Workaround:** Added `page.waitForTimeout(800)`
  - Will migrate to `page.waitForResponse()` later

---

## 📝 Test Maintenance

### When to update tests

**Add tests when:**
- New feature implemented
- Bug fix that wasn't caught by tests
- New page/route added
- Breaking change in UI

**Update baselines when:**
- Intentional design change
- Font/color updates
- Layout improvements

**Skip tests when:**
- Requires external API (OpenAI, Resend) without mocks
- Flaky due to third-party service

---

## 🔗 Resources

- [Playwright Docs](https://playwright.dev)
- [Axe Accessibility Rules](https://dequeuniversity.com/rules/axe)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
