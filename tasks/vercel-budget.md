# Vercel Free Tier Budget Plan

## Hobby Plan Limits (as of 2026)

| Resource | Limit / month | Notes |
|---|---|---|
| Bandwidth | 100 GB | CDN + serverless responses |
| Serverless Function execution | 100 GB-hours | Duration × memory |
| Edge Function invocations | 500,000 | |
| Deployments | 6,000 | Per project |
| Build minutes | 6,000 min | |
| Cron invocations | 0 | Not available on Hobby |

> **Current status: >80% used** — we are very close to the limit.

---

## How Many Deploys Can I Do?

**Deployments limit: 6,000/month** — this is rarely the bottleneck.

The real bottleneck at 80%+ usage is **bandwidth** and/or **serverless function execution**.

### Why Bandwidth Is the Main Risk

Each production deployment triggers:
1. CDN cache invalidation + new asset serving
2. User traffic hits new version immediately

Heavy API routes in astro-web (all serverless):
- `/api/chart` — calls 5 parallel SDK endpoints (large response)
- `/api/compatibility`, `/api/composite`, `/api/relationship-insights`
- `/api/transit`, `/api/solar-return`, `/api/lunar-return`
- `/api/horoscope/*` — 6 routes
- `/api/report` — OpenAI proxy (large)

### Safe Deploy Budget Estimate

Assuming 20% remaining (~20 GB bandwidth left):

| Scenario | Deploys Left |
|---|---|
| Low traffic (dev testing only) | 15–20 deploys |
| Moderate traffic (real users) | 5–10 deploys |
| Heavy traffic (viral/shared) | 1–3 deploys |

**Recommendation: 1 deploy at the end of this spec.**

---

## What We Disabled to Preserve the Budget

| Item | Action | Saves |
|---|---|---|
| GitHub Actions daily tests | Deleted | ~6,000 build minutes |
| GitHub Actions PR tests | Deleted | ~3,000 build minutes per PR |
| Vercel cron (birthday emails) | Removed | ~30 serverless invocations/month |
| Git auto-deploy on push | Disabled | ~50 deploys saved |

---

## Deploy Strategy Going Forward

1. **During development**: push to `002-auth-ux-fixes` (no auto-deploy, zero bandwidth)
2. **PR merge to main**: user merges manually — triggers **1 production deploy**
3. **Manual verification**: `vercel ls` / `vercel inspect <url>` after deploy
4. **If over limit**: wait for monthly reset (1st of month) or upgrade to Pro ($20/mo)

### To Deploy Manually When Ready

```bash
npx vercel --prod --yes
```

---

## Dashboard Checks

Visit https://vercel.com/ruslan-popeskus-projects/astro-web/settings/usage to see current bandwidth and function execution.

If still above 80%:
- Consider enabling ISR on more pages (reduces serverless invocations)
- Add longer `Cache-Control` headers on stable API routes
- Remove unused API routes before deploying
