import type {
  ActivityTrendPoint,
  CommitteeDictamen,
  Convocatoria,
  Ley843TaxCategory,
  ProjectStatus,
  SigpriProject,
  SigpriStatsSummary,
  TaxCalculationResult,
} from "./sigpri-types";

/**
 * Calculadora Fiscal Ley 843 (Bolivia)
 * Realiza el cálculo de retenciones tributarias para IUE, IT y RC-IVA según el tipo de gasto.
 * 
 * - Bienes (sin factura): IUE 5% + IT 3% = Total 8%
 * - Servicios / Consultorías (sin factura): IUE 12.5% + IT 3% = Total 15.5%
 * - RC-IVA / Alquileres / Viáticos: RC-IVA 13% + IT 3% = Total 16%
 *
 * @param amount Monto base en Bolivianos (BOB)
 * @param category Categoría del gasto según Ley 843
 * @param mode Modo de cálculo ('bruto' | 'neto')
 * @returns Objeto desglosado TaxCalculationResult con helper properties
 */
export function calculateLey843Tax(amount: number, category: 'servicios' | 'bienes' | 'alquileres' = 'servicios', mode: 'bruto' | 'neto' = 'bruto') {
  const safeAmount = Number(amount) || 0;
  const safeCategory = category || 'servicios';
  const result = calcularRetencionesLey843(safeAmount, safeCategory as any);
  return {
    grossAmount: result.montoBruto,
    netAmount: result.montoLiquido,
    iueRate: result.iuePorcentaje / 100,
    iueAmount: result.iueMonto,
    itRate: result.itPorcentaje / 100,
    itAmount: result.itMonto,
    rcIvaRate: result.rcIvaPorcentaje / 100,
    rcIvaAmount: result.rcIvaMonto,
    totalRetention: result.totalRetenciones,
    totalTaxPercent: (result.iuePorcentaje || 0) + (result.itPorcentaje || 0) + (result.rcIvaPorcentaje || 0),
    totalTaxAmount: result.totalRetenciones || 0,
    liquidPayout: result.montoLiquido
  };
}

export function calcularRetencionesLey843(
  montoBruto: number,
  tipoGasto: Ley843TaxCategory,
  descripcion = "Retención Impositiva"
): TaxCalculationResult {
  const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  let iuePorcentaje = 0;
  let itPorcentaje = 0;
  let rcIvaPorcentaje = 0;

  switch (tipoGasto) {
    case "bienes":
      iuePorcentaje = 5;
      itPorcentaje = 3;
      rcIvaPorcentaje = 0;
      break;
    case "servicios":
      iuePorcentaje = 12.5;
      itPorcentaje = 3;
      rcIvaPorcentaje = 0;
      break;
    case "rc_iva":
    case "alquileres":
      iuePorcentaje = 0;
      itPorcentaje = 3;
      rcIvaPorcentaje = 13;
      break;
    default:
      iuePorcentaje = 12.5;
      itPorcentaje = 3;
      rcIvaPorcentaje = 0;
  }

  const iueMonto = round((montoBruto * iuePorcentaje) / 100);
  const itMonto = round((montoBruto * itPorcentaje) / 100);
  const rcIvaMonto = round((montoBruto * rcIvaPorcentaje) / 100);

  const totalRetenciones = round(iueMonto + itMonto + rcIvaMonto);
  const montoLiquido = round(montoBruto - totalRetenciones);

  // Cálculo del Factor Gross-Up
  const tasaRetencionTotal = (iuePorcentaje + itPorcentaje + rcIvaPorcentaje) / 100;
  const montoGrossUp = round(montoBruto / (1 - tasaRetencionTotal));

  return {
    montoBruto: round(montoBruto),
    tipoGasto,
    descripcion,
    iuePorcentaje,
    iueMonto,
    itPorcentaje,
    itMonto,
    rcIvaPorcentaje,
    rcIvaMonto,
    totalRetenciones,
    montoLiquido,
    montoGrossUp,
  };
}

