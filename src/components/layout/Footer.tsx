import { Mail, MapPin, Phone } from 'lucide-react';
import LocationMap from '@/components/shared/LocationMap';
import { contact } from '@/data/clinic';
import { services } from '@/data/services';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id='contact' className='footer'>
      <div className='site-container footer-grid'>
        <div className='footer-brand'>
          <Link
            href='/#home'
            className='logo'
            aria-label='Alrata Art of Dentistry home'
          >
            <Image
              src='/media/FooterLogo-1.png'
              alt='Alrata Art of Dentistry'
              width={900}
              height={900}
            />
          </Link>
          <p>
            Personalized dental care in a welcoming, modern setting in St.
            Louis, Missouri.
          </p>
          <a className='button button--light' href={contact.bookingHref}>
            Book appointment
          </a>
          <div className='footer-social'>
            <p className='footer-social-title'>Follow Us</p>
            <div className='footer-social-links'>
              <a
                className='footer-social-link'
                href='https://www.instagram.com/alratadental/'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Follow Alrata Dental on Instagram'
              >
                <svg viewBox='0 0 24 24' aria-hidden='true'>
                  <rect x='3' y='3' width='18' height='18' rx='5' />
                  <circle cx='12' cy='12' r='4' />
                  <circle
                    cx='17.5'
                    cy='6.5'
                    r='1'
                    className='footer-social-dot'
                  />
                </svg>
              </a>
              <a
                className='footer-social-link'
                href='https://www.tiktok.com/@alratadental'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Follow Alrata Dental on TikTok'
              >
                <svg viewBox='0 0 24 24' aria-hidden='true'>
                  <path d='M15.5 3c.3 1.8 1.3 3 3.1 3.2v3.1c-1.5-.1-2.8-.6-3.9-1.4v6.7c0 4-2.8 6.4-6.2 6.4C5.4 21 3 18.7 3 15.5c0-3 2.2-5.4 5.2-5.8v3.2c-1.1.2-1.9 1.1-1.9 2.4 0 1.5 1 2.6 2.4 2.6 1.6 0 2.7-1.1 2.7-3.3V3h4.1Z' />
                </svg>
              </a>
              <a
                className='footer-social-link'
                href='https://web.facebook.com/alratadental?_rdc=1&_rdr'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Follow Alrata Dental on Facebook'
              >
                <svg viewBox='0 0 24 24' aria-hidden='true'>
                  <path d='M14.5 8H16V5.2c-.3 0-1.4-.2-2.7-.2-2.7 0-4.5 1.6-4.5 4.6V12H6v3.1h2.8V22h3.4v-6.9H15l.4-3.1h-3.2V9.9c0-.9.2-1.9 1.3-1.9Z' />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div>
          <h2>Services</h2>
          <ul>
            {services.slice(0, 5).map((service) => (
              <li key={service.name}>
                <a href={service.href}>{service.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Clinic</h2>
          <ul>
            <li><Link href='/contacts-us'>Contact us</Link></li>
            <li>
              <Link href='/about-us'>About</Link>
            </li>
            <li>
              <Link href='/our-team'>Our team</Link>
            </li>
            <li>
              <Link href='/#offers'>Offers</Link>
            </li>
            <li>
              <Link href='/privacy-policy'>Privacy policy</Link>
            </li>
            <li>
              <Link href='/terms-of-service'>Terms of service</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Contact</h2>
          <address>
            <a href={contact.mapHref} target='_blank' rel='noopener noreferrer'>
              <MapPin size={17} /> {contact.address}
            </a>
            <a href={contact.phoneHref}>
              <Phone size={17} /> {contact.phoneDisplay}
            </a>
            <a href={`mailto:${contact.email}`}>
              <Mail size={17} /> {contact.email}
            </a>
          </address>
          <p className='footer-hours'>
            {contact.openingHours.display}
          </p>
        </div>
        <div className='footer-location'>
          <h2>Our Location</h2>
          <LocationMap />
        </div>
      </div>
      <div className='site-container footer-bottom'>
        <span>© {new Date().getFullYear()} Alrata Art of Dentistry</span>
        <a
          className='footer-credit'
          href='https://netoceans.com/'
          target='_blank'
          rel='noopener noreferrer'
        >
          Designed By Net Oceans
        </a>
        <span>{contact.address}</span>
      </div>
    </footer>
  );
}
