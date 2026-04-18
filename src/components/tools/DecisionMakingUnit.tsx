'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, inputStyle, textareaStyle, labelStyle, btnSmall } from './shared'

interface Stakeholder {
  rol: string
  nombre: string
  influencia: number
  estrategia: string
  objeciones: string
}

interface Data {
  stakeholders: Stakeholder[]
}

const ROLES = ['Champion', 'Comprador econ\u00f3mico', 'Usuario final', 'Influenciador t\u00e9cnico', 'Bloqueador potencial']

const emptyStakeholder = (): Stakeholder => ({ rol: 'Champion', nombre: '', influencia: 3, estrategia: '', objeciones: '' })

const DEFAULT: Data = { stakeholders: [emptyStakeholder()] }

const ACCENT = '#1F77F6'

export default function DecisionMakingUnit({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'decision-making-unit', DEFAULT)
  const [openSubs, setOpenSubs] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const toggleSub = (k: string) => setOpenSubs(p => ({ ...p, [k]: !p[k] }))
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const updateStakeholder = (i: number, field: keyof Stakeholder, value: string | number) => {
    setData(p => { const s = [...p.stakeholders]; s[i] = { ...s[i], [field]: value }; return { ...p, stakeholders: s } })
  }
  const addStakeholder = () => setData(p => ({ ...p, stakeholders: [...p.stakeholders, emptyStakeholder()] }))
  const removeStakeholder = (i: number) => setData(p => ({ ...p, stakeholders: p.stakeholders.filter((_, idx) => idx !== i) }))

  const rolColor = (r: string) => {
    switch (r) {
      case 'Champion': return '#1F77F6'
      case 'Comprador econ\u00f3mico': return '#2A222B'
      case 'Usuario final': return '#1F77F6'
      case 'Influenciador t\u00e9cnico': return '#DA4E24'
      case 'Bloqueador potencial': return '#DC2626'
      default: return '#9CA3AF'
    }
  }

  /* Progress: count stakeholders with at least nombre + estrategia filled */
  const filled = data.stakeholders.filter(s => s.nombre.trim() && s.estrategia.trim()).length
  const total = data.stakeholders.length

  const handleReport = () => {
    const content = `
UNIDAD DE TOMA DE DECISIONES

${data.stakeholders.map((s, i) => `STAKEHOLDER ${i + 1}:
  Rol: ${s.rol}
  Nombre/Cargo: ${s.nombre || '(No completado)'}
  Nivel de influencia: ${s.influencia}/5
  Estrategia de abordaje: ${s.estrategia || '(No completado)'}
  Objeciones anticipadas: ${s.objeciones || '(No completado)'}`).join('\n\n')}
    `.trim()
    onGenerateReport(content)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filled} total={total} accentColor={ACCENT} />

      <ToolSection
        number={1}
        title="Stakeholders en la decisi\u00f3n de compra"
        subtitle="Mapea a cada persona involucrada en la decisi\u00f3n de compra"
        insight="En ventas B2B, nunca hay un solo decisor. Identifica al champion, al economic buyer, al technical buyer y al bloqueador."
        insightSource="MEDDIC Sales Framework"
        defaultOpen
        accentColor={ACCENT}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.stakeholders.map((s, i) => (
            <div key={i} style={{
              padding: '1rem',
              borderRadius: 12,
              border: `1px solid ${rolColor(s.rol)}30`,
              background: `${rolColor(s.rol)}10`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: rolColor(s.rol),
                }}>Stakeholder {i + 1}</span>
                {data.stakeholders.length > 1 && (
                  <button onClick={() => removeStakeholder(i)} style={{
                    ...btnSmall,
                    color: '#DC2626',
                    border: '1px solid #DC262630',
                    padding: '0.25rem 0.5rem',
                  }}>
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.625rem', marginBottom: '0.625rem' }}>
                <select
                  value={s.rol}
                  onChange={e => updateStakeholder(i, 'rol', e.target.value)}
                  style={{ ...inputStyle, width: 'auto', color: rolColor(s.rol), fontWeight: 600 }}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <input
                  value={s.nombre}
                  onChange={e => updateStakeholder(i, 'nombre', e.target.value)}
                  placeholder="Nombre / Cargo"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '0.625rem' }}>
                <label style={labelStyle}>Nivel de influencia: {s.influencia}/5</label>
                <input
                  type="range" min={1} max={5} step={1}
                  value={s.influencia}
                  onChange={e => updateStakeholder(i, 'influencia', parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: ACCENT }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.5625rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '0.125rem',
                }}>
                  <span>1 = Muy bajo</span><span>3 = Medio</span><span>5 = Muy alto</span>
                </div>
              </div>

              {/* Collapsible sub-sections */}
              <button onClick={() => toggleSub(`estrategia-${i}`)} style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginBottom: openSubs[`estrategia-${i}`] ? '0.5rem' : 0,
              }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>Estrategia de abordaje</span>
                <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: openSubs[`estrategia-${i}`] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
              {openSubs[`estrategia-${i}`] && (
                <textarea
                  value={s.estrategia}
                  onChange={e => updateStakeholder(i, 'estrategia', e.target.value)}
                  placeholder="\u00bfC\u00f3mo vas a convencer a esta persona?"
                  rows={3}
                  style={{ ...textareaStyle, marginBottom: '0.5rem' }}
                />
              )}

              <button onClick={() => toggleSub(`objeciones-${i}`)} style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginBottom: openSubs[`objeciones-${i}`] ? '0.5rem' : 0,
              }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}>Objeciones anticipadas</span>
                <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: openSubs[`objeciones-${i}`] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
              {openSubs[`objeciones-${i}`] && (
                <textarea
                  value={s.objeciones}
                  onChange={e => updateStakeholder(i, 'objeciones', e.target.value)}
                  placeholder="\u00bfQu\u00e9 objeciones podr\u00eda tener?"
                  rows={3}
                  style={textareaStyle}
                />
              )}
            </div>
          ))}

          <button onClick={addStakeholder} style={{
            ...btnSmall,
            color: ACCENT,
            border: `1px solid ${ACCENT}30`,
            gap: '0.375rem',
          }}>
            <Plus size={14} /> Agregar stakeholder
          </button>
        </div>
      </ToolSection>

      <ToolActionBar
        onSave={handleSave}
        onComplete={onComplete}
        onReport={handleReport}
        saved={saved}
        accentColor={ACCENT}
      />
    </div>
  )
}
