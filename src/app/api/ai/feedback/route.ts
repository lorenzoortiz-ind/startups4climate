import { NextRequest } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { chatCompletion } from '@/lib/ai/client'
import { buildStartupContext } from '@/lib/ai/context-builder'

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

    // Load startup context
    const { data: startup } = await supabase
      .from('startups')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const { data: progress } = await supabase
      .from('tool_progress')
      .select('*')
      .eq('user_id', user.id)

    const startupContext = buildStartupContext(startup, progress)

    const messages = [
      {
        role: 'system',
        content: `Eres un mentor experto en startups de impacto en Latinoamerica. Un founder acaba de completar una herramienta de su toolkit. Analiza los datos que ingreso y da retroalimentacion constructiva, especifica y accionable. Maximo 200 palabras. Responde en espanol. No uses emojis ni markdown con # headers. Usa texto plano con vinetas.`,
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

    const completion = await chatCompletion(messages, {
      stream: false,
      max_tokens: 600,
    })

    const feedback =
      'choices' in completion
        ? completion.choices[0]?.message?.content || 'Sin retroalimentacion disponible.'
        : 'Sin retroalimentacion disponible.'

    return Response.json({ feedback })
  } catch (err) {
    console.error('AI feedback error:', err)
    return Response.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
