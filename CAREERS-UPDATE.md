# PRL careers page

The job cards on `careers.html`, and one page per job under `/jobs/<title-town-id>/`
(each carrying the JobPosting data Google reads for its job search), are rebuilt
**twice a day** from PRL's live CV-Library adverts (agency ID `454083`):

https://www.cv-library.co.uk/cgi-bin/yourjobs.cgi?agency=454083

**There is nothing to update when a role opens or closes.** Post or remove the
advert on CV-Library and the website follows within half a day.

- Script: `scripts/sync-jobs.mjs` (no dependencies — `node scripts/sync-jobs.mjs`)
- Schedule: `.github/workflows/sync-jobs.yml`, twice daily (05:17 and 12:17 UTC)
- Need it sooner? GitHub → Actions → "Sync jobs from CV-Library" → Run workflow

Everything between the `JOBS-…:START` / `JOBS-…:END` markers in
`careers.html`, and everything under `/jobs/`, is overwritten on each run, so
don't hand-edit them. When an advert closes, its `/jobs/` page is deleted (so it
returns 404, which tells Google the role has gone) and its sitemap entry removed.
Each job page has an "Apply with PRL" route (consultant phone, email, PRISM
registration) with CV-Library as a secondary link.
Hand-typed job cards are how the page ended up showing ten roles that had all
expired months earlier (fixed 2026-09-25).

If CV-Library changes its page layout, the script fails loudly and leaves the
last good version of the page in place; GitHub emails the repo owner about the
failed run.

---

## Consultant contact

Each job card's Call button uses the contact number on that CV-Library advert.
The general contact card at the bottom of the page is hand-written: search
`careers.html` for `07960871442`.
