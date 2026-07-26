import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'
import { DocumentMeta } from '../seo/DocumentMeta'
import { SessionAnalytics } from '../analytics/SessionAnalytics'
import { CookieConsent } from '../ui/CookieConsent'
import { PhoneFab } from '../ui/PhoneFab'
import { WhatsAppButton } from '../ui/WhatsAppButton'

const OVERLAY_HERO_PATHS = new Set(['/', '/ueber-uns', '/leistungen'])

export function Layout() {
  const location = useLocation()
  const hasOverlayHero = OVERLAY_HERO_PATHS.has(location.pathname)

  return (
    <div className={`layout${hasOverlayHero ? ' layout--overlay-hero' : ''}`}>
      <DocumentMeta />
      <SessionAnalytics />
      <ScrollToTop />
      <Header />
      <main className="layout__main">
        <Outlet />
      </main>
      <Footer />
      <PhoneFab />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  )
}
