import Image, { type StaticImageData } from 'next/image'
import { Reveal } from './reveal'
import { cn } from '@/lib/cn'

type ImageFrameProps = {
  src: StaticImageData | string
  alt: string
  /** Tailwind aspect ratio class, e.g. 'aspect-[3/4]'. */
  ratio?: string
  className?: string
  sizes?: string
  priority?: boolean
  caption?: string
  delay?: number
}

/**
 * Every photograph on the site goes through here: it wipes open from the
 * bottom while the picture inside settles out of a slight over-scale, like a
 * camera coming to rest. One move, used everywhere, so the site has a gait.
 */
export function ImageFrame({
  src,
  alt,
  ratio = 'aspect-[4/5]',
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  caption,
  delay,
}: ImageFrameProps) {
  // A blur placeholder only exists for a static import. A plain path would
  // need an explicit blurDataURL, and passing placeholder="blur" without one
  // throws at render.
  const placeholder = typeof src === 'string' ? undefined : ('blur' as const)

  return (
    <figure className={cn('group', className)}>
      <Reveal variant="none" delay={delay} className={cn('bg-gesso-deep relative overflow-hidden', ratio)}>
        <div className="reveal-clip absolute inset-0">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder={placeholder}
            className="object-cover"
          />
        </div>
      </Reveal>
      {caption ? (
        <Reveal variant="fade" delay={(delay ?? 0) + 220}>
          <figcaption className="t-caption text-cenere mt-4">{caption}</figcaption>
        </Reveal>
      ) : null}
    </figure>
  )
}
