'use client'

import { useState } from 'react'
import { Download, CheckCircle2, Circle, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

type ItemStatus = 'done' | 'partial' | 'missing'

interface BankItem {
  id: string
  label: string
  desc: string
  weight: number
  status: ItemStatus
  notes: string
}

interface BankSection {
  id: string
  title: string
  color: string
  icon: string
  items: BankItem[]
}

const INITIAL_SECTIONS: BankSection[] = [
  {
    id: 'tech', title: 'Madurez Tecnológica', color: '#7C3AED', icon: '⚡',
    items: [
      { id: 't1', label: 'TRL 7+ demostrado (prototipo a escala)', desc: 'Sin TRL 7 es casi imposible conseguir project finance. Los prestamistas necesitan certeza técnica.', weight: 15, status: 'missing', notes: '' },
      { id: 't2', label: 'Historial operacional documentado (≥500 horas)', desc: 'Datos de rendimiento reales, no simulaciones. Métricas de disponibilidad, eficiencia y degradación.', weight: 10, status: 'missing', notes: '' },
      { id: 't3', label: 'Independent Technical Review (ITR) por firma certificada', desc: 'Obligatorio para proyecto finance. Firmas como DNV, Bureau Veritas, Black & Veatch.', weight: 10, status: 'missing', notes: '' },
    ],
  },
  {
    id: 'contracts', title: 'Contratos y Offtakes', color: '#059669', icon: '📄',
    items: [
      { id: 'c1', label: 'Offtake Agreement a largo plazo (10-20 años)', desc: 'Contrato de compra de energía/producto firmado. Sin offtake, el proyecto no es bancable.', weight: 20, status: 'missing', notes: '' },
      { id: 'c2', label: 'EPC Contract (Engineering, Procurement, Construction)', desc: 'Contrato llave en mano con un contratista de probada experiencia. Fixed-price preferiblemente.', weight: 10, status: 'missing', notes: '' },
      { id: 'c3', label: 'O&M Agreement (Operations & Maintenance)', desc: 'Contrato de mantenimiento a largo plazo con garantías de rendimiento (availability ≥95%).', weight: 8, status: 'missing', notes: '' },
      { id: 'c4', label: 'Seguro de proyecto (Property + Liability + Business Interruption)', desc: 'Cobertura comprehensiva exigida por cualquier prestamista de deuda.', weight: 5, status: 'missing', notes: '' },
    ],
  },
  {
    id: 'financial', title: 'Estructura Financiera', color: '#0891B2', icon: '💰',
    items: [
      { id: 'f1', label: 'Modelo financiero con DSCR ≥ 1.3x', desc: 'Debt Service Coverage Ratio. Los prestamistas exigen mínimo 1.2-1.3x. Modela escenarios de estrés.', weight: 12, status: 'missing', notes: '' },
      { id: 'f2', label: 'Equity mínimo 20-30% del CAPEX del proyecto', desc: 'El promotor debe poner skin in the game. Sin equity propio, no hay deuda de proyecto.', weight: 8, status: 'missing', notes: '' },
      { id: 'f3', label: 'Proyecciones financieras auditadas (3-5 años)', desc: 'Estados financieros revisados por auditor independiente. Base para el financial model del prestamista.', weight: 5, status: 'missing', notes: '' },
    ],
  },
  {
    id: 'legal', title: 'Legal & Permisos', color: '#DC2626', icon: '⚖️',
    items: [
      { id: 'l1', label: 'Todos los permisos ambientales y de construcción', desc: 'EIA aprobada, permisos municipales y sectoriales. Sin permisos, no hay financiamiento.', weight: 7, status: 'missing', notes: '' },
      { id: 'l2', label: 'Derechos de uso del suelo asegurados', desc: 'Escrituras o arrendamientos de largo plazo para el sitio del proyecto.', weight: 5, status: 'missing', notes: '' },
      { id: 'l3', label: 'SPV / Sociedad de Propósito Especial constituida', desc: 'El proyecto debe estar en una entidad legal separada para el ring-fencing del riesgo.', weight: 5, status: 'missing', notes: '' },
    ],
  },
  {
    id: 'offtake', title: 'Calidad del Offtake', color: '#D97706', icon: '🤝',
    items: [
      { id: 'o1', label: 'Contraparte del offtake con investment-grade rating', desc: 'El comprador debe ser solvente. Sin investment-grade, el banco pedirá garantías adicionales o rechazará.', weight: 10, status: 'missing', notes: '' },
      { id: 'o2', label: 'Precio del offtake cubre OPEX + DSCR con margen', desc: 'El precio pactado debe cubrir costos operativos + servicio de deuda + retorno al equity.', weight: 8, status: 'missing', notes: '' },
    ],
  },
]

const STATUS_CONFIG: Record<ItemStatus, { label: string; color: string; icon: React.ReactNode }> = {
  done: { label: 'Listo', color: '#059669', icon: <CheckCircle2 size={15} /> },
  partial: { label: 'Parcial', color: '#D97706', icon: <AlertCircle size={15} /> },
  missing: { label: 'Falta', color: '#DC2626', icon: <Circle size={15} /> },
}

export default function Bankability({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [state, setToolState] = useToolState(userId, 'bankability', {
    sections: INITIAL_SECTIONS,
  })
  const sections = state.sections
  const setSections = (updater: BankSection[] | ((prev: BankSection[]) => BankSection[])) =>
    setToolState((prev) => ({
      ...prev,
      sections: typeof updater === 'function' ? updater(prev.sections) : updater,
    }))
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const [openNotes, setOpenNotes] = useState<string | null>(null)

  const updateItem = (secId: string, itemId: string, field: keyof BankItem, value: string) =>
    setSections((s) => s.map((sec) => sec.id === secId ? {
      ...sec, items: sec.items.map((it) => it.id === itemId ? { ...it, [field]: value } : it)
    } : sec))

  const allItems = sections.flatMap((s) => s.items)
  const totalWeight = allItems.reduce((s, it) => s + it.weight, 0)
  const earnedWeight = allItems.reduce((s, it) => s + (it.status === 'done' ? it.weight : it.status === 'partial' ? it.weight * 0.5 : 0), 0)
  const score = Math.round((earnedWeight / totalWeight) * 100)

  const getScoreLabel = (s: number) => {
    if (s >= 80) return { label: 'Bancable', color: '#059669', desc: 'Listo para acercarte a prestamistas de project finance' }
    if (s >= 60) return { label: 'Casi Bancable', color: '#D97706', desc: 'Resuelve los gaps críticos antes de ir al mercado de deuda' }
    if (s >= 40) return { label: 'En Desarrollo', color: '#0891B2', desc: 'Foco en offtakes y madurez técnica primero' }
    return { label: 'Pre-Bancable', color: '#DC2626', desc: 'Todavía en etapa de grants y equity. La deuda está lejos.' }
  }
  const scoreLabel = getScoreLabel(score)

  const handleReport = () => {
    const content = `
FRAMEWORK DE BANCABILIDAD
Score de Bancabilidad: ${score}/100 — ${scoreLabel.label}

${scoreLabel.desc}

EVALUACIÓN POR DIMENSIÓN:
${sections.map((s) => {
  const secWeight = s.items.reduce((t, it) => t + it.weight, 0)
  const secEarned = s.items.reduce((t, it) => t + (it.status === 'done' ? it.weight : it.status === 'partial' ? it.weight * 0.5 : 0), 0)
  return `
${s.title} (${Math.round(secEarned / secWeight * 100)}%):
${s.items.map((it) => `  [${it.status === 'done' ? '✓' : it.status === 'partial' ? '~' : '✗'}] ${it.label} (peso: ${it.weight}pts)
     ${it.desc}
     ${it.notes ? 'Notas: ' + it.notes : ''}`).join('\n')}`
}).join('\n')}

GAPS CRÍTICOS (peso alto + status missing):
${allItems.filter((it) => it.status === 'missing' && it.weight >= 8)
  .sort((a, b) => b.weight - a.weight)
  .map((it) => `  → ${it.label} (${it.weight} pts)`)
  .join('\n') || '  ✓ No hay gaps críticos de alto peso.'}

RECOMENDACIONES PARA MEJORAR BANCABILIDAD:
1. Prioriza conseguir un offtake agreement — sin él, nada más importa
2. Alcanza TRL 7+ con datos operacionales reales antes de ir a prestamistas
3. Consigue un ITR de firma reconocida (costo ~$50-150K pero abre puertas)
4. Estructura una SPV limpia y separa el proyecto de la empresa madre
5. Modela el DSCR bajo escenarios de estrés (precio -20%, producción -15%)
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Score */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: `2px solid ${scoreLabel.color}`, padding: '1.5rem', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ flexShrink: 0, width: 80, height: 80, borderRadius: '50%', background: `${scoreLabel.color}12`, border: `3px solid ${scoreLabel.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 800, color: scoreLabel.color }}>{score}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: scoreLabel.color, fontWeight: 600 }}>/ 100</span>
        </div>
        <div>
          <div style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: 9999, background: `${scoreLabel.color}12`, fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: scoreLabel.color, textTransform: 'uppercase', marginBottom: '0.375rem' }}>{scoreLabel.label}</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{scoreLabel.desc}</p>
        </div>
      </div>

      {/* Sections */}
      {sections.map((sec) => {
        const secDone = sec.items.filter((it) => it.status === 'done').length
        const isOpen = openSections.has(sec.id)
        return (
          <div key={sec.id} style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            <button onClick={() => setOpenSections((s) => { const n = new Set(s); isOpen ? n.delete(sec.id) : n.add(sec.id); return n })}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: `${sec.color}08`, border: 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{ fontSize: '1rem' }}>{sec.icon}</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{sec.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: secDone === sec.items.length ? '#059669' : sec.color }}>{secDone}/{sec.items.length}</span>
                {isOpen ? <ChevronDown size={14} color="#9CA3AF" /> : <ChevronRight size={14} color="#9CA3AF" />}
              </div>
            </button>
            {isOpen && (
              <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sec.items.map((item) => {
                  const st = STATUS_CONFIG[item.status]
                  return (
                    <div key={item.id} style={{ padding: '0.875rem', borderRadius: 10, border: `1px solid ${st.color}20`, background: `${st.color}04` }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{ color: st.color, flexShrink: 0, marginTop: 2 }}>{st.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.label}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 700, color: sec.color, background: `${sec.color}10`, padding: '0.15rem 0.5rem', borderRadius: 9999, flexShrink: 0 }}>{item.weight} pts</span>
                          </div>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.4, marginBottom: '0.625rem' }}>{item.desc}</p>
                          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                            {(['done', 'partial', 'missing'] as ItemStatus[]).map((s) => {
                              const sc = STATUS_CONFIG[s]
                              return (
                                <button key={s} onClick={() => updateItem(sec.id, item.id, 'status', s)}
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.625rem', borderRadius: 6, border: `1px solid ${item.status === s ? sc.color : 'var(--color-border)'}`, background: item.status === s ? `${sc.color}10` : 'var(--color-bg-card)', color: item.status === s ? sc.color : 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.6875rem', cursor: 'pointer', fontWeight: item.status === s ? 600 : 400 }}>
                                  {sc.label}
                                </button>
                              )
                            })}
                            <button onClick={() => setOpenNotes(openNotes === item.id ? null : item.id)}
                              style={{ padding: '0.25rem 0.625rem', borderRadius: 6, border: '1px solid var(--color-border)', background: item.notes ? '#EFF6FF' : 'var(--color-bg-card)', color: item.notes ? '#2563EB' : 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.6875rem', cursor: 'pointer' }}>
                              {item.notes ? '📝 Nota' : '+ Nota'}
                            </button>
                          </div>
                          {openNotes === item.id && (
                            <textarea value={item.notes} onChange={(e) => updateItem(sec.id, item.id, 'notes', e.target.value)}
                              placeholder="Notas, próximos pasos, contactos..." rows={2}
                              style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem 0.625rem', borderRadius: 7, border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', outline: 'none', resize: 'vertical', background: 'var(--color-bg-card)' }} />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      <button onClick={handleReport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: 12, background: '#0891B2', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(8,145,178,0.3)', transition: 'all 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#0E7490')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#0891B2')}
      >
        <Download size={17} /> Generar Reporte de Bancabilidad
      </button>
    </div>
  )
}