export const mockConvocatorias: Convocatoria[] = [
  {
    id: "conv-2026-01",
    codigo: "CONV-DIPGIS-2026-I",
    titulo: "Convocatoria FONDOS CTI - UMSA 2026",
    descripcion:
      "Financiamiento para proyectos de investigación científica, tecnológica e innovación orientados al desarrollo sostenible.",
    fechaInicio: "2026-01-15",
    fechaFin: "2026-12-15",
    fechaCierrePostulaciones: "2026-03-30",
    fechaDictamenFinal: "2026-04-30",
    presupuestoAsignadoBOB: 2500000,
    estado: "Abierta",
    areaTematica: "Biotecnología, Energías Renovables y Medio Ambiente",
    requisitos: [
      "Docente Investigador titular o titular interino",
      "Equipo multidisciplinario con al menos 2 co-investigadores",
      "Propuesta avalada por el Instituto de Investigación de la Facultad",
    ],
  },
  {
    id: "conv-2025-02",
    codigo: "CONV-FONTAGRO-2025",
    titulo: "Fondo de Investigación Aplicada Agropecuaria 2025-2026",
    descripcion:
      "Fondo competitivo para investigación sobre adaptación al cambio climático en cultivos andinos.",
    fechaInicio: "2025-06-01",
    fechaFin: "2026-08-31",
    fechaCierrePostulaciones: "2025-07-31",
    fechaDictamenFinal: "2025-09-15",
    presupuestoAsignadoBOB: 1800000,
    estado: "En Evaluación",
    areaTematica: "Ciencias Agrícolas y Seguridad Alimentaria",
    requisitos: [
      "Certificado de ética en investigación ambiental",
      "Alianza estratégica con comunidades productoras locales",
    ],
  },
  {
    id: "conv-2024-03",
    codigo: "CONV-LEY439-2024",
    titulo: "Proyectos IDH de Investigaciones de Impacto Social 2024-2025",
    descripcion:
      "Financiamiento con recursos IDH para proyectos de alto impacto social en el departamento de La Paz.",
    fechaInicio: "2024-03-01",
    fechaFin: "2025-11-30",
    fechaCierrePostulaciones: "2024-04-15",
    fechaDictamenFinal: "2024-05-20",
    presupuestoAsignadoBOB: 3200000,
    estado: "Finalizada",
    areaTematica: "Salud Pública, Educación e Inclusión Social",
    requisitos: [
      "Informe de avance semestral obligatorio",
      "Compromiso de publicación indexada en revistas Scopus/Web of Science",
    ],
  },
  {
    id: "conv-2025-04",
    codigo: "CONV-SALUD-2025-II",
    titulo: "Investigación Biomedicina y Enfermedades Tropicales 2025",
    descripcion:
      "Convocatoria especializada en estudios epidemiológicos e inmunológicos de enfermedades endémicas.",
    fechaInicio: "2025-09-01",
    fechaFin: "2026-10-31",
    fechaCierrePostulaciones: "2025-10-31",
    fechaDictamenFinal: "2025-11-30",
    presupuestoAsignadoBOB: 1500000,
    estado: "Cerrada",
    areaTematica: "Salud y Biomedicina",
    requisitos: [
      "Aprobación del Comité Ético Biomédico",
      "Protocolo de manejo de muestras biológicas certificado",
    ],
  },
];

