import { HeroSection } from '../components/sections/HeroSection'
import { ServicesSection } from '../components/sections/ServicesSection'
import { WhyUsSection } from '../components/sections/WhyUsSection'
import { ServiceAreaSection } from '../components/sections/ServiceAreaSection'
import { CtaSection } from '../components/sections/CtaSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <WhyUsSection />
      <ServiceAreaSection compact />
      <CtaSection />
    </>
  )
}
