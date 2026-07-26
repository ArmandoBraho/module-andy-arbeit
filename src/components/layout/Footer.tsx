import { Link } from 'react-router-dom'
import { footerNavLinks, site, socialLinks } from '../../data/content'
import { COOKIE_CONSENT_OPEN_EVENT } from '../../lib/cookieConsent'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.5 1 .4.4.7.9 1 1.5.2.4.4 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-1 1.5-.4.4-.9.7-1.5 1-.4.2-1.1.4-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.5-1-.4-.4-.7-.9-1-1.5-.2-.4-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 1-1.5.4-.4.9-.7 1.5-1 .4-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7 0.1 5.7.1 4.9.3 4.1.6 3.4.9 2.7 1.3 2.1 1.9 1.5 2.5 1.1 3.2.8 3.9.5 4.7.3 5.5.2 6.8.1 8.1.1 8.5.1 12s0 3.9.1 5.2c.1 1.3.3 2.1.6 2.9.3.7.7 1.4 1.3 2 .6.6 1.3 1 2 1.3.8.3 1.6.5 2.9.6 1.3.1 1.7.1 5.2.1s3.9 0 5.2-.1c1.3-.1 2.1-.3 2.9-.6.7-.3 1.4-.7 2-1.3.6-.6 1-1.3 1.3-2 .3-.8.5-1.6.6-2.9.1-1.3.1-1.7.1-5.2s0-3.9-.1-5.2c-.1-1.3-.3-2.1-.6-2.9-.3-.7-.7-1.4-1.3-2-.6-.6-1.3-1-2-1.3C19.3.3 18.5.1 17.2.1 15.9 0 15.5 0 12 0z"
      />
      <path
        fill="currentColor"
        d="M12 5.8A6.2 6.2 0 1 0 12 18.2 6.2 6.2 0 1 0 12 5.8zm0 10.2A4 4 0 1 1 12 8a4 4 0 0 1 0 8z"
      />
      <circle fill="currentColor" cx="18.4" cy="5.6" r="1.4" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M21 8.2a7.3 7.3 0 0 1-4.7-1.7v7.1a6.1 6.1 0 1 1-6.1-6.1c.3 0 .7 0 1 .1v3.1a3 3 0 1 0 2.1 2.9V2.2h3.1c.1 1.2.6 2.4 1.4 3.3A4.7 4.7 0 0 0 21 6.8z"
      />
    </svg>
  )
}

const socialIcons = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
} as const

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="footer__logo-link" aria-label={`${site.name} – zur Startseite`}>
            <img src="/logoAndyVonLogoDesign.png" alt="AndyArbeit Logo" />
          </Link>
          <p>
            Ihr zuverlässiger Partner für Hausmeisterservice, Gebäudereinigung und
            Abwassertechnik im Münchner Großraum.
          </p>
        </div>

        <div>
          <h4 className="footer__heading">Navigation</h4>
          <nav className="footer__links" aria-label="Footer Navigation">
            {footerNavLinks.map((link) => (
              <Link key={link.path} to={link.path} className="footer__link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer__contact">
          <h4 className="footer__heading">Kontakt</h4>
          <div className="footer__contact-item">
            <a href={site.phoneHref}>{site.phone}</a>
          </div>
          <div className="footer__contact-item">
            <a href={site.emailHref}>{site.email}</a>
          </div>
          <nav className="footer__social" aria-label="Soziale Medien">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.id]
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className="footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  <Icon />
                </a>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {currentYear} AndyArbeit. Alle Rechte vorbehalten.</span>
        <div className="footer__legal">
          <Link to="/impressum" className="footer__link">
            Impressum
          </Link>
          <Link to="/datenschutz" className="footer__link">
            Datenschutz
          </Link>
          <button
            type="button"
            className="footer__link footer__link--button"
            onClick={() => {
              window.dispatchEvent(new Event(COOKIE_CONSENT_OPEN_EVENT))
            }}
          >
            Cookie-Einstellungen
          </button>
        </div>
      </div>
    </footer>
  )
}
