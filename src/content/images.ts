import type { GalleryImage } from './types'

/**
 * ============================================================================
 * SINGLE SWAP POINT FOR PHOTOGRAPHY.
 * ============================================================================
 * Every image on the site is referenced from here, and the files live in
 * /public/images. To hand the site its real photography, drop the client's
 * files in under these same names and change nothing else.
 *
 * The current files are placeholders under the Unsplash License (free for
 * commercial use, no attribution required). They were chosen to hold one
 * consistent register: dark, warm, a single light source, no cold blues. They
 * are NOT the restaurant, and the alt text describes the placeholder rather
 * than the real dish, so it must be rewritten with the real photographs.
 * ============================================================================
 */

export const images = {
  /** Home hero, behind the seal. */
  hero: '/images/hero.jpg',
  chef: '/images/chef.jpg',
  room: '/images/room.jpg',
  /** Menu page header: hands at the pass. */
  menuAside: '/images/plating.jpg',
  reservations: '/images/reservations.jpg',
  contact: '/images/contact.jpg',
  homeDishPrimary: '/images/dessert.jpg',
  homeDishSecondary: '/images/course-meat.jpg',
} as const

export const gallery: readonly GalleryImage[] = [
  {
    id: 'plating',
    src: '/images/plating.jpg',
    alt: { it: 'Una mano finisce un piatto al passaggio', en: 'A hand finishing a plate at the pass' },
    caption: { it: 'Il passaggio', en: 'The pass' },
    orientation: 'portrait',
  },
  {
    id: 'room',
    src: '/images/room.jpg',
    alt: { it: 'La sala prima del servizio', en: 'The dining room before service' },
    caption: { it: 'Ventidue coperti', en: 'Twenty-two covers' },
    orientation: 'landscape',
  },
  {
    id: 'dessert',
    src: '/images/dessert.jpg',
    alt: { it: 'Un dolce al piatto su fondo scuro', en: 'A plated dessert against a dark ground' },
    orientation: 'square',
  },
  {
    id: 'chef',
    src: '/images/chef.jpg',
    alt: { it: 'Lo chef al lavoro in cucina', en: 'The chef at work in the kitchen' },
    caption: { it: 'Le sei del pomeriggio', en: 'Six in the afternoon' },
    orientation: 'portrait',
  },
  {
    id: 'course-meat',
    src: '/images/course-meat.jpg',
    alt: { it: 'Un secondo di carne', en: 'A meat course' },
    orientation: 'landscape',
  },
  {
    id: 'bowl',
    src: '/images/bowl.jpg',
    alt: {
      it: 'Un dolce al cucchiaio in una ciotola di ceramica',
      en: 'A spooned dessert in a ceramic bowl',
    },
    caption: { it: 'Stagione breve', en: 'A short season' },
    orientation: 'portrait',
  },
  {
    id: 'course-green',
    src: '/images/course-green.jpg',
    alt: { it: 'Un piatto vegetale', en: 'A vegetable course' },
    orientation: 'square',
  },
  {
    id: 'produce',
    src: '/images/produce.jpg',
    alt: { it: 'Melograni aperti sul banco', en: 'Split pomegranates on the bench' },
    caption: { it: 'Quello che è arrivato stamattina', en: 'Whatever arrived this morning' },
    orientation: 'landscape',
  },
  {
    id: 'evening',
    src: '/images/reservations.jpg',
    alt: { it: 'La sala illuminata a candela', en: 'The room by candlelight' },
    orientation: 'portrait',
  },
]
