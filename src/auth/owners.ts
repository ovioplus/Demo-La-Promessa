/**
 * Who is allowed into the dashboard.
 *
 * An env var rather than a table, deliberately: a template instance is one
 * restaurant, the list changes about never, and keeping it out of the database
 * means there is no "manage users" screen to build, secure and explain. The
 * tradeoff is that adding a second manager needs someone with Vercel access,
 * which is noted as a known limitation in CLAUDE.md.
 *
 * Fails closed. An unset or empty OWNER_EMAILS lets nobody in, which is the
 * correct behaviour for a misconfigured deployment.
 */
export function ownerEmails(): readonly string[] {
  return (process.env.OWNER_EMAILS ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

export function isOwner(email: string | null | undefined): boolean {
  if (!email) return false
  const allowed = ownerEmails()
  return allowed.length > 0 && allowed.includes(email.trim().toLowerCase())
}
