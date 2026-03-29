import Hero from '@/components/Hero'
import ProblemSection from '@/components/ProblemSection'
import ValueProp from '@/components/ValueProp'
import StartupLifecycle from '@/components/StartupLifecycle'
import DiagnosticFeature from '@/components/DiagnosticFeature'
import DiagnosticForm from '@/components/DiagnosticForm'
import AboutRedesignLab from '@/components/AboutRedesignLab'
import CTAFinal from '@/components/CTAFinal'
import FloatingDiagnosticCTA from '@/components/FloatingDiagnosticCTA'

export default function Home() {
  return (
    <main>
      <Hero />
      <ProblemSection />
      <DiagnosticFeature />
      <DiagnosticForm />
      <ValueProp />
      <StartupLifecycle />
      <AboutRedesignLab />
      <CTAFinal />
      <FloatingDiagnosticCTA />
    </main>
  )
}
