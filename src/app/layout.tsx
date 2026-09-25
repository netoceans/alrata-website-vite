import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileBookingBar from '@/components/layout/MobileBookingBar'
import { siteDescription, siteName, siteTitle, siteUrl } from '@/data/site'
import { navItems } from '@/data/navigation'
import './globals.css'

const clinicFont = localFont({
  src: '../../public/fonts/TheSans-PLAIN.ttf',
  variable: '--font-clinic',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: siteTitle, template: `%s | ${siteName}` },
  description: siteDescription,
  icons: {
    icon: '/media/FavIcon.png',
    shortcut: '/media/FavIcon.png',
    apple: '/media/FavIcon.png',
  },
  openGraph: { type: 'website', locale: 'en_US', siteName, title: siteTitle, description: siteDescription },
  twitter: { card: 'summary', title: siteTitle, description: siteDescription },
}

export const viewport: Viewport = { themeColor: '#143b5d' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={clinicFont.variable}>
      {/* Extensions such as Grammarly add body attributes before React hydrates.
          Limit suppression to this element; descendant mismatches remain visible. */}
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Header items={navItems} />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
        <MobileBookingBar />
      </body>
    </html>
  )
}
