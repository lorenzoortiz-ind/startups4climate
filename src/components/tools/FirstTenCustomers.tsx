'use client'

import { useState } from 'react'
import { Save, CheckCircle2, FileText, Plus, Trash2 } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

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

  const statusColor = (s: string) => {
    switch (s) {
      case 'Cliente': return '#0D9488'
      case 'En negociación': return '#2A222B'
      case 'Interesado': return '#0D9488'
      case 'Contactado': return '#FF6B4A'
      default: return '#9CA3AF'
    }
  }

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Summary bar */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 12, border: '1px solid var(--color-border)', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 14, border: '1px solid var(--color-border)', padding: '1.25rem' }}>
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
        <button onClick={addCustomer} style={btnAdd}><Plus size={14} /> Agregar cliente</button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <button onClick={handleSave} style={btnOG}><Save size={15} /> {saved ? '¡Guardado!' : 'Guardar progreso'}</button>
        <button onClick={onComplete} style={btnSG}><CheckCircle2 size={15} /> Marcar como completada</button>
        <button onClick={handleReport} style={btnO}><FileText size={15} /> Generar reporte</button>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-primary)', outline: 'none' }
const btnDanger: React.CSSProperties = { display: 'flex', alignItems: 'center', padding: '0.25rem 0.5rem', borderRadius: 6, background: 'transparent', color: '#DC2626', border: '1px solid #DC262630', cursor: 'pointer' }
const btnAdd: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.8125rem', fontFamily: 'var(--font-body)', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1px solid #0D948830', cursor: 'pointer' }
const btnOG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: '#0D9488', border: '1.5px solid #0D948840', cursor: 'pointer' }
const btnSG: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: '#0D9488', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13,148,136,0.3)' }
const btnO: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: 10, fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600, background: 'transparent', color: 'var(--color-text-secondary)', border: '1.5px solid var(--color-border)', cursor: 'pointer' }
