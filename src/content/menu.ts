import type { Menu } from './types'

/**
 * PLACEHOLDER MENU. Plausible one-star Italian cooking, invented for the demo.
 * In phase 2 this whole object is replaced by rows from Postgres and edited
 * from the dashboard; the shape stays identical, so nothing downstream changes.
 *
 * Allergens are legally required (EU 1169/2011) and are therefore part of the
 * Dish type rather than a free-text note. Keep them accurate when you swap in
 * the real dishes.
 */
export const menu: Menu = {
  tastingMenus: [
    {
      id: 'la-promessa',
      name: { it: 'La Promessa', en: 'La Promessa' },
      description: {
        it: 'Il percorso completo. Nove portate che raccontano dove siamo adesso, riscritte quando il mercato lo impone.',
        en: 'The full path. Nine courses describing where we are right now, rewritten whenever the market insists.',
      },
      courses: 9,
      price: 185,
      pairingPrice: 95,
    },
    {
      id: 'radici',
      name: { it: 'Radici', en: 'Roots' },
      description: {
        it: 'Sei portate costruite solo su prodotti entro cento chilometri da questa cucina.',
        en: 'Six courses built only on produce from within a hundred kilometres of this kitchen.',
      },
      courses: 6,
      price: 140,
      pairingPrice: 70,
    },
    {
      id: 'orto',
      name: { it: 'Orto', en: 'Garden' },
      description: {
        it: 'Interamente vegetale. Non una versione ridotta degli altri menu, ma un menu a sé.',
        en: 'Entirely plant based. Not a reduced version of the others, but a menu of its own.',
      },
      courses: 6,
      price: 125,
      pairingPrice: 70,
    },
  ],

  sections: [
    {
      id: 'antipasti',
      title: { it: 'Antipasti', en: 'To begin' },
      dishes: [
        {
          id: 'battuta-fassona',
          name: {
            it: 'Battuta di Fassona, ostrica, nocciola',
            en: 'Fassona beef tartare, oyster, hazelnut',
          },
          description: {
            it: 'Coltello, non tritacarne. L’ostrica sta sotto, la nocciola tostata sopra.',
            en: 'Knife cut, never minced. The oyster sits underneath, the toasted hazelnut on top.',
          },
          price: 34,
          allergens: ['molluscs', 'nuts'],
          signature: true,
        },
        {
          id: 'capesante',
          name: {
            it: 'Capasanta, topinambur, limone caviale',
            en: 'Scallop, Jerusalem artichoke, finger lime',
          },
          description: {
            it: 'Scottata da un lato solo, cruda dall’altro.',
            en: 'Seared on one side only, raw on the other.',
          },
          price: 32,
          allergens: ['molluscs'],
        },
        {
          id: 'uovo-63',
          name: {
            it: 'Uovo a 63 gradi, parmigiano 36 mesi, tartufo nero',
            en: 'Egg at 63 degrees, 36-month Parmigiano, black truffle',
          },
          description: {
            it: 'Tre ingredienti, nessun posto dove nascondersi.',
            en: 'Three ingredients and nowhere to hide.',
          },
          price: 30,
          allergens: ['eggs', 'milk'],
        },
      ],
    },
    {
      id: 'primi',
      title: { it: 'Primi', en: 'Pasta and rice' },
      dishes: [
        {
          id: 'tortelli-coda',
          name: {
            it: 'Tortelli di coda alla vaccinara, sedano, pecorino',
            en: 'Oxtail tortelli, celery, pecorino',
          },
          description: {
            it: 'La coda cuoce sei ore. La pasta si tira al momento.',
            en: 'The oxtail cooks for six hours. The pasta is rolled to order.',
          },
          price: 36,
          allergens: ['gluten', 'eggs', 'milk', 'celery'],
          signature: true,
        },
        {
          id: 'risotto-pomodoro',
          name: {
            it: 'Risotto all’acqua di pomodoro, basilico bruciato',
            en: 'Risotto in tomato water, burnt basil',
          },
          description: {
            it: 'Bianco nel piatto, rosso al palato.',
            en: 'White on the plate, red on the palate.',
          },
          price: 34,
          allergens: ['milk', 'sulphites'],
        },
        {
          id: 'spaghetto-alghe',
          name: {
            it: 'Spaghetto al burro di alghe, ricci di mare',
            en: 'Spaghetti, seaweed butter, sea urchin',
          },
          description: {
            it: 'Disponibile solo quando i ricci sono quelli giusti.',
            en: 'Served only when the urchins are the right ones.',
          },
          price: 38,
          allergens: ['gluten', 'milk', 'fish'],
        },
      ],
    },
    {
      id: 'secondi',
      title: { it: 'Secondi', en: 'Main courses' },
      dishes: [
        {
          id: 'piccione',
          name: {
            it: 'Piccione, ciliegia, foglie di fico',
            en: 'Pigeon, cherry, fig leaf',
          },
          description: {
            it: 'Petto rosa, coscia glassata, il resto in salsa.',
            en: 'Breast kept pink, leg glazed, everything else in the sauce.',
          },
          price: 46,
          allergens: ['sulphites'],
          signature: true,
        },
        {
          id: 'rombo',
          name: {
            it: 'Rombo, burro nocciola, capperi di Pantelleria',
            en: 'Turbot, brown butter, Pantelleria capers',
          },
          description: {
            it: 'Cotto sulla lisca, servito intero per due.',
            en: 'Cooked on the bone, served whole for two.',
          },
          price: 44,
          allergens: ['fish', 'milk'],
        },
        {
          id: 'agnello',
          name: {
            it: 'Agnello, melanzana affumicata, menta',
            en: 'Lamb, smoked aubergine, mint',
          },
          description: {
            it: 'Allevato a venti minuti da qui.',
            en: 'Raised twenty minutes from here.',
          },
          price: 42,
          allergens: ['milk'],
        },
      ],
    },
    {
      id: 'dolci',
      title: { it: 'Dolci', en: 'To finish' },
      dishes: [
        {
          id: 'zabaione',
          name: {
            it: 'Zabaione, caffè, cacao',
            en: 'Zabaione, coffee, cocoa',
          },
          description: {
            it: 'Montato in sala, come si faceva.',
            en: 'Whipped at the table, the way it used to be done.',
          },
          price: 18,
          allergens: ['eggs', 'milk', 'sulphites'],
        },
        {
          id: 'pesca-verbena',
          name: {
            it: 'Pesca, verbena, mandorla',
            en: 'Peach, verbena, almond',
          },
          description: {
            it: 'Da luglio a settembre, poi sparisce.',
            en: 'July to September, then it disappears.',
          },
          price: 16,
          allergens: ['nuts', 'milk'],
        },
        {
          id: 'cioccolato-modica',
          name: {
            it: 'Cioccolato di Modica, olio nuovo, sale',
            en: 'Modica chocolate, new-harvest oil, salt',
          },
          description: {
            it: 'Tre cose che non hanno bisogno di una quarta.',
            en: 'Three things that do not need a fourth.',
          },
          price: 16,
          allergens: ['milk', 'soy'],
        },
      ],
    },
  ],

  notes: [
    {
      it: 'Il menu cambia con il mercato. Alcuni piatti restano per una settimana, altri per una sera.',
      en: 'The menu follows the market. Some dishes stay for a week, some for one evening.',
    },
    {
      it: 'Informateci di allergie o intolleranze al momento della prenotazione: possiamo riscrivere quasi tutto, se lo sappiamo per tempo.',
      en: 'Tell us about allergies or intolerances when you book. We can rewrite almost anything, given notice.',
    },
    {
      it: 'I menu degustazione sono serviti per l’intero tavolo.',
      en: 'Tasting menus are served for the whole table.',
    },
  ],
}
