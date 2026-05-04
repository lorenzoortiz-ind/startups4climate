import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Workbook: De la idea al escalamiento | Startups4Climate',
  description:
    'Workbook profesional con metodologías probadas para llevar tu startup de impacto de la idea al escalamiento. Lean Canvas, Business Model Canvas, análisis financiero y más.',
  keywords: [
    'workbook startups',
    'lean canvas español',
    'business model canvas startups',
    'guía emprendimiento impacto',
    'metodología startups LATAM',
    'escalamiento startups',
  ],
  alternates: {
    canonical: 'https://www.startups4climate.org/workbook',
  },
  openGraph: {
    title: 'Workbook: De la idea al escalamiento | Startups4Climate',
    description:
      'Metodologías probadas para llevar tu startup de impacto de la idea al escalamiento paso a paso.',
    url: 'https://www.startups4climate.org/workbook',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Workbook: De la idea al escalamiento | Startups4Climate',
    description:
      'Metodologías probadas para llevar tu startup de impacto de la idea al escalamiento paso a paso.',
  },
}

export default function WorkbookLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
