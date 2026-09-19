import type { Hours, Restaurant } from '@/content'
import { BOOKING_URL } from './booking'
import { SITE_URL } from './env'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const

/** schema.org Restaurant. Google reads this for the knowledge panel and hours. */
export function restaurantJsonLd(restaurant: Restaurant, hours: Hours) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    url: SITE_URL,
    telephone: restaurant.phone,
    email: restaurant.email,
    servesCuisine: 'Italian',
    priceRange: '€€€€',
    acceptsReservations: BOOKING_URL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address.street,
      postalCode: restaurant.address.postalCode,
      addressLocality: restaurant.address.city,
      addressCountry: restaurant.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: restaurant.address.lat,
      longitude: restaurant.address.lng,
    },
    openingHoursSpecification: hours.week.flatMap((day) =>
      day.services.map((service) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${DAY_NAMES[day.day]}`,
        opens: service.from,
        closes: service.to,
      })),
    ),
  }
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Static, server-generated object. No user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
