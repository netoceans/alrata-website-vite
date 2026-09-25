import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { doctorProfile } from '@/features/home/content'
import Reveal from '@/components/shared/Reveal'
import MediaPlaceholder from '@/components/shared/MediaPlaceholder'

export default function DoctorProfile() {
  return (
    <section className="section doctor-profile" aria-labelledby="doctor-profile-title">
      <div className="site-container doctor-profile-grid">
        <Reveal className="doctor-profile-media">
          <MediaPlaceholder
            media={doctorProfile.media}
            label="Dr. Mamdouh Alrata portrait"
            sizes="(max-width: 820px) 100vw, 520px"
          />
        </Reveal>

        <Reveal className="doctor-profile-copy">
          <p className="doctor-profile-eyebrow">Your St. Louis dentist</p>
          <h2 id="doctor-profile-title">Meet Dr. Mamdouh Alrata, DDS.</h2>
          <p className="doctor-profile-lead">
            Dr. Alrata has provided thoughtful, comprehensive dental care since 2012, helping patients feel informed and confident at every stage of treatment.
          </p>
          <p>
            With advanced training in esthetic and restorative dentistry, he combines careful treatment planning with a personalized approach to each smile. In 2023, the PDS organization recognized Dr. Alrata as a top dentist nationwide for his dedication to high-quality patient care.
          </p>

          <dl className="doctor-profile-credentials" aria-label="Dr. Alrata's education and credentials">
            {doctorProfile.credentials.map((credential) => (
              <div key={credential.label}>
                <dt>{credential.label}</dt>
                <dd>{credential.value}</dd>
              </div>
            ))}
          </dl>

          <p className="doctor-profile-personal">
            Outside the practice, Dr. Alrata enjoys spending time with his daughters, Reema and Layana. Together, they enjoy movies, outdoor activities, and discovering new restaurants.
          </p>

          <Link className="text-link" href={doctorProfile.href}>
            Read Dr. Alrata&apos;s full profile <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
