"use client";

import { useState, useEffect } from "react";
import { 
  X, GitFork, ArrowRight, ArrowLeft, RotateCcw, Play, Pause, 
  CheckCircle2, AlertTriangle, FileText, UserCheck, ShieldCheck, 
  Award, Ban, Sparkles, Info, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface FlowStep {
  stepIndex: number;
  activeNodeId: string;
  activeEdgeId: string;
  title: string;
  subtitle: string;
  description: string;
  responsibleRole: string;
  canEdit: string;
  decisionNote?: string;
}

const FLOW_SCENARIOS = [
  {
    id: "happy_path",
    name: "🟢 Ruta Principal (Aprobación y Publicación)",
    steps: [
      {
        stepIndex: 0,
        activeNodeId: "propuesta",
        activeEdgeId: "",
        title: "Paso 1: Elaboración y Envío de la Propuesta",
        subtitle: "Estado: 1. En Propuesta",
        description: "El Investigador redacta la propuesta, estructura los Anexos 1, 2 y 3, configura el cronograma WBS y desglosa los rubros con retenciones impositivas.",
        responsibleRole: "Investigador Autor / Jefe Investigador",
        canEdit: "Habilitada (Investigador y Admin)",
      },
      {
        stepIndex: 1,
        activeNodeId: "evaluacion",
        activeEdgeId: "e1",
        title: "Paso 2: Evaluación Multidisciplinaria",
        subtitle: "Estado: 2. En Evaluación",
        description: "La propuesta es revisada en paralelo por el Comité Científico (metodología), Comité Bioético (ética) y Contabilidad (validación impositiva).",
        responsibleRole: "Comités Evaluadores y Contabilidad",
        canEdit: "Bloqueada para Investigador (En Revisión)",
      },
      {
        stepIndex: 2,
        activeNodeId: "ejecucion",
        activeEdgeId: "e2",
        title: "Paso 3: Dictamen Favorable y Aprobación",
        subtitle: "Estado: 4. Aprobado en Ejecución",
        description: "El proyecto obtiene puntaje aprobatorio (>80/100). Se emite la resolución DICYT, se autoriza el desembolso y se activa el seguimiento del cronograma WBS.",
        responsibleRole: "DICYT / Contabilidad",
        canEdit: "Edición financiera por Contabilidad",
      },
      {
        stepIndex: 3,
        activeNodeId: "concluido",
        activeEdgeId: "e3",
        title: "Paso 4: Conclusión de Actividades y Entregables",
        subtitle: "Estado: 5. Concluido",
        description: "Se completa el 100% del cronograma WBS. El investigador entrega el informe final y la versión borrador del Artículo Científico Original IMRyD.",
        responsibleRole: "Investigador / Comité Evaluador",
        canEdit: "Verificación de Entregables",
      },
      {
        stepIndex: 4,
        activeNodeId: "publicado",
        activeEdgeId: "e4",
        title: "Paso 5: Publicación e Indexación Científica",
        subtitle: "Estado: 6. Publicado",
        description: "Hito final exitoso. El artículo es publicado en revista indexada con DOI oficial o registrado como transferencia tecnológica institucional.",
        responsibleRole: "DICYT / Universidad",
        canEdit: "Fase Final Alcanzada",
      },
    ],
  },
  {
    id: "observation_path",
    name: "🟡 Ruta de Observación (Revisión y Corrección)",
    steps: [
      {
        stepIndex: 0,
        activeNodeId: "propuesta",
        activeEdgeId: "",
        title: "Paso 1: Envío de Propuesta",
        subtitle: "Estado: 1. En Propuesta",
        description: "El proyecto se remite por el investigador a la Dirección de Investigación.",
        responsibleRole: "Investigador Autor",
        canEdit: "Edición Abierta",
      },
      {
        stepIndex: 1,
        activeNodeId: "evaluacion",
        activeEdgeId: "e1",
        title: "Paso 2: Evaluación por Comités",
        subtitle: "Estado: 2. En Evaluación",
        description: "El Comité Científico detecta observaciones metodológicas o presupuestarias.",
        responsibleRole: "Comité Evaluador",
        canEdit: "Bloqueada para Investigador",
      },
      {
        stepIndex: 2,
        activeNodeId: "observacion",
        activeEdgeId: "e5",
        title: "Paso 3: Notificación de Observaciones",
        subtitle: "Estado: 3. En Observación",
        description: "Se devuelve el expediente al Investigador con notas explícitas para subsanar deficiencias en un plazo determinado.",
        responsibleRole: "Investigador / Comité",
        canEdit: "Reabierta para Investigador",
        decisionNote: "⚠️ El Investigador subsana y vuelve a enviar a Evaluación (retorno a Paso 2).",
      },
      {
        stepIndex: 3,
        activeNodeId: "evaluacion",
        activeEdgeId: "e6",
        title: "Paso 4: Reevaluación de Correcciones",
        subtitle: "Estado: 2. En Evaluación (Revisión 2)",
        description: "Los comités verifican que las observaciones hayan sido subsanadas satisfactoriamente.",
        responsibleRole: "Comités Evaluadores",
        canEdit: "En Revisión",
      },
      {
        stepIndex: 4,
        activeNodeId: "ejecucion",
        activeEdgeId: "e2",
        title: "Paso 5: Aprobación y Ejecución",
        subtitle: "Estado: 4. Aprobado en Ejecución",
        description: "Validación final aprobada. El proyecto pasa a ejecución activa.",
        responsibleRole: "DICYT / Investigador",
        canEdit: "Ejecución Activa",
      },
    ],
  },
  {
    id: "cancel_path",
    name: "🔴 Ruta de Cancelación (Rechazo con Auditoría)",
    steps: [
      {
        stepIndex: 0,
        activeNodeId: "propuesta",
        activeEdgeId: "",
        title: "Paso 1: Envío Inicial",
        subtitle: "Estado: 1. En Propuesta",
        description: "Carga del proyecto por el investigador.",
        responsibleRole: "Investigador",
        canEdit: "Edición Abierta",
      },
      {
        stepIndex: 1,
        activeNodeId: "evaluacion",
        activeEdgeId: "e1",
        title: "Paso 2: Evaluación Técnica y Financiera",
        subtitle: "Estado: 2. En Evaluación",
        description: "Revisión institucional por comités y contabilidad.",
        responsibleRole: "Comités",
        canEdit: "En Revisión",
      },
      {
        stepIndex: 2,
        activeNodeId: "cancelado",
        activeEdgeId: "e7",
        title: "Paso 3: Cancelación Definitiva",
        subtitle: "Estado: 7. Cancelado",
        description: "Se rechaza definitivamente la propuesta por falta de requisitos o inviabilidad. Se graba el motivo obligatorio en la bitácora de auditoría.",
        responsibleRole: "Comité / Administrador",
        canEdit: "Cierre de Expediente",
        decisionNote: "🚫 Se requiere justificación de cancelación por escrito.",
      },
    ],
  },
];

interface ProjectStatusFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectStatusFlowModal({ isOpen, onClose }: ProjectStatusFlowModalProps) {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number>(0);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const scenario = FLOW_SCENARIOS[selectedScenarioIdx];
  const step = scenario.steps[currentStepIdx] || scenario.steps[0];

  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [selectedScenarioIdx]);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= scenario.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, scenario]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIdx < scenario.steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const isNodeActive = (nodeId: string) => step.activeNodeId === nodeId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-[96vw] max-h-[96vh] bg-card text-card-foreground border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* HEADER DEL MODAL */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-muted/40 border-b border-border shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary font-bold flex items-center gap-1">
                <GitFork className="h-3.5 w-3.5" /> Diagrama Interactivo Mermaid / SVG
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold">
                Simulador de Pasos
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Diagrama de Flujo del Ciclo de Vida del Proyecto
            </h2>
            <p className="text-xs text-muted-foreground">
              Utilice los controles de paso a paso para observar la secuencia de estados, decisiones y roles autorizados.
            </p>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-muted-foreground hover:text-foreground shrink-0 self-start sm:self-center">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* SELECTOR DE ESCENARIOS Y PANEL DE CONTROL */}
        <div className="p-4 bg-muted/20 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">Escenario:</span>
            <select
              value={selectedScenarioIdx}
              onChange={(e) => setSelectedScenarioIdx(Number(e.target.value))}
              className="bg-background border border-input rounded-lg px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-auto cursor-pointer"
            >
              {FLOW_SCENARIOS.map((sc, idx) => (
                <option key={sc.id} value={idx}>{sc.name}</option>
              ))}
            </select>
          </div>

          {/* CONTROLES DE REPRODUCCIÓN Y PASO A PASO */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs font-semibold gap-1"
              title="Reiniciar al inicio"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={currentStepIdx === 0}
              onClick={handlePrev}
              className="text-xs font-bold gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Anterior</span>
            </Button>

            <Button
              size="sm"
              disabled={currentStepIdx >= scenario.steps.length - 1}
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-1.5 shadow"
            >
              <span>Paso Siguiente</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`text-xs font-bold gap-1 ${isPlaying ? "text-amber-400 bg-amber-500/10" : "text-emerald-400 hover:bg-emerald-500/10"}`}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isPlaying ? "Pausar" : "Auto Play"}</span>
            </Button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL: CANVAS SVG MERMAID + DETALLES DE PASO */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-background flex flex-col justify-between">
          
          {/* CANVAS SVG ESTILO MERMAID FLOWCHART */}
          <div className="w-full bg-card border border-border/80 rounded-xl p-4 shadow-inner overflow-x-auto relative flex justify-center items-center min-h-[320px]">
            <svg viewBox="0 0 920 360" className="w-full max-w-[900px] h-auto font-sans">
              <defs>
                {/* Marcadores de Flechas */}
                <marker id="arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                </marker>
                <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                </marker>
                <marker id="arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                </marker>
                <marker id="arrow-emerald" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
                <marker id="arrow-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                </marker>

                {/* Filtro Glow para Estado Activo */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* CONECTORES Y FLECHAS ENTRE NODOS */}

              {/* e1: Propuesta ➔ Evaluación */}
              <path
                d="M 170 120 L 260 120"
                stroke={step.activeEdgeId === "e1" ? "#3b82f6" : "#475569"}
                strokeWidth={step.activeEdgeId === "e1" ? "3.5" : "2"}
                strokeDasharray={step.activeEdgeId === "e1" ? "6 3" : "none"}
                markerEnd={step.activeEdgeId === "e1" ? "url(#arrow-active)" : "url(#arrow-default)"}
                className="transition-all duration-300"
              />

              {/* e2: Evaluación ➔ Aprobado en Ejecución */}
              <path
                d="M 430 120 L 520 120"
                stroke={step.activeEdgeId === "e2" ? "#10b981" : "#475569"}
                strokeWidth={step.activeEdgeId === "e2" ? "3.5" : "2"}
                strokeDasharray={step.activeEdgeId === "e2" ? "6 3" : "none"}
                markerEnd={step.activeEdgeId === "e2" ? "url(#arrow-emerald)" : "url(#arrow-default)"}
                className="transition-all duration-300"
              />

              {/* e3: Ejecución ➔ Concluido */}
              <path
                d="M 670 120 L 760 120"
                stroke={step.activeEdgeId === "e3" ? "#818cf8" : "#475569"}
                strokeWidth={step.activeEdgeId === "e3" ? "3.5" : "2"}
                strokeDasharray={step.activeEdgeId === "e3" ? "6 3" : "none"}
                markerEnd={step.activeEdgeId === "e3" ? "url(#arrow-active)" : "url(#arrow-default)"}
                className="transition-all duration-300"
              />

              {/* e4: Concluido ➔ Publicado */}
              <path
                d="M 820 160 L 820 250"
                stroke={step.activeEdgeId === "e4" ? "#2dd4bf" : "#475569"}
                strokeWidth={step.activeEdgeId === "e4" ? "3.5" : "2"}
                strokeDasharray={step.activeEdgeId === "e4" ? "6 3" : "none"}
                markerEnd={step.activeEdgeId === "e4" ? "url(#arrow-active)" : "url(#arrow-default)"}
                className="transition-all duration-300"
              />

              {/* e5: Evaluación ➔ Observación (Abajo) */}
              <path
                d="M 345 160 L 345 250"
                stroke={step.activeEdgeId === "e5" ? "#f59e0b" : "#475569"}
                strokeWidth={step.activeEdgeId === "e5" ? "3.5" : "2"}
                strokeDasharray={step.activeEdgeId === "e5" ? "6 3" : "none"}
                markerEnd={step.activeEdgeId === "e5" ? "url(#arrow-amber)" : "url(#arrow-default)"}
                className="transition-all duration-300"
              />

              {/* e6: Observación ➔ Retorno a Evaluación (Diagonal subida) */}
              <path
                d="M 280 270 L 280 160"
                stroke={step.activeEdgeId === "e6" ? "#3b82f6" : "#475569"}
                strokeWidth={step.activeEdgeId === "e6" ? "3.5" : "2"}
                strokeDasharray={step.activeEdgeId === "e6" ? "6 3" : "none"}
                markerEnd={step.activeEdgeId === "e6" ? "url(#arrow-active)" : "url(#arrow-default)"}
                className="transition-all duration-300"
              />

              {/* e7: Evaluación ➔ Cancelado (Diagonal abajo a la derecha) */}
              <path
                d="M 400 160 L 560 250"
                stroke={step.activeEdgeId === "e7" ? "#f43f5e" : "#475569"}
                strokeWidth={step.activeEdgeId === "e7" ? "3.5" : "2"}
                strokeDasharray={step.activeEdgeId === "e7" ? "6 3" : "none"}
                markerEnd={step.activeEdgeId === "e7" ? "url(#arrow-rose)" : "url(#arrow-default)"}
                className="transition-all duration-300"
              />

              {/* ------------ NODOS DEL DIAGRAMA ------------ */}

              {/* NODO 1: EN PROPUESTA */}
              <g transform="translate(30, 80)">
                <rect
                  x="0" y="0" width="140" height="80" rx="12"
                  fill={isNodeActive("propuesta") ? "#1e3a8a" : "#1e293b"}
                  stroke={isNodeActive("propuesta") ? "#3b82f6" : "#334155"}
                  strokeWidth={isNodeActive("propuesta") ? "3" : "1.5"}
                  filter={isNodeActive("propuesta") ? "url(#glow)" : undefined}
                />
                <text x="70" y="32" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">1. En Propuesta</text>
                <text x="70" y="52" textAnchor="middle" fill="#cbd5e1" fontSize="9">Elaboración inicial</text>
              </g>

              {/* NODO 2: EN EVALUACIÓN */}
              <g transform="translate(260, 80)">
                <rect
                  x="0" y="0" width="170" height="80" rx="12"
                  fill={isNodeActive("evaluacion") ? "#4c1d95" : "#1e293b"}
                  stroke={isNodeActive("evaluacion") ? "#a855f7" : "#334155"}
                  strokeWidth={isNodeActive("evaluacion") ? "3" : "1.5"}
                  filter={isNodeActive("evaluacion") ? "url(#glow)" : undefined}
                />
                <text x="85" y="32" textAnchor="middle" fill="#c084fc" fontSize="11" fontWeight="bold">2. En Evaluación</text>
                <text x="85" y="52" textAnchor="middle" fill="#cbd5e1" fontSize="9">Comités & Contabilidad</text>
              </g>

              {/* NODO 3: EN OBSERVACIÓN */}
              <g transform="translate(240, 250)">
                <rect
                  x="0" y="0" width="180" height="80" rx="12"
                  fill={isNodeActive("observacion") ? "#78350f" : "#1e293b"}
                  stroke={isNodeActive("observacion") ? "#f59e0b" : "#334155"}
                  strokeWidth={isNodeActive("observacion") ? "3" : "1.5"}
                  filter={isNodeActive("observacion") ? "url(#glow)" : undefined}
                />
                <text x="90" y="32" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">3. En Observación</text>
                <text x="90" y="52" textAnchor="middle" fill="#cbd5e1" fontSize="9">Opción a corrección</text>
              </g>

              {/* NODO 4: APROBADO EN EJECUCIÓN */}
              <g transform="translate(520, 80)">
                <rect
                  x="0" y="0" width="150" height="80" rx="12"
                  fill={isNodeActive("ejecucion") ? "#064e3b" : "#1e293b"}
                  stroke={isNodeActive("ejecucion") ? "#10b981" : "#334155"}
                  strokeWidth={isNodeActive("ejecucion") ? "3" : "1.5"}
                  filter={isNodeActive("ejecucion") ? "url(#glow)" : undefined}
                />
                <text x="75" y="32" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">4. Aprobado Ejecución</text>
                <text x="75" y="52" textAnchor="middle" fill="#cbd5e1" fontSize="9">Desembolso y WBS</text>
              </g>

              {/* NODO 5: CONCLUIDO */}
              <g transform="translate(760, 80)">
                <rect
                  x="0" y="0" width="120" height="80" rx="12"
                  fill={isNodeActive("concluido") ? "#312e81" : "#1e293b"}
                  stroke={isNodeActive("concluido") ? "#818cf8" : "#334155"}
                  strokeWidth={isNodeActive("concluido") ? "3" : "1.5"}
                  filter={isNodeActive("concluido") ? "url(#glow)" : undefined}
                />
                <text x="60" y="32" textAnchor="middle" fill="#a5b4fc" fontSize="11" fontWeight="bold">5. Concluido</text>
                <text x="60" y="52" textAnchor="middle" fill="#cbd5e1" fontSize="9">Artículo entregado</text>
              </g>

              {/* NODO 6: PUBLICADO */}
              <g transform="translate(760, 250)">
                <rect
                  x="0" y="0" width="120" height="80" rx="12"
                  fill={isNodeActive("publicado") ? "#134e4a" : "#1e293b"}
                  stroke={isNodeActive("publicado") ? "#2dd4bf" : "#334155"}
                  strokeWidth={isNodeActive("publicado") ? "3" : "1.5"}
                  filter={isNodeActive("publicado") ? "url(#glow)" : undefined}
                />
                <text x="60" y="32" textAnchor="middle" fill="#2dd4bf" fontSize="11" fontWeight="bold">6. Publicado</text>
                <text x="60" y="52" textAnchor="middle" fill="#cbd5e1" fontSize="9">DOI e Indexado</text>
              </g>

              {/* NODO 7: CANCELADO */}
              <g transform="translate(540, 250)">
                <rect
                  x="0" y="0" width="140" height="80" rx="12"
                  fill={isNodeActive("cancelado") ? "#881337" : "#1e293b"}
                  stroke={isNodeActive("cancelado") ? "#f43f5e" : "#334155"}
                  strokeWidth={isNodeActive("cancelado") ? "3" : "1.5"}
                  filter={isNodeActive("cancelado") ? "url(#glow)" : undefined}
                />
                <text x="70" y="32" textAnchor="middle" fill="#fda4af" fontSize="11" fontWeight="bold">7. Cancelado</text>
                <text x="70" y="52" textAnchor="middle" fill="#cbd5e1" fontSize="9">Baja con Auditoría</text>
              </g>

            </svg>
          </div>

          {/* TARJETA INFORMATIVA DEL PASO ACTUAL EN LA SIMULACIÓN */}
          <Card className="border-2 border-primary/40 bg-primary/5 shadow-md">
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/20 pb-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground font-mono font-bold text-xs">
                    Paso {currentStepIdx + 1} de {scenario.steps.length}
                  </Badge>
                  <h3 className="font-bold text-base text-foreground">{step.title}</h3>
                </div>
                <Badge variant="outline" className="border-primary/40 text-primary bg-background font-bold text-xs w-fit">
                  {step.subtitle}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                {step.description}
              </p>

              {step.decisionNote && (
                <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{step.decisionNote}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-2.5 rounded bg-card border border-border space-y-0.5">
                  <span className="text-muted-foreground font-semibold block">Responsable de Acción / Rol:</span>
                  <span className="font-bold text-primary">{step.responsibleRole}</span>
                </div>
                <div className="p-2.5 rounded bg-card border border-border space-y-0.5">
                  <span className="text-muted-foreground font-semibold block">Permisos de Edición en este Paso:</span>
                  <span className="font-bold text-emerald-400">{step.canEdit}</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* FOOTER DEL MODAL */}
        <div className="flex items-center justify-between p-4 bg-muted/40 border-t border-border shrink-0">
          <span className="text-xs text-muted-foreground">
            Diagrama de Flujo Estándar Mermaid - Dirección de Investigación Científica y Tecnológica (UNITEPC)
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="font-bold">
            Cerrar Flujo
          </Button>
        </div>

      </div>
    </div>
  );
}
