# Authentication Flow Audit — Zorya Astrology App

**Date:** 2026-02-27
**Issue:** Redundant flows for authenticated users, landing page CTAs shown to logged-in users, forms asking for pre-filled data again

---

## Executive Summary

The app has **critical UX issues** where authenticated users are exposed to unauth landing pages and forced through entry flows they've already completed. This creates friction and undermines the value proposition of authentication.

**Key Problems:**
1. Homepage shows signup CTA to logged-in users
2. Quiz accessible to auth users (data re-entry)
3. Product pages show full form even for auth users
4. Moon page shows personalized text to unauth users (bug)
5. Compatibility page persists sessionStorage across logout
6. Stats show hardcoded values

---

## Detailed Route Audit

### 1. **HOME: `/` (Homepage)**

**File:** `/src/app/(main)/page.tsx` + `HomeClient.tsx`

**Accessible to:**
- ✓ Unauthenticated users
- ✓ Authenticated users

**Content Differences:**
- No auth-aware logic (no redirect, no layout change)
- Shows landing page sections to **all users**:
  - HeroSection → CTA: "Дізнатися свій гороскоп" → links to `/quiz`
  - AccountBenefitsSection → CTA: "Створити акаунт" (shown **even to logged-in users**)
  - StatsSection → CTA: "Приєднатися" → links to `/quiz`

**CRITICAL ISSUE - Line 1 in HomeClient.tsx:**
```tsx
// Shows landing page to EVERYONE, including logged-in users
return (
  <div>
    <HeroSection />
    <PainPointsSection />
    <HowItWorksSection />
    <ProductCatalog />
    <BookOfLifeSection />
    <TestimonialsSection />
    <StatsSection />
    <AccountBenefitsSection />  {/* ← "Створити акаунт" CTA */}
    <EmailSubscriptionSection />
    <SeoTextSection />
  </div>
);
```

**User Quote (Angry):**
> "Why the hell should I enter all of my data again? Like my name, email, DOB... Maybe I shouldn't have the ability to take the quiz when logged in. Some flows feel like a landing page - which matters only for unauth users."

**Recommendation:**
- **For auth users:** Redirect to `/dashboard` OR show auth-specific home (my charts, daily horoscope, etc.)
- **For unauth users:** Keep current landing page
- **Implementation:** Add `getUser()` call in main layout, pass to HomeClient, render different UI

---

### 2. **QUIZ: `/quiz`**

**File:** `/src/app/(quiz)/quiz/page.tsx` + `QuizClient.tsx`

**Accessible to:**
- ✓ Unauthenticated users
- ✓ Authenticated users (PROBLEM)

**Content Differences:**
- **NONE** — quiz is identical for both auth and unauth
- **No pre-fill from user profile** (unlike `/chart/new`)
- Session data stored in `sessionStorage` (line 92-97 in QuizClient)
- No check if user already has charts

**Flow for Auth User:**
1. Logged-in user visits `/quiz`
2. Enters ALL data from scratch (name, DOB, city, time, gender, email)
3. Creates a "quiz session" stored in sessionStorage
4. Shows mini-horoscope
5. Then shows paywall to upgrade to full chart

**DESIGN FLAW:**
- Quiz is a **lead magnet for unauth users** — it should NOT exist for auth users
- Auth users with existing charts should go to `/chart/new` instead
- Or quiz should be **redirect-gated** to `/dashboard` if user is logged in

**User Complaint Context:**
The user has already created charts in their account. Why must they re-enter all data in a quiz?

**Recommendation:**
- **For auth users:** Redirect to `/chart/new` or `/dashboard`
- **For unauth users:** Keep as-is (lead magnet)
- **Redirect Logic:** Check `getUser()` in page component or use middleware
- **Alternative:** Auto-fill quiz from latest chart if auth

---

### 3. **CHART CREATION: `/chart/new`**

**File:** `/src/app/(main)/chart/new/page.tsx` + `ChartNewClient.tsx`

**Accessible to:**
- ✓ Unauthenticated users (stores in sessionStorage + localStorage)
- ✓ Authenticated users (saves to Supabase)

**Content Differences:**
- **Same 4-step flow for both**
- Auth users: Saves to `supabase.charts` table (lines 179-202)
- Unauth users: Saves to localStorage/sessionStorage only

**Pre-fill:**
- ❌ **NO pre-fill from user profile** (unlike `/horoscope/[slug]`)
- Auth users must enter name/DOB again even if they have existing charts

