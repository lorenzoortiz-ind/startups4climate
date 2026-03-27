'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Mail, X, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { getToolById } from '@/lib/tools-data'

function getDismissKey(toolId: string): string {
  return `s4c-banner-dismissed-${toolId}`
}

export default function ServiceBanner({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dismissed, setDismissed] = useState(true)
  const tool = getToolById(toolId)

  useEffect(() => {
    const stored = localStorage.getItem(getDismissKey(toolId))
    setDismissed(stored === 'true')
  }, [toolId])

  const handleDismiss = () => {
    localStorage.setItem(getDismissKey(toolId), 'true')
    setDismissed(true)
  }

  if (dismissed || !tool) return null

  const hasProduct = !!tool.relatedProduct
  const hasService = !!tool.relatedService
  if (!hasProduct && !hasService) return null

  const message = hasService
    ? `¿Necesitas ayuda personalizada? Nuestro equipo puede acompañarte con: ${tool.relatedService}.`
    : `Lleva este análisis al siguiente nivel con nuestro producto: ${tool.relatedProduct}.`

  const whatsappUrl = `https://wa.me/51989338401?text=${encodeURIComponent(`Hola, completé la herramienta "${toolName}" y me interesa saber más sobre ${tool.relatedService || tool.relatedProduct}.`)}`
  const mailtoUrl = `mailto:hello@redesignlab.org?subject=${encodeURIComponent(`Consulta: ${tool.relatedService || tool.relatedProduct} — ${toolName}`)}`

  return (
    <div style={{
      marginTop: '1.5rem',
      background: 'rgba(5,150,105,0.04)',
      borderRadius: 14,
      border: '1px solid rgba(5,150,105,0.12)',
      borderLeft: '3px solid #059669',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          color: 'var(--color-text-primary)',
          margin: 0,
        }}>
          {message}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.625rem' }}>
          {hasService && (
            <span style={{
              padding: '0.2rem 0.625rem',
              borderRadius: 6,
              background: 'rgba(5,150,105,0.08)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              color: '#059669',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}>
              Servicio disponible
            </span>
          )}
          {hasProduct && (
            <span style={{
              padding: '0.2rem 0.625rem',
              borderRadius: 6,
              background: 'rgba(217,119,6,0.08)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              color: '#D97706',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}>
              Producto disponible
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
        {hasProduct && (
          <Link
            href={`/tools/productos`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.5rem 1rem', borderRadius: 8,
              background: '#059669', border: 'none',
              fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
              color: 'white', textDecoration: 'none',
              transition: 'all 0.15s',
            }}
          >
            <ShoppingCart size={14} /> Ver producto
          </Link>
        )}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.4375rem 0.875rem', borderRadius: 8,
            background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.15)',
            fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
            color: '#059669', textDecoration: 'none',
          }}
        >
          <MessageCircle size={14} /> WhatsApp
        </a>
        <a
          href={mailtoUrl}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            padding: '0.4375rem 0.875rem', borderRadius: 8,
            background: 'transparent', border: '1px solid var(--color-border)',
            fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
            color: 'var(--color-text-secondary)', textDecoration: 'none',
          }}
        >
          <Mail size={14} /> Email
        </a>
        <button
          onClick={handleDismiss}
          aria-label="Cerrar"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0.25rem', lineHeight: 1,
            color: 'var(--color-text-muted)',
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
