import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BookButton } from '@/components/book-button'
import { HoursList } from '@/components/hours-list'
import { PageHeader } from '@/components/page-header'
import { Reveal } from '@/components/reveal'
import { getHours, getRestaurant, images, localized } from '@/content'
import type { Locale } from '@/i18n/routing'
import { formatClosureRange } from '@/lib/format'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.reservations' })
  return { title: t('title'), description: t('description') }
}

const POLICY_KEYS = ['release', 'table', 'diet', 'cancel', 'late'] as const

/**
 * Reservations is a page, not just an outbound link.
 *
 * Every restaurant at this level has a booking policy, and stating it with
 * some dignity before handing off is both more credible and more useful than a
 * bare button. The handoff itself is the only line of this project that knows
 * OvioPlus exists (see src/lib/booking.ts).
 */
export default async function ReservationsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, restaurant, hours] = await Promise.all([
    getTranslations('reservations'),
    getRestaurant(),
    getHours(),
  ])

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} image={images.reservations} />

      <section className="px-gutter grid grid-cols-12 gap-y-16 py-24 md:py-36">
        {/* The handoff. */}
        <div className="col-span-12 md:col-span-5">
          <Reveal variant="fade">
            <BookButton label={t('ctaLabel')} className="w-full sm:w-auto" />
          </Reveal>
          <Reveal variant="fade" delay={120}>
            <p className="t-body text-cenere mt-6 max-w-sm">{t('ctaNote')}</p>
          </Reveal>

          <Reveal variant="fade" delay={200}>
            <div className="hairline mt-14 border-t pt-8">
              <p className="t-label">{t('phoneLabel')}</p>
              <a
                href={`tel:${restaurant.phone.replace(/\s/g, '')}`}
                className="link-rule t-display-s mt-5 inline-block"
              >
                {restaurant.phone}
              </a>
              <p className="t-caption text-cenere mt-5">{t('phoneNote')}</p>
            </div>
          </Reveal>
        </div>

        {/* Hours and closures. */}
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <Reveal variant="fade">
            <h2 className="t-label mb-5">{t('hoursTitle')}</h2>
          </Reveal>
          <Reveal variant="fade" delay={100}>
            <HoursList hours={hours} />
          </Reveal>

          {hours.closures.length > 0 ? (
            <Reveal variant="fade" delay={180}>
              <div className="mt-14">
                <h2 className="t-label mb-5">{t('closuresTitle')}</h2>
                <dl>
                  {hours.closures.map((closure) => (
                    <div
                      key={closure.id}
                      className="hairline flex items-baseline justify-between gap-6 border-b py-3.5 last:border-b-0"
                    >
                      <dt className="t-caption">{localized(closure.reason, locale)}</dt>
                      <dd className="t-caption text-cenere text-right tabular-nums">
                        {formatClosureRange(closure.from, closure.to, locale)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* The policy. */}
      <section className="px-gutter hairline grid grid-cols-12 gap-y-10 border-t py-20 md:py-28">
        <div className="col-span-12 md:col-span-3">
          <h2 className="t-label">{t('policyTitle')}</h2>
        </div>

        <ol className="col-span-12 md:col-span-8 md:col-start-5">
          {POLICY_KEYS.map((key, index) => (
            <li key={key} className="hairline border-t last:border-b">
              <Reveal variant="fade" delay={index * 70}>
                <div className="flex gap-8 py-7">
                  <span className="t-caption text-ottone shrink-0 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="t-body max-w-xl">{t(`policy.${key}`)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
