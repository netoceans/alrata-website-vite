import { services } from '@/data/services'
import Link from 'next/link'
import ServiceGrid from '@/components/shared/ServiceGrid'
import Reveal from '@/components/shared/Reveal'

export default function Services() {
  const photoCredits = [...new Set(services.map(({ media }) => media.credit).filter(Boolean))].join(' · ')
  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="site-container">
        <Reveal className="section-heading section-heading--split">
          <h2 id="services-title">Find the care you need.</h2>
          <p>Explore treatment options, then talk with the clinic about what is appropriate for your health and goals.</p>
        </Reveal>
        <ServiceGrid services={services} />
        <div className="services-footer">
          {photoCredits && <p className="services-credit">Photography: {photoCredits}</p>}
          <Link className="button button--outline services-all" href="/services">View all services</Link>
        </div>
      </div>
    </section>
  )
}
