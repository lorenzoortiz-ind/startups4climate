'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

export interface AppUser {
  id: string
  email: string
  role: 'founder' | 'admin_org' | 'superadmin'
  org_id: string | null
  full_name: string
  startup_name: string | null
  stage: string | null
  diagnosticScore: number | null
  created_at: string
}

/**
 * Backward-compatible User shape consumed by existing components.
 * Maps AppUser fields to the legacy field names.
 */
export interface User {
  id: string
  name: string
  email: string
  startup: string
  stage: string | null
  diagnosticScore: number | null
  createdAt: string
}

interface AuthContextType {
  user: User | null
  appUser: AppUser | null
  loading: boolean
  isDemo: boolean
  login: (email: string, password: string) => Promise<{ error?: string; role?: string }>
  register: (
    email: string,
    password: string,
    name: string,
    startup: string
  ) => Promise<{ error?: string; role?: string }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<Pick<AppUser, 'full_name' | 'startup_name' | 'stage' | 'diagnosticScore'>>) => Promise<{ error?: string }>
  openAuthModal: (mode?: 'login' | 'register') => void
  closeAuthModal: () => void
  authModalOpen: boolean
  authModalMode: 'login' | 'register'
  updateUserStage: (stage: string, score: number) => void
  enterDemoMode: (role: 'founder' | 'admin_org') => void
}

/* ─── Demo user fixtures ─── */
export const DEMO_FOUNDER_ID = 'demo-founder-0000-0000-0000-000000000001'
export const DEMO_ADMIN_ID = 'demo-admin-0000-0000-0000-000000000002'
export const DEMO_ORG_ID = 'demo-org-0000-0000-0000-000000000003'

const DEMO_FOUNDER_USER: AppUser = {
  id: DEMO_FOUNDER_ID,
  email: 'demo.founder@s4c.demo',
  role: 'founder',
  org_id: null,
  full_name: 'Ana Quispe (Demo)',
  startup_name: 'EcoBio Perú',
  stage: '3',
  diagnosticScore: 84,
  created_at: new Date().toISOString(),
}

const DEMO_ADMIN_USER: AppUser = {
  id: DEMO_ADMIN_ID,
  email: 'demo.admin@s4c.demo',
  role: 'admin_org',
  org_id: DEMO_ORG_ID,
  full_name: 'Universidad Demo',
  startup_name: null,
  stage: null,
  diagnosticScore: null,
  created_at: new Date().toISOString(),
}

/** True if a user id belongs to one of our demo fixtures. */
export function isDemoUserId(id: string | null | undefined): boolean {
  return id === DEMO_FOUNDER_ID || id === DEMO_ADMIN_ID
}

