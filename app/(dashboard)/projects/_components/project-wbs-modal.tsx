"use client";

import { useState, useEffect } from "react";
import { 
  X, BarChart2, Edit3, Lock, Plus, Trash2, Save, CheckCircle2, 
  CornerDownRight, Layers, History, Calendar, User, FileText, Send, 
  MessageSquare, Clock, ShieldCheck, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProjectItem, ExactProjectStatus } from "../page";
import { getActiveUserRole, canEditProjectFields, canUpdateWeeklyProgress } from "@/lib/permission-utils";
import { generateProjectWbsPdfReport } from "@/lib/print-wbs-report";

export interface WeeklyProgressEntry {
  id: string;
  registeredAt: string; // YYYY-MM-DD HH:mm
  previousProgress: number;
  newProgress: number;
  registeredBy: string;
  userRole: string;
  observation: string;
}

export interface WbsTask {
  id: string;
  wbsCode: string;
  title: string;
  description: string;
  responsible: string;
  startDate: string;
  endDate: string;
  progress: number; // 0, 25, 50, 75, 100
  status: "COMPLETADO" | "EN_PROGRESO" | "PENDIENTE";
  startWeek: number; // 1 a 22
  endWeek: number;   // 1 a 22
  isParent: boolean;
  parentId?: string;
  weeklyHistory?: WeeklyProgressEntry[];
}

