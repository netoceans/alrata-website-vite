# Alrata website

Next.js App Router, React, TypeScript, and Tailwind CSS. The homepage is generated as HTML at build time; only interactive controls hydrate in the browser.

## Development

Use Node.js 22.14 or newer and npm. This repository intentionally keeps only `package-lock.json`.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Copy `.env.example` to `.env.local` if you need to change the canonical production origin. `SITE_URL` is read at build time and defaults to `https://alratadental.com`.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

TypeScript 6 and ESLint 9 are pinned for compatibility with Next.js's current lint plugins. Upgrade them together once those plugins support newer majors.

## Organization

- `src/app`: route entrypoints, shared root layout, global styles, and SEO metadata routes.
- `src/features/home` and `src/features/about`: route-level composition and centralized content for the homepage and About page.
- `src/components/home` and `src/components/about`: individual page sections and their interactive helpers.
- `src/components/layout`: reusable header, footer, logo, and mobile booking bar.
- `src/components/shared`: reusable media and reveal components.
- `src/data`: shared clinic details, navigation, service catalog, media helpers, and site configuration.
- `src/types`: shared content types.

Create future routes in `src/app/<route>/page.tsx`; they automatically receive the shared layout. Keep route composition and static content as Server Components. Add `'use client'` only to components that need browser APIs, event handlers, or state. Do not reintroduce an `App.tsx` wrapper.

The global stylesheet preserves the existing design. Images reserve their layout space and use Next.js optimization; remote images are restricted to the existing clinic and Pexels paths. Local videos retain their existing URLs. Stock-media labels and illustrative-result disclosures remain in place.

## Team pages

`/our-team` introduces the dentist and four staff members. All five original
`/cmsms_doctor/<slug>` URLs render local, statically generated profiles. Edit the
shared catalog in `src/features/team/content.ts` for biographies, credentials,
portraits, schedules, and metadata; homepage team content derives from that catalog.
See [team content and maintenance](docs/team-content.md) for source references,
editorial decisions, original schedules, and validation coverage.

## Contact page

`/contacts-us` preserves the legacy contact URL. Enquiries are sent through Google
Workspace SMTP to **dr.alrata@alratadental.com**, with the patient email as Reply-To.
The existing public clinic email links remain info@alratadental.com.

### Activate enquiry delivery

1. Keep existing `.env.local` settings; copy the SMTP entries from `.env.example`.
2. In the sending Google Workspace account, enable 2-Step Verification and generate
   an App Password at https://myaccount.google.com/apppasswords. The organization
   must permit App Passwords. This integration does not accept an OAuth access
   token, a Google Cloud API key, or the normal Gmail login password.
3. Set `SMTP_PASS` to that 16-letter App Password. Spaces are accepted. Sender and
   recipient both default to dr.alrata@alratadental.com; only change `SMTP_USER` if
   authenticating as a different mailbox, or `INQUIRY_TO` to change the recipient.
   Gmail uses fixed TLS SMTP at smtp.gmail.com:465; the host must allow outbound
   connections to that port. All settings are server-only, never NEXT_PUBLIC_.
4. Restart development or set the same variables in the production hosting
   dashboard and redeploy. No code edit is needed. The form checks configuration
   at runtime and stays disabled without a correctly shaped password and addresses.
   This check is not an authentication test: an invalid/revoked password or Google
   sending restriction produces a submission error, not a false success.
5. Submit fictional details, confirm receipt (including spam), and verify Reply
   targets the fictional sender. Google acceptance does not guarantee inbox placement.
   Live delivery has not been tested without client credentials.

The clinic must confirm its applicable Google Workspace BAA, hosting arrangements,
and privacy notice before using real patient data. This integration makes no claim
of HIPAA compliance. If the client disables App Passwords, use an administrator-approved
OAuth or relay integration instead; do not weaken the account's security settings.

