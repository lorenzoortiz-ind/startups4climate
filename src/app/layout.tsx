import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-dm-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'S4C | Ecosistema para startups de impacto en LATAM',
  description: 'Plataforma gratuita con +30 herramientas, mentores AI por vertical y oportunidades personalizadas para founders en Latinoamérica.',
  keywords: [
    'startups LATAM', 'herramientas para startups', 'incubadora virtual',
    'aceleradora startups', 'emprendimiento latinoamérica', 'startup tools',
    'mentor AI startups', 'grants startups', 'lean canvas español',
    'plataforma emprendimiento', 'startups de impacto'
  ],
  authors: [{ name: 'Redesign Lab' }],
  openGraph: {
    type: 'website',
    url: 'https://startups4climate.vercel.app',
    title: 'S4C | Ecosistema para startups de impacto en LATAM',
    description: '+30 herramientas gratuitas, mentores AI y oportunidades personalizadas para founders en Latinoamérica.',
    siteName: 'Startups4Climate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S4C | Ecosistema para startups de impacto en LATAM',
    description: '+30 herramientas gratuitas, mentores AI y oportunidades personalizadas para founders en Latinoamérica.',
  },
  alternates: {
    canonical: 'https://startups4climate.vercel.app',
  },
  metadataBase: new URL('https://startups4climate.vercel.app'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${dmSerif.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
