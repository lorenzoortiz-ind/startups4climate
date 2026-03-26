'use client'

import { motion } from 'framer-motion'
import {
  Presentation,
  Calculator,
  Rocket,
  ShieldCheck,
  Layers,
  CheckCircle2,
  ArrowRight,
  CalendarCheck,
  BarChart3,
  Search,
  LineChart,
  FolderCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface Service {
  icon: LucideIcon
  title: string
  description: string
  includes: string[]
  mailto: string
}

// ──── Servicios para Fundadores ────
const founderServices: Service[] = [
  {
    icon: Presentation,
    title: 'Diseño de pitch deck para inversores climáticos',
    description:
      'Diseñamos pitch decks listos para inversores especializados en climate tech. Incluye narrativa estratégica, visualización de datos de impacto y proyecciones financieras alineadas con tesis climáticas.',
    includes: [
      'Narrativa y storytelling climático',
      'Visualización de métricas de impacto y unit economics',
      'Proyecciones financieras a 5 años con escenarios',
      'Diseño profesional listo para enviar',
    ],
    mailto: 'Pitch Deck para Inversores Climáticos',
  },
  {
    icon: Calculator,
    title: 'Modelación financiera y unit economics',
    description:
      'Modelos financieros a medida para startups de deep tech y hardware climático. Análisis de escenarios, modelación DSCR, y outputs listos para due diligence con inversores.',
    includes: [
      'Modelo financiero completo en Excel/Sheets',
      'Análisis de escenarios (base, optimista, conservador)',
      'Modelación de DSCR y debt capacity',
      'Unit economics detallado con sensitivity analysis',
    ],
    mailto: 'Modelación Financiera y Unit Economics',
  },
  {
    icon: Rocket,
    title: 'Estrategia de go-to-market climático',
    description:
      'Estrategia de entrada al mercado adaptada a climate tech en Latam. Desde customer discovery hasta estructuración de pilotos, pricing y desarrollo de partnerships estratégicos.',
    includes: [
      'Customer discovery y segmentación de mercado',
      'Estructuración de pilotos B2B y offtake agreements',
      'Estrategia de pricing y revenue model',
      'Pipeline de partnerships y canales de distribución',
    ],
    mailto: 'Estrategia de Go-to-Market Climático',
  },
  {
    icon: ShieldCheck,
    title: 'Preparación para due diligence',
    description:
      'Paquete completo de preparación para DD: data room organizado, revisión legal, auditoría de propiedad intelectual y documentación técnica lista para inversores.',
    includes: [
      'Estructuración y población del data room',
      'Revisión legal y compliance check',
      'Auditoría de IP y documentación de patentes',
      'Technical documentation y risk assessment',
    ],
    mailto: 'Preparación para Due Diligence',
  },
  {
    icon: Layers,
    title: 'Diseño de capital stack y fundraising',
    description:
      'Estrategia de blended finance: mapeo de grants, equity y deuda. Identificación de inversores target, preparación de pitch y acompañamiento en el proceso de fundraising.',
    includes: [
      'Mapeo de grants + equity + debt (blended finance)',
      'Identificación y targeting de inversores climáticos',
      'Preparación de pitch y materiales de fundraising',
      'Acompañamiento en negociaciones y term sheets',
    ],
    mailto: 'Diseño de Capital Stack y Fundraising',
  },
]

// ──── Servicios para Inversores ────
interface InvestorService {
  icon: LucideIcon
  title: string
  description: string
  includes: string[]
  mailto: string
}

const investorServices: InvestorService[] = [
  {
    icon: Search,
    title: 'Deal flow curado de climate tech',
    description:
      'Pipeline cualificado de startups climáticas en Latam, filtrado por TRL, vertical, ticket size y readiness financiero. Cada startup pasa por nuestro diagnóstico de madurez antes de llegar a tu comité.',
    includes: [
      'Pipeline filtrado por TRL, vertical y ticket',
      'Ficha estructurada por startup (métricas, impacto, equipo)',
      'Climate Readiness Score validado',
      'Actualizaciones trimestrales del pipeline',
    ],
    mailto: 'Deal Flow Curado - Climate Tech Latam',
  },
  {
    icon: BarChart3,
    title: 'DD readiness scoring',
    description:
      'Evaluación previa de due diligence para reducir tu tiempo de análisis. Revisamos documentación legal, financiera, técnica y ESG antes de que la startup llegue a tu proceso formal.',
    includes: [
      'Evaluación de data room completeness',
      'Revisión de cap table y term sheets previos',
      'Scoring de bankability (100 puntos)',
      'Gap analysis con recomendaciones',
    ],
    mailto: 'DD Readiness Scoring para Inversores',
  },
  {
    icon: LineChart,
    title: 'Portfolio climate monitoring',
    description:
      'Monitoreo continuo de métricas climáticas y operativas de tu portfolio. Dashboards personalizados con KPIs de impacto, progresión de TRL y alertas de hitos críticos.',
    includes: [
      'Dashboard de KPIs climáticos por portfolio company',
      'Tracking de progresión TRL y milestones',
      'Reportes trimestrales de impacto agregado',
      'Alertas tempranas de riesgo operativo',
    ],
    mailto: 'Portfolio Climate Monitoring',
  },
  {
    icon: FolderCheck,
    title: 'Diseño de tesis de inversión climática',
    description:
      'Acompañamiento en la estructuración de tu tesis de inversión para climate tech en Latam. Análisis de mercado, mapping de oportunidades y diseño de criterios de evaluación.',
    includes: [
      'Market mapping de climate tech en Latam',
      'Análisis de oportunidades por vertical y geografía',
      'Framework de evaluación climate-native',
      'Benchmark contra fondos climáticos globales',
    ],
    mailto: 'Diseño de Tesis de Inversión Climática',
  },
]

function ServiceCard({ service, index, accentColor }: { service: Service | InvestorService; index: number; accentColor: string }) {
  const Icon = service.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      style={{
        background: 'var(--color-bg-card)',
        borderRadius: 20,
        border: '1px solid var(--color-border)',
        padding: '2rem',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      whileHover={{
        boxShadow: `0 4px 30px ${accentColor}18`,
        borderColor: `${accentColor}40`,
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.25rem', alignItems: 'start' }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: `${accentColor}0F`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={26} strokeWidth={1.5} color={accentColor} />
        </div>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: '1.1875rem', fontWeight: 700,
            color: 'var(--color-text-primary)', lineHeight: 1.3, marginBottom: '0.5rem',
          }}>
            {service.title}
          </h3>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.9375rem', lineHeight: 1.65,
            color: 'var(--color-text-secondary)', marginBottom: '1rem',
          }}>
            {service.description}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
            {service.includes.map((item) => (
              <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <CheckCircle2 size={16} strokeWidth={2} color={accentColor} style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', lineHeight: 1.5, color: 'var(--color-text-secondary)' }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '1.25rem' }}>
            <a
              href={`mailto:hello@redesignlab.org?subject=${encodeURIComponent(service.mailto)}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.625rem 1.25rem', borderRadius: 10,
                background: `${accentColor}0F`, color: accentColor,
                fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
                textDecoration: 'none', border: `1px solid ${accentColor}25`,
                transition: 'all 0.2s ease',
              }}
            >
              Solicitar este servicio
              <ArrowRight size={14} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ServiciosPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{
          padding: '8rem 0 4rem',
          background: 'linear-gradient(180deg, var(--color-bg-warm) 0%, var(--color-bg-primary) 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '35vw', height: '35vw', borderRadius: '50%', background: 'rgba(5,150,105,0.04)', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}
            >
              <span style={{
                display: 'inline-block', padding: '0.3rem 0.875rem', borderRadius: 9999,
                background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.12)',
                fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
                color: '#059669', letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: '1rem',
              }}>
                Servicios Profesionales
              </span>
              <h1 style={{
                fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.025em',
                color: 'var(--color-text-primary)', marginBottom: '1.25rem',
              }}>
                Servicios profesionales para{' '}
                <span style={{ color: '#059669' }}>climate tech</span>
              </h1>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '1.125rem', lineHeight: 1.7,
                color: 'var(--color-text-secondary)', maxWidth: 600, margin: '0 auto',
              }}>
                Servicios profesionales de consultoría, sesiones estratégicas y advisory
                para fundadores e inversores de climate tech en Latinoamérica.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Para Fundadores */}
        <section id="fundadores" style={{ padding: '5rem 0', background: 'var(--color-bg-primary)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'rgba(5,150,105,0.03)', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ maxWidth: 680, marginBottom: '3rem' }}
            >
              <span style={{
                display: 'inline-block', padding: '0.3rem 0.875rem', borderRadius: 9999,
                background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.12)',
                fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
                color: '#059669', letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: '1rem',
              }}>
                Para Fundadores
              </span>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em',
                color: 'var(--color-text-primary)', marginBottom: '0.75rem',
              }}>
                Todo lo que necesitas para levantar capital climático
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
              }}>
                Consultoría especializada para startups climate tech en Latam. Cada servicio está
                diseñado para acelerar tu camino al siguiente hito de financiamiento.
              </p>
            </motion.div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {founderServices.map((service, i) => (
                <ServiceCard key={service.title} service={service} index={i} accentColor="#059669" />
              ))}
            </div>
          </div>
        </section>

        {/* Para Inversores */}
        <section id="inversores" style={{ padding: '5rem 0', background: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(8,145,178,0.03)', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ maxWidth: 680, marginBottom: '3rem' }}
            >
              <span style={{
                display: 'inline-block', padding: '0.3rem 0.875rem', borderRadius: 9999,
                background: 'rgba(8,145,178,0.06)', border: '1px solid rgba(8,145,178,0.12)',
                fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
                color: '#0891B2', letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: '1rem',
              }}>
                Para Inversores
              </span>
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em',
                color: 'var(--color-text-primary)', marginBottom: '0.75rem',
              }}>
                Deal flow estructurado y listo para due diligence
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
              }}>
                Las startups que superan nuestro diagnóstico llegan a tu comité de inversión con data institucional,
                métricas de impacto claras y readiness financiero validado.
              </p>
            </motion.div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {investorServices.map((service, i) => (
                <ServiceCard key={service.title} service={service} index={i} accentColor="#0891B2" />
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section style={{
          padding: '5rem 0',
          background: 'linear-gradient(180deg, var(--color-bg-primary), var(--color-bg-warm))',
        }}>
          <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em',
                color: 'var(--color-text-primary)', marginBottom: '1rem',
              }}>
                ¿No sabes por dónde empezar?
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: 1.7,
                color: 'var(--color-text-secondary)', marginBottom: '2rem',
              }}>
                Agenda una llamada y diseñamos un plan a tu medida. También puedes empezar gratis
                con nuestro toolkit de diagnóstico.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.875rem' }}>
                <a
                  href="https://calendly.com/redesignlab"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.875rem 2rem', borderRadius: 9999,
                    background: '#059669', color: 'white',
                    fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600,
                    textDecoration: 'none', boxShadow: '0 4px 20px rgba(5,150,105,0.25)',
                    transition: 'all 0.2s',
                  }}
                >
                  <CalendarCheck size={18} strokeWidth={2} />
                  Agenda una llamada
                </a>
                <Link
                  href="/"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.875rem 2rem', borderRadius: 9999,
                    background: 'white', color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600,
                    textDecoration: 'none', border: '1px solid var(--color-border)',
                    transition: 'all 0.2s',
                  }}
                >
                  Ir al Toolkit Gratuito
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
