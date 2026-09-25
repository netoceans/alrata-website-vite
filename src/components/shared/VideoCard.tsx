import { Play } from 'lucide-react'
import type { VideoItem } from '@/types/content'
import MediaPlaceholder from '@/components/shared/MediaPlaceholder'
import DeferredVideo from './DeferredVideo'

export default function VideoCard({ video, featured = false }: { video: VideoItem; featured?: boolean }) {
  return (
    <article className={`video-card ${featured ? 'video-card--featured' : ''}`}>
      {video.media.src ? (
        <div className="video-poster">
          <DeferredVideo media={video.media} />
          {video.media.credit && <span className="media-credit">{video.media.credit}</span>}
        </div>
      ) : (
        <div className="video-poster">
          <MediaPlaceholder media={video.media} label="Video placeholder" />
          <span className="play-mark" aria-hidden="true"><Play fill="currentColor" size={18} /></span>
          <span className="sr-only">Video will be available when clinic media is supplied.</span>
        </div>
      )}
      <div className="video-copy">
        <h3>{video.title}</h3>
        <p className="video-meta">{video.meta}</p>
        <p>{video.description}</p>
      </div>
    </article>
  )
}
