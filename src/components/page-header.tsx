import Image from 'next/image'
import { Reveal } from './reveal'
import { cn } from '@/lib/cn'

/**
 * Every route except the home page opens with this band.
 *
 * It is not decoration: the site header is transparent until you scroll, so a
 * dark block at the top of every page is what lets the header have two states
 * instead of one per route.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  className,
}: {
  eyebrow?: string
  title: string
  intro?: string
  image?: string
  imageAlt?: string
  className?: string
}) {
  return (
    <section className={cn('bg-notte text-gesso relative isolate overflow-hidden', className)}>
      {image ? (
        <>
          <Image
            src={image}
            alt={imageAlt ?? ''}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div
            aria-hidden
            className="from-notte/75 via-notte/40 to-notte absolute inset-0 bg-gradient-to-b"
          />
        </>
      ) : null}

      <div className="px-gutter relative grid min-h-[58vh] grid-cols-12 content-end pt-44 pb-16 md:min-h-[64vh] md:pb-20">
        <div className="col-span-12 md:col-span-9 lg:col-span-8">
          {eyebrow ? (
            <Reveal variant="fade">
              <p className="t-label mb-7">{eyebrow}</p>
            </Reveal>
          ) : null}

          <Reveal variant="mask">
            <h1 className="t-display-l">{title}</h1>
          </Reveal>

          {intro ? (
            <Reveal variant="fade" delay={260}>
              <p className="t-body text-gesso/60 mt-8 max-w-xl">{intro}</p>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  )
}
