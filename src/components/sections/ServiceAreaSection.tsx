import { Link } from 'react-router-dom'
import { serviceAreas } from '../../data/content'

type ServiceAreaSectionProps = {
  compact?: boolean
}

export function ServiceAreaSection({ compact = false }: ServiceAreaSectionProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">Unser Servicegebiet</h2>
          <p className="section__subtitle">
            Wir sind Ihr zuverlässiger Partner im gesamten Münchner Großraum.
            Kontaktieren Sie uns gerne für weitere Informationen.
          </p>
        </div>

        <div className="area-tags">
          {serviceAreas.map((area) => (
            <span key={area} className="area-tag">
              {area}
            </span>
          ))}
        </div>

        {compact && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/servicegebiet" className="service-card__link">
              Alle Einsatzgebiete →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
