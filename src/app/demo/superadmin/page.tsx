import { redirect } from 'next/navigation'

/** Pretty entry point — delegates to /api/demo/superadmin which sets the cookie. */
export default function DemoSuperadminEntry() {
  redirect('/api/demo/superadmin')
}
