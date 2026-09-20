/**
 * Pre-generates every optimised image size on Vercel.
 *
 * Next optimises on first request and caches the result, so without this the
 * first person to open the site pays roughly a second per photograph while the
 * optimiser works. That person should not be the client during a demo.
 *
 * Run it after any deploy that changed the photography:
 *   node scripts/warm-images.mjs
 *   node scripts/warm-images.mjs https://some-preview.vercel.app
 */
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const base = process.argv[2] ?? 'https://lapromessa.vercel.app'

/** The widths next/image actually requests for this site's `sizes` values. */
const WIDTHS = [640, 828, 1080, 1200, 1920, 2048]

const files = readdirSync(join(process.cwd(), 'public', 'images')).filter((name) =>
  /\.(jpe?g|png|webp|avif)$/i.test(name),
)

if (files.length === 0) {
  console.error('No images found in public/images.')
  process.exit(1)
}

console.log(`Warming ${files.length} images at ${WIDTHS.length} widths against ${base}`)

let ok = 0
let failed = 0
const started = Date.now()

// Sequential on purpose: firing 60 optimiser requests at once just queues them
// and muddies the timing report.
for (const file of files) {
  const times = []
  for (const width of WIDTHS) {
    const url = `${base}/_next/image?url=${encodeURIComponent(`/images/${file}`)}&w=${width}&q=75`
    const at = Date.now()
    try {
      const response = await fetch(url, { headers: { Accept: 'image/avif,image/webp,*/*' } })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      await response.arrayBuffer()
      times.push(Date.now() - at)
      ok += 1
    } catch (error) {
      times.push(-1)
      failed += 1
      console.error(`  ${file} @${width}: ${error instanceof Error ? error.message : error}`)
    }
  }
  console.log(`  ${file.padEnd(20)} ${times.map((t) => (t < 0 ? 'fail' : `${t}ms`)).join('  ')}`)
}

console.log(`\nDone in ${((Date.now() - started) / 1000).toFixed(1)}s. ${ok} warmed, ${failed} failed.`)
process.exit(failed > 0 ? 1 : 0)
