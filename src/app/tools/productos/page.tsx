'use client'

import { motion } from 'framer-motion'
import {
  Search,
  Layers,
  LineChart,
  BarChart3,
  Presentation,
  Palette,
  ShoppingCart,
  ArrowLeft,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface Product {
  icon: LucideIcon
  name: string
  description: string
  price: number
  stage: string
  stageColor: string
  stageBg: string
}

const products: Product[] = [
  {
    icon: Search,
    name: 'Investigación de Mercado Profunda',
    description:
      'Análisis completo de tu mercado objetivo, competencia y oportunidades con recomendaciones accionables.',
    price: 299,
    stage: 'Pre-incubación',
    stageColor: '#7C3AED',
    stageBg: 'rgba(124,58,237,0.08)',
  },
  {
    icon: Layers,
    name: 'Diseño de Producto MVP',
    description:
      'Prototipo funcional de tu producto mínimo viable con wireframes, user flows y especificación técnica.',
    price: 499,
    stage: 'Incubación',
    stageColor: '#059669',
    stageBg: 'rgba(5,150,105,0.08)',
  },
  {
    icon: LineChart,
    name: 'Modelamiento Financiero Profesional',
    description:
      'Proyecciones financieras a 3 años, unit economics detallado y modelo listo para inversores.',
    price: 399,
    stage: 'Incubación',
    stageColor: '#059669',
    stageBg: 'rgba(5,150,105,0.08)',
  },
  {
    icon: BarChart3,
    name: 'Dashboard Financiero para Inversores',
    description:
      'Dashboard interactivo con métricas clave de tu negocio, listo para presentar a inversores.',
    price: 349,
    stage: 'Aceleración',
    stageColor: '#D97706',
    stageBg: 'rgba(217,119,6,0.08)',
  },
  {
    icon: Presentation,
    name: 'Pitch Deck Profesional',
    description:
      'Pitch deck de 12 slides diseñado profesionalmente con tu narrativa de inversión.',
    price: 249,
    stage: 'Aceleración',
    stageColor: '#D97706',
    stageBg: 'rgba(217,119,6,0.08)',
  },
  {
    icon: Palette,
    name: 'Branding & Identidad Visual',
    description:
      'Logo, paleta de colores, tipografia y brand guidelines completos para tu startup.',
    price: 599,
    stage: 'Pre-incubación',
    stageColor: '#7C3AED',
    stageBg: 'rgba(124,58,237,0.08)',
  },
]

function ProductCard({ product, index }: { product: Product; index: number }) {
  const Icon = product.icon
  const checkoutUrl = `/checkout?product=${encodeURIComponent(product.name)}&price=${product.price}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
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
        boxShadow: '0 8px 40px rgba(5,150,105,0.12)',
        borderColor: 'rgba(5,150,105,0.3)',
        y: -4,
      }}
    >
      {/* Icon header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 140,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Icon size={36} strokeWidth={1.5} color="white" />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem 1.5rem 1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Stage tag */}
        <span
          style={{
            display: 'inline-block',
            alignSelf: 'flex-start',
            padding: '0.2rem 0.625rem',
            borderRadius: 9999,
            background: product.stageBg,
            fontFamily: "'JetBrains Mono', var(--font-mono, monospace)",
            fontSize: '0.625rem',
            fontWeight: 600,
            color: product.stageColor,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          {product.stage}
        </span>

        <h3
          style={{
            fontFamily: "'Plus Jakarta Sans', var(--font-heading, sans-serif)",
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--color-text-primary, #111827)',
            lineHeight: 1.3,
            marginBottom: '0.5rem',
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontFamily: "'Inter', var(--font-body, sans-serif)",
            fontSize: '0.9375rem',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary, #6b7280)',
            marginBottom: '1.5rem',
            flex: 1,
          }}
        >
          {product.description}
        </p>

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
                fontFamily: "'Plus Jakarta Sans', var(--font-heading, sans-serif)",
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#059669',
                lineHeight: 1,
              }}
            >
              ${product.price}
            </span>
            <span
              style={{
                fontFamily: "'Inter', var(--font-body, sans-serif)",
                fontSize: '0.8125rem',
                color: 'var(--color-text-tertiary, #9ca3af)',
                marginLeft: '0.25rem',
              }}
            >
              USD
            </span>
          </div>
          <a
            href={checkoutUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.75rem 1.25rem',
              borderRadius: 12,
              background: '#059669',
              color: 'white',
              fontFamily: "'Inter', var(--font-body, sans-serif)",
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <ShoppingCart size={14} strokeWidth={2} />
            Comprar
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProductosToolsPage() {
  return (
    <div style={{ padding: '2rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <Link
          href="/tools"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontFamily: "'Inter', var(--font-body, sans-serif)",
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-text-secondary, #6b7280)',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
        >
          <ArrowLeft size={15} />
          Volver al Toolkit
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '2.5rem', maxWidth: 680 }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '0.3rem 0.875rem',
            borderRadius: 9999,
            background: 'rgba(5,150,105,0.06)',
            border: '1px solid rgba(5,150,105,0.12)',
            fontFamily: "'Inter', var(--font-body, sans-serif)",
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#059669',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          Productos
        </span>
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', var(--font-heading, sans-serif)",
            fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: 'var(--color-text-primary, #111827)',
            marginBottom: '0.75rem',
          }}
        >
          Productos para acelerar tu{' '}
          <span style={{ color: '#059669' }}>startup</span>
        </h1>
        <p
          style={{
            fontFamily: "'Inter', var(--font-body, sans-serif)",
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary, #6b7280)',
          }}
        >
          Entregables profesionales alineados con cada etapa de desarrollo de tu startup.
          Desde la investigación de mercado hasta el pitch deck listo para inversores.
        </p>
      </motion.div>

      {/* Product grid */}
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

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={{
          marginTop: '4rem',
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(5,150,105,0.04), rgba(5,150,105,0.08))',
          borderRadius: 20,
          border: '1px solid rgba(5,150,105,0.12)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', var(--font-heading, sans-serif)",
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary, #111827)',
            marginBottom: '0.75rem',
          }}
        >
          ¿Necesitas algo más personalizado?
        </h2>
        <p
          style={{
            fontFamily: "'Inter', var(--font-body, sans-serif)",
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary, #6b7280)',
            marginBottom: '1.5rem',
            maxWidth: 520,
            margin: '0 auto 1.5rem',
          }}
        >
          Conoce nuestros servicios de consultoría y acompañamiento para founders e inversores.
        </p>
        <Link
          href="/tools/servicios"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 2rem',
            borderRadius: 9999,
            background: '#059669',
            color: 'white',
            fontFamily: "'Inter', var(--font-body, sans-serif)",
            fontSize: '0.9375rem',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(5,150,105,0.25)',
            transition: 'all 0.2s',
          }}
        >
          Ver Servicios
        </Link>
      </motion.div>
    </div>
  )
}
