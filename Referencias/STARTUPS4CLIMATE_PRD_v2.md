# Startups4Climate v2.0 — Product Requirements Document (PRD)

> Documento técnico de producto para la nueva versión de la plataforma.
> Fecha: 27 de marzo de 2026.
> Stack: Next.js 16 + React 19 + TypeScript + Supabase + Vercel.
> Documento de referencia: STARTUPS4CLIMATE_PROPUESTA_REFINADA_v2.md

---

## PARTE I: CONTEXTO Y ALCANCE

---

### 1. Estado actual del producto

La plataforma v1 es una SPA client-first con estas piezas funcionales:

- 24 herramientas interactivas organizadas en 4 etapas (pre-incubación, incubación, aceleración, escalamiento).
- Diagnóstico de Startup Readiness con 10 preguntas que asigna una etapa.
- Desbloqueo progresivo: el founder solo accede a herramientas de su etapa y anteriores.
- Persistencia dual: localStorage (primario) + Supabase (backup async).
- Hook `useToolState` con debounce 500ms para auto-guardado.
- Reportes individuales y globales exportables (Markdown).
- Auth custom con localStorage (sin hashing robusto).
- Secciones de productos pagos y servicios con checkout Stripe (pendiente de configuración).
- 11 componentes legacy sin uso en el repo.
- 2 tablas en Supabase: `diagnostic_leads` y `tool_progress`.
- Deploy automático en Vercel via GitHub push a `main`.

Deuda técnica crítica: auth insegura, metadata desactualizada, sin tests, sin sync bidireccional, sin RLS.

### 2. Objetivo del v2.0

Transformar la plataforma de un toolkit freemium para founders individuales a un ecosistema all-in-one con:

1. Capa gratuita ampliada para founders (herramientas + agentes AI + oportunidades + tendencias).
2. Capa B2B de pago para incubadoras, aceleradoras y gobiernos (panel de administración, reportes, gestión de cohortes).
3. Eliminación del modelo de productos/servicios pagos a founders como fuente principal de ingresos.

### 3. Usuarios del sistema

| Rol | Acceso | Auth |
|---|---|---|
| `visitor` | Landing page, diagnóstico, workbook (con lead capture) | Sin auth |
| `founder` | Plataforma completa: herramientas, agentes AI, RADAR, oportunidades, passport | Supabase Auth (email/password) |
| `admin_org` | Panel B2B: dashboard, cohortes, reportes, benchmarking | Supabase Auth + rol `admin_org` + org_id |
| `superadmin` | Todo + gestión de organizaciones, configuración global, analytics | Supabase Auth + rol `superadmin` |

---

## PARTE II: INFRAESTRUCTURA Y DEUDA TÉCNICA

---

### 4. Migración de autenticación

Prioridad: CRÍTICA. Bloquea todo lo demás.

#### 4.1 De localStorage auth a Supabase Auth

Estado actual:
```typescript
// context/AuthContext.tsx (actual)
interface User {
  id: string
  name: string
  email: string
  startup: string
  stage: string | null
  diagnosticScore: number | null
  createdAt: string
}
// Passwords en localStorage, sin hashing robusto
```

Estado objetivo:
```typescript
// context/AuthContext.tsx (nuevo)
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Session, User as SupabaseUser } from '@supabase/supabase-js'

interface AppUser {
  id: string                    // UUID de Supabase Auth
  email: string
  role: 'founder' | 'admin_org' | 'superadmin'
  org_id: string | null         // null para founders, UUID para admin_org
  profile: StartupProfile | null
  created_at: string
}

interface AuthContextType {
  user: AppUser | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata: SignUpMetadata) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<StartupProfile>) => Promise<void>
}
```

Tareas de migración:
1. Habilitar Supabase Auth en el proyecto (email/password provider).
2. Crear tabla `profiles` en Supabase (linked a `auth.users` via FK).
3. Reescribir `AuthContext.tsx` para usar `createClientComponentClient`.
4. Reescribir `AuthModal.tsx` para usar `supabase.auth.signUp()` / `signIn()`.
5. Crear script de migración para usuarios existentes en localStorage.
6. Agregar middleware de Next.js para proteger rutas `/tools/*` y `/admin/*`.
7. Eliminar todo password handling de localStorage.

#### 4.2 Middleware de protección de rutas

```typescript
// middleware.ts (nuevo archivo en raíz del proyecto)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // Rutas protegidas para founders
  if (path.startsWith('/tools') && !session) {
    return NextResponse.redirect(new URL('/?auth=login', req.url))
  }

  // Rutas protegidas para admin_org
  if (path.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/?auth=login', req.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin_org' && profile?.role !== 'superadmin') {
      return NextResponse.redirect(new URL('/tools', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/tools/:path*', '/admin/:path*']
}
```

#### 4.3 Row Level Security (RLS)

Políticas RLS para cada tabla:

```sql
-- profiles: cada usuario solo ve su propio perfil
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- startups: cada founder ve su propia startup
CREATE POLICY "Founders read own startup"
  ON startups FOR SELECT
  USING (auth.uid() = founder_id);

-- startups: admin_org ve las startups de su organización
CREATE POLICY "Admins read org startups"
  ON startups FOR SELECT
  USING (
    id IN (
      SELECT startup_id FROM cohort_startups cs
      JOIN cohorts c ON cs.cohort_id = c.id
      WHERE c.org_id = (
        SELECT org_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- tool_progress: cada founder ve su propio progreso
CREATE POLICY "Founders read own progress"
  ON tool_progress FOR SELECT
  USING (auth.uid() = user_id);

-- tool_progress: admin_org ve el progreso de startups en su org
CREATE POLICY "Admins read org progress"
  ON tool_progress FOR SELECT
  USING (
    user_id IN (
      SELECT s.founder_id FROM startups s
      JOIN cohort_startups cs ON s.id = cs.startup_id
      JOIN cohorts c ON cs.cohort_id = c.id
      WHERE c.org_id = (
        SELECT org_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- ai_conversations: cada usuario solo ve sus conversaciones
CREATE POLICY "Users read own conversations"
  ON ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

-- organizations: admin_org solo ve su organización
CREATE POLICY "Admins read own org"
  ON organizations FOR SELECT
  USING (
    id = (SELECT org_id FROM profiles WHERE id = auth.uid())
  );

-- superadmin: acceso total
CREATE POLICY "Superadmin full access"
  ON profiles FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
  );
```

---

### 5. Schema de base de datos (Supabase PostgreSQL)

#### 5.1 Tablas existentes (migración)

```sql
-- diagnostic_leads: se mantiene, se agrega FK a profiles
ALTER TABLE diagnostic_leads ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- tool_progress: se mantiene, se agrega FK a profiles
ALTER TABLE tool_progress ADD COLUMN user_id UUID REFERENCES auth.users(id);
```

#### 5.2 Nuevas tablas

