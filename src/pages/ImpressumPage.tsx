import { site } from '../data/content'

export function ImpressumPage() {
  return (
    <div className="page">
      <div className="container legal-content">
        <header className="page__header">
          <h1 className="page__title">Impressum</h1>
        </header>

        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          {site.legalName}
          <br />
          {site.owner}
          <br />
          {site.address.streetAddress}
          <br />
          {site.address.postalCode} {site.address.addressLocality}
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon:{' '}
          <a href={site.officePhoneHref}>{site.officePhone}</a>
          <br />
          Mobil / WhatsApp:{' '}
          <a href={site.phoneHref}>{site.phone}</a>
          <br />
          E-Mail:{' '}
          <a href={site.emailHref}>{site.email}</a>
        </p>

        <h2>Steuernummer</h2>
        <p>Steuernummer: 147/149/70047</p>

        <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
        <p>
          Berufsbezeichnung: Hausmeisterservice
          <br />
          Zuständige Kammer: Handwerkskammer für München und Oberbayern
        </p>

        <h2>Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{' '}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p>
          Wir sind nicht bereit oder verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine
          rechtswidrige Tätigkeit hinweisen.
        </p>
        <p>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon
          unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
          Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
          Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
          Inhalte umgehend entfernen.
        </p>
      </div>
    </div>
  )
}
