# Next.js migration validation

Validated on September 14, 2026 with Node.js 22.14, Next.js 16.3.5, React 19.2.8, and a production build.

## Checks

- ESLint: passed without warnings.
- TypeScript and generated Next.js route types: passed.
- Final npm dependency audit: zero vulnerabilities after removing temporary Lighthouse tooling.
- Production build: passed; `/`, `/robots.txt`, and `/sitemap.xml` are statically generated.
- Playwright: all 7 tests passed in installed Chrome. Covers initial HTML and structured data, metadata endpoints, local video assets, hydration, queued carousel input, keyboard navigation, rejected playback, comparison keyboard/pointer input, mobile menu focus and Escape, reduced motion, data saving, and JavaScript-disabled content.
- Desktop (1440 × 1000) and mobile (390 × 844) screenshots were compared with the existing Vite build. Section order, typography, layout, and media presentation are preserved. No page-level horizontal overflow or broken images was found with network access enabled.
- Accessibility corrections include carousel group semantics, descriptive controls, team-caption contrast, a skip link, closed-menu inertness, focus containment, and focus restoration.

## Performance measurement

Final mobile Lighthouse 12.8.2 audit against `next start` on localhost:

| Metric | Result |
| --- | --- |
| Performance | 94/100 |
| Accessibility | 100/100 |
| SEO | 100/100 |
| Largest Contentful Paint | 3.05 seconds |
| Cumulative Layout Shift | 0 |
| Total Blocking Time | 87.5 milliseconds |

The run used simulated mobile throttling: 150 ms RTT, 1,638.4 Kbps throughput, and 4× CPU slowdown. The Next.js image cache was warm from visual validation; Chrome used Lighthouse's fresh browser profile. This is a local lab measurement, not field Core Web Vitals or a guarantee for a deployed host.

Deferring below-fold native video posters improved the measured performance score from 86 to 94 and LCP from approximately 4.17 to 3.05 seconds in this environment. These are individual diagnostic runs, not a statistical benchmark. The 2.5-second LCP target remains unmet in the final simulated mobile run; the zero-layout-shift target passed. Hosting/CDN latency, cold image transformations, remote WordPress/Pexels availability, and real user devices still require deployment-level measurement. Do not interpret the earlier sandbox run with blocked images as valid performance evidence.

The raw final audit is in the ignored `artifacts/lighthouse-mobile.json`. Full-page comparison screenshots and final crops are also in `artifacts/`. Lighthouse was used as temporary audit tooling and removed from the application dependencies afterward. To reproduce, run a current supported Lighthouse CLI against the production server with the same mobile settings and record its version and cache conditions.

## Deployment boundaries

No deployment or domain cutover was performed. GitHub Actions now validates the Next.js application instead of publishing a Vite artifact to Pages. Use a Next.js server host. Preserve the current WordPress routes and media origin when planning a later domain migration; this repository implements only the homepage.

The existing stock video demonstrations and illustrative comparison labels remain unchanged. The migration adds no unverified business claims to structured data.