/** Seed some example tool progress into localStorage so demo founder has content. */
function seedDemoFounderData() {
  if (typeof window === 'undefined') return
  const SEED_VERSION = '2'  // Bump this when seed data changes
  const versionKey = `s4c_${DEMO_FOUNDER_ID}_seed_version`
  try {
    const currentVersion = localStorage.getItem(versionKey)
    if (currentVersion === SEED_VERSION) return
  } catch { /* ignore */ }
  const key = `s4c_${DEMO_FOUNDER_ID}_tool_progress`

  const now = new Date().toISOString()
  const seeded = {
    // ─── Stage 1: Descubrimiento (all completed) ───
    'passion-purpose': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        pasion: 'Reducir la contaminación plástica en la Amazonía peruana mediante biomateriales innovadores derivados de residuos agroindustriales locales.',
        proposito: 'Crear una economía circular que empodere a comunidades amazónicas, transformando residuos en empaques de alta performance que compitan con el plástico convencional.',
        problemaReal: 'América Latina genera 541,000 toneladas de plástico de un solo uso al año en el sector food service. El 91% termina en vertederos o ecosistemas naturales. Las alternativas importadas cuestan 3-4x más.',
        motivacionPersonal: 'Crecí en Puerto Maldonado viendo cómo la contaminación plástica afectaba los ríos amazónicos. Mi tesis en la PUCP fue sobre biomateriales con fibra de coco.',
      },
    },
    'market-segmentation': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        segmentos: 'Restaurantes sostenibles premium, cadenas de hoteles eco-certificados, retail orgánico y supermercados con línea verde, servicios de catering corporativo, foodservice institucional (universidades, hospitales).',
        criteriosSegmentacion: 'Volumen de compra mensual de empaques, compromiso con sostenibilidad (certificaciones), capacidad de pago premium (15-20% sobre convencional), ubicación geográfica (Lima, Cusco, Arequipa).',
        segmentoPrioritario: 'Restaurantes premium y cadenas de hoteles en Lima con certificación o compromiso ESG — 800+ establecimientos identificados, ticket promedio alto, decisión de compra rápida.',
      },
    },
    'beachhead-market': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        mercado: 'Restaurantes boutique y cadenas gastronómicas premium en Lima Metropolitana (Miraflores, Barranco, San Isidro). 800 locales estimados, con gasto promedio en empaques de $1,200/mes.',
        tamanoMercado: '800 restaurantes × $1,200/mes × 12 = $11.5M/año en Lima solamente.',
        razones: '1. Alta disposición a pagar por sostenibilidad (marca premium). 2. Regulación municipal que prohíbe plásticos de un solo uso desde 2024. 3. Presión de consumidores (78% prefiere restaurantes eco-friendly según Datum 2025). 4. Red de chefs influyentes que actúan como early adopters.',
        estrategiaEntrada: 'Partner con la Sociedad Peruana de Gastronomía (APEGA) para acceso directo a decisores. Piloto con 5 restaurantes top en Miraflores como caso de éxito.',
      },
    },
    'end-user-profile': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        nombre: 'Carlos, Gerente de Operaciones de restaurante premium',
        edad: '35-50 años',
        rol: 'Gerente de operaciones o dueño de restaurante/cadena gastronómica',
        frustraciones: 'Costos crecientes de empaques importados, presión regulatoria para eliminar plásticos, clientes que exigen prácticas sostenibles, proveedores de empaques eco poco confiables.',
        necesidades: 'Empaques compostables que sean resistentes (no se filtren ni se rompan), precio competitivo vs importados, suministro confiable y puntual, historia de impacto para comunicar a clientes.',
        comportamiento: 'Compra quincenal o mensual, decide en 2-3 semanas, prueba con pedido pequeño antes de comprometer volumen. Valora relación directa con proveedor.',
      },
    },
    'tam-calculator': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        tam: '2400000000',
        sam: '340000000',
        som: '18000000',
        metodologia: 'TAM: Mercado global de empaques sostenibles para food service en LATAM ($2.4B, Mordor Intelligence 2025). SAM: Perú + Colombia + Chile — restaurantes, hoteles y retail con compromiso sostenible ($340M). SOM: Lima + Cusco + Arequipa, segmento premium con capacidad de distribución actual ($18M en 24 meses).',
        fuentesDatos: 'Mordor Intelligence 2025, Euromonitor Perú, INEI censo económico, APEGA base de datos.',
        supuestos: 'Penetración del 5.3% del SAM en 24 meses, precio promedio por cliente $950/mes, retención del 85%.',
      },
    },
    'persona-profile': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        nombre: 'María del Carmen Rodríguez',
        cargo: 'Directora de Compras, cadena de restaurantes "Sabores del Pacífico" (12 locales)',
        edad: '42 años',
        ubicacion: 'Lima, Perú',
        objetivos: 'Reducir huella de carbono de la cadena en 30% para 2027. Cumplir con ordenanza municipal anti-plástico. Mantener costos operativos estables.',
        dolores: 'Proveedores de empaques eco que no cumplen entregas a tiempo. Empaques compostables importados que cuestan 3.5x más. Empaques que se rompen con sopas y líquidos calientes.',
        canalPreferido: 'WhatsApp Business para pedidos rápidos, reunión presencial para cerrar contrato anual.',
        presupuesto: '$14,400/año en empaques para 12 locales.',
      },
    },

    // ─── Stage 2: Validación (all completed) ───
    'full-lifecycle-usecase': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        casoDeUso: 'Restaurante premium pide empaques para delivery/takeout → EcoBio entrega en 48h → Chef empaca comida → Cliente recibe empaque con branding del restaurante + sello compostable → Cliente desecha en basura orgánica → Empaque se descompone en 90 días → Restaurante recibe reporte de impacto mensual.',
        puntosDeFriccion: '1. Primer pedido requiere calibración de tamaños. 2. Capacitación al staff sobre almacenamiento (evitar humedad). 3. Integración con sistema de pedidos del restaurante.',
        metricas: 'Tiempo de entrega: 48h Lima, 72h provincias. Tasa de reorden: 92%. NPS: 78. Vida útil del empaque: 6 meses almacenado, 90 días para descomposición.',
      },
    },
    'product-specification': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        producto: 'Línea de empaques compostables EcoBio: contenedores (500ml, 750ml, 1000ml), platos (7", 9"), bowls (12oz, 16oz, 32oz), vasos para bebidas calientes (8oz, 12oz, 16oz).',
        material: 'Fibra de bagazo de caña + almidón de yuca amazónica. Recubrimiento impermeabilizante con cera de carnaúba (100% vegetal).',
        especificaciones: 'Resistencia térmica: -20°C a 120°C. Resistencia a líquidos: 4+ horas sin filtración. Microondeable. Certificación compostable EN 13432. Libre de PFAS.',
        diferenciador: '40% más barato que alternativas importadas europeas. Materia prima 100% local. Huella de carbono 73% menor que plástico convencional.',
      },
    },
    'quantified-value-prop': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        propuesta: 'EcoBio reduce tu gasto en empaques sostenibles en 40% vs importados europeos, mientras eliminas el 100% del plástico de un solo uso y comunicas impacto real a tus clientes.',
        metricasValor: 'Ahorro promedio: $480/mes por local vs empaques importados. Reducción de CO2: 2.3 toneladas/año por restaurante. Cumplimiento regulatorio inmediato. Incremento de 12% en percepción de marca según encuesta a comensales.',
        evidencia: 'Piloto con 5 restaurantes en Miraflores (3 meses): ahorro promedio de $520/mes, cero quejas por calidad, 94% satisfacción del staff.',
      },
    },
    'first-10-customers': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        clientes: [
          { nombre: 'Sabores del Pacífico (12 locales)', estado: 'Contrato anual', mrr: '$4,800' },
          { nombre: 'Hotel Belmond Miraflores', estado: 'Contrato anual', mrr: '$3,200' },
          { nombre: 'Central Restaurante', estado: 'Contrato semestral', mrr: '$2,100' },
          { nombre: 'Maido', estado: 'Contrato semestral', mrr: '$1,800' },
          { nombre: 'Hilton Lima Miraflores', estado: 'Contrato anual', mrr: '$5,600' },
          { nombre: 'Astrid & Gastón', estado: 'Contrato trimestral', mrr: '$1,900' },
          { nombre: 'La Mar Cebichería', estado: 'Contrato semestral', mrr: '$2,400' },
          { nombre: 'Marriott Lima', estado: 'Contrato anual', mrr: '$4,200' },
          { nombre: 'IK Restaurante', estado: 'Contrato trimestral', mrr: '$1,600' },
          { nombre: 'Panchita (Grupo Acurio)', estado: 'Piloto', mrr: '$1,100' },
        ],
        payingCustomers: 23,
        totalMRR: '$47,000',
        estrategia: 'Venta directa B2B con demo de producto en restaurante. Piloto gratuito de 2 semanas (50 unidades). Conversión de piloto a contrato: 87%.',
        aprendizajes: 'Los hoteles tienen ciclos de compra más largos (45-60 días) pero tickets 3x mayores. Restaurantes cierran en 2-3 semanas. El boca a boca entre chefs es el canal #1.',
      },
    },
    'core-competitive-position': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        posicion: 'Único fabricante de empaques compostables con materia prima 100% amazónica en Perú. Combinación de precio competitivo (40% menos que importados) + supply chain local + certificación internacional.',
        competidores: '1. Biopak (Australia) — premium, 3x precio. 2. Vegware (UK) — buena calidad, importación cara y lenta. 3. EcoProducts (US) — no distribuye en Perú. 4. Artesanos locales — sin escala ni certificación.',
        ventajaDefendible: 'Patentes en proceso (3) sobre formulación de biomaterial con fibras amazónicas. Contratos de suministro exclusivo con 4 cooperativas agrícolas en Madre de Dios. Certificación EN 13432 (barrera de entrada de 18 meses).',
        moat: 'Vertically integrated: controlamos desde la materia prima (alianzas con cooperativas) hasta la entrega. Esto nos da 62% de margen bruto vs 35-40% de revendedores de importados.',
      },
    },
    'lean-canvas': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        problem: '1. Empaques de plástico de un solo uso contaminan y enfrentan prohibiciones regulatorias crecientes.\n2. Alternativas compostables importadas cuestan 3-4x más, haciendo inviable la transición.\n3. No existe un fabricante local de empaques compostables certificados en Perú.',
        customerSegments: 'Restaurantes premium y cadenas gastronómicas en Lima (primary). Hoteles eco-certificados (secondary). Retail orgánico y catering corporativo (tertiary).',
        uvp: 'Empaques 100% compostables hechos con fibras amazónicas — 40% más baratos que importados, con certificación internacional y entrega en 48h.',
        solution: 'Línea completa de empaques compostables (contenedores, platos, bowls, vasos) fabricados con bagazo de caña + almidón de yuca amazónica.',
        channels: 'Venta directa B2B, partnerships con APEGA y gremios hoteleros, marketplace propio para reorden automatizado.',
        revenueStreams: 'Venta de empaques (suscripción mensual recurrente), branding personalizado (+15% premium), reportes de impacto ambiental para ESG.',
        costStructure: 'Materia prima (23%), manufactura (18%), logística (12%), equipo (35%), marketing (7%), overhead (5%).',
        keyMetrics: 'MRR, churn rate, margen bruto, NPS, toneladas de plástico evitadas.',
        unfairAdvantage: '3 patentes en proceso, contratos exclusivos con cooperativas amazónicas, certificación EN 13432.',
      },
    },
    'competitor-analysis': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        competidores: [
          { nombre: 'Biopak', fortalezas: 'Marca global, amplio catálogo', debilidades: 'Precio 3x mayor, no tiene presencia local en Perú', amenaza: 'Media' },
          { nombre: 'Vegware', fortalezas: 'Buena calidad, certificaciones europeas', debilidades: 'Tiempos de importación de 6-8 semanas, costo de flete', amenaza: 'Media' },
          { nombre: 'Artesanos locales', fortalezas: 'Precio bajo, producción local', debilidades: 'Sin certificación, calidad inconsistente, no escalan', amenaza: 'Baja' },
        ],
        ventajaCompetitiva: 'Somos el único jugador que combina: fabricación local (entrega 48h), precio competitivo (40% menos que importados), certificación internacional (EN 13432), y materia prima amazónica sostenible.',
        estrategiaDefensiva: 'Patentes + contratos de suministro exclusivo + certificaciones = barrera de entrada de 18-24 meses para cualquier competidor.',
      },
    },
    'impact-metrics': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        co2Avoided: '847 toneladas CO2eq/año (proyección a 100 clientes)',
        wasteDiverted: '234 toneladas de plástico de un solo uso evitadas/año',
        comunidadesBeneficiadas: '4 cooperativas agrícolas en Madre de Dios (120+ familias)',
        empleosGenerados: '8 directos + 45 indirectos (cooperativas y logística)',
        metricaODS: 'ODS 12 (Producción responsable): 100% productos compostables. ODS 13 (Acción climática): reducción de 73% en huella de carbono vs plástico. ODS 8 (Trabajo decente): salarios 30% sobre promedio regional para cooperativistas.',
        impactoActual: 'A la fecha: 38 toneladas de plástico evitadas, 127 toneladas CO2eq reducidas, 4 cooperativas con contratos estables.',
        metodologiaMedicion: 'LCA (Life Cycle Assessment) validado por SGS Perú. Medición trimestral con reportes a clientes.',
      },
    },

    // ─── Stage 3: Aceleración (mostly completed) ───
    'decision-making-unit': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        decisor: 'Gerente de Operaciones o Director de Compras (firma contrato, aprueba presupuesto)',
        influenciador: 'Chef ejecutivo (valida calidad del producto), Gerente de Sostenibilidad/ESG (valida impacto ambiental)',
        usuario: 'Staff de cocina y empaque (usa el producto diariamente)',
        bloqueador: 'Área financiera (si el precio no es competitivo), Legal (revisión de contrato de suministro)',
        procesoPago: 'Factura a 30 días para contratos anuales, pago contra entrega para pedidos spot. Moneda: PEN o USD.',
        tiempoDecision: 'Restaurantes independientes: 2-3 semanas. Cadenas/hoteles: 45-60 días. Corporativos: 60-90 días.',
      },
    },
    'customer-acquisition-process': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        etapas: '1. Prospección (LinkedIn, APEGA, referidos) → 2. Demo en restaurante (muestra gratis) → 3. Piloto 2 semanas (50 unidades) → 4. Evaluación con chef y operaciones → 5. Propuesta comercial → 6. Cierre de contrato',
        tasaConversion: 'Prospecto → Demo: 35%. Demo → Piloto: 72%. Piloto → Contrato: 87%. Total funnel: 22%.',
        cac: '$3,200 (incluye muestras, tiempo de vendedor, demo)',
        tiempoCierre: 'Promedio 28 días para restaurantes, 52 días para hoteles.',
        canalMasEfectivo: 'Referidos de chefs existentes (CAC: $1,800, conversión 45%). LinkedIn outbound (CAC: $4,100, conversión 18%).',
      },
    },
    'business-model-design': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        modelo: 'B2B SaaS + Product: suscripción mensual para pedidos recurrentes de empaques con plataforma de reorden + reportes de impacto.',
        flujos: '1. Venta de empaques (85% revenue) — suscripción mensual con descuento por volumen. 2. Branding personalizado (10%) — impresión del logo del cliente en empaques (+15% premium). 3. Reportes de impacto ESG (5%) — dashboard y certificado trimestral.',
        unitEconomics: 'ARPU: $2,040/mes. Gross margin: 62%. Contribution margin: 48%.',
        escalabilidad: 'Modelo replicable en Colombia y Chile sin necesidad de planta propia (partner manufacturing). Plataforma de reorden automatiza el 70% de pedidos recurrentes.',
      },
    },
    'pricing-framework': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        estrategia: 'Value-based pricing: posicionamos al 60% del precio de importados europeos pero 15-20% sobre plástico convencional. El valor percibido (cumplimiento regulatorio + marketing sostenible) justifica el premium.',
        planes: [
          { nombre: 'Starter', precio: '$800/mes', incluye: 'Hasta 2,000 unidades, 3 productos, entrega quincenal' },
          { nombre: 'Growth', precio: '$1,800/mes', incluye: 'Hasta 5,000 unidades, catálogo completo, entrega semanal, branding básico' },
          { nombre: 'Enterprise', precio: '$4,500+/mes', incluye: 'Volumen ilimitado, branding premium, reportes ESG, account manager dedicado' },
        ],
        descuentos: 'Contrato anual: -10%. Contrato semestral: -5%. Referido: $200 crédito para ambas partes.',
      },
    },
    'ltv-unit-economics': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        ltv: '28500',
        cac: '3200',
        ltvCacRatio: '8.9',
        paybackMonths: '4.2',
        churnRate: '8% anual (< 1% mensual)',
        arpu: '$2,040/mes',
        grossMargin: '62%',
        contributionMargin: '48%',
        cohortAnalysis: 'Cohorte Q3 2025: 100% retención a 6 meses. Cohorte Q1 2026: 96% retención a 3 meses. Expansión neta: 115% (clientes aumentan pedidos con el tiempo).',
      },
    },
    'sales-process-map': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        proceso: '1. Identificación (LinkedIn Sales Navigator + base APEGA) → 2. Contacto inicial (email personalizado + WhatsApp) → 3. Demo presencial con muestras → 4. Piloto gratuito 2 semanas → 5. Follow-up con métricas del piloto → 6. Propuesta comercial → 7. Negociación → 8. Firma contrato → 9. Onboarding (capacitación staff) → 10. Primera entrega',
        herramientas: 'CRM: HubSpot (free). Comunicación: WhatsApp Business. Propuestas: Canva + Google Docs. Facturación: Nubefact.',
        kpis: 'Meetings/semana: 8. Pilotos activos: 4-5. Win rate: 22%. Deal size promedio: $24,500/año.',
        equipo: '1 sales lead (Ana) + 1 SDR (medio tiempo). Plan: contratar 2 SDRs al cerrar ronda.',
      },
    },
    'okr-tracker': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        periodo: 'Q2 2026',
        okrs: [
          {
            objetivo: 'Alcanzar $60K MRR para fin de Q2',
            resultados: [
              { kr: 'Cerrar 8 nuevos clientes Enterprise', progreso: 65 },
              { kr: 'Aumentar ARPU a $2,400/mes', progreso: 80 },
              { kr: 'Reducir churn a < 5% anual', progreso: 90 },
            ],
          },
          {
            objetivo: 'Preparar operaciones para escalar a Colombia',
            resultados: [
              { kr: 'Firmar 1 partner de manufactura en Bogotá', progreso: 40 },
              { kr: 'Obtener certificación INVIMA', progreso: 20 },
              { kr: 'Pipeline de 15 prospectos en Colombia', progreso: 55 },
            ],
          },
          {
            objetivo: 'Cerrar ronda pre-seed de $500K',
            resultados: [
              { kr: 'Pitch a 20 inversionistas', progreso: 70 },
              { kr: 'Terminar due diligence con 3 fondos interesados', progreso: 45 },
              { kr: 'Data room completo y actualizado', progreso: 85 },
            ],
          },
        ],
      },
    },
    'regulatory-compass': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        regulaciones: [
          { nombre: 'Ley 30884 — Plásticos de un solo uso (Perú)', estado: 'Cumplimiento total', impacto: 'Positivo — genera demanda de nuestros productos' },
          { nombre: 'EN 13432 — Compostabilidad', estado: 'Certificación obtenida (SGS)', impacto: 'Diferenciador clave vs competencia local' },
          { nombre: 'DIGESA — Registro sanitario', estado: 'Vigente hasta 2028', impacto: 'Requisito para venta a food service' },
          { nombre: 'Ordenanza municipal Lima — Prohibición plásticos', estado: 'Cumplimiento total', impacto: 'Acelera conversión de clientes en Lima' },
        ],
        riesgos: 'Si se relaja la regulación anti-plástico, la presión de precio vs convencional aumenta. Mitigación: nuestro precio ya es solo 15-20% sobre convencional.',
        patentes: '3 patentes en proceso ante INDECOPI: formulación de biomaterial (PE-2024-001234), proceso de recubrimiento (PE-2024-001567), sistema de compostaje acelerado (PE-2025-000891).',
      },
    },

    // ─── Stage 4: Escalamiento (partially started) ───
    'key-assumptions': {
      completed: true,
      completedAt: now,
      reportGenerated: true,
      lastSaved: now,
      data: {
        supuestos: [
          { supuesto: 'La regulación anti-plástico se mantendrá o endurecerá en LATAM', riesgo: 'Medio', validacion: 'Validado — 14 países LATAM con legislación activa, tendencia global irreversible' },
          { supuesto: 'Podemos mantener 62% de margen bruto al escalar', riesgo: 'Alto', validacion: 'Parcialmente validado — negociando contratos de suministro a 2 años para fijar costos' },
          { supuesto: 'El CAC se mantiene bajo $4,000 al entrar a nuevos mercados', riesgo: 'Alto', validacion: 'No validado — Colombia puede requerir CAC mayor por falta de marca' },
          { supuesto: 'Podemos replicar manufactura con partners en otros países', riesgo: 'Medio', validacion: 'En validación — 2 partners potenciales en Colombia identificados' },
        ],
      },
    },
    'mvbp-definition': {
      completed: true,
      completedAt: now,
      reportGenerated: false,
      lastSaved: now,
      data: {
        mvbp: 'Plataforma de reorden automatizado con dashboard de impacto ambiental para clientes Enterprise.',
        funcionalidades: '1. Reorden automático basado en consumo histórico. 2. Dashboard en tiempo real de kg de plástico evitados. 3. Certificado de impacto descargable para reportes ESG. 4. Integración con sistemas de compras del cliente.',
        metricas: 'Adoption rate > 60% en 3 meses. Reducción de carga operativa de ventas en 40%. NPS > 80.',
        timeline: 'MVP en 8 semanas. Beta con 5 clientes Enterprise. Launch general en Q3 2026.',
      },
    },
    'traction-validation': {
      completed: true,
      completedAt: now,
      reportGenerated: false,
      lastSaved: now,
      data: {
        traccion: 'MRR: $47,000. 23 clientes pagando. Crecimiento MoM: 18%. Churn: <1% mensual. NPS: 78.',
        hitos: [
          { fecha: '2024-06', hito: 'Primera venta (piloto con Central Restaurante)' },
          { fecha: '2024-09', hito: '$5K MRR — 5 clientes' },
          { fecha: '2025-01', hito: '$15K MRR — certificación EN 13432 obtenida' },
          { fecha: '2025-06', hito: '$28K MRR — 15 clientes, contrato con Hilton' },
          { fecha: '2025-12', hito: '$38K MRR — 20 clientes, equipo de 6 personas' },
          { fecha: '2026-03', hito: '$47K MRR — 23 clientes, equipo de 8, inicio fundraising' },
        ],
        evidencia: 'Revenue verificable por Nubefact (facturación electrónica SUNAT). Contratos firmados disponibles en data room.',
      },
    },
    'product-plan-scaling': {
      completed: false,
      completedAt: null,
      reportGenerated: false,
      lastSaved: now,
      data: {
        roadmap: 'Q2 2026: Plataforma de reorden. Q3 2026: Expansión a Colombia. Q4 2026: Línea de empaques para retail (consumer). Q1 2027: Planta propia en Lima.',
        capacidadActual: '50,000 unidades/mes (planta tercerizada en Lurín).',
        capacidadObjetivo: '200,000 unidades/mes para Q1 2027.',
      },
    },
    'pitch-deck-builder': {
      completed: false,
      completedAt: null,
      reportGenerated: false,
      lastSaved: now,
      data: {
        elevatorPitch: 'EcoBio Perú transforma residuos amazónicos en empaques compostables de alta performance para el food service latinoamericano. Con 23 clientes pagando, $47K MRR y 62% de margen bruto, estamos levantando $500K para expandir a Colombia y triplicar producción.',
        slides: ['Problema', 'Solución', 'Mercado ($2.4B TAM)', 'Producto', 'Tracción', 'Modelo de negocio', 'Competencia', 'Equipo', 'Financieros', 'Ask: $500K pre-seed'],
        estado: 'Deck v3 en revisión. 12 pitches realizados, 3 fondos en due diligence.',
      },
    },
    'cap-table-fundraising': {
      completed: false,
      completedAt: null,
      reportGenerated: false,
      lastSaved: now,
      data: {
        totalRaised: '230000',
        lastRound: 'Pre-seed (angel + grant)',
        valuation: '2500000',
        capTable: [
          { nombre: 'Ana Quispe (CEO)', porcentaje: '45%' },
          { nombre: 'Ricardo Mendoza (CTO)', porcentaje: '30%' },
          { nombre: 'Angel investors (3)', porcentaje: '15%' },
          { nombre: 'ESOP pool', porcentaje: '10%' },
        ],
        rondaActual: 'Buscando $500K pre-seed a $2.5M pre-money. 20 inversores contactados, 3 en due diligence.',
        usoDeFondos: '40% expansión Colombia, 25% plataforma tech, 20% equipo, 15% capital de trabajo.',
      },
    },
    'data-room-builder': {
      completed: false,
      completedAt: null,
      reportGenerated: false,
      lastSaved: now,
      data: {
        documentos: [
          { nombre: 'Pitch Deck v3', estado: 'Listo' },
          { nombre: 'Financial Model (3 años)', estado: 'Listo' },
          { nombre: 'Cap Table detallado', estado: 'Listo' },
          { nombre: 'Contratos con clientes (top 10)', estado: 'Listo' },
          { nombre: 'Certificación EN 13432', estado: 'Listo' },
          { nombre: 'Patentes en proceso (3)', estado: 'En revisión' },
          { nombre: 'Term Sheet borrador', estado: 'Pendiente' },
        ],
      },
    },
    'financial-model-builder': {
      completed: false,
      completedAt: null,
      reportGenerated: false,
      lastSaved: now,
      data: {
        mrr: '47000',
        arr: '564000',
        burnRate: '32000',
        runway: '14',
        grossMargin: '62',
        netMargin: '-8',
        proyeccion: [
          { periodo: '2026 Q2', mrr: '60000', clientes: 30 },
          { periodo: '2026 Q4', mrr: '95000', clientes: 48 },
          { periodo: '2027 Q2', mrr: '150000', clientes: 75 },
        ],
        breakeven: 'Proyectado para Q4 2026 con 35+ clientes.',
      },
    },
  }
  try {
    localStorage.setItem(key, JSON.stringify(seeded))
  } catch { /* ignore */ }

  // Seed rich profile extras for demo
  const profileKey = `s4c_${DEMO_FOUNDER_ID}_profile_extra`
  try {
    const existingProfile = localStorage.getItem(profileKey)
    if (!existingProfile || existingProfile === '{}') {
      localStorage.setItem(profileKey, JSON.stringify({
        vertical: 'cleantech_climatech',
        country: 'Perú',
        role: 'CEO & Co-Founder',
        experience: '2-3 startups',
        linkedin: 'linkedin.com/in/ana-quispe-ecobio',
        description: 'Ingeniera ambiental por la PUCP con maestría en biomateriales por la Universidad Nacional de Ingeniería. 8 años de experiencia en economía circular, ex-investigadora en CONCYTEC. Co-fundó EcoBio Perú en 2023 para transformar residuos amazónicos en empaques compostables de alta performance. La startup ha validado su tecnología con 3 patentes en proceso y contratos con las principales cadenas de restaurantes sostenibles en Lima.',
        teamSize: '8',
        website: 'https://ecobioperu.com',
        foundedYear: '2023',
        legalEntity: 'EcoBio Perú S.A.C.',
        ruc: '20612345678',
      }))
    }
  } catch { /* ignore */ }
  try {
    localStorage.setItem(versionKey, SEED_VERSION)
  } catch { /* ignore */ }
}

