import type { ClinicContact } from '@/types/content'

export const contact: ClinicContact = {
  openingHours: {
    display: 'Monday – Friday, 8am – 5pm CDT',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '17:00',
  },
  postalAddress: { streetAddress: '10038 Manchester Rd #226', addressLocality: 'St. Louis', addressRegion: 'MO', postalCode: '63122', addressCountry: 'US' },
  phoneDisplay: '+1 (314) 821-2650',
  phoneHref: 'tel:+13148212650',
  email: 'info@alratadental.com',
  address: '10038 Manchester Rd #226, St. Louis, MO 63122',
  mapHref:
    'https://www.google.com/maps/search/?api=1&query=Alrata+Art+of+Dentistry%2C+10038+Manchester+Rd+%23226%2C+St.+Louis%2C+MO+63122',
  openStreetMapEmbedHref:
    'https://www.openstreetmap.org/export/embed.html?bbox=-90.3920704%2C38.5991636%2C-90.3820704%2C38.6061636&layer=mapnik&marker=38.6026636%2C-90.3870704',
  bookingHref: '/contacts-us#contact-form',
};