export const mockDictamenes: CommitteeDictamen[] = [
  {
    id: "dict-101",
    proyectoId: "sigpri-2026-001",
    comiteNombre: "Comité de Evaluación Científica",
    evaluadorPrincipal: "Dr. Marcelo Ramírez Alarcón",
    fechaDictamen: "2026-02-10",
    estadoDictamen: "Aprobado",
    puntaje: 94,
    observaciones: [
      "Metodología clara y sólida fundamentación teórica.",
      "El plan de trabajo respeta el cronograma presupuestario.",
    ],
    recomendaciones: [
      "Incorporar un plan de difusión científica a nivel internacional.",
      "Ampliar la muestra de recolección en la zona periurbana.",
    ],
    dictamenPdfUrl: "https://sigpri.umsa.bo/docs/dictamen-94-2026.pdf",
  },
  {
    id: "dict-102",
    proyectoId: "sigpri-2026-002",
    comiteNombre: "Comité Ético",
    evaluadorPrincipal: "Dra. Elena Vargas Solíz",
    fechaDictamen: "2026-02-18",
    estadoDictamen: "En Observación",
    puntaje: 72,
    observaciones: [
      "Falta adjuntar el consentimiento informado firmado por representantes de la comunidad.",
      "El manejo de datos personales requiere anonimización estricta.",
    ],
    recomendaciones: [
      "Actualizar el formulario de consentimiento conforme al protocolo bioético 2026.",
      "Reenviar la propuesta ajustada en un plazo de 15 días hábiles.",
    ],
    dictamenPdfUrl: "https://sigpri.umsa.bo/docs/dictamen-obs-72.pdf",
  },
  {
    id: "dict-103",
    proyectoId: "sigpri-2025-003",
    comiteNombre: "Comité Revisor Institucional",
    evaluadorPrincipal: "Ing. Roberto Gutiérrez Paredes",
    fechaDictamen: "2025-09-05",
    estadoDictamen: "Aprobado",
    puntaje: 89,
    observaciones: [
      "Proyecto viable técnicamente con desembolsos acordes al avance físico.",
    ],
    recomendaciones: [
      "Presentar facturas o descargos fiscales Ley 843 para el segundo hito.",
    ],
  },
  {
    id: "dict-104",
    proyectoId: "sigpri-2024-004",
    comiteNombre: "Comité de Evaluación Científica",
    evaluadorPrincipal: "Dra. Carmen Mendoza Torrico",
    fechaDictamen: "2025-11-20",
    estadoDictamen: "Aprobado",
    puntaje: 98,
    observaciones: [
      "Objetivos cumplidos al 100%. Informe final validado satisfactoriamente.",
    ],
    recomendaciones: [
      "Proceder con el trámite de cierre definitivo y asignación de DOI.",
    ],
  },
  {
    id: "dict-105",
    proyectoId: "sigpri-2024-005",
    comiteNombre: "Comité Revisor Institucional",
    evaluadorPrincipal: "Dr. Fernando Quiroga Blanco",
    fechaDictamen: "2025-12-15",
    estadoDictamen: "Aprobado",
    puntaje: 96,
    observaciones: [
      "Publicación aceptada y verificada en revista indexada Q1 con DOI validado.",
    ],
    recomendaciones: [
      "Registrar la patente o propiedad intelectual resultante si corresponde.",
    ],
  },
];

