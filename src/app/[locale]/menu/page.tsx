import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ImageFrame } from '@/components/image-frame'
import { PageHeader } from '@/components/page-header'
import { Reveal } from '@/components/reveal'
import { getMenu, images, localized } from '@/content'
import type { Locale } from '@/i18n/routing'
import { formatPrice } from '@/lib/format'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.menu' })
  return { title: t('title'), description: t('description') }
}

export default async function MenuPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, allergenLabel, menu] = await Promise.all([
    getTranslations('menu'),
    getTranslations('allergens'),
    getMenu(),
  ])

  return (
    <>
      <PageHeader
        eyebrow={t('asideCaption')}
        title={t('title')}
        intro={t('intro')}
        image={images.menuAside}
      />

      {/* Tasting menus first: this is how the room actually eats. */}
      <section className="px-gutter grid grid-cols-12 gap-y-10 py-28 md:py-40">
        <div className="col-span-12 md:col-span-3">
          <Reveal variant="fade">
            <h2 className="t-label">{t('tastingLabel')}</h2>
          </Reveal>
        </div>

        <div className="col-span-12 md:col-span-8 md:col-start-5">
          {menu.tastingMenus.map((tasting, index) => (
            <Reveal key={tasting.id} variant="fade" delay={index * 90}>
              <article className="hairline border-t py-9 last:border-b md:py-12">
                <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                  <h3 className="t-display-m">{localized(tasting.name, locale)}</h3>
                  <p className="t-caption shrink-0 tabular-nums">{formatPrice(tasting.price, locale)}</p>
                </div>

                <p className="t-body text-cenere mt-4 max-w-xl">{localized(tasting.description, locale)}</p>

                <p className="t-caption text-cenere mt-6">
                  {t('courses', { count: tasting.courses })}
                  <span className="mx-3 opacity-35">/</span>
                  {t('wholeTable')}
                  {tasting.pairingPrice ? (
                    <>
                      <span className="mx-3 opacity-35">/</span>
                      {t('pairing', { price: formatPrice(tasting.pairingPrice, locale) })}
                    </>
                  ) : null}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* A la carte. */}
      <section className="px-gutter hairline border-t pt-24 pb-28 md:pt-32 md:pb-40">
        <div className="grid grid-cols-12 gap-y-10">
          <div className="col-span-12 md:col-span-3">
            <Reveal variant="fade">
              <h2 className="t-label">{t('carteLabel')}</h2>
            </Reveal>
          </div>

          <div className="col-span-12 flex flex-col gap-20 md:col-span-8 md:col-start-5 md:gap-28">
            {menu.sections.map((section) => (
              <div key={section.id}>
                <Reveal variant="fade">
                  <h3 className="t-display-s text-cenere mb-2">{localized(section.title, locale)}</h3>
                </Reveal>

                <ul>
                  {section.dishes.map((dish, index) => (
                    <li key={dish.id} className="hairline border-t last:border-b">
                      <Reveal variant="fade" delay={index * 70}>
                        <div className="py-8 md:py-9">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
                            <h4 className="t-display-s max-w-lg">
                              {localized(dish.name, locale)}
                              {dish.signature ? (
                                <span className="t-caption text-ottone ml-4 align-middle">
                                  {t('signature')}
                                </span>
                              ) : null}
                            </h4>
                            {dish.price !== null ? (
                              <p className="t-caption text-cenere shrink-0 tabular-nums">
                                {formatPrice(dish.price, locale)}
                              </p>
                            ) : null}
                          </div>

                          <p className="t-body text-cenere mt-2 max-w-md">
                            {localized(dish.description, locale)}
                          </p>

                          {dish.allergens.length > 0 ? (
                            <p className="t-caption text-cenere/70 mt-5">
                              <span className="sr-only">{t('allergensLabel')}: </span>
                              {dish.allergens.map((allergen, i) => (
                                <span key={allergen}>
                                  {i > 0 ? <span className="mx-2 opacity-40">·</span> : null}
                                  {allergenLabel(allergen)}
                                </span>
                              ))}
                            </p>
                          ) : null}
                        </div>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notes and the legal allergen line. */}
      <section className="px-gutter hairline grid grid-cols-12 gap-y-12 border-t py-20 md:py-24">
        <div className="col-span-12 md:col-span-3">
          <p className="t-label">{t('notesLabel')}</p>
        </div>

        <div className="col-span-12 md:col-span-8 md:col-start-5">
          <ul className="flex flex-col gap-4">
            {menu.notes.map((note, index) => (
              <li key={index} className="t-body text-cenere max-w-2xl">
                {localized(note, locale)}
              </li>
            ))}
          </ul>
          <p className="t-caption text-cenere/60 mt-10">{t('allergensLegend')}</p>
        </div>
      </section>

      <section className="pb-28 md:pb-40">
        <div className="pl-gutter grid grid-cols-12">
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <ImageFrame
              src={images.room}
              alt=""
              ratio="aspect-[16/10]"
              sizes="(max-width: 768px) 100vw, 58vw"
            />
          </div>
        </div>
      </section>
    </>
  )
}
