import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Startups4Climate | El Sistema Operativo para Escalar Soluciones Climáticas en Latam',
  description:
    'Plataforma de herramientas operativas para fundadores de climate tech en Latinoamérica. Diagnóstico inteligente, recursos especializados y rutas de capital adaptadas a tu etapa.',
  keywords: [
    'startups climáticas',
    'climate tech',
    'investor readiness',
    'Latam',
    'blended finance',
    'fondos climáticos',
    'fundraising',
    'FOAK',
    'deep tech',
  ],
  authors: [{ name: 'Redesign Lab' }],
  openGraph: {
    type: 'website',
    url: 'https://startups4climate.org',
    title: 'Startups4Climate | El Sistema Operativo para Escalar Soluciones Climáticas',
    description:
      'Diagnostica tu Climate Readiness en 5 minutos. Herramientas operativas para fundadores de climate tech en Latinoamérica.',
    siteName: 'Startups4Climate',
    images: [
      {
        url: 'https://startups4climate.org/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Startups4Climate — Climate Tech Toolkit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startups4Climate | Climate Readiness para Latam',
    description:
      'Diagnostica tu Climate Readiness en 5 minutos.',
    images: ['https://startups4climate.org/og-image.png'],
  },
  metadataBase: new URL('https://startups4climate.org'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
          <AuthProvider>{children}</AuthProvider>
        </body>
    </html>
  )
}
