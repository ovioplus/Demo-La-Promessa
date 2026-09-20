import type { AdapterAccountType } from 'next-auth/adapters'
import { integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

/**
 * Auth.js tables, shaped as its Drizzle adapter expects.
 *
 * There is no password column anywhere here and there never will be: the only
 * way in is a single-use link emailed to an address on the OWNER_EMAILS
 * allowlist (see src/auth/config.ts).
 *
 * `accounts` is unused today because there is no OAuth provider, but the
 * adapter requires it and adding "sign in with Google" later should not be a
 * migration.
 */
export const users = pgTable('users', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text(),
  email: text().unique(),
  emailVerified: timestamp({ withTimezone: true, mode: 'date' }),
  image: text(),
})

export const accounts = pgTable(
  'accounts',
  {
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text().$type<AdapterAccountType>().notNull(),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    // These six keep snake_case property names because the Auth.js Drizzle
    // adapter matches on the TS key, not the column. With casing:'snake_case'
    // the generated columns are identical either way.
    refresh_token: text(),
    access_token: text(),
    expires_at: integer(),
    token_type: text(),
    scope: text(),
    id_token: text(),
    session_state: text(),
  },
  (account) => [primaryKey({ columns: [account.provider, account.providerAccountId] })],
)

export const sessions = pgTable('sessions', {
  sessionToken: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
})

/** Where the magic link lives between being emailed and being clicked. */
export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
  },
  (token) => [primaryKey({ columns: [token.identifier, token.token] })],
)
