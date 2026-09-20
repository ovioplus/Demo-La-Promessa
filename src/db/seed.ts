import { config } from 'dotenv'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { hours as hoursSeed } from '@/content/hours'
import { menu as menuSeed } from '@/content/menu'
import * as schema from './schema'

config({ path: '.env.local', quiet: true })

/**
 * Loads the committed seed content into the database.
 *
 * src/content/menu.ts and src/content/hours.ts stay the single source of the
 * initial state: they are what a fresh clone renders with no database, and they
 * are what this script writes on first run. Nothing is duplicated.
 *
 * Refuses to touch a database that already has menu rows unless given --force,
 * because running this against production would silently discard whatever the
 * owner had typed into the dashboard.
 */
async function main() {
  const force = process.argv.includes('--force')
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL
  if (!url) {
    console.error('Neither DIRECT_URL nor DATABASE_URL is set.')
    process.exit(1)
  }

  const client = postgres(url, { max: 1, prepare: false })
  const db = drizzle(client, { schema, casing: 'snake_case' })

  try {
    const [existing] = await db.select({ count: sql<number>`count(*)::int` }).from(schema.menuSections)

    if ((existing?.count ?? 0) > 0 && !force) {
      console.log(`Database already holds ${existing?.count} menu sections. Pass --force to replace them.`)
      return
    }

    await db.transaction(async (tx) => {
      // Dishes cascade from sections, so these four cover the content tables.
      await tx.delete(schema.menuSections)
      await tx.delete(schema.tastingMenus)
      await tx.delete(schema.menuNotes)
      await tx.delete(schema.openingHours)
      await tx.delete(schema.specialClosures)

      for (const [sectionIndex, section] of menuSeed.sections.entries()) {
        const [inserted] = await tx
          .insert(schema.menuSections)
          .values({
            slug: section.id,
            titleIt: section.title.it,
            titleEn: section.title.en,
            position: sectionIndex,
          })
          .returning({ id: schema.menuSections.id })

        if (!inserted) throw new Error(`Failed to insert section ${section.id}`)

        for (const [dishIndex, dish] of section.dishes.entries()) {
          await tx.insert(schema.dishes).values({
            sectionId: inserted.id,
            nameIt: dish.name.it,
            nameEn: dish.name.en,
            descriptionIt: dish.description.it,
            descriptionEn: dish.description.en,
            priceCents: dish.price === null ? null : Math.round(dish.price * 100),
            allergens: [...dish.allergens],
            signature: dish.signature ?? false,
            position: dishIndex,
          })
        }
      }

      for (const [index, tasting] of menuSeed.tastingMenus.entries()) {
        await tx.insert(schema.tastingMenus).values({
          slug: tasting.id,
          nameIt: tasting.name.it,
          nameEn: tasting.name.en,
          descriptionIt: tasting.description.it,
          descriptionEn: tasting.description.en,
          courses: tasting.courses,
          priceCents: Math.round(tasting.price * 100),
          pairingPriceCents:
            tasting.pairingPrice === undefined ? null : Math.round(tasting.pairingPrice * 100),
          position: index,
        })
      }

      for (const [index, note] of menuSeed.notes.entries()) {
        await tx.insert(schema.menuNotes).values({ textIt: note.it, textEn: note.en, position: index })
      }

      for (const day of hoursSeed.week) {
        for (const [index, service] of day.services.entries()) {
          await tx.insert(schema.openingHours).values({
            weekday: day.day,
            opensAt: service.from,
            closesAt: service.to,
            labelIt: service.label.it,
            labelEn: service.label.en,
            position: index,
          })
        }
      }

      for (const closure of hoursSeed.closures) {
        await tx.insert(schema.specialClosures).values({
          startsOn: closure.from,
          endsOn: closure.to,
          reasonIt: closure.reason.it,
          reasonEn: closure.reason.en,
        })
      }
    })

    console.log('Seeded: menu sections, dishes, tasting menus, notes, opening hours and closures.')
  } catch (error) {
    const err = error as { message?: string; code?: string; detail?: string }
    console.error('Seed failed.')
    console.error('  message:', err.message)
    if (err.code) console.error('  code:   ', err.code)
    if (err.detail) console.error('  detail: ', err.detail)
    process.exitCode = 1
  } finally {
    await client.end({ timeout: 5 })
  }
}

void main()
