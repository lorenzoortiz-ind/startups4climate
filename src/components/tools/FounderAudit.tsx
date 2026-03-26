'use client'

import { Plus, Trash2, Download } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

const SKILLS = [
  { id: 'tech', label: 'Profundidad Técnica / Científica', desc: 'Conocimiento del dominio tecnológico, I+D, publicaciones.' },
  { id: 'commercial', label: 'Ventas y Desarrollo de Negocios', desc: 'Cierre de deals, relaciones con clientes B2B, GTM.' },
  { id: 'finance', label: 'Finanzas y Fundraising', desc: 'Modelado financiero, relaciones con inversores, Cap Table.' },
  { id: 'ops', label: 'Operaciones y Escalabilidad', desc: 'Supply chain, manufactura, gestión de proyectos.' },
  { id: 'regulatory', label: 'Regulatorio y Política Climática', desc: 'Normativas, certificaciones, acceso a grants públicos.' },
  { id: 'climate', label: 'Dominio del Impacto Climático', desc: 'LCA, ERP, métricas ESG, lenguaje de inversores de impacto.' },
]

interface Founder {
  id: string
  name: string
  role: string
  scores: Record<string, number>
}

const COLORS = ['#7C3AED', '#059669', '#D97706', '#0891B2', '#DC2626']

export default function FounderAudit({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [state, setState] = useToolState(userId, 'founder-audit', {
    founders: [
      { id: '1', name: 'Fundador 1', role: 'CEO / Científico', scores: {} },
      { id: '2', name: 'Fundador 2', role: 'CTO / Comercial', scores: {} },
    ] as Founder[],
  })
  const founders = state.founders
  const setFounders = (updater: Founder[] | ((prev: Founder[]) => Founder[])) =>
    setState((prev) => ({ ...prev, founders: typeof updater === 'function' ? updater(prev.founders) : updater }))

  const setScore = (fId: string, skillId: string, v: number) =>
    setFounders((p) => p.map((f) => f.id === fId ? { ...f, scores: { ...f.scores, [skillId]: v } } : f))

  // Team aggregated scores
  const teamScores = SKILLS.map((s) => ({
    ...s,
    max: Math.max(...founders.map((f) => f.scores[s.id] || 0)),
    avg: founders.length > 0 ? founders.reduce((sum, f) => sum + (f.scores[s.id] || 0), 0) / founders.length : 0,
  }))
  const gaps = teamScores.filter((s) => s.max < 3)
  const totalScore = teamScores.reduce((sum, s) => sum + s.max, 0)
  const maxPossible = SKILLS.length * 5

  const handleReport = () => {
    const content = `
AUDITORÍA DEL EQUIPO FUNDADOR

Score total del equipo: ${totalScore}/${maxPossible} (${Math.round((totalScore / maxPossible) * 100)}%)

Perfiles por fundador:
${founders.map((f) => `
  ${f.name} — ${f.role}
  ${SKILLS.map((s) => `  ${s.label}: ${f.scores[s.id] || 0}/5`).join('\n  ')}`).join('\n')}

Fortalezas del equipo (≥4/5):
${teamScores.filter(s => s.max >= 4).map(s => `  ✓ ${s.label}: ${s.max}/5`).join('\n') || '  Ninguna fortaleza destacada todavía.'}

Brechas Críticas (≤2/5):
${gaps.map(s => `  ✗ ${s.label}: ${s.max}/5 — ${s.desc}`).join('\n') || '  Sin brechas críticas identificadas.'}

Plan de Contratación Recomendado:
${gaps.slice(0, 3).map(s => `  → Busca co-fundador o advisor con expertise en: ${s.label}`).join('\n') || '  Equipo equilibrado. Enfócate en advisor board para reforzar áreas secundarias.'}
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Team overview */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Perfil del Equipo</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Evalúa cada habilidad del 1 (principiante) al 5 (experto líder de industria).</p>
          </div>
          <button onClick={() => setFounders((p) => [...p, { id: Date.now().toString(), name: `Fundador ${p.length + 1}`, role: '', scores: {} }])}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: 8, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.15)', color: '#7C3AED', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={13} /> Añadir fundador
          </button>
        </div>

        {founders.map((f, fi) => (
          <div key={f.id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: fi < founders.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
            <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1rem', alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[fi % COLORS.length], flexShrink: 0 }} />
              <input value={f.name} onChange={(e) => setFounders((p) => p.map((x) => x.id === f.id ? { ...x, name: e.target.value } : x))}
                style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 600, outline: 'none', background: 'var(--color-bg-primary)' }} placeholder="Nombre" />
              <input value={f.role} onChange={(e) => setFounders((p) => p.map((x) => x.id === f.id ? { ...x, role: e.target.value } : x))}
                style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', outline: 'none', background: 'var(--color-bg-primary)' }} placeholder="Rol (CEO, CTO...)" />
              {founders.length > 1 && <button onClick={() => setFounders((p) => p.filter((x) => x.id !== f.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', display: 'flex' }}><Trash2 size={14} /></button>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {SKILLS.map((s) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ width: 140, flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>{s.label}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button key={v} onClick={() => setScore(f.id, s.id, v)}
                        style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${(f.scores[s.id] || 0) >= v ? COLORS[fi % COLORS.length] : 'var(--color-border)'}`, background: (f.scores[s.id] || 0) >= v ? COLORS[fi % COLORS.length] : 'var(--color-bg-card)', color: (f.scores[s.id] || 0) >= v ? 'white' : 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Team radar visualization */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>Mapa de Capacidades del Equipo</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {teamScores.map((s) => (
            <div key={s.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{s.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: s.max >= 4 ? '#059669' : s.max >= 3 ? '#D97706' : '#DC2626' }}>{s.max}/5</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--color-bg-muted)' }}>
                <div style={{ height: '100%', borderRadius: 4, background: s.max >= 4 ? '#059669' : s.max >= 3 ? '#D97706' : '#DC2626', width: `${(s.max / 5) * 100}%`, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>
        {gaps.length > 0 && (
          <div style={{ marginTop: '1rem', padding: '0.875rem', borderRadius: 10, background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.12)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 600, color: '#DC2626', marginBottom: '0.375rem' }}>Brechas identificadas</div>
            {gaps.map((g) => <div key={g.id} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>→ {g.label}</div>)}
          </div>
        )}
      </div>

      <button onClick={handleReport} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: 12, background: '#7C3AED', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(124,58,237,0.3)', transition: 'all 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#6D28D9')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#7C3AED')}
      >
        <Download size={17} /> Generar Reporte de Equipo
      </button>
    </div>
  )
}
