import { Link } from 'react-router-dom'
import { services } from '../../data/content'

const serviceIcons: Record<string, string> = {
  abwassertechnik: '🔧',
  gebaeudereinigung: '✨',
  komplettsanierung: '🏗️',
  hausmeisterservice: '🏠',
  'garten-landschaftspflege': '🌿',
}

type ServicesSectionProps = {
  showAllLink?: boolean
  limit?: number
}

export function ServicesSection({ showAllLink = true, limit }: ServicesSectionProps) {
  const displayedServices = limit ? services.slice(0, limit) : services

  return (
    <section className="section">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">Unsere Dienstleistungen</h2>
          <p className="section__subtitle">
            Umfassende Lösungen aus einer Hand – für Privat, Gewerbe und
            Wohnanlagen.
          </p>
        </div>

        <div className="services-grid">
          {displayedServices.map((service) => (
            <article key={service.id} className="service-card">
              <div className="service-card__icon" aria-hidden="true">
                {serviceIcons[service.id] ?? '⚙️'}
              </div>
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__description">{service.description}</p>
              <Link to="/leistungen" className="service-card__link">
                Mehr erfahren →
              </Link>
            </article>
          ))}
        </div>

        {showAllLink && limit && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/leistungen" className="service-card__link">
              Alle Leistungen ansehen →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
