import { Link } from 'react-router-dom'
import { notfallPage, site, whatsappEmergencyHref } from '../data/content'
import { Button } from '../components/ui/Button'
import { NotfallIcon } from '../components/ui/NotfallIcon'

export function NotfallPage() {
  return (
    <div className="page page--notfall">
      <div className="container">
        <header className="page__header notfall-page__header">
          <div className="notfall-page__eyebrow">
            <span className="notfall-page__eyebrow-badge" aria-hidden="true">
              <NotfallIcon size={16} />
            </span>
            <span>24/7 Notdienst München</span>
          </div>
          <h1 className="page__title">{notfallPage.title}</h1>
          <p className="page__intro">{notfallPage.intro}</p>
        </header>

        <div className="notfall-page__grid">
          <section className="notfall-panel" aria-labelledby="notfall-definition-title">
            <h2 id="notfall-definition-title" className="notfall-panel__title">
              {notfallPage.definitionTitle}
            </h2>
            <p className="notfall-panel__text">{notfallPage.definitionText}</p>

            <h3 className="notfall-panel__subtitle">{notfallPage.examplesTitle}</h3>
            <ul className="notfall-panel__list">
              {notfallPage.examples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>

            <div className="notfall-panel__note">
              <p className="notfall-panel__note-title">{notfallPage.noEmergencyTitle}</p>
              <p className="notfall-panel__note-text">{notfallPage.noEmergencyText}</p>
              <Link to="/termin-anfragen" className="notfall-panel__note-link">
                {notfallPage.noEmergencyCta}
              </Link>
            </div>
          </section>

          <section className="notfall-panel" aria-labelledby="notfall-availability-title">
            <h2 id="notfall-availability-title" className="notfall-panel__title">
              {notfallPage.availabilityTitle}
            </h2>
            <p className="notfall-panel__text">{notfallPage.availabilityText}</p>

            <ul className="notfall-availability">
              {notfallPage.availabilityItems.map((item) => (
                <li key={item.title} className="notfall-availability__item">
                  <span className="notfall-availability__marker" aria-hidden="true" />
                  <div>
                    <h3 className="notfall-availability__title">{item.title}</h3>
                    <p className="notfall-availability__text">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section
          className="notfall-cta"
          aria-labelledby="notfall-cta-title"
        >
          <div className="notfall-cta__content">
            <h2 id="notfall-cta-title" className="notfall-cta__title">
              {notfallPage.ctaTitle}
            </h2>
            <p className="notfall-cta__text">{notfallPage.ctaText}</p>
          </div>
          <div className="notfall-cta__actions">
            <Button href={site.phoneHref} variant="white">
              {notfallPage.callLabel}
            </Button>
            <Button
              href={whatsappEmergencyHref}
              variant="secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {notfallPage.whatsappLabel}
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
