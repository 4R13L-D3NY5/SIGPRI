/**
 * Modelos de datos para el Sistema de Gestión de Proyectos e Investigaciones (SIGPRI)
 */

/** Los 5 estados exactos del ciclo de vida de un proyecto en SIGPRI */
export type ProjectStatus =
  | "En Propuesta"
  | "En Observación"
  | "Aprobado en Ejecución"
  | "Concluido"
  | "Publicado con DOI";

/** Tipos de gasto según la normativa fiscal de retenciones de la Ley 843 (Bolivia) */
export type Ley843TaxCategory = "bienes" | "servicios" | "rc_iva" | "alquileres" | "remesas_exterior" | "remesas_exterior_grossup";

/** Resultado detallado de la calculadora de retenciones tributarias (Ley 843) */
export interface TaxCalculationResult {
  montoBruto: number;
  tipoGasto: Ley843TaxCategory;
  descripcion: string;
  iuePorcentaje: number; // 5% para Bienes, 12.5% para Servicios
  iueMonto: number;
  itPorcentaje: number; // 3% Impuesto a las Transacciones
  itMonto: number;
  rcIvaPorcentaje: number; // 13% Régimen Complementario al IVA
  rcIvaMonto: number;
  totalRetenciones: number;
  montoLiquido: number; // Pago efectivo final al proveedor/investigador
  montoGrossUp: number; // Monto bruto reexpresado si la institución cubre la retención
}

/** Estado posible de un dictamen emitido por un comité institucional */
export type CommitteeDecisionStatus =
  | "Aprobado"
  | "En Observación"
  | "Rechazado"
  | "Requiere Modificaciones";

/** Nombre o categoría del comité evaluador */
export type CommitteeName =
  | "Comité Ético"
  | "Comité de Evaluación Científica"
  | "Comité Revisor Institucional";

/** Dictamen técnico o ético emitido por un comité para un proyecto */
export interface CommitteeDictamen {
  id: string;
  proyectoId: string;
  comiteNombre: CommitteeName;
  evaluadorPrincipal: string;
  fechaDictamen: string; // Formato YYYY-MM-DD
  estadoDictamen: CommitteeDecisionStatus;
  puntaje: number; // 0 - 100
  observaciones: string[];
  recomendaciones: string[];
  dictamenPdfUrl?: string;
}

/** Estado actual de una convocatoria pública o interna */
export type ConvocatoriaStatus = "Abierta" | "En Evaluación" | "Cerrada" | "Finalizada";

/** Estructura de una convocatoria de investigación con sus rangos de fechas */
export interface Convocatoria {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  fechaCierrePostulaciones: string; // YYYY-MM-DD
  fechaDictamenFinal: string; // YYYY-MM-DD
  presupuestoAsignadoBOB: number;
  estado: ConvocatoriaStatus;
  areaTematica: string;
  requisitos: string[];
}

/** Información del Investigador Principal */
export interface PrincipalInvestigator {
  nombre: string;
  email: string;
  institucion: string;
  unidadAcademica: string;
}

/** Información de Co-investigadores */
export interface CoInvestigator {
  nombre: string;
  rol: string;
  email: string;
}

/** Modalidad de Financiamiento Institucional */
export type FundingType = "INTERNO" | "COFINANCIADO" | "EXTERNO";

/** Documento adjunto de permiso, licencia o aval */
export interface AttachedDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  upload_date: string;
  status: "VIGENTE" | "OBSERVADO" | "CADUCADO";
  notes?: string;
}

/** Registro de Cesión de Derechos de Propiedad Intelectual */
export interface RightsTransfer {
  id: string;
  beneficiary_type: "UNITEPC" | "MUNICIPIO" | "INSTITUCION_EXTERNA" | "MIXTO";
  beneficiary_name: string;
  transfer_type: "CESION_TOTAL" | "LICENCIA_USO" | "CODIGO_FUENTE" | "EXPLOTACION_COMPARTIDA";
  legal_advisor: string;
  clauses: string;
  document_hash: string;
  created_at: string;
}

/** Registro de Difusión de Resultados Finales */
export interface DiffusionData {
  type?: "REVISTA" | "EVENTO" | "PRENSA";
  journal_name?: string;
  issn?: string;
  doi?: string;
  event_name?: string;
  media_name?: string;
  screenshots?: string[];
  final_document?: {
    name: string;
    url: string;
    size: string;
  };
}

/** Estructura de Gestión Anual */
export interface GestionAnual {
  id?: number;
  year: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

/** Línea de Investigación Parametrizada por Carrera */
export interface LineaInvestigacion {
  id?: number;
  carrera: string;
  area: string;
  linea_nombre: string;
  description?: string;
}

/** Estructura principal de un proyecto registrado en SIGPRI */
export interface SigpriProject {
  id: string;
  codigo: string;
  titulo: string;
  resumen: string;
  investigadorPrincipal: PrincipalInvestigator;
  coInvestigadores: CoInvestigator[];
  areaInvestigacion: string;
  fundingType?: FundingType;
  convocatoriaId: string;
  convocatoriaNombre: string;
  estado: ProjectStatus;
  fechaInicio: string;
  fechaFin: string;
  presupuestoTotalBOB: number;
  presupuestoEjecutadoBOB: number;
  avancePorcentaje: number;
  doi?: string;
  urlPublicacion?: string;
  dictamenes: CommitteeDictamen[];
  retencionesHistorial: TaxCalculationResult[];
  attachedDocuments?: AttachedDocument[];
  rightsTransfers?: RightsTransfer[];
  customLines?: string[];
  diffusionData?: DiffusionData;
  tags: string[];
  ultimaActualizacion: string;
}

/** Punto de datos temporal para la gráfica de tendencias (Activity Trend) */
export interface ActivityTrendPoint {
  fecha: string; // YYYY-MM-DD o formato mensual MMM YYYY
  label: string;
  propuestas: number;
  observaciones: number;
  aprobados: number;
  concluidos: number;
  publicadosDoi: number;
  totalActividades: number;
  montoEjecutadoBOB: number;
}

/** Resumen de métricas globales del tablero SIGPRI */
export interface SigpriStatsSummary {
  totalProyectos: number;
  porEstado: Record<ProjectStatus, number>;
  presupuestoTotalGlobalBOB: number;
  presupuestoEjecutadoGlobalBOB: number;
  proyectosConDoi: number;
  convocatoriasActivas: number;
}
