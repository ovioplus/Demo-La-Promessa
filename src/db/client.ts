import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

/**
 * The database is optional on purpose.
 *
 * With no DATABASE_URL the content accessors fall back to the seed files in
 * src/content, so the repo clones and runs with zero infrastructure and CI
 * builds without a database. Production sets the variable and the dashboard
 * takes over. See src/content/index.ts for the switch itself.
 */
const url = process.env.DATABASE_URL?.trim()

export const hasDatabase = Boolean(url)

type Database = ReturnType<typeof create>

function create(connection: string) {
  const client = postgres(connection, {
    // One connection per serverless instance. Neon's pooler fans these out.
    max: 1,
    // Prepared statements break against a pooler in transaction mode.
    prepare: false,
  })

  return drizzle(client, { schema, casing: 'snake_case' })
}

let cached: Database | null = null

export function getDb(): Database {
  if (!url) {
    throw new Error('DATABASE_URL is not set. Call hasDatabase before getDb, or set the variable.')
  }
  cached ??= create(url)
  return cached
}