const INITIAL_WBS_TASKS: WbsTask[] = [
  {
    id: "wbs-1",
    wbsCode: "1.0",
    title: "Módulo de Recepción",
    description: "Diseño BD y Portal UI/UX",
    responsible: "Equipo Dev",
    startDate: "03-ago",
    endDate: "24-ago",
    progress: 50,
    status: "EN_PROGRESO",
    startWeek: 1,
    endWeek: 4,
    isParent: true,
    weeklyHistory: [
      {
        id: "wh-101",
        registeredAt: "2026-08-10 09:30",
        previousProgress: 0,
        newProgress: 25,
        registeredBy: "Dra. Maria Lorena Orellana Aguilar",
        userRole: "Investigador Responsable",
        observation: "Inicio de diagramación de entidad-relación y maquetación preliminar de vistas de recepción.",
      },
      {
        id: "wh-102",
        registeredAt: "2026-08-17 14:15",
        previousProgress: 25,
        newProgress: 50,
        registeredBy: "Dra. Maria Lorena Orellana Aguilar",
        userRole: "Investigador Responsable",
        observation: "Finalizada la creación de esquemas SQL en la base de datos de pruebas.",
      },
    ],
  },
  {
    id: "wbs-1-1",
    parentId: "wbs-1",
    wbsCode: "1.1",
    title: "Diseño Base de Datos",
    description: "Estructuración de tablas relacionales y esquemas",
    responsible: "Desarrollador",
    startDate: "03-ago",
    endDate: "10-ago",
    progress: 75,
    status: "EN_PROGRESO",
    startWeek: 1,
    endWeek: 2,
    isParent: false,
    weeklyHistory: [
      {
        id: "wh-111",
        registeredAt: "2026-08-10 11:00",
        previousProgress: 25,
        newProgress: 75,
        registeredBy: "Dra. Maria Lorena Orellana Aguilar",
        userRole: "Investigador Responsable",
        observation: "Tablas de usuarios y proyectos migradas y probadas exitosamente.",
      },
    ],
  },
  {
    id: "wbs-1-2",
    parentId: "wbs-1",
    wbsCode: "1.2",
    title: "Portal Investigadores",
    description: "Envío y gestión interactiva de propuestas",
    responsible: "Desarrollador",
    startDate: "17-ago",
    endDate: "24-ago",
    progress: 50,
    status: "EN_PROGRESO",
    startWeek: 3,
    endWeek: 4,
    isParent: false,
    weeklyHistory: [],
  },
  {
    id: "wbs-2",
    wbsCode: "2.0",
    title: "Módulo de Comités",
    description: "Evaluación Científico y Bioético",
    responsible: "Equipo Dev",
    startDate: "31-ago",
    endDate: "10-oct",
    progress: 75,
    status: "EN_PROGRESO",
    startWeek: 5,
    endWeek: 10,
    isParent: true,
    weeklyHistory: [
      {
        id: "wh-201",
        registeredAt: "2026-09-07 16:45",
        previousProgress: 0,
        newProgress: 50,
        registeredBy: "Dra. Maria Lorena Orellana Aguilar",
        userRole: "Investigador Responsable",
        observation: "Integración de flujo de revisión por pares y plantilla de informes de suficiencia.",
      },
      {
        id: "wh-202",
        registeredAt: "2026-09-21 10:00",
        previousProgress: 50,
        newProgress: 75,
        registeredBy: "Dra. Maria Lorena Orellana Aguilar",
        userRole: "Investigador Responsable",
        observation: "Pruebas de dictamen bioético completadas con 15 docentes evaluadores.",
      },
    ],
  },
  {
    id: "wbs-2-1",
    parentId: "wbs-2",
    wbsCode: "2.1",
    title: "Flujo Científico",
    description: "Revisión por pares, aprobación e informes",
    responsible: "Desarrollador",
    startDate: "31-ago",
    endDate: "21-sep",
    progress: 100,
    status: "COMPLETADO",
    startWeek: 5,
    endWeek: 8,
    isParent: false,
    weeklyHistory: [
      {
        id: "wh-211",
        registeredAt: "2026-09-21 17:00",
        previousProgress: 75,
        newProgress: 100,
        registeredBy: "Dra. Maria Lorena Orellana Aguilar",
        userRole: "Investigador Responsable",
        observation: "Entregable completado al 100%. Módulo validado por el Comité Científico DICYT.",
      },
    ],
  },
  {
    id: "wbs-2-2",
    parentId: "wbs-2",
    wbsCode: "2.2",
    title: "Flujo Bioético",
    description: "Validación de ética, bioseguridad y bioterio",
    responsible: "Desarrollador",
    startDate: "28-sep",
    endDate: "19-oct",
    progress: 75,
    status: "EN_PROGRESO",
    startWeek: 9,
    endWeek: 12,
    isParent: false,
    weeklyHistory: [],
  },
  {
    id: "wbs-3",
    wbsCode: "3.0",
    title: "Módulo de Avances",
    description: "Seguimiento dinámico y entregable final",
    responsible: "Equipo Dev",
    startDate: "26-oct",
    endDate: "16-nov",
    progress: 50,
    status: "EN_PROGRESO",
    startWeek: 13,
    endWeek: 16,
    isParent: true,
    weeklyHistory: [],
  },
  {
    id: "wbs-3-1",
    parentId: "wbs-3",
    wbsCode: "3.1",
    title: "Cronograma",
    description: "Control de entregables e hitos parciales",
    responsible: "Desarrollador",
    startDate: "26-oct",
    endDate: "02-nov",
    progress: 50,
    status: "EN_PROGRESO",
    startWeek: 13,
    endWeek: 14,
    isParent: false,
    weeklyHistory: [],
  },
  {
    id: "wbs-3-2",
    parentId: "wbs-3",
    wbsCode: "3.2",
    title: "Artículo Original",
    description: "Módulo de entrega y verificación IMRyD",
    responsible: "Desarrollador",
    startDate: "09-nov",
    endDate: "16-nov",
    progress: 25,
    status: "EN_PROGRESO",
    startWeek: 15,
    endWeek: 16,
    isParent: false,
    weeklyHistory: [],
  },
  {
    id: "wbs-4",
    wbsCode: "4.0",
    title: "Módulo Contable",
    description: "Presupuestos y Motor de Retenciones",
    responsible: "Equipo Dev",
    startDate: "23-nov",
    endDate: "14-dic",
    progress: 75,
    status: "EN_PROGRESO",
    startWeek: 17,
    endWeek: 20,
    isParent: true,
    weeklyHistory: [],
  },
  {
    id: "wbs-4-1",
    parentId: "wbs-4",
    wbsCode: "4.1",
    title: "Cotizaciones",
    description: "Carga y validación de costos y préstamos",
    responsible: "Desarrollador",
    startDate: "23-nov",
    endDate: "30-nov",
    progress: 100,
    status: "COMPLETADO",
    startWeek: 17,
    endWeek: 18,
    isParent: false,
    weeklyHistory: [],
  },
  {
    id: "wbs-4-2",
    parentId: "wbs-4",
    wbsCode: "4.2",
    title: "Motor de Retenciones",
    description: "Cálculo automático de IUE/IT/RC-IVA",
    responsible: "Desarrollador",
    startDate: "14-dic",
    endDate: "14-dic",
    progress: 75,
    status: "EN_PROGRESO",
    startWeek: 19,
    endWeek: 20,
    isParent: false,
    weeklyHistory: [],
  },
  {
    id: "wbs-5",
    wbsCode: "5.0",
    title: "Despliegue y QA",
    description: "Pruebas de integración y paso a producción",
    responsible: "Equipo Dev",
    startDate: "14-dic",
    endDate: "21-dic",
    progress: 0,
    status: "PENDIENTE",
    startWeek: 20,
    endWeek: 22,
    isParent: true,
    weeklyHistory: [],
  },
];

