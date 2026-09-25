import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import Reveal from '@/components/shared/Reveal'
import { technology } from '@/features/about/content'

export default function Technology() {
  return (
    <section className="section about-technology" aria-labelledby="about-technology-title">
      <div className="site-container about-technology-grid">
        <Reveal className="about-section-copy">
          <p className="about-eyebrow">{technology.eyebrow}</p>
          <h2 id="about-technology-title">{technology.title}</h2>
          <p className="about-section-lead">{technology.description}</p>

          <div className="about-technology-list">
            {technology.items.map((item) => (
              <article key={item.title}>
                <span aria-hidden="true"><Check size={16} /></span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          <Link className="button button--outline" href="/services">
            View our services <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal className="about-technology-media">
          <div className="about-technology-smile">
            <Image fill loading="lazy" sizes="(max-width: 820px) 44vw, 280px" src={technology.media.smile.src} alt={technology.media.smile.alt} />
          </div>
          <div className="about-technology-care">
            <Image fill loading="lazy" sizes="(max-width: 820px) 44vw, 280px" src={technology.media.care.src} alt={technology.media.care.alt} />
          </div>
          <div className="about-technology-team">
            <Image fill loading="lazy" sizes="(max-width: 820px) 44vw, 280px" src={technology.media.team.src} alt={technology.media.team.alt} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
