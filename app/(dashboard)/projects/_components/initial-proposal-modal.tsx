"use client";

import { useState, useEffect } from "react";
import { 
  X, Plus, FileText, Building2, User, Sparkles, ArrowRight, BookOpen, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProjectItem } from "../page";
import { UNITEPC_SEDES_DATA, getUNITEPCFacultades, getUNITEPCCarreras } from "@/lib/unitepc-structure";

export interface InitialProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProposal: ProjectItem) => void;
  existingCount: number;
}

export function InitialProposalModal({
  isOpen,
  onClose,
  onSave,
  existingCount,
}: InitialProposalModalProps) {
  const generatedCode = `SIGPRI-2026-${String(existingCount + 1).padStart(3, "0")}`;

  const [title, setTitle] = useState("");
  const [selectedCallCode, setSelectedCallCode] = useState("");
  const [activeCalls, setActiveCalls] = useState<{ code: string; title: string }[]>([]);
  const [selectedSede, setSelectedSede] = useState("Cochabamba");
  const [facultad, setFacultad] = useState("Facultad de Ciencias de la Salud");
  const [carrera, setCarrera] = useState("Medicina");
  const [facultadesList, setFacultadesList] = useState<string[]>([]);
  const [carrerasList, setCarrerasList] = useState<string[]>([]);
  const [managementYear, setManagementYear] = useState<"2025" | "2026" | "2027">("2026");
  const [leadInvestigator, setLeadInvestigator] = useState("");
  const [abstractText, setAbstractText] = useState("");

  useEffect(() => {
    const facs = getUNITEPCFacultades(selectedSede);
    setFacultadesList(facs);
    if (facs.length > 0) {
      setFacultad(facs[0]);
      const cars = getUNITEPCCarreras(selectedSede, facs[0]);
      setCarrerasList(cars);
      if (cars.length > 0) setCarrera(cars[0]);
    }
  }, [selectedSede]);

  useEffect(() => {
    const cars = getUNITEPCCarreras(selectedSede, facultad);
    setCarrerasList(cars);
    if (cars.length > 0) setCarrera(cars[0]);
  }, [facultad]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCalls = localStorage.getItem("sigpri_research_calls_data_v2");
      if (storedCalls) {
        try {
          const parsed = JSON.parse(storedCalls);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mapped = parsed.map((c: any) => ({ code: c.code, title: c.title }));
            setActiveCalls(mapped);
            setSelectedCallCode(mapped[0].code);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Por favor ingrese el título de la propuesta.");
      return;
    }

    const selectedCall = activeCalls.find((c) => c.code === selectedCallCode);

    const newProjectItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      code: generatedCode,
      title: title.trim(),
      leadInvestigator: leadInvestigator || "Dra. Maria Lorena Orellana Aguilar",
      facultyArea: `${facultad} / ${carrera}`,
      managementYear: managementYear,
      status: "En Propuesta",
      requestedBudget: 50000,
      approvedBudget: 50000,
      taxCategory: "servicios",
      wbsProgress: 0,
      abstractText: abstractText.trim() || "Propuesta registrada inicialmente en la plataforma SIGPRI UNITEPC. Pendiente de completar Detalle (Anexo III), Cronograma y Presupuesto.",
      callCode: selectedCallCode || undefined,
      callTitle: selectedCall?.title || undefined,
      createdAt: new Date().toISOString().substring(0, 10),
      statusHistory: [
        {
          id: `h-${Date.now()}`,
          previousStatus: "En Propuesta",
          newStatus: "En Propuesta",
          changedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          changedBy: leadInvestigator || "Investigador Responsable",
          userRole: "Investigador Responsable",
          notes: "Registro inicial de la propuesta de investigación en la plataforma.",
        }
      ]
    };

    onSave(newProjectItem);
    setTitle("");
    setLeadInvestigator("");
    setAbstractText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* ENCABEZADO MINIMALISTA */}
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground font-black flex items-center justify-center shadow">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold text-xs">
                  {generatedCode}
                </Badge>
                <span className="text-xs text-muted-foreground font-semibold">Registro Inicial de Propuesta DICYT</span>
              </div>
              <h2 className="text-lg font-bold text-foreground tracking-tight leading-tight">
                Registrar Nueva Propuesta de Investigación
              </h2>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* FORMULARIO DE REGISTRO RÁPIDO */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">Título de la Propuesta / Proyecto *</label>
            <Input
              placeholder="Ej: Evaluacion de Efectos Fitoquimicos de Plantas Medicinales..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-bold text-sm bg-background"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Convocatoria Vincular *</label>
              <select
                value={selectedCallCode}
                onChange={(e) => setSelectedCallCode(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {activeCalls.length > 0 ? (
                  activeCalls.map((c) => (
                    <option key={c.code} value={c.code}>
                      [{c.code}] {c.title}
                    </option>
                  ))
                ) : (
                  <option value="CONV-1-2026-01">[CONV-1-2026-01] Convocatoria Nacional UNITEPC 2026</option>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Investigador Responsable *</label>
              <Input
                value={leadInvestigator}
                onChange={(e) => setLeadInvestigator(e.target.value)}
                placeholder="Nombre del Investigador Titular"
                className="h-9 text-xs font-semibold bg-background"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Sede UNITEPC *</label>
              <select
                value={selectedSede}
                onChange={(e) => setSelectedSede(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {Object.keys(UNITEPC_SEDES_DATA).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Facultad *</label>
              <select
                value={facultad}
                onChange={(e) => setFacultad(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {facultadesList.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Carrera *</label>
              <select
                value={carrera}
                onChange={(e) => setCarrera(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {carrerasList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">Resumen Ejecutivo Inicial / Planteamiento Breve</label>
            <textarea
              rows={3}
              value={abstractText}
              onChange={(e) => setAbstractText(e.target.value)}
              placeholder="Describa brevemente el propósito de la investigación..."
              className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* NOTA DE AYUDA DE LOS 3 PASOS / BOTONES COMPARTIDOS */}
          <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-primary">
              <Sparkles className="h-4 w-4" /> Proceso en 2 Fases:
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Al guardar este registro inicial, la propuesta aparecerá en su listado. Luego podrá completar el 📄 <strong>Detalle (Anexo III)</strong>, 📅 <strong>Cronograma</strong> y 📗 <strong>Presupuesto</strong> usando las vistas oficiales completas del proyecto.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 font-bold text-xs gap-1.5 shadow">
              🚀 Crear Propuesta <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
