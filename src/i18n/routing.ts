import { defineRouting } from 'next-intl/routing'

export const LOCALES = ['it', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'it'

/**
 * Italian is the default and lives at the bare path (`/`, `/menu`); English is
 * prefixed (`/en`, `/en/menu`). Slugs are localised so the Italian site reads as
 * an Italian site: internally we always route by the English key (`/story`) and
 * next-intl rewrites it to `/la-storia` for `it`.
 *
 * This diverges from ovioplus-platform, which picks the locale from a cookie with
 * no URL prefix. That is right for an app behind a login and wrong here: a public
 * site needs a distinct, shareable, indexable URL per language.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  /**
   * Off deliberately. With detection on, next-intl reads Accept-Language and
   * bounces an English browser from `/` to `/en`, so the Italian home page is
   * never what an Italian-default site actually serves. `/` is Italian for
   * everyone; English is a choice the visitor makes, and it sticks.
   */
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/menu': { it: '/menu', en: '/menu' },
    '/story': { it: '/la-storia', en: '/story' },
    '/gallery': { it: '/galleria', en: '/gallery' },
    '/reservations': { it: '/prenota', en: '/reservations' },
    '/contact': { it: '/contatti', en: '/contact' },
  },
})

export type AppPathname = keyof typeof routing.pathnames
