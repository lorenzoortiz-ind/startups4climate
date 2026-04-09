import { NextRequest } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { chatCompletion } from '@/lib/ai/client'
import { buildStartupContext } from '@/lib/ai/context-builder'
import { MENTOR_GENERAL_PROMPT } from '@/lib/ai/prompts/mentor-general'

const AGENT_PROMPTS: Record<string, string> = {
  mentor: MENTOR_GENERAL_PROMPT,
  radar: `Eres un analista experto del ecosistema de innovación en Latinoamérica. Respondes en español. Das información sobre tendencias, noticias, fondos de inversión, programas de aceleración y eventos relevantes para startups de impacto en la región. Tus respuestas son concisas y accionables. No uses emojis ni markdown con # headers.`,
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json(
        { error: 'No autenticado. Inicia sesión para usar el chat.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { message, agentType, conversationId, userContext } = body as {
      message: string
      agentType: string
      conversationId?: string
      userContext?: Record<string, unknown>
    }

    if (!message || !agentType) {
      return Response.json(
        { error: 'Faltan campos requeridos: message, agentType' },
        { status: 400 }
      )
    }

    if (message.length > 4000) {
      return Response.json(
        { error: 'El mensaje es demasiado largo. Máximo 4000 caracteres.' },
        { status: 400 }
      )
    }

    // Rate limit: max 30 conversations per day
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabase
      .from('ai_conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', today + 'T00:00:00Z')

    if ((count || 0) >= 30) {
      return Response.json(
        {
          error:
            'Has alcanzado el limite diario de 30 mensajes. Intenta de nuevo manana.',
        },
        { status: 429 }
      )
    }

    // Load startup context (startups table uses founder_id, not user_id)
    const { data: startup } = await supabase
      .from('startups')
      .select('*')
      .eq('founder_id', user.id)
      .single()

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, org_id, startup_name, stage, diagnostic_score')
      .eq('id', user.id)
      .single()

    const { data: progress } = await supabase
      .from('tool_data')
      .select('*')
      .eq('user_id', user.id)

    const startupContext = buildStartupContext(startup, progress, profile, userContext)

    // Load conversation history if conversationId provided
    let history: Array<{ role: string; content: string }> = []
    if (conversationId) {
      const { data: prevConv } = await supabase
        .from('ai_conversations')
        .select('messages')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single()

      if (prevConv?.messages && Array.isArray(prevConv.messages)) {
        history = prevConv.messages
          .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
          .slice(-20)
          .map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          }))
      }
    }

    // Build messages array
    const systemPrompt =
      AGENT_PROMPTS[agentType] || AGENT_PROMPTS.mentor

    const messages = [
      { role: 'system', content: systemPrompt },
      {
        role: 'system',
        content: `CONTEXTO DE LA STARTUP DEL FOUNDER:\n${startupContext}`,
      },
      ...history,
      { role: 'user', content: message },
    ]

    // Call AI
    const completion = await chatCompletion(messages, {
      stream: false,
      max_tokens: 1000,
    })

    // Extract response (non-streaming)
    const aiResponse =
      'choices' in completion
        ? completion.choices[0]?.message?.content || 'Sin respuesta.'
        : 'Sin respuesta.'

    // Save conversation - use the messages jsonb column
    const newMessages = [
      ...history,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() },
    ]

    let convId = conversationId

    if (conversationId) {
      // Update existing conversation
      await supabase
        .from('ai_conversations')
        .update({
          messages: newMessages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId)
        .eq('user_id', user.id)
    } else {
      // Create new conversation
      const { data: newConv } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          agent_type: agentType,
          title: message.slice(0, 100),
          messages: newMessages,
        })
        .select('id')
        .single()

      convId = newConv?.id || crypto.randomUUID()
    }

    return Response.json({
      response: aiResponse,
      conversationId: convId,
    })
  } catch (err) {
    console.error('AI chat error:', err)
    return Response.json(
      { error: 'Error interno del servidor. Intenta de nuevo.' },
      { status: 500 }
    )
  }
}
