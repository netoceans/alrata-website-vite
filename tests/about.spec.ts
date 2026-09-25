import { expect, test } from '@playwright/test'

const specialAnswer = 'Yes, we do have a New Patient Special only for September, We have a $59 New Patient Special that includes a comprehensive oral exam, x-rays, and a cleaning in absence of periodontal (gum) disease.'

test('about page ships complete metadata, content, and structured data', async ({ request }) => {
  const response = await request.get('/about-us')
  expect(response.ok()).toBeTruthy()

  const html = await response.text()
  expect(html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, '')).toBe('About Alrata Art of Dentistry')
  expect(html).toContain('A dental team you can feel confident choosing.')
  expect(html).toContain('Modern tools for precise, comfortable care.')
  expect(html).toContain('Questions before your appointment.')
  expect(html).toContain(specialAnswer)
  expect(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]).toBe('https://alratadental.com/about-us')
  expect(html).toContain('<meta property="og:image" content="https://alratadental.com/media/about/about-team.webp"')

  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1]
  const structuredData = JSON.parse(json ?? '{}')
  expect(structuredData['@graph']).toEqual(expect.arrayContaining([
    expect.objectContaining({ '@type': 'AboutPage', url: 'https://alratadental.com/about-us' }),
    expect.objectContaining({ '@type': 'Dentist', name: 'Alrata Art of Dentistry' }),
    expect.objectContaining({ '@type': 'BreadcrumbList' }),
  ]))
  expect(JSON.stringify(structuredData)).not.toContain('FAQPage')
})

test('about page is discoverable from shared navigation and the sitemap', async ({ page, request }) => {
  await page.goto('/')
  await expect(page.locator('.desktop-nav').getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about-us')
  await expect(page.getByRole('link', { name: 'Learn about the clinic' })).toHaveAttribute('href', '/about-us')
  await expect(page.locator('footer').getByRole('link', { name: 'About', exact: true })).toHaveAttribute('href', '/about-us')

  const sitemap = await (await request.get('/sitemap.xml')).text()
  expect(sitemap).toContain('<loc>https://alratadental.com/about-us</loc>')
})

test('about calls to action and images use the established clinic data', async ({ page }) => {
  await page.goto('/about-us')
  await expect(page.getByRole('heading', { level: 1, name: 'About Alrata Art of Dentistry' })).toHaveCount(1)
  await expect(page.getByRole('link', { name: 'View our services' })).toHaveAttribute('href', '/services')
  await expect(page.getByRole('link', { name: 'Book an appointment' }).first()).toHaveAttribute('href', '/contacts-us#contact-form')
  await expect(page.locator('.about-cta').getByRole('link', { name: '+1 (314) 821-2650' })).toHaveAttribute('href', 'tel:+13148212650')

  const hero = page.getByRole('img', { name: 'The dental team at Alrata Art of Dentistry in St. Louis' })
  await expect(hero).toHaveAttribute('loading', 'eager')
  await expect(hero).toHaveAttribute('fetchpriority', 'high')

  for (const alt of [
    'Dr. Mamdouh Alrata, DDS, dentist at Alrata Art of Dentistry',
    'Close-up of a healthy smile',
    'A dentist speaking with a patient beside digital dental X-rays',
    'Dental mirror and instruments arranged beside a question mark',
    'A dentist discussing care with a patient at Alrata Art of Dentistry',
  ]) {
    await expect(page.getByRole('img', { name: alt })).toHaveAttribute('loading', 'lazy')
  }
})

test('FAQ disclosures are keyboard accessible and retain the exact special', async ({ page }) => {
  await page.goto('/about-us')
  const special = page.locator('details').filter({ hasText: 'Do you have any New Patient specials?' })
  const summary = special.locator('summary')

  await summary.focus()
  await expect(summary).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(special).toHaveAttribute('open', '')
  await expect(special.getByText(specialAnswer)).toBeVisible()

  await page.keyboard.press('Enter')
  await expect(special).not.toHaveAttribute('open', '')
  await expect(special.getByText(specialAnswer)).toBeHidden()

  const box = await summary.boundingBox()
  expect(box?.height).toBeGreaterThanOrEqual(44)
})

test('about content and native FAQ remain usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/about-us')

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Checklist for your visit.' })).toBeVisible()
  const special = page.locator('details').filter({ hasText: 'Do you have any New Patient specials?' })
  await special.locator('summary').press('Enter')
  await expect(special.getByText(specialAnswer)).toBeVisible()
  expect(await page.locator('.reveal').first().evaluate(node => getComputedStyle(node).opacity)).toBe('1')

  await context.close()
})

test('about page is responsive without overflow or failed local images', async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto('/about-us')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.locator('.about-cta').scrollIntoViewIfNeeded()

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBeTruthy()
    expect(await page.locator('img[src*="media/about"]').evaluateAll(images => images.every(image => {
      const element = image as HTMLImageElement
      return element.complete && element.naturalWidth > 0
    }))).toBeTruthy()
  }
})
