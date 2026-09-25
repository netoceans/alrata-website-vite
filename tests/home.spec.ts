import { expect, test } from '@playwright/test'

test('initial HTML includes content and SEO; metadata endpoints work', async ({ request }) => {
  const response = await request.get('/')
  expect(response.ok()).toBeTruthy()
  const html = await response.text()
  expect(html).toContain('Dental care that makes room for confidence.')
  expect(html).toContain('Care is personal here.')
  expect(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]).toMatch(/^https:\/\/alratadental\.com\/?$/)
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1]
  const structuredData = JSON.parse(json ?? '{}')
  expect(structuredData['@graph']).toEqual(expect.arrayContaining([
    expect.objectContaining({ '@type': 'Dentist', name: 'Alrata Art of Dentistry' }),
    expect.objectContaining({ '@type': 'Person', name: 'Dr. Mamdouh Alrata, DDS' }),
  ]))
  expect(html).toContain('Meet Dr. Mamdouh Alrata, DDS.')
  expect(html).toContain('Providing dental care since 2012')
  expect(html).toContain('American Board of Operative Dentistry')
  expect(html).toContain('href="/cmsms_doctor/mamdouh-alrata"')
  expect(html.indexOf('Meet Dr. Mamdouh Alrata, DDS.')).toBeLessThan(html.indexOf('Meet the people caring for you.'))
  expect((html.match(/<img[^>]+alt="Dr\. Mamdouh Alrata, DDS, St\. Louis dentist at Alrata Art of Dentistry"/g) ?? [])).toHaveLength(1)
  expect((await request.get('/sitemap.xml')).status()).toBe(200)
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap: https://alratadental.com/sitemap.xml')
  expect((await request.get('/media/dental-care-hero.mp4')).status()).toBe(200)
})

test('footer location preview uses OpenStreetMap and opens Google Maps', async ({ page }) => {
  await page.goto('/')
  const location = page.locator('.footer-location')
  await expect(location.getByRole('heading', { name: 'Our Location' })).toBeVisible()
  await expect(location.locator('iframe[title="OpenStreetMap preview of Alrata Art of Dentistry"]'))
    .toHaveAttribute('src', /^https:\/\/www\.openstreetmap\.org\/export\/embed\.html/)

  const mapLink = location.getByRole('link', { name: 'Open Alrata Art of Dentistry in Google Maps' })
  await expect(mapLink).toHaveAttribute(
    'href',
    'https://www.google.com/maps/search/?api=1&query=Alrata+Art+of+Dentistry%2C+10038+Manchester+Rd+%23226%2C+St.+Louis%2C+MO+63122',
  )
  await expect(mapLink).toHaveAttribute('target', '_blank')
  await expect(mapLink).toHaveAttribute('rel', 'noopener noreferrer')
  await mapLink.focus()
  await expect(mapLink).toBeFocused()
  await expect(location.locator('iframe')).toHaveAttribute('tabindex', '-1')

  for (const viewport of [{ width: 1024, height: 768 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await expect(location).toBeVisible()
    const mapBox = await location.locator('.footer-map-frame').boundingBox()
    expect(mapBox).not.toBeNull()
    expect(mapBox?.width).toBeLessThanOrEqual(viewport.width)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width)
  }
})

test('hydrates and handles queued carousel input and keyboard navigation', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  const next = page.getByRole('button', { name: 'Next patient story', exact: true })
  await next.scrollIntoViewIfNeeded()
  await next.click()
  await next.click({ force: true })
  await expect(page.locator('.story-count')).toContainText('01')
  const carousel = page.getByRole('region', { name: 'Patient story previews' })
  await carousel.focus()
  await page.keyboard.press('End')
  await expect(page.locator('.story-count')).toContainText('03')
  await page.keyboard.press('Home')
  await expect(page.locator('.story-count')).toContainText('01')
  expect(errors).toEqual([])
})

test('offer carousel wraps, supports keyboard navigation, and only exposes a live offer CTA', async ({ page }) => {
  await page.goto('/')
  const carousel = page.getByRole('region', { name: 'Current and upcoming offers' })
  const count = page.locator('.offer-count')
  await carousel.scrollIntoViewIfNeeded()
  await expect(count).toContainText('01 / 03')

  await page.getByRole('button', { name: 'Previous offer' }).click()
  await expect(count).toContainText('03 / 03')
  await expect(page.getByRole('link', { name: 'Ask about this offer' })).toHaveCount(0)

  await carousel.focus()
  await page.keyboard.press('Home')
  await expect(count).toContainText('01 / 03')
  await expect(page.getByRole('link', { name: 'Ask about this offer' })).toBeVisible()
  await page.keyboard.press('End')
  await expect(count).toContainText('03 / 03')
  await page.keyboard.press('ArrowRight')
  await expect(count).toContainText('01 / 03')
})

