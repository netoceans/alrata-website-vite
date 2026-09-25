import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' })
  await page.goto(process.env.VISUAL_URL || 'http://127.0.0.1:3000', { waitUntil: 'networkidle' })
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    window.scrollTo(0, 0)
    await document.fonts.ready
    await Promise.race([
      Promise.all([...document.images].map(image => image.decode().catch(() => {}))),
      new Promise(resolve => setTimeout(resolve, 10000)),
    ])
  })
  await page.screenshot({ path: `artifacts/${process.env.VISUAL_PREFIX || 'next'}-${name}.png`, fullPage: true })
  console.log(name, await page.evaluate(() => ({
    width: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    headings: [...document.querySelectorAll('h1,h2')].map(node => node.textContent),
    failedImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.currentSrc),
  })))
  await page.close()
}
await browser.close()
