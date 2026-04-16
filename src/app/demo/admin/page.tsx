import { redirect } from 'next/navigation'

/** Pretty entry point — delegates to /api/demo/admin_org which sets the cookie. */
export default function DemoAdminEntry() {
  redirect('/api/demo/admin_org')
}