**Recommendation:**
- **Add optional pre-fill from latest chart:**
  - Check `getUser()` in page component
  - If auth + has charts, show "Use my existing chart [Name]" dropdown
  - Allow override if user wants to create new chart
- **Keep as-is for unauth users**

---

### 4. **PRODUCT PAGES: `/horoscope/[slug]`**

**File:** `/src/app/(main)/horoscope/[slug]/page.tsx` + `ProductPageTemplate.tsx` + `ProductForm.tsx`

**Accessible to:**
- ✓ Unauthenticated users
- ✓ Authenticated users

**Content Differences:**
- **Same form for both** (ProductForm.tsx lines 17-200)
- **Pre-fill logic (lines 31-101):**
  1. If user is logged in:
     - Fetch latest chart from Supabase
     - Auto-fill name, DOB, birth_time, city, gender, email
     - Show: "✦ Дані заповнені автоматично з вашого профілю"
  2. If no auth, fallback to quiz sessionStorage

**ISSUE - Line 125-129:**
```tsx
{prefilled && (
  <p className="text-xs text-zorya-violet mb-4">
    ✓ Дані заповнені автоматично з вашого профілю
  </p>
)}
```

**User Complaint:**
> "Product pages ask for ALL user data again (pre-filled from profile but still a full form)"

**The user is saying:** Even though data is pre-filled, I shouldn't see a form at all if it's already in my account. The flow feels redundant.

**Two Possible Designs:**

**Option A (Recommended for UX):**
- For auth users: **Skip the form entirely**
- Auto-submit with latest chart data
- Show loading → results directly
- Optional: Show "Using chart: [Name]" with button to pick different chart

**Option B (Current + Minor Fix):**
- Keep form for both
- But for auth users, make it a "quick confirm" view
- Hide most fields, show only key data in read-only mode
- Single button: "Generate Report"

**Recommendation: Implement Option A**
- Create separate `ProductPage.tsx` (server-side) that checks `getUser()`
- If auth → fetch latest chart → call `/api/report` server-side → show results
- If unauth → show form as-is
- Much cleaner UX for returning users

---

### 5. **MOON CALENDAR: `/moon`**

**File:** `/src/app/(main)/moon/page.tsx` + `MoonTransitCard.tsx`

**Accessible to:**
- ✓ Unauthenticated users
- ✓ Authenticated users

**Content Differences:**
- **Same content for both**
- **General moon phases** for all users
- **BUG (Line 29-30 in MoonTransitCard.tsx):**
  ```tsx
  <div>
    <p className="text-sm text-muted-foreground">У вашому чарті</p>
    <p className="text-lg">{moon.house} дім</p>  {/* ← Always 1 for unauth */}
  </div>
  ```

**Issue:**
- Label "У вашому чарті" (In your chart) is shown to **unauth users**
- They don't have a chart! It's confusing
- The house is hardcoded to 1 (line 28 in `/moon/page.tsx`)

**Recommendation:**
- **For unauth users:**
  - Hide "У вашому чарті" section entirely
  - OR show "Create chart to see your personalized house position"
  - OR just show "Moon Position" without "your chart" context
- **For auth users:**
  - Fetch their latest chart
  - Calculate actual moon house for their chart
  - Show personalized transit recommendations
- **Implementation:** Add `getUser()` check, conditionally render

---

### 6. **COMPATIBILITY CHECKER: `/compatibility`**

**File:** `/src/app/(main)/compatibility/page.tsx` + `CompatibilityClient.tsx`

**Accessible to:**
- ✓ Unauthenticated users
- ✓ Authenticated users (auto-fill from charts)

**Content Differences:**
- **For auth users:** Fetches saved charts (lines 59-80), auto-selects first chart
- **For unauth users:** Manual entry only

**SessionStorage Persistence Bug (line 56):**
```tsx
const [result, setResult] = useState<any>(null);

// Result is stored in component state, NOT cleared on logout
// If user logs out while compatibility result is visible,
// the data persists in that tab/session
```

**Data Leak Potential:**
1. User A (auth) generates compatibility result
2. User A logs out
3. User B (or shared computer) visits `/compatibility`
4. Previous result still in memory

**Recommendation:**
- Clear result state on auth change (add effect listening to user changes)
- Use Supabase auth listener to detect logout
- Add:
  ```tsx
  useEffect(() => {
    // Listen for auth changes
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setResult(null);
        // Clear all form data
        handleSwitchToManual();
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);
  ```

