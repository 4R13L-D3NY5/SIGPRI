"use client";

import { CheckCircle2, XCircle, AlertCircle, ArrowRight, ShieldCheck, FileText, Calendar, DollarSign, ListChecks, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateProposalCompletion, ProposalCheckitem } from "@/lib/proposal-completion-utils";

interface ProposalChecklistModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection: (sectionKey: string) => void;
}

export function ProposalChecklistModal({
  project,
  isOpen,
  onClose,
  onNavigateToSection,
}: ProposalChecklistModalProps) {
  if (!isOpen || !project) return null;

  const status = calculateProposalCompletion(project);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER DEL MODAL */}
        <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs font-bold bg-primary/10 text-primary border-primary/30">
                {project.code || project.codigo}
              </Badge>
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                Estado de Completitud de la Propuesta
              </h3>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {project.title || project.titulo}
            </p>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* BARRA DE PROGRESO GLOBAL */}
        <div className="p-6 bg-muted/10 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">
              Progreso General de Postulación
            </span>
            <span className={`font-mono text-sm font-extrabold ${status.isReady ? "text-emerald-500" : "text-amber-500"}`}>
              {status.completedCount} de {status.totalCount} Requisitos ({status.percentage}%)
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-border">
            <div
              className={`h-full transition-all duration-500 ${
                status.isReady ? "bg-emerald-500" : status.percentage >= 60 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${status.percentage}%` }}
            />
          </div>

          {status.isReady ? (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>¡La propuesta cumple con todos los 5 requisitos y está lista para ser presentada formalmente!</span>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Pendiente completar {status.totalCount - status.completedCount} requisito(s) antes del cierre de convocatoria.</span>
            </div>
          )}
        </div>

        {/* LISTA DE LOS 5 CRITERIOS REQUERIDOS */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Verificación Meticula de los 5 Puntos Oficiales UNITEPC
          </h4>

          <div className="space-y-3">
            {status.items.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  item.isCompleted
                    ? "bg-card border-border/80 hover:border-emerald-500/40"
                    : "bg-amber-500/5 border-amber-500/30"
                }`}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {item.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                    )}
                    <span className="font-bold text-sm text-foreground">{item.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">{item.description}</p>
                  <span className={`text-[11px] font-medium pl-6 block ${item.isCompleted ? "text-emerald-500" : "text-amber-500 font-bold"}`}>
                    {item.missingNote}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant={item.isCompleted ? "outline" : "default"}
                  onClick={() => {
                    onNavigateToSection(item.actionKey);
                    onClose();
                  }}
                  className={`shrink-0 text-xs font-bold gap-1 ${
                    item.isCompleted ? "text-muted-foreground hover:text-foreground" : "bg-primary text-primary-foreground shadow-sm"
                  }`}
                >
                  <span>{item.isCompleted ? "Revisar" : "Completar"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER DEL MODAL */}
        <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Normativa DICYT - Validación de Postulación de Proyectos
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="font-bold ml-auto text-xs">
            Cerrar Ficha de Validación
          </Button>
        </div>

      </div>
    </div>
  );
}