const AuthContext = createContext<AuthContextType | null>(null)

function appUserToUser(appUser: AppUser): User {
  return {
    id: appUser.id,
    name: appUser.full_name,
    email: appUser.email,
    startup: appUser.startup_name || '',
    stage: appUser.stage,
    diagnosticScore: appUser.diagnosticScore,
    createdAt: appUser.created_at,
  }
}

/**
 * Build a minimal AppUser from the Supabase auth session.
 * Used as a fallback when the profiles table query fails so the user
 * is not stuck on a loading spinner forever.
 */
async function fallbackAppUser(session: Session): Promise<AppUser> {
  // Try a minimal query to at least get the role (critical for redirect)
  let role: 'founder' | 'admin_org' | 'superadmin' = 'founder'
  let org_id: string | null = null
  try {
    const { data } = await supabase
      .from('profiles')
      .select('role, org_id')
      .eq('id', session.user.id)
      .maybeSingle()
    if (data?.role) role = data.role as typeof role
    if (data?.org_id) org_id = data.org_id
  } catch {
    // If even this fails, default to founder
  }

  return {
    id: session.user.id,
    email: session.user.email ?? '',
    role,
    org_id,
    full_name: session.user.user_metadata?.full_name ?? session.user.email ?? '',
    startup_name: session.user.user_metadata?.startup_name ?? null,
    stage: null,
    diagnosticScore: null,
    created_at: session.user.created_at ?? new Date().toISOString(),
  }
}

