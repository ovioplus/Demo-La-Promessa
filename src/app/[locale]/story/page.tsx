import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ImageFrame } from '@/components/image-frame'
import { PageHeader } from '@/components/page-header'
import { Reveal } from '@/components/reveal'
import { getRestaurant, images, localized } from '@/content'
import type { Locale } from '@/i18n/routing'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.story' })
  return { title: t('title'), description: t('description') }
}

export default async function StoryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, restaurant] = await Promise.all([getTranslations('story'), getRestaurant()])
  const [firstParagraph, ...restParagraphs] = restaurant.chef.bio

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={restaurant.chef.name} image={images.chef} />

      {/* Opening paragraph gets its own column and a lot of air. */}
      <section className="px-gutter grid grid-cols-12 pt-28 pb-20 md:pt-44 md:pb-28">
        <div className="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4">
          <Reveal variant="fade">
            <p className="t-label mb-9">{localized(restaurant.chef.role, locale)}</p>
          </Reveal>
          {firstParagraph ? (
            <Reveal variant="fade" delay={120}>
              <p className="t-lead text-balance">{localized(firstParagraph, locale)}</p>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* The rest of the bio, set narrow, with the portrait bleeding right. */}
      <section className="pl-gutter grid grid-cols-12 items-start gap-y-16 pb-28 md:pb-40">
        <div className="col-span-12 flex flex-col gap-7 md:col-span-5 md:col-start-2 md:pt-16">
          {restParagraphs.map((paragraph, index) => (
            <Reveal key={index} variant="fade" delay={index * 110}>
              <p className="t-body text-cenere max-w-prose">{localized(paragraph, locale)}</p>
            </Reveal>
          ))}
        </div>

        <div className="col-span-12 md:col-span-5 md:col-start-8">
          <ImageFrame src={images.room} alt="" ratio="aspect-[4/5]" sizes="(max-width: 768px) 100vw, 42vw" />
        </div>
      </section>

      {/* Pull quote, full bleed dark. The one loud moment on a quiet page. */}
      <section className="bg-notte text-gesso">
        <div className="px-gutter grid grid-cols-12 py-32 md:py-48">
          <div className="col-span-12 md:col-span-10 md:col-start-2">
            <Reveal variant="fade">
              <p className="t-label mb-10">{t('quoteLabel')}</p>
            </Reveal>
            <Reveal variant="fade" delay={140}>
              <blockquote className="t-display-l text-balance italic">
                &ldquo;{localized(restaurant.chef.quote, locale)}&rdquo;
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Two quiet facts, set as structure rather than prose. */}
      <section className="px-gutter grid grid-cols-12 gap-y-14 py-28 md:py-40">
        <div className="col-span-12 md:col-span-4 md:col-start-2">
          <Reveal variant="fade">
            <p className="t-label">{t('kitchenLabel')}</p>
          </Reveal>
          <Reveal variant="fade" delay={100}>
            <p className="t-body text-cenere mt-6 max-w-sm">{t('kitchenBody')}</p>
          </Reveal>
        </div>

        <div className="col-span-12 md:col-span-4 md:col-start-8">
          <Reveal variant="fade" delay={160}>
            <p className="t-label">{t('starLabel')}</p>
          </Reveal>
          <Reveal variant="fade" delay={220}>
            <p className="t-body text-cenere mt-6 max-w-sm">{t('starBody')}</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
