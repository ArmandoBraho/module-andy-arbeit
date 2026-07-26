import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  COOKIE_CONSENT_OPEN_EVENT,
  readCookieConsent,
  writeCookieConsent,
} from '../../lib/cookieConsent'

export function CookieConsent() {
  const titleId = useId()
  const [visible, setVisible] = useState(false)
  const [statistics, setStatistics] = useState(false)
  const [externalContent, setExternalContent] = useState(false)

  useEffect(() => {
    const existing = readCookieConsent()
    if (!existing) {
      setVisible(true)
      return
    }
    setStatistics(existing.statistics)
    setExternalContent(existing.externalContent)
  }, [])

  useEffect(() => {
    const openSettings = () => {
      const existing = readCookieConsent()
      setStatistics(existing?.statistics ?? false)
      setExternalContent(existing?.externalContent ?? false)
      setVisible(true)
    }
    window.addEventListener(COOKIE_CONSENT_OPEN_EVENT, openSettings)
    return () => {
      window.removeEventListener(COOKIE_CONSENT_OPEN_EVENT, openSettings)
    }
  }, [])

  if (!visible) return null

  const save = (next: { statistics: boolean; externalContent: boolean }) => {
    writeCookieConsent(next)
    setStatistics(next.statistics)
    setExternalContent(next.externalContent)
    setVisible(false)
  }

  return (
    <div
      className="cookie-consent"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
    >
      <div className="cookie-consent__panel">
        <div className="cookie-consent__copy">
          <h2 id={titleId} className="cookie-consent__title">
            Cookies & Datenschutz
          </h2>
          <p className="cookie-consent__text">
            Wir verwenden technisch notwendige Speicherung, damit die Website
            funktioniert. Optionale Statistik und die interaktive Karte
            (OpenStreetMap) starten wir erst nach Ihrer Einwilligung. Mehr in
            der <Link to="/datenschutz">Datenschutzerklärung</Link>.
          </p>

          <label className="cookie-consent__option">
            <input type="checkbox" checked disabled readOnly />
            <span>
              <strong>Notwendig</strong>
              <span className="cookie-consent__option-hint">
                Immer aktiv – speichert z.&nbsp;B. Ihre Cookie-Auswahl
              </span>
            </span>
          </label>

          <label className="cookie-consent__option">
            <input
              type="checkbox"
              checked={statistics}
              onChange={(event) => setStatistics(event.target.checked)}
            />
            <span>
              <strong>Statistik</strong>
              <span className="cookie-consent__option-hint">
                Optional – zählt Sitzungen und wie lange die Seite geöffnet war
              </span>
            </span>
          </label>

          <label className="cookie-consent__option">
            <input
              type="checkbox"
              checked={externalContent}
              onChange={(event) => setExternalContent(event.target.checked)}
            />
            <span>
              <strong>Externe Inhalte (Karte)</strong>
              <span className="cookie-consent__option-hint">
                Optional – lädt Kartenkacheln von OpenStreetMap und
                Marker-Grafiken (Drittanbieter)
              </span>
            </span>
          </label>
        </div>

        <div className="cookie-consent__actions">
          <button
            type="button"
            className="cookie-consent__btn cookie-consent__btn--ghost"
            onClick={() => save({ statistics: false, externalContent: false })}
          >
            Nur notwendige
          </button>
          <button
            type="button"
            className="cookie-consent__btn cookie-consent__btn--secondary"
            onClick={() => save({ statistics, externalContent })}
          >
            Auswahl speichern
          </button>
          <button
            type="button"
            className="cookie-consent__btn cookie-consent__btn--primary"
            onClick={() => save({ statistics: true, externalContent: true })}
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  )
}
