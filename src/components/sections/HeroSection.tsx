import { hero, site } from '../../data/content'
import { Button } from '../ui/Button'
import { ContactForm } from '../ui/ContactForm'

export function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <div className="hero__content">
          <span className="hero__badge">{hero.subtitle}</span>
          <h1 className="hero__title">{hero.title}</h1>
          <p className="hero__intro">{hero.intro}</p>
          <p className="hero__description">{hero.description}</p>

          <ul className="hero__usps">
            {hero.usps.map((usp) => (
              <li key={usp} className="hero__usp">
                <span className="hero__usp-icon" aria-hidden="true">
                  ✓
                </span>
                {usp}
              </li>
            ))}
          </ul>

          <div className="hero__actions">
            <Button href={site.phoneHref} variant="primary">
              Jetzt anrufen
            </Button>
            <Button to="/leistungen" variant="secondary">
              Leistungen & Preise
            </Button>
          </div>
        </div>

        <ContactForm
          title="Anfrage senden"
          subtitle="Wir melden uns schnellstmöglich bei Ihnen – kostenlos & unverbindlich."
        />
      </div>
    </section>
  )
}
