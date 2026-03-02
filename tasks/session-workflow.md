# Session Workflow — astro-web

**The only loop that works:** продивляєшся → фіксаєш → пушиш → деплоїш → продивляєшся

---

## At Session Start

1. Read `tasks/lessons.md` for patterns from past mistakes
2. Check GitHub Issues for `ready` label: `gh issue list --label ready`
3. Check if the previous session left uncommitted work: `git status` + `git log --oneline -5`
4. Look at what's broken on production before writing a single line of code

---

## The Git Commit Workaround

The Mac `.git/index.lock` and `.git/HEAD.lock` block all VM commits. This is permanent — work around it every time.

**From the VM (stage only):**
```bash
GIT_INDEX_FILE=/tmp/git-work-index git add <files>
GIT_INDEX_FILE=/tmp/git-work-index git status   # verify staged
```

Then tell the user to run from their Mac terminal:
```bash
rm -f .git/index.lock .git/HEAD.lock
git add <same files>
git commit -m "..."
git push
```

**The VM cannot push.** No GitHub network access. Always hand off push to the user.

---

## TypeScript Check (not build)

`npm run build` runs out of memory (OOM, exit 143). Use instead:
```bash
npx tsc --noEmit
```

Must be clean before handing off to user for push.

---

## Deploy

- Every `git push` to `main` auto-deploys to Vercel (no manual step needed)
- Branch `002-auth-ux-fixes` → manual: `npx vercel --prod --yes` (from user's machine)
- Check status: `vercel ls --limit 5`

---

## QA Loop

Act as Manual QA. Every feature page, every button, every CTA:

1. **Open the page** (production URL)
2. **Check anonymous user flow** — what does someone see without an account?
3. **Check auth user flow** — does auto-submit work? Does data load?
4. **Check error states** — what happens on API failure?
5. **Check empty states** — blank page or clear message?

Key pages to check after any FeaturePageLayout change:
- `/progressions`, `/transit`, `/directions` (formVariant="date-range")
- `/solar-return`, `/lunar-return` (formVariant="basic")
- `/astrocartography/location` (formVariant="location")
- `/analysis/*`, `/numerology`, `/fixed-stars`, `/eclipses`

---

## Common Bugs Seen

| Bug | Root cause | Fix |
|-----|-----------|-----|
| Full-page "Щось пішло не так" on feature pages | `React.useRef` without importing `React` → ReferenceError on mount | Use `useRef` from named import |
| Retry button sends API response as new request | `handleSubmit(result)` instead of original body | `lastBodyRef.current = body` in handleSubmit, use that for retry |
| Auth users see form instead of auto-loading | `isChartComplete()` requires gender field; incomplete charts fail | Check what isComplete requires |
| Zodiac page CTAs dead-end at `/dashboard` | Old CTA pointed to non-existent dashboard | Change to `/quiz` + `/horoscope/daily` |
| Product pages don't trigger AI report | Missing `from=productSlug` param forwarding | Add `from` param through chart create flow |

---

## Lessons Log Location

`tasks/lessons.md` — update after every user correction. Prevents repeating the same mistakes.
