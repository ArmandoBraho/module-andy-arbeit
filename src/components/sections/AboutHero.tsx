import { about } from '../../data/content'
import { Button } from '../ui/Button'

export function AboutHero() {
  return (
    <section className="about-hero" aria-labelledby="about-hero-title">
      <div className="about-hero__media">
        <img
          src="/andy-portrait.png"
          alt="Andreas Graf von AndyArbeit"
          className="about-hero__image"
        />
        <div className="about-hero__overlay" aria-hidden="true" />
      </div>

      <div className="about-hero__content">
        <h1 id="about-hero-title" className="about-hero__title">
          {about.title}
        </h1>
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="about-hero__text">
            {paragraph}
          </p>
        ))}
        <Button to="/termin-anfragen" variant="primary" className="about-hero__cta">
          Jetzt kontaktieren
        </Button>
      </div>
    </section>
  )
}
