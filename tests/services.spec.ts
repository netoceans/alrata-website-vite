import { expect, test } from '@playwright/test'

const slugs = ['crowns', 'dental-veneers', 'inlays-and-onlays', 'oral-hygiene', 'teeth-whitening', 'clear-aligners', 'oral-surgery-extraction', 'dental-implants', 'root-canal-endodontics', 'dentures', 'implant-support-denture', 'botox', 'fluoride', 'mouth-guard-night-guard', 'emergency']

test('catalog renders all treatments, matching schema and final offer section', async ({ page, request }) => {
  await page.goto('/services')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dental Services in St. Louis, MO')
  const cards = page.locator('#all-treatments .service-card')
  await expect(cards).toHaveCount(15)
  expect(await cards.evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))).toEqual(slugs.map(slug => `/${slug}`))
  const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() ?? '{}')['@graph']
  const list = graph.find((entry: { '@type': string }) => entry['@type'] === 'ItemList')
  expect(list.itemListElement.map((item: { url: string }) => new URL(item.url).pathname)).toEqual(slugs.map(slug => `/${slug}`))
  expect(await page.locator('main > section').last().getAttribute('id')).toBe('offers')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://alratadental.com/services')
  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const slug of ['services', ...slugs]) expect(sitemap).toContain(`<loc>https://alratadental.com/${slug}</loc>`)
})

test('every treatment has initial HTML, unique metadata, local image and valid related links', async ({ request }) => {
  const titles = new Set<string>()
  const descriptions = new Set<string>()
  for (const slug of slugs) {
    const response = await request.get(`/${slug}`)
    expect(response.status(), slug).toBe(200)
    const html = await response.text()
    expect(html.match(/<h1\b/g), slug).toHaveLength(1)
    expect(html).toContain(`href="https://alratadental.com/${slug}"`)
    expect(html).toContain('property="og:image"')
    expect(html).toContain('name="twitter:card" content="summary_large_image"')
    expect(html).toContain('class="treatment-article"')
    expect(html).not.toContain('class="offer-section"')
    titles.add(html.match(/<title>(.*?)<\/title>/)?.[1] ?? '')
    descriptions.add(html.match(/name="description" content="([^"]+)"/)?.[1] ?? '')
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1] ?? '{}')['@graph']
    expect(graph).toEqual(expect.arrayContaining([expect.objectContaining({ '@type': 'Service', url: `https://alratadental.com/${slug}` }), expect.objectContaining({ '@type': 'BreadcrumbList' })]))
    expect((await request.get(`/media/services/${slug}.webp`)).ok()).toBeTruthy()
  }
  expect(titles.size).toBe(15)
  expect(descriptions.size).toBe(15)
  expect((await request.get('/not-a-real-treatment')).status()).toBe(404)
  for (const slug of ['services', 'crowns']) {
    const redirect = await request.get(`/${slug}/`, { maxRedirects: 0 })
    expect(redirect.status()).toBe(308)
    expect(redirect.headers().location).toBe(`/${slug}`)
  }
})

test('homepage keeps six cards and navigation reaches local pages', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#services .service-card')).toHaveCount(6)
  await expect(page.locator('.desktop-nav').getByRole('link', { name: 'Services', exact: true })).toHaveAttribute('href', '/services')
  await page.getByRole('link', { name: 'View all services' }).click()
  await expect(page).toHaveURL(/\/services$/)
  const crown = page.locator('.service-card').first()
  await crown.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/crowns$/)
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services')
  await expect(page.locator('.treatment-related .service-card')).toHaveCount(3)
})

test('offer carousel works on services with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/services')
  const carousel = page.getByRole('region', { name: 'Current and upcoming offers' })
  await carousel.scrollIntoViewIfNeeded()
  await expect(page.locator('#offer-carousel-stage')).toHaveAttribute('data-reduced-motion', 'true')
  await carousel.focus()
  await page.keyboard.press('End')
  await expect(page.locator('.offer-count')).toContainText('03 / 03')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.offer-count')).toContainText('01 / 03')
  await page.getByRole('button', { name: 'Pause automatic offer rotation' }).click()
  await expect(page.getByRole('button', { name: 'Start automatic offer rotation' })).toBeVisible()
})

test('emergency and BOTOX content retain important distinctions', async ({ page }) => {
  await page.goto('/emergency')
  await expect(page.locator('.treatment-hero .button')).toHaveAttribute('href', 'tel:+13148212650')
  await expect(page.locator('.treatment-cta .button')).toHaveAttribute('href', 'tel:+13148212650')
  await expect(page.locator('#urgent-medical-help')).toContainText('call 911')
  await page.goto('/botox')
  await expect(page.locator('#jaw-concerns')).toContainText('not FDA-approved')
  await expect(page.locator('.treatment-reference a')).toHaveAttribute('href', 'https://www.nidcr.nih.gov/health-info/tmd')
})

test('catalog and treatment content remain usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  // Third-party footer embeds are unrelated to server-rendered content readiness.
  await page.goto('/services', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.service-card')).toHaveCount(15)
  await page.locator('.service-card').first().click()
  await expect(page.getByRole('heading', { name: 'Same-day crowns with CEREC®.' })).toBeVisible()
  await expect(page.locator('.treatment-cta .button')).toHaveAttribute('href', '/contacts-us#contact-form')
  await context.close()
})

for (const width of [390, 768, 1440]) {
  test(`all care pages fit ${width}px and load their local images`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    for (const slug of ['services', ...slugs]) {
      await page.goto(`/${slug}`, { waitUntil: 'domcontentloaded' })
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      for (const image of await page.locator('main img[src*="services"]:visible').all()) {
        await image.scrollIntoViewIfNeeded()
        await expect.poll(() => image.evaluate(node => (node as HTMLImageElement).naturalWidth), { timeout: 15000, message: `${slug}: ${await image.getAttribute('alt')}` }).toBeGreaterThan(0)
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), slug).toBeTruthy()
      if (slug !== 'services') {
        for (const href of await page.locator('.treatment-related .service-card').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))) {
          expect(slugs.map(value => `/${value}`)).toContain(href)
        }
      }
    }
    expect(errors).toEqual([])
  })
}
