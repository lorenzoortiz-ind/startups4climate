import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { StartupProvider } from '@/context/StartupContext'
import LayoutShell from '@/components/LayoutShell'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.startups4climate.org'),
  title: 'Startups4Climate | Plataforma all-in-one para startups de impacto',
  description: 'Startups4Climate es una plataforma all-in-one para startups de impacto. Nuestra misión es democratizar el emprendimiento de impacto en América Latina y el Caribe.',
  keywords: [
    'startups de impacto', 'emprendimiento de impacto', 'América Latina y el Caribe',
    'startups LATAM', 'plataforma all-in-one startups', 'herramientas para startups',
    'incubadora virtual', 'aceleradora startups', 'emprendimiento latinoamérica',
    'mentor AI startups', 'grants startups', 'lean canvas español',
    'climate tech LATAM', 'impact startups LAC', 'Redesign Lab'
  ],
  authors: [{ name: 'Redesign Lab' }],
  creator: 'Redesign Lab',
  publisher: 'Redesign Lab',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    alternateLocale: ['es_MX', 'es_CO', 'es_AR', 'es_CL', 'es_ES'],
    url: 'https://www.startups4climate.org',
    title: 'Startups4Climate | Plataforma all-in-one para startups de impacto',
    description: 'Plataforma all-in-one para startups de impacto. Democratizamos el emprendimiento de impacto en América Latina y el Caribe.',
    siteName: 'Startups4Climate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startups4Climate | Plataforma all-in-one para startups de impacto',
    description: 'Plataforma all-in-one para startups de impacto. Democratizamos el emprendimiento de impacto en América Latina y el Caribe.',
  },
  alternates: {
    canonical: 'https://www.startups4climate.org',
  },
}

const SITE_URL = 'https://www.startups4climate.org'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Startups4Climate',
  alternateName: 'S4C',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/s4c-logo-corporate.png`,
    width: 512,
    height: 512,
  },
  description:
    'Plataforma all-in-one para startups de impacto. Democratizamos el emprendimiento de impacto en América Latina y el Caribe.',
  foundingDate: '2025',
  areaServed: [
    { '@type': 'Place', name: 'América Latina y el Caribe' },
  ],
  knowsLanguage: ['es', 'es-419'],
  parentOrganization: {
    '@type': 'Organization',
    name: 'Redesign Lab',
    url: 'https://redesignlab.org',
    sameAs: [
      'https://www.linkedin.com/company/redesignlab',
      'https://www.instagram.com/re.design_lab',
    ],
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'hello@redesignlab.org',
      telephone: '+51-989-338-401',
      areaServed: 'LATAM',
      availableLanguage: ['Spanish'],
    },
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Startups4Climate',
  description:
    'Plataforma all-in-one para startups de impacto en América Latina y el Caribe.',
  inLanguage: 'es-419',
  publisher: { '@id': `${SITE_URL}/#organization` },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es-419"
      className={`${inter.variable} h-full`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <AuthProvider>
          <StartupProvider>
            <LayoutShell>{children}</LayoutShell>
          </StartupProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
