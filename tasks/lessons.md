# Lessons Learned

Patterns from past mistakes. Review at session start.

---

## Build & Deploy

- `npm run build` OOMs in Cowork VM (exit 143). Use `npx tsc --noEmit` for type-checking
- VM cannot push to GitHub — always hand off push to user
- `.git/index.lock` blocks commits from VM — user runs `rm -f .git/index.lock` on Mac
- `vercel.json` had `deploymentEnabled: false` — was set to conserve free tier budget. Re-enable when ready to ship

## Date Handling

- NEVER use `new Date("YYYY-MM-DD")` on client — it parses as UTC, shifts dates
- Use `new Date(year, month-1, day)` for local dates
- Format with `getFullYear()/getMonth()/getDate()`, not `toISOString()`

## Icons

- NEVER use unicode zodiac symbols (♈♉♊) — always `<ZodiacIcon>` component
- In SVG contexts use `ZODIAC_SVG_PATHS` from `ZodiacIcon.tsx`

## Vercel Budget

- Free tier was hitting 80%+ usage — bandwidth and serverless execution are bottlenecks
- Disabled: GitHub Actions CI, cron jobs, auto-deploy on push
- Pro plan ($20/mo) is the next step if usage continues growing
