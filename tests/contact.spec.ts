import { expect, test, type Page } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Never contact a real email provider, even if the developer has credentials configured.
  await page.route('**/api/inquiries', route => route.fulfill({ json: route.request().method() === 'GET' ? { available: true } : { status: 'sent' } }))
})

async function fillInquiry(page: Page) {
  await page.getByLabel('Full name').fill('ExamplePatient')
  await page.getByLabel('Phone number').fill('3145550100')
  await page.getByLabel('Email address').fill('example@example.com')
  await page.getByLabel('Check Up/Cleaning', { exact: true }).check()
  await page.getByLabel('New patient?').selectOption('yes')
  await page.getByLabel('Best time/day?').fill('Monday morning')
  await page.getByRole('checkbox').check()
}

test('contact content, metadata, structured data, and legacy URL are served', async ({ request }) => {
  const response = await request.get('/contacts-us/')
  expect(response.ok()).toBeTruthy()
  expect(new URL(response.url()).pathname).toBe('/contacts-us')
  const html = await response.text()
  expect(html).toContain('Contact us easily online, by phone or by dropping in.')
  expect(html).toContain('Monday – Friday, 8am – 5pm CDT')
  expect(html).toContain('info@alratadental.com')
  expect(html).toContain('<link rel="canonical" href="https://alratadental.com/contacts-us"')
  expect(html).toContain('<meta name="description"')
  expect(html).toContain('<meta property="og:image"')
  expect(html).toContain('<meta name="twitter:card" content="summary_large_image"')
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1]
  expect(JSON.parse(json ?? '{}')['@graph']).toEqual(expect.arrayContaining([
    expect.objectContaining({ '@type': 'ContactPage', url: 'https://alratadental.com/contacts-us' }),
    expect.objectContaining({ '@type': 'Dentist', telephone: '+13148212650', openingHoursSpecification: [expect.objectContaining({ opens: '08:00', closes: '17:00' })] }),
    expect.objectContaining({ '@type': 'BreadcrumbList' }),
  ]))
  expect(await (await request.get('/sitemap.xml')).text()).toContain('<loc>https://alratadental.com/contacts-us</loc>')
})

test('navigation, contact actions, and both map previews remain usable', async ({ page }) => {
  await page.goto('/contacts-us')
  await expect(page.locator('.desktop-nav').getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute('href', '/contacts-us')
  await expect(page.locator('footer').getByRole('link', { name: 'Contact us', exact: true })).toHaveAttribute('href', '/contacts-us')
  await expect(page.locator('.contact-hero').getByRole('link', { name: 'Book online' })).toHaveAttribute('href', '/contacts-us#contact-form')
  await expect(page.locator('.contact-details').getByRole('link', { name: '+1 (314) 821-2650' })).toHaveAttribute('href', 'tel:+13148212650')
  await expect(page.locator('.contact-details').getByRole('link', { name: 'info@alratadental.com' })).toHaveAttribute('href', 'mailto:info@alratadental.com')
  await page.locator('.contact-hero').getByRole('link', { name: 'Book online' }).click()
  await expect(page).toHaveURL(/\/contacts-us#contact-form$/)
  await expect.poll(async () => {
    const form = await page.locator('#contact-form').boundingBox()
    const header = await page.locator('header').boundingBox()
    return Boolean(form && header && form.y >= header.height && form.y < 150)
  }).toBeTruthy()
  await page.goto('/about-us')
  await page.locator('.header-book').click()
  await expect(page).toHaveURL(/\/contacts-us#contact-form$/)
  await expect(page.getByRole('heading', { name: 'Your enquiry' })).toBeInViewport()
  for (const map of await page.locator('.location-map').all()) {
    await expect(map.locator('iframe')).toHaveAttribute('src', /openstreetmap\.org\/export\/embed\.html.*marker=38.6026636%2C-90.3870704/)
    await expect(map.locator('iframe')).toHaveAttribute('loading', 'lazy')
    await expect(map.getByRole('link', { name: 'Open Alrata Art of Dentistry in Google Maps' })).toHaveAttribute('href', /google\.com\/maps\/search/)
    await expect(map.getByRole('link', { name: 'OpenStreetMap contributors' })).toHaveAttribute('href', 'https://www.openstreetmap.org/copyright')
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Open menu' }).click()
  const mobileContact = page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Contact', exact: true })
  await expect(mobileContact).toHaveAttribute('href', '/contacts-us')
  await mobileContact.click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contact us.')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.locator('#mobile-menu').getByRole('link', { name: 'Book appointment', exact: true }).click()
  await expect(page).toHaveURL(/\/contacts-us#contact-form$/)
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('heading', { name: 'Your enquiry' })).toBeInViewport()
})

test('form validates accessibly and sends once without saving entries', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', error => pageErrors.push(error.message))
  await page.goto('/contacts-us')
  const requests: string[] = []
  page.on('request', request => {
    if (request.method() !== 'GET' || request.url().includes('ExamplePatient')) requests.push(request.url())
  })
  const form = page.getByRole('form', { name: 'Contact enquiry' })
  const check = form.getByRole('button', { name: 'Send enquiry' })
  await expect(form.getByRole('button', { name: 'Send enquiry' })).toBeEnabled()
  await check.click()
  await expect(form.getByLabel('Full name')).toBeFocused()
  await expect(form.getByLabel('Full name')).toHaveAttribute('aria-describedby', 'contact-fullName-error')
  await expect(form.getByRole('status')).toContainText('Please review the marked fields')
  await form.getByLabel('Full name').fill('ExamplePatient')
  await form.getByLabel('Phone number').fill('3145550100')
  await form.getByLabel('Email address').fill('invalid')
  await form.getByLabel('Check Up/Cleaning', { exact: true }).check()
  await form.getByLabel('New patient?').selectOption('yes')
  await form.getByLabel('Best time/day?').fill('Monday morning')
  await check.click()
  await expect(form.getByLabel('Email address')).toBeFocused()
  await expect(form.getByText('Enter a valid email address.')).toBeVisible()
  await form.getByLabel('Email address').fill('example@example.com')
  await check.click()
  await expect(form.getByRole('checkbox')).toBeFocused()
  await form.getByRole('checkbox').press('Space')
  await check.press('Enter')
  await expect(form.getByRole('status')).toContainText('Your enquiry has been sent')
  await expect(form.locator('[aria-invalid="true"]')).toHaveCount(0)
  await form.getByLabel('Full name').press('Enter')
  expect(requests).toHaveLength(1)
  expect(requests[0]).toContain('/api/inquiries')
  await expect(form.getByLabel('Full name')).toHaveValue('')
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 })
  expect(pageErrors).toEqual([])
  await expect(form.getByRole('link', { name: 'privacy policy' })).toHaveAttribute('href', '/privacy-policy')
  await expect(form.getByRole('link', { name: 'terms of service' })).toHaveAttribute('href', '/terms-of-service')
})

test('responsive layout and focused controls clear fixed navigation', async ({ page }) => {
  await page.goto('/contacts-us')
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
    await page.getByRole('button', { name: 'Send enquiry' }).click()
    await expect(page.getByLabel('Full name')).toBeFocused()
    await expect.poll(async () => {
      const input = await page.getByLabel('Full name').boundingBox()
      const header = await page.locator('header').boundingBox()
      return Boolean(input && header && input.y >= header.height && input.y + input.height < 836)
    }).toBeTruthy()
  }
  await page.setViewportSize({ width: 768, height: 900 })
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
})

