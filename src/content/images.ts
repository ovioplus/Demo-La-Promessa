import type { StaticImageData } from 'next/image'
import bowl from '../../public/images/bowl.jpg'
import chef from '../../public/images/chef.jpg'
import contact from '../../public/images/contact.jpg'
import courseGreen from '../../public/images/course-green.jpg'
import courseMeat from '../../public/images/course-meat.jpg'
import dessert from '../../public/images/dessert.jpg'
import hero from '../../public/images/hero.jpg'
import plating from '../../public/images/plating.jpg'
import produce from '../../public/images/produce.jpg'
import reservations from '../../public/images/reservations.jpg'
import room from '../../public/images/room.jpg'
import type { GalleryImage } from './types'

/**
 * ============================================================================
 * SINGLE SWAP POINT FOR PHOTOGRAPHY.
 * ============================================================================
 * Every image on the site is referenced from here, and the files live in
 * /public/images. To hand the site its real photography, drop the client's
 * files in under these same names and change nothing else.
 *
 * They are imported rather than referenced by path string on purpose: a static
 * import makes Next generate a tiny blurred placeholder and the intrinsic
 * dimensions at build time. Without that, a photograph that has not finished
 * loading is a blank rectangle, which is what made the gallery feel slow.
 *
 * The current files are placeholders under the Unsplash License (free for
 * commercial use, no attribution required), chosen to hold one register: dark,
 * warm, a single light source, no cold blues. They are NOT the restaurant, and
 * the alt text describes the placeholder rather than the real dish, so it must
 * be rewritten with the real photographs.
 * ============================================================================
 */

export const images = {
  /** Home hero, behind the seal. */
  hero,
  chef,
  room,
  /** Menu page header: hands at the pass. */
  menuAside: plating,
  reservations,
  contact,
  homeDishPrimary: dessert,
  homeDishSecondary: courseMeat,
} satisfies Record<string, StaticImageData>

export const gallery: readonly GalleryImage[] = [
  {
    id: 'plating',
    src: plating,
    alt: { it: 'Una mano finisce un piatto al passaggio', en: 'A hand finishing a plate at the pass' },
    caption: { it: 'Il passaggio', en: 'The pass' },
    orientation: 'portrait',
  },
  {
    id: 'room',
    src: room,
    alt: { it: 'La sala prima del servizio', en: 'The dining room before service' },
    caption: { it: 'Ventidue coperti', en: 'Twenty-two covers' },
    orientation: 'landscape',
  },
  {
    id: 'dessert',
    src: dessert,
    alt: { it: 'Un dolce al piatto su fondo scuro', en: 'A plated dessert against a dark ground' },
    orientation: 'square',
  },
  {
    id: 'chef',
    src: chef,
    alt: { it: 'Lo chef al lavoro in cucina', en: 'The chef at work in the kitchen' },
    caption: { it: 'Le sei del pomeriggio', en: 'Six in the afternoon' },
    orientation: 'portrait',
  },
  {
    id: 'course-meat',
    src: courseMeat,
    alt: { it: 'Un secondo di carne', en: 'A meat course' },
    orientation: 'landscape',
  },
  {
    id: 'bowl',
    src: bowl,
    alt: { it: 'Un dolce al cucchiaio in una ciotola di ceramica', en: 'A spooned dessert in a ceramic bowl' },
    caption: { it: 'Stagione breve', en: 'A short season' },
    orientation: 'portrait',
  },
  {
    id: 'course-green',
    src: courseGreen,
    alt: { it: 'Un piatto vegetale', en: 'A vegetable course' },
    orientation: 'square',
  },
  {
    id: 'produce',
    src: produce,
    alt: { it: 'Melograni aperti sul banco', en: 'Split pomegranates on the bench' },
    caption: { it: 'Quello che è arrivato stamattina', en: 'Whatever arrived this morning' },
    orientation: 'landscape',
  },
  {
    id: 'evening',
    src: reservations,
    alt: { it: 'La sala illuminata a candela', en: 'The room by candlelight' },
    orientation: 'portrait',
  },
]
