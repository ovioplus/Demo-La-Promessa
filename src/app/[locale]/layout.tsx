import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Bodoni_Moda, Instrument_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getHours, getRestaurant } from '@/content'
import { routing, type Locale } from '@/i18n/routing'
import { SITE_URL } from '@/lib/env'
import '../globals.css'

/**
 * Bodoni is an Italian Didone, which is the point: extreme thick-to-thin
 * contrast reads as expensive, and Giambattista Bodoni cut his types in Parma.
 * It is used at display sizes only, where that contrast is an asset rather than
 * a legibility problem.
 */
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bodoni',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
})

const instrument = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.home' })

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      template: '%s · La Promessa',
    },
    description: t('description'),
    alternates: {
      canonical: locale === routing.defaultLocale ? '/' : `/${locale}`,
      languages: { it: '/', en: '/en' },
    },
    openGraph: {
      type: 'website',
      siteName: 'La Promessa',
      locale: locale === 'it' ? 'it_IT' : 'en_GB',
      title: t('title'),
      description: t('description'),
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)

  const [restaurant, hours] = await Promise.all([getRestaurant(), getHours()])

  return (
    <html lang={locale} className={`${bodoni.variable} ${instrument.variable}`}>
      <body>
        <NextIntlClientProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter restaurant={restaurant} hours={hours} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