test('content and contact alternatives remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/contacts-us')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contact us.')
  await expect(page.getByRole('form', { name: 'Contact enquiry' })).toContainText('Online submission is currently unavailable.')
  await expect(page.locator('.contact-hero').getByRole('link', { name: 'Book online' })).toBeVisible()
  await expect(page.getByLabel('Full name')).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Send enquiry' })).toBeDisabled()
  expect(new URL(page.url()).search).toBe('')
  await context.close()
})

test('missing configuration leaves sending disabled and contact alternatives usable', async ({ page }) => {
  await page.route('**/api/inquiries', route => route.fulfill({ json: { available: false } }))
  await page.goto('/contacts-us')
  await expect(page.getByRole('button', { name: 'Send enquiry' })).toBeDisabled()
  await expect(page.getByRole('form')).toContainText('Online submission is currently unavailable')
  await expect(page.locator('.contact-enquiry-links').getByRole('link', { name: 'info@alratadental.com' })).toBeVisible()
})

test('sending prevents duplicate submissions and posts the complete payload', async ({ page }) => {
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  const payloads: unknown[] = []
  await page.route('**/api/inquiries', async route => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { available: true } })
    payloads.push(route.request().postDataJSON())
    await gate
    await route.fulfill({ json: { status: 'sent' } })
  })
  await page.goto('/contacts-us')
  await fillInquiry(page)
  await page.getByLabel('How can we help?').fill('Synthetic message')
  await page.getByRole('button', { name: 'Send enquiry' }).click()
  await expect(page.getByRole('button', { name: 'Sending…' })).toBeDisabled()
  await page.locator('#contact-form').dispatchEvent('submit')
  await expect(page.getByLabel('Full name')).toBeDisabled()
  release()
  await expect(page.getByRole('status')).toContainText('Your enquiry has been sent')
  expect(payloads).toEqual([{
    fullName: 'ExamplePatient', phone: '3145550100', email: 'example@example.com',
    treatment: 'Check Up/Cleaning', newPatient: 'yes', preferredTime: 'Monday morning',
    message: 'Synthetic message', consent: true, website: '',
  }])
})

for (const failure of ['provider', 'network', 'validation', 'rate-limit'] as const) {
  test(`${failure} failure keeps entries and never claims success`, async ({ page }) => {
    await page.route('**/api/inquiries', route => {
      if (route.request().method() === 'GET') return route.fulfill({ json: { available: true } })
      if (failure === 'network') return route.abort()
      if (failure === 'validation') return route.fulfill({ status: 400, json: { error: 'Please review the marked fields.', errors: { phone: 'Enter a valid phone number.' } } })
      if (failure === 'rate-limit') return route.fulfill({ status: 429, json: { error: 'Too many enquiries. Please try again later or call us.' } })
      return route.fulfill({ status: 502, json: { error: 'We could not confirm your enquiry was sent.' } })
    })
    await page.goto('/contacts-us')
    await fillInquiry(page)
    await page.getByRole('button', { name: 'Send enquiry' }).click()
    await expect(page.getByRole('status')).toContainText(failure === 'validation' ? 'Please review' : failure === 'rate-limit' ? 'Too many enquiries' : 'could not confirm')
    await expect(page.getByLabel('Full name')).toHaveValue('ExamplePatient')
    await expect(page.getByRole('button', { name: 'Send enquiry' })).toBeEnabled()
    if (failure === 'validation') await expect(page.getByLabel('Phone number')).toBeFocused()
  })
}
