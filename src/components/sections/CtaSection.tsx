import { cta, site } from '../../data/content'
import { Button } from '../ui/Button'
import { PhoneIcon } from '../ui/PhoneIcon'
import { MailIcon } from '../ui/MailIcon'

export function CtaSection() {
  return (
    <section className="cta-band">
      <div className="container">
        <h2 className="cta-band__title">{cta.title}</h2>
        <p className="cta-band__description">{cta.description}</p>

        <div className="cta-band__contacts">
          <a href={site.phoneHref} className="cta-band__contact">
            <PhoneIcon size={18} />
            {site.phone}
          </a>
          <a href={site.emailHref} className="cta-band__contact">
            <MailIcon size={18} />
            {site.email}
          </a>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <Button href={site.phoneHref} variant="white">
            Jetzt anrufen
          </Button>
        </div>
      </div>
    </section>
  )
}