export const mockSigpriProjects: SigpriProject[] = [
  {
    id: "sigpri-2026-001",
    codigo: "SIGPRI-2026-PROP-01",
    titulo:
      "Síntesis de Nanopartículas de Plata para el Tratamiento Bioquímico de Aguas Residuales en El Alto",
    resumen:
      "Investigación orientada a desarrollar nanocatalizadores eficientes para degradar contaminantes orgánicos en aguas efluentes industriales utilizando insumos de bajo costo.",
    investigadorPrincipal: {
      nombre: "Dr. Carlos Eduardo Mamani",
      email: "cmamani@umsa.bo",
      institucion: "Universidad Mayor de San Andrés",
      unidadAcademica: "Instituto de Investigaciones Químicas",
    },
    coInvestigadores: [
      {
        nombre: "M.Sc. Beatriz Quispe Morales",
        rol: "Co-Investigadora Principal",
        email: "bquispe@umsa.bo",
      },
      {
        nombre: "Lic. Javier Condori Flores",
        rol: "Asistente de Laboratorio",
        email: "jcondori@umsa.bo",
      },
    ],
    areaInvestigacion: "Biotecnología y Nanotecnología",
    convocatoriaId: "conv-2026-01",
    convocatoriaNombre: "Convocatoria FONDOS CTI - UMSA 2026",
    estado: "En Propuesta",
    fechaInicio: "2026-05-01",
    fechaFin: "2027-04-30",
    presupuestoTotalBOB: 180000,
    presupuestoEjecutadoBOB: 0,
    avancePorcentaje: 5,
    dictamenes: [mockDictamenes[0]],
    retencionesHistorial: [],
    tags: ["Nanotecnología", "Agua", "Medio Ambiente", "El Alto"],
    ultimaActualizacion: "2026-02-12",
  },
  {
    id: "sigpri-2026-002",
    codigo: "SIGPRI-2026-OBS-02",
    titulo:
      "Estudio Epidemiológico y Comunitario de la Incidencia de Chagas en Familias Rurales de Chiquitania",
    resumen:
      "Evaluación serológica y encuesta sociodemográfica para identificar factores de riesgo y vectores de Trypanosoma cruzi en viviendas vulnerables.",
    investigadorPrincipal: {
      nombre: "Dra. Sofía Rocha Ugarte",
      email: "srocha@medicina.umsa.bo",
      institucion: "Universidad Mayor de San Andrés",
      unidadAcademica: "Instituto de Investigación en Salud y Desarrollo (IINSAD)",
    },
    coInvestigadores: [
      {
        nombre: "Dr. Hernán Siles Paz",
        rol: "Epidemiólogo de Campo",
        email: "hsiles@medicina.umsa.bo",
      },
    ],
    areaInvestigacion: "Salud Pública y Epidemiología",
    convocatoriaId: "conv-2025-04",
    convocatoriaNombre: "Investigación Biomedicina y Enfermedades Tropicales 2025",
    estado: "En Observación",
    fechaInicio: "2026-04-01",
    fechaFin: "2027-03-31",
    presupuestoTotalBOB: 220000,
    presupuestoEjecutadoBOB: 15000,
    avancePorcentaje: 15,
    dictamenes: [mockDictamenes[1]],
    retencionesHistorial: [
      calcularRetencionesLey843(
        15000,
        "servicios",
        "Honorarios preliminares de diseño muestral (sin factura)"
      ),
    ],
    tags: ["Salud Pública", "Chagas", "Epidemiología", "Chiquitania"],
    ultimaActualizacion: "2026-02-19",
  },
  {
    id: "sigpri-2025-003",
    codigo: "SIGPRI-2025-EJEC-03",
    titulo:
      "Optimización Genética de Variedades de Quinua Real Resistentes a Heladas Extremas en el Altiplano Sur",
    resumen:
      "Selección asistida por marcadores moleculares para obtener ecotipos de Chenopodium quinoa con mayor tolerancia a bajas temperaturas y sequía prolongada.",
    investigadorPrincipal: {
      nombre: "Ing. Agr. Gonzalo Terán Claros",
      email: "gteran@agronomia.umsa.bo",
      institucion: "Universidad Mayor de San Andrés",
      unidadAcademica: "Facultad de Agronomía - IIAREN",
    },
    coInvestigadores: [
      {
        nombre: "Dra. Rosa Aruquipa Luna",
        rol: "Especialista en Genética Vegetal",
        email: "raruquipa@agronomia.umsa.bo",
      },
      {
        nombre: "Lic. Miguel Angel Ticona",
        rol: "Investigador Agronómico",
        email: "mticona@umsa.bo",
      },
    ],
    areaInvestigacion: "Biotecnología Agrícola",
    convocatoriaId: "conv-2025-02",
    convocatoriaNombre: "Fondo de Investigación Aplicada Agropecuaria 2025-2026",
    estado: "Aprobado en Ejecución",
    fechaInicio: "2025-09-01",
    fechaFin: "2026-08-31",
    presupuestoTotalBOB: 350000,
    presupuestoEjecutadoBOB: 210000,
    avancePorcentaje: 60,
    dictamenes: [mockDictamenes[2]],
    retencionesHistorial: [
      calcularRetencionesLey843(
        45000,
        "bienes",
        "Compra de reactivos de extracción de ADN a proveedor local sin factura"
      ),
      calcularRetencionesLey843(
        32000,
        "servicios",
        "Consultoría en secuenciación genética molecular (sin factura)"
      ),
      calcularRetencionesLey843(
        18000,
        "rc_iva",
        "Pago de viáticos de trabajo de campo en Uyuni (Retención RC-IVA 13% + IT 3%)"
      ),
    ],
    tags: ["Quinua", "Genética", "Agronomía", "Altiplano"],
    ultimaActualizacion: "2026-01-28",
  },
  {
    id: "sigpri-2024-004",
    codigo: "SIGPRI-2024-CONC-04",
    titulo:
      "Evaluación del Impacto Socioeconómico de la Digitalización en Microempresas de La Paz y El Alto",
    resumen:
      "Estudio cuantitativo y cualitativo sobre el nivel de adopción de herramientas tecnológicas y pasarelas de pago electrónico en PYMES urbanas post-pandemia.",
    investigadorPrincipal: {
      nombre: "M.Sc. Ramiro Peñaranda Calle",
      email: "rpenaranda@fce.umsa.bo",
      institucion: "Universidad Mayor de San Andrés",
      unidadAcademica: "Instituto de Investigaciones Económicas (IIE)",
    },
    coInvestigadores: [
      {
        nombre: "Lic. Claudia Machicao Vaca",
        rol: "Co-Investigadora Econometrista",
        email: "cmachicao@fce.umsa.bo",
      },
    ],
    areaInvestigacion: "Economía Aplicada y Desarrollo Digital",
    convocatoriaId: "conv-2024-03",
    convocatoriaNombre: "Proyectos IDH de Investigaciones de Impacto Social 2024-2025",
    estado: "Concluido",
    fechaInicio: "2024-05-01",
    fechaFin: "2025-11-30",
    presupuestoTotalBOB: 150000,
    presupuestoEjecutadoBOB: 150000,
    avancePorcentaje: 100,
    dictamenes: [mockDictamenes[3]],
    retencionesHistorial: [
      calcularRetencionesLey843(
        25000,
        "servicios",
        "Servicio de encuestadores de campo sin factura (IUE 12.5% + IT 3%)"
      ),
      calcularRetencionesLey843(
        12000,
        "alquileres",
        "Alquiler de equipos de cómputo para procesamiento de datos (RC-IVA 13% + IT 3%)"
      ),
    ],
    tags: ["Economía", "Digitalización", "PYMES", "La Paz"],
    ultimaActualizacion: "2025-12-05",
  },
  {
    id: "sigpri-2024-005",
    codigo: "SIGPRI-2024-PUB-05",
    titulo:
      "Modelado Hidrológico e Impacto del Retroceso Glaciar en la Cuenca del Glaciar Zongo mediante Imágenes Satelitales",
    resumen:
      "Investigación climática e hidrológica que cuantifica la pérdida de masa glaciar y predice la disponibilidad hídrica futura para el área metropolitana de La Paz.",
    investigadorPrincipal: {
      nombre: "Dr. Edson Ramírez Rodríguez",
      email: "eramirez@ihh.umsa.bo",
      institucion: "Universidad Mayor de San Andrés",
      unidadAcademica: "Instituto de Hidráulica e Hidrología (IHH)",
    },
    coInvestigadores: [
      {
        nombre: "Dr. Alvaro Soruco Franco",
        rol: "Glaciólogo Investigador",
        email: "asoruco@ihh.umsa.bo",
      },
      {
        nombre: "M.Sc. Lucía Zeballos Rivas",
        rol: "Especialista en Teledetección",
        email: "lzeballos@umsa.bo",
      },
    ],
    areaInvestigacion: "Glaciología y Recursos Hídricos",
    convocatoriaId: "conv-2024-03",
    convocatoriaNombre: "Proyectos IDH de Investigaciones de Impacto Social 2024-2025",
    estado: "Publicado con DOI",
    fechaInicio: "2024-04-01",
    fechaFin: "2025-10-31",
    presupuestoTotalBOB: 420000,
    presupuestoEjecutadoBOB: 420000,
    avancePorcentaje: 100,
    doi: "10.1016/j.jhydrol.2025.132890",
    urlPublicacion: "https://doi.org/10.1016/j.jhydrol.2025.132890",
    dictamenes: [mockDictamenes[4]],
    retencionesHistorial: [
      calcularRetencionesLey843(
        60000,
        "servicios",
        "Servicios internacionales de procesamiento lidar e imágenes Sentinel (sin factura local)"
      ),
      calcularRetencionesLey843(
        20000,
        "bienes",
        "Adquisición de sensores de presión hidrostática en plaza local (sin factura)"
      ),
    ],
    tags: ["Glaciares", "Zongo", "Recursos Hídricos", "DOI", "Cambio Climático"],
    ultimaActualizacion: "2026-01-10",
  },
];

