'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, CheckCircle2, Circle, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

type Status = 'done' | 'in-progress' | 'missing'

interface DocItem {
  id: string
  label: string
  status: Status
  priority: 'alta' | 'media' | 'baja'
}

interface DocCategory {
  id: string
  label: string
  color: string
  docs: DocItem[]
}

const INITIAL_CATEGORIES: DocCategory[] = [
  {
    id: 'legal', label: 'Legal & Corporativo', color: '#7C3AED',
    docs: [
      { id: 'l1', label: 'Acta de constitución y estatutos vigentes', status: 'missing', priority: 'alta' },
      { id: 'l2', label: 'Cap Table actual (con dilución proyectada)', status: 'missing', priority: 'alta' },
      { id: 'l3', label: 'Contratos fundadores (Vesting, cliff)', status: 'missing', priority: 'alta' },
      { id: 'l4', label: 'NDAs y acuerdos de confidencialidad', status: 'missing', priority: 'media' },
      { id: 'l5', label: 'Contratos con empleados clave', status: 'missing', priority: 'media' },
      { id: 'l6', label: 'Términos y condiciones del servicio', status: 'missing', priority: 'baja' },
    ],
  },
  {
    id: 'ip', label: 'Propiedad Intelectual (IP)', color: '#0891B2',
    docs: [
      { id: 'ip1', label: 'Patentes registradas o solicitudes pendientes (FTO)', status: 'missing', priority: 'alta' },
      { id: 'ip2', label: 'Acuerdos de licencia tecnológica (si aplica)', status: 'missing', priority: 'alta' },
      { id: 'ip3', label: 'Certificados de marcas registradas', status: 'missing', priority: 'media' },
      { id: 'ip4', label: 'Inventario de trade secrets y know-how', status: 'missing', priority: 'media' },
    ],
  },
  {
    id: 'financial', label: 'Finanzas', color: '#059669',
    docs: [
      { id: 'f1', label: 'Estados financieros auditados (3 años)', status: 'missing', priority: 'alta' },
      { id: 'f2', label: 'Proyecciones financieras 3-5 años (con supuestos)', status: 'missing', priority: 'alta' },
      { id: 'f3', label: 'Modelo financiero con análisis de sensibilidad', status: 'missing', priority: 'alta' },
      { id: 'f4', label: 'Unit economics detallados (CAC, LTV, payback)', status: 'missing', priority: 'alta' },
      { id: 'f5', label: 'Runway actual y plan de uso de fondos', status: 'missing', priority: 'media' },
      { id: 'f6', label: 'Historial de rondas anteriores y valoraciones', status: 'missing', priority: 'media' },
    ],
  },
  {
    id: 'technical', label: 'Técnico & Tecnológico', color: '#D97706',
    docs: [
      { id: 't1', label: 'Análisis Técnico-Económico (TEA) con LCOE/LCOC', status: 'missing', priority: 'alta' },
      { id: 't2', label: 'Documentación TRL/CRL con evidencia', status: 'missing', priority: 'alta' },
      { id: 't3', label: 'Resultados de pilotos y métricas de rendimiento', status: 'missing', priority: 'alta' },
      { id: 't4', label: 'Diseños de ingeniería y planos técnicos', status: 'missing', priority: 'media' },
      { id: 't5', label: 'Reportes de pruebas y certificaciones', status: 'missing', priority: 'media' },
    ],
  },
  {
    id: 'esg', label: 'ESG & Impacto Climático', color: '#10B981',
    docs: [
      { id: 'e1', label: 'Análisis de Ciclo de Vida (LCA) completo', status: 'missing', priority: 'alta' },
      { id: 'e2', label: 'Estimación ERP (tCO2eq reducidas con metodología)', status: 'missing', priority: 'alta' },
      { id: 'e3', label: 'Marco de métricas IRIS+ o equivalente', status: 'missing', priority: 'media' },
      { id: 'e4', label: 'Evaluación de riesgos climáticos (TCFD si aplica)', status: 'missing', priority: 'media' },
      { id: 'e5', label: 'Política de diversidad e inclusión del equipo', status: 'missing', priority: 'baja' },
    ],
  },
  {
    id: 'commercial', label: 'Comercial & Clientes', color: '#F97316',
    docs: [
      { id: 'c1', label: 'Contratos de clientes activos y LOIs firmados', status: 'missing', priority: 'alta' },
      { id: 'c2', label: 'Offtake Agreements o cartas de compromiso', status: 'missing', priority: 'alta' },
      { id: 'c3', label: 'Pipeline de ventas con probabilidades', status: 'missing', priority: 'media' },
      { id: 'c4', label: 'Referencias de clientes y testimonios verificables', status: 'missing', priority: 'media' },
    ],
  },
]

const STATUS_ICONS = {
  done: <CheckCircle2 size={15} color="#059669" />,
  'in-progress': <AlertCircle size={15} color="#D97706" />,
  missing: <Circle size={15} color="#D1D5DB" />,
}

const STATUS_LABELS = { done: 'Listo', 'in-progress': 'En proceso', missing: 'Faltante' }

