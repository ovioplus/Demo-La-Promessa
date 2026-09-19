import type { Restaurant } from './types'

/**
 * ============================================================================
 * PLACEHOLDER CONTENT. Replace before the client sees this in production.
 * ============================================================================
 * Everything in this file is invented to make the demo read as a real
 * restaurant. Swap these values and the whole site updates:
 *
 *   - chef.name, chef.role, chef.bio, chef.quote
 *   - address (street, postalCode, city, lat, lng)
 *   - phone, email, social handles
 *   - michelinStars
 *
 * The photography lives in src/content/images.ts, not here.
 * ============================================================================
 */
export const restaurant: Restaurant = {
  name: 'La Promessa',
  legalName: 'La Promessa S.r.l.',

  tagline: {
    it: 'Cucina italiana contemporanea',
    en: 'Contemporary Italian cooking',
  },

  statement: {
    it: 'Una promessa si mantiene due volte al giorno, per pochi coperti, con quello che il mercato ha deciso quella mattina. Non serve altro.',
    en: 'A promise is kept twice a day, for a handful of covers, with whatever the market decided that morning. Nothing else is required.',
  },

  chef: {
    name: 'Matteo Ferrante', // PLACEHOLDER
    role: {
      it: 'Chef e proprietario',
      en: 'Chef and owner',
    },
    bio: [
      {
        it: 'Matteo Ferrante è cresciuto nella trattoria di famiglia, dove a undici anni gli fu affidato il compito meno glorioso e più istruttivo della cucina: pulire il pesce. Dice ancora che tutto quello che sa lo ha imparato in quei pomeriggi.',
        en: 'Matteo Ferrante grew up in his family trattoria, where at eleven he was handed the least glamorous and most instructive job in the kitchen: cleaning the fish. He still says everything he knows came from those afternoons.',
      },
      {
        it: 'Dopo dodici anni tra Parigi, Copenaghen e San Sebastián è tornato in Italia con una sola idea fissa: una sala piccola, un menu corto, nessun compromesso sulla materia prima. La Promessa ha aperto nel 2019 con ventidue coperti e li ha ancora tutti.',
        en: 'After twelve years between Paris, Copenhagen and San Sebastián he came back to Italy with one fixed idea: a small room, a short menu, no compromise on the raw material. La Promessa opened in 2019 with twenty-two covers and still has exactly that many.',
      },
      {
        it: 'La stella è arrivata nel 2022. In cucina non è cambiato niente, se non il numero di persone che chiamano.',
        en: 'The star arrived in 2022. Nothing changed in the kitchen except the number of people calling.',
      },
    ],
    quote: {
      it: 'Non cucino per stupire. Cucino perché qualcuno si ricordi di una sera.',
      en: 'I do not cook to astonish. I cook so that someone remembers an evening.',
    },
    portrait: '/images/chef.jpg',
  },

  address: {
    street: 'Via delle Caldaie 18', // PLACEHOLDER
    postalCode: '50125',
    city: 'Firenze',
    country: 'IT',
    lat: 43.7663,
    lng: 11.2478,
  },

  phone: '+39 055 018 4420', // PLACEHOLDER
  email: 'info@lapromessa.it', // PLACEHOLDER
  michelinStars: 1,

  social: {
    instagram: 'lapromessa.firenze', // PLACEHOLDER
  },
}
