import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Card } from '@/features/dashboard/components/fields'
import { getHoursForAdmin, getMenuForAdmin } from '@/features/dashboard/queries'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

export const metadata: Metadata = { robots: { index: false, follow: false } }

/**
 * Never prerendered. The ancestor [locale] segment has generateStaticParams, so
 * without this the dashboard is built as static HTML and whatever the build saw
 * (an anonymous visitor, therefore a redirect to sign-in) gets baked in for
 * everyone. Declared per page because the layout's own setting loses to the
 * ancestor's static generation.
 */
export const dynamic = 'force-dynamic'

export default async function DashboardOverviewPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, menu, hours] = await Promise.all([
    getTranslations('dashboard.overview'),
    getMenuForAdmin(),
    getHoursForAdmin(),
  ])

  const dishCount = menu.sections.reduce((total, section) => total + section.dishes.length, 0)
  const openDays = new Set(hours.services.map((service) => service.weekday)).size

  return (
    <div>
      <h1 className="t-display-l">{t('greeting')}</h1>
      <p className="t-body mt-6 max-w-xl text-cenere">{t('intro')}</p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        <Card>
          <h2 className="t-display-s">{t('menuCard')}</h2>
          <p className="t-body mt-3 text-cenere">
            {t('menuCardBody', {
              sections: menu.sections.length,
              dishes: dishCount,
              tasting: menu.tastingMenus.length,
            })}
          </p>
          <Link href="/dashboard/menu" className="link-rule t-caption mt-7 inline-block">
            {t('open')}
          </Link>
        </Card>

        <Card>
          <h2 className="t-display-s">{t('hoursCard')}</h2>
          <p className="t-body mt-3 text-cenere">
            {t('hoursCardBody', { days: openDays, closures: hours.closures.length })}
          </p>
          <Link href="/dashboard/hours" className="link-rule t-caption mt-7 inline-block">
            {t('open')}
          </Link>
        </Card>
      </div>
    </div>
  )
}
