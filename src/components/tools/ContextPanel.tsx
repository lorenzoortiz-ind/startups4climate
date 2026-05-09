'use client'

import React, { useEffect, useState } from 'react'
import { useSections } from '@/contexts/SectionsContext'
import { supabase } from '@/lib/supabase'
import { TOOLS, type ToolDef } from '@/lib/tools-data'

interface ContextPanelProps {
  toolId: string
  activeSectionLabel: string
  tip?: string
}

interface PreviousOutput {
  toolName: string
  outputLabel: string
  value: string
}

export function ContextPanel({ toolId, tip }: ContextPanelProps) {
  const { sections } = useSections()
  const [previousOutputs, setPreviousOutputs] = useState<PreviousOutput[]>([])
  const [loading, setLoading] = useState(true)

  // Find which tool has this toolId in its feedsInto array
  const sourceTool: ToolDef | undefined = (TOOLS as ToolDef[]).find(
    (t) => t.feedsInto?.includes(toolId)
  )

  useEffect(() => {
    if (!sourceTool) {
      setLoading(false)
      return
    }
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('tool_data')
          .select('tool_id, data')
          .eq('user_id', user.id)
          .eq('tool_id', sourceTool!.id)
          .maybeSingle()

        if (data?.data) {
          const toolData = data.data as Record<string, unknown>
          const outputs: PreviousOutput[] = Object.entries(toolData)
            .filter(([, v]) => typeof v === 'string' && (v as string).trim().length > 0)
            .slice(0, 3)
            .map(([key, value]) => ({
              toolName: sourceTool!.shortName,
              outputLabel: key,
              value: (value as string).trim(),
            }))
          setPreviousOutputs(outputs)
        }
      } catch {
        // Silently ignore — panel is supplementary
      } finally {
        setLoading(false)
      }
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceTool?.id])

  const activeSectionLabel = sections.find((s) => s.state === 'active')?.label

  const hasOutputs = previousOutputs.length > 0
  const hasTip = Boolean(tip)

  if (loading) return null
  if (!hasOutputs && !hasTip) return null

  return (
    <div
      aria-label="Panel contextual"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'sticky',
        top: 'calc(44px + 44px + 1.5rem)',
      }}
    >
      {/* Section A: outputs from previous tools */}
      {hasOutputs && (
        <div aria-label="Outputs de herramientas anteriores">
          {previousOutputs.map((out, i) => (
            <div
              key={i}
              style={{
                background: '#0e0e0e',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
                padding: '0.75rem',
                marginBottom: i < previousOutputs.length - 1 ? '0.5rem' : 0,
              }}
            >
              <div style={{
                fontSize: '0.5625rem',
                fontWeight: 700,
                color: 'rgba(59,130,246,0.6)',
                marginBottom: '0.25rem',
              }}>
                {out.toolName}
              </div>
              <div style={{
                fontSize: '0.4375rem',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.25)',
                marginBottom: '0.25rem',
              }}>
                {out.outputLabel}
              </div>
              <div style={{
                fontSize: '0.5rem',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
              }}>
                {out.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section B: contextual tip */}
      {hasTip && (
        <div style={{
          borderLeft: '2px solid rgba(218,78,36,0.35)',
          background: 'rgba(218,78,36,0.06)',
          borderRadius: '0 6px 6px 0',
          padding: '0.625rem 0.75rem',
        }}>
          {activeSectionLabel && (
            <div style={{
              fontSize: '0.4375rem',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              color: 'rgba(218,78,36,0.6)',
              fontFamily: 'monospace',
              fontWeight: 700,
              marginBottom: '0.375rem',
            }}>
              {activeSectionLabel}
            </div>
          )}
          <p style={{
            fontSize: '0.5rem',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.4,
            margin: 0,
          }}>
            {tip}
          </p>
        </div>
      )}
    </div>
  )
}
