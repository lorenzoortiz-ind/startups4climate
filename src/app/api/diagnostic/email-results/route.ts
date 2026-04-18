import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

type Payload = {
  email: string
  nombre?: string
  startup_name?: string
  total_score: number
  perfil_nombre: string
  perfil_etapa: number | string
  dimension_scores?: Record<string, number>
  recommended_tools?: string[]
  roadmap?: string[]
  inconsistencias?: string[]
}

function renderEmail(p: Payload): { subject: string; html: string; text: string } {
  const safeName = (p.nombre || '').split(' ')[0] || 'founder'
  const subject = `Tu diagnóstico S4C — ${p.perfil_nombre} (${p.total_score} pts)`

  const dims = p.dimension_scores || {}
  const dimRows = Object.entries(dims)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 0;color:#6B6B6B;text-transform:capitalize">${k.replace(
          '_',
          ' ',
        )}</td><td style="padding:6px 0;text-align:right;color:#191919;font-weight:600">${v}</td></tr>`,
    )
    .join('')

  const toolsHtml = (p.recommended_tools || [])
    .map(
      (t, i) =>
        `<li style="padding:6px 0;color:#191919;font-size:14px">${i + 1}. ${t}</li>`,
    )
    .join('')

  const roadmapHtml = (p.roadmap || [])
    .map(
      (r) =>
        `<li style="padding:6px 0;color:#191919;font-size:14px;line-height:1.5">${r}</li>`,
    )
    .join('')

  const incsHtml = (p.inconsistencias || []).length
    ? `<div style="margin-top:24px;padding:16px;background:#FFF4EC;border-radius:12px;border:1px solid rgba(240,114,29,0.3)">
        <p style="margin:0 0 8px 0;color:#F0721D;font-weight:700;font-size:13px">Notas del diagnóstico</p>
        <ul style="margin:0;padding-left:18px;color:#191919;font-size:13px">
          ${(p.inconsistencias || []).map((i) => `<li style="padding:4px 0">${i}</li>`).join('')}
        </ul>
      </div>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F5F2;font-family:'Helvetica Neue',Arial,sans-serif">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F7F5F2;padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E8E4DF">
        <tr><td style="padding:28px 32px;background:linear-gradient(135deg,#DA4E24 0%,#F0721D 100%);color:#FFFFFF">
          <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85">Startups4Climate · Diagnóstico</p>
          <h1 style="margin:8px 0 0 0;font-size:22px;font-weight:700;letter-spacing:-0.02em">Hola ${safeName}, aquí están tus resultados</h1>
        </td></tr>
        <tr><td style="padding:32px">
          <div style="padding:20px;background:#F7F5F2;border-radius:12px;text-align:center">
            <p style="margin:0 0 4px 0;color:#6B6B6B;font-size:12px;letter-spacing:0.06em;text-transform:uppercase">Tu perfil</p>
            <p style="margin:0;color:#191919;font-size:20px;font-weight:700;letter-spacing:-0.02em">${p.perfil_nombre}</p>
            <p style="margin:4px 0 0 0;color:#DA4E24;font-size:14px;font-weight:600">Etapa ${p.perfil_etapa} · ${p.total_score} pts</p>
          </div>

          ${
            p.startup_name
              ? `<p style="margin:20px 0 0 0;color:#6B6B6B;font-size:13px">Startup analizada: <strong style="color:#191919">${p.startup_name}</strong></p>`
              : ''
          }

          ${
            dimRows
              ? `<h3 style="margin:24px 0 8px 0;color:#191919;font-size:14px;font-weight:700;letter-spacing:-0.02em">Score por dimensión</h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #E8E4DF">${dimRows}</table>`
              : ''
          }

          ${
            toolsHtml
              ? `<h3 style="margin:24px 0 8px 0;color:#191919;font-size:14px;font-weight:700;letter-spacing:-0.02em">Herramientas recomendadas</h3>
                <ol style="margin:0;padding-left:0;list-style:none">${toolsHtml}</ol>`
              : ''
          }

          ${
            roadmapHtml
              ? `<h3 style="margin:24px 0 8px 0;color:#191919;font-size:14px;font-weight:700;letter-spacing:-0.02em">Tu roadmap a 30 días</h3>
                <ol style="margin:0;padding-left:18px">${roadmapHtml}</ol>`
              : ''
          }

          ${incsHtml}

          <div style="margin-top:32px;text-align:center">
            <a href="https://startups4climate.org/tools?source=email&score=${p.total_score}&etapa=${p.perfil_etapa}" style="display:inline-block;padding:14px 28px;background:#DA4E24;color:#FFFFFF;text-decoration:none;border-radius:999px;font-weight:700;font-size:14px">Acceder a la plataforma →</a>
          </div>

          <p style="margin:32px 0 0 0;color:#6B6B6B;font-size:12px;line-height:1.5">Guardamos tu diagnóstico. Si creas tu cuenta con este email, podrás ver tu evolución en el tiempo y continuar con las herramientas recomendadas.</p>
        </td></tr>
        <tr><td style="padding:20px 32px;background:#F7F5F2;border-top:1px solid #E8E4DF;color:#6B6B6B;font-size:11px;text-align:center">
          Startups4Climate · Redesign Lab · <a href="mailto:hello@redesignlab.org" style="color:#DA4E24;text-decoration:none">hello@redesignlab.org</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const text = `Hola ${safeName},

Tu diagnóstico S4C:
- Perfil: ${p.perfil_nombre}
- Etapa: ${p.perfil_etapa}
- Score total: ${p.total_score} pts
${p.startup_name ? `- Startup: ${p.startup_name}\n` : ''}
${(p.recommended_tools || []).length ? `Herramientas recomendadas:\n${(p.recommended_tools || []).map((t, i) => `  ${i + 1}. ${t}`).join('\n')}\n` : ''}
${(p.roadmap || []).length ? `Roadmap a 30 días:\n${(p.roadmap || []).map((r) => `  • ${r}`).join('\n')}\n` : ''}
Accede a la plataforma: https://startups4climate.org/tools?source=email&score=${p.total_score}&etapa=${p.perfil_etapa}

— Startups4Climate
`

  return { subject, html, text }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }
    if (typeof body.total_score !== 'number' || !body.perfil_nombre) {
      return NextResponse.json({ error: 'Payload incompleto' }, { status: 400 })
    }
    if (!resend) {
      console.error('[S4C AI] RESEND_API_KEY missing — cannot send diagnostic email')
      return NextResponse.json({ error: 'Email no configurado' }, { status: 500 })
    }

    const { subject, html, text } = renderEmail(body)

    const { data, error } = await resend.emails.send({
      from: 'Startups4Climate <noreply@startups4climate.org>',
      to: body.email,
      replyTo: 'hello@redesignlab.org',
      subject,
      html,
      text,
    })

    if (error) {
      console.error('[S4C AI] resend email error:', error)
      return NextResponse.json({ error: 'No pudimos enviar el email' }, { status: 502 })
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null })
  } catch (err) {
    console.error('[S4C AI] email-results route threw:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
