import { educationVideos } from '@/features/home/content'
import Reveal from '@/components/shared/Reveal'
import VideoCard from '@/components/shared/VideoCard'

export default function Education() {
  return (
    <section className="section education education--gradient" aria-labelledby="education-title">
      <div className="site-container">
        <Reveal className="section-heading section-heading--split section-heading--inverse">
          <h2 id="education-title">Answers from the dental chair.</h2>
          <p>Short, practical videos can help patients understand common treatments before they arrive.</p>
        </Reveal>
        <div className="education-grid horizontal-mobile">
          {educationVideos.map((video) => <VideoCard key={video.title} video={video} />)}
        </div>
      </div>
    </section>
  )
}
