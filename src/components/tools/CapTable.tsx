'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Download } from 'lucide-react'
import { useToolState } from '@/lib/useToolState'
import type { ToolComponentProps } from './ToolPage'

interface Founder {
  id: string
  name: string
  shares: string
}

interface Round {
  id: string
  name: string
  type: 'equity' | 'safe' | 'grant' | 'debt'
  preMoneyValuation: string
  amountRaised: string
  investorName: string
}

const COLORS = ['#059669', '#7C3AED', '#D97706', '#0891B2', '#DC2626', '#0D9488']

export default function CapTable({ userId, onComplete, onGenerateReport }: ToolComponentProps) {
  const [state, setState] = useToolState(userId, 'cap-table', {
    founders: [
      { id: '1', name: 'Fundador 1', shares: '600000' },
      { id: '2', name: 'Fundador 2', shares: '400000' },
    ] as Founder[],
    rounds: [
      { id: 'r1', name: 'Pre-Seed', type: 'safe' as const, preMoneyValuation: '2000000', amountRaised: '300000', investorName: 'Angel / Pre-seed VC' },
    ] as Round[],
    optionPool: '10',
  })
  const { founders, rounds, optionPool } = state
  const setFounders = (updater: Founder[] | ((prev: Founder[]) => Founder[])) =>
    setState((prev) => ({ ...prev, founders: typeof updater === 'function' ? updater(prev.founders) : updater }))
  const setRounds = (updater: Round[] | ((prev: Round[]) => Round[])) =>
    setState((prev) => ({ ...prev, rounds: typeof updater === 'function' ? updater(prev.rounds) : updater }))
  const setOptionPool = (value: string) =>
    setState((prev) => ({ ...prev, optionPool: value }))

  const calc = useMemo(() => {
    const totalFounderShares = founders.reduce((s, f) => s + (parseFloat(f.shares) || 0), 0)
    const optionPoolPct = parseFloat(optionPool) / 100 || 0

    // Build share table round by round
    let allEntries: { name: string; shares: number; type: 'founder' | 'option' | 'investor' }[] = [
      ...founders.map((f) => ({ name: f.name, shares: parseFloat(f.shares) || 0, type: 'founder' as const })),
      { name: 'Option Pool', shares: totalFounderShares * (optionPoolPct / (1 - optionPoolPct)), type: 'option' as const },
    ]

    const roundResults: {
      round: Round
      preMoney: number
      postMoney: number
      newShares: number
      pricePerShare: number
      dilution: number
      entries: typeof allEntries
    }[] = []

    for (const round of rounds) {
      if (round.type === 'grant') {
        roundResults.push({
          round,
          preMoney: parseFloat(round.preMoneyValuation) || 0,
          postMoney: parseFloat(round.preMoneyValuation) || 0,
          newShares: 0,
          pricePerShare: 0,
          dilution: 0,
          entries: [...allEntries],
        })
        continue
      }
      const preMoney = parseFloat(round.preMoneyValuation) || 0
      const amount = parseFloat(round.amountRaised) || 0
      const postMoney = preMoney + amount
      const currentTotal = allEntries.reduce((s, e) => s + e.shares, 0)
      const pricePerShare = currentTotal > 0 ? preMoney / currentTotal : 1
      const newShares = pricePerShare > 0 ? amount / pricePerShare : 0
      const dilution = postMoney > 0 ? (amount / postMoney) * 100 : 0

      allEntries = [
        ...allEntries,
        { name: round.investorName || `Inversor (${round.name})`, shares: newShares, type: 'investor' as const },
      ]
      roundResults.push({ round, preMoney, postMoney, newShares: Math.round(newShares), pricePerShare: Math.round(pricePerShare * 100) / 100, dilution: Math.round(dilution * 10) / 10, entries: [...allEntries] })
    }

    const finalEntries = allEntries
    const totalShares = finalEntries.reduce((s, e) => s + e.shares, 0)
    const withPct = finalEntries.map((e) => ({ ...e, pct: totalShares > 0 ? (e.shares / totalShares) * 100 : 0 }))

    return { roundResults, finalEntries: withPct, totalShares }
  }, [founders, rounds, optionPool])

  const addFounder = () => setFounders((p) => [...p, { id: Date.now().toString(), name: `Fundador ${p.length + 1}`, shares: '100000' }])
  const addRound = () => setRounds((p) => [...p, { id: Date.now().toString(), name: `Ronda ${p.length + 1}`, type: 'equity', preMoneyValuation: '5000000', amountRaised: '1000000', investorName: 'VC' }])

  const handleReport = () => {
    const lastRound = calc.roundResults[calc.roundResults.length - 1]
    const content = `
SIMULADOR CAP TABLE — ANÁLISIS MULTI-RONDA

Estructura Inicial:
${founders.map((f) => `  ${f.name}: ${parseInt(f.shares).toLocaleString('es')} acciones`).join('\n')}
  Option Pool: ${optionPool}%

Rondas de Financiamiento:
${calc.roundResults.map((r) => `
  ${r.round.name} (${r.round.type.toUpperCase()})
  Pre-money: $${r.preMoney.toLocaleString('es')}
  Amount raised: $${parseInt(r.round.amountRaised).toLocaleString('es')}
  Post-money: $${r.postMoney.toLocaleString('es')}
  Precio por acción: $${r.pricePerShare.toLocaleString('es')}
  Dilución: ${r.dilution}%
`).join('')}

Cap Table Final:
${calc.finalEntries.map((e, i) => `  ${e.name}: ${Math.round(e.shares).toLocaleString('es')} acciones (${Math.round(e.pct * 10) / 10}%)`).join('\n')}
  TOTAL: ${Math.round(calc.totalShares).toLocaleString('es')} acciones

${lastRound ? `Valoración post-money final: $${lastRound.postMoney.toLocaleString('es')}` : ''}

Alertas:
${calc.finalEntries.filter(e => e.type === 'founder' && e.pct < 20).map(e => `  ⚠ ${e.name} tiene ${Math.round(e.pct)}% — por debajo del umbral recomendado de 20%.`).join('\n') || '  ✓ Todos los fundadores mantienen participaciones saludables.'}
    `.trim()
    onGenerateReport(content)
    onComplete()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Founders */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Equipo Fundador</h3>
          <button onClick={addFounder} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: 8, background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.15)', color: '#D97706', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={13} /> Añadir
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {founders.map((f, i) => (
            <div key={f.id} style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
              <input value={f.name} onChange={(e) => setFounders((p) => p.map((x) => x.id === f.id ? { ...x, name: e.target.value } : x))}
                style={{ flex: 2, padding: '0.5rem 0.625rem', borderRadius: 8, border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none', background: 'var(--color-bg-primary)' }}
                placeholder="Nombre"
              />
              <div style={{ position: 'relative', flex: 1 }}>
                <input type="number" value={f.shares} onChange={(e) => setFounders((p) => p.map((x) => x.id === f.id ? { ...x, shares: e.target.value } : x))}
                  style={{ width: '100%', padding: '0.5rem 0.625rem', paddingRight: '3.5rem', borderRadius: 8, border: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--color-text-primary)', outline: 'none', background: 'var(--color-bg-primary)' }}
                  placeholder="Ej: 500000" step="1000"
                />
                <span style={{ position: 'absolute', right: '0.625rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>shares</span>
              </div>
              {founders.length > 1 && (
                <button onClick={() => setFounders((p) => p.filter((x) => x.id !== f.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', display: 'flex' }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', flex: 2 }}>Option Pool</span>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <input type="number" value={optionPool} onChange={(e) => setOptionPool(e.target.value)}
                style={{ flex: 1, padding: '0.5rem 0.625rem', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', background: 'var(--color-bg-primary)', outline: 'none' }}
                step="0.5" min="0" max="30" placeholder="Ej: 10"
              />
              <span style={{ padding: '0 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', borderLeft: '1px solid var(--color-border)', background: 'var(--color-bg-muted)' }}>%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rounds */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Rondas de Financiamiento</h3>
          <button onClick={addRound} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: 8, background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.15)', color: '#D97706', fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={13} /> Añadir ronda
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {rounds.map((r) => (
            <div key={r.id} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.625rem', flexWrap: 'wrap' }}>
                <input value={r.name} onChange={(e) => setRounds((p) => p.map((x) => x.id === r.id ? { ...x, name: e.target.value } : x))}
                  style={{ flex: '1 1 120px', padding: '0.5rem 0.625rem', borderRadius: 7, border: '1px solid var(--color-border)', fontFamily: 'var(--font-heading)', fontSize: '0.875rem', fontWeight: 600, outline: 'none', background: 'var(--color-bg-card)' }} placeholder="Nombre ronda"
                />
                <select value={r.type} onChange={(e) => setRounds((p) => p.map((x) => x.id === r.id ? { ...x, type: e.target.value as Round['type'] } : x))}
                  style={{ flex: '0 0 110px', padding: '0.5rem 0.625rem', borderRadius: 7, border: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', outline: 'none', background: 'var(--color-bg-card)' }}
                >
                  <option value="equity">Equity</option>
                  <option value="safe">SAFE</option>
                  <option value="grant">Grant</option>
                  <option value="debt">Deuda</option>
                </select>
                {rounds.length > 1 && (
                  <button onClick={() => setRounds((p) => p.filter((x) => x.id !== r.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', display: 'flex' }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              {r.type !== 'grant' && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 120px' }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Pre-money (USD)</div>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>$</span>
                      <input type="number" value={r.preMoneyValuation} onChange={(e) => setRounds((p) => p.map((x) => x.id === r.id ? { ...x, preMoneyValuation: e.target.value } : x))}
                        style={{ width: '100%', padding: '0.5rem 0.625rem', paddingLeft: '1.5rem', borderRadius: 7, border: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', outline: 'none', background: 'var(--color-bg-card)' }}
                        placeholder="Ej: 5000000" step="100000"
                      />
                    </div>
                  </div>
                  <div style={{ flex: '1 1 120px' }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Monto a levantar (USD)</div>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>$</span>
                      <input type="number" value={r.amountRaised} onChange={(e) => setRounds((p) => p.map((x) => x.id === r.id ? { ...x, amountRaised: e.target.value } : x))}
                        style={{ width: '100%', padding: '0.5rem 0.625rem', paddingLeft: '1.5rem', borderRadius: 7, border: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', outline: 'none', background: 'var(--color-bg-card)' }}
                        placeholder="Ej: 1000000" step="50000"
                      />
                    </div>
                  </div>
                  <div style={{ flex: '1 1 120px' }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Inversor</div>
                    <input value={r.investorName} onChange={(e) => setRounds((p) => p.map((x) => x.id === r.id ? { ...x, investorName: e.target.value } : x))}
                      style={{ width: '100%', padding: '0.5rem 0.625rem', borderRadius: 7, border: '1px solid var(--color-border)', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', outline: 'none', background: 'var(--color-bg-card)' }}
                      placeholder="Nombre del inversor"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final cap table */}
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 16, border: '1px solid var(--color-border)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
          Cap Table Final (post-rondas)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {calc.finalEntries.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
              <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{e.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', width: 80, textAlign: 'right' }}>
                {Math.round(e.shares).toLocaleString('es')}
              </span>
              <div style={{ width: 80, height: 6, borderRadius: 3, background: 'var(--color-bg-muted)', flexShrink: 0 }}>
                <div style={{ height: '100%', borderRadius: 3, background: COLORS[i % COLORS.length], width: `${e.pct}%`, transition: 'width 0.5s' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: COLORS[i % COLORS.length], width: 48, textAlign: 'right' }}>
                {Math.round(e.pct * 10) / 10}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleReport}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.875rem', borderRadius: 12, background: '#D97706', color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(217,119,6,0.3)', transition: 'all 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#B45309')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#D97706')}
      >
        <Download size={17} />
        Generar Análisis Cap Table
      </button>
    </div>
  )
}
