'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'
import { ToolSection, ToolActionBar, ToolProgress, InsightPanel, inputStyle, btnSmall } from './shared'

interface Customer {
  company: string
  contact: string
  email: string
  status: string
  notes: string
}

interface Data {
  customers: Customer[]
}

const emptyCustomer = (): Customer => ({ company: '', contact: '', email: '', status: 'Por contactar', notes: '' })

const DEFAULT: Data = {
  customers: Array.from({ length: 10 }, emptyCustomer),
}

const STATUSES = ['Por contactar', 'Contactado', 'Interesado', 'En negociación', 'Cliente']

const statusColor = (s: string) => {
  switch (s) {
    case 'Cliente': return '#0D9488'
    case 'En negociación': return '#2A222B'
    case 'Interesado': return '#0D9488'
    case 'Contactado': return '#FF6B4A'
    default: return '#9CA3AF'
  }
}

export default function FirstTenCustomers({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [data, setData] = useToolState<Data>(userId, 'first-10-customers', DEFAULT)
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  const updateCustomer = (i: number, field: keyof Customer, value: string) => {
    setData(p => {
      const customers = [...p.customers]
      customers[i] = { ...customers[i], [field]: value }
      return { ...p, customers }
    })
  }
  const addCustomer = () => setData(p => ({ ...p, customers: [...p.customers, emptyCustomer()] }))
  const removeCustomer = (i: number) => setData(p => ({ ...p, customers: p.customers.filter((_, idx) => idx !== i) }))

  const filled = data.customers.filter(c => c.company.trim().length > 0).length

  const handleReport = () => {
    const content = `
PRIMEROS 10 CLIENTES

${data.customers.map((c, i) => `${i + 1}. ${c.company || '(Sin empresa)'}
   Contacto: ${c.contact || '-'}
   Email: ${c.email || '-'}
   Estado: ${c.status}
   Notas: ${c.notes || '-'}`).join('\n\n')}

RESUMEN:
- Total registrados: ${data.customers.length}
- Clientes: ${data.customers.filter(c => c.status === 'Cliente').length}
- En negociación: ${data.customers.filter(c => c.status === 'En negociación').length}
- Interesados: ${data.customers.filter(c => c.status === 'Interesado').length}
- Contactados: ${data.customers.filter(c => c.status === 'Contactado').length}
- Por contactar: ${data.customers.filter(c => c.status === 'Por contactar').length}
    `.trim()
    onGenerateReport(content)
  }

  const btnDanger: React.CSSProperties = { display: 'flex', alignItems: 'center', padding: '0.25rem 0.5rem', borderRadius: 6, background: 'transparent', color: '#DC2626', border: '1px solid #DC262630', cursor: 'pointer' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ToolProgress filled={filled} total={data.customers.length} accentColor="#0D9488" />

      <InsightPanel title="Referencia académica">
        <p style={{ margin: 0 }}>
          &ldquo;Tus primeros 10 clientes no son un pipeline de ventas — son tu laboratorio de product-market fit.&rdquo;
        </p>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.6875rem',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
          marginTop: '0.25rem',
          display: 'block',
        }}>
          — Stanford Lean LaunchPad
        </span>
      </InsightPanel>

      {/* Summary bar */}
      <ToolSection number={1} title="Pipeline de clientes" subtitle="Estado actual de tu embudo" defaultOpen accentColor="#0D9488">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {STATUSES.map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor(s) }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {s}: {data.customers.filter(c => c.status === s).length}
              </span>
            </div>
          ))}
        </div>

        {/* Customer cards */}
        {data.customers.map((c, i) => (
          <div key={i} style={{ padding: '1rem', borderRadius: 10, border: `1px solid ${statusColor(c.status)}25`, marginBottom: '0.75rem', background: 'var(--color-bg-primary)', borderLeft: `3px solid ${statusColor(c.status)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>#{i + 1}</span>
              {data.customers.length > 1 && <button onClick={() => removeCustomer(i)} style={btnDanger}><Trash2 size={12} /></button>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input value={c.company} onChange={e => updateCustomer(i, 'company', e.target.value)} placeholder="Empresa" style={inputStyle} />
              <input value={c.contact} onChange={e => updateCustomer(i, 'contact', e.target.value)} placeholder="Contacto" style={inputStyle} />
              <input value={c.email} onChange={e => updateCustomer(i, 'email', e.target.value)} placeholder="Email" style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem' }}>
              <select value={c.status} onChange={e => updateCustomer(i, 'status', e.target.value)} style={{ ...inputStyle, width: 'auto', color: statusColor(c.status), fontWeight: 600 }}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input value={c.notes} onChange={e => updateCustomer(i, 'notes', e.target.value)} placeholder="Notas" style={inputStyle} />
            </div>
          </div>
        ))}
        <button onClick={addCustomer} style={{ ...btnSmall, color: '#0D9488', borderColor: '#0D948830' }}><Plus size={14} /> Agregar cliente</button>
      </ToolSection>

      <ToolActionBar
        onSave={handleSave}
        onComplete={onComplete}
        onReport={handleReport}
        saved={saved}
        accentColor="#0D9488"
      />
    </div>
  )
}
