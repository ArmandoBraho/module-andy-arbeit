import { serviceAreas } from '../data/content'
import { CtaSection } from '../components/sections/CtaSection'

export function ServicegebietPage() {
  return (
    <>
      <div className="page">
        <div className="container">
          <header className="page__header">
            <h1 className="page__title">Servicegebiet</h1>
            <p className="page__intro">
              Wir sind Ihr zuverlässiger Partner für Hausmeisterservice im
              gesamten Münchner Großraum. Kontaktieren Sie uns gerne für weitere
              Informationen zu unserem Servicegebiet.
            </p>
          </header>

          <div className="area-tags" style={{ justifyContent: 'flex-start' }}>
            {serviceAreas.map((area) => (
              <span key={area} className="area-tag">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
      <CtaSection />
    </>
  )
}
