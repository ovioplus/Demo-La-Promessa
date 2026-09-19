import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getRestaurant } from '@/content'
import { contactSchema } from '@/lib/contact-schema'
import { readServerEnv } from '@/lib/env'

export const runtime = 'nodejs'

/**
 * Rate limit, such as it is.
 *
 * A Map in module scope only holds for the lifetime of one serverless
 * instance, so this stops a single visitor hammering the form and nothing
 * more. It is the right amount of machinery for a contact form on a
 * single-restaurant site; if this ever needs to be real, the platform repo
 * already has the Upstash setup to copy.
 */
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 3
const seen = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const hits = (seen.get(ip) ?? []).filter((at) => now - at < WINDOW_MS)
  hits.push(now)
  seen.set(ip, hits)

  // Keep the map from growing without bound on a long-lived instance.
  if (seen.size > 500) {
    for (const [key, times] of seen) {
      if (times.every((at) => now - at >= WINDOW_MS)) seen.delete(key)
    }
  }

  return hits.length > MAX_PER_WINDOW
}

export async function POST(request: Request) {
  const env = readServerEnv()
  if (!env.ok) {
    console.error('[contact] environment is not configured:', env.error)
    return NextResponse.json({ error: 'not_configured' }, { status: 500 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
  }

  const { name, email, subject, message, locale, company } = parsed.data

  // Honeypot tripped. Answer 200 so the bot learns nothing.
  if (company) return NextResponse.json({ ok: true })

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  const restaurant = await getRestaurant()
  const resend = new Resend(env.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    /**
     * Sent from an ovioplus.ai address because the restaurant's own domain is
     * not verified in Resend yet. The visitor goes in replyTo, so hitting
     * reply in the inbox still reaches the right person. Once lapromessa.it is
     * verified, change CONTACT_FROM_EMAIL and nothing else.
     */
    from: env.env.CONTACT_FROM_EMAIL,
    to: env.env.CONTACT_TO_EMAIL,
    replyTo: `${name} <${email}>`,
    subject: `[${restaurant.name}] ${subject}`,
    text: [
      `${subject}`,
      '',
      message,
      '',
      '---',
      `${name} <${email}>`,
      `Lingua / language: ${locale}`,
      `IP: ${ip}`,
    ].join('\n'),
    html: emailHtml({ name, email, subject, message, locale, restaurantName: restaurant.name }),
  })

  if (error) {
    console.error('[contact] resend rejected the message:', error)
    return NextResponse.json({ error: 'send_failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function emailHtml(input: {
  name: string
  email: string
  subject: string
  message: string
  locale: string
  restaurantName: string
}): string {
  const body = escapeHtml(input.message).replace(/\n/g, '<br />')

  return `<!doctype html>
<html><body style="margin:0;background:#f1ece4;padding:32px;font-family:Georgia,serif;color:#14110f">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#fff;padding:36px">
    <tr><td>
      <p style="margin:0 0 28px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#a3814e">
        ${escapeHtml(input.restaurantName)}
      </p>
      <h1 style="margin:0 0 24px;font-size:24px;font-weight:400">${escapeHtml(input.subject)}</h1>
      <p style="margin:0 0 28px;font-size:15px;line-height:1.7;font-family:system-ui,sans-serif">${body}</p>
      <hr style="border:none;border-top:1px solid #e7e0d5;margin:28px 0" />
      <p style="margin:0;font-size:13px;line-height:1.7;color:#6b635b;font-family:system-ui,sans-serif">
        ${escapeHtml(input.name)}<br />
        <a href="mailto:${escapeHtml(input.email)}" style="color:#a3814e">${escapeHtml(input.email)}</a><br />
        ${escapeHtml(input.locale.toUpperCase())}
      </p>
    </td></tr>
  </table>
</body></html>`
}
