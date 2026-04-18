import Hero from '@/components/Hero'
import MethodologiesMarquee from '@/components/MethodologiesMarquee'
import ProblemSection from '@/components/ProblemSection'
import ValueProp from '@/components/ValueProp'
import StartupLifecycle from '@/components/StartupLifecycle'
import DiagnosticFeature from '@/components/DiagnosticFeature'
import DiagnosticForm from '@/components/DiagnosticForm'
import CTAFinal from '@/components/CTAFinal'
import FloatingDiagnosticCTA from '@/components/FloatingDiagnosticCTA'

export default function Home() {
  return (
    <main>
      <Hero />
      <MethodologiesMarquee />
      <ProblemSection />
      <DiagnosticFeature />
      <DiagnosticForm />
      <ValueProp />
      <StartupLifecycle />
      <CTAFinal />
      <FloatingDiagnosticCTA />
    </main>
  )
}