export default function DataRoom({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [state, setState] = useToolState(userId, 'data-room', {
    categories: INITIAL_CATEGORIES as DocCategory[],
  })
  const categories = state.categories
  const setCategories = (updater: DocCategory[] | ((prev: DocCategory[]) => DocCategory[])) =>
    setState((prev) => ({ ...prev, categories: typeof updater === 'function' ? updater(prev.categories) : updater }))
  const [openCats, setOpenCats] = useState<Set<string>>(new Set())

  const updateStatus = (catId: string, docId: string, status: Status) => {
    setCategories((cats) =>
      cats.map((c) =>
        c.id === catId ? { ...c, docs: c.docs.map((d) => (d.id === docId ? { ...d, status } : d)) } : c
      )
    )
  }

  const allDocs = categories.flatMap((c) => c.docs)
  const done = allDocs.filter((d) => d.status === 'done').length
  const inProgress = allDocs.filter((d) => d.status === 'in-progress').length
  const missing = allDocs.filter((d) => d.status === 'missing').length
  const score = Math.round((done / allDocs.length) * 100)
  const highPriorityMissing = allDocs.filter((d) => d.status === 'missing' && d.priority === 'alta').length

  const handleReport = () => {
    const content = `
ARQUITECTURA DATA ROOM CLIMÁTICO
Score de preparación DD: ${score}%

Resumen:
  Documentos listos: ${done}/${allDocs.length}
  En proceso: ${inProgress}
  Faltantes críticos (alta prioridad): ${highPriorityMissing}

${categories.map((cat) => `
${cat.label}:
${cat.docs.map((d) => `  [${d.status === 'done' ? '✓' : d.status === 'in-progress' ? '~' : '✗'}] ${d.label} (${d.priority})`).join('\n')}`).join('\n')}

Documentos Críticos Faltantes:
${allDocs.filter((d) => d.status === 'missing' && d.priority === 'alta').map((d) => `  → ${d.label}`).join('\n') || '  ✓ Sin documentos críticos faltantes.'}

Plan de Acción Recomendado:
${score < 40 ? '  Prioridad inmediata: Prepara los documentos legales y financieros básicos antes de hablar con inversores.' : score < 70 ? '  Enfócate en completar el TEA, LCA y métricas IRIS+. Son los diferenciadores en Due Diligence ESG.' : '  Data Room en buen estado. Prepara índice de acceso y estructura de carpetas en Google Drive / Dropbox.'}
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Score header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Score de Preparación DD
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 700, color: score >= 70 ? '#059669' : score >= 40 ? '#D97706' : '#DC2626', lineHeight: 1 }}>
              {score}%
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Stat label="Listos" value={done} color="#059669" />
            <Stat label="En proceso" value={inProgress} color="#D97706" />
            <Stat label="Faltantes" value={missing} color="#DC2626" />
          </div>
        </div>
        <div style={{ marginTop: '1rem', height: 6, borderRadius: 3, background: 'var(--color-bg-muted)' }}>
          <div style={{ height: '100%', borderRadius: 3, background: score >= 70 ? '#059669' : score >= 40 ? '#D97706' : '#DC2626', width: `${score}%`, transition: 'width 0.6s ease' }} />
        </div>
        {highPriorityMissing > 0 && (
          <div style={{ marginTop: '0.875rem', padding: '0.625rem 0.875rem', borderRadius: 8, background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.12)', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: '#DC2626' }}>
            ⚠ {highPriorityMissing} documentos de alta prioridad faltan. Complétalo antes de hablar con inversores institucionales.
          </div>
        )}
      </motion.div>

      {/* Categories */}
      {categories.map((cat) => {
        const catDone = cat.docs.filter((d) => d.status === 'done').length
        const isOpen = openCats.has(cat.id)
        return (
          <div key={cat.id} style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
            <button
              onClick={() => setOpenCats((s) => { const n = new Set(s); isOpen ? n.delete(cat.id) : n.add(cat.id); return n })}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: `${cat.color}08`, border: 'none', cursor: 'pointer', borderBottom: isOpen ? '1px solid var(--color-border)' : 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{cat.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: catDone === cat.docs.length ? '#059669' : cat.color }}>
                  {catDone}/{cat.docs.length}
                </span>
                {isOpen ? <ChevronDown size={14} color="#9CA3AF" /> : <ChevronRight size={14} color="#9CA3AF" />}
              </div>
            </button>
            {isOpen && (
              <div style={{ padding: '0.75rem' }}>
                {cat.docs.map((doc) => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.5rem', borderRadius: 8, transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {STATUS_ICONS[doc.status]}
                    <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-primary)', lineHeight: 1.4 }}>{doc.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', padding: '0.125rem 0.375rem', borderRadius: 4, background: doc.priority === 'alta' ? 'rgba(220,38,38,0.08)' : doc.priority === 'media' ? 'rgba(217,119,6,0.08)' : 'var(--color-bg-muted)', color: doc.priority === 'alta' ? '#DC2626' : doc.priority === 'media' ? '#D97706' : 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                      {doc.priority}
                    </span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {(['done', 'in-progress', 'missing'] as Status[]).map((s) => (
                        <button key={s} onClick={() => updateStatus(cat.id, doc.id, s)}
                          style={{ padding: '0.25rem 0.5rem', borderRadius: 6, border: `1px solid ${doc.status === s ? cat.color : 'var(--color-border)'}`, background: doc.status === s ? `${cat.color}10` : 'var(--color-bg-card)', color: doc.status === s ? cat.color : 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.625rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          {STATUS_LABELS[s]}
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

      <button
        onClick={handleReport}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: 12, background: '#D97706', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(217,119,6,0.3)', transition: 'all 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#B45309')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#D97706')}
      >
        <Download size={17} />
        Generar Reporte Data Room
      </button>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{label}</div>
    </div>
  )
}
