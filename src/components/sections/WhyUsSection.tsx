import { whyUs } from '../../data/content'

export function WhyUsSection() {
  return (
    <section className="section section--alt">
      <div className="container">
        <div className="section__header">
          <h2 className="section__title">Warum AndyArbeit?</h2>
          <p className="section__subtitle">
            Zuverlässig, flexibel und professionell – Ihr Partner in München und
            Umgebung.
          </p>
        </div>

        <div className="why-grid">
          {whyUs.map((item) => (
            <article key={item.title} className="why-card">
              <h3 className="why-card__title">{item.title}</h3>
              <p className="why-card__description">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
