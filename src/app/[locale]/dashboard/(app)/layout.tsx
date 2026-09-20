import { getTranslations, setRequestLocale } from 'next-intl/server'
import { signOut } from '@/auth'
import { getOwnerSession } from '@/auth/guard'
import { DashboardNav } from '@/features/dashboard/components/dashboard-nav'
import { Link, redirect } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

/**
 * The gate.
 *
 * Resource-based, the same convention as ovioplus-platform: the middleware does
 * not know about auth at all, this layout does. That keeps next-intl's
 * middleware the only middleware and avoids composing two of them.
 *
 * Note that this protects rendering, not writing. Every server action re-checks
 * the session itself, because an action is a public endpoint that never passes
 * through here.
 */
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  // See the note in (site)/layout.tsx: Next types layout params as string.
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await getOwnerSession()
  if (!session) {
    // next-intl's redirect throws, but it is not typed as `never`, so the
    // explicit return is what narrows `session` below.
    redirect({ href: '/dashboard/sign-in', locale: locale as Locale })
    return null
  }

  const t = await getTranslations('dashboard')

  async function endSession() {
    'use server'
    await signOut({ redirectTo: '/dashboard/sign-in' })
  }

  return (
    <div className="min-h-svh bg-gesso">
      <header className="hairline sticky top-0 z-40 border-b bg-gesso/95 backdrop-blur-sm">
        <div className="px-gutter flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="t-caption tracking-[0.28em]">
              La Promessa
            </Link>
            <span aria-hidden className="hidden h-4 w-px bg-inchiostro/15 sm:block" />
            <DashboardNav />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/" className="t-caption text-cenere transition-colors hover:text-inchiostro">
              {t('viewSite')}
            </Link>
            <span aria-hidden className="hidden h-4 w-px bg-inchiostro/15 sm:block" />
            <span className="t-caption hidden text-cenere md:inline">{session.email}</span>
            <form action={endSession}>
              <button type="submit" className="t-caption text-cenere transition-colors hover:text-ottone">
                {t('signOut')}
              </button>
            </form>
          </div>
        </div>
      </header>

      <main id="main" className="px-gutter py-12 md:py-16">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  )
}
