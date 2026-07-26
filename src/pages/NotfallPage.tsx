import { Link } from 'react-router-dom'
import { notfallPage, site, whatsappEmergencyHref } from '../data/content'
import { Button } from '../components/ui/Button'
import { NotfallIcon } from '../components/ui/NotfallIcon'

export function NotfallPage() {
  return (
    <div className="page page--notfall">
      <div className="container notfall-page">
        <header className="notfall-page__header">
          <div className="notfall-page__eyebrow">
            <span className="notfall-page__eyebrow-badge" aria-hidden="true">
              <NotfallIcon size={16} />
            </span>
            <span>{notfallPage.eyebrow}</span>
          </div>
          <h1 className="page__title">{notfallPage.title}</h1>
          <p className="page__intro notfall-page__intro">{notfallPage.intro}</p>

          <div className="notfall-page__actions">
            <Button
              href={whatsappEmergencyHref}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {notfallPage.whatsappLabel}
            </Button>
            <Button href={site.phoneHref} variant="secondary">
              {notfallPage.callLabel}
            </Button>
          </div>
        </header>

        <p className="notfall-page__hours">
          <span className="notfall-page__hours-label">{notfallPage.availabilityLabel}:</span>{' '}
          {notfallPage.availabilityItems.join(' · ')}
        </p>

        <section className="notfall-page__examples" aria-labelledby="notfall-examples-title">
          <h2 id="notfall-examples-title" className="notfall-page__section-title">
            {notfallPage.examplesTitle}
          </h2>
          <ul className="notfall-page__list">
            {notfallPage.examples.map((example) => (
              <li key={example}>{example}</li>
            ))}
          </ul>
        </section>

        <p className="notfall-page__alt">
          {notfallPage.noEmergencyText}{' '}
          <Link to="/termin-anfragen">{notfallPage.noEmergencyCta}</Link>
        </p>
      </div>
    </div>
  )
}