```sql
-- ==========================================
-- PROFILES (linked a Supabase Auth)
-- ==========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'founder' CHECK (role IN ('founder', 'admin_org', 'superadmin')),
  org_id UUID REFERENCES organizations(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: crear profile automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'founder')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==========================================
-- STARTUPS (perfil progresivo)
-- ==========================================
CREATE TABLE startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  vertical TEXT NOT NULL CHECK (vertical IN (
    'fintech', 'healthtech', 'edtech', 'agritech_foodtech',
    'cleantech_climatech', 'biotech_deeptech', 'logistics_mobility',
    'saas_enterprise', 'social_impact', 'other'
  )),
  country TEXT NOT NULL,
  stage TEXT CHECK (stage IN ('pre_incubation', 'incubation', 'acceleration', 'scaling')),
  diagnostic_score INTEGER,
  phone TEXT,
  website TEXT,
  linkedin TEXT,
  logo_url TEXT,

  -- Datos progresivos (se actualizan cuando el founder completa herramientas)
  team_size INTEGER,
  revenue_model TEXT,
  monthly_revenue DECIMAL(12,2),
  tam_usd DECIMAL(15,2),
  ltv DECIMAL(12,2),
  cac DECIMAL(12,2),
  has_mvp BOOLEAN DEFAULT FALSE,
  has_paying_customers BOOLEAN DEFAULT FALSE,
  paying_customers_count INTEGER DEFAULT 0,

  -- Metadata
  diagnostic_answers JSONB,
  score_by_dimension JSONB,
  tools_completed INTEGER DEFAULT 0,
  current_stage_progress DECIMAL(5,2) DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_startups_founder ON startups(founder_id);
CREATE INDEX idx_startups_vertical ON startups(vertical);
CREATE INDEX idx_startups_country ON startups(country);
CREATE INDEX idx_startups_stage ON startups(stage);


-- ==========================================
-- ORGANIZATIONS (clientes B2B)
-- ==========================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'incubator', 'accelerator', 'government', 'university',
    'investment_fund', 'ngo', 'international_org'
  )),
  country TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise', 'institutional')),
  max_startups INTEGER NOT NULL DEFAULT 25,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  billing_email TEXT,
  contract_start DATE,
  contract_end DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==========================================
-- COHORTS
-- ==========================================
CREATE TABLE cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  milestones JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cohorts_org ON cohorts(org_id);


-- ==========================================
-- COHORT_STARTUPS (join table)
-- ==========================================
CREATE TABLE cohort_startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'dropped', 'paused')),
  notes TEXT,
  UNIQUE(cohort_id, startup_id)
);

CREATE INDEX idx_cohort_startups_cohort ON cohort_startups(cohort_id);
CREATE INDEX idx_cohort_startups_startup ON cohort_startups(startup_id);


-- ==========================================
-- AI_CONVERSATIONS
-- ==========================================
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agent_type TEXT NOT NULL CHECK (agent_type IN ('mentor', 'radar', 'opportunities', 'tool_feedback')),
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  -- Formato messages: [{ role: 'user'|'assistant', content: string, timestamp: string }]
  tokens_used INTEGER DEFAULT 0,
  model_used TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_agent ON ai_conversations(agent_type);


-- ==========================================
-- NEWS_ITEMS (RADAR)
-- ==========================================
CREATE TABLE news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  image_url TEXT,
  vertical TEXT,
  country TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN (
    'news', 'regulation', 'investment', 'trend', 'event', 'report'
  )),
  tags TEXT[] DEFAULT '{}',
  embedding VECTOR(1536),  -- requiere extensión pgvector
  published_at TIMESTAMPTZ,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_news_items_vertical ON news_items(vertical);
CREATE INDEX idx_news_items_country ON news_items(country);
CREATE INDEX idx_news_items_published ON news_items(published_at DESC);
CREATE INDEX idx_news_items_embedding ON news_items USING ivfflat (embedding vector_cosine_ops);


-- ==========================================
-- OPPORTUNITIES
-- ==========================================
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'grant', 'competition', 'accelerator', 'investment_fund',
    'soft_loan', 'award', 'fellowship'
  )),
  amount_min DECIMAL(12,2),
  amount_max DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  eligible_countries TEXT[] DEFAULT '{}',
  eligible_verticals TEXT[] DEFAULT '{}',
  eligible_stages TEXT[] DEFAULT '{}',
  requirements JSONB,
  application_url TEXT,
  deadline TIMESTAMPTZ,
  is_rolling BOOLEAN DEFAULT FALSE,
  source_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_opportunities_deadline ON opportunities(deadline);
CREATE INDEX idx_opportunities_type ON opportunities(type);
CREATE INDEX idx_opportunities_active ON opportunities(is_active) WHERE is_active = TRUE;


-- ==========================================
-- OPPORTUNITY_MATCHES
-- ==========================================
CREATE TABLE opportunity_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  match_score DECIMAL(5,2) NOT NULL,  -- 0.00 a 100.00
  match_reasons JSONB,
  status TEXT NOT NULL DEFAULT 'suggested' CHECK (status IN (
    'suggested', 'interested', 'applied', 'accepted', 'rejected', 'dismissed'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(startup_id, opportunity_id)
);

CREATE INDEX idx_matches_startup ON opportunity_matches(startup_id);


-- ==========================================
-- WORKBOOK_DOWNLOADS (lead capture)
-- ==========================================
CREATE TABLE workbook_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  user_id UUID REFERENCES profiles(id),  -- null si no está registrado
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==========================================
-- CERTIFICATES
-- ==========================================
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN ('pre_incubation', 'incubation', 'acceleration', 'scaling')),
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  certificate_url TEXT,
  UNIQUE(startup_id, stage)
);
```

#### 5.3 Extensiones requeridas en Supabase

```sql
-- Para embeddings del RADAR (búsqueda semántica)
CREATE EXTENSION IF NOT EXISTS vector;

-- Para búsqueda full-text en español
CREATE EXTENSION IF NOT EXISTS unaccent;
```

---

## PARTE III: ESTRUCTURA DE ARCHIVOS v2.0

---

