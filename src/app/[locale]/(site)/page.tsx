import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { BookButton } from '@/components/book-button'
import { HoursList } from '@/components/hours-list'
import { ImageFrame } from '@/components/image-frame'
import { Reveal } from '@/components/reveal'
import { HeroSeal } from '@/components/seal/hero-seal'
import { getHours, getMenu, getRestaurant, images, localized } from '@/content'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { formatPrice } from '@/lib/format'
import { JsonLd, restaurantJsonLd } from '@/lib/seo'

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, restaurant, menu, hours] = await Promise.all([
    getTranslations('home'),
    getRestaurant(),
    getMenu(),
    getHours(),
  ])

  const signatures = menu.sections.flatMap((section) => section.dishes).filter((dish) => dish.signature)

  return (
    <>
      <JsonLd data={restaurantJsonLd(restaurant, hours)} />

      {/* ---------------------------------------------------------------- */}
      {/* Hero. The seal sits high and right, the name low and left: the two  */}
      {/* never contend for the same optical centre.                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-notte text-gesso relative isolate flex min-h-svh flex-col justify-end overflow-hidden">
        <Image src={images.hero} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
        <div
          aria-hidden
          className="from-notte/85 via-notte/40 to-notte/95 absolute inset-0 bg-gradient-to-br"
        />

        <div className="pointer-events-none absolute top-[18%] right-[6vw] w-[52vw] max-w-[200px] md:top-1/2 md:w-[34vw] md:max-w-[440px] md:-translate-y-[62%]">
          <HeroSeal className="aspect-square w-full" />
        </div>

        <div className="px-gutter relative pt-48 pb-14 md:pb-20">
          <Reveal variant="fade">
            <p className="t-label">{t('heroEyebrow')}</p>
          </Reveal>

          <Reveal variant="mask" className="mt-7">
            <h1 className="t-display-xl">{restaurant.name}</h1>
          </Reveal>

          <Reveal variant="fade" delay={320}>
            <p className="t-body text-gesso/55 mt-8 max-w-xs">{localized(restaurant.tagline, locale)}</p>
          </Reveal>
        </div>

        <div className="px-gutter relative flex items-center gap-4 pb-10">
          <span aria-hidden className="bg-gesso/25 h-10 w-px" />
          <span className="t-caption text-gesso/35">{t('heroScroll')}</span>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* The statement. One paragraph, one screen. This is the restraint    */}
      {/* move, and it is the cheapest expensive thing on the site.          */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-gutter grid grid-cols-12 py-36 md:py-56">
        <div className="col-span-12 md:col-span-9 md:col-start-3 lg:col-span-7 lg:col-start-4">
          <Reveal variant="fade">
            <p className="t-label mb-10">{t('statementLabel')}</p>
          </Reveal>
          <Reveal variant="fade" delay={140}>
            <p className="t-lead text-balance">{localized(restaurant.statement, locale)}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Two dishes. The tall one runs off the left edge, the small one     */}
      {/* drops well below it. Deliberately not a grid of equal cards.       */}
      {/* ---------------------------------------------------------------- */}
      <section className="pb-32 md:pb-48">
        <div className="pr-gutter grid grid-cols-12 gap-x-5">
          <div className="col-span-10 md:col-span-7">
            <ImageFrame
              src={images.homeDishPrimary}
              alt=""
              ratio="aspect-[4/5] md:aspect-[5/6]"
              sizes="(max-width: 768px) 84vw, 58vw"
            />
          </div>

          <div className="col-span-9 col-start-4 mt-16 md:col-span-4 md:col-start-9 md:mt-[16vw]">
            <p className="t-label mb-6">{t('dishesLabel')}</p>
            <ImageFrame
              src={images.homeDishSecondary}
              alt=""
              ratio="aspect-[4/5]"
              sizes="(max-width: 768px) 72vw, 33vw"
              delay={120}
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* The chef. Portrait bleeding off the left, text held against it.    */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-gesso-deep grid grid-cols-12 items-center gap-y-14 py-24 md:py-0">
        <div className="col-span-12 md:col-span-5">
          <Reveal variant="none" className="relative min-h-[62vh] w-full overflow-hidden md:min-h-[86vh]">
            <div className="reveal-clip absolute inset-0">
              <Image
                src={images.chef}
                alt={restaurant.chef.name}
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="px-gutter col-span-12 md:col-span-6 md:col-start-7 md:px-0 md:pr-[var(--spacing-gutter)]">
          <Reveal variant="fade">
            <p className="t-label mb-9">{t('chefLabel')}</p>
          </Reveal>

          <Reveal variant="fade" delay={120}>
            <blockquote className="t-display-m italic">
              &ldquo;{localized(restaurant.chef.quote, locale)}&rdquo;
            </blockquote>
          </Reveal>

          <Reveal variant="fade" delay={220}>
            <p className="t-caption text-cenere mt-9">
              {restaurant.chef.name} <span className="opacity-40">/</span>{' '}
              {localized(restaurant.chef.role, locale)}
            </p>
          </Reveal>

          <Reveal variant="fade" delay={300}>
            <Link href="/story" className="link-rule t-caption mt-12 inline-block">
              {t('chefCta')}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* The menu, withheld. Three dishes set like a printed card.          */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-gutter grid grid-cols-12 gap-y-12 py-32 md:py-48">
        <div className="col-span-12 md:col-span-3">
          <Reveal variant="fade">
            <p className="t-label">{t('menuLabel')}</p>
          </Reveal>
          <Reveal variant="fade" delay={100}>
            <p className="t-body text-cenere mt-6 max-w-xs">{t('menuIntro')}</p>
          </Reveal>
        </div>

        <ul className="col-span-12 md:col-span-8 md:col-start-5">
          {signatures.map((dish, index) => (
            <li key={dish.id} className="hairline border-t last:border-b">
              <Reveal variant="fade" delay={index * 90}>
                <div className="flex items-baseline justify-between gap-8 py-8 md:py-10">
                  <div>
                    <p className="t-display-s">{localized(dish.name, locale)}</p>
                    <p className="t-body text-cenere mt-2 max-w-md">{localized(dish.description, locale)}</p>
                  </div>
                  {dish.price !== null ? (
                    <span className="t-caption text-cenere shrink-0 tabular-nums">
                      {formatPrice(dish.price, locale)}
                    </span>
                  ) : null}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="col-span-12 md:col-span-8 md:col-start-5">
          <Reveal variant="fade">
            <Link href="/menu" className="link-rule t-caption mt-10 inline-block">
              {t('menuCta')}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Hours and place. Small, quiet, structural.                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-gutter hairline grid grid-cols-12 gap-y-14 border-t py-24 md:py-28">
        <div className="col-span-12 md:col-span-4">
          <p className="t-label">{t('whereLabel')}</p>
          <address className="t-body text-cenere mt-6 not-italic">
            {restaurant.address.street}
            <br />
            {restaurant.address.postalCode} {restaurant.address.city}
          </address>
          <Link href="/contact" className="link-rule t-caption mt-8 inline-block">
            {restaurant.phone}
          </Link>
        </div>

        <div className="col-span-12 md:col-span-5 md:col-start-8">
          <p className="t-label mb-4">{t('hoursLabel')}</p>
          <HoursList hours={hours} />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* The close. The only real button on the page.                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-notte text-gesso relative isolate overflow-hidden">
        <Image src={images.reservations} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div aria-hidden className="from-notte via-notte/70 to-notte/85 absolute inset-0 bg-gradient-to-t" />

        <div className="px-gutter relative grid grid-cols-12 py-36 md:py-52">
          <div className="col-span-12 md:col-span-7">
            <Reveal variant="mask">
              <h2 className="t-display-l">{t('reserveTitle')}</h2>
            </Reveal>
            <Reveal variant="fade" delay={220}>
              <p className="t-body text-gesso/55 mt-9 max-w-md">{t('reserveBody')}</p>
            </Reveal>
            <Reveal variant="fade" delay={320}>
              <div className="mt-12 flex flex-wrap items-center gap-8">
                <BookButton label={t('reserveCta')} tone="solid" />
                <Link href="/reservations" className="link-rule t-caption text-gesso/60">
                  {t('hoursLabel')}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
