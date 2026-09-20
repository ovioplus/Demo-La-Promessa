import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import type { Allergen } from '@/content/types'

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}

/**
 * Antipasti, primi, secondi, dolci. `slug` is stable and human readable so the
 * seed is idempotent and so a section can be referenced without knowing its id.
 */
export const menuSections = pgTable('menu_sections', {
  id: uuid().defaultRandom().primaryKey(),
  slug: text().notNull().unique(),
  titleIt: text().notNull(),
  titleEn: text().notNull(),
  position: integer().notNull().default(0),
  ...timestamps,
})

export const dishes = pgTable('dishes', {
  id: uuid().defaultRandom().primaryKey(),
  sectionId: uuid()
    .notNull()
    .references(() => menuSections.id, { onDelete: 'cascade' }),
  nameIt: text().notNull(),
  nameEn: text().notNull(),
  descriptionIt: text().notNull().default(''),
  descriptionEn: text().notNull().default(''),
  /**
   * Cents, not euro. Storing money as a float is how you end up with a dish
   * priced at 33.99999. Null means the dish is only served inside a tasting
   * menu and therefore has no price of its own.
   */
  priceCents: integer(),
  /**
   * The subset of the 14 EU allergens this dish contains. Typed as Allergen[]
   * rather than text[] so nothing outside the legal vocabulary can be written;
   * the server action validates against the same list before it gets here.
   */
  allergens: text().array().$type<Allergen[]>().notNull().default([]),
  signature: boolean().notNull().default(false),
  visible: boolean().notNull().default(true),
  position: integer().notNull().default(0),
  ...timestamps,
})

export const tastingMenus = pgTable('tasting_menus', {
  id: uuid().defaultRandom().primaryKey(),
  slug: text().notNull().unique(),
  nameIt: text().notNull(),
  nameEn: text().notNull(),
  descriptionIt: text().notNull().default(''),
  descriptionEn: text().notNull().default(''),
  courses: integer().notNull().default(0),
  priceCents: integer().notNull().default(0),
  pairingPriceCents: integer(),
  visible: boolean().notNull().default(true),
  position: integer().notNull().default(0),
  ...timestamps,
})

/** The lines printed under the menu: sourcing note, allergen advice, and so on. */
export const menuNotes = pgTable('menu_notes', {
  id: uuid().defaultRandom().primaryKey(),
  textIt: text().notNull(),
  textEn: text().notNull(),
  position: integer().notNull().default(0),
  ...timestamps,
})
