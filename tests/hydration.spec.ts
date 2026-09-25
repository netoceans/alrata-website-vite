import { expect, test } from '@playwright/test'

for (const extensionAttributes of [false, true]) {
  test(`shared layout hydrates with consistent navigation${extensionAttributes ? ' with extension attributes' : ''}`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', message => {
      if (message.type() === 'error' && /hydrat|didn't match|does not match|#418|#425/i.test(message.text())) errors.push(message.text())
    })
    page.on('pageerror', error => errors.push(error.message))
    if (extensionAttributes) {
      // Simulate Grammarly modifying the parsed body before any client JS runs.
      await page.route('**/*', async route => {
        if (route.request().resourceType() !== 'document' || !route.request().isNavigationRequest()) return route.continue()
        const response = await route.fetch()
        const html = await response.text()
        await route.fulfill({ response, body: html.replace('<body', '<body data-new-gr-c-s-check-loaded="8.937.0" data-gr-ext-installed=""') })
      })
    }
    await page.setViewportSize({ width: 390, height: 844 })
    for (const path of ['/', '/about-us', '/services', '/crowns']) {
      await page.goto(path, { waitUntil: 'domcontentloaded' })
      // A working menu confirms hydration has finished, not just HTML rendering.
      const toggle = page.locator('.menu-button')
      // Intercepted HTML may appear before its deferred scripts have attached events.
      await expect(async () => {
        if (await toggle.getAttribute('aria-expanded') === 'false') await toggle.click()
        await expect(toggle).toHaveAttribute('aria-expanded', 'true', { timeout: 500 })
      }).toPass({ timeout: 10000 })
      const navigation = page.getByRole('navigation', { name: 'Mobile navigation' })
      await expect(navigation.getByRole('link', { name: 'About', exact: true })).toHaveAttribute('href', '/about-us')
      await expect(navigation.getByRole('link', { name: 'Services', exact: true })).toHaveAttribute('href', '/services')
      await page.keyboard.press('Escape')
      await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
    }
    expect(errors).toEqual([])
  })
}
