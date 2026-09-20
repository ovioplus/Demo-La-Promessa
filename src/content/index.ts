import 'server-only'

import { asc, eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'
import { getDb, hasDatabase } from '@/db/client'
import * as table from '@/db/schema'
import { gallery, images } from './images'
import { hours as hoursSeed } from './hours'
import { menu as menuSeed } from './menu'
import { restaurant } from './restaurant'
import type { Allergen, DayHours, GalleryImage, Hours, Menu, Restaurant, Service, Weekday } from './types'

/**
 * The content boundary.
 *
 * Every page reads content through these accessors and never imports the seed
 * files directly.
 *
 * Two sources, one shape. With DATABASE_URL set, the menu and the hours come
 * from Postgres and the owner edits them in the dashboard. Without it, they
 * come from the committed seed files, so a fresh clone renders a complete site
 * with zero infrastructure and CI builds without a database.
 *
 * The restaurant profile and the gallery are deliberately still files: they
 * change once a year, and phase 2 was scoped to the menu and the hours.
 *
 * This module is server-only. Client components that need the allergen list or
 * the Localized type import from './types' directly, which pulls in no driver.
 */

/** Passed to revalidateTag by the dashboard actions after a successful write. */
export const CACHE_TAGS = {
  menu: 'content:menu',
  hours: 'content:hours',
} as const

function toEuro(cents: number | null): number | null {
  return cents === null ? null : cents / 100
}

async function readMenu(): Promise<Menu> {
  const db = getDb()

  const [sectionRows, dishRows, tastingRows, noteRows] = await Promise.all([
    db.select().from(table.menuSections).orderBy(asc(table.menuSections.position)),
    db
      .select()
      .from(table.dishes)
      .where(eq(table.dishes.visible, true))
      .orderBy(asc(table.dishes.position)),
    db
      .select()
      .from(table.tastingMenus)
      .where(eq(table.tastingMenus.visible, true))
      .orderBy(asc(table.tastingMenus.position)),
    db.select().from(table.menuNotes).orderBy(asc(table.menuNotes.position)),
  ])

  return {
    sections: sectionRows.map((section) => ({
      id: section.slug,
      title: { it: section.titleIt, en: section.titleEn },
      dishes: dishRows
        .filter((dish) => dish.sectionId === section.id)
        .map((dish) => ({
          id: dish.id,
          name: { it: dish.nameIt, en: dish.nameEn },
          description: { it: dish.descriptionIt, en: dish.descriptionEn },
          price: toEuro(dish.priceCents),
          allergens: dish.allergens as readonly Allergen[],
          signature: dish.signature,
        })),
    })),
    tastingMenus: tastingRows.map((tasting) => ({
      id: tasting.slug,
      name: { it: tasting.nameIt, en: tasting.nameEn },
      description: { it: tasting.descriptionIt, en: tasting.descriptionEn },
      courses: tasting.courses,
      price: tasting.priceCents / 100,
      ...(tasting.pairingPriceCents === null
        ? {}
        : { pairingPrice: tasting.pairingPriceCents / 100 }),
    })),
    notes: noteRows.map((note) => ({ it: note.textIt, en: note.textEn })),
  }
}

async function readHours(): Promise<Hours> {
  const db = getDb()

  const [serviceRows, closureRows] = await Promise.all([
    db
      .select()
      .from(table.openingHours)
      .orderBy(asc(table.openingHours.weekday), asc(table.openingHours.position)),
    db.select().from(table.specialClosures).orderBy(asc(table.specialClosures.startsOn)),
  ])

  // A weekday with no rows is closed, so only days that actually have a service
  // end up in `week`. HoursList already renders an absent day as closed.
  const byDay = new Map<Weekday, Service[]>()
  for (const row of serviceRows) {
    const day = row.weekday as Weekday
    const services = byDay.get(day) ?? []
    services.push({
      from: row.opensAt,
      to: row.closesAt,
      label: { it: row.labelIt, en: row.labelEn },
    })
    byDay.set(day, services)
  }

  const week: DayHours[] = [...byDay.entries()]
    .map(([day, services]) => ({ day, services }))
    .sort((a, b) => a.day - b.day)

  return {
    week,
    closures: closureRows.map((closure) => ({
      id: closure.id,
      from: closure.startsOn,
      to: closure.endsOn,
      reason: { it: closure.reasonIt, en: closure.reasonEn },
    })),
  }
}

/**
 * Cached so the public pages stay statically rendered: the database is touched
 * on a cold render and then not again until a dashboard save calls
 * revalidateTag with the matching tag.
 */
const cachedMenu = unstable_cache(readMenu, ['content-menu'], { tags: [CACHE_TAGS.menu] })
const cachedHours = unstable_cache(readHours, ['content-hours'], { tags: [CACHE_TAGS.hours] })

export async function getRestaurant(): Promise<Restaurant> {
  return restaurant
}

export async function getMenu(): Promise<Menu> {
  return hasDatabase ? cachedMenu() : menuSeed
}

export async function getHours(): Promise<Hours> {
  return hasDatabase ? cachedHours() : hoursSeed
}

export async function getGallery(): Promise<readonly GalleryImage[]> {
  return gallery
}

export { images }
export * from './types'
