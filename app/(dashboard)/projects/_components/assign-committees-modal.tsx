"use client";

import { useState } from "react";
import { 
  Users, CheckCircle2, X, ShieldAlert, Award, UserCheck, 
  Calculator, Sparkles, CheckSquare, Square, Filter, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
    name: "Dra. Maria Lorena Orellana Aguilar",
    ci: "5289102",
    role: "Vocal Metodológico / Investigadora Par",
    committeeType: "Científico",
  },
  {
    id: "eval-3",
    name: "Dr. Carlos Hugo Mamani",
    ci: "6102938",
    role: "Evaluador de Proyectos de Innovación",
    committeeType: "Científico",
  },
  {
    id: "eval-4",
    name: "Dra. Carmen Rosa Morales Arispe",
    ci: "5123987",
    role: "Secretaria Académica / Evaluación Bioética",
    committeeType: "Bioético",
  },
  {
    id: "eval-5",
    name: "Dr. Gonzalo Fernández Terán",
    ci: "3987123",
    role: "Vocal Evaluador Bioético",
    committeeType: "Bioético",
  },
  {
    id: "eval-6",
    name: "Dra. Beatriz Soliz Claros",
    ci: "4501928",
    role: "Especialista en Integridad Científica y Ensayos",
    committeeType: "Bioético",
  },
  {
    id: "eval-7",
    name: "Lic. Javier Mercado Rivas",
    ci: "6543210",
    role: "Jefe de Fiscalización Presupuestaria y Contabilidad",
    committeeType: "Contabilidad",
  },
  {
    id: "eval-8",
    name: "Lic. Patricia Encinas Roca",
    ci: "7019283",
    role: "Auditora Financiera y Retenciones Impositivas",
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

  // ESTADO DEL FILTRO POR COMISIÓN Y BÚSQUEDA
  const [selectedCommitteeFilter, setSelectedCommitteeFilter] = useState<"TODAS" | "Científico" | "Bioético" | "Contabilidad">("TODAS");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen || !project) return null;

  // FILTRADO DINÁMICO DE EVALUADORES POR COMISIÓN Y TEXTO
  const filteredEvaluators = DEFAULT_EVALUATOR_POOL.filter((e) => {
    const matchesCommittee = selectedCommitteeFilter === "TODAS" || e.committeeType === selectedCommitteeFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      e.name.toLowerCase().includes(searchLower) ||
      e.role.toLowerCase().includes(searchLower) ||
      e.ci.includes(searchLower);

    return matchesCommittee && matchesSearch;
  });

  const toggleEvaluator = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectFiltered = () => {
    const filteredIds = filteredEvaluators.map((e) => e.id);
    const newSelected = Array.from(new Set([...selectedIds, ...filteredIds]));
    setSelectedIds(newSelected);
  };

  const handleDeselectFiltered = () => {
    const filteredIds = filteredEvaluators.map((e) => e.id);
    setSelectedIds(selectedIds.filter((id) => !filteredIds.includes(id)));
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

  // Conteos por comisión
  const countCientifico = DEFAULT_EVALUATOR_POOL.filter(e => e.committeeType === "Científico").length;
  const countBioetico = DEFAULT_EVALUATOR_POOL.filter(e => e.committeeType === "Bioético").length;
  const countContabilidad = DEFAULT_EVALUATOR_POOL.filter(e => e.committeeType === "Contabilidad").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* CABECERA */}
        <div className="px-6 py-4 bg-muted/60 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-bold text-sm text-foreground">Designar Evaluadores por Comisión</h3>
              <p className="text-xs text-muted-foreground">Asignación de pares evaluadores (Comisión Científica, Bioética y Contable)</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* CUERPO */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
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

          {/* BARRA DE FILTROS POR COMISIÓN */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                <Filter className="h-3.5 w-3.5 text-primary" />
                Filtrar Evaluadores por Comisión:
              </label>
              <span className="text-[11px] text-muted-foreground font-mono">
                {filteredEvaluators.length} evaluadores disponibles
              </span>
            </div>

            {/* PESTAÑAS / BOTONES DE FILTRO POR COMISIÓN */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedCommitteeFilter("TODAS")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 ${
                  selectedCommitteeFilter === "TODAS"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/40 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>🌐 Todas</span>
                <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-background/30 text-current">
                  {DEFAULT_EVALUATOR_POOL.length}
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCommitteeFilter("Científico")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 ${
                  selectedCommitteeFilter === "Científico"
                    ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                    : "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                }`}
              >
                <span>🧬 Científico</span>
                <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-background/30 text-current">
                  {countCientifico}
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCommitteeFilter("Bioético")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 ${
                  selectedCommitteeFilter === "Bioético"
                    ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                    : "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                }`}
              >
                <span>⚖️ Bioético</span>
                <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-background/30 text-current">
                  {countBioetico}
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCommitteeFilter("Contabilidad")}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border text-center flex items-center justify-center gap-1.5 ${
                  selectedCommitteeFilter === "Contabilidad"
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                }`}
              >
                <span>📊 Contabilidad</span>
                <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-background/30 text-current">
                  {countContabilidad}
                </Badge>
              </button>
            </div>

            {/* INPUT DE BÚSQUEDA POR TEXTO */}
            <div className="relative pt-1">
              <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar evaluador por nombre, especialidad o C.I..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-xs pl-8 bg-background"
              />
            </div>
          </div>

          {/* BARRA DE ACCIÓN RÁPIDA DE SELECCIÓN */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-emerald-500" />
              Designados ({selectedIds.length}/{DEFAULT_EVALUATOR_POOL.length}):
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Button type="button" variant="outline" size="sm" onClick={handleSelectFiltered} className="text-[10px] h-7 font-semibold">
                Seleccionar Visibles ({filteredEvaluators.length})
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleDeselectFiltered} className="text-[10px] h-7 text-amber-500 font-semibold">
                Desmarcar Visibles
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleDeselectAll} className="text-[10px] h-7 text-muted-foreground">
                Limpiar Todo
              </Button>
            </div>
          </div>

          {/* LISTA DE EVALUADORES DISPONIBLES */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredEvaluators.length === 0 ? (
              <div className="p-8 text-center border border-dashed rounded-xl text-muted-foreground text-xs">
                No se encontraron evaluadores para la comisión o filtro de búsqueda seleccionado.
              </div>
            ) : (
              filteredEvaluators.map((evaluator) => {
                const isSelected = selectedIds.includes(evaluator.id);
                return (
                  <div
                    key={evaluator.id}
                    onClick={() => toggleEvaluator(evaluator.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
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
                            Comisión {evaluator.committeeType}
                          </Badge>
                        </h5>
                        <p className="text-[11px] text-muted-foreground">{evaluator.role} • C.I. {evaluator.ci}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* PIE DE PÁGINA Y BOTÓN DE GUARDADO */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-3 shrink-0">
            <Button type="button" variant="outline" onClick={onClose} className="font-semibold text-xs">
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-1.5 shadow">
              <CheckCircle2 className="h-4 w-4" />
              <span>Confirmar Asignación por Comisiones</span>
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