### 6. Árbol de directorios objetivo

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, AuthProvider, ThemeProvider)
│   ├── page.tsx                      # Landing page (reescrita)
│   ├── globals.css                   # Design tokens existentes + nuevos tokens
│   ├── middleware.ts                 # Auth middleware (NUEVO)
│   │
│   ├── api/                          # API Routes (NUEVO, todo server-side)
│   │   ├── ai/
│   │   │   ├── chat/route.ts         # Chat con agentes (mentor, RADAR, oportunidades)
│   │   │   ├── feedback/route.ts     # Feedback AI sobre herramientas completadas
│   │   │   └── match/route.ts        # Matching de oportunidades
│   │   ├── radar/
│   │   │   ├── scrape/route.ts       # Cron endpoint para scraping de noticias
│   │   │   └── search/route.ts       # Búsqueda semántica en news_items
│   │   ├── reports/
│   │   │   ├── startup/route.ts      # Generar reporte PDF de startup
│   │   │   ├── cohort/route.ts       # Generar reporte PDF de cohorte
│   │   │   └── passport/route.ts     # Generar Startup Passport PDF
│   │   ├── workbook/
│   │   │   └── download/route.ts     # Lead capture + entrega de Workbook PDF
│   │   └── webhooks/
│   │       └── stripe/route.ts       # Webhook de Stripe para pagos B2B
│   │
│   ├── workbook/
│   │   └── page.tsx                  # Landing pública del Workbook (NUEVO)
│   │
│   ├── tools/                        # Plataforma founder (requiere auth role=founder)
│   │   ├── layout.tsx                # Sidebar actualizada con nuevas secciones
│   │   ├── page.tsx                  # Dashboard principal (herramientas)
│   │   ├── [id]/page.tsx             # Herramienta individual
│   │   ├── mentor/page.tsx           # Chat con agente mentor (NUEVO)
│   │   ├── radar/page.tsx            # Feed RADAR + chat (NUEVO)
│   │   ├── oportunidades/page.tsx    # Oportunidades + matching (NUEVO)
│   │   ├── passport/page.tsx         # Startup Passport (NUEVO)
│   │   ├── perfil/page.tsx           # Perfil del founder (reescrito)
│   │   └── recursos/page.tsx         # Stack tech recomendado (se mantiene)
│   │
│   └── admin/                        # Panel B2B (requiere auth role=admin_org) (NUEVO)
│       ├── layout.tsx                # Layout del panel admin
│       ├── page.tsx                  # Dashboard de portafolio
│       ├── cohortes/
│       │   ├── page.tsx              # Lista de cohortes
│       │   ├── [id]/page.tsx         # Detalle de cohorte
│       │   └── nueva/page.tsx        # Crear cohorte
│       ├── startups/
│       │   └── [id]/page.tsx         # Vista detallada de startup (read-only)
│       ├── reportes/page.tsx         # Generación de reportes
│       ├── benchmarking/page.tsx     # Comparativos
│       └── configuracion/page.tsx    # Configuración de la organización
│
├── components/
│   ├── landing/                      # Componentes de la landing (reorganizados)
│   │   ├── Hero.tsx                  # Reescrito con nueva propuesta de valor
│   │   ├── ProblemSection.tsx        # Actualizado: 3 problemas (founders, incubadoras, gobiernos)
│   │   ├── ValueProp.tsx             # Actualizado: nueva propuesta de valor
│   │   ├── ForFounders.tsx           # Sección para founders (NUEVO)
│   │   ├── ForOrganizations.tsx      # Sección para incubadoras/gobiernos (NUEVO)
│   │   ├── StartupLifecycle.tsx      # Se mantiene, verticales actualizadas
│   │   ├── DiagnosticFeature.tsx     # Se mantiene
│   │   ├── DiagnosticForm.tsx        # Actualizado: 10 verticales en lugar de 16
│   │   ├── AboutRedesignLab.tsx      # Se mantiene
│   │   ├── CTAFinal.tsx              # Se mantiene
│   │   ├── SocialProof.tsx           # Se mantiene
│   │   ├── Navbar.tsx                # Actualizado: link a /admin si es admin_org
│   │   └── Footer.tsx                # Actualizado: nuevas secciones
│   │
│   ├── auth/                         # Componentes de auth (NUEVO)
│   │   ├── AuthModal.tsx             # Reescrito para Supabase Auth
│   │   ├── AuthGuard.tsx             # Wrapper que redirige si no auth
│   │   └── RoleGuard.tsx             # Wrapper que valida rol
│   │
│   ├── tools/                        # Componentes de herramientas (existentes)
│   │   ├── ToolPage.tsx              # Actualizado: botón "Feedback AI" agregado
│   │   ├── ToolFeedbackButton.tsx    # Botón que pide feedback AI (NUEVO)
│   │   ├── ToolModeToggle.tsx        # Toggle modo guiado/avanzado (NUEVO)
│   │   ├── DarkModeToggle.tsx        # Se mantiene
│   │   ├── ServiceBanner.tsx         # Se elimina (ya no hay upselling a founders)
│   │   ├── PassionPurpose.tsx        # Se mantiene (herramienta 1)
│   │   ├── MarketSegmentation.tsx    # Se mantiene (herramienta 2)
│   │   ├── ... (herramientas 3-24)   # Se mantienen
│   │   ├── CompetitorAnalysis.tsx    # NUEVA herramienta 25
│   │   ├── DataRoomBuilder.tsx       # NUEVA herramienta 26
│   │   ├── OKRTracker.tsx            # NUEVA herramienta 27
│   │   ├── RegulatoryCompass.tsx     # NUEVA herramienta 28
│   │   ├── ImpactMetrics.tsx         # NUEVA herramienta 29
│   │   └── FinancialModelBuilder.tsx # NUEVA herramienta 30
│   │
│   ├── ai/                           # Componentes de AI (NUEVO)
│   │   ├── ChatInterface.tsx         # Chat reutilizable con streaming
│   │   ├── ChatMessage.tsx           # Burbuja de mensaje (user/assistant)
│   │   ├── ChatInput.tsx             # Input con envío
│   │   ├── AgentAvatar.tsx           # Avatar del agente por vertical
│   │   └── StreamingText.tsx         # Componente de texto con efecto streaming
│   │
│   ├── radar/                        # Componentes de RADAR (NUEVO)
│   │   ├── NewsFeed.tsx              # Feed de noticias con filtros
│   │   ├── NewsCard.tsx              # Card individual de noticia
│   │   ├── RadarFilters.tsx          # Filtros por vertical, país, tipo
│   │   └── RadarChat.tsx             # Chat integrado con agente RADAR
│   │
│   ├── opportunities/                # Componentes de oportunidades (NUEVO)
│   │   ├── OpportunityFeed.tsx       # Feed general con filtros
│   │   ├── OpportunityCard.tsx       # Card individual
│   │   ├── MatchedOpportunities.tsx  # Vista personalizada con match score
│   │   ├── OpportunityDetail.tsx     # Vista detallada de oportunidad
│   │   └── ApplicationAssistant.tsx  # Asistente AI para aplicar
│   │
│   ├── passport/                     # Componentes de Startup Passport (NUEVO)
│   │   ├── PassportView.tsx          # Vista del passport
│   │   ├── PassportSection.tsx       # Sección reutilizable
│   │   └── PassportExport.tsx        # Botón de exportación PDF
│   │
│   ├── admin/                        # Componentes del panel B2B (NUEVO)
│   │   ├── AdminSidebar.tsx          # Sidebar del panel admin
│   │   ├── PortfolioDashboard.tsx    # Dashboard con métricas agregadas
│   │   ├── CohortManager.tsx         # CRUD de cohortes
│   │   ├── CohortDetail.tsx          # Vista detallada de cohorte
│   │   ├── StartupCard.tsx           # Card de startup en el portafolio
│   │   ├── StartupDetailView.tsx     # Vista read-only de una startup
│   │   ├── ProgressChart.tsx         # Gráfico de progreso (recharts)
│   │   ├── StageDistribution.tsx     # Distribución por etapa (recharts)
│   │   ├── VerticalDistribution.tsx  # Distribución por vertical (recharts)
│   │   ├── BenchmarkComparison.tsx   # Comparativo con promedios regionales
│   │   ├── ReportGenerator.tsx       # Generador de reportes PDF
│   │   └── AlertsList.tsx            # Alertas (startups estancadas, avances)
│   │
│   └── shared/                       # Componentes compartidos (NUEVO)
│       ├── FadeUp.tsx                # Se mueve desde components/
│       ├── AnimatedCounter.tsx       # Se mueve desde components/
│       ├── S4CLogo.tsx               # Se mueve desde components/
│       ├── Badge.tsx                 # Badge reutilizable (etapa, vertical)
│       ├── EmptyState.tsx            # Estado vacío genérico
│       ├── LoadingSkeleton.tsx       # Skeleton loading
│       ├── VerticalIcon.tsx          # Ícono por vertical
│       └── StageIndicator.tsx        # Indicador visual de etapa
│
├── context/
│   ├── AuthContext.tsx               # Reescrito con Supabase Auth
│   └── StartupContext.tsx            # Contexto del perfil progresivo (NUEVO)
│
├── lib/
│   ├── supabase.ts                   # Cliente Supabase (se mantiene)
│   ├── supabase-server.ts            # Cliente Supabase server-side (NUEVO)
│   ├── supabase-admin.ts             # Cliente Supabase con service_role key (NUEVO)
│   ├── tools-data.ts                 # Actualizado: 30 herramientas, 10 verticales
│   ├── progress.ts                   # Actualizado: sync bidireccional
│   ├── useToolState.ts               # Se mantiene (hook de auto-guardado)
│   ├── report-formatters.ts          # Actualizado: nuevos formatos
│   ├── ai/                           # Módulos de AI (NUEVO)
│   │   ├── client.ts                 # Cliente unificado para DeepSeek/Gemini/Claude
│   │   ├── prompts/                  # System prompts
│   │   │   ├── mentor-fintech.ts
│   │   │   ├── mentor-healthtech.ts
│   │   │   ├── mentor-edtech.ts
│   │   │   ├── mentor-agritech.ts
│   │   │   ├── mentor-cleantech.ts
│   │   │   ├── mentor-biotech.ts
│   │   │   ├── mentor-logistics.ts
│   │   │   ├── mentor-saas.ts
│   │   │   ├── mentor-social.ts
│   │   │   ├── mentor-other.ts
│   │   │   ├── radar.ts
│   │   │   ├── opportunities.ts
│   │   │   └── tool-feedback.ts
│   │   ├── context-builder.ts        # Construye el contexto de la startup para inyectar
│   │   ├── rate-limiter.ts           # Rate limiting por usuario
│   │   └── token-counter.ts          # Estimación de tokens para control de costos
│   ├── radar/                        # Módulos de RADAR (NUEVO)
│   │   ├── scraper.ts                # Scraping de fuentes RSS/web
│   │   ├── classifier.ts            # Clasificación por vertical/país/tipo
│   │   └── embeddings.ts            # Generación de embeddings
│   ├── opportunities/                # Módulos de oportunidades (NUEVO)
│   │   ├── matcher.ts               # Algoritmo de matching
│   │   └── scorer.ts                # Scoring de match
│   ├── passport/                     # Módulos de passport (NUEVO)
│   │   └── generator.ts             # Generación de Startup Passport PDF
│   ├── admin/                        # Módulos admin (NUEVO)
│   │   ├── analytics.ts             # Queries de analytics para dashboards
│   │   ├── report-pdf.ts            # Generación de reportes PDF
│   │   └── benchmarks.ts            # Cálculo de benchmarks regionales
│   └── types/                        # TypeScript types centralizados (NUEVO)
│       ├── startup.ts
│       ├── organization.ts
│       ├── cohort.ts
│       ├── ai.ts
│       ├── radar.ts
│       └── opportunity.ts
│
└── public/
    ├── workbook/
    │   └── S4C_Workbook_v1.pdf       # Workbook descargable (NUEVO)
    └── ... (assets existentes)