`GET /api/inquiries` returns only `{ available: boolean }`. `POST /api/inquiries`
accepts JSON containing the current form fields, boolean consent, and an empty
honeypot field. It validates all fields server-side, checks the request origin,
bounds the body to 16 KiB, and sends plain-text mail with a fixed recipient and
subject. Results are never cached. Missing configuration, validation errors,
throttling, and SMTP failures return clear errors. Entries remain on failure and
are cleared only after SMTP acceptance. There are no automatic retries, since an
SMTP timeout can leave delivery uncertain. No submissions are stored in a website
database/browser storage or logged by this application; email copies remain in Gmail.

Basic spam protection includes a honeypot and per-process limits of 3 attempts per
sender and 30 total per ten minutes. These limits reset on restart and are not shared
across serverless instances. Configure hosting-level rate limits for POST /api/inquiries
for stronger public-site protection; disable request-body capture in hosting/analytics.
The application does not retain raw IPs; temporary sender hashes support throttling.
Duplicate clicks are blocked while sending; this is not durable exactly-once delivery.

Contact regression coverage is in `tests/contact.spec.ts` and
`tests/inquiry-service.spec.ts`. Automated tests use synthetic data and mocked
email delivery and never send real patient emails.

## Browser checks

Build before running the production browser suite:

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

The test runner starts a production server automatically if port 3000 is free. To use an installed Chrome instead, set `PLAYWRIGHT_CHANNEL=chrome` in your shell. CI installs Chromium and runs the same suite.

`node scripts/visual-check.mjs` captures desktop and mobile screenshots in the ignored `artifacts` directory using installed Chrome. Set `PLAYWRIGHT_CHANNEL` to another installed browser channel if needed. Run this against a production server with internet access so remote imagery can load.

See `docs/migration-validation.md` for measured results and limitations.

## Google reviews

Copy `.env.example` to `.env.local` and set `GOOGLE_PLACES_API_KEY`. In Google Cloud, enable **Places API (New)** and billing for the key's project. Restrict the key to that API; use server IP restrictions if your host provides stable outbound IPs (browser referrer restrictions are not suitable for server requests). Set quotas and billing alerts in Google Cloud. Reviews incur the applicable Place Details review-tier charges; automatic lookup also uses Text Search.

Set the same server-only environment variable on Vercel or your Node host and restart/redeploy. Never use a `NEXT_PUBLIC_` key. No Google SDK or map script is loaded by the browser.

The server resolves **Alrata Art of Dentistry, 10038 Manchester Rd #226, St. Louis, MO 63122**. Only a unique name/street/postal-code match is accepted. If Google's listing differs, set optional `GOOGLE_PLACE_ID` to the exact clinic listing ID. The resolved ID is kept per server process; a cold start may repeat the lookup. No review content is persisted, cached by Next.js/CDN, or stored in browser storage.

`GET /api/google-reviews` accepts no query parameters. It returns `{ status: 'available', rating, reviewCount, url, reviews, attributions }` or `{ status: 'unavailable' }`, always with `Cache-Control: private, no-store, max-age=0`. Missing configuration, empty/malformed results, ambiguous matches, Google failures, and a six-second upstream deadline all use the same public fallback. The browser makes one request when the section nears view; it does not poll or automatically retry. Each page visit may incur a fresh Place Details request. Use hosting-level rate limits and Google's API quotas to control public-endpoint traffic.

Up to five reviews appear in Google's relevance order, including lower ratings. Original review text, author attribution, source links, and any provider attribution are preserved. Without working configuration, visitors see a Google Maps invitation without a claimed rating. Live retrieval requires a real key; automated tests use synthetic fixtures and never call Google. See [Google's Places policies](https://developers.google.com/maps/documentation/places/web-service/policies) for attribution and storage requirements.

## Hosting

Deploy to Vercel as a Next.js project, or use a Node.js server with `npm ci`, `npm run build`, and `npm start`. GitHub Actions validates the application; it no longer deploys to GitHub Pages. This is not a static-export configuration: the Next.js server provides image optimization.

This migration does not deploy the site or replace the remaining WordPress pages. The homepage, About, contact, services, team directory, five team profiles, and policy routes are implemented locally. Booking links use the local contact page. Before moving the production domain, arrange routing for any remaining legacy URLs and retain access to existing `/wp-content/uploads/` images still used by the homepage. Protect or mark preview deployments as non-indexable through the hosting provider; the generated robots file is intended for production.

