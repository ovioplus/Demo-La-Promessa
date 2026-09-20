import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ActionButton } from '@/features/dashboard/components/action-button'
import { ClosureEditor, WeekEditor } from '@/features/dashboard/components/hours-editors'
import { createClosure } from '@/features/dashboard/actions'
import { getHoursForAdmin } from '@/features/dashboard/queries'
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

export default async function DashboardHoursPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, hours] = await Promise.all([getTranslations('dashboard.hours'), getHoursForAdmin()])

  return (
    <div>
      <h1 className="t-display-l">{t('title')}</h1>
      <p className="t-body mt-6 max-w-xl text-cenere">{t('intro')}</p>

      <section className="mt-14">
        <h2 className="t-label mb-5">{t('weekTitle')}</h2>
        <WeekEditor services={hours.services} />
      </section>

      <section className="mt-16">
        <h2 className="t-label mb-5">{t('closuresTitle')}</h2>
        <div className="flex flex-col gap-5">
          {hours.closures.map((closure) => (
            <ClosureEditor key={closure.id} closure={closure} />
          ))}
        </div>
        <div className="mt-5">
          <ActionButton action={createClosure} tone="outline">
            {t('addClosure')}
          </ActionButton>
        </div>
      </section>
    </div>
  )
}