```

---

## PARTE IV: FEATURES POR MÓDULO

---

### 7. Landing page (reescritura)

#### 7.1 Secciones actualizadas

| Sección | Cambios |
|---|---|
| Navbar | Agregar link "Para organizaciones" que scrollea a la sección B2B. Agregar link "Workbook". Si el usuario está logged como admin_org, mostrar link a `/admin`. |
| Hero | Nuevo tagline. Nuevo subtítulo. Stats actualizadas: "+30 herramientas", "AI personalizado", "100% gratuito para founders". |
| ProblemSection | Actualizar a 3 problemas: founders sin infraestructura, incubadoras sin tech, gobiernos sin visibilidad. |
| ValueProp | Reformular los 4 pilares para incluir AI, RADAR, oportunidades. |
| ForFounders | NUEVA sección. Muestra las 7 funcionalidades para founders (herramientas, mentor AI, RADAR, oportunidades, passport, workbook, perfil progresivo). |
| ForOrganizations | NUEVA sección. Muestra la propuesta B2B (panel admin, reportes, cohortes, benchmarking). CTA: "Solicitar demo". |
| StartupLifecycle | Se mantiene. Actualizar verticales a 10 en vez de 16. |
| DiagnosticForm | Actualizar dropdown de verticales a las 10 nuevas. |
| AboutRedesignLab | Se mantiene. |
| CTAFinal | Actualizar copy. Dos CTAs: "Acceder gratis" (founders) + "Solicitar demo" (organizaciones). |
| Footer | Agregar links a /workbook, /admin. Actualizar secciones. |

#### 7.2 Metadata SEO (actualizar)

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Startups4Climate | Ecosistema All-in-One para Startups de Impacto en LATAM',
  description: 'Plataforma gratuita con +30 herramientas, mentores AI por vertical, oportunidades personalizadas y tendencias del ecosistema. Para founders independientes y programas de incubación/aceleración en Latinoamérica.',
  keywords: [
    'startups LATAM', 'herramientas para startups', 'incubadora virtual',
    'aceleradora startups', 'emprendimiento latinoamérica', 'startup tools',
    'mentor AI startups', 'grants startups', 'lean canvas español',
    'plataforma emprendimiento', 'Proinnovate', 'startups de impacto'
  ],
  openGraph: {
    title: 'Startups4Climate | Ecosistema para Startups de Impacto en LATAM',
    description: '+30 herramientas gratuitas, mentores AI y oportunidades personalizadas.',
    url: 'https://startups4climate.org',
    siteName: 'Startups4Climate',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  metadataBase: new URL('https://startups4climate.org'),
}
```

---

### 8. Diagnóstico de Startup Readiness (actualización)

#### 8.1 Cambios al formulario

```typescript
// Verticales actualizadas (10 en lugar de 16)
const VERTICALS = [
  { value: 'fintech', label: 'Fintech' },
  { value: 'healthtech', label: 'Healthtech' },
  { value: 'edtech', label: 'Edtech' },
  { value: 'agritech_foodtech', label: 'Agritech / Foodtech' },
  { value: 'cleantech_climatech', label: 'Cleantech / Climatech' },
  { value: 'biotech_deeptech', label: 'Biotech / Deep Tech' },
  { value: 'logistics_mobility', label: 'Logística / Mobility' },
  { value: 'saas_enterprise', label: 'SaaS / Enterprise' },
  { value: 'social_impact', label: 'Social Impact' },
  { value: 'other', label: 'Otro' },
] as const

type Vertical = typeof VERTICALS[number]['value']
```

#### 8.2 Post-diagnóstico (nuevo flujo)

```
Diagnóstico completado
    ↓
Se crea registro en Supabase: diagnostic_leads + startups
    ↓
Se redirige a registro (si no está auth)
    ↓
Post-registro: se asigna la vertical y etapa al perfil
    ↓
Se redirige a /tools con onboarding modal:
  "Tu startup fue clasificada como [vertical] en etapa [etapa].
   Tu mentor AI de [vertical] está listo para acompañarte.
   Empieza con la herramienta [primera herramienta de tu etapa]."
```

---

### 9. Plataforma de herramientas (actualización del tools layout)

#### 9.1 Sidebar actualizada

```typescript
// app/tools/layout.tsx - Items de la sidebar
const sidebarItems = [
  { label: 'Dashboard', href: '/tools', icon: LayoutDashboard },
  { label: 'Mentor AI', href: '/tools/mentor', icon: Bot, isNew: true },
  { label: 'RADAR', href: '/tools/radar', icon: Radio, isNew: true },
  { label: 'Oportunidades', href: '/tools/oportunidades', icon: Target, isNew: true },
  { label: 'Passport', href: '/tools/passport', icon: FileText, isNew: true },
  { label: 'Recursos', href: '/tools/recursos', icon: BookOpen },
  { label: 'Perfil', href: '/tools/perfil', icon: User },
]
```

#### 9.2 Dashboard principal (tools/page.tsx)

Cambios:
- Eliminar CTAs de productos/servicios pagos.
- Agregar card de "Mentor AI" arriba del grid de herramientas con preview del último consejo.
- Agregar barra de progreso global (herramientas completadas / total).
- Agregar badge de certificación por etapa completada.
- Mostrar 30 herramientas (24 existentes + 6 nuevas) organizadas en 4 etapas.
- El botón "Feedback AI" aparece en cada herramienta completada.

#### 9.3 ToolPage.tsx (wrapper universal, actualización)

Agregar:
- Toggle modo guiado/avanzado en el header de la herramienta.
- Botón "Pedir feedback AI" (visible solo si la herramienta tiene datos guardados).
- Eliminar `ServiceBanner.tsx` (ya no hay upselling).
- Agregar auto-update del perfil progresivo: cuando el founder guarda datos en ciertas herramientas (TAM, unit economics, etc.), los valores relevantes se sincronizan a la tabla `startups`.

```typescript
// Mapping de herramienta → campo en startup profile
const TOOL_TO_PROFILE_MAP: Record<string, (data: any) => Partial<Startup>> = {
  'tam-calculator': (data) => ({ tam_usd: data.totalTAM }),
  'unit-economics': (data) => ({ ltv: data.ltv, cac: data.cac }),
  'pricing-framework': (data) => ({ revenue_model: data.selectedModel }),
  'traction-validation': (data) => ({
    has_paying_customers: data.payingCustomers > 0,
    paying_customers_count: data.payingCustomers,
    monthly_revenue: data.mrr,
  }),
  'passion-purpose': (data) => ({ team_size: data.teamMembers?.length }),
  // ... etc
}
```

---

### 10. Agente Mentor AI (/tools/mentor)

#### 10.1 Interface del chat

```typescript
// components/ai/ChatInterface.tsx
'use client'

interface ChatInterfaceProps {
  agentType: 'mentor' | 'radar' | 'opportunities' | 'tool_feedback'
  conversationId?: string
  systemContext?: string  // contexto adicional (ej: datos de herramienta para feedback)
  placeholder?: string
  welcomeMessage?: string
}

// El componente:
// 1. Carga historial de la conversación desde Supabase (si conversationId existe)
// 2. Muestra mensajes con ChatMessage.tsx
// 3. Input con ChatInput.tsx
// 4. Al enviar, POST a /api/ai/chat con:
//    - message: string
//    - agentType: string
//    - conversationId: string | null
//    - startupContext se inyecta server-side (no se envía desde el cliente)
// 5. Recibe respuesta streameada (ReadableStream)
// 6. Guarda conversación actualizada en Supabase
```

#### 10.2 API Route del chat

