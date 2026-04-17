import { redirect } from 'next/navigation'

/**
 * /demo-tools — Shareable link for founder demo (Ana Quispe / EcoBio Perú).
 * Sets the s4c_demo=founder cookie and drops the user into /tools.
 */
export default function DemoToolsEntry() {
  redirect('/api/demo/founder')
}
