import { Link } from 'react-router-dom'
import { partnersIntro, tradePartners } from '../../data/content'

/** Compact home tease — trade partners only; full list stays on /partner. */
export function PartnersSection() {
  return (
    <section className="section partners-teaser" aria-labelledby="partners-teaser-title">
      <div className="container">
        <div className="partners-teaser__header">
          <h2 id="partners-teaser-title" className="partners-teaser__title">
            {partnersIntro.title}
          </h2>
          <p className="partners-teaser__subtitle">
            Starke Meisterbetriebe an unserer Seite – wenn es um mehr als den
            Alltag geht.
          </p>
        </div>

        <ul className="partners-teaser__logos">
          {tradePartners.map((partner) => (
            <li key={partner.id}>
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="partners-teaser__logo-link"
                title={partner.name}
              >
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="partners-teaser__logo"
                  loading="lazy"
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="partners-teaser__cta">
          <Link to="/partner" className="partners-teaser__link">
            Alle Partner ansehen
          </Link>
        </div>
      </div>
    </section>
  )
}
