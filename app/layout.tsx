import type { Metadata } from 'next'
import { Montserrat, Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ReentryIQ — Know who\'s coming home, before anyone else does.',
  description:
    'Arizona release intelligence for reentry & recovery programs. Search every upcoming release, get alerted as dates land, push matches to your CRM.',
  metadataBase: new URL('https://reentryiq.com'),
  openGraph: {
    title: 'ReentryIQ — Release Intelligence',
    description: 'Know who\'s coming home, when, and where — so your program reaches them first.',
    url: 'https://reentryiq.com',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
