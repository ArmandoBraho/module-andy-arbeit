import { Link } from 'react-router-dom'
import { navLinks, site } from '../../data/content'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/logo.png" alt="AndyArbeit Logo" />
          <p>
            Ihr zuverlässiger Partner für Hausmeisterservice, Gebäudereinigung
            und Abwassertechnik im Münchner Großraum.
          </p>
        </div>

        <div>
          <h4 className="footer__heading">Navigation</h4>
          <nav className="footer__links" aria-label="Footer Navigation">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="footer__link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 className="footer__heading">Kontakt</h4>
          <div className="footer__contact-item">
            <a href={site.phoneHref}>{site.phone}</a>
          </div>
          <div className="footer__contact-item">
            <a href={site.emailHref}>{site.email}</a>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {currentYear} AndyArbeit München. Alle Rechte vorbehalten.</span>
        <div className="footer__legal">
          <Link to="/impressum" className="footer__link">
            Impressum
          </Link>
          <Link to="/datenschutz" className="footer__link">
            Datenschutz
          </Link>
        </div>
      </div>
    </footer>
  )
}
