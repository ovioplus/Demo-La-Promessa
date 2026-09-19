'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { LOCALES, type Locale } from '@/i18n/routing'
import { cn } from '@/lib/cn'

/**
 * Two letters and a slash. A flag icon would be wrong twice over: flags are
 * countries, not languages, and an icon here would be the only icon on the site.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const active = useLocale() as Locale
  const t = useTranslations('locale')
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()

  function switchTo(next: Locale) {
    if (next === active) return
    startTransition(() => {
      // Same page, other language. Every route here is static, so the pathname
      // alone identifies it and next-intl swaps the localised slug for us.
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <div className={cn('t-caption flex items-center gap-2', pending && 'opacity-50', className)}>
      {LOCALES.map((locale, index) => (
        <span key={locale} className="flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden className="opacity-30">
              /
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => switchTo(locale)}
            aria-current={locale === active ? 'true' : undefined}
            className={cn(
              'transition-opacity duration-300',
              locale === active ? 'opacity-100' : 'opacity-45 hover:opacity-100',
            )}
          >
            {t(locale)}
          </button>
        </span>
      ))}
    </div>
  )
}
