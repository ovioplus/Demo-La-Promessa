'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { BookButton } from './book-button'
import { LocaleSwitcher } from './locale-switcher'
import { Link, usePathname } from '@/i18n/navigation'
import type { AppPathname } from '@/i18n/routing'
import { cn } from '@/lib/cn'

const NAV: readonly { href: AppPathname; key: 'menu' | 'story' | 'gallery' | 'reservations' | 'contact' }[] =
  [
    { href: '/menu', key: 'menu' },
    { href: '/story', key: 'story' },
    { href: '/gallery', key: 'gallery' },
    { href: '/reservations', key: 'reservations' },
    { href: '/contact', key: 'contact' },
  ]

/**
 * Transparent over the dark band that opens every page, then resolves into
 * paper once you scroll past it. Every route starts with a `notte` block for
 * exactly this reason: the header only ever has two states to reason about.
 */
export function SiteHeader() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const light = !scrolled && !open

  return (
    <>
      <a
        href="#main"
        className="t-caption focus:bg-gesso focus:text-inchiostro sr-only focus:not-sr-only focus:fixed focus:top-6 focus:left-6 focus:z-[100] focus:px-4 focus:py-3"
      >
        {t('skip')}
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-700',
          scrolled && !open ? 'bg-gesso/95 backdrop-blur-sm' : 'bg-transparent',
        )}
      >
        <div
          className={cn(
            'px-gutter flex items-center justify-between transition-[padding,color] duration-700',
            scrolled ? 'py-5' : 'py-7',
            light ? 'text-gesso' : 'text-inchiostro',
          )}
        >
          <Link
            href="/"
            className="t-caption relative z-10 tracking-[0.34em] transition-opacity duration-300 hover:opacity-65"
          >
            La Promessa
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {NAV.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  't-caption transition-opacity duration-300 hover:opacity-100',
                  pathname === href ? 'opacity-100' : 'opacity-60',
                )}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-7 lg:flex">
            <LocaleSwitcher />
            <span aria-hidden className={cn('h-4 w-px', light ? 'bg-gesso/30' : 'bg-inchiostro/20')} />
            <BookButton label={t('book')} tone={light ? 'onDark' : 'onLight'} className="py-3" />
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t('closeMenu') : t('openMenu')}
            className="relative z-10 flex h-8 w-8 flex-col items-end justify-center gap-[7px] lg:hidden"
          >
            <span
              className={cn(
                'block h-px bg-current transition-all duration-500',
                open ? 'w-6 translate-y-[4px] rotate-45' : 'w-6',
              )}
            />
            <span
              className={cn(
                'block h-px bg-current transition-all duration-500',
                open ? 'w-6 -translate-y-[4px] -rotate-45' : 'w-4',
              )}
            />
          </button>
        </div>
      </header>

      {/* Mobile overlay. Full bleed, big serif, nothing else. */}
      <div
        className={cn(
          'bg-notte text-gesso fixed inset-0 z-40 transition-opacity duration-500 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="px-gutter flex h-full flex-col justify-between pt-32 pb-14">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV.map(({ href, key }, index) => (
              <Link
                key={href}
                href={href}
                className="t-display-m py-2 transition-opacity duration-500"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0)' : 'translateY(12px)',
                  transitionDelay: `${open ? 120 + index * 55 : 0}ms`,
                  transitionProperty: 'opacity, transform',
                }}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-8">
            <LocaleSwitcher />
            <BookButton label={t('book')} tone="onDark" className="w-full" />
          </div>
        </div>
      </div>
    </>
  )
}