---

### 7. **DASHBOARD: `/dashboard`**

**File:** `/src/app/(main)/dashboard/page.tsx` + `DashboardClient.tsx`

**Accessible to:**
- ✗ Unauthenticated users → **Redirect to `/auth/login`** (line 39)
- ✓ Authenticated users only

**Content:**
- Shows user's saved charts
- Daily horoscope
- Recommendations

**Status:** ✓ CORRECT IMPLEMENTATION

---

### 8. **ZODIAC PAGES: `/zodiac/[sign]`**

**File:** `/src/app/(main)/zodiac/[sign]/page.tsx`

**Accessible to:**
- ✓ Unauthenticated users
- ✓ Authenticated users

**Content Differences:**
- **NONE** — same daily horoscope for all users

**Issue:**
- Shows "Daily horoscope for [Sign]" to everyone
- Doesn't account for user's birth chart
- For auth users, could show "How this affects YOUR chart" instead

**Recommendation:**
- For auth users: Add personalized subtitle based on their chart
- Example: "Daily horoscope for Aries + How it affects your chart (Libra sun, Taurus moon)"
- Keep generic for unauth users

---

### 9. **HOROSCOPE PRODUCT PAGES: `/horoscopes/[category]`**

**File:** `/src/app/(main)/horoscopes/{love,career,forecast,personality,etc}/page.tsx`

**Pattern:** All use `ProductPage` component → shows form to all users

**Same issue as `/horoscope/[slug]`** (see section 4)

**Recommendation:** Apply same fix as section 4

---

### 10. **LOGIN: `/auth/login`**

**File:** `/src/app/(main)/auth/login/page.tsx`

**Accessible to:**
- ✓ Unauthenticated users
- ✓ Authenticated users (POTENTIAL ISSUE)

**Check:** Does login page have redirect if already logged in?
- **Not visible in code** — likely missing

**Recommendation:**
- Add redirect to `/dashboard` if user is already authenticated
- Prevent confusing state where logged-in user sees login form

---

### 11. **DAILY HOROSCOPE: `/daily`**

**File:** `/src/app/(main)/daily/page.tsx`

**Check:** Need to verify if this shows personalized horoscope for auth vs generic for unauth

---

### 12. **ASCENDANT EXPLORER: `/ascendant`**

**File:** `/src/app/(main)/ascendant/page.tsx`

**Check:** Need to verify auth differences

---

### 13. **EXPLORE: `/explore`**

**File:** `/src/app/(main)/explore/page.tsx`

**Check:** Need to verify auth differences

---

### 14. **LEGAL: `/privacy`, `/terms`**

**Files:** `/src/app/(main)/privacy/page.tsx`, `/src/app/(main)/terms/page.tsx`

**Status:** ✓ Generic pages, no auth-specific content needed

---

## Cross-Cutting Issues

### **Issue A: No Middleware for Auth Redirects**

No `/middleware.ts` found in the codebase.

**Problem:**
- Can't implement blanket auth checks at routing level
- Each page must manually check auth
- Easy to forget

**Recommendation:**
- Create `/middleware.ts` with patterns:
  ```ts
  // Redirect unauth users from protected routes
  const protectedRoutes = ['/dashboard', '/profile'];

  // Redirect auth users from unauth-only routes
  const unAuthOnly = ['/quiz']; // if we decide quiz is unauth-only
  ```

---

### **Issue B: Stats Section Shows Hardcoded Values**

**File:** `/src/components/landing/StatsSection.tsx`

**Line 15-19:**
```tsx
const DEFAULT_STATS: Stat[] = [
  { label: 'Гороскопів створено', value: 100000, suffix: '+', prefix: '' },
  { label: 'Років астрологічних даних', value: 30, suffix: '+', prefix: '' },
  { label: 'Позитивних відгуків', value: 97, suffix: '%', prefix: '' },
  { label: 'Активних користувачів', value: 15000, suffix: '+', prefix: '' },
];
```

**User Complaint Context:**
> "16% позитивних відгуків stat is embarrassingly low"

**Issue:** These are hardcoded landing page copy. They should:
1. Not be on landing page shown to auth users (they know the real stats)
2. Or be fetched from actual data sources
3. The "97%" is suspiciously high; "16%" comment suggests this was updated to realistic values elsewhere?

**Recommendation:**
- For auth users: Don't show stats (they see real dashboard data)
- For unauth users: Fetch real stats or remove fake ones
- Or: Make stats dynamic from `/api/stats` (already attempted in lines 60-74)

