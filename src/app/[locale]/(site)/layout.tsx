import { setRequestLocale } from 'next-intl/server'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getHours, getRestaurant } from '@/content'

/**
 * The public site's chrome. The dashboard sits outside this group and has none
 * of it, which is why the header and footer moved down here out of the root
 * locale layout.
 */
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  // Next's generated LayoutProps types this as string, so it cannot be
  // narrowed to Locale here. The root layout has already rejected anything
  // that is not a supported locale.
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [restaurant, hours] = await Promise.all([getRestaurant(), getHours()])

  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter restaurant={restaurant} hours={hours} />
    </>
  )
}
