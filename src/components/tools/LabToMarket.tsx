'use client'

import { useState } from 'react'
import { Download, CheckCircle2, Circle, ChevronDown, ChevronRight } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

type Status = 'done' | 'pending' | 'na'

interface CheckItem { id: string; label: string; desc: string; status: Status }
interface Section { id: string; title: string; color: string; items: CheckItem[] }

const INITIAL_SECTIONS: Section[] = [
  {
    id: 'ip', title: 'Propiedad Intelectual & Transferencia', color: '#7C3AED',
    items: [
      { id: 'ip1', label: 'Identificar y documentar invenciones y know-how', desc: 'Registra todo antes de publicar o presentar en conferencias.', status: 'pending' },
      { id: 'ip2', label: 'Solicitud de patente provisional (si aplica)', desc: 'Protege la fecha de prioridad. Costo aproximado $500-2000 USD.', status: 'pending' },
      { id: 'ip3', label: 'Acuerdo de transferencia tecnológica con universidad/centro', desc: 'Define derechos de explotación y regalías antes de spinoff.', status: 'pending' },
      { id: 'ip4', label: 'Freedom-to-Operate (FTO) analysis', desc: 'Verifica que no infringes patentes de terceros antes de comercializar.', status: 'pending' },
    ],
  },
  {
    id: 'company', title: 'Constitución de la Empresa', color: '#0891B2',
    items: [
      { id: 'c1', label: 'Elegir estructura legal (SAS, SA, LLC)', desc: 'En Latam, SAS es la más flexible para spinoffs y inversores.', status: 'pending' },
      { id: 'c2', label: 'Registrar la empresa y NIT/RFC/RUT', desc: 'Necesario para facturar, contratar y acceder a grants.', status: 'pending' },
      { id: 'c3', label: 'Pacto de socios / Founder Agreement', desc: 'Define vesting, IP assignment, decisiones estratégicas.', status: 'pending' },
      { id: 'c4', label: 'Abrir cuenta bancaria corporativa', desc: 'Separa finanzas personales de las corporativas desde el día 1.', status: 'pending' },
    ],
  },
  {
    id: 'market', title: 'Validación de Mercado', color: '#059669',
    items: [
      { id: 'm1', label: '+20 entrevistas con clientes potenciales documentadas', desc: 'Problem interviews. ¿Qué están pagando hoy para resolver esto?', status: 'pending' },
      { id: 'm2', label: 'Identificar early adopter con problema urgente y presupuesto', desc: 'El cliente que espera ser el primero en adoptar tu tecnología.', status: 'pending' },
      { id: 'm3', label: 'Primer LOI (Carta de Intención) firmada', desc: 'Aunque no sea vinculante, demuestra interés real al mercado.', status: 'pending' },
      { id: 'm4', label: 'Definir precio inicial (willingness to pay)', desc: 'Usa Van Westendorp o comparativas con alternativas fósiles.', status: 'pending' },
    ],
  },
  {
    id: 'team', title: 'Equipo y Advisors', color: '#D97706',
    items: [
      { id: 't1', label: 'Identificar y atraer co-fundador comercial/de negocios', desc: 'El perfil más crítico para un spinoff científico.', status: 'pending' },
      { id: 't2', label: 'Estructurar Scientific Advisory Board', desc: '3-5 expertos que validen la ciencia ante inversores.', status: 'pending' },
      { id: 't3', label: 'Identificar mentor con experiencia en la industria target', desc: 'Alguien que haya vendido a tu cliente ideal antes.', status: 'pending' },
    ],
  },
  {
    id: 'funding', title: 'Financiamiento Inicial', color: '#DC2626',
    items: [
      { id: 'f1', label: 'Mapear grants disponibles (CONACYT, COLCIENCIAS, FONDECYT, etc.)', desc: 'Capital no dilutivo para I+D. Úsalo para llegar al TRL 4-5.', status: 'pending' },
      { id: 'f2', label: 'Aplicar a programa de pre-incubación o aceleradora', desc: 'Programas como Startup Chile, LATAM Green, Wayra Climate.', status: 'pending' },
      { id: 'f3', label: 'Primeras conversaciones con ángeles climáticos', desc: 'Ángeles con experiencia en deep tech o ex-ejecutivos del sector.', status: 'pending' },
    ],
  },
]