const PROGRESS_STEPS = [0, 25, 50, 75, 100];

interface ProjectWbsModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (newStatus: ExactProjectStatus) => void;
}

export function ProjectWbsModal({ project, isOpen, onClose, onUpdateStatus }: ProjectWbsModalProps) {
  const [tasks, setTasks] = useState<WbsTask[]>(INITIAL_WBS_TASKS);
  const [userRole, setUserRole] = useState<string>("admin");
  const [canEditStructure, setCanEditStructure] = useState<boolean>(true);
  const [canWeeklyTrack, setCanWeeklyTrack] = useState<boolean>(true);
  const [isSavedToast, setIsSavedToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  // Estado para el modal de bitácora semanal por tarea
  const [selectedTaskHistory, setSelectedTaskHistory] = useState<WbsTask | null>(null);

  // Estado temporal de observaciones por tarea (id -> texto)
  const [observationsMap, setObservationsMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      const role = getActiveUserRole();
      setUserRole(role);
      setCanEditStructure(canEditProjectFields(role, project.status));
      setCanWeeklyTrack(canUpdateWeeklyProgress(role, project.status));
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const canManageStatus = userRole === "admin" || userRole === "jefe_investigador" || userRole === "comite";

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
    return { name: project.leadInvestigator || "Investigador Responsable", roleLabel: userRole === "admin" ? "Administrador DICYT" : "Investigador Responsable" };
  };

  const recalculateWbsCodes = (list: WbsTask[]): WbsTask[] => {
    let parentNum = 0;
    let currentParentId = "";
    let subNum = 0;

    return list.map((t) => {
      if (t.isParent) {
        parentNum += 1;
        currentParentId = t.id;
        subNum = 0;
        return {
          ...t,
          wbsCode: `${parentNum}.0`,
        };
      } else {
        subNum += 1;
        return {
          ...t,
          parentId: t.parentId || currentParentId,
          wbsCode: parentNum > 0 ? `${parentNum}.${subNum}` : `1.${subNum}`,
        };
      }
    });
  };

  const handleAddDirectRow = () => {
    if (!canEditStructure) return;

    const lastTask = tasks[tasks.length - 1];
    const isNewParent = !lastTask || !lastTask.isParent;

    const newId = `wbs-new-${Date.now()}`;
    const newTaskRow: WbsTask = {
      id: newId,
      wbsCode: "0.0",
      title: "Nueva Tarea / Hito WBS",
      description: "Descripción del entregable o actividad",
      responsible: project.leadInvestigator || "Investigador",
      startDate: "01-sep",
      endDate: "30-sep",
      progress: 0,
      status: "PENDIENTE",
      startWeek: 5,
      endWeek: 8,
      isParent: isNewParent,
      weeklyHistory: [],
    };

    const updatedList = recalculateWbsCodes([...tasks, newTaskRow]);
    setTasks(updatedList);
  };

  const handleToggleTaskType = (id: string) => {
    if (!canEditStructure) return;

    const updatedList = tasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          isParent: !t.isParent,
        };
      }
      return t;
    });

    setTasks(recalculateWbsCodes(updatedList));
  };

  const handleUpdateTaskField = (id: string, field: keyof WbsTask, value: any) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, [field]: value };
          
          if (field === "progress") {
            const num = Number(value);
            updated.progress = num;
            updated.status = num >= 100 ? "COMPLETADO" : num > 0 ? "EN_PROGRESO" : "PENDIENTE";
          }

          if (field === "startWeek" || field === "endWeek") {
            updated.startWeek = Math.min(22, Math.max(1, Number(updated.startWeek)));
            updated.endWeek = Math.min(22, Math.max(updated.startWeek, Number(updated.endWeek)));
          }

          return updated;
        }
        return t;
      })
    );
  };

  // REGISTRAR AVANCE SEMANAL Y OBLIGATORIO REGISTRO EN BITÁCORA CON FECHA Y AUTOR
  const handleRegisterWeeklyProgress = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const user = getCurrentUser();
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const observationText = observationsMap[taskId]?.trim() || "Actualización de avance semanal sin observaciones adicionales.";

    const historyEntry: WeeklyProgressEntry = {
      id: `wh-${Date.now()}`,
      registeredAt: nowStr,
      previousProgress: task.progress,
      newProgress: task.progress,
      registeredBy: user.name || project.leadInvestigator,
      userRole: user.roleLabel || (userRole === "admin" ? "Administrador DICYT" : "Investigador Responsable"),
      observation: observationText,
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            weeklyHistory: [historyEntry, ...(t.weeklyHistory || [])],
          };
        }
        return t;
      })
    );

    // Limpiar campo de observación temporal
    setObservationsMap((prev) => ({ ...prev, [taskId]: "" }));

    // Mostrar Toast de éxito
    setToastMessage(`¡Seguimiento semanal registrado con éxito para "${task.title}"!`);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleDeleteTask = (id: string) => {
    if (!canEditStructure) return;
    const remaining = tasks.filter((t) => t.id !== id);
    setTasks(recalculateWbsCodes(remaining));
  };

  const handleSaveCronograma = () => {
    setToastMessage("¡Cronograma WBS e hitos de ejecución guardados con éxito!");
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  const leafTasks = tasks.filter((t) => !t.isParent);
  const overallProgress = leafTasks.length > 0 
    ? Math.round(leafTasks.reduce((acc, t) => acc + t.progress, 0) / leafTasks.length)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-[98vw] bg-card text-card-foreground border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] animate-in fade-in zoom-in duration-200">
        
        {/* HEADER DEL MODAL CON ESTADO Y PERMISOS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-muted/40 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold">
                {project.code}
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-bold">
                {overallProgress}% Avance Global
              </Badge>

              {/* GESTIÓN DE ESTADO DENTRO DEL MODAL */}
              {canManageStatus && onUpdateStatus ? (
                <div className="flex items-center gap-1.5 bg-background border border-input p-1 rounded-md shadow-sm">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Estado:</span>
                  <select
                    value={project.status}
                    onChange={(e) => onUpdateStatus(e.target.value as ExactProjectStatus)}
                    className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="En Propuesta">1. En Propuesta</option>
                    <option value="En Evaluación">2. En Evaluación</option>
                    <option value="En Observación (Rechazado con opción a corrección)">3. En Observación</option>
                    <option value="Aprobado en Ejecución">4. Aprobado en Ejecución</option>
                    <option value="Concluido">5. Concluido</option>
                    <option value="Publicado">6. Publicado</option>
                    <option value="Cancelado">7. Cancelado</option>
                  </select>
                </div>
              ) : (
                <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 font-bold">
                  {project.status}
                </Badge>
              )}

              {/* PERMISOS DE SEGUIMIENTO SEMANAL VS ESTRUCTURA */}
              {canWeeklyTrack && (
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/40 text-emerald-500 font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Módulo de Seguimiento Semanal Habilitado
                </Badge>
              )}

              {canEditStructure ? (
                <Badge variant="outline" className="bg-primary/10 border-primary/40 text-primary font-bold flex items-center gap-1">
                  <Edit3 className="h-3 w-3" /> Edición de Estructura Habilitada
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-500/10 border-amber-500/40 text-amber-500 font-bold flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Estructura Congelada en Ejecución
                </Badge>
              )}
            </div>

            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Estructura WBS y Seguimiento Semanal de Ejecución (22 Semanas)
            </h2>
            <p className="text-xs text-muted-foreground">
              El Investigador Responsable y Administrador registran cada semana el porcentaje de avance, observaciones y bitácora de seguimiento con fecha y hora.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => generateProjectWbsPdfReport(project, tasks)}
              className="font-bold text-xs gap-1.5 border-primary/40 text-primary bg-primary/10 hover:bg-primary/20 shadow-sm"
              title="Generar e imprimir el Informe Oficial de Estado y Progreso del Proyecto en PDF"
            >
              <FileText className="h-4 w-4 text-primary" /> Exportar Informe PDF
            </Button>
            {canEditStructure && (
              <Button 
                size="sm" 
                onClick={handleAddDirectRow} 
                className="bg-primary hover:bg-primary/90 font-bold text-xs gap-1.5 shadow-sm"
                title="Añadir una nueva fila editable a la tabla"
              >
                <Plus className="h-4 w-4" /> + Agregar Tarea WBS
              </Button>
            )}
            {(canEditStructure || canWeeklyTrack) && (
              <Button 
                size="sm" 
                onClick={handleSaveCronograma} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
              >
                <Save className="h-4 w-4" /> Guardar Cronograma
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-muted-foreground hover:text-foreground shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* TOAST DE CONFIRMACIÓN */}
        {isSavedToast && (
          <div className="bg-emerald-500 text-white text-xs font-bold p-2.5 text-center flex items-center justify-center gap-2 shrink-0 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" /> {toastMessage}
          </div>
        )}

        {/* TABLA PRINCIPAL EDITABLE Y CON MÓDULO DE SEGUIMIENTO SEMANAL */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 bg-background">
          <table className="w-full text-left text-xs border-collapse min-w-[1450px]">
            <thead>
              <tr className="border-b border-border bg-muted/60 text-muted-foreground uppercase font-bold text-[11px]">
                <th className="p-2.5 w-20 text-center">TIPO / WBS</th>
                <th className="p-2.5 w-56">Título Tarea / Hito</th>
                <th className="p-2.5 w-52">Descripción</th>
                <th className="p-2.5 w-32">Responsable</th>
                <th className="p-2.5 w-28 text-center">Fechas (Inicio - Fin)</th>
                <th className="p-2.5 w-44 text-center">Avance % (0, 25, 50, 75, 100)</th>
                <th className="p-2.5 w-64 text-center">Seguimiento Semanal & Observación</th>
                <th className="p-2.5 w-28 text-center">Bitácora Semanal</th>
                <th className="p-2.5 w-20 text-center">Semanas</th>
                <th className="p-2.5 text-center">Visualizador Gantt (Semanas 1 a 22)</th>
                {canEditStructure && <th className="p-2.5 w-12 text-center">Acción</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {tasks.map((task) => {
                const isParent = task.isParent;
                const historyCount = task.weeklyHistory?.length || 0;
                const currentObs = observationsMap[task.id] || "";

                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-muted/40 transition-colors ${
                      isParent ? "bg-primary/5 font-bold border-l-4 border-l-primary" : "text-foreground"
                    }`}
                  >
                    {/* TIPO (PRINCIPAL / SUBTAREA) Y CÓDIGO WBS */}
                    <td className="p-2 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {canEditStructure ? (
                          <button
                            onClick={() => handleToggleTaskType(task.id)}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold flex items-center gap-0.5 uppercase transition-all ${
                              isParent
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                            }`}
                            title="Haz clic para alternar entre Tarea Principal (ej. 1.0) y Subtarea (ej. 1.1)"
                          >
                            {isParent ? <Layers className="h-3 w-3" /> : <CornerDownRight className="h-3 w-3" />}
                            <span>{isParent ? "Principal" : "Subtarea"}</span>
                          </button>
                        ) : (
                          <Badge variant="outline" className={`text-[9px] font-extrabold ${isParent ? "bg-primary/10 text-primary border-primary/30" : "text-muted-foreground"}`}>
                            {isParent ? "Principal" : "Subtarea"}
                          </Badge>
                        )}
                        <span className="font-mono text-xs font-black text-primary">{task.wbsCode}</span>
                      </div>
                    </td>

                    {/* TÍTULO DE TAREA */}
                    <td className="p-2">
                      <div className={`flex items-center gap-1.5 ${!isParent ? "pl-3" : ""}`}>
                        {!isParent && <CornerDownRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                        {canEditStructure ? (
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) => handleUpdateTaskField(task.id, "title", e.target.value)}
                            placeholder="Título de la tarea..."
                            className={`w-full bg-background border border-input rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary ${
                              isParent ? "font-bold text-primary text-sm" : "font-semibold text-foreground"
                            }`}
                          />
                        ) : (
                          <span className={isParent ? "font-bold text-primary text-sm" : "font-semibold text-foreground"}>
                            {task.title}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* DESCRIPCIÓN */}
                    <td className="p-2">
                      {canEditStructure ? (
                        <input
                          type="text"
                          value={task.description}
                          onChange={(e) => handleUpdateTaskField(task.id, "description", e.target.value)}
                          placeholder="Detalle del entregable..."
                          className="w-full bg-background border border-input rounded px-2 py-1 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs">{task.description}</span>
                      )}
                    </td>

                    {/* RESPONSABLE */}
                    <td className="p-2">
                      {canEditStructure ? (
                        <input
                          type="text"
                          value={task.responsible}
                          onChange={(e) => handleUpdateTaskField(task.id, "responsible", e.target.value)}
                          placeholder="Responsable..."
                          className="w-full bg-background border border-input rounded px-2 py-1 text-xs text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      ) : (
                        <span className="text-foreground text-xs font-semibold">{task.responsible}</span>
                      )}
                    </td>

                    {/* FECHAS */}
                    <td className="p-2 text-center">
                      {canEditStructure ? (
                        <div className="flex items-center justify-center gap-1 font-mono text-[10px]">
                          <input
                            type="text"
                            value={task.startDate}
                            onChange={(e) => handleUpdateTaskField(task.id, "startDate", e.target.value)}
                            placeholder="03-ago"
                            className="w-13 bg-background border border-input rounded px-1 py-0.5 text-center font-mono text-xs text-foreground"
                          />
                          <span className="text-muted-foreground">-</span>
                          <input
                            type="text"
                            value={task.endDate}
                            onChange={(e) => handleUpdateTaskField(task.id, "endDate", e.target.value)}
                            placeholder="24-ago"
                            className="w-13 bg-background border border-input rounded px-1 py-0.5 text-center font-mono text-xs text-foreground"
                          />
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-muted-foreground">{task.startDate} - {task.endDate}</span>
                      )}
                    </td>

                    {/* SELECTOR / SCROLL DE AVANCE % (0%, 25%, 50%, 75%, 100%) */}
                    <td className="p-2 text-center">
                      {(canEditStructure || canWeeklyTrack) ? (
                        <div className="flex flex-col items-center gap-1">
                          <select
                            value={task.progress}
                            onChange={(e) => handleUpdateTaskField(task.id, "progress", Number(e.target.value))}
                            className="bg-background border border-primary/40 rounded px-2 py-1 text-xs font-mono font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer w-full text-center"
                          >
                            {PROGRESS_STEPS.map((val) => (
                              <option key={val} value={val}>{val}%</option>
                            ))}
                          </select>
                          
                          <div className="flex items-center justify-center gap-1 text-[9px] font-mono">
                            {PROGRESS_STEPS.map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleUpdateTaskField(task.id, "progress", val)}
                                className={`px-1 py-0.2 rounded transition-colors ${
                                  task.progress === val
                                    ? "bg-primary text-primary-foreground font-bold"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground">{task.progress}%</span>
                        </div>
                      )}
                    </td>

                    {/* MÓDULO DE REGISTRO DE SEGUIMIENTO SEMANAL CON OBSERVACIÓN Y FECHA */}
                    <td className="p-2">
                      {canWeeklyTrack ? (
                        <div className="space-y-1">
                          <textarea
                            value={currentObs}
                            onChange={(e) => setObservationsMap({ ...observationsMap, [task.id]: e.target.value })}
                            placeholder="Escriba la observación semanal..."
                            rows={1}
                            className="w-full bg-background border border-input rounded p-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-tight resize-none"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleRegisterWeeklyProgress(task.id)}
                            className="w-full h-6 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 py-0 shadow-sm"
                            title="Registrar esta actualización en la bitácora semanal con fecha y hora"
                          >
                            <Send className="h-3 w-3" /> Registrar Avance Semanal
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic block text-center">
                          Solo en Ejecución
                        </span>
                      )}
                    </td>

                    {/* BOTÓN BITÁCORA SEMANAL (VER HISTORIAL DE OBSERVACIONES CON FECHAS) */}
                    <td className="p-2 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTaskHistory(task)}
                        className={`h-7 px-2 text-[10px] font-bold gap-1 ${
                          historyCount > 0
                            ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                            : "text-muted-foreground border-border"
                        }`}
                        title="Ver bitácora semanal de observaciones y registros con fecha"
                      >
                        <History className="h-3 w-3" />
                        <span>({historyCount}) Ver</span>
                      </Button>
                    </td>

                    {/* RANGOS DE SEMANAS GANTT (1 A 22) */}
                    <td className="p-2 text-center">
                      {canEditStructure ? (
                        <div className="flex items-center justify-center gap-1 font-mono text-[10px]">
                          <input
                            type="number"
                            min={1}
                            max={22}
                            value={task.startWeek}
                            onChange={(e) => handleUpdateTaskField(task.id, "startWeek", e.target.value)}
                            className="w-7 text-center bg-background border border-input rounded py-0.5 font-bold"
                          />
                          <span>-</span>
                          <input
                            type="number"
                            min={1}
                            max={22}
                            value={task.endWeek}
                            onChange={(e) => handleUpdateTaskField(task.id, "endWeek", e.target.value)}
                            className="w-7 text-center bg-background border border-input rounded py-0.5 font-bold"
                          />
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-muted-foreground">{task.startWeek}-{task.endWeek}</span>
                      )}
                    </td>

                    {/* VISUALIZADOR GANTT DE 22 SEMANAS */}
                    <td className="p-2">
                      <div className="grid grid-cols-22 gap-1 h-6 items-center">
                        {Array.from({ length: 22 }).map((_, wIdx) => {
                          const weekNum = wIdx + 1;
                          const isActiveWeek = weekNum >= task.startWeek && weekNum <= task.endWeek;
                          return (
                            <div
                              key={weekNum}
                              title={`Semana ${weekNum}: ${task.title} (${task.progress}%)`}
                              className={`h-4 rounded-sm transition-colors ${
                                isActiveWeek
                                  ? task.status === "COMPLETADO"
                                    ? "bg-emerald-500 shadow-sm"
                                    : "bg-amber-500 shadow-sm"
                                  : "bg-muted/40 border border-border/50"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </td>

                    {/* ELIMINAR FILA */}
                    {canEditStructure && (
                      <td className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.id)}
                          className="h-7 w-7 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full"
                          title="Eliminar esta tarea WBS"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* FOOTER DEL MODAL */}
        <div className="flex items-center justify-between p-4 bg-muted/40 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-500 inline-block" /> Tarea Completada</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-500 inline-block" /> En Ejecución</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-muted border border-border inline-block" /> Semana Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => generateProjectWbsPdfReport(project, tasks)}
              className="font-bold text-xs gap-1.5 border-primary/40 text-primary bg-primary/10 hover:bg-primary/20 shadow-sm"
            >
              <FileText className="h-4 w-4 text-primary" /> Exportar Informe PDF
            </Button>
            {canEditStructure && (
              <Button size="sm" onClick={handleAddDirectRow} className="bg-primary hover:bg-primary/90 font-bold text-xs gap-1">
                <Plus className="h-4 w-4" /> + Agregar Tarea WBS
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose} className="border-border text-foreground hover:bg-muted font-bold">
              Cerrar Cronograma
            </Button>
          </div>
        </div>

      </div>

      {/* SUB-MODAL: BITÁCORA HISTÓRICA DE SEGUIMIENTO SEMANAL DE LA TAREA */}
      {selectedTaskHistory && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold">
                    WBS {selectedTaskHistory.wbsCode}
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold">
                    {selectedTaskHistory.progress}% Avance Actual
                  </Badge>
                </div>
                <h3 className="font-bold text-base text-foreground mt-1 flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Bitácora de Seguimiento Semanal: {selectedTaskHistory.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Historial cronológico de observaciones, fechas, porcentaje de avance y usuarios autores.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedTaskHistory(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {!selectedTaskHistory.weeklyHistory || selectedTaskHistory.weeklyHistory.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground space-y-2 border border-dashed border-border rounded-lg">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="font-semibold text-foreground">No se registran observaciones semanales anteriores para esta tarea.</p>
                  <p>El Investigador Responsable o Administrador puede registrar comentarios y avances en la tabla de ejecución.</p>
                </div>
              ) : (
                selectedTaskHistory.weeklyHistory.map((entry) => (
                  <div key={entry.id} className="p-4 rounded-xl bg-muted/30 border border-border space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-primary" />
                          {entry.registeredBy}
                        </span>
                        <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary font-bold text-[10px]">
                          {entry.userRole}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-muted-foreground text-[11px]">
                        <Clock className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{entry.registeredAt}</span>
                      </div>
                    </div>

                    <p className="text-foreground leading-relaxed italic bg-background/50 p-2.5 rounded border border-border/40">
                      "{entry.observation}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-muted-foreground">Avance Registrado:</span>
                      <span className="font-mono font-bold text-primary">
                        {entry.previousProgress}% ➔ {entry.newProgress}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-border shrink-0">
              <Button size="sm" variant="outline" onClick={() => setSelectedTaskHistory(null)} className="font-bold text-xs">
                Cerrar Bitácora
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
