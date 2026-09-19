import { useTranslations } from 'next-intl'
import { HoursList } from './hours-list'
import { LocaleSwitcher } from './locale-switcher'
import { Link } from '@/i18n/navigation'
import type { AppPathname } from '@/i18n/routing'
import type { Hours, Restaurant } from '@/content'

const NAV: readonly { href: AppPathname; key: 'menu' | 'story' | 'gallery' | 'reservations' | 'contact' }[] =
  [
    { href: '/menu', key: 'menu' },
    { href: '/story', key: 'story' },
    { href: '/gallery', key: 'gallery' },
    { href: '/reservations', key: 'reservations' },
    { href: '/contact', key: 'contact' },
  ]

export function SiteFooter({ restaurant, hours }: { restaurant: Restaurant; hours: Hours }) {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-notte text-gesso">
      <div className="px-gutter pt-24 pb-12 md:pt-32">
        <div className="border-gesso/12 grid gap-14 border-b pb-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <p className="t-display-s">{restaurant.name}</p>
            <address className="t-body text-gesso/55 mt-5 leading-relaxed not-italic">
              {restaurant.address.street}
              <br />
              {restaurant.address.postalCode} {restaurant.address.city}
            </address>
          </div>

          <nav aria-label="Footer" className="md:col-span-3 md:col-start-6">
            <p className="t-label">{t('navLabel')}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {NAV.map(({ href, key }) => (
                <li key={href}>
                  <Link href={href} className="t-caption text-gesso/60 hover:text-gesso transition-colors">
                    {nav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="t-label">{t('contactLabel')}</p>
            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${restaurant.email}`}
                  className="t-caption text-gesso/60 hover:text-gesso transition-colors"
                >
                  {restaurant.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${restaurant.phone.replace(/\s/g, '')}`}
                  className="t-caption text-gesso/60 hover:text-gesso transition-colors"
                >
                  {restaurant.phone}
                </a>
              </li>
              {restaurant.social.instagram ? (
                <li>
                  <a
                    href={`https://instagram.com/${restaurant.social.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-caption text-gesso/60 hover:text-gesso transition-colors"
                  >
                    {t('instagram')}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="md:col-span-12 lg:col-span-4 lg:col-start-9 lg:row-start-1">
            <p className="t-label">{t('hoursLabel')}</p>
            <HoursList hours={hours} tone="dark" className="mt-4" />
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-caption text-gesso/35">
            &copy; {year} {restaurant.legalName}. {t('rights')}.
          </p>
          <div className="flex items-center gap-7">
            <LocaleSwitcher className="text-gesso/60" />
            <span aria-hidden className="bg-gesso/15 h-4 w-px" />
            <a
              href="https://ovioplus.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="t-caption text-gesso/35 hover:text-gesso/70 transition-colors"
            >
              {t('credit')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
