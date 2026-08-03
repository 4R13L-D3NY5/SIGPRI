"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { 
  FolderKanban, Search, Filter, RefreshCw, AlertTriangle, 
  BookOpen, ExternalLink, Eye, ChevronRight, Calculator, CheckCircle2,
  DollarSign, PieChart, TrendingUp, Sparkles, Building2, User, X, Edit3, 
  ShieldAlert, LayoutGrid, List, Table as TableIcon, FileText, Calendar,
  FileSpreadsheet, Ban, History, ArrowRight, GitFork, Plus, Printer, Users, Scale, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { calculateLey843Tax } from "@/lib/sigpri-data";
import { getStoredMasterProjects, saveMasterProjects, updateSingleProject } from "@/lib/sigpri-store";
import { ElegantToast, ToastState } from "@/components/ui/elegant-toast";
import { CancelProjectModal } from "./_components/cancel-project-modal";
import { ProjectDetailModal } from "./_components/project-detail-modal";
import { ProjectWbsModal } from "./_components/project-wbs-modal";
import { ProjectBudgetModal } from "./_components/project-budget-modal";
import { ProjectHistoryModal } from "./_components/project-history-modal";
import { ProjectStatusFlowModal } from "./_components/project-status-flow-modal";
import { InitialProposalModal } from "./_components/initial-proposal-modal";
import { ProposalTutorialModal } from "@/components/proposal-tutorial-modal";
import { ProjectPdfGenerator } from "./_components/project-pdf-generator";
import { AssignCommitteesModal, CommitteeEvaluatorOption } from "./_components/assign-committees-modal";
import { EvaluateProposalModal, PointEvaluation } from "./_components/evaluate-proposal-modal";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

// ESTADOS OFICIALES REQUERIDOS (INCLUYENDO EN EVALUACIÓN)
export type ExactProjectStatus = 
  | "En Propuesta" 
  | "En Evaluación"
  | "En Observación (Rechazado con opción a corrección)" 
  | "Aprobado en Ejecución" 
  | "Concluido" 
  | "Publicado"
  | "Cancelado";

export interface StatusHistoryEntry {
  id: string;
  previousStatus: ExactProjectStatus;
  newStatus: ExactProjectStatus;
  changedAt: string;
  changedBy: string;
  userRole: string;
  notes?: string;
}

export interface ProjectItem {
  id: string;
  code: string;
  title: string;
  leadInvestigator: string;
  facultyArea: string;
  managementYear: "2025" | "2026" | "2027";
  status: ExactProjectStatus;
  requestedBudget: number;
  approvedBudget: number;
  taxCategory: 'servicios' | 'bienes' | 'alquileres';
  wbsProgress: number;
  abstractText: string;
  callCode?: string;
  callTitle?: string;
  publicationDoi?: string;
  correctionNotes?: string;
  cancellationReason?: string;
  committeeRating?: number;
  createdAt: string;
  statusHistory: StatusHistoryEntry[];
}

