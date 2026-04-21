import { NextRequest } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { chatCompletion } from '@/lib/ai/client'
import { buildStartupContext } from '@/lib/ai/context-builder'
import {
  checkAndLogAIUsage,
  rateLimitHeaders,
  type RateLimitRole,
} from '@/lib/rate-limit'

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

    // Rate-limit per role
    const { data: roleRow } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const role: RateLimitRole =
      roleRow?.role === 'admin_org' || roleRow?.role === 'superadmin'
        ? roleRow.role
        : 'founder'

    const rateLimit = await checkAndLogAIUsage(supabase, user.id, 'feedback', role)
    if (!rateLimit.allowed) {
      const minutes = Math.max(
        1,
        Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 60000)
      )
      return Response.json(
        {
          error: `Has alcanzado el límite de ${rateLimit.limit} generaciones de feedback por hora. Intenta en ${minutes} min.`,
          remaining: 0,
          resetAt: rateLimit.resetAt.toISOString(),
        },
        { status: 429, headers: rateLimitHeaders(rateLimit) }
      )
    }
    const rlHeaders = rateLimitHeaders(rateLimit)

    const body = await request.json()
    const { toolId, toolData } = body as {
      toolId: string
      toolData: Record<string, unknown>
    }

    if (!toolId || !toolData) {
      return Response.json(
        { error: 'Faltan campos requeridos: toolId, toolData' },
        { status: 400 }
      )
    }

    const toolDataStr = JSON.stringify(toolData)
    if (toolDataStr.length > 4000) {
      return Response.json(
        { error: 'Los datos enviados son demasiado grandes. Máximo 4000 caracteres.' },
        { status: 400 }
      )
    }

    // Load startup context
    const { data: startup } = await supabase
      .from('startups')
      .select('*')
      .eq('founder_id', user.id)
      .single()

    const { data: progress } = await supabase
      .from('tool_data')
      .select('*')
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
      })

      feedback =
        'choices' in completion
          ? completion.choices[0]?.message?.content || 'Sin retroalimentacion disponible.'
          : 'Sin retroalimentacion disponible.'
    } catch (apiError) {
      console.error('[S4C AI] Gemini API error:', apiError)
      feedback = 'El servicio de AI no está disponible en este momento. Por favor intenta de nuevo en unos minutos.'
    }

    return Response.json({ feedback }, { headers: rlHeaders })
  } catch (err) {
    console.error('AI feedback error:', err)
    return Response.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
