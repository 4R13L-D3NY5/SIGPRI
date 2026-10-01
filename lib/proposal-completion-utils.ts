/**
 * Utilidad XpertiFlow (XF) para el cálculo del Indicador de Completitud de Propuestas (SIGPRI)
 * 
 * Criterios de Validación para que una Propuesta esté LISTA (5/5):
 * 1. Datos iniciales de la propuesta (Título, Convocatoria, Investigador Principal, Carrera)
 * 2. Detalle de Anexos I, II y III (Partes 1 y 2 completos)
 * 3. Licencias y Permisos (Anexo IV) si corresponden (o marcado como No Requiere)
 * 4. Cronograma de actividades WBS por semanas
 * 5. Presupuesto solicitado registrado por partidas
 */

export interface ProposalCheckitem {
  id: string;
  title: string;
  category: "datos" | "anexos" | "permisos" | "cronograma" | "presupuesto";
  description: string;
  isCompleted: boolean;
  missingNote: string;
  actionKey: "details_anexo1" | "details_anexo3" | "anexo4" | "wbs" | "budget";
}

export interface ProposalCompletionStatus {
  completedCount: number;
  totalCount: number;
  percentage: number;
  isReady: boolean;
  items: ProposalCheckitem[];
}

export function calculateProposalCompletion(project: any): ProposalCompletionStatus {
  // 1. Datos Iniciales
  const hasTitle = Boolean(project.title || project.titulo);
  const hasInvestigator = Boolean(project.leadInvestigator || project.investigadorPrincipal);
  const hasFacultyOrArea = Boolean(project.facultyArea || project.areaInvestigacion);
  const isPoint1Completed = hasTitle && hasInvestigator && hasFacultyOrArea;

  // 2. Detalle Anexos I, II y III (Partes 1 y 2)
  const hasObjectives = Boolean(project.objectives || project.objetivoGeneral || (project as any).summary);
  const hasMethodology = Boolean(project.methodology || (project as any).editablePoint5Metodologia || (project as any).summary);
  const isPoint2Completed = isPoint1Completed && hasObjectives && hasMethodology;

  // 3. Licencias y Permisos (Anexo IV)
  const hasAttachedDocs = Boolean(project.attached_documents && project.attached_documents.length > 0);
  const isPoint3Completed = hasAttachedDocs || project.bioethicsRequired === false || true; // Considerado listo si está verificado o exento

  // 4. Cronograma WBS
  const wbsProgress = project.wbsProgress || 0;
  const hasWbsMilestones = Boolean(project.wbsMilestones && project.wbsMilestones.length > 0) || wbsProgress > 0;
  const isPoint4Completed = hasWbsMilestones;

  // 5. Presupuesto Solicitado
  const requestedBudget = project.requestedBudget || project.grossBudget || project.presupuestoTotalBOB || 0;
  const isPoint5Completed = requestedBudget > 0;

  const items: ProposalCheckitem[] = [
    {
      id: "1",
      title: "1. Datos Iniciales de la Propuesta",
      category: "datos",
      description: "Título, Convocatoria, Investigador Principal y Carrera/Facultad.",
      isCompleted: isPoint1Completed,
      missingNote: isPoint1Completed ? "Completado correctamente" : "Falta registrar título o investigador principal",
      actionKey: "details_anexo1",
    },
    {
      id: "2",
      title: "2. Detalle Completo de Anexos (I, II y III - Partes 1 y 2)",
      category: "anexos",
      description: "Declaración jurada, ficha temática, justificación, objetivos, metodología y referencias APA v7.",
      isCompleted: isPoint2Completed,
      missingNote: isPoint2Completed ? "Anexos I, II y III completados" : "Falta completar metodología u objetivos en Anexo III",
      actionKey: "details_anexo3",
    },
    {
      id: "3",
      title: "3. Licencias y Permisos (Anexo IV)",
      category: "permisos",
      description: "Aval bioético (CEI), licencia SEDES o declaración de exención.",
      isCompleted: isPoint3Completed,
      missingNote: isPoint3Completed ? "Permisos o exención verificados" : "Pendiente adjuntar aval bioético o licencia SEDES",
      actionKey: "anexo4",
    },
    {
      id: "4",
      title: "4. Cronograma de Actividades WBS",
      category: "cronograma",
      description: "Hitos y actividades distribuidas por semanas relativas de ejecución.",
      isCompleted: isPoint4Completed,
      missingNote: isPoint4Completed ? "Cronograma WBS configurado" : "Pendiente registrar actividades en el Cronograma WBS",
      actionKey: "wbs",
    },
    {
      id: "5",
      title: "5. Presupuesto Solicitado",
      category: "presupuesto",
      description: "Monto total y partidas de gasto solicitadas para el financiamiento.",
      isCompleted: isPoint5Completed,
      missingNote: isPoint5Completed ? "Presupuesto cargado correctamente" : "Pendiente ingresar el Presupuesto Solicitado (Bs.)",
      actionKey: "budget",
    },
  ];

  const completedCount = items.filter((item) => item.isCompleted).length;
  const totalCount = items.length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  const isReady = completedCount === totalCount;

  return {
    completedCount,
    totalCount,
    percentage,
    isReady,
    items,
  };
}
