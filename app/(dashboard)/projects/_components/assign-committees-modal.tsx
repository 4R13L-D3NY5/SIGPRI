"use client";

import { useState } from "react";
import { 
  Users, CheckCircle2, X, ShieldAlert, Award, UserCheck, 
  Calculator, Sparkles, CheckSquare, Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectItem } from "../page";

export interface CommitteeEvaluatorOption {
  id: string;
  name: string;
  ci: string;
  role: string;
  committeeType: "Científico" | "Bioético" | "Contabilidad";
}

export interface AssignCommitteesModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem | null;
  onAssign: (projectId: string, assignedEvaluators: CommitteeEvaluatorOption[]) => void;
}

export const DEFAULT_EVALUATOR_POOL: CommitteeEvaluatorOption[] = [
  {
    id: "eval-1",
    name: "Dr. Roberto Vargas Machuca",
    ci: "4891234",
    role: "Presidente Comité Científico",
    committeeType: "Científico",
  },
  {
    id: "eval-2",
    name: "Dra. Carmen Rosa Morales Arispe",
    ci: "5123987",
    role: "Secretaria Académica / Evaluación Bioética",
    committeeType: "Bioético",
  },
  {
    id: "eval-3",
    name: "Dr. Gonzalo Fernández Terán",
    ci: "3987123",
    role: "Vocal Evaluador Bioético",
    committeeType: "Bioético",
  },
  {
    id: "eval-4",
    name: "Lic. Javier Mercado Rivas",
    ci: "6543210",
    role: "Jefe de Fiscalización Presupuestaria y Contabilidad",
    committeeType: "Contabilidad",
  },
];

export function AssignCommitteesModal({
  isOpen,
  onClose,
  project,
  onAssign,
}: AssignCommitteesModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return DEFAULT_EVALUATOR_POOL.map((e) => e.id);
  });

  if (!isOpen || !project) return null;

  const toggleEvaluator = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    setSelectedIds(DEFAULT_EVALUATOR_POOL.map((e) => e.id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      alert("Por favor seleccione al menos un miembro de comité o contabilidad para evaluar la propuesta.");
      return;
    }
    const chosenEvaluators = DEFAULT_EVALUATOR_POOL.filter((e) => selectedIds.includes(e.id));
    onAssign(project.id, chosenEvaluators);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* CABECERA */}
        <div className="px-6 py-4 bg-muted/60 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-bold text-sm text-foreground">Designar Evaluadores de Comités</h3>
              <p className="text-xs text-muted-foreground">Jefe de Investigación: Asignación de pares evaluadores y fiscalización contable</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* CUERPO */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* DETALLES DE LA PROPUESTA */}
          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold">
                {project.code}
              </Badge>
              <span className="font-mono text-muted-foreground">{project.managementYear}</span>
            </div>
            <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-2">{project.title}</h4>
            <p className="text-xs text-muted-foreground">👤 Postulante: <strong className="text-foreground">{project.leadInvestigator}</strong></p>
          </div>

          {/* BARRA DE ACCIÓN RÁPIDA */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-emerald-500" />
              Seleccionar Miembros Evaluadores ({selectedIds.length}/{DEFAULT_EVALUATOR_POOL.length}):
            </span>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleSelectAll} className="text-[11px] h-7 font-semibold">
                Seleccionar Todos
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleDeselectAll} className="text-[11px] h-7 text-muted-foreground">
                Limpiar
              </Button>
            </div>
          </div>

          {/* LISTA DE EVALUADORES DISPONIBLES */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {DEFAULT_EVALUATOR_POOL.map((evaluator) => {
              const isSelected = selectedIds.includes(evaluator.id);
              return (
                <div
                  key={evaluator.id}
                  onClick={() => toggleEvaluator(evaluator.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected 
                      ? "bg-primary/10 border-primary/40 shadow-sm" 
                      : "bg-muted/30 border-border hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <CheckSquare className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                      <Square className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <div>
                      <h5 className="font-bold text-xs text-foreground flex items-center gap-2">
                        {evaluator.name}
                        <Badge variant="outline" className={`text-[9px] font-bold ${
                          evaluator.committeeType === "Científico" ? "bg-blue-500/10 border-blue-500/30 text-blue-400" :
                          evaluator.committeeType === "Bioético" ? "bg-purple-500/10 border-purple-500/30 text-purple-400" :
                          "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        }`}>
                          Comité {evaluator.committeeType}
                        </Badge>
                      </h5>
                      <p className="text-[11px] text-muted-foreground">{evaluator.role} • C.I. {evaluator.ci}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PIE DE PÁGINA Y BOTÓN DE GUARDADO */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="font-semibold text-xs">
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-1.5 shadow">
              <CheckCircle2 className="h-4 w-4" />
              <span>Confirmar Asignación de Evaluadores</span>
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
