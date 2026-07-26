import { site } from '../data/content'

export function DatenschutzPage() {
  return (
    <div className="page">
      <div className="container legal-content">
        {/*
          LAWYER REVIEW: This text is drafted from the live codebase (Impressum,
          AppointmentForm/Web3Forms, WhatsApp wa.me links, self-hosted Inter fonts,
          Leaflet + OpenStreetMap tiles, unpkg marker assets). Confirm hosting provider,
          Web3Forms processing location / DPA, retention periods, and whether a
          Datenschutzbeauftragter is required. Not legal advice.
        */}
        <header className="page__header">
          <h1 className="page__title">Datenschutzerklärung</h1>
        </header>

        <p>
          Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Nachfolgend
          informieren wir Sie gemäß der Datenschutz-Grundverordnung (DSGVO) und
          dem Bundesdatenschutzgesetz (BDSG) über die Verarbeitung
          personenbezogener Daten beim Besuch und der Nutzung dieser Website.
        </p>

        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website ist:
        </p>
        <p>
          AndyArbeit
          <br />
          Andreas Graf
          <br />
          Thaddäus-Eck-Str. 15
          <br />
          81247 München
        </p>
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
        <p>
          Weitere Angaben zum Anbieter finden Sie im{' '}
          <a href="/impressum">Impressum</a>.
        </p>
        {/* LAWYER REVIEW: Add Datenschutzbeauftragter section only if legally required. */}

        <h2>2. Überblick: Welche Daten verarbeiten wir?</h2>
        <p>
          Je nach Nutzung der Website können folgende Kategorien
          personenbezogener Daten betroffen sein:
        </p>
        <p>
          <strong>Nutzungs- und technische Daten:</strong> u. a. IP-Adresse,
          Datum und Uhrzeit der Anfrage, Browsertyp/-version, Betriebssystem,
          Referrer-URL sowie aufgerufene Seiten – soweit dies beim Abruf der
          Website, von Schriftarten, Kartendaten oder anderen eingebundenen
          Ressourcen technisch anfällt.
        </p>
        <p>
          <strong>Kontaktdaten und Anfragedaten</strong> (bei Nutzung der
          Terminanfrage oder bei Kontaktaufnahme): Vorname, Nachname, E-Mail,
          Telefonnummer, Adresse des Einsatzorts, gewünschte Leistung,
          Wunschdatum und -uhrzeit sowie Beschreibung des Anliegens.
        </p>
        <p>
          <strong>Kommunikationsdaten</strong> bei Nutzung von WhatsApp oder
          Telefon: die von Ihnen übermittelten Nachrichteninhalte sowie die von
          WhatsApp bzw. dem Telekommunikationsanbieter verarbeiteten
          Verbindungs- und Profildaten.
        </p>

        <h2>3. Zwecke und Rechtsgrundlagen</h2>
        <p>Wir verarbeiten personenbezogene Daten zu folgenden Zwecken:</p>
        <p>
          <strong>Bereitstellung und Betrieb der Website</strong> (Darstellung
          der Inhalte, Sicherheit und Stabilität) – Rechtsgrundlage: Art. 6 Abs.
          1 lit. f DSGVO (berechtigtes Interesse an einem funktionsfähigen und
          sicheren Online-Angebot).
        </p>
        <p>
          <strong>Bearbeitung von Terminanfragen und Kontaktaufnahmen</strong>{' '}
          (inkl. Rückfragen, Terminabstimmung und Auftragsanbahnung) –
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen
          bzw. Vertragserfüllung) sowie ggf. Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse an effizienter Kommunikation).
        </p>
        <p>
          <strong>Erfüllung rechtlicher Pflichten</strong> (z. B.
          handels- oder steuerrechtliche Aufbewahrung) – Rechtsgrundlage: Art. 6
          Abs. 1 lit. c DSGVO.
        </p>

        <h2>4. Hosting der Website</h2>
        <p>
          Diese Website ist eine mit Vite gebaute React-Anwendung (statische
          Frontend-Dateien). Beim Aufruf der Seiten werden technisch notwendige
          Server-Logdaten beim jeweiligen Hosting-Anbieter verarbeitet (typischerweise
          IP-Adresse, Zeitpunkt, angeforderte Datei, User-Agent).
        </p>
        <p>
          Hosting- und Auslieferungsdienstleister ist{' '}
          <strong>Cloudflare, Inc.</strong> (USA; globale Content-Delivery-Infrastruktur,
          u. a. auch Standorte in der EU). Weitere Informationen:{' '}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutzerklärung von Cloudflare
          </a>
          ; Auftragsverarbeitung:{' '}
          <a
            href="https://www.cloudflare.com/cloudflare-customer-dpa/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflare Data Processing Addendum (DPA)
          </a>
          .
        </p>
        <p>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
          sicherer und erreichbarer Bereitstellung der Website).
        </p>

        <h2>5. Terminanfrage-Formular (Web3Forms)</h2>
        <p>
          Auf der Seite „Terminanfrage“ können Sie uns unverbindlich eine Anfrage
          senden. Dabei werden die von Ihnen eingegebenen Daten an unseren
          Formular-Dienstleister{' '}
          <strong>Web3Forms</strong> übermittelt (
          <a
            href="https://api.web3forms.com/submit"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://api.web3forms.com/submit
          </a>
          ) und anschließend an uns per E-Mail weitergeleitet.
        </p>
        <p>Erhobene Felder (soweit von Ihnen ausgefüllt):</p>
        <p>
          Vorname, Nachname, E-Mail-Adresse, Telefonnummer, Adresse des
          Einsatzorts, Leistungsart, Wunschdatum, Wunschuhrzeit,
          Problembeschreibung / Nachricht.
        </p>
        <p>
          Zweck: Bearbeitung Ihrer Terminanfrage, Kontaktaufnahme und
          Terminabstimmung. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
        </p>
        <p>
          Web3Forms verarbeitet die Übermittlung als Auftragsverarbeiter bzw.
          Dienstleister zur Zustellung der Formulardaten. Nähere Informationen:
          Website und Datenschutzhinweise von Web3Forms (
          <a
            href="https://web3forms.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://web3forms.com
          </a>
          ).
        </p>
        {/* LAWYER REVIEW: Confirm Web3Forms AVV/DPA is concluded; document storage region and retention on their side. */}
        <p>
          Zusätzlich kann in der an uns gesendeten Benachrichtigung ein Link zur
          Anlage eines Kalendereintrags (z. B. Google Calendar) enthalten sein.
          Dieser Link dient der internen Terminorganisation und wird nicht dazu
          genutzt, Ihr Surfverhalten auf der Website zu tracken.
        </p>

        <h2>6. WhatsApp</h2>
        <p>
          Auf der Website finden Sie Links bzw. Schaltflächen, die einen Chat
          über WhatsApp öffnen (u. a. über{' '}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
          >
            wa.me
          </a>
          , Zielnummer: +49 176 6762 0599). Beim Anklicken verlassen Sie unsere
          Website und es gelten die Datenschutzbestimmungen von WhatsApp /
          Meta Platforms.
        </p>
        <p>
          Wenn Sie uns per WhatsApp kontaktieren, verarbeiten wir die von Ihnen
          übermittelten Inhalte (z. B. Name, Adresse, Anliegen) zur Bearbeitung
          Ihrer Anfrage – Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO bzw. Art. 6
          Abs. 1 lit. f DSGVO. WhatsApp selbst erhebt und verarbeitet dabei
          weitere Daten gemäß eigener Richtlinien.
        </p>
        <p>
          Datenschutzhinweise von WhatsApp:{' '}
          <a
            href="https://www.whatsapp.com/legal/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.whatsapp.com/legal/privacy-policy
          </a>
        </p>
        {/* LAWYER REVIEW: Consider offering a non-WhatsApp channel prominently; assess Meta transfer risks (SCC/adequacy). */}

        <h2>7. Schriftarten (selbst gehostet)</h2>
        <p>
          Zur einheitlichen Darstellung verwenden wir die Schriftart „Inter“.
          Die Schriftdateien werden von unserem eigenen Webserver / Hosting
          ausgeliefert. Beim Aufruf der Website findet{' '}
          <strong>keine</strong> Verbindung zu Google Fonts (
          fonts.googleapis.com / fonts.gstatic.com) oder anderen
          Schriftarten-CDNs statt. Es werden dabei keine personenbezogenen Daten
          an Google übermittelt.
        </p>
        <p>
          Zweck: ansprechende und einheitliche Typografie. Rechtsgrundlage: Art.
          6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer konsistenten
          Darstellung der Website).
        </p>

        <h2>8. Karte: Leaflet und OpenStreetMap</h2>
        <p>
          Auf Seiten mit Servicegebiet-Darstellung (u. a. Startseite /
          Servicegebiet) zeigen wir eine interaktive Karte mit der Bibliothek{' '}
          <strong>Leaflet</strong>. Die Kartenkacheln werden von{' '}
          <strong>OpenStreetMap</strong> geladen (
          <code>tile.openstreetmap.org</code>). Marker-Grafiken können von{' '}
          <code>unpkg.com</code> (Leaflet-Assets) nachgeladen werden.
        </p>
        <p>
          Beim Anzeigen der Karte stellt Ihr Browser Verbindungen zu den
          genannten Diensten her. Dabei können insbesondere Ihre IP-Adresse sowie
          technische Abrufdaten verarbeitet werden. OpenStreetMap Foundation /
          die Tile-Server betreiben die Karteninfrastruktur nach eigenen Regeln.
        </p>
        <p>
          Zweck: Visualisierung unseres Einsatzgebiets. Rechtsgrundlage: Art. 6
          Abs. 1 lit. f DSGVO. Hinweise der OpenStreetMap Foundation:{' '}
          <a
            href="https://wiki.osmfoundation.org/wiki/Privacy_Policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy (OSMF)
          </a>
        </p>
        {/* LAWYER REVIEW: Codebase still mentions VITE_GOOGLE_MAPS_API_KEY in .env.example, but the live map uses Leaflet/OSM – do not claim Google Maps unless re-enabled. */}

        <h2>9. Telefon und E-Mail</h2>
        <p>
          Wenn Sie uns telefonisch oder per E-Mail kontaktieren, verarbeiten wir
          die dabei mitgeteilten Daten zur Bearbeitung Ihres Anliegens
          (Rechtsgrundlage: Art. 6 Abs. 1 lit. b und/oder lit. f DSGVO).
        </p>

        <h2>10. Speicherdauer</h2>
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie es für die
          jeweiligen Zwecke erforderlich ist oder gesetzliche
          Aufbewahrungsfristen bestehen.
        </p>
        <p>
          Terminanfragen und korrespondierende E-Mails löschen bzw. sperren wir
          regelmäßig, sobald die Anfrage abschließend bearbeitet ist und keine
          gesetzlichen oder berechtigten Aufbewahrungsgründe (z. B. laufende
          Kundenbeziehung, Nachweispflichten) entgegenstehen. Typische
          handels- und steuerrechtliche Fristen können bis zu 6 bzw. 10 Jahre
          betragen.
        </p>
        <p>
          Server- und Zugriffsprotokolle beim Hosting werden in der Regel
          kurzfristig und zweckgebunden vorgehalten (häufig Tage bis wenige
          Wochen), sofern der Hostinganbieter nichts Abweichendes vorsieht.
        </p>
        {/* LAWYER REVIEW: Align concrete retention schedule with the operator’s mailbox/process and host log policy. */}

        <h2>11. Empfänger und Drittlandübermittlung</h2>
        <p>
          Empfänger können sein: wir selbst als Verantwortlicher; technische
          Dienstleister (Hosting, Web3Forms, Karten- und ggf. CDN-Anbieter); WhatsApp/Meta bei Nutzung von WhatsApp; sowie
          Behörden, soweit wir rechtlich dazu verpflichtet sind.
        </p>
        <p>
          Bei Diensten mit Sitz außerhalb der EU/des EWR (z. B. Google, Meta,
          ggf. Web3Forms/CDN-Infrastruktur) kann eine Übermittlung in Drittländer
          erfolgen. Soweit erforderlich, stützen wir uns auf Angemessenheitsbeschlüsse
          oder geeignete Garantien (z. B. Standardvertragsklauseln) der jeweiligen
          Anbieter.
        </p>

        <h2>12. Cookies und Tracking</h2>
        <p>
          Beim ersten Besuch zeigen wir einen Hinweis zu Cookies. Technisch
          notwendige Speichervorgänge (z.&nbsp;B. Speicherung Ihrer
          Cookie-Auswahl im lokalen Speicher des Browsers) sind für den Betrieb
          der Website erforderlich.
        </p>
        <p>
          Optionale Statistik-Funktionen werden nur ausgeführt, wenn Sie dem
          ausdrücklich zustimmen. Mit Einwilligung in „Statistik“ speichern wir
          lokal im Browser Informationen zu Sitzungen (Anzahl) und
          Sitzungsdauer. Ein neuer Besuch nach längerer Pause (ca. 30 Minuten)
          gilt als neue Sitzung. Die Auswertung bleibt auf Ihrem Gerät, sofern
          kein gesonderter Analyse-Endpunkt konfiguriert ist. Sie können Ihre
          Auswahl jederzeit über „Cookie-Einstellungen“ im Fußbereich ändern
          oder widerrufen; danach wird keine neue Statistik mehr erfasst.
        </p>
        <p>
          Marketing-Cookies setzen wir derzeit nicht ein.
        </p>

        <h2>13. Keine automatisierte Entscheidungsfindung</h2>
        <p>
          Es findet keine automatisierte Entscheidungsfindung einschließlich
          Profiling gemäß Art. 22 DSGVO statt.
        </p>

        <h2>14. Ihre Rechte</h2>
        <p>Sie haben – vorbehaltlich der gesetzlichen Voraussetzungen – das Recht auf:</p>
        <p>
          Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art.
          17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO),
          Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch gegen
          Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21
          DSGVO).
        </p>
        <p>
          Sofern eine Verarbeitung auf Einwilligung beruht, können Sie diese
          jederzeit mit Wirkung für die Zukunft widerrufen.
        </p>
        <p>
          Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung an{' '}
          <a href="mailto:kontakt@andyarbeit.info">kontakt@andyarbeit.info</a>.
        </p>
        <p>
          Sie haben zudem das Recht, sich bei einer Datenschutzaufsichtsbehörde
          zu beschweren. Zuständig ist u. a. das Bayerische Landesamt für
          Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach,{' '}
          <a
            href="https://www.lda.bayern.de"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.lda.bayern.de
          </a>
          .
        </p>

        <h2>15. Berechtigte Interessen und Widerspruch</h2>
        <p>
          Soweit wir Daten auf Grundlage berechtigter Interessen verarbeiten
          (Art. 6 Abs. 1 lit. f DSGVO), können Sie der Verarbeitung aus Gründen,
          die sich aus Ihrer besonderen Situation ergeben, widersprechen. Wir
          prüfen dann, ob schutzwürdige Interessen Ihrerseits überwiegen.
        </p>

        <h2>16. Sicherheit</h2>
        <p>
          Wir treffen angemessene technische und organisatorische Maßnahmen, um
          Ihre Daten vor Verlust, Missbrauch und unbefugtem Zugriff zu schützen.
          Die Website wird über HTTPS ausgeliefert, sofern der Hostinganbieter
          dies entsprechend konfiguriert.
        </p>

        <h2>17. Aktualität</h2>
        <p>
          Stand dieser Datenschutzerklärung: Juli 2026. Wir behalten uns vor,
          diese Hinweise anzupassen, wenn sich die Website, eingesetzte Dienste
          oder die Rechtslage ändern.
        </p>
      </div>
    </div>
  )
}
