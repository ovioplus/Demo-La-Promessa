import { useTranslations } from 'next-intl'
import type { Hours, Weekday } from '@/content'
import { cn } from '@/lib/cn'

/** Monday first: this is an Italian restaurant, not an American one. */
const WEEK_ORDER: readonly Weekday[] = [1, 2, 3, 4, 5, 6, 0]

export function HoursList({
  hours,
  tone = 'light',
  className,
}: {
  hours: Hours
  tone?: 'light' | 'dark'
  className?: string
}) {
  const days = useTranslations('days')
  const t = useTranslations('reservations')

  const muted = tone === 'dark' ? 'text-gesso/45' : 'text-cenere'
  const rule = tone === 'dark' ? 'border-gesso/12' : 'border-inchiostro/10'

  return (
    <dl className={cn('w-full', className)}>
      {WEEK_ORDER.map((day) => {
        const entry = hours.week.find((d) => d.day === day)
        const closed = !entry || entry.services.length === 0

        return (
          <div
            key={day}
            className={cn('flex items-baseline justify-between gap-6 border-b py-3.5 last:border-b-0', rule)}
          >
            <dt className={cn('t-caption', closed && muted)}>{days(String(day))}</dt>
            <dd className={cn('t-caption text-right tabular-nums', closed && muted)}>
              {closed ? (
                t('closedLabel')
              ) : (
                <span className="flex flex-col items-end gap-1 sm:flex-row sm:gap-4">
                  {entry.services.map((service) => (
                    <span key={service.from}>
                      {service.from} <span className="opacity-40">/</span> {service.to}
                    </span>
                  ))}
                </span>
              )}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
