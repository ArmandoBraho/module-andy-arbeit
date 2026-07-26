import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  buildGoogleCalendarUrlFromPayload,
  buildIcsContentFromPayload,
  downloadIcsFile,
  googleCalendarUrlFromRedirectParams,
  parseCalendarPathParams,
} from '../lib/appointmentCalendar'

export function KalenderRedirectPage() {
  const { start, end } = useParams<{ start?: string; end?: string }>()
  const [searchParams] = useSearchParams()

  const payload = parseCalendarPathParams(start, end)
  const legacyGoogleUrl = payload
    ? null
    : googleCalendarUrlFromRedirectParams(searchParams)
  const googleUrl = payload
    ? buildGoogleCalendarUrlFromPayload(payload)
    : legacyGoogleUrl

  if (!googleUrl) {
    return (
      <main className="section" style={{ padding: '3rem 1.25rem', textAlign: 'center' }}>
        <h1>Kalender-Link ungültig</h1>
        <p>Der Termin-Link ist unvollständig oder abgelaufen.</p>
        <p>
          <Link to="/">Zur Startseite</Link>
        </p>
      </main>
    )
  }

  const handleIcsDownload = () => {
    if (!payload) return
    downloadIcsFile('andyarbeit-termin.ics', buildIcsContentFromPayload(payload))
  }

  return (
    <main
      className="section"
      style={{
        padding: '3rem 1.25rem',
        textAlign: 'center',
        maxWidth: '28rem',
        margin: '0 auto',
      }}
    >
      <h1 style={{ marginBottom: '0.75rem' }}>Termin übernehmen</h1>
      <p style={{ color: '#555', marginBottom: '1.75rem' }}>
        AndyArbeit Terminanfrage – Details stehen in der E-Mail.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {payload && (
          <button type="button" className="btn btn--primary" onClick={handleIcsDownload}>
            Für Outlook speichern (.ics)
          </button>
        )}
        <a className="btn btn--secondary" href={googleUrl}>
          In Google Kalender öffnen
        </a>
      </div>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
        <Link to="/">Zur Startseite</Link>
      </p>
    </main>
  )
}
