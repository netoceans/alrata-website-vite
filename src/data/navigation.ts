export type NavigationItem = {
  readonly label: string
  readonly href: string
  readonly children?: readonly NavigationItem[]
}

const servicesMenuItems = [
  { label: 'Oral Surgery & Extractions', href: '/oral-surgery-extraction' },
  { label: 'Root Canal Treatment', href: '/root-canal-endodontics' },
  { label: 'Dental Implants', href: '/dental-implants' },
  { label: 'Dental Crowns', href: '/crowns' },
  { label: 'Dental Veneers', href: '/dental-veneers' },
] as const satisfies readonly NavigationItem[]

export const navItems = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/about-us' },
  { label: 'Services', href: '/services', children: servicesMenuItems },
  { label: 'Our Team', href: '/our-team' },
  { label: 'Forms', href: '#' },
  { label: 'Contact', href: '/contacts-us' },
] as const satisfies readonly NavigationItem[]
