import { BOOKING_URL } from '@/lib/booking'
import { cn } from '@/lib/cn'

type Tone = 'onLight' | 'onDark' | 'solid'

const TONES: Record<Tone, string> = {
  onLight: 'border-ottone/45 text-inchiostro hover:bg-inchiostro hover:border-inchiostro hover:text-gesso',
  onDark: 'border-ottone/55 text-gesso hover:bg-gesso hover:border-gesso hover:text-inchiostro',
  solid: 'border-gesso bg-gesso text-inchiostro hover:bg-transparent hover:text-gesso',
}

/**
 * The only real button on the site. Everything else that navigates is a text
 * link with a rule under it. Scarcity is the whole point: when one element is
 * the only button, it does not need to shout.
 */
export function BookButton({
  label,
  tone = 'onLight',
  className,
}: {
  label: string
  tone?: Tone
  className?: string
}) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        't-caption inline-flex items-center justify-center border px-7 py-4 transition-colors duration-500',
        TONES[tone],
        className,
      )}
    >
      {label}
    </a>
  )
}
