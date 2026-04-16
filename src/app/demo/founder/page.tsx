import { redirect } from 'next/navigation'

/** Pretty entry point — delegates to /api/demo/founder which sets the cookie. */
export default function DemoFounderEntry() {
  redirect('/api/demo/founder')
}
