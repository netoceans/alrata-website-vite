import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Service } from '@/types/content'

export default function ServiceGrid({ services }: { services: readonly Service[] }) {
  return (
    <div className="services-grid">
      {services.map((service) => (
        <Link key={service.slug} className="service-card" href={service.href} prefetch={false}>
          <div className="service-card-image">
            <Image fill sizes="(max-width: 640px) min(400px, calc(100vw - 32px)), (max-width: 1024px) 370px, 346px"
              src={service.media.src ?? service.media.poster} alt={service.media.alt} loading="lazy" decoding="async" />
            <span className="service-card-arrow" aria-hidden="true"><ArrowRight size={18} /></span>
          </div>
          <div className="service-card-copy">
            <h3>{service.name}</h3>
            <p>{service.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
