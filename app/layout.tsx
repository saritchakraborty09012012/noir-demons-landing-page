import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const SITE_URL = 'https://noir-demons.vercel.app'
const SITE_NAME = 'NoirDemons'
const SHORT_NAME = 'NDE'
const TAGLINE = 'formerly Novexa'
const DEFAULT_TITLE = 'NDE — NoirDemons | Make the impossible useful | formerly Novexa'
const DEFAULT_DESCRIPTION =
  'NDE (NoirDemons), formerly Novexa, builds intelligent systems for ideas, finance, analytics, education, and the future of development. Make the impossible useful.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s — ${SHORT_NAME} ${SITE_NAME} | ${TAGLINE}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: `${SHORT_NAME} — ${SITE_NAME}`,
  generator: SITE_NAME,
  authors: [{ name: `${SHORT_NAME} (${SITE_NAME})`, url: SITE_URL }],
  creator: `${SHORT_NAME} — ${SITE_NAME}`,
  publisher: `${SHORT_NAME} — ${SITE_NAME}`,
  category: 'technology',
  keywords: [
    'NDE',
    'NDe',
    'nDE',
    'NdE',
    'nde',
    'NoirDemons',
    'Noir Demons',
    'NDE NoirDemons',
    'Novexa',
    'AI development studio',
    'idea validation',
    'EconoMind AI',
    'BlitzData',
    'Solve NCERT',
    'Novexis',
    'software studio India',
    'custom web applications',
    'business analytics',
    'AI native development',
  ],
  verification: {
    google: 'eR1-y-o7eXGMskKYVWwEvKGatkNGdUM5sdrGeDAisjg',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: `${SHORT_NAME} · ${SITE_NAME}`,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/images/noirdemons.png',
        width: 1024,
        height: 1024,
        alt: 'NDE — NoirDemons logo (formerly Novexa)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/images/noirdemons.png'],
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  appleWebApp: {
    capable: true,
    title: `${SHORT_NAME} — ${SITE_NAME}`,
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      '/images/noirdemons.png',
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
  ],
}

const BRAND_ALTERNATES = [
  'NDE',
  'NDe',
  'nDE',
  'NdE',
  'nde',
  'Noir Demons',
  'NDE NoirDemons',
  'Novexa',
]

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: BRAND_ALTERNATES,
  url: SITE_URL,
  logo: `${SITE_URL}/images/noirdemons.png`,
  image: `${SITE_URL}/images/noirdemons.png`,
  email: 'support.noirdemons@puszao.resend.app',
  description: DEFAULT_DESCRIPTION,
  foundingDate: '2026',
  areaServed: 'IN',
  knowsAbout: [
    'AI development',
    'Idea validation',
    'Finance intelligence',
    'Business analytics',
    'Education technology',
    'Custom software development',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: `${SHORT_NAME} — ${SITE_NAME}`,
  alternateName: BRAND_ALTERNATES,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  inLanguage: 'en-IN',
  publisher: { '@id': `${SITE_URL}/#organization` },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}