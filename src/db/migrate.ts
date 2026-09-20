import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

config({ path: '.env.local', quiet: true })

/**
 * Runs the migrator programmatically rather than through `drizzle-kit migrate`.
 *
 * The reason is the same one written up in ovioplus-platform: drizzle-kit can
 * exit non-zero printing nothing but a spinner, which tells you nothing about
 * what Postgres actually objected to. This prints the message, the code and the
 * failing statement. Do not swap it back.
 */
async function main() {
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL
  if (!url) {
    console.error('Neither DIRECT_URL nor DATABASE_URL is set.')
    process.exit(1)
  }

  const client = postgres(url, { max: 1, prepare: false })

  try {
    await migrate(drizzle(client), { migrationsFolder: './src/db/migrations' })
    console.log('Migrations applied.')
  } catch (error) {
    const err = error as { message?: string; code?: string; detail?: string; hint?: string; query?: string }
    console.error('Migration failed.')
    console.error('  message:', err.message)
    if (err.code) console.error('  code:   ', err.code)
    if (err.detail) console.error('  detail: ', err.detail)
    if (err.hint) console.error('  hint:   ', err.hint)
    if (err.query) console.error('  query:  ', err.query)
    process.exitCode = 1
  } finally {
    await client.end({ timeout: 5 })
  }
}

void main()
