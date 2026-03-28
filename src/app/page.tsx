import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SocialProof from '@/components/SocialProof'
import ProblemSection from '@/components/ProblemSection'
import ValueProp from '@/components/ValueProp'
import StartupLifecycle from '@/components/StartupLifecycle'
import DiagnosticFeature from '@/components/DiagnosticFeature'
import DiagnosticForm from '@/components/DiagnosticForm'
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
        <DiagnosticFeature />
        <DiagnosticForm />
        <ValueProp />
        <StartupLifecycle />
        <AboutRedesignLab />
        <CTAFinal />
      </main>
      <Footer />
    </>
  )
}