async function loadProfile(userId: string): Promise<AppUser | null> {
  try {
    // Race the profile query against a timeout so we never hang
    const result = await Promise.race([
      supabase
        .from('profiles')
        .select('id, email, full_name, role, org_id, startup_name, stage, diagnostic_score, created_at')
        .eq('id', userId)
        .maybeSingle(),
      new Promise<{ data: null; error: { message: string } }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: 'Timeout' } }), 5000)
      ),
    ])

    const { data, error } = result

    if (error || !data) return null

    return {
      id: data.id,
      email: data.email,
      role: data.role || 'founder',
      org_id: data.org_id || null,
      full_name: data.full_name || '',
      startup_name: data.startup_name || null,
      stage: data.stage || null,
      diagnosticScore: data.diagnostic_score ?? null,
      created_at: data.created_at || new Date().toISOString(),
    }
  } catch {
    // Network or unexpected errors — caller should use fallback
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')
  const [isDemo, setIsDemo] = useState(false)
  // Flag to prevent onAuthStateChange from overwriting the user
  // that login/register already set with accurate role data.
  const loginInProgressRef = React.useRef(false)

  const user = appUser ? appUserToUser(appUser) : null

  useEffect(() => {
    let cancelled = false

    // Safety: never stay stuck on loading spinner for more than 8 seconds
    const safetyTimeout = setTimeout(() => {
      setLoading((prev) => {
        if (prev) console.warn('[S4C Auth] Safety timeout — forcing loading=false')
        return false
      })
    }, 8000)

    // Rehydrate demo session from cookie before hitting Supabase. Without this,
    // refreshing /tools or /admin in demo mode redirects back to / because
    // appUser is null during the Supabase round-trip.
    if (typeof document !== 'undefined') {
      const demoCookie = document.cookie
        .split('; ')
        .find((c) => c.startsWith('s4c_demo='))
        ?.split('=')[1] as 'founder' | 'admin_org' | undefined
      if (demoCookie === 'founder') {
        seedDemoFounderData()
        setAppUser({ ...DEMO_FOUNDER_USER })
        setIsDemo(true)
        setLoading(false)
        clearTimeout(safetyTimeout)
        return () => { cancelled = true }
      }
      if (demoCookie === 'admin_org') {
        setAppUser({ ...DEMO_ADMIN_USER })
        setIsDemo(true)
        setLoading(false)
        clearTimeout(safetyTimeout)
        return () => { cancelled = true }
      }
    }

    // Get initial user (getUser() validates with the server, unlike getSession())
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (cancelled) return
      if (authUser) {
        // Set a minimal user IMMEDIATELY from authUser so we're never stuck
        // with loading=false but appUser=null (which triggers redirect to /)
        const minimalUser: AppUser = {
          id: authUser.id,
          email: authUser.email ?? '',
          role: 'founder',
          org_id: null,
          full_name: authUser.user_metadata?.full_name ?? authUser.email ?? '',
          startup_name: authUser.user_metadata?.startup_name ?? null,
          stage: null,
          diagnosticScore: null,
          created_at: authUser.created_at ?? new Date().toISOString(),
        }
        setAppUser(minimalUser)

        // Try to enrich with session-based profile (has role, org_id)
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            const enriched = await fallbackAppUser(session)
            if (!cancelled) setAppUser(enriched)
          }
        } catch {
          // Session fetch failed — minimal user already set
        }
        setLoading(false)
        // Then try to enrich with full profile data in background
        try {
          const profile = await loadProfile(authUser.id)
          if (!cancelled && profile) {
            setAppUser(profile)
          }
        } catch {
          // Fallback already set — ignore
        }
      } else {
        setLoading(false)
      }
    }).catch(() => {
      // getUser() itself failed — ensure we never stay stuck loading
      if (!cancelled) setLoading(false)
    })

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return
      // If login() or register() already set the user with accurate role data,
      // skip re-fetching here to avoid overwriting with stale/fallback data.
      if (loginInProgressRef.current) return

      // On token refresh, just keep the current user — don't re-fetch
      if (event === 'TOKEN_REFRESHED') {
        // Session is still valid, no action needed — user stays logged in
        return
      }

      if (session?.user) {
        // Set fallback immediately, then enrich
        try {
          setAppUser(await fallbackAppUser(session))
        } catch {
          // Fallback failed — set minimal user
          setAppUser({
            id: session.user.id,
            email: session.user.email ?? '',
            role: 'founder',
            org_id: null,
            full_name: session.user.email ?? '',
            startup_name: null,
            stage: null,
            diagnosticScore: null,
            created_at: session.user.created_at ?? new Date().toISOString(),
          })
        }
        try {
          const profile = await loadProfile(session.user.id)
          if (!cancelled && profile) {
            setAppUser(profile)
          }
        } catch {
          // Fallback already set — ignore
        }
      } else if (event === 'SIGNED_OUT') {
        setAppUser(null)
      }
      // For other events with no session (e.g. TOKEN_REFRESHED failure),
      // keep the existing user rather than logging out
    })

    return () => {
      cancelled = true
      clearTimeout(safetyTimeout)
      subscription.unsubscribe()
    }
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string, startup: string) => {
      loginInProgressRef.current = true
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password,
          options: {
            data: {
              full_name: name,
              startup_name: startup,
            },
          },
        })

        if (error) {
          loginInProgressRef.current = false
          return { error: mapSupabaseError(error.message) }
        }

        // If email confirmation is enabled in Supabase, session will be null.
        // In that case, try to sign in immediately with password to get a session.
        let activeUser = data.user
        if (!data.session && data.user) {
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({
              email: email.toLowerCase(),
              password,
            })
          if (signInError) {
            loginInProgressRef.current = false
            if (signInError.message.includes('Email not confirmed')) {
              return { error: 'Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.' }
            }
            return { error: mapSupabaseError(signInError.message) }
          }
          activeUser = signInData.user
        }

        // Set a minimal user IMMEDIATELY so the UI is never blocked
        // regardless of what happens with profile loading below
        const role: string = 'founder'
        if (activeUser) {
          const minimalUser: AppUser = {
            id: activeUser.id,
            email: activeUser.email ?? email,
            role: 'founder',
            org_id: null,
            full_name: name,
            startup_name: startup,
            stage: null,
            diagnosticScore: null,
            created_at: activeUser.created_at ?? new Date().toISOString(),
          }
          setAppUser(minimalUser)

          // Try to ensure profile exists in background — don't block the return
          ;(async () => {
            try {
              let profile = await loadProfile(activeUser!.id)
              if (!profile) {
                await supabase.from('profiles').upsert({
                  id: activeUser!.id,
                  email: activeUser!.email,
                  full_name: name,
                  startup_name: startup,
                  role: 'founder',
                  created_at: new Date().toISOString(),
                })
                profile = await loadProfile(activeUser!.id)
              }

              // Check for pending diagnostic results from the landing page quiz
              try {
                const pendingRaw = localStorage.getItem('s4c_diagnostic_pending')
                if (pendingRaw) {
                  const pending = JSON.parse(pendingRaw) as {
                    score: number
                    stage: string
                    answers: Record<string, unknown>
                    completedAt: string
                  }
                  // Update profile with diagnostic stage and score
                  await supabase
                    .from('profiles')
                    .update({
                      stage: pending.stage,
                      diagnostic_score: pending.score,
                    })
                    .eq('id', activeUser!.id)

                  // Also try to store the full answers (column may not exist yet)
                  try {
                    await supabase
                      .from('profiles')
                      .update({ diagnostic_data: pending.answers })
                      .eq('id', activeUser!.id)
                  } catch {
                    // Column doesn't exist yet — that's fine
                  }

                  // Clear from localStorage
                  localStorage.removeItem('s4c_diagnostic_pending')

                  // Re-load profile so the UI reflects the new stage
                  profile = await loadProfile(activeUser!.id)
                }
              } catch {
                // localStorage or parse error — continue silently
              }

              // Ensure a startup row exists so the founder appears in cohorts/reports
              await supabase.from('startups').upsert({
                founder_id: activeUser!.id,
                name: startup,
                stage: null,
                vertical: 'other',
                country: null,
              }, { onConflict: 'founder_id' })
              if (profile) {
                setAppUser(profile)
              }
            } catch {
              // Minimal user already set — ignore
            } finally {
              loginInProgressRef.current = false
            }
          })()

          return { role }
        }

        loginInProgressRef.current = false
        return { role }
      } catch {
        loginInProgressRef.current = false
        return { error: 'Error de conexión. Verifica tu internet e intenta de nuevo.' }
      }
    },
    []
  )

  const login = useCallback(async (email: string, password: string) => {
    // Wrap entire login in a race against a timeout so the UI never hangs
    const loginPromise = (async () => {
      try {
        // Prevent onAuthStateChange from overwriting user data we set here
        loginInProgressRef.current = true
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password,
        })

        if (error) {
          loginInProgressRef.current = false
          return { error: mapSupabaseError(error.message) }
        }

        if (!data.user || !data.session) {
          loginInProgressRef.current = false
          return { error: 'No se pudo iniciar sesión.' }
        }

        // Get role — try REST first, then Supabase client as fallback
        let role: string = 'founder'
        let orgId: string | null = null

        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
          const controller = new AbortController()
          const fetchTimeout = setTimeout(() => controller.abort(), 4000)
          const res = await fetch(
            `${supabaseUrl}/rest/v1/profiles?select=role,org_id&id=eq.${data.user.id}`,
            {
              headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Authorization': `Bearer ${data.session.access_token}`,
                'Accept': 'application/json',
              },
              signal: controller.signal,
            }
          )
          clearTimeout(fetchTimeout)
          if (res.ok) {
            const rows = await res.json()
            if (rows?.[0]?.role) role = rows[0].role
            if (rows?.[0]?.org_id) orgId = rows[0].org_id
          }
        } catch {
          // REST failed — try Supabase client as fallback
          try {
            const { data: profile } = await Promise.race([
              supabase
                .from('profiles')
                .select('role, org_id')
                .eq('id', data.user.id)
                .maybeSingle(),
              new Promise<{ data: null }>((resolve) =>
                setTimeout(() => resolve({ data: null }), 3000)
              ),
            ])
            if (profile?.role) role = profile.role
            if (profile?.org_id) orgId = profile.org_id
          } catch {
            // Both methods failed — proceed with default role
          }
        }

        // Set a minimal user immediately so the UI is not blocked
        const appUserData: AppUser = {
          id: data.user.id,
          email: data.user.email ?? '',
          role: role as AppUser['role'],
          org_id: orgId,
          full_name: data.user.user_metadata?.full_name ?? data.user.email ?? '',
          startup_name: data.user.user_metadata?.startup_name ?? null,
          stage: null,
          diagnosticScore: null,
          created_at: data.user.created_at ?? new Date().toISOString(),
        }
        setAppUser(appUserData)

        // Enrich with full profile in background (don't block login)
        loadProfile(data.user.id).then((profile) => {
          if (profile) {
            profile.role = role as AppUser['role']
            profile.org_id = orgId
            setAppUser(profile)
          }
        }).catch(() => {}).finally(() => {
          loginInProgressRef.current = false
        })

        return { role }
      } catch {
        loginInProgressRef.current = false
        return { error: 'Error de conexión. Verifica tu internet e intenta de nuevo.' }
      }
    })()

    // Hard timeout: if login takes more than 10s, return error
    return Promise.race([
      loginPromise,
      new Promise<{ error: string }>((resolve) =>
        setTimeout(() => {
          loginInProgressRef.current = false
          resolve({ error: 'La conexión tardó demasiado. Intenta de nuevo.' })
        }, 10000)
      ),
    ])
  }, [])

  const enterDemoMode = useCallback((role: 'founder' | 'admin_org') => {
    // Rehydrate demo user from fixtures (force re-render) and seed localStorage.
    setIsDemo(true)
    if (role === 'founder') {
      seedDemoFounderData()
      setAppUser({ ...DEMO_FOUNDER_USER })
    } else {
      setAppUser({ ...DEMO_ADMIN_USER })
    }
    setLoading(false)
    // Set a cookie so middleware lets demo users through (24h lifetime).
    if (typeof document !== 'undefined') {
      document.cookie = `s4c_demo=${role}; path=/; max-age=86400; SameSite=Lax`
    }
  }, [])

  const logout = useCallback(async () => {
    const userId = appUser?.id
    // Demo mode doesn't have a real Supabase session
    if (isDemo) {
      setIsDemo(false)
      setAppUser(null)
      try {
        if (userId) localStorage.removeItem(`s4c_${userId}_tool_progress`)
      } catch { /* ignore */ }
      if (typeof document !== 'undefined') {
        document.cookie = 's4c_demo=; path=/; max-age=0; SameSite=Lax'
      }
      return
    }
    await supabase.auth.signOut()
    setAppUser(null)
    // Clear user-specific localStorage data
    if (userId) {
      try {
        localStorage.removeItem(`s4c_${userId}_tool_progress`)
        localStorage.removeItem(`s4c_${userId}_profile_extra`)
        localStorage.removeItem(`s4c_${userId}_profile`)
        localStorage.removeItem(`s4c_${userId}_startup`)
      } catch { /* ignore */ }
    }
    // Also clear non-namespaced legacy keys
    try {
      localStorage.removeItem('s4c_tool_progress')
      localStorage.removeItem('s4c_profile_extra')
      localStorage.removeItem('s4c_profile')
      localStorage.removeItem('s4c_startup')
      localStorage.removeItem('s4c_diagnostic_pending')
      sessionStorage.removeItem('s4c_profile_checked')
    } catch { /* ignore */ }
  }, [appUser])

  const updateProfile = useCallback(
    async (updates: Partial<Pick<AppUser, 'full_name' | 'startup_name' | 'stage' | 'diagnosticScore'>>) => {
      if (!appUser) return { error: 'No hay sesión activa.' }

      const dbUpdates: Record<string, unknown> = {}
      if (updates.full_name !== undefined) dbUpdates.full_name = updates.full_name
      if (updates.startup_name !== undefined) dbUpdates.startup_name = updates.startup_name
      if (updates.stage !== undefined) dbUpdates.stage = updates.stage
      if (updates.diagnosticScore !== undefined) dbUpdates.diagnostic_score = updates.diagnosticScore

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', appUser.id)

      if (error) {
        return { error: 'No se pudo actualizar el perfil.' }
      }

      setAppUser((prev) => prev ? { ...prev, ...updates } : prev)
      return {}
    },
    [appUser]
  )

  const openAuthModal = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false)
  }, [])

  const updateUserStage = useCallback(
    (stage: string, score: number) => {
      if (!appUser) return

      setAppUser((prev) => prev ? { ...prev, stage, diagnosticScore: score } : prev)

      // Sync to Supabase in background
      supabase
        .from('profiles')
        .update({ stage, diagnostic_score: score })
        .eq('id', appUser.id)
        .then(() => {})
    },
    [appUser]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        loading,
        isDemo,
        login,
        register,
        logout,
        updateProfile,
        openAuthModal,
        closeAuthModal,
        authModalOpen,
        authModalMode,
        updateUserStage,
        enterDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

function mapSupabaseError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Email o contraseña incorrectos.'
  }
  if (message.includes('User already registered')) {
    return 'Ya existe una cuenta con ese email.'
  }
  if (message.includes('Email not confirmed')) {
    return 'Revisa tu email para confirmar tu cuenta.'
  }
  if (message.includes('Password should be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres.'
  }
  if (message.includes('Unable to validate email')) {
    return 'El email ingresado no es válido.'
  }
  if (message.includes('Email rate limit exceeded')) {
    return 'Demasiados intentos. Intenta de nuevo en unos minutos.'
  }
  if (message.includes('signups') && message.includes('disabled')) {
    return 'El registro no está disponible en este momento. Contacta al administrador.'
  }
  if (message.includes('Database error')) {
    return 'Error temporal del servidor. Intenta de nuevo en unos segundos.'
  }
  return message
}