```typescript
// app/api/ai/chat/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { aiClient } from '@/lib/ai/client'
import { buildStartupContext } from '@/lib/ai/context-builder'
import { checkRateLimit } from '@/lib/ai/rate-limiter'
import { getMentorPrompt } from '@/lib/ai/prompts'

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Rate limiting: 30 mensajes por día por usuario
  const allowed = await checkRateLimit(session.user.id, 30)
  if (!allowed) {
    return new Response('Rate limit exceeded', { status: 429 })
  }

  const { message, agentType, conversationId } = await req.json()

  // Cargar perfil de startup del usuario
  const { data: startup } = await supabase
    .from('startups')
    .select('*')
    .eq('founder_id', session.user.id)
    .single()

  // Cargar progreso de herramientas
  const { data: progress } = await supabase
    .from('tool_progress')
    .select('*')
    .eq('user_id', session.user.id)

  // Construir contexto
  const startupContext = buildStartupContext(startup, progress)

  // Obtener system prompt según agente y vertical
  const systemPrompt = getMentorPrompt(agentType, startup?.vertical)

  // Cargar historial de la conversación
  let history: Message[] = []
  if (conversationId) {
    const { data: conv } = await supabase
      .from('ai_conversations')
      .select('messages')
      .eq('id', conversationId)
      .single()
    history = conv?.messages || []
  }

  // Llamar al modelo AI con streaming
  const stream = await aiClient.chat({
    model: 'deepseek-chat',  // o 'gemini-2.5-flash' o 'claude-haiku-4.5'
    messages: [
      { role: 'system', content: `${systemPrompt}\n\n---\nCONTEXTO DE LA STARTUP:\n${startupContext}` },
      ...history,
      { role: 'user', content: message }
    ],
    stream: true,
    max_tokens: 1000,
  })

  // Guardar conversación actualizada en Supabase (async, no bloquea la respuesta)
  // Se ejecuta después de que el stream termine

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' }
  })
}
```

#### 10.3 System prompt (ejemplo: mentor fintech)

```typescript
// lib/ai/prompts/mentor-fintech.ts
export const MENTOR_FINTECH_PROMPT = `
Eres un mentor experto en startups Fintech en Latinoamérica.

TU PERFIL:
- Tienes 15+ años de experiencia en servicios financieros y fintech en LATAM.
- Conoces las regulaciones financieras de los principales países: Perú (SBS, SMV), Colombia (Superfinanciera), México (CNBV, Ley Fintech), Chile (CMF), Brasil (Banco Central, CVM), Argentina (BCRA, CNV).
- Dominas los modelos de negocio fintech: lending, payments, insurtech, wealthtech, banking-as-a-service, open banking, DeFi, remesas, scoring alternativo.
- Conoces los fondos de inversión que invierten en fintech LATAM: QED Investors, Kaszek, a]16z (fintech), Ribbit Capital, ALLVP, Ignia, Magma Partners.

TU COMPORTAMIENTO:
- Respondes en español.
- Das consejos prácticos y accionables. No teorías abstractas.
- Cuando el founder te pregunta algo, le das una respuesta directa primero y luego profundizas.
- Si el founder tiene herramientas completadas, refieres a sus datos para hacer tus respuestas relevantes.
- Si detectas que el founder tiene vacíos en su preparación, se lo dices con respeto pero con claridad.
- No inventas datos. Si no sabes algo, lo dices.
- Tus respuestas son concisas (máximo 300 palabras a menos que se requiera más detalle).
- Usas viñetas cuando listas pasos o recomendaciones.

FORMATO:
- No uses markdown con # headers. Usa texto plano con viñetas.
- No uses emojis.
- No uses frases genéricas como "espero que esto te sea útil".
`
```

#### 10.4 Context builder

```typescript
// lib/ai/context-builder.ts
export function buildStartupContext(
  startup: Startup | null,
  progress: ToolProgress[] | null
): string {
  if (!startup) return 'No hay datos de la startup registrados aún.'

  const completedTools = progress?.filter(p => p.completed) || []
  const completedNames = completedTools.map(p => p.tool_id).join(', ')

  return `
STARTUP: ${startup.name}
VERTICAL: ${startup.vertical}
PAÍS: ${startup.country}
ETAPA: ${startup.stage}
SCORE DIAGNÓSTICO: ${startup.diagnostic_score}/100

EQUIPO: ${startup.team_size || 'No definido'} personas
MODELO DE INGRESOS: ${startup.revenue_model || 'No definido'}
INGRESOS MENSUALES: ${startup.monthly_revenue ? `$${startup.monthly_revenue} USD` : 'No reportados'}
TAM: ${startup.tam_usd ? `$${startup.tam_usd} USD` : 'No calculado'}
CLIENTES PAGANDO: ${startup.has_paying_customers ? `Sí (${startup.paying_customers_count})` : 'No'}
LTV: ${startup.ltv ? `$${startup.ltv}` : 'No calculado'}
CAC: ${startup.cac ? `$${startup.cac}` : 'No calculado'}
MVP: ${startup.has_mvp ? 'Sí' : 'No'}

HERRAMIENTAS COMPLETADAS (${completedTools.length}/30): ${completedNames || 'Ninguna'}
PROGRESO EN ETAPA ACTUAL: ${startup.current_stage_progress}%

DESCRIPCIÓN: ${startup.description || 'No provista'}
  `.trim()
}
```

---

### 11. RADAR (/tools/radar)

#### 11.1 Página principal

```typescript
// app/tools/radar/page.tsx
'use client'

// Layout:
// ┌─────────────────────────────────────────────┐
// │ RADAR — Ecosistema de Innovación LATAM       │
// ├──────────────────────┬──────────────────────┤
// │                      │                      │
// │   Feed de noticias   │   Chat con agente    │
// │   (filtrable)        │   RADAR              │
// │                      │                      │
// │   [NewsCard]         │   "¿Qué está         │
// │   [NewsCard]         │    pasando en         │
// │   [NewsCard]         │    fintech en         │
// │   [NewsCard]         │    Colombia?"         │
// │   ...                │                      │
// │                      │                      │
// └──────────────────────┴──────────────────────┘
// En mobile: tabs (Feed | Chat)
```

#### 11.2 Pipeline de scraping (cron job)

```typescript
// app/api/radar/scrape/route.ts
// Se ejecuta via Vercel Cron: cron(0 6 * * *)  → diario a las 6am UTC

import { createClient } from '@supabase/supabase-js'
import { generateEmbedding } from '@/lib/radar/embeddings'
import { classifyArticle } from '@/lib/radar/classifier'
import { scrapeRSS } from '@/lib/radar/scraper'

const SOURCES = [
  { name: 'Contxto', url: 'https://contxto.com/feed/', type: 'rss' },
  { name: 'iupana', url: 'https://iupana.com/feed/', type: 'rss' },
  // ... más fuentes
]

export async function GET(req: Request) {
  // Verificar que es una llamada del cron (header de Vercel)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  for (const source of SOURCES) {
    const articles = await scrapeRSS(source.url)

    for (const article of articles) {
      // Verificar que no existe ya
      const { data: existing } = await supabase
        .from('news_items')
        .select('id')
        .eq('source_url', article.url)
        .single()

      if (existing) continue

      // Clasificar con AI (vertical, país, tipo)
      const classification = await classifyArticle(article.title, article.summary)

      // Generar embedding
      const embedding = await generateEmbedding(
        `${article.title} ${article.summary}`
      )

      // Insertar
      await supabase.from('news_items').insert({
        title: article.title,
        summary: article.summary,
        source_name: source.name,
        source_url: article.url,
        image_url: article.imageUrl,
        vertical: classification.vertical,
        country: classification.country,
        content_type: classification.type,
        tags: classification.tags,
        embedding,
        published_at: article.publishedAt,
      })
    }
  }

  return new Response('OK', { status: 200 })
}
```

#### 11.3 Configuración del cron en Vercel

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/radar/scrape",
      "schedule": "0 6 * * *"
    }
  ]
}
```

---

### 12. Oportunidades (/tools/oportunidades)

#### 12.1 Página principal

```typescript
// app/tools/oportunidades/page.tsx
'use client'

// Layout:
// ┌─────────────────────────────────────────────┐
// │ OPORTUNIDADES                                │
// ├──────────────────────────────────────────────┤
// │ [Tab: Para ti (matching)] [Tab: Todas]       │
// ├──────────────────────────────────────────────┤
// │ Filtros: País | Vertical | Tipo | Monto      │
// ├──────────────────────────────────────────────┤
// │ [OpportunityCard con match_score badge]      │
// │ [OpportunityCard]                             │
// │ [OpportunityCard]                             │
// └──────────────────────────────────────────────┘
```

#### 12.2 Algoritmo de matching

```typescript
// lib/opportunities/scorer.ts
export function calculateMatchScore(
  startup: Startup,
  opportunity: Opportunity
): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // País (30 puntos)
  if (opportunity.eligible_countries.length === 0 ||
      opportunity.eligible_countries.includes(startup.country)) {
    score += 30
    reasons.push('Tu país es elegible')
  }

  // Vertical (25 puntos)
  if (opportunity.eligible_verticals.length === 0 ||
      opportunity.eligible_verticals.includes(startup.vertical)) {
    score += 25
    reasons.push('Tu vertical coincide')
  }

  // Etapa (25 puntos)
  if (opportunity.eligible_stages.length === 0 ||
      opportunity.eligible_stages.includes(startup.stage)) {
    score += 25
    reasons.push('Tu etapa es la requerida')
  }

  // Perfil completado (10 puntos)
  if (startup.tools_completed >= 6) {
    score += 5
    reasons.push('Tienes herramientas completadas')
  }
  if (startup.has_mvp) {
    score += 5
    reasons.push('Tienes MVP')
  }

  // Deadline no vencido (10 puntos)
  if (!opportunity.deadline || new Date(opportunity.deadline) > new Date()) {
    score += 10
    reasons.push('Aún abierta para aplicar')
  }

  return { score, reasons }
}
```

---

### 13. Startup Passport (/tools/passport)

#### 13.1 Datos del passport

```typescript
// lib/types/startup.ts
interface StartupPassport {
  // Header
  startup_name: string
  logo_url: string | null
  vertical: string
  country: string
  stage: string
  founder_name: string
  linkedin: string | null
  website: string | null

