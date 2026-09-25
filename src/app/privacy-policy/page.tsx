import type { Metadata } from 'next'
import LegalPage from '@/components/legal/LegalPage'
import { contact } from '@/data/clinic'
import { siteName } from '@/data/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Learn how ${siteName} handles website enquiries and information provided for SMS messaging.`,
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    type: 'website',
    url: '/privacy-policy',
    siteName,
    title: `Privacy Policy | ${siteName}`,
    description: `Learn how ${siteName} handles website enquiries and information provided for SMS messaging.`,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      effectiveDate="11/01/2024"
      description={
        <p>
          Mamdouh Alrata INC. (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) respects your privacy and is
          committed to protecting your personal information. This Privacy Policy explains how we collect,
          use, and share information when you send a website enquiry or opt in to receive SMS messages from us.
        </p>
      }
    >
      <section>
        <h2>1. Information We Collect</h2>
        <p>When you opt in to receive SMS messages, we collect:</p>
        <ul>
          <li>Your phone number</li>
          <li>Consent to send SMS messages</li>
        </ul>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Send you the SMS messages you&rsquo;ve opted in to receive</li>
          <li>Provide updates, promotions, or other relevant content based on your preferences</li>
        </ul>
      </section>

      <section>
        <h2>3. Sharing Your Information</h2>
        <p>We do not share your phone number or SMS opt-in information with third parties for marketing purposes.</p>
      </section>

      <section>
        <h2>4. Your Rights</h2>
        <p>You can opt out of receiving SMS messages at any time by replying with &ldquo;STOP&rdquo; to any message we send you.</p>
      </section>

      <section>
        <h2>5. Data Security</h2>
        <p>We implement reasonable measures to protect your personal information from unauthorized access or disclosure.</p>
      </section>

      <section>
        <h2>6. Contact Us</h2>
        <p>
          If you have questions or concerns about our privacy practices, contact us at{' '}
          <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.
        </p>
      </section>
      <section>
        <h2>7. Google Maps Reviews</h2>
        <p>
          Our website displays public reviews supplied by Google Maps. We request reviews through our
          server using our clinic listing; we do not send your contact or appointment information with
          these requests. Reviewer images load from Google when displayed, which shares technical
          information such as your IP address with Google. Following a Google Maps link opens Google&rsquo;s service.
          Google&rsquo;s handling of information is governed by the{' '}
          <a href="https://policies.google.com/privacy">Google Privacy Policy</a>, incorporated here for these features.
        </p>
      </section>
      <section>
        <h2>8. Website Enquiries</h2>
        <p>
          When online enquiries are enabled, submitting the form sends your name, phone number,
          email address, treatment selection, new-patient status, preferred contact time, message,
          and confirmation of acceptance of our privacy policy and terms to the clinic through Google Workspace email.
          Our website server processes these details to send the email. The form does not save your
          entries in browser storage or a website database, and our application does not log the message contents.
          Enquiry emails remain in the clinic&rsquo;s email system for staff to respond to your request.
        </p>
        <p>
          Sending an enquiry does not confirm an appointment or subscribe you to marketing or SMS messages.
          Please do not include detailed medical records in the form. For urgent dental care, call the clinic.
        </p>
      </section>
    </LegalPage>
  )
}
