import { partners, partnersIntro } from '../data/content'
import { CtaSection } from '../components/sections/CtaSection'

export function PartnerPage() {
  return (
    <>
      <div className="page">
        <div className="container">
          <header className="page__header">
            <h1 className="page__title">{partnersIntro.title}</h1>
            <p className="page__intro">{partnersIntro.description}</p>
          </header>

          <div className="partners-grid partners-grid--page">
            {partners.map((partner) => (
              <article
                key={partner.id}
                className={`partner-card partner-card--full${
                  partner.kind === 'network' ? ' partner-card--network' : ''
                }`}
              >
                <div className="partner-card__image-wrap">
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="partner-card__image"
                    loading="lazy"
                  />
                </div>
                <div className="partner-card__body">
                  {partner.kind === 'network' && (
                    <p className="partner-card__badge">Netzwerk / Empfehlung</p>
                  )}
                  <h2 className="partner-card__title">
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {partner.name}
                    </a>
                  </h2>
                  <p className="partner-card__description">{partner.description}</p>
                  <h3 className="partner-card__services-heading">Leistungen:</h3>
                  <ul className="partner-card__services">
                    {partner.services.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-card__link"
                  >
                    Website besuchen →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <CtaSection />
    </>
  )
}
