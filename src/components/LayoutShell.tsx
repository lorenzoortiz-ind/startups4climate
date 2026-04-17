'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideChrome =
    pathname.startsWith('/tools') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/superadmin')

  return (
    <>
      {!hideChrome && <Navbar />}
      <AuthModal />
      <main className="flex-grow">{children}</main>
      {!hideChrome && <Footer />}
    </>
  )
}
