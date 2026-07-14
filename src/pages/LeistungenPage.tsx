import { services } from '../data/content'

const serviceIcons: Record<string, string> = {
  abwassertechnik: '🔧',
  gebaeudereinigung: '✨',
  komplettsanierung: '🏗️',
  hausmeisterservice: '🏠',
  'garten-landschaftspflege': '🌿',
}

export function LeistungenPage() {
  return (
    <div className="page">
      <div className="container">
        <header className="page__header">
          <h1 className="page__title">Leistungen</h1>
          <p className="page__intro">
            Vom Hausmeisterservice über Gebäudereinigung und Abwassertechnik bis
            hin zur Komplettsanierung – wir bieten umfassende Lösungen aus einer
            Hand.
          </p>
        </header>

        <div className="services-grid">
          {services.map((service) => (
            <article key={service.id} className="service-card">
              <div className="service-card__icon" aria-hidden="true">
                {serviceIcons[service.id] ?? '⚙️'}
              </div>
              <h2 className="service-card__title">{service.title}</h2>
              <p className="service-card__description">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
