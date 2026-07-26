import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { emergencyContact, navLinks } from '../../data/content'
import { NotfallIcon } from '../ui/NotfallIcon'

const SCROLL_THRESHOLD = 48
const OVERLAY_HERO_PATHS = new Set(['/', '/ueber-uns', '/leistungen'])

export function Header() {
  const location = useLocation()
  const hasOverlayHero = OVERLAY_HERO_PATHS.has(location.pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const closeMenu = () => setMenuOpen(false)
  const isOverlay = hasOverlayHero && !isScrolled && !menuOpen

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!hasOverlayHero) {
      setIsScrolled(true)
      return
    }

    const updateScrollState = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })

    return () => window.removeEventListener('scroll', updateScrollState)
  }, [hasOverlayHero])

  const headerClassName = [
    'header',
    isOverlay ? 'header--overlay' : 'header--solid',
    hasOverlayHero ? 'header--overlay-hero' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={headerClassName}>
      <div className="container header__inner">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <img
            src="/logoAndyVonLogoDesign.png"
            alt="AndyArbeit München"
            className="header__logo-img"
          />
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
          <NavLink
            to={emergencyContact.path}
            className={({ isActive }) =>
              `header__link header__link--emergency${
                isActive ? ' header__link--active' : ''
              }`
            }
            aria-label={emergencyContact.ariaLabel}
            title={emergencyContact.ariaLabel}
          >
            <span className="header__emergency-badge" aria-hidden="true">
              <NotfallIcon className="header__emergency-icon" size={13} />
            </span>
            <span className="header__emergency-label">{emergencyContact.label}</span>
          </NavLink>
        </nav>

        <div className="header__actions">
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
        <NavLink
          to={emergencyContact.path}
          className={({ isActive }) =>
            `header__mobile-link header__mobile-link--emergency${
              isActive ? ' header__mobile-link--active' : ''
            }`
          }
          onClick={closeMenu}
          aria-label={emergencyContact.ariaLabel}
          title={emergencyContact.ariaLabel}
        >
          <span className="header__emergency-badge" aria-hidden="true">
            <NotfallIcon className="header__emergency-icon" size={14} />
          </span>
          <span className="header__emergency-label">{emergencyContact.label}</span>
        </NavLink>
      </nav>
    </header>
  )
}
