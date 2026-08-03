"use client";

import { ProjectItem } from "@/app/(dashboard)/projects/page";

const STORAGE_KEY = "sigpri_projects_master_data_v2";

export const INITIAL_MASTER_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    code: "SIGPRI-2026-001",
    title: "Modelado Epidemiológico y Telemedicina Asistida por IA en Zonas Rurales de Bolivia",
    leadInvestigator: "Dra. Maria Lorena Orellana Aguilar",
    facultyArea: "Ciencias de la Salud & Telemedicina",
    managementYear: "2026",
    status: "Aprobado en Ejecución",
    requestedBudget: 65000,
    approvedBudget: 60000,
    taxCategory: "servicios",
    wbsProgress: 65,
    abstractText: "Plataforma integrada para el diagnóstico temprano y seguimiento de enfermedades crónicas no transmisibles en la red de salud UNITEPC Cochabamba y sedes nacionales.",
    committeeRating: 92,
    createdAt: "2026-01-15",
    statusHistory: [
      {
        id: "h-1",
        previousStatus: "En Propuesta",
        newStatus: "En Evaluación",
        changedAt: "2026-01-18 10:30",
        changedBy: "Ing. Jose James Claure Ricaldi",
        userRole: "Jefe Investigador",
        notes: "Paso a revisión por Comité Científico y Bioético",
      },
      {
        id: "h-2",
        previousStatus: "En Evaluación",
        newStatus: "Aprobado en Ejecución",
        changedAt: "2026-01-25 14:15",
        changedBy: "Dr. Roberto Vargas Machuca",
        userRole: "Comité Evaluador",
        notes: "Dictamen favorable 92/100 y presupuesto aprobado por contabilidad",
      },
    ],
  },
  {
    id: "proj-2",
    code: "SIGPRI-2026-002",
    title: "Optimización de Algoritmos RAG en LLMs para la Clasificación de Documentos Académicos PAT UNITEPC",
    leadInvestigator: "Ing. Carlos Mendoza Ríos",
    facultyArea: "Tecnología y Sistemas / Inteligencia Artificial",
    managementYear: "2026",
    status: "En Observación (Rechazado con opción a corrección)",
    requestedBudget: 42000,
    approvedBudget: 42000,
    taxCategory: "servicios",
    wbsProgress: 20,
    abstractText: "Motor de búsqueda semántica y clasificación automática de perfiles e informes finales de grado basados en normativa UNITEPC.",
    correctionNotes: "Revisar la sección 4 de Metodología para incluir pruebas de estrés en servidores locales.",
    createdAt: "2026-02-01",
    statusHistory: [
      {
        id: "h-3",
        previousStatus: "En Propuesta",
        newStatus: "En Evaluación",
        changedAt: "2026-02-05 09:00",
        changedBy: "Ing. Carlos Mendoza Ríos",
        userRole: "Investigador Responsable",
        notes: "Envío inicial de la propuesta.",
      },
      {
        id: "h-4",
        previousStatus: "En Evaluación",
        newStatus: "En Observación (Rechazado con opción a corrección)",
        changedAt: "2026-02-12 11:30",
        changedBy: "Comité Científico",
        userRole: "Comité Evaluador",
        notes: "Revisar la sección 4 de Metodología para incluir pruebas de estrés en servidores locales.",
      },
    ],
  },
  {
    id: "proj-3",
    code: "SIGPRI-2026-003",
    title: "Evaluación Fitoquímica de Extractos Autóctonos en la Inhibición de Cepas Bacterianas Multirresistentes",
    leadInvestigator: "Dra. Patricia Siles Torrico",
    facultyArea: "Bioquímica y Farmacia / Biotecnología",
    managementYear: "2026",
    status: "En Evaluación",
    requestedBudget: 55000,
    approvedBudget: 55000,
    taxCategory: "bienes",
    wbsProgress: 10,
    abstractText: "Análisis in vitro del potencial bactericida de plantas del valle cochabambino frente a bacterias hospitalarias de alta resistencia.",
    createdAt: "2026-02-10",
    statusHistory: [
      {
        id: "h-5",
        previousStatus: "En Propuesta",
        newStatus: "En Evaluación",
        changedAt: "2026-02-15 16:45",
        changedBy: "Dra. Patricia Siles Torrico",
        userRole: "Investigador Responsable",
        notes: "Solicitud formal de evaluación bioética y científica.",
      },
    ],
  },
  {
    id: "proj-4",
    code: "SIGPRI-2025-004",
    title: "Impacto de la Inteligencia Artificial Generativa en el Aprendizaje Autónomo Universitario",
    leadInvestigator: "MSc. Elena Claros Guzmán",
    facultyArea: "Humanidades y Ciencias de la Educación",
    managementYear: "2025",
    status: "Publicado",
    requestedBudget: 35000,
    approvedBudget: 35000,
    taxCategory: "servicios",
    wbsProgress: 100,
    abstractText: "Estudio empírico sobre hábitos de estudio y adopción ética de ChatGPT en estudiantes de grado de UNITEPC.",
    publicationDoi: "https://doi.org/10.5281/zenodo.99881",
    createdAt: "2025-03-01",
    statusHistory: [
      {
        id: "h-6",
        previousStatus: "Concluido",
        newStatus: "Publicado",
        changedAt: "2025-11-20 18:00",
        changedBy: "Dirección de Investigación",
        userRole: "Administrador Institucional",
        notes: "Propuesta registrada exitosamente en el sistema SIGPRI.",
      },
    ],
    correctionNotes: undefined,
  },
  {
    id: "proj-5",
    code: "SIGPRI-2025-005",
    title: "Estudio de Prevalencia de Parasitosis Intestinal y Nutrición en Unidades Educativas Periurbanas",
    leadInvestigator: "Dr. Fernando Gutiérrez Arce",
    facultyArea: "Medicina y Salud Pública",
    managementYear: "2025",
    status: "Cancelado",
    requestedBudget: 48000,
    approvedBudget: 0,
    taxCategory: "bienes",
    wbsProgress: 15,
    abstractText: "Levantamiento coproparasitológico y evaluación antropométrica en niños de 6 a 12 años.",
    cancellationReason: "Falta de autorización de convenios interinstitucionales con el Municipio.",
    createdAt: "2025-02-15",
    statusHistory: [
      {
        id: "h-7",
        previousStatus: "Aprobado en Ejecución",
        newStatus: "Cancelado",
        changedAt: "2025-04-15 15:30",
        changedBy: "Administrador UNITEPC",
        userRole: "Administrador",
        notes: "Falta de autorización de convenios interinstitucionales con el Municipio.",
      },
    ],
  },
  {
    id: "proj-6",
    code: "SIGPRI-2025-006",
    title: "Implementación de Biomateriales Odontológicos a Base de Nano-Hidroxiapatita Sintetizada",
    leadInvestigator: "Dr. Roberto Vargas Machuca",
    facultyArea: "Odontología y Biomateriales",
    managementYear: "2025",
    status: "Concluido",
    requestedBudget: 70000,
    approvedBudget: 70000,
    taxCategory: "bienes",
    wbsProgress: 100,
    abstractText: "Síntesis química y caracterización de nanopartículas para regeneración esmalte-dentinaria.",
    createdAt: "2025-01-10",
    statusHistory: [],
  },
];

import { sigpriApi } from "./api-service";

export function getStoredMasterProjects(): ProjectItem[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing stored SIGPRI projects:", e);
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MASTER_PROJECTS));
  }
  return INITIAL_MASTER_PROJECTS;
}

export function saveMasterProjects(projects: ProjectItem[]) {
  sigpriApi.projects.saveAll(projects);
}

export function updateSingleProject(updatedProject: ProjectItem) {
  sigpriApi.projects.updateSingle(updatedProject);
}
