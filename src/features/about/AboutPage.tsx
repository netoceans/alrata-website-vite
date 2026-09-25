import AboutCta from '@/components/about/AboutCta'
import AboutHero from '@/components/about/AboutHero'
import Overview from '@/components/about/Overview'
import Technology from '@/components/about/Technology'
import VisitInfo from '@/components/about/VisitInfo'

export default function AboutPage() {
  return (
    <div className="about-page">
      <AboutHero />
      <Overview />
      <Technology />
      <VisitInfo />
      <AboutCta />
    </div>
  )
}