test('offer carousel exposes an automatic rotation control', async ({ page }) => {
  await page.goto('/')
  const pause = page.getByRole('button', { name: 'Pause automatic offer rotation' })
  await expect(pause).toBeVisible()
  await pause.click()
  await expect(page.getByRole('button', { name: 'Start automatic offer rotation' })).toBeVisible()
})

test('failed video playback provides recovery UI', async ({ page }) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException('Blocked', 'NotAllowedError'))
  })
  await page.goto('/')
  await page.getByRole('button', { name: '02 Watch story: Patient story layout 02', exact: true }).click()
  await expect(page.locator('.story-playback-error')).toHaveText('This preview could not play. Please try again.')
  await expect(page.getByRole('button', { name: '02 Watch story: Patient story layout 02', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Play dental care demonstration video', exact: true }).click()
  await expect(page.locator('.hero-poster')).toBeVisible()
})

test('comparison supports keyboard and pointer input', async ({ page }) => {
  await page.goto('/')
  const slider = page.getByRole('slider', { name: 'Before and after image comparison' })
  await slider.focus()
  await slider.press('End')
  await expect(slider).toHaveValue('100')
  await slider.press('Home')
  await expect(slider).toHaveValue('0')
  const frame = page.locator('.comparison-frame')
  await frame.scrollIntoViewIfNeeded()
  const box = await frame.boundingBox()
  if (!box) throw new Error('Comparison frame missing')
  await page.mouse.click(box.x + box.width * 0.25, box.y + box.height * 0.5)
  expect(Number(await slider.inputValue())).toBeGreaterThanOrEqual(24)
  expect(Number(await slider.inputValue())).toBeLessThanOrEqual(26)
})

test('mobile menu traps focus, closes with Escape, and restores scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Open menu' })
  await toggle.click()
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Home', exact: true })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(toggle).toBeFocused()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
})

test('reduced motion and data saving suppress automatic video downloads', async ({ browser }) => {
  for (const saveData of [false, true]) {
    const context = await browser.newContext({ reducedMotion: saveData ? 'no-preference' : 'reduce' })
    if (saveData) await context.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true }))
    const page = await context.newPage()
    await page.goto('/')
    await page.waitForTimeout(1800)
    await expect(page.locator('.hero-media video')).not.toHaveAttribute('src')
    await context.close()
  }
})

test('content stays visible without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Care is personal here.' })).toBeVisible()
  expect(await page.locator('.reveal').first().evaluate(node => getComputedStyle(node).opacity)).toBe('1')
  await context.close()
})

test('doctor profile is responsive without horizontal overflow', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/')
    const section = page.getByRole('region', { name: 'Meet Dr. Mamdouh Alrata, DDS.' })
    await expect(section).toBeVisible()
    await expect(section.getByRole('link', { name: "Read Dr. Alrata's full profile" })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy()
  }
})

test('legal pages expose the supplied SMS policies and metadata', async ({ request }) => {
  const privacyResponse = await request.get('/privacy-policy')
  expect(privacyResponse.ok()).toBeTruthy()
  const privacy = await privacyResponse.text()
  expect(privacy).toContain('Mamdouh Alrata INC.')
  expect(privacy).toContain('Effective Date:')
  expect(privacy).toContain('11/01/2024')
  expect(privacy).toContain('We do not share your phone number or SMS opt-in information')
  expect(privacy).toContain('href="tel:+13148212650"')
  expect(privacy.match(/<link rel="canonical" href="([^"]+)"/)?.[1]).toBe('https://alratadental.com/privacy-policy')

  const termsResponse = await request.get('/terms-of-service')
  expect(termsResponse.ok()).toBeTruthy()
  const terms = await termsResponse.text()
  expect(terms).toContain('10DLC Compliant')
  expect(terms).toContain('up to 4 messages per month')
  expect(terms).toContain('at least 18 years old')
  expect(terms).toContain('href="/privacy-policy"')
  expect(terms.match(/<link rel="canonical" href="([^"]+)"/)?.[1]).toBe('https://alratadental.com/terms-of-service')
})

test('footer uses local legal links and credits Net Oceans', async ({ page }) => {
  await page.goto('/')
  const footer = page.locator('footer')
  await expect(footer.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy-policy')
  await expect(footer.getByRole('link', { name: 'Terms of service' })).toHaveAttribute('href', '/terms-of-service')
  const designerCredit = footer.getByRole('link', { name: 'Designed By Net Oceans' })
  await expect(designerCredit).toHaveAttribute('href', 'https://netoceans.com/')
  await expect(designerCredit).toHaveAttribute('target', '_blank')
  await expect(designerCredit).toHaveAttribute('rel', 'noopener noreferrer')

  const sitemap = await (await page.request.get('/sitemap.xml')).text()
  expect(sitemap).toContain('https://alratadental.com/privacy-policy')
  expect(sitemap).toContain('https://alratadental.com/terms-of-service')
})

test('legal pages remain readable without horizontal overflow', async ({ page }) => {
  for (const path of ['/privacy-policy', '/terms-of-service']) {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport)
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy()
    }
  }
})
