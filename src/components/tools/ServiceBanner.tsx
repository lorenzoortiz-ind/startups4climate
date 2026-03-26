'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Mail, X } from 'lucide-react'

const SERVICE_MAP: Record<string, { service: string; category: 'fundadores' | 'inversores'; message: string }> = {
  'trl-calculator': { service: 'Pre-evaluación de impacto climático', category: 'fundadores', message: 'Podemos ayudarte a preparar una evaluación más profunda de tu madurez tecnológica y comercial.' },
  'lean-canvas': { service: 'Taller estratégico', category: 'fundadores', message: 'Nuestro equipo puede facilitar un taller para refinar tu modelo de negocio climate tech.' },
  'lab-to-market': { service: 'Consultoría estratégica', category: 'fundadores', message: 'Te acompañamos en el diseño de tu ruta de laboratorio a mercado con mentores especializados.' },
  'stakeholder-matrix': { service: 'Corporate matchmaking', category: 'fundadores', message: 'Conectamos tu startup con los stakeholders correctos en el ecosistema climático.' },
  'founder-audit': { service: 'Sesión de diagnóstico', category: 'fundadores', message: '¿Quieres una revisión más detallada? Agendemos una sesión personalizada.' },
  'business-models': { service: 'Taller de go-to-market', category: 'fundadores', message: 'Podemos diseñar contigo una estrategia de monetización adaptada a climate tech.' },
  'unit-economics': { service: 'Modelación financiera', category: 'fundadores', message: 'Nuestros analistas pueden construir tu modelo financiero completo con proyecciones detalladas.' },
  'erp-estimator': { service: 'Modelación financiera', category: 'fundadores', message: 'Necesitas un modelo financiero más robusto? Te ayudamos a construirlo.' },
  'pilots-framework': { service: 'Diseño de pilotos B2B', category: 'fundadores', message: 'Te ayudamos a estructurar y negociar tus primeros pilotos con corporativos.' },
  'pitch-deck': { service: 'Stress-test del pitch deck', category: 'fundadores', message: 'Sometemos tu pitch a la mirada crítica de inversores reales antes de que presentes.' },
  'cap-table': { service: 'Estrategia de fundraising', category: 'fundadores', message: 'Diseñamos tu estrategia de cap table y ronda para maximizar tu posición.' },
  'capital-stack': { service: 'CFO as a service', category: 'fundadores', message: 'Estructuramos tu capital stack con blended finance optimizado para climate tech.' },
  'data-room': { service: 'Gestión integral del data room', category: 'fundadores', message: 'Preparamos tu data room para que pase el due diligence de cualquier inversor.' },
  'bankability': { service: 'Consultoría de bancabilidad', category: 'fundadores', message: 'Te acompañamos en el proceso completo de bancabilidad de tu proyecto.' },
  'reverse-dd': { service: 'Preparación para due diligence', category: 'fundadores', message: 'Anticipamos las preguntas de los inversores para que llegues preparado.' },
}

function getDismissKey(toolId: string): string {
  return `s4c-banner-dismissed-${toolId}`
}

export default function ServiceBanner({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(getDismissKey(toolId))
    setDismissed(stored === 'true')
  }, [toolId])

  const handleDismiss = () => {
    localStorage.setItem(getDismissKey(toolId), 'true')
    setDismissed(true)
  }

  if (dismissed) return null

  const info = SERVICE_MAP[toolId] || { service: 'Consultoría climate tech', category: 'fundadores' as const, message: 'Nuestro equipo puede ayudarte de forma personalizada.' }
  const whatsappUrl = `https://wa.me/51989338401?text=${encodeURIComponent(`Hola, me interesa el servicio de ${info.service} para mi startup.`)}`
  const mailtoUrl = `mailto:hello@redesignlab.org?subject=${encodeURIComponent(`Consulta: ${info.service} — ${toolName}`)}`

  return (
    <div style={{
      marginTop: '1.5rem',
      background: 'var(--color-accent-glow, rgba(5,150,105,0.06))',
      borderRadius: 14,
      border: '1px solid rgba(5,150,105,0.12)',
      borderLeft: '3px solid var(--color-accent-primary, #059669)',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          color: 'var(--color-text-primary)',
          margin: 0,
        }}>
          {info.message}
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          color: 'var(--color-accent-primary, #059669)',
          margin: '0.375rem 0 0',
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          fontWeight: 600,
        }}>
          {info.service}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.4375rem 0.875rem', borderRadius: 8,
            background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.15)',
            fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
            color: 'var(--color-accent-primary, #059669)', textDecoration: 'none',
            transition: 'all 0.15s',
          }}
        >
          <MessageCircle size={14} /> WhatsApp
        </a>
        <a
          href={mailtoUrl}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.4375rem 0.875rem', borderRadius: 8,
            background: 'transparent', border: '1px solid var(--color-border)',
            fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
            color: 'var(--color-text-secondary)', textDecoration: 'none',
            transition: 'all 0.15s',
          }}
        >
          <Mail size={14} /> Email
        </a>
        <button
          onClick={handleDismiss}
          aria-label="Cerrar"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0.25rem', lineHeight: 1,
            color: 'var(--color-text-muted)', fontSize: '1rem',
            transition: 'color 0.15s',
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
