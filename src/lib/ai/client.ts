import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
})

export async function chatCompletion(
  messages: Array<{ role: string; content: string }>,
  options?: { stream?: boolean; max_tokens?: number }
) {
  return client.chat.completions.create({
    model: 'gemini-2.5-flash',
    messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    stream: options?.stream ?? false,
    max_tokens: options?.max_tokens ?? 1000,
  })
}

export { client as aiClient }