export default function LabToMarket({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [state, setToolState] = useToolState(userId, 'lab-to-market', {
    sections: INITIAL_SECTIONS,
  })
  const sections = state.sections
  const setSections = (updater: Section[] | ((prev: Section[]) => Section[])) =>
    setToolState((prev) => ({
      ...prev,
      sections: typeof updater === 'function' ? updater(prev.sections) : updater,
    }))
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())

  const updateStatus = (secId: string, itemId: string, status: Status) =>
    setSections((s) => s.map((sec) => sec.id === secId ? { ...sec, items: sec.items.map((it) => it.id === itemId ? { ...it, status } : it) } : sec))

  const allItems = sections.flatMap((s) => s.items)
  const done = allItems.filter((i) => i.status === 'done').length
  const score = Math.round((done / allItems.length) * 100)

  const handleReport = () => {
    const content = `
GUÍA LAB-TO-MARKET
Score de preparación: ${score}%

${sections.map((s) => `
${s.title}:
${s.items.map((it) => `  [${it.status === 'done' ? '✓' : it.status === 'na' ? 'N/A' : '○'}] ${it.label}
     ${it.desc}`).join('\n')}`).join('\n')}

Próximos pasos prioritarios:
${allItems.filter((i) => i.status === 'pending').slice(0, 5).map((i) => `  → ${i.label}`).join('\n') || '  ✓ Completado.'}
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Progreso Lab-to-Market</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, color: '#7C3AED' }}>{done}/{allItems.length} · {score}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'var(--color-bg-muted)' }}>
            <div style={{ height: '100%', borderRadius: 3, background: score >= 70 ? '#059669' : '#7C3AED', width: `${score}%`, transition: 'width 0.5s' }} />
          </div>
        </div>
      </div>

      {sections.map((sec) => {
        const secDone = sec.items.filter((i) => i.status === 'done').length
        const isOpen = openSections.has(sec.id)
        return (
          <div key={sec.id} style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            <button onClick={() => setOpenSections((s) => { const n = new Set(s); isOpen ? n.delete(sec.id) : n.add(sec.id); return n })}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: `${sec.color}08`, border: 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: sec.color }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{sec.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: secDone === sec.items.length ? '#059669' : sec.color }}>{secDone}/{sec.items.length}</span>
                {isOpen ? <ChevronDown size={14} color="#9CA3AF" /> : <ChevronRight size={14} color="#9CA3AF" />}
              </div>
            </button>
            {isOpen && (
              <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sec.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', borderRadius: 9, background: item.status === 'done' ? `${sec.color}06` : 'transparent', border: `1px solid ${item.status === 'done' ? sec.color + '20' : 'transparent'}`, transition: 'all 0.15s' }}>
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      {item.status === 'done' ? <CheckCircle2 size={16} color={sec.color} /> : <Circle size={16} color="#D1D5DB" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{item.label}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{item.desc}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                      {(['done', 'pending', 'na'] as Status[]).map((s) => (
                        <button key={s} onClick={() => updateStatus(sec.id, item.id, s)}
                          style={{ padding: '0.25rem 0.5rem', borderRadius: 6, border: `1px solid ${item.status === s ? sec.color : 'var(--color-border)'}`, background: item.status === s ? `${sec.color}10` : 'var(--color-bg-card)', color: item.status === s ? sec.color : 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.625rem', cursor: 'pointer' }}>
                          {s === 'done' ? '✓ Listo' : s === 'pending' ? '○ Pendiente' : 'N/A'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <button onClick={handleReport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: 12, background: '#7C3AED', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,0.3)', transition: 'all 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#6D28D9')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#7C3AED')}
      >
        <Download size={17} /> Generar Roadmap Lab-to-Market
      </button>
    </div>
  )
}
