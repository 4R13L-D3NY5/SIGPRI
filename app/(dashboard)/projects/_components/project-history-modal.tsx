"use client";

import { useState } from "react";
import { X, History, User, Clock, Calendar, ArrowRight, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectItem, StatusHistoryEntry, ExactProjectStatus } from "../page";

interface ProjectHistoryModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectHistoryModal({ project, isOpen, onClose }: ProjectHistoryModalProps) {
  if (!isOpen || !project) return null;

  const historyList = project.statusHistory || [];

  const renderMiniBadge = (st: ExactProjectStatus) => {
    switch (st) {
      case "En Propuesta":
        return <Badge variant="outline" className="border-blue-500/40 text-blue-400 bg-blue-500/10 font-bold text-[10px]">📝 En Propuesta</Badge>;
      case "En Evaluación":
        return <Badge variant="outline" className="border-indigo-500/40 text-indigo-400 bg-indigo-500/10 font-bold text-[10px]">🔍 En Evaluación</Badge>;
      case "En Observación (Rechazado con opción a corrección)":
        return <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10 font-bold text-[10px]">⚠️ En Observación</Badge>;
      case "Aprobado en Ejecución":
        return <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 font-bold text-[10px]">🚀 En Ejecución</Badge>;
      case "Concluido":
        return <Badge variant="outline" className="border-purple-500/40 text-purple-400 bg-purple-500/10 font-bold text-[10px]">🏁 Concluido</Badge>;
      case "Publicado":
        return <Badge variant="outline" className="border-teal-500/40 text-teal-400 bg-teal-500/10 font-bold text-[10px]">📚 Publicado</Badge>;
      case "Cancelado":
        return <Badge variant="outline" className="border-rose-500/40 text-rose-400 bg-rose-500/10 font-bold text-[10px]">🚫 Cancelado</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{st}</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-card text-card-foreground border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-150">
        
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between p-4 bg-muted/40 border-b border-border">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono bg-primary/10 text-primary border-primary/30 font-bold text-[10px]">
                {project.code}
              </Badge>
              <Badge variant="outline" className="text-[10px]">Gestión {project.managementYear}</Badge>
            </div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Historial de Cambios de Estado y Auditoría
            </h3>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* CONTENIDO HISTORIAL */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-background">
          <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-1">
            <span className="font-bold text-xs text-foreground block truncate">{project.title}</span>
            <p className="text-[11px] text-muted-foreground">
              Investigador: <strong className="text-foreground">{project.leadInvestigator}</strong>
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                Bitácora Cronológica de Auditoría ({historyList.length} registros)
              </h4>
            </div>

            {historyList.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                No hay registros de cambios de estado previos.
              </div>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {historyList.map((entry, idx) => (
                  <div key={entry.id || idx} className="relative space-y-1.5 bg-card border border-border p-3.5 rounded-xl shadow-sm">
                    {/* INDICADOR TIMELINE */}
                    <div className="absolute -left-6 top-3.5 h-3.5 w-3.5 rounded-full bg-primary border-2 border-background" />

                    {/* CABECERA REGISTRO: FECHA & USUARIO */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border/50 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <User className="h-3.5 w-3.5 text-primary" />
                        <span>{entry.changedBy}</span>
                        <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/30 font-bold">
                          {entry.userRole}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{entry.changedAt}</span>
                      </div>
                    </div>

                    {/* TRANSICIÓN DE ESTADOS */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground">Estado Anterior:</span>
                      {renderMiniBadge(entry.previousStatus as ExactProjectStatus)}
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Estado Nuevo:</span>
                      {renderMiniBadge(entry.newStatus as ExactProjectStatus)}
                    </div>

                    {/* NOTAS O MOTIVOS SI EXISTEN */}
                    {entry.notes && (
                      <p className="text-xs italic bg-muted/40 p-2 rounded border border-border/60 text-muted-foreground mt-1">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-muted/40 border-t border-border flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar Historial
          </Button>
        </div>

      </div>
    </div>
  );
}
