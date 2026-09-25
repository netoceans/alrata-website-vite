import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

// Original clinic portraits downloaded to artifacts/team-source; see docs/team-content.md.
const slugs = ['mamdouh-alrata', 'danya-kazzaz', 'shelly', 'vanessa-rosas', 'janet']
await mkdir('public/media/team', { recursive: true })
for (const slug of slugs) {
  const result = await sharp(`artifacts/team-source/${slug}.jpg`)
    .rotate()
    .resize(1000, 1250, { fit: 'cover', position: 'north' })
    .webp({ quality: 84, effort: 6 })
    .toFile(`public/media/team/${slug}.webp`)
  console.log(`${slug}: ${result.width}×${result.height}, ${Math.round(result.size / 1024)} KB`)
}
