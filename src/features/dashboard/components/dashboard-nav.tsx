'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import type { AppPathname } from '@/i18n/routing'
import { cn } from '@/lib/cn'

const ITEMS: readonly { href: AppPathname; key: 'overview' | 'menu' | 'hours' }[] = [
  { href: '/dashboard', key: 'overview' },
  { href: '/dashboard/menu', key: 'menu' },
  { href: '/dashboard/hours', key: 'hours' },
]

export function DashboardNav() {
  const t = useTranslations('dashboard.nav')
  const pathname = usePathname()

  return (
    <nav aria-label="Dashboard" className="flex items-center gap-7">
      {ITEMS.map(({ href, key }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            't-caption transition-opacity duration-300 hover:opacity-100',
            pathname === href ? 'opacity-100' : 'opacity-55',
          )}
        >
          {t(key)}
        </Link>
      ))}
    </nav>
  )
}
