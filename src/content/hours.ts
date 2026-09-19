import type { Hours } from './types'

const DINNER = {
  from: '19:30',
  to: '22:00',
  label: { it: 'Cena', en: 'Dinner' },
} as const

const LUNCH = {
  from: '12:30',
  to: '14:00',
  label: { it: 'Pranzo', en: 'Lunch' },
} as const

/**
 * PLACEHOLDER HOURS. Editable from the dashboard in phase 2.
 * Days absent from `week` are closed. Weekday numbering matches Date#getDay(),
 * so 0 is Sunday.
 */
export const hours: Hours = {
  week: [
    { day: 2, services: [DINNER] },
    { day: 3, services: [DINNER] },
    { day: 4, services: [DINNER] },
    { day: 5, services: [LUNCH, DINNER] },
    { day: 6, services: [LUNCH, DINNER] },
  ],
  closures: [
    {
      id: 'agosto',
      from: '2026-08-10',
      to: '2026-08-24',
      reason: { it: 'Chiusura estiva', en: 'Summer closing' },
    },
    {
      id: 'festivita',
      from: '2026-12-24',
      to: '2027-01-07',
      reason: { it: 'Chiusura per le festività', en: 'Closed for the holidays' },
    },
  ],
}
