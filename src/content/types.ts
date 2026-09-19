import type { Locale } from '@/i18n/routing'

/** A string that exists in every supported locale. */
export type Localized = Readonly<Record<Locale, string>>

/** Resolve a bilingual field for the active locale. */
export function localized(value: Localized, locale: Locale): string {
  return value[locale]
}

/**
 * The 14 allergens EU Regulation 1169/2011 requires a food business to declare.
 * These are keys only: the human labels live in the translation files, because
 * the vocabulary is fixed by law and must not be editable per-restaurant.
 */
export const ALLERGENS = [
  'gluten',
  'crustaceans',
  'eggs',
  'fish',
  'peanuts',
  'soy',
  'milk',
  'nuts',
  'celery',
  'mustard',
  'sesame',
  'sulphites',
  'lupin',
  'molluscs',
] as const

export type Allergen = (typeof ALLERGENS)[number]

export type Dish = {
  id: string
  name: Localized
  description: Localized
  /** In euro. Null for dishes only served inside a tasting menu. */
  price: number | null
  allergens: readonly Allergen[]
  signature?: boolean
}

export type MenuSection = {
  id: string
  title: Localized
  dishes: readonly Dish[]
}

export type TastingMenu = {
  id: string
  name: Localized
  description: Localized
  courses: number
  price: number
  /** Optional wine pairing supplement, in euro. */
  pairingPrice?: number
}

export type Menu = {
  sections: readonly MenuSection[]
  tastingMenus: readonly TastingMenu[]
  /** Shown under the menu: cover charge, sourcing note, allergen advice. */
  notes: readonly Localized[]
}

/** 0 = Sunday, matching Date.prototype.getDay(). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type Service = {
  /** e.g. '19:30' */
  from: string
  to: string
  label: Localized
}

export type DayHours = {
  day: Weekday
  services: readonly Service[]
}

export type SpecialClosure = {
  id: string
  /** ISO dates, inclusive. */
  from: string
  to: string
  reason: Localized
}

export type Hours = {
  week: readonly DayHours[]
  closures: readonly SpecialClosure[]
}

export type GalleryImage = {
  id: string
  src: string
  alt: Localized
  caption?: Localized
  /** Drives the masonry rhythm: portrait images get more vertical room. */
  orientation: 'portrait' | 'landscape' | 'square'
}

export type Restaurant = {
  name: string
  legalName: string
  tagline: Localized
  /** The one-paragraph statement on the home page. */
  statement: Localized
  chef: {
    name: string
    role: Localized
    bio: readonly Localized[]
    quote: Localized
    portrait: string
  }
  address: {
    street: string
    postalCode: string
    city: string
    country: string
    /** Used for the maps link and structured data. */
    lat: number
    lng: number
  }
  phone: string
  email: string
  michelinStars: number
  social: {
    instagram?: string
    facebook?: string
  }
}
