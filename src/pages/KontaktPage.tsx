import { site } from '../data/content'
import { ContactForm } from '../components/ui/ContactForm'

export function KontaktPage() {
  return (
    <div className="page">
      <div className="container">
        <header className="page__header">
          <h1 className="page__title">Kontakt</h1>
          <p className="page__intro">
            Sie benötigen schnelle Hilfe? Schreiben Sie uns oder rufen Sie uns
            direkt an – wir sind für Sie da.
          </p>
        </header>

        <div className="contact-page-grid">
          <div className="contact-info">
            <div className="contact-info__item">
              <p className="contact-info__label">Telefon</p>
              <p className="contact-info__value">
                <a href={site.phoneHref}>{site.phone}</a>
              </p>
            </div>
            <div className="contact-info__item">
              <p className="contact-info__label">E-Mail</p>
              <p className="contact-info__value">
                <a href={site.emailHref}>{site.email}</a>
              </p>
            </div>
            <div className="contact-info__item">
              <p className="contact-info__label">Servicegebiet</p>
              <p className="contact-info__value">Münchner Großraum</p>
            </div>
            <div className="contact-info__item">
              <p className="contact-info__label">Notdienst</p>
              <p className="contact-info__value">24/7 für Abwassertechnik</p>
            </div>
          </div>

          <ContactForm
            title="Kontaktformular"
            subtitle="Füllen Sie das Formular aus – alle Felder sind Pflichtfelder."
          />
        </div>
      </div>
    </div>
  )
}
