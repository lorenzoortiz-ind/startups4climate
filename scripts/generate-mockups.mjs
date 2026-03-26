/**
 * Generate mockup images for Startups4Climate services page
 * using Google Gemini (Nano Banana) image generation API.
 *
 * Usage:
 *   GEMINI_API_KEY=AIzaSy... node scripts/generate-mockups.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'mockups')

const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) {
  console.error('Error: Set GEMINI_API_KEY environment variable')
  process.exit(1)
}

const MODEL = 'gemini-2.5-flash-image'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const prompts = [
  {
    name: 'pitch-deck-service',
    prompt: 'A professional flat illustration of a climate tech startup pitch deck presentation on a laptop screen, with charts showing CO2 reduction metrics and green energy data, clean minimal style with emerald green (#059669) accents on white background, modern SaaS dashboard aesthetic, no text, high quality mockup',
  },
  {
    name: 'financial-modeling',
    prompt: 'A professional flat illustration of financial modeling for a clean energy startup, showing spreadsheet with unit economics, LTV/CAC charts, and revenue projections on a modern laptop screen, minimal clean style with emerald green (#059669) and teal accents, no text, high quality mockup',
  },
  {
    name: 'due-diligence',
    prompt: 'A professional flat illustration of a data room checklist interface for investor due diligence, showing organized document categories with completion status indicators, clean minimal style with emerald green (#059669) accents, modern digital platform aesthetic, no text, high quality mockup',
  },
  {
    name: 'investor-dashboard',
    prompt: 'A professional flat illustration of an investor deal flow dashboard showing climate tech startup pipeline with TRL scores, climate readiness metrics, and portfolio overview, modern clean interface with teal (#0891B2) accents on white, no text, high quality mockup',
  },
  {
    name: 'capital-stack',
    prompt: 'A professional flat illustration of a blended finance capital stack visualization showing layers of grants, equity, debt and project finance for a climate technology company, modern clean infographic style with emerald green (#059669) and amber accents, no text, high quality mockup',
  },
]

async function generateImage(promptObj) {
  console.log(`Generating: ${promptObj.name}...`)

  const body = {
    contents: [
      {
        parts: [{ text: promptObj.prompt }],
      },
    ],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`  Failed (${res.status}): ${err}`)
    return false
  }

  const json = await res.json()
  const parts = json.candidates?.[0]?.content?.parts || []
  const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith('image/'))

  if (!imagePart) {
    console.error(`  No image returned for ${promptObj.name}`)
    console.log('  Response parts:', parts.map((p) => Object.keys(p)))
    return false
  }

  const buffer = Buffer.from(imagePart.inlineData.data, 'base64')
  const ext = imagePart.inlineData.mimeType === 'image/png' ? 'png' : 'jpg'
  const outPath = path.join(OUTPUT_DIR, `${promptObj.name}.${ext}`)
  fs.writeFileSync(outPath, buffer)
  console.log(`  Saved: ${outPath} (${(buffer.length / 1024).toFixed(0)} KB)`)
  return true
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  console.log(`Output directory: ${OUTPUT_DIR}\n`)

  let success = 0
  for (const p of prompts) {
    const ok = await generateImage(p)
    if (ok) success++
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 2000))
  }

  console.log(`\nDone: ${success}/${prompts.length} images generated`)
}

main().catch(console.error)
