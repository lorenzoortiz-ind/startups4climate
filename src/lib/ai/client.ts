import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
})

export async function chatCompletion(
  messages: Array<{ role: string; content: string }>,
  options?: { stream?: boolean; max_tokens?: number }
) {
  return client.chat.completions.create({
    model: 'deepseek-chat',
    messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    stream: options?.stream ?? false,
    max_tokens: options?.max_tokens ?? 1000,
  })
}

export { client as aiClient }