export const mockActivityTrendData: ActivityTrendPoint[] = [
  {
    fecha: "2025-08",
    label: "Ago 2025",
    propuestas: 14,
    observaciones: 6,
    aprobados: 18,
    concluidos: 5,
    publicadosDoi: 2,
    totalActividades: 45,
    montoEjecutadoBOB: 280000,
  },
  {
    fecha: "2025-09",
    label: "Sep 2025",
    propuestas: 18,
    observaciones: 9,
    aprobados: 22,
    concluidos: 7,
    publicadosDoi: 3,
    totalActividades: 59,
    montoEjecutadoBOB: 350000,
  },
  {
    fecha: "2025-10",
    label: "Oct 2025",
    propuestas: 22,
    observaciones: 11,
    aprobados: 25,
    concluidos: 10,
    publicadosDoi: 4,
    totalActividades: 72,
    montoEjecutadoBOB: 420000,
  },
  {
    fecha: "2025-11",
    label: "Nov 2025",
    propuestas: 19,
    observaciones: 8,
    aprobados: 28,
    concluidos: 14,
    publicadosDoi: 5,
    totalActividades: 74,
    montoEjecutadoBOB: 510000,
  },
  {
    fecha: "2025-12",
    label: "Dic 2025",
    propuestas: 12,
    observaciones: 5,
    aprobados: 30,
    concluidos: 18,
    publicadosDoi: 7,
    totalActividades: 72,
    montoEjecutadoBOB: 680000,
  },
  {
    fecha: "2026-01",
    label: "Ene 2026",
    propuestas: 25,
    observaciones: 12,
    aprobados: 32,
    concluidos: 8,
    publicadosDoi: 6,
    totalActividades: 83,
    montoEjecutadoBOB: 310000,
  },
  {
    fecha: "2026-02",
    label: "Feb 2026",
    propuestas: 31,
    observaciones: 15,
    aprobados: 35,
    concluidos: 12,
    publicadosDoi: 8,
    totalActividades: 101,
    montoEjecutadoBOB: 490000,
  },
];

