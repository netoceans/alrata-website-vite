import { expect, test } from '@playwright/test'

// Expected identities and schedules are independent of the rendering catalog.
const profiles = [
  { slug: 'mamdouh-alrata', name: 'Dr. Mamdouh Alrata, DDS', role: 'Dentist', days: ['8:00am – 5:00pm', '8:00am – 5:00pm', '8:00am – 5:00pm', '8:00am – 1:00pm', '8:00am – 2:00pm', 'Not listed'], fact: 'American Board of Operative Dentistry' },
  { slug: 'danya-kazzaz', name: 'Danya', role: 'Office Manager', days: ['8:00am – 5:00pm', '8:00am – 5:00pm', '8:00am – 5:00pm', '8:00am – 1:00pm', '8:00am – 2:00pm', 'Not listed'], fact: 'Healthcare Administration' },
  { slug: 'shelly', name: 'Shelly', role: 'Healthcare Coordinator', days: ['8:00am – 5:00pm', '8:00am – 5:00pm', '8:00am – 5:00pm', 'Not listed', 'Not listed', 'Not listed'], fact: 'Joliet Junior College' },
  { slug: 'vanessa-rosas', name: 'Vanessa', role: 'Registered Dental Hygienist', days: ['8:00am – 5:00pm', '8:00am – 5:00pm', 'Not listed', '8:00am – 1:00pm', 'Not listed', 'Not listed'], fact: 'English and Spanish' },
  { slug: 'janet', name: 'Janet', role: 'Registered Dental Hygienist', days: ['8:00am – 5:00pm', '8:00am – 5:00pm', '8:00am – 5:00pm', 'Not listed', '8:00am – 2:00pm', 'Not listed'], fact: 'Community service' },
]
const paths = ['/our-team', ...profiles.map(({ slug }) => `/cmsms_doctor/${slug}`)]

