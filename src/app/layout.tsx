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
  title: 'S4C | Ecosistema para startups de impacto en LATAM',
  description: 'Plataforma gratuita con +30 herramientas, mentores AI por vertical y oportunidades personalizadas para founders en Latinoamérica.',
  keywords: [
    'startups LATAM', 'herramientas para startups', 'incubadora virtual',
    'aceleradora startups', 'emprendimiento latinoamérica', 'startup tools',
    'mentor AI startups', 'grants startups', 'lean canvas español',
    'plataforma emprendimiento', 'startups de impacto'
  ],
  authors: [{ name: 'Redesign Lab' }],
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
    locale: 'es_ES',
    url: 'https://www.startups4climate.org',
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
    canonical: 'https://www.startups4climate.org',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${mluvka.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>
          <StartupProvider>
            <LayoutShell>{children}</LayoutShell>
          </StartupProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