const INITIAL_PROJECTS: ProjectItem[] = [
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
    leadInvestigator: "Ing. Carlos Mendoza Rios",
    facultyArea: "Ingeniería y Tecnología",
    managementYear: "2026",
    status: "En Observación (Rechazado con opción a corrección)",
    requestedBudget: 42000,
    approvedBudget: 0,
    taxCategory: "servicios",
    wbsProgress: 20,
    abstractText: "Investigación computacional aplicada para el formateo automático de perfiles e informes finales de grado según las normativas académicas UNITEPC.",
    correctionNotes: "Dictamen Comité Científico: Se debe especificar el diseño muestral para la validación del modelo RAG en el Marco Metodológico. Además, ajustar la partida de licencias software según aranceles vigentes.",
    committeeRating: 68,
    createdAt: "2026-02-01",
    statusHistory: [
      {
        id: "h-3",
        previousStatus: "En Propuesta",
        newStatus: "En Evaluación",
        changedAt: "2026-02-03 09:00",
        changedBy: "Ing. Ariel Denys Camara Arze",
        userRole: "Jefe Investigador",
      },
      {
        id: "h-4",
        previousStatus: "En Evaluación",
        newStatus: "En Observación (Rechazado con opción a corrección)",
        changedAt: "2026-02-08 16:45",
        changedBy: "MSc. Elena Claros Guzmán",
        userRole: "Comité Evaluador",
        notes: "Se emiten observaciones metodológicas y presupuestarias para corrección.",
      },
    ],
  },
  {
    id: "proj-3",
    code: "SIGPRI-2026-003",
    title: "Evaluación Fitoquímica de Extractos Autóctonos en la Inhibición de Cepas Bacterianas Multirresistentes",
    leadInvestigator: "Dra. Patricia Siles Torrico",
    facultyArea: "Bioquímica y Farmacia",
    managementYear: "2026",
    status: "En Evaluación",
    requestedBudget: 55000,
    approvedBudget: 0,
    taxCategory: "bienes",
    wbsProgress: 10,
    abstractText: "Estudio experimental de la actividad biocida in-vitro de extractos fitoterapéuticos del trópico boliviano frente a patógenos intrahospitalarios.",
    committeeRating: 85,
    createdAt: "2026-02-10",
    statusHistory: [
      {
        id: "h-5",
        previousStatus: "En Propuesta",
        newStatus: "En Evaluación",
        changedAt: "2026-02-12 11:20",
        changedBy: "Ing. Harold Marco Antonio Rojas Torres",
        userRole: "Jefe Investigador",
        notes: "Propuesta completa admitida para dictamen por comités",
      },
    ],
  },
  {
    id: "proj-4",
    code: "SIGPRI-2025-008",
    title: "Implementación de Biomateriales Odontológicos a Base de Nano-Hidroxiapatita Sintetizada",
    leadInvestigator: "Dr. Roberto Vargas Machuca",
    facultyArea: "Odontología & Biomateriales",
    managementYear: "2025",
    status: "Concluido",
    requestedBudget: 70000,
    approvedBudget: 70000,
    taxCategory: "bienes",
    wbsProgress: 100,
    abstractText: "Desarrollo e incubación de regeneradores dentales para la clínica Odontológica UNITEPC Cochabamba, culminando con transferencia técnica.",
    committeeRating: 96,
    createdAt: "2025-03-12",
    statusHistory: [],
  },
  {
    id: "proj-5",
    code: "SIGPRI-2025-004",
    title: "Impacto de la Inteligencia Artificial Generativa en el Aprendizaje Autónomo Universitario",
    leadInvestigator: "MSc. Elena Claros Guzmán",
    facultyArea: "Ciencias de la Educación",
    managementYear: "2025",
    status: "Publicado",
    requestedBudget: 35000,
    approvedBudget: 35000,
    taxCategory: "servicios",
    wbsProgress: 100,
    publicationDoi: "https://doi.org/10.1016/j.unitepc.2025.04.012",
    abstractText: "Análisis cuantitativo y cualitativo del desempeño académico con herramientas conversacionales en la comunidad estudiantil de UNITEPC.",
    committeeRating: 98,
    createdAt: "2025-01-20",
    statusHistory: [],
  },
  {
    id: "proj-6",
    code: "SIGPRI-2025-009",
    title: "Estudio de Prevalencia de Parasitosis Intestinal y Nutrición en Unidades Educativas Periurbanas",
    leadInvestigator: "Dr. Fernando Gutierrez Arze",
    facultyArea: "Medicina Preventiva",
    managementYear: "2025",
    status: "Cancelado",
    requestedBudget: 48000,
    approvedBudget: 0,
    taxCategory: "servicios",
    wbsProgress: 15,
    cancellationReason: "Falta de autorización de convenios interinstitucionales con el Municipio y suspensión de recolección de muestras biológicas.",
    abstractText: "Tamizaje epidemiológico y evaluación antropométrica en niños de 5 a 12 años.",
    committeeRating: 60,
    createdAt: "2025-04-10",
    statusHistory: [
      {
        id: "h-6",
        previousStatus: "En Propuesta",
        newStatus: "Cancelado",
        changedAt: "2025-04-15 15:30",
        changedBy: "Administrador UNITEPC",
        userRole: "Administrador",
        notes: "Falta de autorización de convenios interinstitucionales con el Municipio.",
      },
    ],
  }
];

