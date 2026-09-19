/**
 * The non-WebGL seal.
 *
 * Deliberately vector rather than a rendered screenshot of the 3D scene: it is
 * a few hundred bytes inline, it is razor sharp at any size, and it can never
 * drift out of sync with the real thing the way an exported still would. This
 * is what mobile, reduced-motion, save-data and every crawler actually see, so
 * it has to stand on its own.
 */
export function SealStill({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" role="presentation" aria-hidden className={className}>
      <defs>
        <radialGradient id="seal-face" cx="32%" cy="26%" r="82%">
          <stop offset="0%" stopColor="#d8b782" />
          <stop offset="46%" stopColor="#a3814e" />
          <stop offset="100%" stopColor="#4e3c22" />
        </radialGradient>
        <linearGradient id="seal-rim" x1="12%" y1="6%" x2="88%" y2="96%">
          <stop offset="0%" stopColor="#f0dcb6" />
          <stop offset="52%" stopColor="#8a6b3f" />
          <stop offset="100%" stopColor="#2e230f" />
        </linearGradient>
        <linearGradient id="seal-mark" x1="20%" y1="0%" x2="76%" y2="100%">
          <stop offset="0%" stopColor="#fbeed3" />
          <stop offset="58%" stopColor="#c9a86a" />
          <stop offset="100%" stopColor="#6d5228" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="200" r="192" fill="url(#seal-face)" />
      <circle cx="200" cy="200" r="181" fill="none" stroke="url(#seal-rim)" strokeWidth="6" />
      <circle cx="200" cy="200" r="171" fill="none" stroke="#3b2c14" strokeOpacity="0.5" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="#f3e2c2" strokeOpacity="0.16" strokeWidth="1" />

      <rect
        x="189"
        y="90"
        width="22"
        height="22"
        transform="rotate(45 200 101)"
        fill="#f3e2c2"
        fillOpacity="0.72"
      />

      <text
        x="200"
        y="218"
        textAnchor="middle"
        fill="url(#seal-mark)"
        style={{ fontFamily: 'var(--font-bodoni), Didot, Georgia, serif', fontSize: 150, fontWeight: 400 }}
      >
        LP
      </text>

      <text
        x="205"
        y="296"
        textAnchor="middle"
        fill="#f3e2c2"
        fillOpacity="0.55"
        style={{
          fontFamily: 'var(--font-instrument), system-ui, sans-serif',
          fontSize: 19,
          fontWeight: 500,
          letterSpacing: '10px',
        }}
      >
        FIRENZE
      </text>
    </svg>
  )
}