  // Score
  diagnostic_score: number
  stage_progress: number

  // Métricas (de herramientas completadas)
  tam_usd: number | null
  revenue_model: string | null
  monthly_revenue: number | null
  ltv: number | null
  cac: number | null
  ltv_cac_ratio: number | null
  paying_customers: number
  team_size: number | null

  // Progreso
  tools_completed: number
  total_tools: number
  certificates: string[]  // etapas con certificación

  // Resúmenes (generados desde herramientas)
  value_proposition_summary: string | null
  target_market_summary: string | null
  competitive_advantage: string | null

  // Metadata
  generated_at: string
  passport_version: string
}
```

#### 13.2 Generación PDF

```typescript
// app/api/reports/passport/route.ts
// Usa la librería @react-pdf/renderer o jspdf para generar PDF
// El PDF tiene:
// 1. Header con logo S4C + logo startup + datos básicos
// 2. Sección de métricas con gráficos simples
// 3. Resúmenes de herramientas clave
// 4. Barra de progreso por etapa
// 5. QR code con link al perfil público (futuro)
// 6. Footer con "Generado por Startups4Climate"
```

---

### 14. Workbook (/workbook)

#### 14.1 Página de descarga

```typescript
// app/workbook/page.tsx
// Página pública (no requiere auth)
// Layout:
// - Hero con título "Guía completa para founders"
// - Preview del contenido (tabla de contenidos visual)
// - Formulario de lead capture (nombre, email, país)
//   - Si el usuario está logueado, pre-llenar y descarga directa
//   - Si no está logueado, capturar datos y descargar
// - CTA secundario: "Ya tengo cuenta → Login"
```

#### 14.2 API de descarga

```typescript
// app/api/workbook/download/route.ts
export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  const { fullName, email, country } = await req.json()

  // Guardar lead (si no está registrado)
  if (!session) {
    await supabase.from('workbook_downloads').insert({
      full_name: fullName,
      email,
      country,
    })
  } else {
    await supabase.from('workbook_downloads').insert({
      full_name: fullName,
      email,
      country,
      user_id: session.user.id,
    })
  }

  // Retornar URL del PDF
  return Response.json({
    download_url: '/workbook/S4C_Workbook_v1.pdf'
  })
}
```

---

### 15. Panel de administración B2B (/admin)

#### 15.1 Layout

```typescript
// app/admin/layout.tsx
'use client'

const adminSidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Cohortes', href: '/admin/cohortes', icon: Users },
  { label: 'Reportes', href: '/admin/reportes', icon: FileBarChart },
  { label: 'Benchmarking', href: '/admin/benchmarking', icon: BarChart3 },
  { label: 'Configuración', href: '/admin/configuracion', icon: Settings },
]
```

#### 15.2 Dashboard principal (/admin/page.tsx)

```typescript
// Queries de analytics para el dashboard

// 1. Métricas de portafolio
interface PortfolioMetrics {
  total_startups: number
  by_stage: Record<string, number>      // { pre_incubation: 12, incubation: 8, ... }
  by_vertical: Record<string, number>   // { fintech: 5, healthtech: 3, ... }
  by_country: Record<string, number>    // { peru: 10, colombia: 5, ... }
  avg_diagnostic_score: number
  avg_tools_completed: number
  active_this_month: number             // startups que usaron la plataforma en los últimos 30 días
}

// 2. Progreso de cohortes
interface CohortProgress {
  cohort_id: string
  cohort_name: string
  total_startups: number
  avg_progress: number                  // % de herramientas completadas
  startups_at_risk: number              // sin actividad en 14+ días
  startups_graduated: number
}

// 3. Alertas
interface AdminAlert {
  type: 'stalled' | 'milestone' | 'graduated' | 'new_registration'
  startup_name: string
  message: string
  timestamp: string
}
```

Componentes visuales del dashboard:
- `StageDistribution.tsx`: gráfico de dona (recharts PieChart) con distribución por etapa.
- `VerticalDistribution.tsx`: gráfico de barras (recharts BarChart) con distribución por vertical.
- `ProgressChart.tsx`: gráfico de línea (recharts LineChart) con progreso promedio en el tiempo.
- `AlertsList.tsx`: lista de alertas recientes.
- Cards con métricas numéricas arriba: total startups, activas este mes, score promedio, herramientas completadas promedio.

#### 15.3 Gestión de cohortes (/admin/cohortes)

```typescript
// CRUD de cohortes

// Crear cohorte
interface CreateCohortInput {
  name: string
  description?: string
  start_date: string
  end_date: string
  milestones: Array<{
    name: string
    stage: string
    deadline: string
  }>
}

// Asignar startup a cohorte
// El admin busca startups por email del founder o nombre de startup
// y las asigna a una cohorte existente

// Vista de cohorte individual (/admin/cohortes/[id])
// - Lista de startups con progreso individual
// - Timeline de milestones
// - Métricas agregadas de la cohorte
// - Botón "Generar reporte de cohorte"
```

#### 15.4 Generación de reportes (/admin/reportes)

```typescript
// app/api/reports/cohort/route.ts
// Genera un PDF con:
// 1. Portada con logo de la organización + nombre de la cohorte
// 2. Resumen ejecutivo: métricas clave
// 3. Distribución por etapa, vertical, país (gráficos)
// 4. Progreso por startup (tabla con barras de progreso)
// 5. Startups destacadas (mayor avance)
// 6. Startups en riesgo (sin actividad reciente)
// 7. Recomendaciones automatizadas

// Librería sugerida: @react-pdf/renderer (server-side)
// Alternativa: puppeteer para renderizar HTML a PDF (más pesado pero más flexible)
```

#### 15.5 Benchmarking (/admin/benchmarking)

```typescript
// Compara las startups de la organización con promedios anonimizados de la plataforma

interface BenchmarkData {
  metric: string
  org_value: number
  platform_average: number
  percentile: number  // en qué percentil está la org vs. la plataforma
}

// Métricas comparables:
// - Promedio de herramientas completadas
// - % de startups que avanzan de etapa
// - Score promedio del diagnóstico
// - Tiempo promedio para completar una etapa
// - % de startups con MVP
// - % de startups con clientes pagando
```

---

## PARTE V: NUEVAS HERRAMIENTAS (25-30)

---

### 16. Especificación de las 6 nuevas herramientas

Cada herramienta sigue el patrón existente de `useToolState` + CSS-in-JS inline + secciones colapsables.

#### 16.1 Herramienta 25: Análisis de Competidores (AI)

```typescript
// components/tools/CompetitorAnalysis.tsx

interface CompetitorAnalysisData {
  competitors: Array<{
    name: string
    website: string
    description: string
    strengths: string
    weaknesses: string
    pricing: string
    target_market: string
  }>
  competitive_matrix: Array<{
    dimension: string
    my_startup: number  // 1-5
    competitors: Record<string, number>  // name → score
  }>
  differentiation_summary: string
  ai_analysis: string | null  // Generado por AI al pedir feedback
}

// El founder ingresa 3-5 competidores (nombre + website).
// Opción "Analizar con AI": el agente busca info pública de los competidores
// y genera un análisis comparativo.
// La matriz competitiva se visualiza como una tabla con heatmap de colores.
```

#### 16.2 Herramienta 26: Data Room Builder

```typescript
interface DataRoomData {
  documents: Array<{
    category: string        // 'legal', 'financial', 'product', 'team', 'market'
    name: string            // ej: "Cap Table actualizado"
    status: 'pending' | 'draft' | 'ready'
    notes: string
    file_url: string | null // link externo al documento
  }>
  readiness_score: number   // calculado automáticamente
}

