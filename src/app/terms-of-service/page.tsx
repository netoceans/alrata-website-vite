import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage from '@/components/legal/LegalPage'
import { contact } from '@/data/clinic'
import { siteName } from '@/data/site'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Review the terms for receiving SMS messages from ${siteName}.`,
  alternates: { canonical: '/terms-of-service' },
  openGraph: {
    type: 'website',
    url: '/terms-of-service',
    siteName,
    title: `Terms of Service | ${siteName}`,
    description: `Review the terms for receiving SMS messages from ${siteName}.`,
  },
}

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      effectiveDate="11/01/2024"
      description={
        <>
          <p className="legal-compliance">10DLC Compliant</p>
          <p>
            By opting in to receive SMS messages from <strong>Alrata Art of Dentistry</strong> (&ldquo;we,&rdquo;
            &ldquo;us,&rdquo; &ldquo;our&rdquo;), you agree to the following terms:
          </p>
        </>
      }
    >
      <section>
        <h2>1. SMS Messaging Service</h2>
        <p>By providing your phone number, you consent to receive SMS messages, including updates, promotions, and other relevant content.</p>
      </section>

      <section>
        <h2>2. Message Frequency</h2>
        <p>You will receive <strong>up to 4 messages per month</strong>.</p>
      </section>

      <section>
        <h2>3. Message and Data Rates</h2>
        <p>Message and data rates may apply based on your mobile carrier&rsquo;s terms.</p>
      </section>

      <section>
        <h2>4. Privacy Policy</h2>
        <p>
          Your information will be handled in accordance with our Privacy Policy, which can be viewed at{' '}
          <Link href="/privacy-policy">https://alratadental.com/privacy-policy/</Link>.
        </p>
      </section>

      <section>
        <h2>5. Opt-Out Instructions</h2>
        <p>
          You can opt out at any time by replying &ldquo;STOP&rdquo; to any SMS message. You may also contact us directly at{' '}
          <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.
        </p>
      </section>

      <section>
        <h2>6. Liability</h2>
        <p>We are not responsible for any charges, errors, or delays in SMS delivery caused by your carrier or third-party service providers.</p>
      </section>

      <p className="legal-confirmation">
        By opting in, you confirm that you are the owner or authorized user of the phone number provided and that you are at least 18 years old.
      </p>
      <section>
        <h2>7. Google Maps Reviews</h2>
        <p>
          Google Maps review features are subject to the{' '}
          <a href="https://maps.google.com/help/terms_maps/">Google Maps/Google Earth Additional Terms of Service</a>,
          incorporated into these terms. Reviews reflect their authors&rsquo; experiences and are selected
          and ordered by Google. They do not guarantee a particular treatment outcome. Read the{' '}
          <a href="https://policies.google.com/privacy">Google Privacy Policy</a> for information about Google&rsquo;s data practices.
        </p>
      </section>
    </LegalPage>
  )
}
