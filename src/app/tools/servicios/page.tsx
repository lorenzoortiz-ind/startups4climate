'use client'

import { motion } from 'framer-motion'
import {
  MessageCircle,
  Users,
  Handshake,
  Megaphone,
  FileCheck,
  Briefcase,
  ShieldCheck,
  Globe,
  ArrowRight,
  ArrowLeft,
  CalendarCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface Service {
  icon: LucideIcon
  name: string
  description: string
  price: string
  mailto: string
}

const founderServices: Service[] = [
  {
    icon: MessageCircle,
    name: 'Sesion Estrategica 1:1',
    description: '60 minutos de mentoria personalizada para resolver tu desafio mas urgente.',
    price: '$99 USD/sesion',
    mailto: 'Sesion Estrategica 1:1',
  },
  {
    icon: Users,
    name: 'Workshop de Customer Discovery',
    description: 'Taller practico para validar tu mercado con entrevistas a clientes reales.',
    price: '$199 USD',
    mailto: 'Workshop de Customer Discovery',
  },
  {
    icon: Handshake,
    name: 'Acompanamiento de Ventas B2B',
    description: 'Coaching semanal para cerrar tus primeras ventas corporativas.',
    price: '$299 USD/mes',
    mailto: 'Acompanamiento de Ventas B2B',
  },
  {
    icon: Megaphone,
    name: 'Workshop de Ventas para Founders',
    description: 'Aprende a vender tu producto como founder, sin necesidad de un equipo de ventas.',
    price: '$149 USD',
    mailto: 'Workshop de Ventas para Founders',
  },
  {
    icon: FileCheck,
    name: 'Revision y Coaching de Pitch Deck',
    description: 'Revision detallada de tu pitch deck con feedback accionable y sesion de coaching.',
    price: '$149 USD',
    mailto: 'Revision y Coaching de Pitch Deck',
  },
  {
    icon: Briefcase,
    name: 'Asesoria de Fundraising',
    description: 'Plan completo de levantamiento de capital: estrategia, contactos y preparacion de Data Room.',
    price: '$499 USD',
    mailto: 'Asesoria de Fundraising',
  },
]

const investorServices: Service[] = [
  {
    icon: ShieldCheck,
    name: 'Due Diligence de Startups',
    description: 'Evaluacion integral de startups para decisiones de inversion informadas.',
    price: '$799 USD',
    mailto: 'Due Diligence de Startups',
  },
  {
    icon: Globe,
    name: 'Dealflow Curado LATAM',
    description: 'Acceso a pipeline curado de startups de impacto en America Latina.',
    price: 'Custom',
    mailto: 'Dealflow Curado LATAM',
  },
]

function ServiceCard({
  service,
  index,
  accentColor,
}: {
  service: Service
  index: number
  accentColor: string
}) {
  const Icon = service.icon
  const mailtoLink = `mailto:hello@redesignlab.org?subject=${encodeURIComponent(service.mailto)}`

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
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      whileHover={{
        boxShadow: `0 4px 30px ${accentColor}18`,
        borderColor: `${accentColor}40`,
      }}
    >
      {/* Icon + Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: `${accentColor}0F`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={24} strokeWidth={1.5} color={accentColor} />
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans', var(--font-heading, sans-serif)",
              fontSize: '1.0625rem',
              fontWeight: 700,
              color: 'var(--color-text-primary, #111827)',
              lineHeight: 1.3,
              marginBottom: '0.25rem',
            }}
          >
            {service.name}
          </h3>
          <span
            style={{
              fontFamily: "'JetBrains Mono', var(--font-mono, monospace)",
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: accentColor,
            }}
          >
            {service.price}
          </span>
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Inter', var(--font-body, sans-serif)",
          fontSize: '0.9375rem',
          lineHeight: 1.65,
          color: 'var(--color-text-secondary, #6b7280)',
          marginBottom: '1.25rem',
          flex: 1,
        }}
      >
        {service.description}
      </p>

      {/* CTA */}
      <a
        href={mailtoLink}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          alignSelf: 'flex-start',
          padding: '0.625rem 1.25rem',
          borderRadius: 10,
          background: `${accentColor}0F`,
          color: accentColor,
          fontFamily: "'Inter', var(--font-body, sans-serif)",
          fontSize: '0.8125rem',
          fontWeight: 600,
          textDecoration: 'none',
          border: `1px solid ${accentColor}25`,
          transition: 'all 0.2s ease',
        }}
      >
        Solicitar
        <ArrowRight size={14} strokeWidth={2} />
      </a>
    </motion.div>
  )
}

export default function ServiciosToolsPage() {
  return (
    <div style={{ padding: '2.5rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
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
        style={{ marginBottom: '3rem', maxWidth: 680 }}
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
          Servicios
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
          Servicios profesionales para{' '}
          <span style={{ color: '#059669' }}>tu startup</span>
        </h1>
        <p
          style={{
            fontFamily: "'Inter', var(--font-body, sans-serif)",
            fontSize: '1.0625rem',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary, #6b7280)',
          }}
        >
          Mentoria, workshops y acompanamiento estrategico para founders e inversores.
          Cada servicio esta disenado para resolver desafios concretos de tu etapa.
        </p>
      </motion.div>

      {/* ── Para Founders ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '1.5rem' }}
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
            marginBottom: '0.75rem',
          }}
        >
          Para Founders
        </span>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', var(--font-heading, sans-serif)",
            fontSize: 'clamp(1.5rem, 3vw, 1.75rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary, #111827)',
          }}
        >
          Mentoria y acompanamiento para founders
        </h2>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem',
        }}
      >
        {founderServices.map((service, i) => (
          <ServiceCard key={service.name} service={service} index={i} accentColor="#059669" />
        ))}
      </div>

      {/* ── Para Inversores ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '0.3rem 0.875rem',
            borderRadius: 9999,
            background: 'rgba(8,145,178,0.06)',
            border: '1px solid rgba(8,145,178,0.12)',
            fontFamily: "'Inter', var(--font-body, sans-serif)",
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#0891B2',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          Para Inversores
        </span>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', var(--font-heading, sans-serif)",
            fontSize: 'clamp(1.5rem, 3vw, 1.75rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: 'var(--color-text-primary, #111827)',
          }}
        >
          Servicios para inversores de impacto
        </h2>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem',
        }}
      >
        {investorServices.map((service, i) => (
          <ServiceCard key={service.name} service={service} index={i} accentColor="#0891B2" />
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={{
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
          No sabes por donde empezar?
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
          Agenda una llamada y disenamos un plan a tu medida.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.875rem' }}>
          <a
            href="https://calendly.com/redesignlab"
            target="_blank"
            rel="noopener noreferrer"
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
            <CalendarCheck size={18} strokeWidth={2} />
            Agenda una llamada
          </a>
          <Link
            href="/tools/productos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              borderRadius: 9999,
              background: 'white',
              color: 'var(--color-text-primary, #111827)',
              fontFamily: "'Inter', var(--font-body, sans-serif)",
              fontSize: '0.9375rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid var(--color-border, #e5e7eb)',
              transition: 'all 0.2s',
            }}
          >
            Ver Productos
            <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
