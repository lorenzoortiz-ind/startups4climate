import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { AuthProvider } from '@/context/AuthContext'
import { StartupProvider } from '@/context/StartupContext'
import LayoutShell from '@/components/LayoutShell'
import './globals.css'

const mluvka = localFont({
  src: [
    { path: '../../public/mluvka/Mluvka-ExtraLight-BF65518ac7eb0fe.otf', weight: '200', style: 'normal' },
    { path: '../../public/mluvka/Mluvka-ExtraLightItalic-BF65518ac82ac8a.otf', weight: '200', style: 'italic' },
    { path: '../../public/mluvka/Mluvka-Light-BF65518ac849790.otf', weight: '300', style: 'normal' },
    { path: '../../public/mluvka/Mluvka-LightItalic-BF65518ac8bc189.otf', weight: '300', style: 'italic' },
    { path: '../../public/mluvka/Mluvka-Regular-BF65518ac8463f5.otf', weight: '400', style: 'normal' },
    { path: '../../public/mluvka/Mluvka-Italic-BF65518ac838b27.otf', weight: '400', style: 'italic' },
    { path: '../../public/mluvka/Mluvka-Medium-BF65518ac864edb.otf', weight: '500', style: 'normal' },
    { path: '../../public/mluvka/Mluvka-MediumItalic-BF65518ac8bbcba.otf', weight: '500', style: 'italic' },
    { path: '../../public/mluvka/Mluvka-SemiBold-BF65518ac864155.otf', weight: '600', style: 'normal' },
    { path: '../../public/mluvka/Mluvka-SemiBoldItalic-BF65518ac86ed6c.otf', weight: '600', style: 'italic' },
    { path: '../../public/mluvka/Mluvka-Bold-BF65518ac8cff8c.otf', weight: '700', style: 'normal' },
    { path: '../../public/mluvka/Mluvka-BoldItalic-BF65518ac840460.otf', weight: '700', style: 'italic' },
    { path: '../../public/mluvka/Mluvka-ExtraBold-BF65518ac86bc69.otf', weight: '800', style: 'normal' },
    { path: '../../public/mluvka/Mluvka-ExtraBoldItalic-BF65518ac8b0001.otf', weight: '800', style: 'italic' },
  ],
  variable: '--font-mluvka',
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
      className={`${mluvka.variable} h-full`}
    >
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
