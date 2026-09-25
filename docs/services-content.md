# Services content and maintenance

The catalog and treatment copy were adapted from https://alratadental.com/services/ and its 15 linked treatment pages on 20 September 2026. Each entry in `src/features/services/content.ts` preserves its original URL slug. The catalog order matches the original services page; the homepage uses a separate six-treatment selection.

## Editorial decisions

- Retain service information, CEREC availability, preventive care, treatment stages, and maintenance advice. Remove unverified statistics, fixed outcomes, fixed recovery/treatment durations, and lifespan guarantees.
- Preserve the source's BOTOX cosmetic and jaw-concern scope. Explain that TMD use is off-label with uncertain effectiveness, based on [NIDCR's TMD guidance](https://www.nidcr.nih.gov/health-info/tmd).
- Keep sports guards, night guards, and sleep-apnea appliances distinct. Do not imply a standard night guard treats sleep apnea.
- Emergency appointments require telephone confirmation; no 24-hour or same-day availability guarantee is introduced. Link to [ADA dental emergency guidance](https://www.mouthhealthy.org/all-topics-a-z/dental-emergencies).
- The services overview imports the homepage offer component and its existing terms unchanged. Update offers centrally in `src/features/home/content.ts` when availability changes.

## Assets and maintenance

Service photography comes from the original catalog, downloaded as local 1200px-wide WebP files (approximately 22–63 KB each). Oral surgery keeps the tooth-model photograph already used on the redesigned homepage instead of the original catalog's cleaning photograph. The existing offer's cleaning photograph is also served locally; its appearance, component, and offer copy are unchanged. No runtime dependency on the old site is needed for service images or treatment content.

Edit treatment descriptions, sections, and related slugs in the central catalog. Metadata, service links, schema, and sitemap entries derive from it. Keep slugs stable to preserve inbound links; any future URL change needs a permanent redirect. Unknown treatment slugs return 404.

Treatment pages use a shared server-rendered template, with full text in initial HTML. No FAQ, ratings, or offer structured data is fabricated. Dates and professional reviewer credentials are not generated automatically.

Treatment pages reuse the homepage GoogleReviews component immediately after the hero. Their three-image gallery combines the treatment image with existing practice photography and provides a keyboard-accessible enlarged view. The homepage and treatment pages share ResultsSection and ImageComparison; treatment pages add manual selection between three comparison slots. These slots currently contain explicitly labeled illustrations, not patient results. Replace the preview data in `src/features/services/visuals.ts` with approved, matched patient images and accurate captions before presenting real cases. Do not substitute unrelated stock photographs for clinical results.

## Validation

- Production build: all 15 treatment routes and `/services` prerender successfully.
- ESLint and TypeScript checks pass.
- 29 Playwright checks pass across `services.spec.ts`, `home.spec.ts`, and `about.spec.ts`.
- Coverage includes catalog order, metadata, JSON-LD, canonical normalization, sitemap entries, unknown-route 404s, local navigation, carousel keyboard controls, reduced motion, and no-JavaScript content.
- All 16 care pages checked at 390px, 768px, and 1440px for horizontal overflow and local image loading. Desktop/mobile overview and crown-page layouts, offer transition, and mobile booking-bar clearance also reviewed visually.
- Tests use Chrome and a production server. Existing third-party homepage resources require network access for the complete regression run; no-JavaScript content checks wait for DOM readiness rather than external embeds.
