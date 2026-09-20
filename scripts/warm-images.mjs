/**
 * Pre-generates every optimised image variant the site actually requests.
 *
 * Next optimises on first request and caches the result, so without this the
 * first visitor pays for the optimiser on every photograph. That visitor should
 * not be the client during a demo.
 *
 * The URLs are scraped from the rendered pages rather than built from the
 * filenames in public/images. That matters: the photographs are imported
 * statically, so their real source path is /_next/static/media/<name>.<hash>.jpg
 * and the hash changes whenever a file does. Guessing from the filesystem warms
 * URLs the site never asks for, which is exactly the bug this replaced.
 *
 *   node scripts/warm-images.mjs
 *   node scripts/warm-images.mjs https://some-preview.vercel.app
 */
const base = (process.argv[2] ?? 'https://lapromessa.vercel.app').replace(/\/$/, '')

const ROUTES = [
  '/',
  '/menu',
  '/la-storia',
  '/galleria',
  '/prenota',
  '/contatti',
  '/en',
  '/en/menu',
  '/en/story',
  '/en/gallery',
  '/en/reservations',
  '/en/contact',
]

const variants = new Set()

for (const route of ROUTES) {
  const response = await fetch(base + route)
  if (!response.ok) {
    console.error(`  ${route}: HTTP ${response.status}`)
    continue
  }
  const html = await response.text()
  // Both the src and every candidate in srcset, as Next writes them.
  for (const match of html.matchAll(/\/_next\/image\?url=[^"'\s,\\]+/g)) {
    variants.add(match[0].replaceAll('&amp;', '&'))
  }
}

if (variants.size === 0) {
  console.error('Found no optimised image URLs. Has the markup changed?')
  process.exit(1)
}

console.log(`Warming ${variants.size} image variants across ${ROUTES.length} routes on ${base}`)

let ok = 0
let failed = 0
let slowest = 0
const started = Date.now()

// Sequential on purpose: firing them all at once just queues them at the
// optimiser and makes the timings meaningless.
for (const path of variants) {
  const at = Date.now()
  try {
    const response = await fetch(base + path, { headers: { Accept: 'image/avif,image/webp,*/*' } })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    await response.arrayBuffer()
    const took = Date.now() - at
    slowest = Math.max(slowest, took)
    ok += 1
  } catch (error) {
    failed += 1
    console.error(`  fail ${path}: ${error instanceof Error ? error.message : error}`)
  }
}

console.log(
  `Done in ${((Date.now() - started) / 1000).toFixed(1)}s. ${ok} warmed, ${failed} failed, slowest ${slowest}ms.`,
)
process.exit(failed > 0 ? 1 : 0)
