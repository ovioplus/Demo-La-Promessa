import { z } from 'zod'

/**
 * Server-side environment. Parsed lazily rather than at import time so that a
 * missing Resend key breaks the contact form and nothing else: the rest of the
 * site is static content and must still build and serve without it.
 */
const BARE_ADDRESS = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/
const NAMED_ADDRESS = /^[^<>]+<\s*[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+\s*>$/

/**
 * An address Resend will accept, in either form it supports: `you@example.com`
 * or `Your Name <you@example.com>`.
 *
 * Not `z.string().email()`, which rejects the second form. That mattered: the
 * documented value for CONTACT_FROM_EMAIL is the named form, and zod does not
 * validate `.default()` values, so the bug only appeared once somebody set the
 * variable explicitly, which is exactly what the deployment instructions say
 * to do.
 */
const address = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (value) => BARE_ADDRESS.test(value) || NAMED_ADDRESS.test(value),
      `${label} must be an email address, optionally as "Name <you@example.com>"`,
    )

const serverSchema = z.object({
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is not set'),
  /**
   * The verified sender.
   *
   * **ovioplus.com, not ovioplus.ai.** OvioPlus serves the web from `.ai`
   * (ovioplus.ai, app.ovioplus.ai) but sends mail from `.com`, and only
   * `ovioplus.com` is a verified domain in Resend. Sending from `.ai` fails
   * with `403 The ovioplus.ai domain is not verified`. Do not "correct" this to
   * match the booking URL in src/lib/booking.ts, which is a web address and is
   * right as it is.
   *
   * The restaurant's own domain is not verified yet, so mail goes out from
   * OvioPlus and the visitor's address goes in reply-to. Swap this one variable
   * once lapromessa.it is verified in Resend.
   */
  CONTACT_FROM_EMAIL: address('CONTACT_FROM_EMAIL').default('La Promessa <no-reply@ovioplus.com>'),
  /** Where the restaurant actually reads its mail. */
  CONTACT_TO_EMAIL: address('CONTACT_TO_EMAIL'),
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
