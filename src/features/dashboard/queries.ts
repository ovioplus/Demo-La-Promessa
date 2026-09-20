import 'server-only'

import { asc } from 'drizzle-orm'
import { getDb } from '@/db/client'
import * as table from '@/db/schema'

/**
 * Reads for the editor.
 *
 * Deliberately separate from the accessors in src/content: those are the
 * public view and filter out anything hidden and cache aggressively. The
 * dashboard needs every row, hidden ones included, and must never be served
 * from a cache the owner just invalidated.
 */

export type AdminDish = typeof table.dishes.$inferSelect
export type AdminSection = typeof table.menuSections.$inferSelect & { dishes: AdminDish[] }
export type AdminTasting = typeof table.tastingMenus.$inferSelect
export type AdminNote = typeof table.menuNotes.$inferSelect
export type AdminService = typeof table.openingHours.$inferSelect
export type AdminClosure = typeof table.specialClosures.$inferSelect

export async function getMenuForAdmin(): Promise<{
  sections: AdminSection[]
  tastingMenus: AdminTasting[]
  notes: AdminNote[]
}> {
  const db = getDb()

  const [sectionRows, dishRows, tastingRows, noteRows] = await Promise.all([
    db.select().from(table.menuSections).orderBy(asc(table.menuSections.position)),
    db.select().from(table.dishes).orderBy(asc(table.dishes.position)),
    db.select().from(table.tastingMenus).orderBy(asc(table.tastingMenus.position)),
    db.select().from(table.menuNotes).orderBy(asc(table.menuNotes.position)),
  ])

  return {
    sections: sectionRows.map((section) => ({
      ...section,
      dishes: dishRows.filter((dish) => dish.sectionId === section.id),
    })),
    tastingMenus: tastingRows,
    notes: noteRows,
  }
}

export async function getHoursForAdmin(): Promise<{
  services: AdminService[]
  closures: AdminClosure[]
}> {
  const db = getDb()

  const [services, closures] = await Promise.all([
    db
      .select()
      .from(table.openingHours)
      .orderBy(asc(table.openingHours.weekday), asc(table.openingHours.position)),
    db.select().from(table.specialClosures).orderBy(asc(table.specialClosures.startsOn)),
  ])

  return { services, closures }
}
