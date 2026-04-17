import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
})

const GEMINI_MODEL = 'gemini-2.5-flash-preview-04-17'

/**
 * Calls the Gemini chat completion endpoint via OpenAI-compatible API.
 * Retries once on 503 (service temporarily unavailable) with a 1.5 s delay.
 */
export async function chatCompletion(
  messages: Array<{ role: string; content: string }>,
  options?: { stream?: boolean; max_tokens?: number }
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const params = {
    model: GEMINI_MODEL,
    messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    stream: false as const,
    max_tokens: options?.max_tokens ?? 1500,
  }

  try {
    return await client.chat.completions.create(params)
  } catch (err) {
    const status = (err as { status?: number }).status
    // Retry once on transient 503/502 from Gemini
    if (status === 503 || status === 502) {
      await new Promise((r) => setTimeout(r, 1500))
      return client.chat.completions.create(params)
    }
    throw err
  }
}

export { client as aiClient }
