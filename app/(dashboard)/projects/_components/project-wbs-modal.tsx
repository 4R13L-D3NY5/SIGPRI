"use client";

import { useState, useEffect } from "react";
import { X, BarChart2, Edit3, Lock, Plus, Check, Trash2, Save, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProjectItem, ExactProjectStatus } from "../page";
import { getActiveUserRole, canEditProjectFields } from "@/lib/permission-utils";

export interface WbsTask {
  wbsCode: string;
  title: string;
  description: string;
  responsible: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: "COMPLETADO" | "EN_PROGRESO" | "PENDIENTE";
  startWeek: number; // 1 a 22
  endWeek: number;   // 1 a 22
  isParent?: boolean;
}

const DEFAULT_WBS_TASKS: WbsTask[] = [
  {
    wbsCode: "1.0",
    title: "Módulo de Recepción",
    description: "Diseño BD y Portal UI/UX",
    responsible: "Equipo Dev",
    startDate: "03-ago",
    endDate: "24-ago",
    progress: 35,
    status: "EN_PROGRESO",
    startWeek: 1,
    endWeek: 4,
    isParent: true,
  },
  {
    wbsCode: "1.1",
    title: "Diseño Base de Datos",
    description: "Estructuración de tablas relacionales y esquemas",
    responsible: "Desarrollador",
    startDate: "03-ago",
    endDate: "10-ago",
    progress: 60,
    status: "EN_PROGRESO",
    startWeek: 1,
    endWeek: 2,
  },
  {
    wbsCode: "1.2",
    title: "Portal Investigadores",
    description: "Envío y gestión interactiva de propuestas",
    responsible: "Desarrollador",
    startDate: "17-ago",
    endDate: "24-ago",
    progress: 55,
    status: "EN_PROGRESO",
    startWeek: 3,
    endWeek: 4,
  },
  {
    wbsCode: "2.0",
    title: "Módulo de Comités",
    description: "Evaluación Científico y Bioético",
    responsible: "Equipo Dev",
    startDate: "31-ago",
    endDate: "10-oct",
    progress: 50,
    status: "EN_PROGRESO",
    startWeek: 5,
    endWeek: 10,
    isParent: true,
  },
  {
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
  },
  {
    wbsCode: "2.2",
    title: "Flujo Bioético",
    description: "Validación de ética, bioseguridad y bioterio",
    responsible: "Desarrollador",
    startDate: "28-sep",
    endDate: "19-oct",
    progress: 70,
    status: "EN_PROGRESO",
    startWeek: 9,
    endWeek: 12,
  },
  {
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
  },
  {
    wbsCode: "3.1",
    title: "Cronograma",
    description: "Control de entregables e hitos parciales",
    responsible: "Desarrollador",
    startDate: "26-oct",
    endDate: "02-nov",
    progress: 60,
    status: "EN_PROGRESO",
    startWeek: 13,
    endWeek: 14,
  },
  {
    wbsCode: "3.2",
    title: "Artículo Original",
    description: "Módulo de entrega y verificación IMRyD",
    responsible: "Desarrollador",
    startDate: "09-nov",
    endDate: "16-nov",
    progress: 40,
    status: "EN_PROGRESO",
    startWeek: 15,
    endWeek: 16,
  },
  {
    wbsCode: "4.0",
    title: "Módulo Contable",
    description: "Presupuestos y Motor de Retenciones",
    responsible: "Equipo Dev",
    startDate: "23-nov",
    endDate: "14-dic",
    progress: 90,
    status: "EN_PROGRESO",
    startWeek: 17,
    endWeek: 20,
    isParent: true,
  },
  {
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
  },
  {
    wbsCode: "4.2",
    title: "Motor de Retenciones",
    description: "Cálculo automático de IUE/IT/RC-IVA",
    responsible: "Desarrollador",
    startDate: "14-dic",
    endDate: "14-dic",
    progress: 80,
    status: "EN_PROGRESO",
    startWeek: 19,
    endWeek: 20,
  },
  {
    wbsCode: "5.0",
    title: "Despliegue y QA",
    description: "Pruebas de integración y paso a producción",
    responsible: "Equipo Dev",
    startDate: "14-dic",
    endDate: "21-dic",
    progress: 20,
    status: "PENDIENTE",
    startWeek: 20,
    endWeek: 22,
    isParent: true,
  },
];

interface ProjectWbsModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (newStatus: ExactProjectStatus) => void;
}

