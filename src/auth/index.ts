import { DrizzleAdapter } from '@auth/drizzle-adapter'
import NextAuth from 'next-auth'
import Resend from 'next-auth/providers/resend'
import { getDb, hasDatabase } from '@/db/client'
import { accounts, sessions, users, verificationTokens } from '@/db/schema'
import { isOwner } from './owners'

/**
 * Passwordless, single-use email links. There is no password field anywhere in
 * this project and there should never be one.
 *
 * The adapter is only attached when a database is configured. Without it the
 * module still loads and `auth()` simply returns null, which is what lets CI
 * build the project with no DATABASE_URL.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: hasDatabase
    ? DrizzleAdapter(getDb(), {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
      })
    : undefined,

  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.CONTACT_FROM_EMAIL ?? 'La Promessa <no-reply@ovioplus.ai>',
      name: 'Email',
    }),
  ],

  // Vercel sets the host correctly; this keeps preview deployments working too.
  trustHost: true,

  session: { strategy: 'database', maxAge: 60 * 60 * 24 * 30 },

  pages: {
    signIn: '/dashboard/sign-in',
    verifyRequest: '/dashboard/sign-in?sent=1',
    error: '/dashboard/sign-in?error=1',
  },

  callbacks: {
    /**
     * The gate. Runs before the link is sent and again when it is clicked, so
     * an address outside the allowlist never receives a link and could not use
     * one if it somehow had it.
     */
    signIn({ user }) {
      return isOwner(user.email)
    },
  },
})
