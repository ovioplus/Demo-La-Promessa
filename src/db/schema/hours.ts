import { date, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}

/**
 * One row per service, not per day: Friday has both a lunch and a dinner row.
 * A weekday with no rows is closed, which is why there is no `closed` column.
 */
export const openingHours = pgTable('opening_hours', {
  id: uuid().defaultRandom().primaryKey(),
  /** 0 is Sunday, matching Date#getDay(). */
  weekday: integer().notNull(),
  /** 'HH:MM', 24 hour. Stored as text because it is a label, not an instant. */
  opensAt: text().notNull(),
  closesAt: text().notNull(),
  labelIt: text().notNull(),
  labelEn: text().notNull(),
  position: integer().notNull().default(0),
  ...timestamps,
})

export const specialClosures = pgTable('special_closures', {
  id: uuid().defaultRandom().primaryKey(),
  startsOn: date({ mode: 'string' }).notNull(),
  endsOn: date({ mode: 'string' }).notNull(),
  reasonIt: text().notNull(),
  reasonEn: text().notNull(),
  ...timestamps,
})
