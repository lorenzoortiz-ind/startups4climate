import { redirect } from 'next/navigation'

/**
 * /demo-superadmin — Shareable link for MINPRO / government demo.
 * Sets the s4c_demo=superadmin cookie and drops the user into /superadmin.
 */
export default function DemoSuperadminEntry() {
  redirect('/api/demo/superadmin')
}
