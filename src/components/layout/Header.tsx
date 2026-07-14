import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { navLinks, site } from '../../data/content'
import { PhoneIcon } from '../ui/PhoneIcon'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <img src="/logo.png" alt="AndyArbeit Logo" className="header__logo-img" />
          <div className="header__logo-text">
            AndyArbeit
            <span>München</span>
          </div>
        </Link>

        <nav className="header__nav" aria-label="Hauptnavigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `header__link${isActive ? ' header__link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <a href={site.phoneHref} className="header__phone">
            <PhoneIcon className="header__phone-icon" size={17} />
            {site.phone}
          </a>

          <button
            type="button"
            className={`header__menu-btn${menuOpen ? ' header__menu-btn--open' : ''}`}
            aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="header__menu-bar" />
            <span className="header__menu-bar" />
            <span className="header__menu-bar" />
          </button>
        </div>
      </div>

      <nav
        className={`container header__mobile-nav${menuOpen ? ' header__mobile-nav--open' : ''}`}
        aria-label="Mobile Navigation"
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) =>
              `header__mobile-link${isActive ? ' header__mobile-link--active' : ''}`
            }
            onClick={closeMenu}
          >
            {link.label}
          </NavLink>
        ))}
        <a href={site.phoneHref} className="header__mobile-phone" onClick={closeMenu}>
          <PhoneIcon className="header__phone-icon" size={17} />
          {site.phone}
        </a>
      </nav>
    </header>
  )
}