// Categorías pre-definidas con documentos recomendados:
// Legal: Acta constitutiva, Pacto de socios, Cap Table, IP registrada
// Financiero: P&L histórico, Proyecciones 3 años, Unit Economics, Burn rate
// Producto: Demo/video, Roadmap, Métricas de producto, NPS
// Equipo: CVs founders, Organigrama, Advisory board
// Mercado: TAM/SAM/SOM, Análisis competitivo, Testimonios clientes
```

#### 16.3 Herramienta 27: OKR Tracker

```typescript
interface OKRData {
  quarter: string           // "Q2 2026"
  objectives: Array<{
    title: string
    key_results: Array<{
      description: string
      target: number
      current: number
      unit: string          // '%', 'USD', 'users', etc.
    }>
    owner: string
  }>
}
// Visualización: barra de progreso por Key Result, score por Objetivo (promedio de KRs).
```

#### 16.4 Herramienta 28: Regulatory Compass

```typescript
interface RegulatoryCompassData {
  country: string
  vertical: string
  requirements: Array<{
    category: string        // 'license', 'certification', 'registration', 'tax', 'data_privacy'
    name: string
    description: string
    entity: string          // ej: "SBS (Superintendencia de Banca y Seguros)"
    estimated_time: string
    estimated_cost: string
    status: 'unknown' | 'not_started' | 'in_progress' | 'completed'
    notes: string
  }>
  ai_recommendations: string | null
}

// Al abrir la herramienta, si la startup tiene vertical y país definidos,
// el agente AI genera automáticamente una lista de requisitos regulatorios.
// El founder los marca como completados y agrega notas.
```

#### 16.5 Herramienta 29: Impact Metrics Framework

```typescript
interface ImpactMetricsData {
  ods_alignment: string[]   // ODS seleccionados (ej: ['ODS7', 'ODS13'])
  impact_thesis: string
  metrics: Array<{
    name: string
    category: 'output' | 'outcome' | 'impact'
    description: string
    baseline: number
    target: number
    current: number
    unit: string
    measurement_method: string
  }>
  theory_of_change: string
}
```

#### 16.6 Herramienta 30: Financial Model Builder

```typescript
interface FinancialModelData {
  assumptions: {
    start_date: string
    projection_months: number  // 36 o 60
    currency: string
  }
  revenue_streams: Array<{
    name: string
    type: 'subscription' | 'transaction' | 'one_time' | 'marketplace'
    unit_price: number
    growth_rate_monthly: number  // %
    initial_units: number
  }>
  cost_structure: {
    fixed_costs: Array<{ name: string; monthly_amount: number }>
    variable_costs: Array<{ name: string; per_unit_cost: number }>
    team: Array<{ role: string; salary: number; start_month: number }>
  }
  funding: {
    initial_capital: number
    planned_rounds: Array<{
      name: string
      amount: number
      month: number
      dilution: number
    }>
  }
  // Outputs calculados automáticamente:
  // - Proyección de ingresos mensuales (tabla + gráfico)
  // - Proyección de costos mensuales
  // - P&L mensual
  // - Burn rate
  // - Runway (meses hasta quedarse sin dinero)
  // - Break-even month
  // - MRR/ARR proyectado
}

// Visualización: gráfico de líneas (recharts) con ingresos vs costos vs cash position.
// Botón "Exportar a Excel" usando la librería SheetJS.
```

---

## PARTE VI: VARIABLES DE ENTORNO Y DEPENDENCIAS

---

### 17. Variables de entorno

```bash
# .env.local (actualizado)

# Supabase (existentes)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...         # NUEVO: para operaciones server-side

# AI APIs (NUEVO)
DEEPSEEK_API_KEY=sk-...                  # DeepSeek V3.2
DEEPSEEK_BASE_URL=https://api.deepseek.com
GOOGLE_AI_API_KEY=AI...                  # Gemini 2.5 Flash (backup)
OPENAI_API_KEY=sk-...                    # Solo para embeddings (text-embedding-3-small)

# Seguridad (NUEVO)
CRON_SECRET=...                          # Para verificar llamadas del cron de Vercel

# Stripe (se mantiene, ahora para suscripciones B2B)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

### 18. Nuevas dependencias

```bash
# Producción
npm install @supabase/auth-helpers-nextjs   # Auth con middleware
npm install @supabase/ssr                    # SSR helpers
npm install ai                               # Vercel AI SDK (streaming)
npm install openai                           # Cliente OpenAI (compatible con DeepSeek)
npm install recharts                         # Gráficos para admin dashboard
npm install @react-pdf/renderer              # Generación de PDFs server-side
npm install rss-parser                       # Parsing de RSS para RADAR
npm install xlsx                             # Exportación a Excel (Financial Model)
npm install date-fns                         # Utilidades de fechas

# Desarrollo
npm install --save-dev @types/rss-parser
```

---

## PARTE VII: ELIMINACIONES

---

### 19. Código y rutas a eliminar

| Elemento | Ruta/Archivo | Razón |
|---|---|---|
| Checkout con Stripe (actual) | `app/checkout/page.tsx` | Ya no hay productos pagos para founders. Stripe se usará para suscripciones B2B. |
| Productos (catálogo público) | `app/productos/page.tsx` | Eliminado del modelo de negocio. |
| Servicios (catálogo público) | `app/servicios/page.tsx` | Se mantiene solo como sección informativa en la landing, no como flujo de pago. |
| Productos dentro de tools | `app/tools/productos/page.tsx` | Ya no se venden productos a founders. |
| Servicios dentro de tools | `app/tools/servicios/page.tsx` | Se reemplaza por sección de mentor AI. |
| ServiceBanner | `components/tools/ServiceBanner.tsx` | Ya no hay upselling dentro de las herramientas. |
| Services (landing legacy) | `components/Services.tsx` | Reemplazado por ForOrganizations.tsx. |
| ServicesDetail | `components/ServicesDetail.tsx` | Reemplazado. |
| ForInvestors | `components/ForInvestors.tsx` | Reemplazado. El segmento de inversores no es prioridad en v2. |
| 11 herramientas legacy | `components/tools/[legacy]/*.tsx` | Eliminar del repo: TRLCalculator, ERPEstimator, FounderAudit, Bankability, LabToMarket, DataRoom (reemplazado por DataRoomBuilder), ReverseDueDiligence, PilotsFramework, CapitalStack, StakeholderMatrix, BusinessModels. |

---

## PARTE VIII: ORDEN DE IMPLEMENTACIÓN

---

### 20. Fases de desarrollo con dependencias

