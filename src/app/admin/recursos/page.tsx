'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  FileText,
  Video,
  Link as LinkIcon,
  Table2,
  Download,
  ExternalLink,
  Presentation,
  Headphones,
  Database,
  Map,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

/* ─── Types ─── */
interface Resource {
  title: string
  type: string
  format: string
  description: string
  icon: typeof FileText
}

/* ─── Data ─── */
const TABS = [
  { id: 'programa', label: 'Para tu programa' },
  { id: 'founders', label: 'Para tus founders' },
  { id: 'biblioteca', label: 'Biblioteca' },
] as const

type TabId = (typeof TABS)[number]['id']

const RESOURCES: Record<TabId, Resource[]> = {
  programa: [
    {
      title: 'Guía: Diseño de programas de incubación',
      type: 'Documento PDF',
      format: 'PDF',
      description: 'Framework completo para diseñar un programa de incubación o aceleración de 6 meses, con cronograma, hitos y entregables.',
      icon: FileText,
    },
    {
      title: 'Template: Convocatoria de startups',
      type: 'Google Docs',
      format: 'Template',
      description: 'Plantilla editable para lanzar convocatorias de startups a tu programa. Incluye criterios de selección y rúbricas.',
      icon: LinkIcon,
    },
    {
      title: 'Masterclass: Mentoría efectiva para founders',
      type: 'Video 45 min',
      format: 'Video',
      description: 'Técnicas de mentoría para equipos de incubadoras y aceleradoras. Cómo dar feedback constructivo y acompañar sin imponer.',
      icon: Video,
    },
    {
      title: 'Framework: Evaluación de startups',
      type: 'Spreadsheet',
      format: 'Spreadsheet',
      description: 'Rúbrica de evaluación con 12 criterios ponderados para seleccionar startups en convocatorias y medir su progreso.',
      icon: Table2,
    },
    {
      title: 'Guía: Métricas de impacto para programas',
      type: 'Documento PDF',
      format: 'PDF',
      description: 'KPIs y métricas clave para medir el éxito de tu programa y reportar resultados a stakeholders e inversionistas.',
      icon: FileText,
    },
    {
      title: 'Template: Reporte de cohorte',
      type: 'Google Slides',
      format: 'Slides',
      description: 'Formato de presentación de resultados de cohorte para stakeholders, con visualizaciones de impacto y métricas.',
      icon: Presentation,
    },
  ],
  founders: [
    {
      title: 'Workbook: De la idea al escalamiento',
      type: 'E-book',
      format: 'PDF',
      description: 'Guía paso a paso para founders de impacto climático. Cubre desde validación de idea hasta estrategia de escalamiento.',
      icon: BookOpen,
    },
    {
      title: 'Kit: Pitch Deck para inversores de impacto',
      type: 'Template',
      format: 'Template',
      description: 'Estructura de 12 slides validada con inversores de impacto en LATAM. Incluye guía de narrativa y ejemplos.',
      icon: Presentation,
    },
    {
      title: 'Curso: Finanzas para founders no financieros',
      type: 'Video series',
      format: 'Video',
      description: '8 módulos sobre finanzas para startups: unit economics, burn rate, runway, proyecciones y métricas para inversores.',
      icon: Video,
    },
    {
      title: 'Herramienta: Calculadora de Unit Economics',
      type: 'Spreadsheet',
      format: 'Spreadsheet',
      description: 'Template para calcular CAC, LTV, margen de contribución y otras métricas clave de tu modelo de negocio.',
      icon: Table2,
    },
    {
      title: 'Guía: Cómo validar tu mercado en 30 días',
      type: 'PDF',
      format: 'PDF',
      description: 'Metodología práctica de validación de mercado con cronograma semanal, templates de entrevista y criterios de decisión.',
      icon: FileText,
    },
  ],
  biblioteca: [
    {
      title: 'Reporte: Estado del ecosistema climático LATAM 2026',
      type: 'PDF',
      format: 'PDF',
      description: 'Análisis completo del ecosistema de startups climáticas en Latinoamérica: tendencias, inversión, sectores y oportunidades.',
      icon: FileText,
    },
    {
      title: 'Directorio: Fondos de inversión de impacto en LATAM',
      type: 'Database',
      format: 'Database',
      description: 'Base de datos actualizada de fondos de inversión de impacto activos en la región, con tesis de inversión y contactos.',
      icon: Database,
    },
    {
      title: 'Mapa: Incubadoras y aceleradoras de impacto',
      type: 'Interactive',
      format: 'Interactive',
      description: 'Mapa interactivo de programas de apoyo a startups de impacto en LATAM. Filtrable por país, sector y etapa.',
      icon: Map,
    },
    {
      title: 'Guía: Marco regulatorio para startups de impacto por país',
      type: 'PDF',
      format: 'PDF',
      description: 'Resumen de regulaciones, incentivos fiscales y marcos legales para startups de impacto en 8 países de LATAM.',
      icon: FileText,
    },
    {
      title: 'Podcast: Voces del ecosistema climático LATAM',
      type: 'Audio series',
      format: 'Audio',
      description: 'Entrevistas con founders, inversores y líderes del ecosistema climático latinoamericano. Episodios semanales.',
      icon: Headphones,
    },
  ],
}

/* ─── Styles ─── */
const cardStyle: React.CSSProperties = {
  background: 'var(--color-bg-card)',
  border: '1px solid var(--color-border)',
  borderRadius: 12,
  padding: '1.25rem',
  boxShadow: 'var(--shadow-card)',
}

