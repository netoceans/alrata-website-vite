import { expect, test } from '@playwright/test'

const serviceMenu = [
  { name: 'Oral Surgery & Extractions', href: '/oral-surgery-extraction' },
  { name: 'Root Canal Treatment', href: '/root-canal-endodontics' },
  { name: 'Dental Implants', href: '/dental-implants' },
  { name: 'Dental Crowns', href: '/crowns' },
  { name: 'Dental Veneers', href: '/dental-veneers' },
]

test('desktop services navigation opens with pointer and keyboard input', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')

  const navigation = page.getByRole('navigation', { name: 'Primary navigation' })
  const servicesGroup = navigation.locator('.nav-dropdown')
  const servicesLink = navigation.getByRole('link', { name: 'Services', exact: true })
  const servicesToggle = servicesGroup.getByRole('button')
  const childLinks = servicesGroup.locator('.nav-dropdown__menu a')

  await expect(servicesLink).toHaveAttribute('href', '/services')
  await expect(servicesToggle).toHaveAttribute('aria-expanded', 'false')
  await expect(async () => {
    if (await servicesToggle.getAttribute('aria-expanded') !== 'true') await servicesToggle.click()
    await expect(servicesToggle).toHaveAttribute('aria-expanded', 'true', { timeout: 500 })
  }).toPass({ timeout: 10000 })
  await servicesToggle.click()
  await page.mouse.move(0, 0)
  await servicesLink.hover()
  await expect(servicesToggle).toHaveAttribute('aria-expanded', 'true')
  await expect(childLinks).toHaveCount(serviceMenu.length)
  expect(await childLinks.allTextContents()).toEqual(serviceMenu.map(({ name }) => name))
  expect(await childLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual(serviceMenu.map(({ href }) => href))

  await servicesToggle.focus()
  await page.keyboard.press('ArrowDown')
  await expect(childLinks.first()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(servicesToggle).toHaveAttribute('aria-expanded', 'false')
  await expect(servicesToggle).toBeFocused()
})

test('mobile services navigation expands and routes to a treatment page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const menuButton = page.locator('.menu-button')
  await expect(async () => {
    if (await menuButton.getAttribute('aria-expanded') !== 'true') await menuButton.click()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true', { timeout: 500 })
  }).toPass({ timeout: 10000 })
  const navigation = page.getByRole('navigation', { name: 'Mobile navigation' })
  const servicesLink = navigation.getByRole('link', { name: 'Services', exact: true })
  const servicesGroup = navigation.locator('.nav-dropdown')
  const servicesToggle = servicesGroup.getByRole('button')

  await expect(servicesLink).toHaveAttribute('href', '/services')
  await expect(servicesGroup.getByRole('link', { name: 'Dental Implants' })).toBeHidden()
  await servicesToggle.click()
  await expect(servicesToggle).toHaveAttribute('aria-expanded', 'true')
  await expect(servicesGroup.getByRole('link', { name: 'Dental Implants' })).toBeVisible()

  await servicesGroup.getByRole('link', { name: 'Dental Implants' }).click()
  await expect(page).toHaveURL(/\/dental-implants$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Dental Implants')
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
})
