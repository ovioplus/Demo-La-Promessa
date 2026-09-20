import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ActionButton } from '@/features/dashboard/components/action-button'
import {
  NoteEditor,
  SectionEditor,
  TastingEditor,
} from '@/features/dashboard/components/menu-editors'
import { createNote, createSection, createTasting } from '@/features/dashboard/actions'
import { getMenuForAdmin } from '@/features/dashboard/queries'
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

export default async function DashboardMenuPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, menu] = await Promise.all([getTranslations('dashboard.menu'), getMenuForAdmin()])

  return (
    <div>
      <h1 className="t-display-l">{t('title')}</h1>
      <p className="t-body mt-6 max-w-xl text-cenere">{t('intro')}</p>

      <section className="mt-14">
        <h2 className="t-label mb-5">{t('tastingTitle')}</h2>
        <div className="flex flex-col gap-5">
          {menu.tastingMenus.map((tasting) => (
            <TastingEditor key={tasting.id} tasting={tasting} />
          ))}
        </div>
        <div className="mt-5">
          <ActionButton action={createTasting} tone="outline">
            {t('addTasting')}
          </ActionButton>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="t-label mb-5">{t('sectionsTitle')}</h2>
        <div className="flex flex-col gap-5">
          {menu.sections.map((section) => (
            <SectionEditor key={section.id} section={section} />
          ))}
        </div>
        <div className="mt-5">
          <ActionButton action={createSection} tone="outline">
            {t('addSection')}
          </ActionButton>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="t-label mb-5">{t('notesTitle')}</h2>
        <div className="flex flex-col gap-5">
          {menu.notes.map((note) => (
            <NoteEditor key={note.id} note={note} />
          ))}
        </div>
        <div className="mt-5">
          <ActionButton action={createNote} tone="outline">
            {t('addNote')}
          </ActionButton>
        </div>
      </section>
    </div>
  )
}
