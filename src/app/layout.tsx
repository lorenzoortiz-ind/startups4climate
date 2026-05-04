import type { Metadata } from 'next'
import { AuthProvider } from '@/context/AuthContext'
import { StartupProvider } from '@/context/StartupContext'
import LayoutShell from '@/components/LayoutShell'
import './globals.css'

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
    // OG image dinámica generada por src/app/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startups4Climate | Plataforma all-in-one para startups de impacto',
    description: 'Plataforma all-in-one para startups de impacto. Democratizamos el emprendimiento de impacto en América Latina y el Caribe.',
    // Twitter image también se toma de opengraph-image.tsx por convención de Next
  },
  alternates: {
    canonical: 'https://www.startups4climate.org',
    languages: {
      'es-419': 'https://www.startups4climate.org',
      'x-default': 'https://www.startups4climate.org',
    },
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

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Startups4Climate',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  description:
    'Plataforma all-in-one con herramientas interactivas, mentor AI y diagnóstico de startup readiness para founders de impacto en LATAM.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Acceso gratuito para founders',
  },
  featureList: [
    'Diagnóstico de Startup Readiness',
    'Mentor AI personalizado',
    '+30 herramientas interactivas',
    'Lean Canvas, BMC, análisis financiero',
    'RADAR del ecosistema LATAM',
    'Oportunidades de financiamiento',
  ],
  provider: { '@id': `${SITE_URL}/#organization` },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué es Startups4Climate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Startups4Climate es una plataforma all-in-one gratuita para founders de startups de impacto en América Latina. Ofrece herramientas interactivas, mentor AI, diagnóstico de startup readiness y visibilidad de oportunidades de financiamiento.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Es gratis usar Startups4Climate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. El acceso para founders es completamente gratuito. Incluye +30 herramientas interactivas, mentor AI personalizado, diagnóstico de readiness y acceso al RADAR del ecosistema.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Para qué países está disponible?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Startups4Climate está disponible para founders de toda América Latina y el Caribe, con enfoque en Perú, Colombia, Chile, México, Argentina y Brasil.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo funciona para universidades e incubadoras?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Las organizaciones pueden gestionar cohortes de startups, invitar founders por email, ver dashboards en tiempo real, generar reportes Excel y dar acceso a +30 herramientas interactivas y mentor AI.',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es-419"
      className="h-full"
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <a href="#main-content" className="skip-to-content">
          Saltar al contenido
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
