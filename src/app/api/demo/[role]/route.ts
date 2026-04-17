import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/demo/[role] — Sets the s4c_demo cookie and redirects to the
 * appropriate landing surface for that role. Designed for direct-link demos
 * (sales, stakeholder presentations) without typing credentials.
 *
 * Roles:
 *   founder    → /tools
 *   admin_org  → /admin
 *   superadmin → /superadmin
 */
const ROLE_TO_DESTINATION: Record<string, string> = {
  founder: '/tools',
  admin_org: '/admin',
  superadmin: '/superadmin',
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ role: string }> }
) {
  const { role } = await context.params

  if (!ROLE_TO_DESTINATION[role]) {
    return NextResponse.redirect(new URL('/', _request.url))
  }

  const destination = ROLE_TO_DESTINATION[role]
  const response = NextResponse.redirect(new URL(destination, _request.url))

  // 24h demo session via cookie that middleware + AuthContext both honor
  response.cookies.set('s4c_demo', role, {
    path: '/',
    maxAge: 86400,
    sameSite: 'lax',
  })

  return response
}
