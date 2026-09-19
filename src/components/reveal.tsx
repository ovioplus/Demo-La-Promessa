'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'mask' | 'fade' | 'none'

const VARIANT_CLASS: Record<Variant, string> = {
  mask: 'reveal-mask',
  fade: 'reveal-fade',
  /**
   * Observe only. The element gets `is-revealed` and nothing else, so a
   * descendant marked `.reveal-clip` can do the animating. Images need this:
   * see the note on `.reveal-clip` in globals.css.
   */
  none: '',
}

type RevealProps = {
  as?: ElementType
  variant?: Variant
  /** Milliseconds. Used to stagger siblings; keep the steps short, 60 to 120ms. */
  delay?: number
  className?: string
  children: ReactNode
}

/**
 * Reveals its child once, when it first crosses into view.
 *
 * Deliberately not a library. Framer Motion would add roughly 50kB to a site
 * whose whole argument is that it loads instantly, and the entire motion
 * vocabulary here is three CSS classes.
 */
export function Reveal({ as = 'div', variant = 'fade', delay = 0, className, children }: RevealProps) {
  // Narrowed to a single intrinsic element: the union of every ElementType
  // resolves its props to `never`, and the only props passed here are the ones
  // every host element accepts anyway.
  const Tag = as as 'div'
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Anything already on screen at mount reveals immediately, so the first
    // viewport never waits on an observer callback.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={cn(VARIANT_CLASS[variant], revealed && 'is-revealed', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
