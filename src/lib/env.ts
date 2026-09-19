import { z } from 'zod'

/**
 * Server-side environment. Parsed lazily rather than at import time so that a
 * missing Resend key breaks the contact form and nothing else: the rest of the
 * site is static content and must still build and serve without it.
 */
const serverSchema = z.object({
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is not set'),
  /**
   * The verified sender. The client's own domain is not verified yet, so this
   * is an ovioplus.ai address for now and the visitor's address goes in
   * reply-to. Swap this one variable once lapromessa.it is verified in Resend.
   */
  CONTACT_FROM_EMAIL: z.string().email().default('La Promessa <no-reply@ovioplus.ai>'),
  /** Where the restaurant actually reads its mail. */
  CONTACT_TO_EMAIL: z.string().email(),
})

export type ServerEnv = z.infer<typeof serverSchema>

export function readServerEnv(): { ok: true; env: ServerEnv } | { ok: false; error: string } {
  const parsed = serverSchema.safeParse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  })

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') }
  }

  return { ok: true, env: parsed.data }
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lapromessa.vercel.app'
