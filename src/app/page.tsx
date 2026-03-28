import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SocialProof from '@/components/SocialProof'
import ProblemSection from '@/components/ProblemSection'
import ValueProp from '@/components/ValueProp'
import ForFounders from '@/components/ForFounders'
import StartupLifecycle from '@/components/StartupLifecycle'
import DiagnosticFeature from '@/components/DiagnosticFeature'
import DiagnosticForm from '@/components/DiagnosticForm'
import ForOrganizations from '@/components/ForOrganizations'
import AboutRedesignLab from '@/components/AboutRedesignLab'
import CTAFinal from '@/components/CTAFinal'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'

export default function Home() {
  return (
    <>
      <Navbar />
      <AuthModal />
      <main>
        <Hero />
        <SocialProof />
        <ProblemSection />
        <ValueProp />
        <ForFounders />
        <StartupLifecycle />
        <DiagnosticFeature />
        <DiagnosticForm />
        <ForOrganizations />
        <AboutRedesignLab />
        <CTAFinal />
      </main>
      <Footer />
    </>
  )
}
