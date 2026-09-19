'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { SealStill } from './seal-still'
import { cn } from '@/lib/cn'

const SealScene = dynamic(() => import('./seal-scene'), { ssr: false, loading: () => null })

/**
 * Decides whether this visitor gets the real thing.
 *
 * Every check here exists because failing it would make the site worse, not
 * because the device is "low end": a phone renders a razor-sharp vector seal
 * instead of spending its battery and its bandwidth on a WebGL context that
 * would be a third of the screen.
 */
function shouldRenderScene(): boolean {
  if (typeof window === 'undefined') return false

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const desktop = window.matchMedia('(min-width: 1024px)').matches
  const finePointer = window.matchMedia('(pointer: fine)').matches
  if (reduced || !desktop || !finePointer) return false

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (connection?.saveData) return false
  if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency < 4) return false

  try {
    const probe = document.createElement('canvas')
    if (!probe.getContext('webgl2')) return false
  } catch {
    return false
  }

  return true
}

export function HeroSeal({ className }: { className?: string }) {
  const [mountScene, setMountScene] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)

  useEffect(() => {
    if (!shouldRenderScene()) return

    // Off the critical path, twice over: the decision waits for the browser to
    // go idle, and three.js only enters the network at that point because the
    // import is dynamic. Nothing above blocks on it.
    const supportsIdle = typeof window.requestIdleCallback === 'function'
    const handle = supportsIdle
      ? window.requestIdleCallback(() => setMountScene(true), { timeout: 2200 })
      : window.setTimeout(() => setMountScene(true), 900)

    return () => {
      if (supportsIdle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
    }
  }, [])

  return (
    <div className={cn('relative', className)}>
      <SealStill
        className={cn(
          'h-full w-full transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]',
          sceneReady ? 'opacity-0' : 'opacity-100',
        )}
      />

      {mountScene ? (
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]',
            sceneReady ? 'opacity-100' : 'opacity-0',
          )}
        >
          <SealScene onReady={() => setSceneReady(true)} />
        </div>
      ) : null}
    </div>
  )
}
