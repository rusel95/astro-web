# Testing Setup — GitHub Actions

## 🎯 Overview

Automated E2E tests run:
- **Daily at 08:00 Kyiv** (06:00 UTC) — full regression
- **On every PR** — pre-merge validation

## 📋 Setup Checklist

### 1. GitHub Secrets

Go to **repo → Settings → Secrets and variables → Actions → New repository secret**

Add these 4 secrets:

| Name | Value | Where to find |
|------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Already in `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` | Already in `.env.local` |
| `TEST_USER_EMAIL` | Test user email | Create dedicated test user in Supabase |
| `TEST_USER_PASSWORD` | Test user password | Same as above |

### 2. Create Test User

**Option A: Supabase Dashboard**
1. Go to your Supabase Dashboard → Authentication → Users
2. Click "Add User" → Email
3. Email: `test-astro@example.com` (use real email for verification)
4. Password: Strong password (save it!)
5. Mark email as verified

**Option B: Sign up via app**
1. Go to https://astro-web-five.vercel.app/auth/login
2. Sign up with new account
3. Verify email
4. Save credentials as GitHub secrets

### 3. Enable Workflows

Workflows are in `.github/workflows/`:
- `daily-tests.yml` — Daily cron
- `test-pr.yml` — PR validation

**First run (manual trigger):**
1. Go to **Actions** tab
2. Select "Daily E2E Tests"
3. Click "Run workflow" → "Run workflow"

If it passes ✅ — setup complete!

### 4. Verify Artifacts Upload

After first run:
- Go to failed/passed workflow run
- Check "Artifacts" section
- Should see `playwright-report` (always) and `test-screenshots` (on failure)

## 🔍 Monitoring

### Daily Test Failures

If daily tests fail:
1. **GitHub issue** created automatically with label `testing`, `automated`
2. **Artifacts** available for 7 days
3. Check issue for workflow link → download report

### PR Test Failures

PR cannot merge until tests pass:
1. Fix failing tests locally (`npm run test:ui`)
2. Push fix
3. Tests re-run automatically

## 📊 Coverage Goals (2026)

**Current coverage:** ~30%
- ✅ Login page UI
- ✅ OAuth redirect
- ✅ Chart creation flow (steps 0-1)
- ✅ Protected routes guard

**Next priority:**
- [ ] Birthday Forecast (issue #77)
- [ ] Compatibility check
- [ ] Social sharing
- [ ] PDF export

**Target by Q2 2026:** 70% E2E coverage

## 🐛 Troubleshooting

### Tests pass locally, fail in CI

**Common causes:**
- Missing environment variables (check secrets)
- Timing issues (add `page.waitForTimeout()`)
- Viewport differences (CI uses headless Chrome)

**Fix:**
```bash
# Run in CI mode locally
npx playwright test --headed=false
```

### Secrets not loading

**Check:**
```yaml
# In workflow file, secrets must be passed to env
env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
```

### Cron not running

- Workflows must be on `main` branch
- Wait 24h after first push (GitHub Actions delay)
- Verify cron syntax: `0 6 * * *` = 06:00 UTC daily

## 🚀 Next Steps

After setup:
1. Monitor first daily run tomorrow
2. Add more tests (see `tests/README.md`)
3. Configure Slack/Telegram notifications (optional)
