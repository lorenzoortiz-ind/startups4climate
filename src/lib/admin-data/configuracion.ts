/**
 * Loader for /admin/configuracion: organization profile + extended meta fields.
 */
import { supabase } from '@/lib/supabase'
import { DEMO_ORG } from '@/lib/demo/admin-fixtures'

export interface OrgProfile {
  name: string
  website: string
  logo_url: string
  billing_email: string
  plan: string
  max_startups: number
  contract_end: string | null
  startup_count: number
  country: string
  region: string
  orgType: string
  verticalFocus: string[]
  cohortFrequency: string
  mainContactName: string
  mainContactRole: string
  mainContactPhone: string
  socialLinkedIn: string
  socialTwitter: string
  description: string
  programGoals: string
}

const DEMO_PROFILE: OrgProfile = {
  name: DEMO_ORG.name,
  website: 'https://bioinnova.unamad.edu.pe',
  logo_url: '',
  billing_email: 'facturacion@bioinnova.unamad.edu.pe',
  plan: DEMO_ORG.plan.toLowerCase(),
  max_startups: DEMO_ORG.maxStartups,
  contract_end: DEMO_ORG.contractEnd,
  startup_count: DEMO_ORG.activeStartups,
  country: 'Perú',
  region: 'Lima',
  orgType: 'Incubadora',
  verticalFocus: ['ClimaTech', 'Biomateriales', 'AgriTech'],
  cohortFrequency: 'Trimestral',
  mainContactName: 'María Fernández',
  mainContactRole: 'Directora de Innovación',
  mainContactPhone: '+51 999 888 777',
  socialLinkedIn: 'https://linkedin.com/company/bioinnova-pe',
  socialTwitter: 'https://twitter.com/BioInnovaPE',
  description:
    'BioInnova es la incubadora de la Universidad Nacional Amazónica de Madre de Dios enfocada en startups de impacto ambiental con base científica. Acompañamos emprendedores que transforman investigación amazónica en negocios escalables: biomateriales, bioeconomía, AgriTech regenerativa y soluciones para el monitoreo de la Amazonía.',
  programGoals:
    'Para el 2026 buscamos: (1) graduar 12 startups de impacto con tracción comercial validada; (2) movilizar $1.5M en capital catalítico para nuestras startups; (3) firmar 3 alianzas con corporativos de retail y consumo masivo; (4) consolidar la primera red regional Madre de Dios + Cusco + Loreto de incubación amazónica.',
}

interface LoadArgs {
  isDemo: boolean
  orgId: string | null | undefined
}

export async function loadOrgProfile({ isDemo, orgId }: LoadArgs): Promise<OrgProfile | null> {
  if (isDemo) return DEMO_PROFILE
  if (!orgId) return null

  const { data: org, error } = await supabase
    .from('organizations')
    .select('id, name, website, logo_url, billing_email, plan, max_startups, contract_end, meta')
    .eq('id', orgId)
    .maybeSingle()

  if (error) throw error
  if (!org) return null

  // Count startups in the org's cohorts
  const { count } = await supabase
    .from('cohort_startups')
    .select('id', { count: 'exact', head: true })
    .in(
      'cohort_id',
      ((await supabase.from('cohorts').select('id').eq('org_id', orgId)).data ?? []).map((c) => c.id),
    )

  const meta = (org.meta as Record<string, unknown> | null) ?? {}

  return {
    name: org.name || '',
    website: org.website || '',
    logo_url: org.logo_url || '',
    billing_email: org.billing_email || '',
    plan: org.plan || 'starter',
    max_startups: org.max_startups || 25,
    contract_end: org.contract_end ?? null,
    startup_count: count ?? 0,
    country: (meta.country as string) || '',
    region: (meta.region as string) || '',
    orgType: (meta.orgType as string) || '',
    verticalFocus: (meta.verticalFocus as string[]) || [],
    cohortFrequency: (meta.cohortFrequency as string) || '',
    mainContactName: (meta.mainContactName as string) || '',
    mainContactRole: (meta.mainContactRole as string) || '',
    mainContactPhone: (meta.mainContactPhone as string) || '',
    socialLinkedIn: (meta.socialLinkedIn as string) || '',
    socialTwitter: (meta.socialTwitter as string) || '',
    description: (meta.description as string) || '',
    programGoals: (meta.programGoals as string) || '',
  }
}