export default function ProjectsRegistryPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [query, setQuery] = useState("");
  const [selectedGestion, setSelectedGestion] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");

  // CARGAR Y ESCUCHAR CAMBIOS EN TIEMPO REAL DESDE EL STORE UNIFICADO
  useEffect(() => {
    setProjects(getStoredMasterProjects());

    const handleSync = (e: any) => {
      if (e.detail) {
        setProjects(e.detail);
      } else {
        setProjects(getStoredMasterProjects());
      }
    };

    window.addEventListener("sigpri_data_updated", handleSync);
    return () => window.removeEventListener("sigpri_data_updated", handleSync);
  }, []);

  // VISTA EN TARJETAS vs. LISTA
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  // ESTADO DE MODALES DE ACCIONES
  const [detailProject, setDetailProject] = useState<ProjectItem | null>(null);
  const [wbsProject, setWbsProject] = useState<ProjectItem | null>(null);
  const [budgetProject, setBudgetProject] = useState<ProjectItem | null>(null);
  const [historyProject, setHistoryProject] = useState<ProjectItem | null>(null);

  // ESTADO DE MODAL DE CANCELACIÓN Y DIAGRAMA DE FLUJO
  const [cancelModalProject, setCancelModalProject] = useState<ProjectItem | null>(null);
  const [isFlowModalOpen, setIsFlowModalOpen] = useState<boolean>(false);
  const [pdfProject, setPdfProject] = useState<ProjectItem | null>(null);

  // ESTADOS PARA DESIGNACIÓN Y EVALUACIÓN POR COMITÉS
  const [assignProject, setAssignProject] = useState<ProjectItem | null>(null);
  const [evaluateProject, setEvaluateProject] = useState<ProjectItem | null>(null);

  // ESTADO PARA REGISTRAR NUEVA PROPUESTA Y ALERTAS
  const [isNewProposalOpen, setIsNewProposalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // HANDLER PARA DESIGNAR EVALUADORES
  const handleAssignEvaluators = (projectId: string, assignedEvaluators: CommitteeEvaluatorOption[]) => {
    setProjects(projects.map((p) => {
      if (p.id === projectId) {
        const updated: ProjectItem = {
          ...p,
          statusHistory: [
            ...p.statusHistory,
            {
              id: `h-${Date.now()}`,
              previousStatus: p.status,
              newStatus: p.status,
              changedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              changedBy: "Jefe de Investigación",
              userRole: "Jefe de Investigación",
              notes: `Asignación de ${assignedEvaluators.length} evaluadores: ${assignedEvaluators.map((e) => e.name).join(", ")}`,
            }
          ]
        };
        updateSingleProject(updated);
        return updated;
      }
      return p;
    }));

    setToast({
      message: `Se han designado ${assignedEvaluators.length} miembros evaluadores para la propuesta.`,
      type: "success",
    });
  };

  // HANDLER PARA GUARDAR EVALUACIÓN Y GESTIONAR CAMBIO AUTOMÁTICO DE ESTADO
  const handleSaveEvaluation = (
    projectId: string, 
    evaluations: PointEvaluation[], 
    overallNotes: string,
    evaluatorName: string,
    evaluatorRole: string
  ) => {
    setProjects(projects.map((p) => {
      if (p.id === projectId) {
        const hasObservationsOrRejections = evaluations.some(
          (e) => e.status === "PARCIALMENTE_APROBADO" || e.status === "RECHAZADO"
        );

        let newStatus: ExactProjectStatus = p.status;

        // TRANSICIÓN 1: Si estaba "En Propuesta", pasa a "En Evaluación" al iniciar calificar
        if (p.status === "En Propuesta") {
          newStatus = "En Evaluación";
        }

        // TRANSICIÓN 2: Dictamen final del comité
        if (hasObservationsOrRejections) {
          newStatus = "En Observación (Rechazado con opción a corrección)";
        } else {
          newStatus = "Aprobado en Ejecución";
        }

        const compiledNotes = evaluations
          .filter((e) => e.observation && e.observation.trim().length > 0)
          .map((e) => `• ${e.title}: ${e.observation}`)
          .join("\n");

        const updated: ProjectItem = {
          ...p,
          status: newStatus,
          committeeRating: evaluations.filter((e) => e.status === "APROBADO").length * 12.5,
          correctionNotes: compiledNotes || p.correctionNotes || overallNotes || "Dictamen de comité completado.",
          statusHistory: [
            ...p.statusHistory,
            {
              id: `h-${Date.now()}`,
              previousStatus: p.status,
              newStatus: newStatus,
              changedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              changedBy: evaluatorName,
              userRole: evaluatorRole,
              notes: `Dictamen de evaluación emitido: ${newStatus}. ${overallNotes}`,
            }
          ]
        };
        updateSingleProject(updated);
        return updated;
      }
      return p;
    }));

    setToast({
      message: `Evaluación registrada. La propuesta ha actualizado su estado institucional.`,
      type: "success",
    });
  };

  // HANDLER PARA GUARDAR PROPUESTA INICIAL Y ABRIR REUSO DE MODALES EXISTENTES
  const handleSaveInitialProposal = (newProposal: ProjectItem) => {
    updateSingleProject(newProposal);
    setIsNewProposalOpen(false);
    setToast({
      message: `Propuesta ${newProposal.code} creada. Proceda a completar el Detalle, Cronograma y Presupuesto con los botones del proyecto.`,
      type: "success",
    });
    // Abrir automáticamente el modal de detalle para completar los campos
    setDetailProject(newProposal);
  };

  // Helper para obtener datos del usuario actual
  const getCurrentUser = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sigpri_current_user");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return { name: "Usuario Sistema", roleLabel: "Administrador" };
  };

  // Filter Logic
  const filteredProjects = projects.filter((p) => {
    const searchLower = query.toLowerCase();
    const matchesQuery = 
      p.code.toLowerCase().includes(searchLower) ||
      p.title.toLowerCase().includes(searchLower) ||
      p.leadInvestigator.toLowerCase().includes(searchLower);

    const matchesGestion = selectedGestion === "all" || p.managementYear === selectedGestion;
    const matchesStatus = selectedStatus === "all" || p.status === selectedStatus;
    const matchesArea = selectedArea === "all" || p.facultyArea.includes(selectedArea);
    const matchesCampaign = selectedCampaign === "all" || (p.campaignCode && p.campaignCode.toLowerCase().includes(selectedCampaign.toLowerCase()));

    return matchesQuery && matchesGestion && matchesStatus && matchesArea && matchesCampaign;
  });

  // Action: Change Status con Registro de Auditoría (Llamado desde los Modales)
  const handleStatusChange = (id: string, newStatus: ExactProjectStatus, notes?: string) => {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;

    if (newStatus === "Cancelado") {
      setCancelModalProject(proj);
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const currentUser = getCurrentUser();

    const historyEntry: StatusHistoryEntry = {
      id: `h-${Date.now()}`,
      previousStatus: proj.status,
      newStatus: newStatus,
      changedAt: nowStr,
      changedBy: currentUser.name || "Usuario Sistema",
      userRole: currentUser.roleLabel || "Jefe Investigador",
      notes: notes || `Cambio de estado a ${newStatus} desde el modal de gestión`,
    };

    const updatedList = projects.map(p =>
      p.id === id
        ? {
            ...p,
            status: newStatus,
            cancellationReason: undefined,
            statusHistory: [historyEntry, ...(p.statusHistory || [])],
          }
        : p
    );

    setProjects(updatedList);
    saveMasterProjects(updatedList);

    // Actualizar referencias en modales abiertos
    if (detailProject?.id === id) setDetailProject(updatedList.find(p => p.id === id) || null);
    if (wbsProject?.id === id) setWbsProject(updatedList.find(p => p.id === id) || null);
    if (budgetProject?.id === id) setBudgetProject(updatedList.find(p => p.id === id) || null);
  };

  // Confirmar Cancelación con Auditoría
  const handleConfirmCancel = (reason: string) => {
    if (!cancelModalProject) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const currentUser = getCurrentUser();

    const historyEntry: StatusHistoryEntry = {
      id: `h-${Date.now()}`,
      previousStatus: cancelModalProject.status,
      newStatus: "Cancelado",
      changedAt: nowStr,
      changedBy: currentUser.name || "Usuario Sistema",
      userRole: currentUser.roleLabel || "Administrador",
      notes: reason,
    };

    const updatedList = projects.map(p =>
      p.id === cancelModalProject.id
        ? {
            ...p,
            status: "Cancelado" as ExactProjectStatus,
            cancellationReason: reason,
            statusHistory: [historyEntry, ...(p.statusHistory || [])],
          }
        : p
    );

    setProjects(updatedList);
    saveMasterProjects(updatedList);
    setCancelModalProject(null);
  };

  // Status Badge Helper
  const renderStatusBadge = (st: ExactProjectStatus) => {
    switch (st) {
      case "En Propuesta":
        return <Badge variant="outline" className="border-blue-500/40 text-blue-400 bg-blue-500/10 font-bold">📝 1. En Propuesta</Badge>;
      case "En Evaluación":
        return <Badge variant="outline" className="border-indigo-500/40 text-indigo-400 bg-indigo-500/10 font-bold">🔍 2. En Evaluación</Badge>;
      case "En Observación (Rechazado con opción a corrección)":
        return <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10 font-bold">⚠️ 3. En Observación</Badge>;
      case "Aprobado en Ejecución":
        return <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 font-bold">🚀 4. En Ejecución</Badge>;
      case "Concluido":
        return <Badge variant="outline" className="border-purple-500/40 text-purple-400 bg-purple-500/10 font-bold">🏁 5. Concluido</Badge>;
      case "Publicado":
        return <Badge variant="outline" className="border-teal-500/40 text-teal-400 bg-teal-500/10 font-bold">📚 6. Publicado</Badge>;
      case "Cancelado":
        return <Badge variant="outline" className="border-rose-500/40 text-rose-400 bg-rose-500/10 font-bold">🚫 7. Cancelado</Badge>;
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col min-h-screen bg-background pb-10">
      <Header 
        title="Directorio de Proyectos" 
        description="Gestión y seguimiento de proyectos a nivel nacional clasificados por los estados institucionales y retenciones impositivas." 
      />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 w-full">
        {/* BANNER PRINCIPAL */}
        <Card className="border-primary/20 bg-card text-card-foreground shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-primary/40 text-primary font-bold">
                    SIGPRI UNITEPC
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">Actualizado en tiempo real</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                  <FolderKanban className="h-6 w-6 text-primary" />
                  <span>Directorio de Proyectos</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Plataforma centralizada para la administración de investigaciones clasificadas en los estados institucionales.
                </CardDescription>
              </div>

              <div className="flex items-center space-x-3">
                {/* BOTÓN REGISTRAR NUEVA PROPUESTA */}
                <Button
                  onClick={() => setIsNewProposalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Registrar Nueva Propuesta</span>
                </Button>

                {/* BOTÓN GUÍA INTERACTIVA Y DIAGRAMA SVG DE POSTULACIÓN */}
                <ProposalTutorialModal
                  triggerButtonText="📖 Guía & Flujo Investigador"
                  triggerButtonClassName="font-bold text-xs gap-1.5 bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20 shadow-sm"
                />

                {/* BOTÓN DIAGRAMA DE FLUJO DE ESTADOS */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFlowModalOpen(true)}
                  className="gap-1.5 font-bold text-xs bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 shadow-sm"
                  title="Ver Diagrama de Flujo del Ciclo de Vida del Proyecto"
                >
                  <GitFork className="w-4 h-4" />
                  <span>Flujo de Estados</span>
                </Button>

                {/* SWITCHER DE VISTA: TARJETAS VS LISTA */}
                <div className="p-1 rounded-lg bg-muted/60 border border-border flex items-center space-x-1 shadow-inner">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      viewMode === "cards"
                        ? "bg-card text-foreground shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Visualizar como Tarjetas"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">Tarjetas</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      viewMode === "list"
                        ? "bg-card text-foreground shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Visualizar como Tabla / Lista"
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">Tabla</span>
                  </button>
                </div>
              </div>
            </div>

            {/* METRICAS DE CONTEO EN CABECERA (7 ESTADOS OFICIALES) */}
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 pt-3 text-xs">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <span className="text-[10px] text-blue-400 font-bold block uppercase truncate">1. Propuesta</span>
                <span className="text-base sm:text-lg font-extrabold text-blue-300">
                  {projects.filter(p => p.status === "En Propuesta").length}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <span className="text-[10px] text-indigo-400 font-bold block uppercase truncate">2. Evaluación</span>
                <span className="text-base sm:text-lg font-extrabold text-indigo-300">
                  {projects.filter(p => p.status === "En Evaluación").length}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] text-amber-400 font-bold block uppercase truncate">3. Observación</span>
                <span className="text-base sm:text-lg font-extrabold text-amber-300">
                  {projects.filter(p => p.status.includes("Observación")).length}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] text-emerald-400 font-bold block uppercase truncate">4. Ejecución</span>
                <span className="text-base sm:text-lg font-extrabold text-emerald-300">
                  {projects.filter(p => p.status === "Aprobado en Ejecución").length}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <span className="text-[10px] text-purple-400 font-bold block uppercase truncate">5. Concluido</span>
                <span className="text-base sm:text-lg font-extrabold text-purple-300">
                  {projects.filter(p => p.status === "Concluido").length}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                <span className="text-[10px] text-teal-400 font-bold block uppercase truncate">6. Publicado</span>
                <span className="text-base sm:text-lg font-extrabold text-teal-300">
                  {projects.filter(p => p.status === "Publicado").length}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] text-rose-400 font-bold block uppercase truncate">7. Cancelado</span>
                <span className="text-base sm:text-lg font-extrabold text-rose-300">
                  {projects.filter(p => p.status === "Cancelado").length}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* BARRA DE FILTROS Y BÚSQUEDA (INCLUYENDO FILTRO POR CONVOCATORIA) */}
        <Card className="border-border bg-card text-card-foreground shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por código, título o investigador..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-background border border-input rounded-md pl-9 pr-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* FILTRO POR CONVOCATORIA */}
              <div>
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs font-medium text-foreground cursor-pointer font-mono"
                >
                  <option value="all">📢 Todas las Convocatorias</option>
                  {Array.from(new Set(projects.map((p) => p.campaignCode).filter(Boolean))).map((code) => (
                    <option key={code} value={code!}>
                      {code}
                    </option>
                  ))}
                  <option value="CONV-1-2026-03">CONV-1-2026-03 (Nacional UNITEPC)</option>
                  <option value="CONV-2-2026-01">CONV-2-2026-01 (Salud)</option>
                </select>
              </div>

              {/* FILTRO POR ESTADO */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs font-medium text-foreground cursor-pointer"
                >
                  <option value="all">Todos los Estados</option>
                  <option value="En Propuesta">1. En Propuesta</option>
                  <option value="En Evaluación">2. En Evaluación</option>
                  <option value="En Observación (Rechazado con opción a corrección)">3. En Observación</option>
                  <option value="Aprobado en Ejecución">4. Aprobado en Ejecución</option>
                  <option value="Concluido">5. Concluido</option>
                  <option value="Publicado">6. Publicado</option>
                  <option value="Cancelado">7. Cancelado</option>
                </select>
              </div>

              {/* FILTRO POR GESTIÓN */}
              <div>
                <select
                  value={selectedGestion}
                  onChange={(e) => setSelectedGestion(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-xs font-medium text-foreground cursor-pointer"
                >
                  <option value="all">Todas las Gestiones</option>
                  <option value="2026">Gestión 2026</option>
                  <option value="2025">Gestión 2025</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LISTADO DE PROYECTOS (VISTA EN TARJETAS O VISTA EN TABLA) */}
        {filteredProjects.length === 0 ? (
          <Card className="border-border p-12 text-center text-muted-foreground">
            <p>No se encontraron proyectos con los criterios de búsqueda seleccionados.</p>
          </Card>
        ) : viewMode === "cards" ? (
          /* VISTA EN TARJETAS */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => {
              const reqBudget = p.requestedBudget || p.grossBudget || 0;
              const taxCat = p.taxCategory || 'servicios';
              const taxInfo = calculateLey843Tax(reqBudget, taxCat);
              return (
                <Card key={p.id} className="border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
                  <CardHeader className="space-y-2 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="outline" className="font-mono text-[10px] bg-primary/10 border-primary/30 text-primary font-bold">
                          {p.code}
                        </Badge>
                        {p.callCode && (
                          <Badge variant="outline" className="font-mono text-[9px] bg-purple-500/10 border-purple-500/30 text-purple-400 font-bold">
                            📢 {p.callCode}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {renderStatusBadge(p.status)}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setHistoryProject(p)}
                          title="Ver Historial de Cambios de Estado"
                          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <CardTitle className="text-base font-bold line-clamp-2 leading-snug">
                      {p.title}
                    </CardTitle>

                    <CardDescription className="text-xs text-muted-foreground flex items-center justify-between">
                      <span className="truncate">👤 {p.leadInvestigator}</span>
                      <span className="font-mono font-semibold">Año {p.managementYear}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs">
                    {/* ALERTA DE CANCELACIÓN SI APLICA */}
                    {p.status === "Cancelado" && p.cancellationReason && (
                      <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] space-y-0.5">
                        <strong className="block font-bold uppercase tracking-wider">Motivo de Cancelación:</strong>
                        <p className="italic">{p.cancellationReason}</p>
                      </div>
                    )}

                    {/* PRESUPUESTO & RETENCIONES */}
                    <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground">Presupuesto Bruto:</span>
                        <span className="font-mono font-bold text-foreground">Bs. {reqBudget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground">Retenciones ({taxInfo.totalTaxPercent}%):</span>
                        <span className="font-mono font-bold text-amber-500">Bs. {taxInfo.totalTaxAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] pt-1 border-t border-border">
                        <span className="font-bold text-foreground">Monto Neto a Desembolsar:</span>
                        <span className="font-mono font-extrabold text-emerald-500">Bs. {taxInfo.netAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* AVANCE WBS */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">Avance Cronograma WBS:</span>
                        <span className="font-mono font-bold text-primary">{p.wbsProgress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border">
                        <div 
                          className="bg-primary h-full transition-all duration-300" 
                          style={{ width: `${p.wbsProgress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>

                  {/* ACCIONES OPERATIVAS CON TOOLTIPS INSTANTÁNEOS (DELAY 0) */}
                  <CardFooter className="pt-2.5 pb-2.5 bg-muted/20 border-t border-border flex items-center justify-start gap-1.5 overflow-x-auto">
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setDetailProject(p)} 
                          className="h-8 w-8 text-blue-400 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 shrink-0"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                        📄 1. Ver Detalle (Anexos I, II y III)
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setWbsProject(p)} 
                          className="h-8 w-8 text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 shrink-0"
                        >
                          <Calendar className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                        📅 2. Cronograma de Actividades WBS
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setBudgetProject(p)} 
                          className="h-8 w-8 text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 shrink-0"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                        📊 3. Presupuesto & Retenciones
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setPdfProject(p)} 
                          className="h-8 w-8 text-primary border-primary/30 bg-primary/10 hover:bg-primary/20 shrink-0"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                        🖨️ Imprimir Documento PDF Oficial
                      </TooltipContent>
                    </Tooltip>

                    {/* BOTÓN DESIGNAR EVALUADORES (JEFE DE INVESTIGACIÓN - EN PROPUESTA) */}
                    {p.status === "En Propuesta" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setAssignProject(p)} 
                            className="h-8 w-8 text-purple-400 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 shrink-0"
                          >
                            <Users className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-purple-950 border border-purple-700 text-purple-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                          👥 Designar Miembros Evaluadores
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* BOTÓN EVALUAR PROPUESTA (COMITÉ - EN PROPUESTA O EN EVALUACIÓN) */}
                    {(p.status === "En Propuesta" || p.status === "En Evaluación") && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setEvaluateProject(p)} 
                            className="h-8 w-8 text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 shrink-0"
                          >
                            <Scale className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-amber-950 border border-amber-700 text-amber-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                          ⚖️ Evaluar Puntos Anexo III Parte II
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* BOTÓN VER HISTORIAL DE ESTADOS */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setHistoryProject(p)} 
                          className="h-8 w-8 text-muted-foreground border-border hover:bg-muted shrink-0"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                        📜 Ver Historial de Cambios de Estado
                      </TooltipContent>
                    </Tooltip>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          /* VISTA EN TABLA / LISTA (SIN SELECT EN COLUMNA ESTADO) */
          <Card className="border-border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/70 text-muted-foreground font-bold border-b border-border uppercase">
                    <th className="p-3 w-28">Código</th>
                    <th className="p-3 w-64">Título del Proyecto</th>
                    <th className="p-3 w-40">Investigador</th>
                    <th className="p-3 w-20">Gestión</th>
                    <th className="p-3 w-44">Estado Institucional</th>
                    <th className="p-3 w-32">Presupuesto Bruto</th>
                    <th className="p-3 w-32">Retenciones</th>
                    <th className="p-3 w-24">Avance WBS</th>
                    <th className="p-3 text-center w-36">Acciones Operativas (3 Módulos)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredProjects.map((p) => {
                    const reqBudget = p.requestedBudget || p.grossBudget || 0;
                    const taxCat = p.taxCategory || 'servicios';
                    const taxInfo = calculateLey843Tax(reqBudget, taxCat);
                    return (
                      <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-primary">
                          {p.code}
                        </td>
                        <td className="p-3 font-bold text-foreground">
                          <div className="space-y-1">
                            <span className="line-clamp-2">{p.title}</span>
                            {p.status === "Cancelado" && p.cancellationReason && (
                              <p className="text-[10px] text-rose-400 italic font-normal line-clamp-1">
                                Motivo: {p.cancellationReason}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {p.leadInvestigator}
                        </td>
                        <td className="p-3 font-mono text-foreground font-semibold">
                          {p.managementYear}
                        </td>
                        {/* COLUMNA ESTADO INSTITUCIONAL: SOLO BADGE LIMPIO */}
                        <td className="p-3">
                          {renderStatusBadge(p.status)}
                        </td>
                        <td className="p-3 font-mono font-bold text-foreground">
                          Bs. {reqBudget.toLocaleString()}
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-500">
                          Bs. {taxInfo.totalTaxAmount.toLocaleString()}
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-500">
                          {p.wbsProgress}%
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setDetailProject(p)} 
                                  className="h-8 w-8 text-blue-400 hover:bg-blue-500/10"
                                >
                                  <FileText className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                                📄 1. Ver Detalle (Anexos I, II y III)
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setWbsProject(p)} 
                                  className="h-8 w-8 text-amber-500 hover:bg-amber-500/10"
                                >
                                  <Calendar className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                                📅 2. Cronograma WBS
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setBudgetProject(p)} 
                                  className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10"
                                >
                                  <FileSpreadsheet className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                                📊 3. Presupuesto & Retenciones
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setPdfProject(p)} 
                                  className="h-8 w-8 text-primary hover:bg-primary/20 bg-primary/10"
                                >
                                  <Printer className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                                🖨️ Documento PDF Oficial
                              </TooltipContent>
                            </Tooltip>

                            {p.status === "En Propuesta" && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setAssignProject(p)} 
                                    className="h-8 w-8 text-purple-400 hover:bg-purple-500/20 bg-purple-500/10"
                                  >
                                    <Users className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-purple-950 border border-purple-700 text-purple-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                                  👥 Designar Evaluadores
                                </TooltipContent>
                              </Tooltip>
                            )}

                            {(p.status === "En Propuesta" || p.status === "En Evaluación") && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setEvaluateProject(p)} 
                                    className="h-8 w-8 text-amber-400 hover:bg-amber-500/20 bg-amber-500/10"
                                  >
                                    <Scale className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-amber-950 border border-amber-700 text-amber-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                                  ⚖️ Evaluar Propuesta
                                </TooltipContent>
                              </Tooltip>
                            )}

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setHistoryProject(p)} 
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                                >
                                  <History className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold px-2.5 py-1.5 shadow-xl">
                                📜 Ver Historial de Cambios
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>

      {/* MODAL 1: VER DETALLE (CIENTÍFICO, ANEXO 1, 2 Y 3) */}
      <ProjectDetailModal 
        project={detailProject} 
        isOpen={!!detailProject} 
        onClose={() => setDetailProject(null)} 
        onUpdateStatus={(newStatus) => detailProject && handleStatusChange(detailProject.id, newStatus)}
      />

      {/* MODAL 2: CRONOGRAMA WBS */}
      <ProjectWbsModal 
        project={wbsProject} 
        isOpen={!!wbsProject} 
        onClose={() => setWbsProject(null)} 
        onUpdateStatus={(newStatus) => wbsProject && handleStatusChange(wbsProject.id, newStatus)}
      />

      {/* MODAL 3: PRESUPUESTO Y RETENCIONES */}
      <ProjectBudgetModal 
        project={budgetProject} 
        isOpen={!!budgetProject} 
        onClose={() => setBudgetProject(null)} 
        onUpdateStatus={(newStatus) => budgetProject && handleStatusChange(budgetProject.id, newStatus)}
      />

      {/* MODAL 4: CANCELACIÓN CON MOTIVO OBLIGATORIO */}
      <CancelProjectModal 
        project={cancelModalProject} 
        isOpen={!!cancelModalProject} 
        onClose={() => setCancelModalProject(null)}
        onConfirm={handleConfirmCancel} 
      />

      {/* MODAL 5: HISTORIAL DE CAMBIOS DE ESTADO */}
      <ProjectHistoryModal 
        project={historyProject} 
        isOpen={!!historyProject} 
        onClose={() => setHistoryProject(null)} 
      />

      {/* MODAL 6: DIAGRAMA DE FLUJO DE ESTADOS DEL PROYECTO */}
      <ProjectStatusFlowModal 
        isOpen={isFlowModalOpen} 
        onClose={() => setIsFlowModalOpen(false)} 
      />

      {/* MODAL 7: REGISTRAR NUEVA PROPUESTA INICIAL (REUSANDO VISTAS EXISTENTES) */}
      <InitialProposalModal
        isOpen={isNewProposalOpen}
        onClose={() => setIsNewProposalOpen(false)}
        onSave={handleSaveInitialProposal}
        existingCount={projects.length}
      />

      {/* MODAL 8: GENERADOR DE DOCUMENTO OFICIAL PAT UNITEPC (.PDF) */}
      {pdfProject && (
        <ProjectPdfGenerator
          isOpen={!!pdfProject}
          onClose={() => setPdfProject(null)}
          project={pdfProject}
        />
      )}

      {/* MODAL 9: DESIGNAR EVALUADORES DE COMITÉ (JEFE DE INVESTIGACIÓN) */}
      <AssignCommitteesModal
        isOpen={!!assignProject}
        onClose={() => setAssignProject(null)}
        project={assignProject}
        onAssign={handleAssignEvaluators}
      />

      {/* MODAL 10: EVALUACIÓN DE PUNTOS DEL ANEXO III PARTE II (MIEMBROS DE COMITÉ Y CONTABILIDAD) */}
      <EvaluateProposalModal
        isOpen={!!evaluateProject}
        onClose={() => setEvaluateProject(null)}
        project={evaluateProject}
        onSaveEvaluation={handleSaveEvaluation}
      />

      {/* TOAST ELEGANTE */}
      <ElegantToast toast={toast} onClose={() => setToast(null)} />
    </div>
  </TooltipProvider>
);
}
