import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createSupabaseServer } from '@/lib/supabase-server'
import { chatCompletion } from '@/lib/ai/client'
import { buildStartupContext } from '@/lib/ai/context-builder'

const feedbackBodySchema = z.object({
  toolId: z.string().min(1).max(100),
  toolData: z.record(z.unknown()),
})

// In-memory feedback cache: key = `${userId}:${toolId}:${dataHash}`
// Prevents redundant generation when the same founder reopens a completed tool.
const feedbackCache = new Map<string, { feedback: string; cachedAt: number }>()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours
const CACHE_MAX_SIZE = 500

function dataHash(obj: Record<string, unknown>): string {
  const str = JSON.stringify(obj)
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h.toString(36)
}

function getCachedFeedback(key: string): string | null {
  const entry = feedbackCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    feedbackCache.delete(key)
    return null
  }
  return entry.feedback
}

function setCachedFeedback(key: string, feedback: string) {
  if (feedbackCache.size >= CACHE_MAX_SIZE) {
    // Evict oldest entry
    const oldest = feedbackCache.keys().next().value
    if (oldest) feedbackCache.delete(oldest)
  }
  feedbackCache.set(key, { feedback, cachedAt: Date.now() })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json(
        { error: 'No autenticado.' },
        { status: 401 }
      )
    }

    const rawBody = await request.json()
    const parsed = feedbackBodySchema.safeParse(rawBody)
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' },
        { status: 400 }
      )
    }
    const { toolId, toolData } = parsed.data

    const toolDataStr = JSON.stringify(toolData)
    if (toolDataStr.length > 4000) {
      return Response.json(
        { error: 'Los datos enviados son demasiado grandes. Máximo 4000 caracteres.' },
        { status: 400 }
      )
    }

    // Return cached feedback if data hasn't changed
    const cacheKey = `${user.id}:${toolId}:${dataHash(toolData)}`
    const cached = getCachedFeedback(cacheKey)
    if (cached) {
      return Response.json({ feedback: cached, cached: true })
    }

    // Load startup context with specific columns only
    const { data: startup } = await supabase
      .from('startups')
      .select('id, name, vertical, stage, diagnostic_score, founder_id')
      .eq('founder_id', user.id)
      .maybeSingle()

    const { data: progress } = await supabase
      .from('tool_data')
      .select('tool_id, completed, report_generated')
      .eq('user_id', user.id)

    const startupContext = buildStartupContext(startup, progress)

    const messages = [
      {
        role: 'system',
        content: `Eres un mentor experto en startups de impacto en Latinoamérica. Un founder acaba de completar una herramienta de la plataforma. Analiza los datos que ingresó y da retroalimentación constructiva, específica y accionable. Máximo 200 palabras. Responde en español. No uses emojis ni markdown con # headers. Usa texto plano con viñetas.`,
      },
      {
        role: 'system',
        content: `CONTEXTO DE LA STARTUP:\n${startupContext}`,
      },
      {
        role: 'user',
        content: `Herramienta completada: ${toolId}\n\nDatos ingresados:\n${JSON.stringify(toolData, null, 2)}`,
      },
    ]

    let feedback: string
    try {
      const completion = await chatCompletion(messages, {
        stream: false,
        max_tokens: 600,
        label: `feedback:${toolId}`,
      })

      feedback =
        'choices' in completion
          ? completion.choices[0]?.message?.content || 'Sin retroalimentacion disponible.'
          : 'Sin retroalimentacion disponible.'
    } catch (apiError) {
      console.error('[S4C AI] Gemini API error en feedback:', apiError)
      feedback = 'El servicio de AI no está disponible en este momento. Por favor intenta de nuevo en unos minutos.'
    }

    setCachedFeedback(cacheKey, feedback)
    return Response.json({ feedback })
  } catch (err) {
    console.error('[S4C AI] feedback route error:', err)
    return Response.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
