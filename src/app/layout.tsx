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
  title: 'Startups4Climate | Ecosistema all-in-one para startups de impacto en LATAM',
  description: 'Plataforma gratuita con +30 herramientas, mentores AI por vertical, oportunidades personalizadas y tendencias del ecosistema. Para founders independientes y programas de incubación en Latinoamérica.',
  keywords: [
    'startups LATAM', 'herramientas para startups', 'incubadora virtual',
    'aceleradora startups', 'emprendimiento latinoamérica', 'startup tools',
    'mentor AI startups', 'grants startups', 'lean canvas español',
    'plataforma emprendimiento', 'startups de impacto'
  ],
  authors: [{ name: 'Redesign Lab' }],
  openGraph: {
    type: 'website',
    url: 'https://startups4climate.org',
    title: 'Startups4Climate | Ecosistema para startups de impacto en LATAM',
    description: '+30 herramientas gratuitas, mentores AI y oportunidades personalizadas para founders en Latinoamérica.',
    siteName: 'Startups4Climate',
  },
  twitter: { card: 'summary_large_image' },
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
