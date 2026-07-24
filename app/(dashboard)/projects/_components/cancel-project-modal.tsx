"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CancelProjectModalProps {
  isOpen: boolean;
  projectTitle: string;
  projectCode: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function CancelProjectModal({
  isOpen,
  projectTitle,
  projectCode,
  onClose,
  onConfirm,
}: CancelProjectModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("El motivo de cancelación es obligatorio.");
      return;
    }
    onConfirm(reason.trim());
    setReason("");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <Card className="w-full max-w-lg bg-card text-card-foreground border-rose-500/40 shadow-2xl animate-in fade-in zoom-in duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-rose-400">
                Cancelar Proyecto de Investigación
              </CardTitle>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {projectCode}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4">
            <div className="p-3 rounded-lg bg-muted/50 border border-border/50 text-sm">
              <span className="font-semibold text-foreground">Proyecto: </span>
              <span className="text-muted-foreground">{projectTitle}</span>
            </div>

            <div className="space-y-2">
              <label htmlFor="cancel-reason" className="text-sm font-semibold text-foreground block">
                Motivo Institucional de Cancelación <span className="text-rose-400">*</span>
              </label>
              <textarea
                id="cancel-reason"
                rows={4}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Describa de forma clara y auditable el motivo técnico, financiero o institucional por el cual no se puede continuar con el proyecto..."
                className="w-full rounded-md bg-background border border-border/80 focus:border-rose-500 p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              {error && (
                <p className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  ⚠️ {error}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 border-t border-border/50 pt-4 bg-muted/20">
            <Button type="button" variant="outline" onClick={onClose} className="text-sm">
              Volver Atrás
            </Button>
            <Button type="submit" variant="destructive" className="text-sm bg-rose-600 hover:bg-rose-700 font-bold">
              Confirmar Cancelación
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
