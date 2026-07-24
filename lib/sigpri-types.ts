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
export type Ley843TaxCategory = "bienes" | "servicios" | "rc_iva" | "alquileres";

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

/** Estructura principal de un proyecto registrado en SIGPRI */
export interface SigpriProject {
  id: string;
  codigo: string;
  titulo: string;
  resumen: string;
  investigadorPrincipal: PrincipalInvestigator;
  coInvestigadores: CoInvestigator[];
  areaInvestigacion: string;
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
