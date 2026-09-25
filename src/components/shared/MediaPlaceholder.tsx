import type { MediaAsset } from '@/types/content'
import Image from 'next/image'

export default function MediaPlaceholder({ media, label, className = '', sizes = '(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 640px' }: { media: MediaAsset; label: string; className?: string; sizes?: string }) {
  const imageSrc = media.src ?? media.poster
  return (
    <figure className={`media-placeholder media-${media.aspectRatio} ${className}`}>
      <Image fill sizes={sizes} src={imageSrc} alt={media.alt} loading="lazy" decoding="async" />
      {(media.credit || media.placeholder) && (
        <figcaption className="media-label">
          <span>{media.placeholder ? label : media.credit}</span>
        </figcaption>
      )}
    </figure>
  )
}
