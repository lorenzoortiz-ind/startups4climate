'use client'

import { motion } from 'framer-motion'
import {
  CheckCircle2,
  ArrowRight,
  FileSpreadsheet,
  Scale,
  Database,
  FlaskConical,
  Presentation,
  FolderOpen,
  ShoppingCart,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Product {
  icon: LucideIcon
  name: string
  description: string
  includes: string[]
  price: number
  accentColor: string
  gradient: string
}

const products: Product[] = [
  {
    icon: FileSpreadsheet,
    name: 'Modelo financiero avanzado para climate tech',
    description:
      'Proyecciones financieras completas diseñadas para startups de hardware climático y deep tech. Listo para presentar a inversores.',
    includes: [
      'Spreadsheet completo con proyecciones a 5 años',
      'Análisis de escenarios (base, optimista, conservador)',
      'Unit economics y sensitivity analysis',
      'Template DSCR para project finance',
    ],
    price: 149,
    accentColor: '#059669',
    gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
  },
  {
    icon: Scale,
    name: 'Kit legal para deep tech',
    description:
      'Documentos legales esenciales adaptados a startups de climate tech en Latinoamérica. Ahorra miles de dólares en honorarios legales.',
    includes: [
      'Templates de NDA, LOI y MoU adaptados a climate tech',
      'Modelo de pacto de socios con cláusulas de vesting',
      'Guía de estructuración SAS para spinoffs',
      'Checklist regulatorio por país (CO, MX, CL, PE)',
    ],
    price: 99,
    accentColor: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
  },
  {
    icon: Database,
    name: 'Base de datos: +500 VCs climáticos',
    description:
      'El directorio más completo de inversores climate tech activos en Latinoamérica y globalmente. Actualización trimestral incluida.',
    includes: [
      'Directorio actualizado de inversores climate tech',
      'Filtrado por ticket, vertical, geografía y etapa',
      'Datos de contacto y tesis de inversión',
      'Actualización trimestral incluida (1 año)',
    ],
    price: 79,
    accentColor: '#0891B2',
    gradient: 'linear-gradient(135deg, #0891B2 0%, #67E8F9 100%)',
  },
  {
    icon: FlaskConical,
    name: 'Plantillas TEA y análisis de ciclo de vida',
    description:
      'Herramientas de análisis técnico-económico para validar la viabilidad comercial de tu tecnología climática.',
    includes: [
      'Template de Techno-Economic Analysis completo',
      'Modelo de Life Cycle Assessment simplificado',
      'Calculadora de LCOE/LCOC',
      'Guía de interpretación para inversores',
    ],
    price: 129,
    accentColor: '#D97706',
    gradient: 'linear-gradient(135deg, #D97706 0%, #FCD34D 100%)',
  },
  {
    icon: Presentation,
    name: 'Pitch deck template para inversores climáticos',
    description:
      'Plantilla de pitch deck diseñada específicamente para startups climate tech. Narrativa probada con inversores reales.',
    includes: [
      '15 slides diseñados para climate tech',
      'Guía de narrativa y storytelling',
      'Sección de métricas de impacto pre-armada',
      'Versión Figma + PowerPoint',
    ],
    price: 69,
    accentColor: '#059669',
    gradient: 'linear-gradient(135deg, #059669 0%, #6EE7B7 100%)',
  },
  {
    icon: FolderOpen,
    name: 'Data room checklist y arquitectura',
    description:
      'Estructura tu data room como los fondos esperan verlo. Checklist completo y arquitectura de carpetas lista para usar.',
    includes: [
      'Estructura de carpetas lista para usar',
      'Checklist de 50+ documentos por categoría',
      'Guía de priorización por etapa de inversión',
      'Template de índice para inversores',
    ],
    price: 89,
    accentColor: '#DC2626',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #FCA5A5 100%)',
  },
]

function ProductCard({ product, index }: { product: Product; index: number }) {
  const Icon = product.icon
  const waLink = `https://wa.me/51989338401?text=${encodeURIComponent(`Hola, me interesa el producto: ${product.name}`)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        background: 'var(--color-bg-card, #ffffff)',
        borderRadius: 20,
        border: '1px solid var(--color-border, #e5e7eb)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
      }}
      whileHover={{
        boxShadow: `0 8px 40px ${product.accentColor}20`,
        borderColor: `${product.accentColor}40`,
        y: -4,
      }}
    >
      {/* Product mockup area */}
      <div
        style={{
          background: product.gradient,
          padding: '2.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 160,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Icon size={40} strokeWidth={1.5} color="white" />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.75rem 1.75rem 2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 1.3,
            marginBottom: '0.5rem',
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            marginBottom: '1.25rem',
          }}
        >
          {product.description}
        </p>

        {/* Includes */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {product.includes.map((item) => (
            <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <CheckCircle2
                size={15}
                strokeWidth={2}
                color={product.accentColor}
                style={{ marginTop: 3, flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  lineHeight: 1.5,
                  color: 'var(--color-text-secondary)',
                }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--color-border, #e5e7eb)',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: product.accentColor,
                lineHeight: 1,
              }}
            >
              ${product.price}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-tertiary, #9ca3af)',
                marginLeft: '0.25rem',
              }}
            >
              USD
            </span>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.75rem 1.25rem',
              borderRadius: 12,
              background: product.accentColor,
              color: 'white',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <ShoppingCart size={14} strokeWidth={2} />
            Comprar producto
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProductosPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          style={{
            padding: '8rem 0 4rem',
            background: 'linear-gradient(180deg, var(--color-bg-warm) 0%, var(--color-bg-primary) 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              right: '-5%',
              width: '35vw',
              height: '35vw',
              borderRadius: '50%',
              background: 'rgba(5,150,105,0.04)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-15%',
              left: '-8%',
              width: '30vw',
              height: '30vw',
              borderRadius: '50%',
              background: 'rgba(124,58,237,0.03)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.3rem 0.875rem',
                  borderRadius: 9999,
                  background: 'rgba(5,150,105,0.06)',
                  border: '1px solid rgba(5,150,105,0.12)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#059669',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}
              >
                Productos digitales
              </span>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                  color: 'var(--color-text-primary)',
                  marginBottom: '1.25rem',
                }}
              >
                Herramientas listas para usar en tu{' '}
                <span style={{ color: '#059669' }}>startup climática</span>
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  maxWidth: 620,
                  margin: '0 auto',
                }}
              >
                Recursos digitales listos para descargar: modelos financieros, plantillas legales,
                bases de datos y frameworks técnicos diseñados específicamente para climate tech.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Product grid */}
        <section style={{ padding: '5rem 0', background: 'var(--color-bg-primary)', position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              bottom: '5%',
              right: '-5%',
              width: 350,
              height: 350,
              borderRadius: '50%',
              background: 'rgba(8,145,178,0.03)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', position: 'relative' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '2rem',
              }}
            >
              {products.map((product, i) => (
                <ProductCard key={product.name} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section
          style={{
            padding: '5rem 0',
            background: 'linear-gradient(180deg, var(--color-bg-primary), var(--color-bg-warm))',
          }}
        >
          <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-text-primary)',
                  marginBottom: '1rem',
                }}
              >
                ¿Necesitas algo más personalizado?
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.0625rem',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  marginBottom: '2rem',
                }}
              >
                Si buscas acompañamiento a medida, conoce nuestros servicios de consultoría
                para fundadores e inversores de climate tech.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.875rem' }}>
                <a
                  href="/servicios"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 2rem',
                    borderRadius: 9999,
                    background: '#059669',
                    color: 'white',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(5,150,105,0.25)',
                    transition: 'all 0.2s',
                  }}
                >
                  Ver servicios de consultoría
                  <ArrowRight size={16} strokeWidth={2} />
                </a>
                <a
                  href="https://wa.me/51989338401?text=Hola, quiero más información sobre los productos digitales"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.875rem 2rem',
                    borderRadius: 9999,
                    background: 'white',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid var(--color-border)',
                    transition: 'all 0.2s',
                  }}
                >
                  Contáctanos por WhatsApp
                  <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
