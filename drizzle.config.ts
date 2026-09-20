import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// drizzle-kit runs outside Next, so load .env.local explicitly.
config({ path: '.env.local', quiet: true })

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL
if (!url) {
  throw new Error('Neither DIRECT_URL nor DATABASE_URL is set. drizzle-kit needs one of them.')
}

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  // DDL uses the direct (un-pooled) connection where one exists; on Neon the
  // pooled endpoint cannot run every migration statement.
  dbCredentials: { url },
  // Write camelCase in TS, get snake_case columns in Postgres.
  casing: 'snake_case',
  verbose: true,
  strict: true,
})
