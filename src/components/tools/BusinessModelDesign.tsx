'use client'

import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface RevenueStream { name: string; monthly: number | string }

interface Data {
  modelo: string
  justificacion: string
  streams: RevenueStream[]
  costos: string
  margenBruto: number | string
}

const MODELOS = ['SaaS/Suscripción', 'Marketplace', 'Freemium', 'Licenciamiento', 'Hardware-as-a-Service', 'Venta directa', 'Pay-per-use', 'Otro']

const DEFAULT: Data = {
  modelo: 'SaaS/Suscripción',
  justificacion: '',
  streams: [{ name: '', monthly: '' }],
  costos: '',
  margenBruto: '',
}

export default function BusinessModelDesign({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'business-model-design', DEFAULT)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggle = (k: string) => setOpenSections(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const updateStream = (i: number, field: keyof RevenueStream, value: string) => {
    setData(p => { const s = [...p.streams]; s[i] = { ...s[i], [field]: value }; return { ...p, streams: s } })
  }
  const addStream = () => setData(p => ({ ...p, streams: [...p.streams, { name: '', monthly: '' }] }))
  const removeStream = (i: number) => setData(p => ({ ...p, streams: p.streams.filter((_, idx) => idx !== i) }))

  const totalRevenue = data.streams.reduce((sum, s) => sum + (Number(s.monthly) || 0), 0)

  const handleReport = () => {
    const content = `
DISEÑO DE MODELO DE NEGOCIO

MODELO SELECCIONADO: ${data.modelo}

JUSTIFICACIÓN:
${data.justificacion || '(No completado)'}

FLUJOS DE INGRESOS:
${data.streams.map((s, i) => `${i + 1}. ${s.name || '(Sin nombre)'}: $${Number(s.monthly).toLocaleString()}/mes`).join('\n')}
Total mensual estimado: $${totalRevenue.toLocaleString()}/mes

ESTRUCTURA DE COSTOS PRINCIPALES:
${data.costos || '(No completado)'}

MARGEN BRUTO ESTIMADO: ${data.margenBruto}%
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Model selection - always visible */}
      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem' }}><span style={headingStyle}>Modelo de negocio</span></div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <label style={labelStyle}>Modelo seleccionado</label>
          <select value={data.modelo} onChange={e => setData(p => ({ ...p, modelo: e.target.value }))} style={inputStyle}>
            {MODELOS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <Collapsible title="Justificación" k="justificacion" open={openSections} toggle={toggle}>
        <textarea value={data.justificacion} onChange={e => setData(p => ({ ...p, justificacion: e.target.value }))} placeholder="¿Por qué elegiste este modelo? ¿Cómo se alinea con tu mercado y producto?" rows={4} style={taStyle} />
      </Collapsible>

      {/* Revenue streams - has numbers, always visible */}
      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem' }}><span style={headingStyle}>Flujos de ingresos</span></div>
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          {data.streams.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <input value={s.name} onChange={e => updateStream(i, 'name', e.target.value)} placeholder="Fuente de ingreso" style={{ ...inputStyle, flex: 1 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>$</span>
                <input type="number" value={s.monthly} onChange={e => updateStream(i, 'monthly', e.target.value)} placeholder="0" style={{ ...inputStyle, width: 110 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>/mes</span>
              </div>
              {data.streams.length > 1 && <button onClick={() => removeStream(i)} style={btnDanger}><Trash2 size={12} /></button>}
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
            <button onClick={addStream} style={btnAdd}><Plus size={14} /> Agregar flujo</button>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: '#0D9488' }}>
              Total: ${totalRevenue.toLocaleString()}/mes
            </span>
          </div>
        </div>
      </div>

      <Collapsible title="Estructura de costos principales" k="costos" open={openSections} toggle={toggle}>
        <textarea value={data.costos} onChange={e => setData(p => ({ ...p, costos: e.target.value }))} placeholder="¿Cuáles son tus principales costos fijos y variables?" rows={4} style={taStyle} />
      </Collapsible>

      {/* Margen bruto - number, always visible */}
      <div style={cardStyle}>
        <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={headingStyle}>Margen bruto estimado</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <input type="number" value={data.margenBruto} onChange={e => setData(p => ({ ...p, margenBruto: e.target.value }))} placeholder="0" style={{ ...inputStyle, width: 80, textAlign: 'center' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>%</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <button onClick={handleSave} style={btnOG}><Save size={15} /> {saved ? '¡Guardado!' : 'Guardar progreso'}</button>
        <button onClick={onComplete} style={btnSG}><CheckCircle2 size={15} /> Marcar como completada</button>
        <button onClick={handleReport} style={btnO}><FileText size={15} /> Generar reporte</button>
      </div>
    </div>
  )
}

function Collapsible({ title, k, open, toggle, children }: { title: string; k: string; open: Record<string, boolean>; toggle: (k: string) => void; children: React.ReactNode }) {
  return (
    <div style={cardStyle}>
      <button onClick={() => toggle(k)} style={sectionBtn}>
        <span style={headingStyle}>{title}</span>
        <ChevronDown size={18} color="var(--color-text-muted)" style={{ transition: 'transform 0.2s', transform: open[k] ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      {open[k] && <div style={{ padding: '0 1.25rem 1.25rem' }}>{children}</div>}
    </div>
  )
}

const cardStyle: React.CSSProperties = { background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden' }
const headingStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }
const sectionBtn: React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none' }
const taStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }
const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.375rem', display: 'block' }
const btnDanger: React.CSSProperties = { display: 'flex', alignItems: 'center', padding: '0.35rem 0.5rem', borderRadius: 6, background: 'transparent', color: '#DC2626', border: '1px solid #DC262630', cursor: 'pointer' }
const btnAdd: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.8125rem', fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1px solid #0D948830', cursor: 'pointer' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1.5px solid #0D948840', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#0D9488', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