export const mockSigpriStatsSummary: SigpriStatsSummary = {
  totalProyectos: mockSigpriProjects.length,
  porEstado: {
    "En Propuesta": mockSigpriProjects.filter((p) => p.estado === "En Propuesta").length,
    "En Observación": mockSigpriProjects.filter((p) => p.estado === "En Observación").length,
    "Aprobado en Ejecución": mockSigpriProjects.filter(
      (p) => p.estado === "Aprobado en Ejecución"
    ).length,
    Concluido: mockSigpriProjects.filter((p) => p.estado === "Concluido").length,
    "Publicado con DOI": mockSigpriProjects.filter(
      (p) => p.estado === "Publicado con DOI"
    ).length,
  },
  presupuestoTotalGlobalBOB: mockSigpriProjects.reduce(
    (acc, p) => acc + p.presupuestoTotalBOB,
    0
  ),
  presupuestoEjecutadoGlobalBOB: mockSigpriProjects.reduce(
    (acc, p) => acc + p.presupuestoEjecutadoBOB,
    0
  ),
  proyectosConDoi: mockSigpriProjects.filter((p) => Boolean(p.doi)).length,
  convocatoriasActivas: mockConvocatorias.filter(
    (c) => c.estado === "Abierta" || c.estado === "En Evaluación"
  ).length,
};
