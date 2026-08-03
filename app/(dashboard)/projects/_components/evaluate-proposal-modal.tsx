"use client";

import { useState } from "react";
import { 
  Scale, CheckCircle2, AlertTriangle, XCircle, X, 
  FileText, ShieldCheck, Calculator, MessageSquare, Award, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectItem } from "../page";

export type DictamenStatus = "APROBADO" | "PARCIALMENTE_APROBADO" | "RECHAZADO";

export interface PointEvaluation {
  id: number;
  title: string;
  contentSnippet: string;
  status: DictamenStatus;
  observation: string;
}

export interface EvaluateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem | null;
  evaluatorName?: string;
  evaluatorRole?: string;
  onSaveEvaluation: (
    projectId: string, 
    evaluations: PointEvaluation[], 
    overallNotes: string,
    evaluatorName: string,
    evaluatorRole: string
  ) => void;
}

export function EvaluateProposalModal({
  isOpen,
  onClose,
  project,
  evaluatorName = "Dr. Roberto Vargas Machuca",
  evaluatorRole = "Comité Científico / Evaluador Bioético",
  onSaveEvaluation,
}: EvaluateProposalModalProps) {
  const [evaluations, setEvaluations] = useState<PointEvaluation[]>([
    {
      id: 1,
      title: "1. Planteamiento del problema y definición del objeto de estudio",
      contentSnippet: project?.abstractText || "Formulación clara de la problemática científica, hipótesis de trabajo y objeto de estudio.",
      status: "APROBADO",
      observation: "",
    },
    {
      id: 2,
      title: "2. Justificación (Social, Académica y Administrativa/Contable)",
      contentSnippet: "Aporte científico institucional, utilidad práctica para UNITEPC y fundamentación contable.",
      status: "APROBADO",
      observation: "",
    },
    {
      id: 3,
      title: "3. Estado del arte",
      contentSnippet: "Revisión profunda de literatura de referencia indexada y antecedentes experimentales.",
      status: "APROBADO",
      observation: "",
    },
    {
      id: 4,
      title: "4. Objetivos (Objetivo General y Objetivos Específicos)",
      contentSnippet: "Respuesta al título del proyecto con verbos en infinitivo y metas medibles.",
      status: "APROBADO",
      observation: "",
    },
    {
      id: 5,
      title: "5. Metodología",
      contentSnippet: "Enfoque, tipo de investigación, diseño experimental, técnicas y fuentes de datos.",
      status: "APROBADO",
      observation: "",
    },
    {
      id: 6,
      title: "6. Resultados que se esperan",
      contentSnippet: "Productos entregables: Artículo científico original, prototipo o repositorio.",
      status: "APROBADO",
      observation: "",
    },
    {
      id: 7,
      title: "7. Impactos que se pretenden lograr",
      contentSnippet: "Impacto académico, visibilidad institucional y optimización de recursos.",
      status: "APROBADO",
      observation: "",
    },
    {
      id: 8,
      title: "8. Referencias bibliográficas (Formato APA 7ma Edición)",
      contentSnippet: "Citas académicas formalmente estructuradas en orden alfabético.",
      status: "APROBADO",
      observation: "",
    },
  ]);

  const [overallNotes, setOverallNotes] = useState("");

  if (!isOpen || !project) return null;

  const handleStatusChange = (pointId: number, status: DictamenStatus) => {
    setEvaluations(evaluations.map((p) => p.id === pointId ? { ...p, status } : p));
  };

  const handleObservationChange = (pointId: number, observation: string) => {
    setEvaluations(evaluations.map((p) => p.id === pointId ? { ...p, observation } : p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEvaluation(project.id, evaluations, overallNotes, evaluatorName, evaluatorRole);
    onClose();
  };

  const totalPoints = evaluations.length;
  const aprobadosCount = evaluations.filter((e) => e.status === "APROBADO").length;
  const parcialesCount = evaluations.filter((e) => e.status === "PARCIALMENTE_APROBADO").length;
  const rechazadosCount = evaluations.filter((e) => e.status === "RECHAZADO").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-3 overflow-y-auto">
      <div className="w-full max-w-[98vw] h-[96vh] bg-card text-card-foreground border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* CABECERA */}
        <div className="px-6 py-4 bg-muted/60 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-sm text-foreground">Evaluación de Propuesta — Anexo III Parte II</h3>
              <p className="text-xs text-muted-foreground">Evaluador: <strong className="text-foreground">{evaluatorName}</strong> ({evaluatorRole})</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* CONTENIDO DEL FORMULARIO DE EVALUACIÓN */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* FOTO E INFORMACIÓN DEL PROYECTO */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold">
                {project.code}
              </Badge>
              <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold">
                {project.status}
              </Badge>
            </div>
            <h4 className="font-bold text-sm text-foreground leading-snug">{project.title}</h4>
            <p className="text-xs text-muted-foreground">👤 Postulante: <strong className="text-foreground">{project.leadInvestigator}</strong> • {project.facultyArea}</p>
          </div>

          {/* RESUMEN VITAL DE RESULTADOS */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              <span>🟢 Aprobados: {aprobadosCount}/{totalPoints}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
              <span>🟡 Observados: {parcialesCount}/{totalPoints}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold">
              <span>🔴 Rechazados: {rechazadosCount}/{totalPoints}</span>
            </div>
          </div>

          {/* LISTA DE LOS 8 PUNTOS DE ANEXO III PARTE II */}
          <div className="space-y-4 pt-1">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5 border-b border-border pb-2">
              <FileText className="h-4 w-4 text-primary" />
              Dictamen Punto por Punto del Anexo III Parte II:
            </h4>

            {evaluations.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 rounded-xl border space-y-3 transition-all ${
                  item.status === "APROBADO" ? "bg-card border-border" :
                  item.status === "PARCIALMENTE_APROBADO" ? "bg-amber-500/5 border-amber-500/30" :
                  "bg-rose-500/5 border-rose-500/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h5 className="font-bold text-xs text-foreground">{item.title}</h5>
                  
                  {/* SELECTOR DE 3 ESTADOS */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant={item.status === "APROBADO" ? "default" : "outline"}
                      onClick={() => handleStatusChange(item.id, "APROBADO")}
                      className={`text-[11px] h-7 font-bold gap-1 ${
                        item.status === "APROBADO" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "text-muted-foreground"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Aprobado</span>
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant={item.status === "PARCIALMENTE_APROBADO" ? "default" : "outline"}
                      onClick={() => handleStatusChange(item.id, "PARCIALMENTE_APROBADO")}
                      className={`text-[11px] h-7 font-bold gap-1 ${
                        item.status === "PARCIALMENTE_APROBADO" ? "bg-amber-600 hover:bg-amber-700 text-white" : "text-muted-foreground"
                      }`}
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Parcial c/ Obs.</span>
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant={item.status === "RECHAZADO" ? "default" : "outline"}
                      onClick={() => handleStatusChange(item.id, "RECHAZADO")}
                      className={`text-[11px] h-7 font-bold gap-1 ${
                        item.status === "RECHAZADO" ? "bg-rose-600 hover:bg-rose-700 text-white" : "text-muted-foreground"
                      }`}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Rechazado</span>
                    </Button>
                  </div>
                </div>

                {/* EXTRACTO DEL CONTENIDO */}
                <p className="text-[11px] text-muted-foreground bg-muted/30 p-2 rounded-lg italic">
                  "{item.contentSnippet}"
                </p>

                {/* CAMPO DE OBSERVACIÓN ESPECÍFICA POR PUNTO */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> Observación específica del evaluador para este punto:
                  </label>
                  <input
                    type="text"
                    placeholder="Escriba aquí los comentarios o requerimientos de corrección para este apartado..."
                    value={item.observation}
                    onChange={(e) => handleObservationChange(item.id, e.target.value)}
                    className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* OBSERVACIÓN GENERAL / CONCLUSIÓN DEL DICTAMEN */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-foreground">Conclusión General del Dictamen Evaluador:</label>
            <textarea
              rows={3}
              placeholder="Ingrese las conclusiones finales o síntesis del dictamen del comité..."
              value={overallNotes}
              onChange={(e) => setOverallNotes(e.target.value)}
              className="w-full bg-background border border-input rounded-md p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* BOTONES DE ENVÍO */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-3 shrink-0">
            <Button type="button" variant="outline" onClick={onClose} className="font-semibold text-xs">
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-1.5 shadow">
              <ShieldCheck className="h-4 w-4" />
              <span>Finalizar y Emitir Dictamen Evaluador</span>
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}
