import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ContactForm } from '@/components/contact-form'
import { HoursList } from '@/components/hours-list'
import { PageHeader } from '@/components/page-header'
import { Reveal } from '@/components/reveal'
import { getHours, getRestaurant, images } from '@/content'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.contact' })
  return { title: t('title'), description: t('description') }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, restaurant, hours] = await Promise.all([getTranslations('contact'), getRestaurant(), getHours()])

  const { address } = restaurant
  const mapQuery = encodeURIComponent(
    `${restaurant.name}, ${address.street}, ${address.postalCode} ${address.city}`,
  )

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} image={images.contact} />

      <section className="px-gutter grid grid-cols-12 gap-y-20 py-24 md:py-36">
        {/* Facts on the left, the form on the right. */}
        <div className="col-span-12 md:col-span-4">
          <Reveal variant="fade">
            <div>
              <p className="t-label">{t('addressLabel')}</p>
              <address className="t-body mt-5 not-italic">
                {address.street}
                <br />
                {address.postalCode} {address.city}
              </address>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-rule t-caption text-cenere mt-5 inline-block"
              >
                {t('mapLink')}
              </a>
            </div>
          </Reveal>

          <Reveal variant="fade" delay={110}>
            <div className="mt-12">
              <p className="t-label">{t('emailLabel')}</p>
              <a href={`mailto:${restaurant.email}`} className="link-rule t-body mt-5 inline-block">
                {restaurant.email}
              </a>
            </div>
          </Reveal>

          <Reveal variant="fade" delay={170}>
            <div className="mt-12">
              <p className="t-label">{t('phoneLabel')}</p>
              <a
                href={`tel:${restaurant.phone.replace(/\s/g, '')}`}
                className="link-rule t-body mt-5 inline-block"
              >
                {restaurant.phone}
              </a>
            </div>
          </Reveal>

          <Reveal variant="fade" delay={230}>
            <div className="mt-12">
              <p className="t-label mb-3">{t('hoursLabel')}</p>
              <HoursList hours={hours} />
            </div>
          </Reveal>
        </div>

        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <Reveal variant="fade">
            <h2 className="t-display-m">{t('formTitle')}</h2>
          </Reveal>

          <Reveal variant="fade" delay={100}>
            <p className="t-body text-cenere mt-5 max-w-md">
              {t('bookingNudge')}{' '}
              <Link href="/reservations" className="link-rule text-inchiostro">
                {t('title')}
              </Link>
            </p>
          </Reveal>

          <div className="mt-14">
            <ContactForm restaurantEmail={restaurant.email} />
          </div>
        </div>
      </section>
    </>
  )
}
