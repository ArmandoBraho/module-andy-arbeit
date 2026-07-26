import { cta, site } from '../../data/content'
import { Button } from '../ui/Button'

export function CtaSection() {
  return (
    <section className="cta-band">
      <div className="container">
        <h2 className="cta-band__title">{cta.title}</h2>
        <p className="cta-band__description">{cta.description}</p>

        <Button href={site.phoneHref} variant="white">
          Jetzt anrufen
        </Button>
      </div>
    </section>
  )
}