---

### **Issue C: Homepage Layout Should Change for Auth Users**

**Current Structure in `(main)/layout.tsx`:**

```tsx
async function getUser() {
  // Gets user, passes to nav components
}

export default async function MainLayout({ children }) {
  const user = await getUser();
  return (
    <>
      <DesktopNav user={user} />
      <main>{children}</main>
      <NewFooter />
      <Footer />
      <MobileNav isLoggedIn={!!user} />
    </>
  );
}
```

**Good:** User is available in layout!

**Bad:** No page-level conditional rendering based on `user`

**Recommendation:**
- Pass `user` to page components
- Or use new React Server Component pattern with `getUser()` in each page

---

## Summary Table

| Route | Unauth | Auth | Issue | Recommendation |
|-------|--------|------|-------|-----------------|
| `/` | Landing | Landing | ❌ Signup CTA shown to auth users | Redirect to `/dashboard` OR show auth-specific home |
| `/quiz` | ✓ Form | ✓ Form | ❌ Re-entry, lead magnet only | Redirect auth → `/chart/new` |
| `/chart/new` | ✓ Form | ✓ Form | ⚠ No pre-fill from profile | Add optional pre-fill dropdown |
| `/horoscope/[slug]` | ✓ Form | ✓ Form | ⚠ Form shown even with pre-fill | Skip form, auto-submit for auth |
| `/horoscopes/*` | ✓ Form | ✓ Form | ⚠ Same as above | Skip form, auto-submit for auth |
| `/moon` | ✓ General | ✓ General + personalization | ❌ "Your chart" shown to unauth; hardcoded house for all | Conditionally show personalized section |
| `/compatibility` | ✓ Form | ✓ Auto-fill | ⚠ SessionStorage persists after logout | Clear state on auth change |
| `/dashboard` | Redirect | ✓ Protected | ✓ CORRECT | Keep as-is |
| `/zodiac/[sign]` | ✓ Generic | ✓ Generic | ⚠ No personalization for auth | Add "How this affects YOUR chart" |
| `/auth/login` | ✓ Form | ? | ⚠ Likely no redirect if already auth | Add redirect to `/dashboard` |
| `/daily` | ? | ? | Need audit | TBD |
| `/ascendant` | ? | ? | Need audit | TBD |
| `/explore` | ? | ? | Need audit | TBD |
| `/privacy`, `/terms` | ✓ | ✓ | ✓ CORRECT | Keep as-is |

---

## Implementation Priority

### **CRITICAL (Do First)**
1. **Homepage:** Different layout for auth users
2. **Quiz:** Redirect auth users to `/chart/new` or `/dashboard`
3. **Moon page:** Fix "У вашому чарті" text bug for unauth users
4. **Compatibility:** Clear state on logout

### **HIGH (Week 1-2)**
1. **Product pages:** Skip form for auth users, auto-submit
2. **Login page:** Redirect if already authenticated
3. **Compatibility/Synastry:** Auto-fill for auth users (already done)

### **MEDIUM (Week 2-3)**
1. **Chart creation:** Add optional pre-fill dropdown
2. **Zodiac pages:** Add personalization for auth users
3. **Create middleware** for routing patterns

### **LOW (Polish)**
1. **Stats section:** Fix hardcoded values or hide for auth
2. **Daily horoscope:** Add personalization layer

---

## Code References

**Key Files to Modify:**
- `/src/app/(main)/page.tsx` — Add auth check, conditional layout
- `/src/app/(quiz)/quiz/page.tsx` — Add redirect middleware
- `/src/app/(main)/moon/page.tsx` — Fix "your chart" bug
- `/src/app/(main)/compatibility/CompatibilityClient.tsx` — Add logout listener
- `/src/components/product/ProductForm.tsx` — Conditionally show form
- `/src/app/(main)/auth/login/page.tsx` — Add redirect if already auth

**New Files to Create:**
- `/middleware.ts` — Global auth routing rules
- `/src/app/(main)/HomeAuth.tsx` — Auth-specific homepage

---

## Conclusion

The app treats authentication as secondary to the landing page experience. Logged-in users should **never see lead magnet forms or onboarding flows they've already completed**.

The core issue is that most routes don't check `getUser()` and adapt their UI accordingly. This creates redundant flows, confusion, and wastes the value of authentication.

**Next Step:** Implement the CRITICAL fixes in order, test with logged-in users, then move to HIGH priority items.
