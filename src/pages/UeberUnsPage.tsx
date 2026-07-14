import { about, whyUs } from '../data/content'
import { WhyUsSection } from '../components/sections/WhyUsSection'
import { CtaSection } from '../components/sections/CtaSection'

export function UeberUnsPage() {
  return (
    <>
      <div className="page">
        <div className="container">
          <header className="page__header">
            <h1 className="page__title">Über uns</h1>
          </header>

          <div className="about-grid">
            <img
              src="/andy-portrait.png"
              alt="Andy von AndyArbeit"
              className="about-grid__image"
            />
            <div>
              <h2 className="content-card__title">{about.title}</h2>
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="content-card__text" style={{ marginBottom: '1rem' }}>
                  {paragraph}
                </p>
              ))}

              <div style={{ marginTop: '1.5rem' }}>
                {whyUs.slice(0, 2).map((item) => (
                  <div key={item.title} className="content-card">
                    <h3 className="content-card__title">{item.title}</h3>
                    <p className="content-card__text">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <WhyUsSection />
      <CtaSection />
    </>
  )
}
