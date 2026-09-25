import Hero from '@/components/home/Hero'
import GoogleReviews from '@/components/home/GoogleReviews'
import PatientStories from '@/components/home/PatientStories'
import About from '@/components/home/About'
import Services from '@/components/home/Services'
import Education from '@/components/home/Education'
import WhyChoose from '@/components/home/WhyChoose'
import Results from '@/components/home/Results'
import OfferSection from '@/components/home/OfferSection'
import DoctorProfile from '@/components/home/DoctorProfile'
import Team from '@/components/home/Team'
import Journey from '@/components/home/Journey'
import FinalCTA from '@/components/home/FinalCTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <GoogleReviews />
      <PatientStories />
      <About />
      <Services />
      <Education />
      <WhyChoose />
      <Results />
      <OfferSection />
      <DoctorProfile />
      <Team />
      <Journey />
      <FinalCTA />
    </>
  )
}
