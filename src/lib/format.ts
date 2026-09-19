import type { Locale } from '@/i18n/routing'

/** Whole euro, no decimals. Fine dining does not print ",00". */
export function formatPrice(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'it' ? 'it-IT' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/** '2026-08-10' to '10 agosto' / '10 August'. */
export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(`${iso}T12:00:00Z`)
  return new Intl.DateTimeFormat(locale === 'it' ? 'it-IT' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(date)
}

export function formatClosureRange(from: string, to: string, locale: Locale): string {
  const fromDate = new Date(`${from}T12:00:00Z`)
  const toDate = new Date(`${to}T12:00:00Z`)
  const sameYear = fromDate.getUTCFullYear() === toDate.getUTCFullYear()
  const tail = new Intl.DateTimeFormat(locale === 'it' ? 'it-IT' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: sameYear ? undefined : 'numeric',
    timeZone: 'UTC',
  }).format(toDate)

  return `${formatDate(from, locale)} / ${tail}`
}
