import { HeroCarousel } from '../components/sections/HeroCarousel'
import { ServicesSection } from '../components/sections/ServicesSection'
import { WhyUsSection } from '../components/sections/WhyUsSection'
import { ReviewsSection } from '../components/sections/ReviewsSection'
import { PartnersSection } from '../components/sections/PartnersSection'
import { ServiceAreaSection } from '../components/sections/ServiceAreaSection'
import { CtaSection } from '../components/sections/CtaSection'

export function HomePage() {
  return (
    <>
      <HeroCarousel />
      <ServicesSection />
      <WhyUsSection />
      <ReviewsSection compact />
      <PartnersSection />
      <ServiceAreaSection />
      <CtaSection />
    </>
  )
}
