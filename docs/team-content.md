# Team pages: content and maintenance

## Sources and editorial decisions

The team catalog was adapted from the clinic's [team directory](https://alratadental.com/our-team/) and all five linked profiles on 20 September 2026:

- [Dr. Mamdouh Alrata](https://alratadental.com/cmsms_doctor/mamdouh-alrata/)
- [Danya](https://alratadental.com/cmsms_doctor/danya-kazzaz/)
- [Shelly](https://alratadental.com/cmsms_doctor/shelly/)
- [Vanessa](https://alratadental.com/cmsms_doctor/vanessa-rosas/)
- [Janet](https://alratadental.com/cmsms_doctor/janet/)

The rewritten copy retains the published professional roles, education, relevant credentials, personal interests, and individual working schedules. Names follow the visible source content; surnames are not inferred from URL slugs. Office staff are not represented as practicing dentists based on their education.

- Dr. Alrata: retain the 2012 practice start, UCLA education, published American Board of Operative Dentistry certification, and explicitly dated 2023 PDS recognition. Do not broaden this into an award claim for the entire team.
- Danya: retain dental surgery and healthcare administration degrees, communication, scheduling, and benefits support. Omit the undated ten-year counter; do not promise insurance coverage or savings.
- Shelly: retain medical administrative assistant education at Joliet Junior College. Replace the undated 24-year counter with “more than two decades.” Remove the source's speculation about continuing education.
- Vanessa: retain 2020 graduation and English/Spanish communication. Do not automatically increment the old four-year experience counter.
- Janet: describe charity board service as community service, not clinical board certification. Replace the old 42-year counter with “more than four decades.” Omit the contradictory sibling count and extraneous relatives' names.

No new clinical outcomes, clinical specialties, degrees, awards, ratings, or testimonials have been invented. Content is editorially adapted from clinic-provided biographies; credentials are not independently re-certified by this implementation.

## Working schedules

The owner explicitly chose to retain the source schedules. They describe individual working hours in local St. Louis time, independently of the shared clinic opening hours.

| Member | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday |
| --- | --- | --- | --- | --- | --- | --- |
| Dr. Alrata | 8am–5pm | 8am–5pm | 8am–5pm | 8am–1pm | 8am–2pm | Not listed |
| Danya | 8am–5pm | 8am–5pm | 8am–5pm | 8am–1pm | 8am–2pm | Not listed |
| Shelly | 8am–5pm | 8am–5pm | 8am–5pm | Not listed | Not listed | Not listed |
| Vanessa | 8am–5pm | 8am–5pm | Not listed | 8am–1pm | Not listed | Not listed |
| Janet | 8am–5pm | 8am–5pm | 8am–5pm | Not listed | 8am–2pm | Not listed |

Source dashes are displayed as “Not listed,” and Sunday is not inferred. A visible note asks patients to confirm availability. Individual schedules do not overwrite the clinic entity's hours or claim live appointment availability. Booking continues to use the existing contact page, whose form remains frontend-only.

## Architecture and assets

Edit `src/features/team/content.ts` for all team identities, summaries, full biographies, credentials, schedules, and SEO descriptions. Homepage portraits, profile links, and credentials derive from the same catalog. The homepage's existing four-person order and abbreviated roles remain intact.

`/our-team` is the directory; `/cmsms_doctor/[slug]` statically generates the five existing profile paths. Unknown slugs return 404. Next.js's existing trailing-slash normalization redirects slash-suffixed URLs to the canonical paths. Navigation, metadata, JSON-LD, and sitemap entries use those paths. `ProfilePage` points to a `Person`, linked to the shared clinic entity; individual people are not marked as local business entities. The homepage uses the same doctor entity ID as the profile.

All five original portraits are local 1000×1250 WebP images, approximately 39–105 KB each. Originals were retrieved from the clinic's existing WordPress image CDN paths already used by the homepage. `scripts/prepare-team-images.mjs` reads original JPEGs from ignored `artifacts/team-source` and applies a consistent top-aligned crop and WebP encoding. Original filenames:

- `DSC3809-scaled-e1724332938383.jpg`
- `danya.-office-mangerJPG-scaled-e1724173455464.jpg`
- `Shelly-Front-desk-scaled-e1724333296585.jpg`
- `vanessa.-hygenist-JPG-scaled-e1724333131690.jpg`
- `janet-hygenist--scaled-e1724333619327.jpg`

All originals are under `https://i0.wp.com/alratadental.com/wp-content/uploads/2024/08/`. No source-site requests are needed at runtime. Next.js provides responsive image optimization. Only the featured portrait is eager/high priority; remaining portraits are lazy loaded. Team page composition adds no client components or animation libraries.

## Verification

The production build prerenders the directory and all five profiles. The team regression suite verifies source schedules, unique metadata, person/collection schema, sitemap coverage, canonical redirects, unknown-route 404s, local navigation, loaded images, keyboard access, reduced motion, 200% text sizing, no-JavaScript reading, and layouts at 320, 390, 768, and 1440px. Existing homepage, About, and navigation tests cover integration regressions.

Production Lighthouse reports are retained in ignored `artifacts`. Measurements use installed Chrome, mobile simulated throttling, and a local production server; they are lab measurements rather than field Core Web Vitals. The shared external map and local machine load can affect results. Deployment and Search Console submission are not part of this change.

Final validation on 20 September 2026: lint, TypeScript, and production build passed; all 38 tests across team, homepage, About, and navigation passed. Desktop, tablet, and mobile browser reviews confirmed portrait crops and schedule layout. The text-scaling check caught and verified a fix for enlarged-heading grid overflow.

| Mobile Lighthouse 12.8.2 | Performance | Accessibility | SEO | LCP | CLS | Total blocking time |
| --- | --- | --- | --- | --- | --- | --- |
| `/our-team` | 98 | 100 | 100 | 2.4s | 0 | 40ms |
| `/cmsms_doctor/mamdouh-alrata` | 98 | 100 | 100 | 2.4s | 0 | 30ms |

Reports: `artifacts/team-lighthouse.json` and `artifacts/team-profile-lighthouse.json`. The experimental accessible-name audit still notes the pre-existing shared footer map label; team-card label mismatches were corrected. No production deployment was performed.
