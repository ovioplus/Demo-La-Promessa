import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <section className="px-gutter bg-notte text-gesso flex min-h-svh flex-col justify-center">
      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-8 md:col-start-3">
          <p className="t-label mb-8">404</p>
          <h1 className="t-display-l">{t('title')}</h1>
          <p className="t-body text-gesso/55 mt-8 max-w-md">{t('body')}</p>
          <Link href="/" className="link-rule t-caption mt-12 inline-block">
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}
