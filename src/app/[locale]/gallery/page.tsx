import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ImageFrame } from '@/components/image-frame'
import { PageHeader } from '@/components/page-header'
import { getGallery, images, localized } from '@/content'
import type { Locale } from '@/i18n/routing'
import { cn } from '@/lib/cn'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.gallery' })
  return { title: t('title'), description: t('description') }
}

/**
 * Column spans and vertical offsets per position in the run. A repeating
 * pattern of 6 keeps the page irregular without becoming random: an even grid
 * of identical tiles is what makes a gallery look like a template.
 */
const RHYTHM: readonly { span: string; offset: string; ratio: string }[] = [
  { span: 'md:col-span-7', offset: '', ratio: 'aspect-[4/5]' },
  { span: 'md:col-span-4 md:col-start-9', offset: 'md:mt-32', ratio: 'aspect-[3/4]' },
  { span: 'md:col-span-5 md:col-start-2', offset: 'md:-mt-16', ratio: 'aspect-square' },
  { span: 'md:col-span-6 md:col-start-7', offset: 'md:mt-24', ratio: 'aspect-[16/11]' },
  { span: 'md:col-span-6', offset: 'md:mt-8', ratio: 'aspect-[5/6]' },
  { span: 'md:col-span-4 md:col-start-8', offset: 'md:mt-40', ratio: 'aspect-[3/4]' },
]

export default async function GalleryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, gallery] = await Promise.all([getTranslations('gallery'), getGallery()])

  return (
    <>
      <PageHeader title={t('title')} intro={t('intro')} image={images.room} />

      <section className="px-gutter grid grid-cols-12 gap-x-5 gap-y-14 py-24 md:gap-y-4 md:py-36">
        {gallery.map((image, index) => {
          const rhythm = RHYTHM[index % RHYTHM.length]
          return (
            <div key={image.id} className={cn('col-span-12', rhythm?.span, rhythm?.offset)}>
              <ImageFrame
                src={image.src}
                alt={localized(image.alt, locale)}
                caption={image.caption ? localized(image.caption, locale) : undefined}
                ratio={rhythm?.ratio}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )
        })}
      </section>
    </>
  )
}
