import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Para Organizaciones | Startups4Climate',
  description:
    'Gestiona tu programa de innovación con datos reales. Plataforma all-in-one para incubadoras, universidades y gobiernos que impulsan startups de impacto en LATAM.',
  keywords: [
    'plataforma incubadoras LATAM',
    'gestión cohortes startups',
    'programa innovación universidades',
    'herramientas aceleradoras',
    'dashboard startups impacto',
    'reportes programa innovación',
  ],
  alternates: {
    canonical: 'https://www.startups4climate.org/organizaciones',
  },
  openGraph: {
    title: 'Para Organizaciones | Startups4Climate',
    description:
      'Gestiona tu programa de innovación con datos reales. Dashboard, cohortes, reportes Excel y +30 herramientas interactivas para tus founders.',
    url: 'https://www.startups4climate.org/organizaciones',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Para Organizaciones | Startups4Climate',
    description:
      'Gestiona tu programa de innovación con datos reales. Plataforma all-in-one para incubadoras y universidades en LATAM.',
  },
}

export default function OrganizacionesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
