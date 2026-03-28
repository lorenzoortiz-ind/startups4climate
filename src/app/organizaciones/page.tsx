import Navbar from '@/components/Navbar'
import AuthModal from '@/components/AuthModal'
import ForOrganizations from '@/components/ForOrganizations'
import Footer from '@/components/Footer'

export default function OrganizacionesPage() {
  return (
    <>
      <Navbar />
      <AuthModal />
      <main style={{ paddingTop: '5rem' }}>
        <ForOrganizations />
      </main>
      <Footer />
    </>
  )
}
