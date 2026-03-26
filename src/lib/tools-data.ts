export interface ToolDef {
  id: string
  name: string
  shortName: string
  description: string
  stage: 1 | 2 | 3
  stageName: string
  stageColor: string
  stageBg: string
  stageBorder: string
  category: string
  estimatedTime: string
  outputs: string[]
}

export const TOOLS: ToolDef[] = [
  // ── Stage 1: Pre-incubación ──────────────────────────────
  {
    id: 'trl-calculator',
    name: 'Calculadora TRL/CRL',
    shortName: 'TRL/CRL',
    description:
      'Evalúa tu nivel de madurez tecnológica y comercial con el framework estándar NASA/Horizonte Europa.',
    stage: 1,
    stageName: 'Pre-incubación',
    stageColor: '#7C3AED',
    stageBg: 'rgba(124,58,237,0.07)',
    stageBorder: 'rgba(124,58,237,0.18)',
    category: 'Evaluación',
    estimatedTime: '10 min',
    outputs: ['Score TRL (1-9)', 'Score CRL (1-9)', 'Brechas y recomendaciones'],
  },
  {
    id: 'lean-canvas',
    name: 'Climate Lean Canvas',
    shortName: 'Lean Canvas',
    description:
      'Modelo de negocio adaptado para el sector climático con bloques de impacto ambiental y riesgos regulatorios.',
    stage: 1,
    stageName: 'Pre-incubación',
    stageColor: '#7C3AED',
    stageBg: 'rgba(124,58,237,0.07)',
    stageBorder: 'rgba(124,58,237,0.18)',
    category: 'Modelo de Negocio',
    estimatedTime: '30 min',
    outputs: ['Canvas completo', 'Hipótesis clave', 'Métricas de validación'],
  },
  {
    id: 'lab-to-market',
    name: 'Guía Lab-to-Market',
    shortName: 'Lab-to-Market',
    description:
      'Checklist de transferencia tecnológica: licencias IP, spin-offs universitarios y primeros clientes B2B.',
    stage: 1,
    stageName: 'Pre-incubación',
    stageColor: '#7C3AED',
    stageBg: 'rgba(124,58,237,0.07)',
    stageBorder: 'rgba(124,58,237,0.18)',
    category: 'Roadmap',
    estimatedTime: '20 min',
    outputs: ['Checklist de transferencia IP', 'Roadmap Lab-to-Market', 'Score de preparación'],
  },
  {
    id: 'stakeholder-matrix',
    name: 'Matriz de Stakeholders',
    shortName: 'Stakeholders',
    description:
      'Mapeo estratégico de actores regulatorios, clientes B2B/B2G y tomadores de decisión corporativos.',
    stage: 1,
    stageName: 'Pre-incubación',
    stageColor: '#7C3AED',
    stageBg: 'rgba(124,58,237,0.07)',
    stageBorder: 'rgba(124,58,237,0.18)',
    category: 'Estrategia',
    estimatedTime: '25 min',
    outputs: ['Mapa de stakeholders', 'Estrategia de engagement', 'Prioridades de acción'],
  },
  {
    id: 'founder-audit',
    name: 'Auditoría del Equipo Fundador',
    shortName: 'Equipo Fundador',
    description:
      'Evaluación de brechas entre perfiles científicos y comerciales para construir un equipo invertible.',
    stage: 1,
    stageName: 'Pre-incubación',
    stageColor: '#7C3AED',
    stageBg: 'rgba(124,58,237,0.07)',
    stageBorder: 'rgba(124,58,237,0.18)',
    category: 'Equipo',
    estimatedTime: '15 min',
    outputs: ['Score de equipo', 'Brechas identificadas', 'Plan de contratación'],
  },

  // ── Stage 2: Incubación ──────────────────────────────────
  {
    id: 'business-models',
    name: 'Matriz Modelos de Negocio Climáticos',
    shortName: 'Modelos de Negocio',
    description:
      'Árbol de decisión interactivo: SaaS vs. Licensing vs. Hardware-as-a-Service (HaaS) para tu solución.',
    stage: 2,
    stageName: 'Incubación',
    stageColor: '#059669',
    stageBg: 'rgba(5,150,105,0.07)',
    stageBorder: 'rgba(5,150,105,0.18)',
    category: 'Modelo de Negocio',
    estimatedTime: '15 min',
    outputs: ['Modelo óptimo recomendado', 'Análisis comparativo', 'Estructura de precios sugerida'],
  },
  {
    id: 'unit-economics',
    name: 'Calculadora Unit Economics & Green Premium',
    shortName: 'Unit Economics',
    description:
      'Calcula tu CAC, LTV, payback period y proyecta la paridad de precio vs. la alternativa fósil.',
    stage: 2,
    stageName: 'Incubación',
    stageColor: '#059669',
    stageBg: 'rgba(5,150,105,0.07)',
    stageBorder: 'rgba(5,150,105,0.18)',
    category: 'Finanzas',
    estimatedTime: '20 min',
    outputs: ['CAC y LTV calculados', 'Green Premium actual vs. objetivo', 'Proyección de paridad de precios'],
  },
  {
    id: 'erp-estimator',
    name: 'Estimador ERP (Emisiones)',
    shortName: 'Estimador ERP',
    description:
      'Calcula la reducción de emisiones de tu tecnología basado en metodología IRIS+ y Project Frame.',
    stage: 2,
    stageName: 'Incubación',
    stageColor: '#059669',
    stageBg: 'rgba(5,150,105,0.07)',
    stageBorder: 'rgba(5,150,105,0.18)',
    category: 'Impacto',
    estimatedTime: '15 min',
    outputs: ['tCO2eq reducidas por año', 'ERP proyectado a 10 años', 'Métricas IRIS+'],
  },
  {
    id: 'pilots-framework',
    name: 'Framework Pilotos B2B & LOIs',
    shortName: 'Pilotos B2B',
    description:
      'Estructura tus Proof of Concepts con KPIs que detonan Offtake Agreements automáticamente al cumplirse.',
    stage: 2,
    stageName: 'Incubación',
    stageColor: '#059669',
    stageBg: 'rgba(5,150,105,0.07)',
    stageBorder: 'rgba(5,150,105,0.18)',
    category: 'Ventas',
    estimatedTime: '25 min',
    outputs: ['Term sheet de piloto', 'KPIs de éxito definidos', 'Plantilla de LOI'],
  },
  {
    id: 'pitch-deck',
    name: 'Pitch Deck Science-to-Business',
    shortName: 'Pitch Deck',
    description:
      'Narrativa para inversores climáticos: TEA, ruta de escalamiento, panorama regulatorio y ERP.',
    stage: 2,
    stageName: 'Incubación',
    stageColor: '#059669',
    stageBg: 'rgba(5,150,105,0.07)',
    stageBorder: 'rgba(5,150,105,0.18)',
    category: 'Fundraising',
    estimatedTime: '60 min',
    outputs: ['12 slides estructurados', 'Narrative arc validado', 'Talking points por slide'],
  },

  // ── Stage 3: Aceleración ─────────────────────────────────
  {
    id: 'cap-table',
    name: 'Simulador Cap Table Complejo',
    shortName: 'Cap Table',
    description:
      'Simula la interacción de VC, grants y venture debt en múltiples rondas de financiamiento.',
    stage: 3,
    stageName: 'Aceleración',
    stageColor: '#D97706',
    stageBg: 'rgba(217,119,6,0.07)',
    stageBorder: 'rgba(217,119,6,0.18)',
    category: 'Finanzas',
    estimatedTime: '30 min',
    outputs: ['Cap table multi-ronda', 'Dilución por fundador', 'Waterfall analysis'],
  },
  {
    id: 'capital-stack',
    name: 'Mapeador Climate Capital Stack',
    shortName: 'Capital Stack',
    description:
      'Directorio de VCs climáticos, CVCs, agencias gubernamentales y fondos de blended finance para Latam.',
    stage: 3,
    stageName: 'Aceleración',
    stageColor: '#D97706',
    stageBg: 'rgba(217,119,6,0.07)',
    stageBorder: 'rgba(217,119,6,0.18)',
    category: 'Fundraising',
    estimatedTime: '20 min',
    outputs: ['Stack de capital personalizado', 'Lista de contactos prioritarios', 'Estrategia de aproximación'],
  },
  {
    id: 'data-room',
    name: 'Arquitectura Data Room Climático',
    shortName: 'Data Room',
    description:
      'Checklist para Due Diligence ESG, técnico, LCA y FTO de patentes. Mide tu nivel de preparación.',
    stage: 3,
    stageName: 'Aceleración',
    stageColor: '#D97706',
    stageBg: 'rgba(217,119,6,0.07)',
    stageBorder: 'rgba(217,119,6,0.18)',
    category: 'Due Diligence',
    estimatedTime: '30 min',
    outputs: ['Score de preparación DD', 'Documentos faltantes', 'Timeline de preparación'],
  },
  {
    id: 'bankability',
    name: 'Framework Bankability & Offtakes',
    shortName: 'Bankability',
    description:
      'Estructura Advance Market Commitments con corporativos para lograr bancabilidad del proyecto FOAK.',
    stage: 3,
    stageName: 'Aceleración',
    stageColor: '#D97706',
    stageBg: 'rgba(217,119,6,0.07)',
    stageBorder: 'rgba(217,119,6,0.18)',
    category: 'Ventas',
    estimatedTime: '30 min',
    outputs: ['Term sheet de offtake', 'Bankability score', 'Estrategia de AMC'],
  },
  {
    id: 'reverse-dd',
    name: 'Reverse Due Diligence',
    shortName: 'Reverse DD',
    description:
      'Evalúa la paciencia del capital, tesis ESG y valor añadido real de cada fondo inversor antes de firmar.',
    stage: 3,
    stageName: 'Aceleración',
    stageColor: '#D97706',
    stageBg: 'rgba(217,119,6,0.07)',
    stageBorder: 'rgba(217,119,6,0.18)',
    category: 'Fundraising',
    estimatedTime: '20 min',
    outputs: ['Score por inversor', 'Matriz de alineación', 'Preguntas clave para reunión'],
  },
]

export const TOOLS_BY_STAGE: Record<1 | 2 | 3, ToolDef[]> = {
  1: TOOLS.filter((t) => t.stage === 1),
  2: TOOLS.filter((t) => t.stage === 2),
  3: TOOLS.filter((t) => t.stage === 3),
}

export function getToolById(id: string): ToolDef | undefined {
  return TOOLS.find((t) => t.id === id)
}
