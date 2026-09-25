import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { aboutMedia, statistics } from '@/features/home/content'
import Reveal from '@/components/shared/Reveal'
import MediaPlaceholder from '@/components/shared/MediaPlaceholder'
import StatisticItem from '@/components/home/StatisticItem'

export default function About() {
  return (
    <section id="about" className="section section--platinum" aria-labelledby="about-title">
      <div className="site-container about-grid">
        <Reveal className="about-copy">
          <h2 id="about-title">Care is personal here.</h2>
          <p className="lead">Alrata Art of Dentistry combines modern dental care with a thoughtful, patient-first approach.</p>
          <p>
            The team takes time to explain treatment options and create an environment where questions are welcome. From preventive visits to restorative and cosmetic care, each plan starts with the person in the chair.
          </p>
          <Link className="text-link" href="/about-us">Learn about the clinic <ArrowRight size={17} /></Link>
        </Reveal>
        <Reveal className="about-media">
          <MediaPlaceholder media={aboutMedia} label="Dental care" />
        </Reveal>
      </div>
      <div className="site-container stats" aria-label="Clinic statistics placeholders">
        {statistics.map((stat) => <StatisticItem key={stat.label} stat={stat} />)}
      </div>
    </section>
  )
}
