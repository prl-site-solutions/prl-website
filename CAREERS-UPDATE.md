# How to update PRL careers page

File to edit: `careers.html` in the repo root.

---

## When a role closes (placement filled, advert removed)

1. Open `careers.html`
2. Find the role card — search for the job title
3. Delete the entire `<article class="role-card">...</article>` block for that role
4. Delete the matching `<script type="application/ld+json">` block in the `<head>` (search for the Job ID, e.g. `224982410`)
5. Update the live vacancy count in the hero: search for `id="stat-count"` and change the number
6. Update the filter bar count: search for `of 10 roles` and change the number
7. Commit and push

---

## When a new role is posted on CV-Library

1. Copy an existing `<article class="role-card">` block as a template
2. Update:
   - `data-location` attribute — see location values below
   - `data-tags` attribute — add `efw` if it's an EfW project, otherwise leave empty (`""`)
   - Job title in `<h3 class="role-title">`
   - Rate in `<div class="role-rate">`
   - Location text in the first `.role-meta-item`
   - Duration in the second `.role-meta-item`
   - Summary paragraph
   - CV-Library Job ID in the apply button URL: `https://www.cv-library.co.uk/job/[JOB_ID]`
3. Copy and adapt a `<script type="application/ld+json">` JobPosting block in the `<head>`
   - Update: `title`, `description`, `datePosted`, `validThrough`, `addressLocality`, `addressRegion`, `baseSalary`, `identifier.value`, `url`
4. Update the vacancy count in the hero (`id="stat-count"`) and filter bar
5. Commit and push

---

## Location filter values

| `data-location` | Use for |
|---|---|
| `deeside` | Deeside / Flintshire |
| `ince` | Ince / Cheshire West |
| `pembroke` | Pembrokeshire sites (Pembroke, Maiden Wells) |
| `other` | Anywhere else (Chorley, Bridgwater, etc.) |

If a new location gets 2+ active roles, add a new filter button in the filter bar:
```html
<button class="filter-btn" data-filter="[value]">Label</button>
```

---

## Known issues (flag to Paul)

- **Piping Engineer has no direct Job ID** — the apply button links to a CV-Library search URL. Once the direct advert URL is available, replace the `href` on the apply button and the `url` field in its JSON-LD block.
- **Test apply links** — after any deployment, spot-check 2–3 CV-Library links to confirm they resolve to the correct advert.

---

## Consultant contact

All roles: **Keenan Thomas — 07960 871442**

To update the contact details, search `careers.html` for `07960871442` (appears in `tel:` links and the contact card).
