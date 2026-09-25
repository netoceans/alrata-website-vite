import { expect, test } from '@playwright/test'

const response = {
  status: 'available', rating: 4.7, reviewCount: 82, url: 'https://www.google.com/maps/place/test', attributions: [],
  reviews: Array.from({ length: 5 }, (_, i) => ({
    id: `test-${i}`, author: i === 0 ? 'Alexandra A Very Long Reviewer Name To Check Overflow' : `Test reviewer ${i + 1}`,
    authorUrl: 'https://www.google.com/maps/contrib/test', rating: i === 1 ? 2 : 5,
    text: 'Synthetic review for automated layout testing only. The team explained the appointment clearly and answered my questions. '.repeat(3),
    publishedAt: '2026-09-01T00:00:00Z', relativeDate: '2 weeks ago', url: `https://www.google.com/maps/reviews/test-${i}`,
  })),
}

test('endpoint rejects arbitrary queries and prevents caching', async ({ request }) => {
  const result = await request.get('/api/google-reviews?placeId=other-clinic')
  expect(result.status()).toBe(400)
  expect(result.headers()['cache-control']).toContain('no-store')
  expect(await result.json()).toEqual({ status: 'unavailable' })
})

test('fallback is in static HTML and contains no invented rating', async ({ request }) => {
  const result = await request.get('/')
  const html = await result.text()
  expect(html).toContain('Explore patient reviews')
  expect(html).not.toContain('out of 5 stars')
  expect(html).not.toContain('GOOGLE_PLACES_API_KEY')
})

for (const [name, width, height] of [['desktop', 1440, 1000], ['tablet', 820, 1180], ['mobile', 390, 844], ['small-mobile', 320, 740]] as const) {
  test(`${name}: compact reviews overlap hero and remain accessible`, async ({ page }) => {
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    let resolveRequest!: () => void
    const gate = new Promise<void>((resolve) => { resolveRequest = resolve })
    let calls = 0
    await page.route('**/api/google-reviews', async (route) => {
      calls++
      await gate
      await route.fulfill({ json: response })
    })
    await page.goto('/')
    const section = page.getByRole('region', { name: 'A little reassurance. A real experience.' })
    await section.scrollIntoViewIfNeeded()
    const before = await section.boundingBox()
    resolveRequest()
    const track = page.getByRole('region', { name: 'Google patient reviews', exact: true })
    await expect(track).toBeVisible()
    const after = await section.boundingBox()
    expect(Math.abs(after!.height - before!.height)).toBeLessThanOrEqual(1)
    expect(await page.locator('.google-review-card').count()).toBe(5)
    await expect(page.getByRole('img', { name: '2 out of 5 stars' })).toBeVisible()
    const hero = await page.locator('.hero').boundingBox()
    const control = await page.locator('.hero-media-caption').boundingBox()
    expect(after!.y).toBeLessThan(hero!.y + hero!.height)
    expect(control!.y + control!.height).toBeLessThanOrEqual(after!.y)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width)
    await expect(page.getByRole('button', { name: 'Previous reviews' })).toBeDisabled()
    await page.getByRole('button', { name: 'Next reviews' }).click()
    await expect.poll(() => track.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0)
    await track.focus()
    await page.keyboard.press('ArrowLeft')
    await expect.poll(() => track.evaluate((node) => node.scrollLeft)).toBe(0)
    await expect(page.getByRole('link', { name: "Read Alexandra A Very Long Reviewer Name To Check Overflow's full review on Google Maps" })).toHaveAttribute('href', response.reviews[0].url)
    expect(calls).toBe(1)
    await page.screenshot({ path: `artifacts/google-reviews-${name}.png` })
  })
}

test('failed request leaves a usable Google invitation', async ({ page }) => {
  await page.route('**/api/google-reviews', (route) => route.fulfill({ status: 503, body: '' }))
  await page.goto('/')
  await page.getByRole('link', { name: 'Explore patient reviews' }).scrollIntoViewIfNeeded()
  await expect(page.getByRole('link', { name: 'Explore patient reviews' })).toHaveAttribute('href', /google.com\/maps/)
  await expect(page.locator('.google-review-card')).toHaveCount(0)
  await page.screenshot({ path: 'artifacts/google-reviews-fallback.png' })
})
