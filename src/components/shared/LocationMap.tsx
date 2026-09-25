import { ExternalLink } from 'lucide-react'
import { contact } from '@/data/clinic'

export default function LocationMap({ variant = 'compact' }: { variant?: 'compact' | 'large' }) {
  return (
    <div className={`location-map location-map--${variant}`}>
      <div className={`footer-map-frame${variant === 'large' ? ' location-map-frame--large' : ''}`}>
        <iframe
          src={contact.openStreetMapEmbedHref}
          title='OpenStreetMap preview of Alrata Art of Dentistry'
          loading='lazy'
          tabIndex={-1}
        />
        <a
          className='footer-map-link'
          href={contact.mapHref}
          target='_blank'
          rel='noopener noreferrer'
          aria-label='Open Alrata Art of Dentistry in Google Maps'
        >
          <span>Open in Google Maps <ExternalLink size={14} aria-hidden='true' /></span>
        </a>
      </div>
      <p className='location-map-attribution'>
        Map data © <a href='https://www.openstreetmap.org/copyright' target='_blank' rel='noopener noreferrer'>OpenStreetMap contributors</a>
      </p>
    </div>
  )
}