export function ProjectWbsModal({ project, isOpen, onClose, onUpdateStatus }: ProjectWbsModalProps) {
  const [tasks, setTasks] = useState<WbsTask[]>(DEFAULT_WBS_TASKS);
  const [userRole, setUserRole] = useState<string>("admin");
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [isSavedToast, setIsSavedToast] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Formulario para Nueva Tarea WBS
  const [newTask, setNewTask] = useState<Partial<WbsTask>>({
    wbsCode: "1.3",
    title: "",
    description: "",
    responsible: "Docente Investigador",
    startDate: "01-sep",
    endDate: "30-sep",
    progress: 0,
    status: "PENDIENTE",
    startWeek: 5,
    endWeek: 8,
    isParent: false,
  });

  useEffect(() => {
    if (project) {
      const role = getActiveUserRole();
      setUserRole(role);
      setCanEdit(canEditProjectFields(role, project.status));
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const canManageStatus = userRole === "admin" || userRole === "jefe_investigador" || userRole === "comite";

  const handleTaskFieldChange = (wbsCode: string, field: keyof WbsTask, value: any) => {
    if (!canEdit) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.wbsCode === wbsCode) {
          const updated = { ...t, [field]: value };
          if (field === "progress") {
            const num = Number(value);
            updated.progress = Math.min(100, Math.max(0, num));
            updated.status = updated.progress >= 100 ? "COMPLETADO" : updated.progress > 0 ? "EN_PROGRESO" : "PENDIENTE";
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

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit || !newTask.title?.trim()) return;

    const created: WbsTask = {
      wbsCode: newTask.wbsCode || `${tasks.length + 1}.0`,
      title: newTask.title.trim(),
      description: newTask.description?.trim() || "Entregable del proyecto",
      responsible: newTask.responsible || "Investigador",
      startDate: newTask.startDate || "01-sep",
      endDate: newTask.endDate || "30-sep",
      progress: Number(newTask.progress) || 0,
      status: Number(newTask.progress) >= 100 ? "COMPLETADO" : Number(newTask.progress) > 0 ? "EN_PROGRESO" : "PENDIENTE",
      startWeek: Math.min(22, Math.max(1, Number(newTask.startWeek) || 1)),
      endWeek: Math.min(22, Math.max(Number(newTask.startWeek) || 1, Number(newTask.endWeek) || 4)),
      isParent: Boolean(newTask.isParent),
    };

    setTasks([...tasks, created]);
    setShowAddForm(false);
    setNewTask({
      wbsCode: `${tasks.length + 2}.0`,
      title: "",
      description: "",
      responsible: "Docente Investigador",
      startDate: "01-sep",
      endDate: "30-sep",
      progress: 0,
      status: "PENDIENTE",
      startWeek: 5,
      endWeek: 8,
      isParent: false,
    });
  };

  const handleDeleteTask = (wbsCode: string) => {
    if (!canEdit) return;
    setTasks((prev) => prev.filter((t) => t.wbsCode !== wbsCode));
  };

  const handleSaveCronograma = () => {
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2000);
  };

  // Promedio ponderado de avance acumulado
  const leafTasks = tasks.filter((t) => !t.isParent);
  const overallProgress = leafTasks.length > 0 
    ? Math.round(leafTasks.reduce((acc, t) => acc + t.progress, 0) / leafTasks.length)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-[98vw] bg-card text-card-foreground border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in duration-200">
        
        {/* HEADER DEL MODAL CON GESTIÓN DE ESTADO Y GUARDADO */}
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

              {canEdit ? (
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/40 text-emerald-500 font-bold flex items-center gap-1">
                  <Edit3 className="h-3 w-3" /> Modo Edición Habilitado
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-500/10 border-amber-500/40 text-amber-500 font-bold flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Modo Lectura (Protegido por Estado: {project.status})
                </Badge>
              )}
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Estructura WBS y Cronograma de Ejecución (22 Semanas)
            </h2>
            <p className="text-xs text-muted-foreground">
              Monitoreo ágil de hitos, fases del proyecto, avances porcentuales y asignación de responsables.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && (
              <>
                <Button size="sm" onClick={() => setShowAddForm(!showAddForm)} className="bg-primary hover:bg-primary/90 font-bold text-xs gap-1">
                  <Plus className="h-4 w-4" /> {showAddForm ? "Cerrar Formulario" : "+ Agregar Tarea WBS"}
                </Button>
                <Button size="sm" onClick={handleSaveCronograma} className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs gap-1">
                  <Save className="h-4 w-4" /> Guardar Cronograma
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-muted-foreground hover:text-foreground shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* TOAST DE CAMBIOS GUARDADOS */}
        {isSavedToast && (
          <div className="bg-emerald-500 text-white text-xs font-bold p-2 text-center flex items-center justify-center gap-2 shrink-0 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" /> ¡Cronograma y avance WBS guardados con éxito!
          </div>
        )}

        {/* FORMULARIO PARA AGREGAR TAREA WBS */}
        {canEdit && showAddForm && (
          <form onSubmit={handleAddTask} className="p-4 bg-primary/5 border-b border-primary/20 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground block">Código WBS</label>
              <Input
                value={newTask.wbsCode}
                onChange={(e) => setNewTask({ ...newTask, wbsCode: e.target.value })}
                placeholder="Ej. 1.3"
                className="h-8 text-xs bg-background font-mono font-bold"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-muted-foreground block">Título Tarea / Hito *</label>
              <Input
                required
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Ej. Pruebas de campo y laboratorio"
                className="h-8 text-xs bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground block">Responsable</label>
              <Input
                value={newTask.responsible}
                onChange={(e) => setNewTask({ ...newTask, responsible: e.target.value })}
                placeholder="Equipo Dev / Investigador"
                className="h-8 text-xs bg-background"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-muted-foreground block">Descripción</label>
              <Input
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Detalle conceptual de la actividad..."
                className="h-8 text-xs bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground block">Avance % Inicial</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={newTask.progress}
                onChange={(e) => setNewTask({ ...newTask, progress: Number(e.target.value) })}
                className="h-8 text-xs bg-background font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground block">Rango de Semanas (Gantt 1-22)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={22}
                  value={newTask.startWeek}
                  onChange={(e) => setNewTask({ ...newTask, startWeek: Number(e.target.value) })}
                  className="w-14 h-8 rounded border border-input bg-background text-center font-mono text-xs font-bold"
                />
                <span className="text-muted-foreground">a</span>
                <input
                  type="number"
                  min={1}
                  max={22}
                  value={newTask.endWeek}
                  onChange={(e) => setNewTask({ ...newTask, endWeek: Number(e.target.value) })}
                  className="w-14 h-8 rounded border border-input bg-background text-center font-mono text-xs font-bold"
                />
              </div>
            </div>

            <div className="sm:col-span-4 flex justify-end gap-2 pt-2">
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                Incorporar Tarea a WBS
              </Button>
            </div>
          </form>
        )}

        {/* TABLA PRINCIPAL Y GANTT DE 22 SEMANAS */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 bg-background">
          <table className="w-full text-left text-xs border-collapse min-w-[1200px]">
            <thead>
              <tr className="border-b border-border bg-muted/60 text-muted-foreground uppercase font-semibold">
                <th className="p-2.5 w-16">WBS</th>
                <th className="p-2.5 w-44">Título Tarea</th>
                <th className="p-2.5 w-56">Descripción</th>
                <th className="p-2.5 w-28">Responsable</th>
                <th className="p-2.5 w-28">Fechas</th>
                <th className="p-2.5 w-32">Avance %</th>
                <th className="p-2.5 w-24 text-center">Semanas (Gantt)</th>
                <th className="p-2.5 w-24">Estado</th>
                <th className="p-2.5 text-center">Visualizador Gantt (Semanas 1 a 22)</th>
                {canEdit && <th className="p-2.5 w-12 text-center">Acción</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {tasks.map((task) => {
                const isParent = task.isParent;
                return (
                  <tr
                    key={task.wbsCode}
                    className={`hover:bg-muted/40 transition-colors ${
                      isParent ? "bg-muted/50 font-bold text-foreground" : "text-foreground"
                    }`}
                  >
                    {/* CÓDIGO WBS EDITABLE */}
                    <td className="p-2.5 font-mono text-primary font-bold">
                      {canEdit ? (
                        <input
                          type="text"
                          value={task.wbsCode}
                          onChange={(e) => handleTaskFieldChange(task.wbsCode, "wbsCode", e.target.value)}
                          className="w-12 bg-background border border-input rounded px-1 text-xs font-mono font-bold text-primary"
                        />
                      ) : (
                        task.wbsCode
                      )}
                    </td>

                    {/* TÍTULO EDITABLE */}
                    <td className={`p-2.5 ${isParent ? "text-primary font-bold text-sm" : "pl-4 text-foreground"}`}>
                      {canEdit ? (
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) => handleTaskFieldChange(task.wbsCode, "title", e.target.value)}
                          className="w-full bg-background border border-input rounded px-1.5 py-0.5 text-xs font-bold text-foreground"
                        />
                      ) : (
                        task.title
                      )}
                    </td>

                    {/* DESCRIPCIÓN EDITABLE */}
                    <td className="p-2.5 text-muted-foreground">
                      {canEdit ? (
                        <input
                          type="text"
                          value={task.description}
                          onChange={(e) => handleTaskFieldChange(task.wbsCode, "description", e.target.value)}
                          className="w-full bg-background border border-input rounded px-1.5 py-0.5 text-xs text-muted-foreground"
                        />
                      ) : (
                        <span className="truncate block max-w-xs" title={task.description}>{task.description}</span>
                      )}
                    </td>

                    {/* RESPONSABLE EDITABLE */}
                    <td className="p-2.5 text-foreground">
                      {canEdit ? (
                        <input
                          type="text"
                          value={task.responsible}
                          onChange={(e) => handleTaskFieldChange(task.wbsCode, "responsible", e.target.value)}
                          className="w-full bg-background border border-input rounded px-1 py-0.5 text-xs text-foreground"
                        />
                      ) : (
                        task.responsible
                      )}
                    </td>

                    {/* FECHAS EDITABLES */}
                    <td className="p-2.5 text-muted-foreground font-mono text-[11px]">
                      {canEdit ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={task.startDate}
                            onChange={(e) => handleTaskFieldChange(task.wbsCode, "startDate", e.target.value)}
                            className="w-12 bg-background border border-input rounded px-1 text-[10px] font-mono"
                          />
                          <span>-</span>
                          <input
                            type="text"
                            value={task.endDate}
                            onChange={(e) => handleTaskFieldChange(task.wbsCode, "endDate", e.target.value)}
                            className="w-12 bg-background border border-input rounded px-1 text-[10px] font-mono"
                          />
                        </div>
                      ) : (
                        <span>{task.startDate} al {task.endDate}</span>
                      )}
                    </td>

                    {/* AVANCE % EDITABLE */}
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2 overflow-hidden border border-border">
                          <div
                            className={`h-full transition-all duration-300 ${
                              task.progress === 100
                                ? "bg-emerald-500"
                                : task.progress > 50
                                ? "bg-amber-500"
                                : "bg-primary"
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        {canEdit ? (
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={task.progress}
                            onChange={(e) => handleTaskFieldChange(task.wbsCode, "progress", e.target.value)}
                            className="font-mono text-foreground text-xs w-10 text-right font-bold bg-background border border-input rounded px-1"
                          />
                        ) : (
                          <span className="font-mono text-foreground text-xs w-8 text-right font-bold">
                            {task.progress}%
                          </span>
                        )}
                      </div>
                    </td>

                    {/* AJUSTE INTERACTIVO DE SEMANAS GANTT (STARTWEEK Y ENDWEEK) */}
                    <td className="p-2.5 text-center">
                      {canEdit ? (
                        <div className="flex items-center justify-center gap-1 font-mono text-[10px]">
                          <input
                            type="number"
                            min={1}
                            max={22}
                            value={task.startWeek}
                            onChange={(e) => handleTaskFieldChange(task.wbsCode, "startWeek", e.target.value)}
                            className="w-8 text-center bg-background border border-input rounded px-0.5 font-bold"
                            title="Semana Inicio"
                          />
                          <span>a</span>
                          <input
                            type="number"
                            min={1}
                            max={22}
                            value={task.endWeek}
                            onChange={(e) => handleTaskFieldChange(task.wbsCode, "endWeek", e.target.value)}
                            className="w-8 text-center bg-background border border-input rounded px-0.5 font-bold"
                            title="Semana Fin"
                          />
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-muted-foreground">
                          Sem. {task.startWeek}-{task.endWeek}
                        </span>
                      )}
                    </td>

                    {/* ESTADO BADGE */}
                    <td className="p-2.5">
                      {task.status === "COMPLETADO" && (
                        <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 bg-emerald-500/10 font-bold text-[10px]">
                          COMPLETADO
                        </Badge>
                      )}
                      {task.status === "EN_PROGRESO" && (
                        <Badge variant="outline" className="border-amber-500/40 text-amber-500 bg-amber-500/10 font-bold text-[10px]">
                          EN_PROGRESO
                        </Badge>
                      )}
                      {task.status === "PENDIENTE" && (
                        <Badge variant="outline" className="border-border text-muted-foreground bg-muted font-bold text-[10px]">
                          PENDIENTE
                        </Badge>
                      )}
                    </td>

                    {/* GANTT BARS (22 SEMANAS ADAPTABLES) */}
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

                    {/* ELIMINAR TAREA */}
                    {canEdit && (
                      <td className="p-2.5 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.wbsCode)}
                          className="h-7 w-7 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full"
                          title="Eliminar tarea WBS"
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
            {canEdit && (
              <Button size="sm" onClick={handleSaveCronograma} className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs gap-1">
                <Save className="h-4 w-4" /> Guardar Cronograma
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose} className="border-border text-foreground hover:bg-muted font-bold">
              Cerrar Cronograma
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