```
FASE 1: FUNDAMENTOS (bloqueante para todo lo demás)
├── 1.1 Migrar auth a Supabase Auth
│   ├── Crear tabla profiles con trigger
│   ├── Reescribir AuthContext.tsx
│   ├── Reescribir AuthModal.tsx
│   ├── Crear middleware.ts
│   └── Script de migración de usuarios existentes
├── 1.2 Crear schema de DB (todas las tablas nuevas)
│   ├── Habilitar extensión pgvector
│   ├── Crear tablas: startups, organizations, cohorts, cohort_startups
│   ├── Crear tablas: ai_conversations, news_items, opportunities
│   ├── Crear tablas: opportunity_matches, workbook_downloads, certificates
│   └── Configurar RLS policies
├── 1.3 Actualizar diagnóstico
│   ├── Reducir verticales de 16 a 10
│   ├── Post-diagnóstico: crear registro en tabla startups
│   └── Onboarding modal post-registro
├── 1.4 Actualizar landing page
│   ├── Reescribir Hero, ProblemSection, ValueProp
│   ├── Crear ForFounders.tsx y ForOrganizations.tsx
│   ├── Actualizar Navbar y Footer
│   ├── Actualizar metadata SEO
│   └── Eliminar secciones de productos/servicios
├── 1.5 Limpieza
│   ├── Eliminar 11 componentes legacy
│   ├── Eliminar rutas: /checkout, /productos, /servicios (públicas)
│   ├── Eliminar: /tools/productos, /tools/servicios
│   ├── Eliminar ServiceBanner.tsx
│   └── Reorganizar componentes en subcarpetas

FASE 2: PERFIL PROGRESIVO + HERRAMIENTAS
├── 2.1 Implementar StartupContext.tsx
│   └── Contexto global con datos de la startup, sync bidireccional
├── 2.2 Actualizar ToolPage.tsx
│   ├── Agregar ToolModeToggle (guiado/avanzado)
│   ├── Implementar TOOL_TO_PROFILE_MAP
│   └── Auto-sync de datos a tabla startups
├── 2.3 Crear tools-data.ts actualizado (30 herramientas)
├── 2.4 Implementar herramientas 25-30
│   ├── CompetitorAnalysis.tsx
│   ├── DataRoomBuilder.tsx
│   ├── OKRTracker.tsx
│   ├── RegulatoryCompass.tsx
│   ├── ImpactMetrics.tsx
│   └── FinancialModelBuilder.tsx
├── 2.5 Actualizar sidebar (/tools/layout.tsx)
└── 2.6 Crear Workbook v1 (PDF estático)
    ├── Página /workbook con lead capture
    └── API /api/workbook/download

FASE 3: AGENTES AI
├── 3.1 Infraestructura AI
│   ├── Crear lib/ai/client.ts (cliente unificado DeepSeek/Gemini)
│   ├── Crear lib/ai/context-builder.ts
│   ├── Crear lib/ai/rate-limiter.ts
│   └── Crear API route /api/ai/chat
├── 3.2 System prompts
│   └── Crear 10 prompts de mentor + radar + opportunities + tool_feedback
├── 3.3 Chat UI
│   ├── ChatInterface.tsx
│   ├── ChatMessage.tsx
│   ├── ChatInput.tsx
│   └── StreamingText.tsx
├── 3.4 Sección Mentor (/tools/mentor)
├── 3.5 Botón Feedback AI en ToolPage.tsx
│   └── API route /api/ai/feedback
├── 3.6 Sección RADAR (/tools/radar)
│   ├── NewsFeed.tsx + NewsCard.tsx + RadarFilters.tsx
│   ├── RadarChat.tsx
│   ├── Pipeline de scraping (API route + Vercel Cron)
│   ├── Embeddings + búsqueda semántica
│   └── vercel.json con cron config
└── 3.7 Sección Oportunidades (/tools/oportunidades)
    ├── OpportunityFeed.tsx + OpportunityCard.tsx
    ├── MatchedOpportunities.tsx
    ├── Algoritmo de matching (lib/opportunities/scorer.ts)
    ├── API route /api/ai/match
    └── ApplicationAssistant.tsx

FASE 4: PANEL B2B
├── 4.1 Layout admin (/admin/layout.tsx)
│   └── AdminSidebar.tsx
├── 4.2 Dashboard (/admin/page.tsx)
│   ├── PortfolioDashboard.tsx
│   ├── StageDistribution.tsx (recharts)
│   ├── VerticalDistribution.tsx (recharts)
│   ├── ProgressChart.tsx (recharts)
│   └── AlertsList.tsx
├── 4.3 Cohortes (/admin/cohortes)
│   ├── CohortManager.tsx (CRUD)
│   ├── CohortDetail.tsx
│   └── StartupCard.tsx + StartupDetailView.tsx
├── 4.4 Reportes (/admin/reportes)
│   ├── ReportGenerator.tsx
│   └── API routes: /api/reports/startup, /api/reports/cohort
├── 4.5 Benchmarking (/admin/benchmarking)
│   └── BenchmarkComparison.tsx
├── 4.6 Configuración (/admin/configuracion)
└── 4.7 Stripe para suscripciones B2B
    ├── Crear productos/planes en Stripe Dashboard
    ├── API route /api/webhooks/stripe
    └── Portal de billing (Stripe Customer Portal)

FASE 5: PASSPORT + CERTIFICACIONES
├── 5.1 Startup Passport
│   ├── PassportView.tsx
│   ├── API route /api/reports/passport (PDF)
│   └── Página /tools/passport
├── 5.2 Certificaciones
│   ├── Lógica de emisión al completar etapa
│   ├── Badge visual en dashboard
│   └── Certificado descargable
└── 5.3 Perfil actualizado (/tools/perfil)
    └── Reescribir con todos los datos del perfil progresivo
```

---

## PARTE IX: DESIGN TOKENS NUEVOS

---

### 21. CSS variables adicionales

```css
/* globals.css - Agregar a los tokens existentes */

/* Colores por vertical (NUEVO) */
--color-vertical-fintech:       #3B82F6;  /* blue-500 */
--color-vertical-healthtech:    #EF4444;  /* red-500 */
--color-vertical-edtech:        #8B5CF6;  /* violet-500 */
--color-vertical-agritech:      #22C55E;  /* green-500 */
--color-vertical-cleantech:     #059669;  /* emerald-600 */
--color-vertical-biotech:       #06B6D4;  /* cyan-500 */
--color-vertical-logistics:     #F97316;  /* orange-500 */
--color-vertical-saas:          #6366F1;  /* indigo-500 */
--color-vertical-social:        #EC4899;  /* pink-500 */
--color-vertical-other:         #6B7280;  /* gray-500 */

/* Chat AI (NUEVO) */
--color-chat-user-bg:           #F0FDF4;  /* green-50 */
--color-chat-assistant-bg:      #F8FAFC;  /* slate-50 */
--color-chat-input-bg:          #FFFFFF;
--color-chat-input-border:      #E2E8F0;

/* Admin panel (NUEVO) */
--color-admin-sidebar-bg:       #1E293B;  /* slate-800 */
--color-admin-sidebar-text:     #CBD5E1;  /* slate-300 */
--color-admin-sidebar-active:   #059669;  /* emerald-600 */
--color-admin-card-bg:          #FFFFFF;

/* Match score (NUEVO) */
--color-match-high:             #059669;  /* >= 80 */
--color-match-medium:           #D97706;  /* 50-79 */
--color-match-low:              #9CA3AF;  /* < 50 */

/* Dark mode overrides para nuevos tokens */
[data-theme="dark"] {
  --color-chat-user-bg:         #1A2E1A;
  --color-chat-assistant-bg:    #1C1E28;
  --color-chat-input-bg:        #23262F;
  --color-chat-input-border:    #2A2D38;
  --color-admin-sidebar-bg:     #0F172A;
  --color-admin-card-bg:        #1C1E28;
}
```

---

## PARTE X: TESTING

---

### 22. Estrategia de testing

Prioridad: rutas críticas primero.

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
npm install --save-dev @playwright/test  # e2e
```

#### 22.1 Tests unitarios (vitest)

| Módulo | Tests |
|---|---|
| `lib/opportunities/scorer.ts` | Matching con diferentes combinaciones de startup/opportunity |
| `lib/ai/context-builder.ts` | Construcción de contexto con datos parciales, nulos, completos |
| `lib/ai/rate-limiter.ts` | Verificar que bloquea después de N requests por día |
| `lib/admin/benchmarks.ts` | Cálculo de percentiles y promedios |
| Validación Zod de formularios | Diagnóstico, perfil, cohorte |

#### 22.2 Tests e2e (Playwright)

| Flujo | Steps |
|---|---|
| Registro founder | Landing → Diagnóstico → Registro → Dashboard → Herramienta 1 |
| Chat mentor | Login → /tools/mentor → Enviar mensaje → Recibir respuesta |
| Admin: crear cohorte | Login admin → /admin/cohortes → Crear → Asignar startups |
| Workbook download | /workbook → Llenar form → Descargar PDF |

---

### 23. Resumen de archivos por fase

| Fase | Archivos nuevos | Archivos modificados | Archivos eliminados |
|---|---|---|---|
| 1: Fundamentos | ~15 | ~10 | ~15 |
| 2: Perfil + Herramientas | ~12 | ~5 | 0 |
| 3: Agentes AI | ~25 | ~3 | 0 |
| 4: Panel B2B | ~18 | ~2 | 0 |
| 5: Passport + Certs | ~6 | ~2 | 0 |
| TOTAL | ~76 | ~22 | ~15 |

---

> Este PRD contiene toda la información técnica necesaria para implementar Startups4Climate v2.0.
> Cada componente, ruta, tabla, API route y tipo TypeScript está especificado para que el desarrollo
> se ejecute con la menor ambigüedad posible.
> Documento preparado por Redesign Lab.
