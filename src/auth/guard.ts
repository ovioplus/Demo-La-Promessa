import 'server-only'

import { auth } from './index'
import { isOwner } from './owners'

export type OwnerSession = { email: string; name: string | null }

/** The session if it belongs to an allowlisted owner, otherwise null. */
export async function getOwnerSession(): Promise<OwnerSession | null> {
  const session = await auth()
  const email = session?.user?.email
  if (!isOwner(email)) return null
  return { email: email as string, name: session?.user?.name ?? null }
}

/**
 * For server actions. The pages are already behind the layout gate, so reaching
 * here without a session means a forged request, and throwing is the right
 * answer rather than a redirect.
 */
export async function requireOwner(): Promise<OwnerSession> {
  const session = await getOwnerSession()
  if (!session) throw new Error('Unauthorized')
  return session
}