const TAB_COLORS: Record<TabId, { color: string; bg: string; border: string }> = {
  programa: { color: '#0D9488', bg: 'rgba(13,148,136,0.06)', border: 'rgba(13,148,136,0.15)' },
  founders: { color: '#FF6B4A', bg: 'rgba(255,107,74,0.06)', border: 'rgba(255,107,74,0.15)' },
  biblioteca: { color: '#7C3AED', bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.15)' },
}

const FORMAT_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  PDF: { color: '#DC2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.15)' },
  Video: { color: '#7C3AED', bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.15)' },
  Template: { color: '#0D9488', bg: 'rgba(13,148,136,0.06)', border: 'rgba(13,148,136,0.15)' },
  Spreadsheet: { color: '#16A34A', bg: 'rgba(22,163,74,0.06)', border: 'rgba(22,163,74,0.15)' },
  Slides: { color: '#D97706', bg: 'rgba(217,119,6,0.06)', border: 'rgba(217,119,6,0.15)' },
  Database: { color: '#2563EB', bg: 'rgba(37,99,235,0.06)', border: 'rgba(37,99,235,0.15)' },
  Interactive: { color: '#0891B2', bg: 'rgba(8,145,178,0.06)', border: 'rgba(8,145,178,0.15)' },
  Audio: { color: '#9333EA', bg: 'rgba(147,51,234,0.06)', border: 'rgba(147,51,234,0.15)' },
}

/* ─── Component ─── */
export default function AdminRecursosPage() {
  const { appUser } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('programa')

  if (!appUser || (appUser.role !== 'admin_org' && appUser.role !== 'superadmin')) {
    router.replace('/admin')
    return null
  }

  const currentResources = RESOURCES[activeTab]
  const tabColor = TAB_COLORS[activeTab]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ padding: '2rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'rgba(13,148,136,0.08)',
              border: '1px solid rgba(13,148,136,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <BookOpen size={20} color="#0D9488" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1.25rem',
                color: 'var(--color-text-primary)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Recursos
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                margin: 0,
              }}
            >
              Materiales, guías y herramientas para gestionar tu programa y apoyar a tus founders
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          marginBottom: '1.5rem',
          background: 'var(--color-bg-muted)',
          borderRadius: 10,
          padding: '0.25rem',
          border: '1px solid var(--color-border)',
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const tc = TAB_COLORS[tab.id]
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '0.625rem 1rem',
                borderRadius: 8,
                border: isActive ? `1px solid ${tc.border}` : '1px solid transparent',
                background: isActive ? tc.bg : 'transparent',
                color: isActive ? tc.color : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Info banner */}
      <motion.div
        key={`banner-${activeTab}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          ...cardStyle,
          marginBottom: '1.5rem',
          background: tabColor.bg,
          border: `1px solid ${tabColor.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <BookOpen size={18} color={tabColor.color} style={{ flexShrink: 0 }} />
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: tabColor.color,
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          {activeTab === 'programa' &&
            'Recursos para diseñar, ejecutar y medir tu programa de incubación o aceleración.'}
          {activeTab === 'founders' &&
            'Materiales que puedes compartir directamente con los founders de tu programa.'}
          {activeTab === 'biblioteca' &&
            'Recursos de referencia sobre el ecosistema climático y de impacto en LATAM.'}
        </span>
      </motion.div>

      {/* Resource cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))',
            gap: '1rem',
          }}
        >
          {currentResources.map((resource, i) => {
            const Icon = resource.icon
            const formatColor = FORMAT_COLORS[resource.format] || FORMAT_COLORS.PDF
            return (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                style={{
                  ...cardStyle,
                  borderLeft: `3px solid ${formatColor.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                  cursor: 'default',
                }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: formatColor.bg,
                      border: `1px solid ${formatColor.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={formatColor.color} strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        marginBottom: '0.25rem',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.125rem 0.5rem',
                          borderRadius: 999,
                          background: formatColor.bg,
                          border: `1px solid ${formatColor.border}`,
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: formatColor.color,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {resource.type}
                      </span>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.125rem 0.5rem',
                          borderRadius: 999,
                          background: 'rgba(245,158,11,0.08)',
                          border: '1px solid rgba(245,158,11,0.2)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: '#D97706',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Próximamente
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'var(--color-text-primary)',
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {resource.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {resource.description}
                </p>

                {/* Action area */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: 'auto',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.375rem 0.75rem',
                      borderRadius: 8,
                      background: 'var(--color-bg-muted)',
                      border: '1px solid var(--color-border)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--color-text-muted)',
                      cursor: 'not-allowed',
                      opacity: 0.6,
                    }}
                  >
                    <Download size={13} />
                    Descargar
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.375rem 0.75rem',
                      borderRadius: 8,
                      background: 'var(--color-bg-muted)',
                      border: '1px solid var(--color-border)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: 'var(--color-text-muted)',
                      cursor: 'not-allowed',
                      opacity: 0.6,
                    }}
                  >
                    <ExternalLink size={13} />
                    Abrir
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          marginTop: '2rem',
          padding: '1.25rem 1.5rem',
          borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(13,148,136,0.04), rgba(124,58,237,0.04))',
          border: '1px solid rgba(13,148,136,0.1)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          Estamos preparando estos recursos para ti. Si tienes sugerencias o materiales que quieras compartir con el ecosistema, escríbenos a{' '}
          <a
            href="https://wa.me/51989338401?text=Hola%2C%20vengo%20de%20Startups4climate%20y%20tengo%20una%20sugerencia%20de%20recurso%20para%20la%20plataforma."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#0D9488',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            WhatsApp
            <ExternalLink
              size={12}
              style={{ display: 'inline', marginLeft: 3, verticalAlign: 'middle' }}
            />
          </a>
          .
        </p>
      </motion.div>
    </motion.div>
  )
}
