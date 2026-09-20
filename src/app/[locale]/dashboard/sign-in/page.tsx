import type { Metadata } from 'next'
import { AuthError } from 'next-auth'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { signIn } from '@/auth'
import { isOwner } from '@/auth/owners'
import { hasDatabase } from '@/db/client'
import { Card } from '@/features/dashboard/components/fields'
import { Link, redirect } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

export const metadata: Metadata = { robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ sent?: string; error?: string }>
}) {
  const { locale } = await params
  const query = await searchParams
  setRequestLocale(locale)

  const t = await getTranslations('dashboard.signIn')
  const nav = await getTranslations('dashboard')

  async function requestLink(formData: FormData) {
    'use server'

    const email = String(formData.get('email') ?? '').trim()
    if (!email) return

    /**
     * An address that is not an owner gets the same "check your inbox" screen
     * as one that is, and no email. Answering differently would turn this form
     * into a way to discover who can edit the site.
     */
    if (!isOwner(email)) {
      redirect({ href: { pathname: '/dashboard/sign-in', query: { sent: '1' } }, locale })
    }

    try {
      await signIn('resend', { email, redirectTo: '/dashboard' })
    } catch (error) {
      // signIn signals success by throwing Next's redirect, which must escape.
      if (error instanceof AuthError) {
        redirect({ href: { pathname: '/dashboard/sign-in', query: { error: '1' } }, locale })
      }
      throw error
    }
  }

  return (
    <div className="flex min-h-svh flex-col justify-center bg-gesso">
      <div className="px-gutter mx-auto w-full max-w-md py-16">
        <Link href="/" className="t-caption tracking-[0.28em] text-cenere">
          La Promessa
        </Link>

        <h1 className="t-display-l mt-10">{t('title')}</h1>

        {!hasDatabase ? (
          <Card className="mt-8">
            <p className="t-body text-cenere">{t('notConfigured')}</p>
          </Card>
        ) : query.sent ? (
          <Card className="mt-8">
            <p className="t-display-s">{t('sentTitle')}</p>
            <p className="t-body mt-3 text-cenere">{t('sentBody')}</p>
          </Card>
        ) : (
          <>
            <p className="t-body mt-6 text-cenere">{t('intro')}</p>

            {query.error ? (
              <Card className="mt-8">
                <p className="t-caption text-ottone">{t('errorTitle')}</p>
                <p className="t-body mt-2 text-cenere">{t('errorBody')}</p>
              </Card>
            ) : null}

            <form action={requestLink} className="mt-8">
              <label className="block">
                <span className="t-caption block text-cenere">{t('emailLabel')}</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  autoFocus
                  className="field-input mt-2"
                />
              </label>

              <button
                type="submit"
                className="t-caption mt-6 w-full border border-ottone/45 px-5 py-3.5 transition-colors duration-300 hover:border-inchiostro hover:bg-inchiostro hover:text-gesso"
              >
                {t('submit')}
              </button>
            </form>
          </>
        )}

        <Link href="/" className="link-rule t-caption mt-10 inline-block text-cenere">
          {nav('viewSite')}
        </Link>
      </div>
    </div>
  )
}
