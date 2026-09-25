import { CalendarDays, Phone } from 'lucide-react'
import { contact } from '@/data/clinic'

export default function MobileBookingBar() {
  return (
    <div className="mobile-booking" aria-label="Quick contact">
      <a href={contact.phoneHref}><Phone size={18} /> Call</a>
      <a href={contact.bookingHref}><CalendarDays size={18} /> Book appointment</a>
    </div>
  )
}