for (const profile of profiles) {
  test(`${profile.name}: complete initial HTML, canonical, and person schema`, async ({ request }) => {
    const path = `/cmsms_doctor/${profile.slug}`
    const response = await request.get(path)
    expect(response.status()).toBe(200)
    const html = await response.text()
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain(profile.name)
    expect(html).toContain(profile.fact)
    expect(html).toContain('The person behind the role.')
    expect(html).toContain(`<link rel="canonical" href="https://alratadental.com${path}"`)
    expect(html).toContain(`<meta property="og:url" content="https://alratadental.com${path}"`)
    expect(html).toContain(`<meta property="og:image" content="https://alratadental.com/media/team/${profile.slug}.webp"`)
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1] ?? '{}')['@graph']
    expect(graph).toEqual(expect.arrayContaining([
      expect.objectContaining({ '@type': 'ProfilePage', mainEntity: { '@id': `https://alratadental.com${path}#person` } }),
      expect.objectContaining({ '@type': 'Person', name: profile.name, jobTitle: profile.role, worksFor: { '@id': 'https://alratadental.com/#clinic' } }),
      expect.objectContaining({ '@type': 'BreadcrumbList' }),
    ]))
    expect(JSON.stringify(graph)).not.toMatch(/AggregateRating|openingHours|FAQPage/)
  })

  test(`${profile.name}: individual hours, appointments, images, and related profiles`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`/cmsms_doctor/${profile.slug}`, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(profile.name)
    await expect(page.locator('.person-hours dt')).toHaveText(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
    await expect(page.locator('.person-hours dd')).toHaveText(profile.days)
    await expect(page.locator('.person-hours')).toContainText('confirm appointment availability')
    await expect(page.locator('.person-hours a[href^="tel:"]')).toHaveAttribute('href', 'tel:+13148212650')
    await expect(page.locator('.person-hero .button')).toHaveAttribute('href', '/contacts-us#contact-form')
    await expect(page.locator('.person-hero-photo img')).toHaveAttribute('loading', 'eager')
    await expect(page.locator('.person-hero-photo img')).toHaveAttribute('fetchpriority', 'high')
    await expect(page.locator('.person-colleague')).toHaveCount(4)
    expect(await page.locator('.person-colleague').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(profiles.filter(p => p.slug !== profile.slug).map(p => `/cmsms_doctor/${p.slug}`))
    await page.locator('.person-colleagues').scrollIntoViewIfNeeded()
    await expect.poll(() => page.locator('.people-page img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true)
    expect(errors).toEqual([])
  })
}

test('overview lists all five members with unique metadata across all six pages', async ({ page, request }) => {
  await page.goto('/our-team', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Good care beginswith good people.')
  await expect(page.locator('.people-card')).toHaveCount(4)
  await expect(page.locator('.people-lead .button')).toHaveAttribute('href', '/cmsms_doctor/mamdouh-alrata')
  for (const card of await page.locator('.people-card').all()) {
    await card.scrollIntoViewIfNeeded()
    await expect.poll(() => card.locator('img').evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true)
  }
  const descriptions = new Set<string>()
  const titles = new Set<string>()
  for (const path of paths) {
    const html = await (await request.get(path)).text()
    titles.add(html.match(/<title>(.*?)<\/title>/)?.[1] ?? '')
    descriptions.add(html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? '')
  }
  expect(titles.size).toBe(6)
  expect(descriptions.size).toBe(6)
  expect(descriptions.has('')).toBe(false)
  const graph = await page.locator('script[type="application/ld+json"]').textContent()
  const nodes = JSON.parse(graph ?? '{}')['@graph']
  expect(nodes).toEqual(expect.arrayContaining([
    expect.objectContaining({ '@type': 'CollectionPage' }),
    expect.objectContaining({ '@type': 'ItemList', numberOfItems: 5 }),
  ]))
  expect(nodes.filter((node: { '@type': string }) => node['@type'] === 'Person')).toHaveLength(5)
})

test('legacy URLs normalize, unknown profiles 404, and all routes appear in sitemap', async ({ request }) => {
  for (const path of paths) {
    const response = await request.get(`${path}/`, { maxRedirects: 0 })
    expect(response.status()).toBe(308)
    expect(response.headers().location).toBe(path)
  }
  expect((await request.get('/cmsms_doctor/not-a-member')).status()).toBe(404)
  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const path of paths) expect(sitemap).toContain(`<loc>https://alratadental.com${path}</loc>`)
})

test('team navigation is local from homepage, footer, About, and mobile menu', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.desktop-nav').getByRole('link', { name: 'Our Team', exact: true })).toHaveAttribute('href', '/our-team')
  await expect(page.locator('footer').getByRole('link', { name: 'Our team', exact: true })).toHaveAttribute('href', '/our-team')
  await expect(page.locator('#team .team-all')).toHaveAttribute('href', '/our-team')
  expect(await page.locator('#team .team-member > a').evaluateAll(links => links.every(link => link.getAttribute('href')?.startsWith('/cmsms_doctor/')))).toBe(true)
  await page.goto('/about-us', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('link', { name: 'Meet Dr. Alrata', exact: true })).toHaveAttribute('href', '/cmsms_doctor/mamdouh-alrata')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Our Team', exact: true }).click()
  await expect(page).toHaveURL(/\/our-team$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('all pages fit desktop, tablet, and small mobile viewports', async ({ page }) => {
  test.setTimeout(120000)
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 })
    for (const path of paths) {
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
      const heading = await page.getByRole('heading', { level: 1 }).boundingBox()
      expect(heading?.y).toBeGreaterThan(76)
    }
  }
})

test('profiles and working hours remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  for (const path of paths) {
    await page.goto(path, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    if (path !== '/our-team') {
      await expect(page.locator('.person-hours')).toContainText('Monday')
      await expect(page.locator('.person-story')).toContainText('Education & background')
    }
    await expect(page.locator('.people-cta a[href="/contacts-us#contact-form"]')).toBeVisible()
  }
  await context.close()
})

test('keyboard focus, reduced motion, and 200% text sizing remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/our-team', { waitUntil: 'domcontentloaded' })
  const firstCard = page.locator('.people-card-link').first()
  await firstCard.focus()
  await expect(firstCard).toBeFocused()
  expect(await firstCard.evaluate(node => getComputedStyle(node).outlineStyle)).not.toBe('none')
  expect(await firstCard.locator('img').evaluate(node => parseFloat(getComputedStyle(node).transitionDuration))).toBeLessThanOrEqual(.001)
  await firstCard.press('Enter')
  await expect(page).toHaveURL(/\/cmsms_doctor\/danya-kazzaz$/)
  for (const path of ['/our-team', '/cmsms_doctor/mamdouh-alrata']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' })
    await page.addStyleTag({ content: 'html { font-size: 200%; }' })
    const layout = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
      overflowing: [...document.querySelectorAll('body *')].filter(element => element.getBoundingClientRect().right > innerWidth + 1).map(element => `${element.tagName}.${element.className}`),
    }))
    expect(layout.width, `${path}: ${layout.overflowing.join(', ')}`).toBeLessThanOrEqual(layout.viewport)
    await expect(page.locator('.people-cta')).toBeVisible()
  }
})
