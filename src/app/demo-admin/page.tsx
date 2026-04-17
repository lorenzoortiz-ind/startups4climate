import { redirect } from 'next/navigation'

/**
 * /demo-admin — Shareable link for organization admin demo (BioInnova UNAMAD).
 * Sets the s4c_demo=admin_org cookie and drops the user into /admin.
 */
export default function DemoAdminEntry() {
  redirect('/api/demo/admin_org')
}
