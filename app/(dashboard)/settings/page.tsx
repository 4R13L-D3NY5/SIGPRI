"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Settings, Calendar, FileText, CheckCircle2, XCircle, Plus, Trash2, Edit3, 
  ArrowUp, ArrowDown, ShieldCheck, Layers, BookOpen, ToggleLeft, ToggleRight, 
  Lock, Unlock, Save, RefreshCw, AlertCircle, Check, HelpCircle, Building2,
  ListOrdered
} from "lucide-react";

export interface AcademicGestion {
  id: string;
  code: string; // ej. "1-2026", "2-2026"
  year: number;
  semester: number;
  isDefault: boolean;
  status: "Vigente / Aperturada" | "En Evaluación" | "Cerrada" | "Archivada";
  startDate: string;
  endDate: string;
}

export interface AcademicSectionItem {
  id: string;
  gestionCode: string;
  title: string;
  description: string;
  isRequired: boolean;
  isEnabled: boolean;
  order: number;
  isSystemStandard?: boolean; // Puntos estándar del Anexo III Parte 2
}

const INITIAL_GESTIONES: AcademicGestion[] = [
  {
    id: "g-1-2026",
    code: "1-2026",
    year: 2026,
    semester: 1,
    isDefault: true,
    status: "Vigente / Aperturada",
    startDate: "2026-01-15",
    endDate: "2026-06-30",
  },
  {
    id: "g-2-2026",
    code: "2-2026",
    year: 2026,
    semester: 2,
    isDefault: false,
    status: "Vigente / Aperturada",
    startDate: "2026-07-01",
    endDate: "2026-12-31",
  },
  {
    id: "g-1-2025",
    code: "1-2025",
    year: 2025,
    semester: 1,
    isDefault: false,
    status: "Archivada",
    startDate: "2025-01-15",
    endDate: "2025-06-30",
  },
  {
    id: "g-2-2025",
    code: "2-2025",
    year: 2025,
    semester: 2,
    isDefault: false,
    status: "Cerrada",
    startDate: "2025-07-01",
    endDate: "2025-12-31",
  },
];

const INITIAL_SECTIONS_ANEXO_III: AcademicSectionItem[] = [
  {
    id: "sec-1",
    gestionCode: "1-2026",
    title: "Planteamiento del Problema y Objeto de Estudio",
    description: "Formulación clara y delimitación de la problemática científica, objeto de estudio y preguntas de investigación.",
    isRequired: true,
    isEnabled: true,
    order: 1,
    isSystemStandard: true,
  },
  {
    id: "sec-2",
    gestionCode: "1-2026",
    title: "Justificación",
    description: "Justificación científica, técnica, social e institucional de la pertinencia y viabilidad del estudio.",
    isRequired: true,
    isEnabled: true,
    order: 2,
    isSystemStandard: true,
  },
  {
    id: "sec-3",
    gestionCode: "1-2026",
    title: "Estado del Arte",
    description: "Revisión crítica y antecedentes relevantes del estado actual del conocimiento nacional e internacional.",
    isRequired: true,
    isEnabled: true,
    order: 3,
    isSystemStandard: true,
  },
  {
    id: "sec-4",
    gestionCode: "1-2026",
    title: "Objetivos",
    description: "Objetivo General y Objetivos Específicos medibles y orientados a la solución del problema planteado.",
    isRequired: true,
    isEnabled: true,
    order: 4,
    isSystemStandard: true,
  },
  {
    id: "sec-5",
    gestionCode: "1-2026",
    title: "Metodología",
    description: "Tipo de investigación, diseño metodológico, universo, muestra, técnicas e instrumentos de recolección de datos.",
    isRequired: true,
    isEnabled: true,
    order: 5,
    isSystemStandard: true,
  },
  {
    id: "sec-6",
    gestionCode: "1-2026",
    title: "Resultados que se Esperan",
    description: "Descripción cualitativa y cuantitativa de los productos o hallazgos científicos esperados al finalizar la investigación.",
    isRequired: true,
    isEnabled: true,
    order: 6,
    isSystemStandard: true,
  },
  {
    id: "sec-7",
    gestionCode: "1-2026",
    title: "Impactos que se Pretenden Lograr",
    description: "Evaluación de impactos académico, científico, tecnológico, social, económico o ambiental previstos.",
    isRequired: true,
    isEnabled: true,
    order: 7,
    isSystemStandard: true,
  },
  {
    id: "sec-8",
    gestionCode: "1-2026",
    title: "Referencias Bibliográficas (Formato APA v7)",
    description: "Lista bibliográfica citada rigurosamente conforme las normas APA versión 7 (Adaptación PAT UNITEPC).",
    isRequired: true,
    isEnabled: true,
    order: 8,
    isSystemStandard: true,
  },
  {
    id: "sec-9",
    gestionCode: "1-2026",
    title: "Estrategias de Difusión",
    description: "Plan de publicación en revistas indexadas, congresos académicos, patentes o transferencia a la sociedad.",
    isRequired: false,
    isEnabled: false,
    order: 9,
    isSystemStandard: false,
  },
  {
    id: "sec-10",
    gestionCode: "1-2026",
    title: "Conclusiones",
    description: "Síntesis de hallazgos para el informe final de avance o proyecto concluido.",
    isRequired: false,
    isEnabled: false,
    order: 10,
    isSystemStandard: false,
  },
  {
    id: "sec-11",
    gestionCode: "1-2026",
    title: "Recomendaciones",
    description: "Sugerencias operativas o prospectivas derivadas del estudio.",
    isRequired: false,
    isEnabled: false,
    order: 11,
    isSystemStandard: false,
  },
];

const LOCAL_STORAGE_GESTIONES_KEY = "sigpri_gestiones_master_v1";
const LOCAL_STORAGE_SECTIONS_KEY = "sigpri_sections_anexo_iii_v1";

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<"gestiones" | "anexo_iii" | "general">("gestiones");
  const [gestiones, setGestiones] = useState<AcademicGestion[]>([]);
  const [selectedGestionCode, setSelectedGestionCode] = useState<string>("1-2026");
  const [sections, setSections] = useState<AcademicSectionItem[]>([]);

  // MODAL: CREAR NUEVA GESTIÓN
  const [isNewGestionOpen, setIsNewGestionOpen] = useState(false);
  const [newGestionYear, setNewGestionYear] = useState(2026);
  const [newGestionSemester, setNewGestionSemester] = useState(2);
  const [newGestionStartDate, setNewGestionStartDate] = useState("2026-07-01");
  const [newGestionEndDate, setNewGestionEndDate] = useState("2026-12-31");

  // MODAL: NUEVA SECCIÓN / EDITAR SECCIÓN
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<AcademicSectionItem | null>(null);
  const [secTitle, setSecTitle] = useState("");
  const [secDescription, setSecDescription] = useState("");
  const [secIsRequired, setSecIsRequired] = useState(true);
  const [secIsEnabled, setSecIsEnabled] = useState(true);

  // CARGAR DE LOCALSTORAGE
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedGest = localStorage.getItem(LOCAL_STORAGE_GESTIONES_KEY);
      if (storedGest) {
        try {
          const parsed = JSON.parse(storedGest);
          setGestiones(Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_GESTIONES);
        } catch (e) {
          setGestiones(INITIAL_GESTIONES);
        }
      } else {
        setGestiones(INITIAL_GESTIONES);
        localStorage.setItem(LOCAL_STORAGE_GESTIONES_KEY, JSON.stringify(INITIAL_GESTIONES));
      }

      const storedSec = localStorage.getItem(LOCAL_STORAGE_SECTIONS_KEY);
      if (storedSec) {
        try {
          const parsed = JSON.parse(storedSec);
          setSections(Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SECTIONS_ANEXO_III);
        } catch (e) {
          setSections(INITIAL_SECTIONS_ANEXO_III);
        }
      } else {
        setSections(INITIAL_SECTIONS_ANEXO_III);
        localStorage.setItem(LOCAL_STORAGE_SECTIONS_KEY, JSON.stringify(INITIAL_SECTIONS_ANEXO_III));
      }
    }
  }, []);

  const saveGestionesData = (updated: AcademicGestion[]) => {
    setGestiones(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_GESTIONES_KEY, JSON.stringify(updated));
    }
  };

  const saveSectionsData = (updated: AcademicSectionItem[]) => {
    setSections(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_SECTIONS_KEY, JSON.stringify(updated));
    }
  };

  // CREAR GESTIÓN
  const handleCreateGestion = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `${newGestionSemester}-${newGestionYear}`;
    if (gestiones.some((g) => g.code === code)) {
      alert(`La gestión académica ${code} ya existe.`);
      return;
    }

    const newGestion: AcademicGestion = {
      id: `g-${code}`,
      code,
      year: newGestionYear,
      semester: newGestionSemester,
      isDefault: false,
      status: "Vigente / Aperturada",
      startDate: newGestionStartDate,
      endDate: newGestionEndDate,
    };

    const updatedGest = [...gestiones, newGestion];
    saveGestionesData(updatedGest);

    // Duplicar o clonar las secciones por defecto para la nueva gestión
    const defaultSectionsForNewGestion: AcademicSectionItem[] = INITIAL_SECTIONS_ANEXO_III.map((s) => ({
      ...s,
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      gestionCode: code,
    }));

    saveSectionsData([...sections, ...defaultSectionsForNewGestion]);
    setIsNewGestionOpen(false);
  };

  // MARCAR GESTIÓN POR DEFECTO
  const handleSetDefaultGestion = (code: string) => {
    const updated = gestiones.map((g) => ({
      ...g,
      isDefault: g.code === code,
    }));
    saveGestionesData(updated);
    setSelectedGestionCode(code);
  };

  // CAMBIAR ESTADO DE GESTIÓN
  const handleChangeGestionStatus = (code: string, status: AcademicGestion["status"]) => {
    const updated = gestiones.map((g) => (g.code === code ? { ...g, status } : g));
    saveGestionesData(updated);
  };

  // HABILITAR / DESHABILITAR SECCIÓN EN GESTIÓN SELECCIONADA
  const handleToggleSectionEnabled = (id: string) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s));
    saveSectionsData(updated);
  };

  // CAMBIAR OBLIGATORIEDAD DE SECCIÓN
  const handleToggleSectionRequired = (id: string) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, isRequired: !s.isRequired } : s));
    saveSectionsData(updated);
  };

  // REORDENAR SECCIONES (MOVER ARRIBA / ABAJO)
  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const currentGestionSections = sections
      .filter((s) => s.gestionCode === selectedGestionCode)
      .sort((a, b) => a.order - b.order);

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentGestionSections.length) return;

    // Intercambiar orden
    const item1 = currentGestionSections[index];
    const item2 = currentGestionSections[targetIndex];

    const tempOrder = item1.order;
    item1.order = item2.order;
    item2.order = tempOrder;

    const updated = sections.map((s) => {
      if (s.id === item1.id) return item1;
      if (s.id === item2.id) return item2;
      return s;
    });

    saveSectionsData(updated);
  };

  // GUARDAR O CREAR SECCIÓN
  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secTitle.trim()) {
      alert("El título del punto o sección es obligatorio.");
      return;
    }

    if (editingSection) {
      const updated = sections.map((s) =>
        s.id === editingSection.id
          ? {
              ...s,
              title: secTitle,
              description: secDescription,
              isRequired: secIsRequired,
              isEnabled: secIsEnabled,
            }
          : s
      );
      saveSectionsData(updated);
    } else {
      const currentCount = sections.filter((s) => s.gestionCode === selectedGestionCode).length;
      const newSec: AcademicSectionItem = {
        id: `sec-${Date.now()}`,
        gestionCode: selectedGestionCode,
        title: secTitle,
        description: secDescription || "Descripción requerida para la sección.",
        isRequired: secIsRequired,
        isEnabled: secIsEnabled,
        order: currentCount + 1,
        isSystemStandard: false,
      };
      saveSectionsData([...sections, newSec]);
    }

    setIsSectionModalOpen(false);
    setEditingSection(null);
    setSecTitle("");
    setSecDescription("");
  };

  // ELIMINAR SECCIÓN
  const handleDeleteSection = (id: string) => {
    if (confirm("¿Está seguro de eliminar esta sección de la estructura académica?")) {
      const updated = sections.filter((s) => s.id !== id);
      saveSectionsData(updated);
    }
  };

  // OBTENER SECCIONES DE LA GESTIÓN SELECCIONADA
  const currentSections = sections
    .filter((s) => s.gestionCode === selectedGestionCode)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-10">
      <Header
        title="Parametrización y Configuración del Sistema"
        description="Administración de gestiones académicas y parametrización dinámica del esquema Anexo III (Parte 2 - Perfil y Proyecto de Grado/Investigación)."
      />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 w-full">
        {/* BANNER PRINCIPAL Y TABS DE NAVEGACIÓN */}
        <Card className="border border-border bg-card shadow-md">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary font-bold">
                    Parametrización UNITEPC
                  </Badge>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                  <Settings className="w-6 h-6 text-primary" />
                  Configuración Académica y Estructura de Proyectos
                </CardTitle>
                <CardDescription>
                  Definición de gestiones operativas y parametrización de los puntos/secciones a solicitar a los investigadores por gestión.
                </CardDescription>
              </div>
            </div>

            {/* BARRA DE NAVEGACIÓN ENTRE SECCIONES */}
            <div className="flex items-center gap-2 pt-4 border-t border-border flex-wrap">
              <button
                onClick={() => setActiveTab("gestiones")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "gestiones"
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Calendar className="h-4 w-4" /> 🗓️ Gestiones Académicas ({gestiones.length})
              </button>

              <button
                onClick={() => setActiveTab("anexo_iii")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "anexo_iii"
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <FileText className="h-4 w-4" /> 📝 Estructura de Proyectos (Anexo III - Parte 2)
              </button>

              <button
                onClick={() => setActiveTab("general")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "general"
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <ShieldCheck className="h-4 w-4" /> ⚙️ Parámetros Institucionales
              </button>
            </div>
          </CardHeader>
        </Card>

        {/* ========================================== */}
        {/* TAB 1: GESTIÓN DE GESTIONES ACADÉMICAS */}
        {/* ========================================== */}
        {activeTab === "gestiones" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Gestiones Académicas Registradas</h3>
                <p className="text-xs text-muted-foreground">Administre el estado operativo de las gestiones semestrales y defina la gestión vigente del sistema.</p>
              </div>

              <Button
                onClick={() => setIsNewGestionOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-2 shadow"
              >
                <Plus className="w-4 h-4" /> + Aperturar Nueva Gestión
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gestiones.map((g) => (
                <Card 
                  key={g.id} 
                  className={`border-2 ${
                    g.isDefault 
                      ? "border-emerald-500/50 bg-emerald-500/5" 
                      : "border-border bg-card"
                  } shadow-sm flex flex-col justify-between`}
                >
                  <CardHeader className="pb-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold text-sm">
                        Gestión {g.code}
                      </Badge>

                      {g.isDefault ? (
                        <Badge className="bg-emerald-500 text-white font-bold text-[10px]">
                          ⭐ Gestión Oficial Activa
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefaultGestion(g.code)}
                          className="h-6 text-[10px] text-muted-foreground hover:text-foreground font-bold"
                        >
                          Fijar como Activa
                        </Button>
                      )}
                    </div>

                    <CardTitle className="text-lg font-black text-foreground">
                      Semestre {g.semester} - Año {g.year}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-muted/40 border border-border space-y-1">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Apertura:</span>
                        <strong className="text-foreground font-mono">{g.startDate}</strong>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Cierre Semestral:</span>
                        <strong className="text-foreground font-mono">{g.endDate}</strong>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Estado de la Gestión:</label>
                      <select
                        value={g.status}
                        onChange={(e) => handleChangeGestionStatus(g.code, e.target.value as any)}
                        className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="Vigente / Aperturada">🟢 Vigente / Aperturada</option>
                        <option value="En Evaluación">🟣 En Evaluación / Arbitraje</option>
                        <option value="Cerrada">🔴 Cerrada</option>
                        <option value="Archivada">🟡 Archivada</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: PARAMETRIZACIÓN ANEXO III (PARTE 2) */}
        {/* ========================================== */}
        {activeTab === "anexo_iii" && (
          <div className="space-y-6">
            {/* SELECTOR DE GESTIÓN PARA CONFIGURACIÓN */}
            <Card className="border-border bg-card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Seleccionar Gestión para Parametrizar:</span>
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedGestionCode}
                      onChange={(e) => setSelectedGestionCode(e.target.value)}
                      className="bg-background border border-input rounded-lg px-4 py-2 text-sm font-black text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                      {gestiones.map((g) => (
                        <option key={g.code} value={g.code}>
                          Gestión {g.code} {g.isDefault ? "(Oficial Activa)" : ""}
                        </option>
                      ))}
                    </select>

                    <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary font-bold">
                      {currentSections.filter(s => s.isEnabled).length} Puntos Habilitados de {currentSections.length}
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setEditingSection(null);
                    setSecTitle("");
                    setSecDescription("");
                    setSecIsRequired(true);
                    setSecIsEnabled(true);
                    setIsSectionModalOpen(true);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-2 shadow"
                >
                  <Plus className="w-4 h-4" /> + Añadir Punto Personalizado
                </Button>
              </div>
            </Card>

            {/* LISTADO DE PUNTOS DE LA ESTRUCTURA DEL PROYECTO */}
            <Card className="border-border bg-card shadow-md overflow-hidden">
              <CardHeader className="border-b border-border pb-3">
                <CardTitle className="text-base font-bold text-foreground flex items-center justify-between">
                  <span>Esquema Académico de la Gestión {selectedGestionCode} (Anexo III - Parte 2)</span>
                  <span className="text-xs font-normal text-muted-foreground">Habilite, deshabilite o reordene los puntos a solicitar.</span>
                </CardTitle>
              </CardHeader>

              <div className="divide-y divide-border/60">
                {currentSections.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-xs">
                    No existen puntos configurados para la Gestión {selectedGestionCode}. Presione "+ Añadir Punto Personalizado" o cargue la plantilla base.
                  </div>
                ) : (
                  currentSections.map((sec, idx) => (
                    <div 
                      key={sec.id} 
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        sec.isEnabled ? "bg-card hover:bg-muted/30" : "bg-muted/20 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        {/* CONTADOR / REORDENAR */}
                        <div className="flex flex-col items-center justify-center bg-muted/60 border border-border rounded-lg px-2.5 py-1 text-center shrink-0">
                          <span className="text-xs font-mono font-black text-primary">#{idx + 1}</span>
                          <div className="flex items-center gap-0.5 mt-1">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveSection(idx, "up")}
                              className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                              title="Mover arriba"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              disabled={idx === currentSections.length - 1}
                              onClick={() => handleMoveSection(idx, "down")}
                              className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                              title="Mover abajo"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* DETALLE DEL PUNTO */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-foreground">{sec.title}</h4>

                            {sec.isSystemStandard && (
                              <Badge variant="outline" className="text-[9px] bg-blue-500/10 text-blue-400 border-blue-500/30 font-bold">
                                Estándar Anexo III
                              </Badge>
                            )}

                            {sec.isRequired ? (
                              <Badge variant="outline" className="text-[9px] bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold">
                                Campo Obligatorio
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[9px] bg-muted/60 text-muted-foreground border-border font-bold">
                                Campo Opcional
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{sec.description}</p>
                        </div>
                      </div>

                      {/* CONTROLES Y ACCIONES */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        {/* TOGGLE HABILITADO / DESHABILITADO */}
                        <button
                          onClick={() => handleToggleSectionEnabled(sec.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            sec.isEnabled
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-muted border-border text-muted-foreground"
                          }`}
                        >
                          {sec.isEnabled ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          <span>{sec.isEnabled ? "Habilitado" : "Deshabilitado"}</span>
                        </button>

                        {/* TOGGLE OBLIGATORIEDAD */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleSectionRequired(sec.id)}
                          className="h-8 text-[11px] font-bold border-border"
                          title="Alternar obligatoriedad"
                        >
                          {sec.isRequired ? "📌 Requerido" : "⚪ Opcional"}
                        </Button>

                        {/* EDITAR */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingSection(sec);
                            setSecTitle(sec.title);
                            setSecDescription(sec.description);
                            setSecIsRequired(sec.isRequired);
                            setSecIsEnabled(sec.isEnabled);
                            setIsSectionModalOpen(true);
                          }}
                          className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full"
                          title="Editar consiga/indicación"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>

                        {/* ELIMINAR (SOLO PARA PUNTOS PERSONALIZADOS) */}
                        {!sec.isSystemStandard && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSection(sec.id)}
                            className="h-8 w-8 text-rose-400 hover:bg-rose-500/10 rounded-full"
                            title="Eliminar punto personalizado"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: PARÁMETROS GENERALES UNITEPC */}
        {/* ========================================== */}
        {activeTab === "general" && (
          <div className="space-y-4">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold text-foreground">Normativa de Referenciación e Investigación</CardTitle>
                <CardDescription>Parámetros técnicos de validación bibliográfica y sedes académicas oficiales.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1">
                  <span className="font-bold text-foreground block">Norma Bibliográfica Vigente:</span>
                  <span className="font-mono text-emerald-400 font-bold">Normas APA 7ma Edición (Adaptación PAT UNITEPC)</span>
                  <p className="text-muted-foreground text-[11px]">Todas las citas bibliográficas ingresadas en proyectos e informes de grado se validan bajo la estructura estandarizada APA v7.</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-2">
                  <span className="font-bold text-foreground block">Sedes Nacionales Habilitadas:</span>
                  <div className="flex flex-wrap gap-2">
                    {["Cochabamba (Central)", "La Paz", "Santa Cruz", "Cobija", "Ivirgarzama", "Puerto Quijarro"].map((s) => (
                      <Badge key={s} variant="outline" className="bg-primary/10 border-primary/30 text-primary font-bold">
                        🏛️ {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* MODAL: APERTURAR NUEVA GESTIÓN */}
        {isNewGestionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Aperturar Nueva Gestión
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsNewGestionOpen(false)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleCreateGestion} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Año de la Gestión</label>
                    <Input
                      type="number"
                      required
                      min={2024}
                      max={2030}
                      value={newGestionYear}
                      onChange={(e) => setNewGestionYear(Number(e.target.value))}
                      className="text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Semestre</label>
                    <select
                      value={newGestionSemester}
                      onChange={(e) => setNewGestionSemester(Number(e.target.value))}
                      className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value={1}>Semestre 1 (1-{newGestionYear})</option>
                      <option value={2}>Semestre 2 (2-{newGestionYear})</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Fecha Inicio</label>
                    <Input
                      type="date"
                      required
                      value={newGestionStartDate}
                      onChange={(e) => setNewGestionStartDate(e.target.value)}
                      className="text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Fecha Cierre</label>
                    <Input
                      type="date"
                      required
                      value={newGestionEndDate}
                      onChange={(e) => setNewGestionEndDate(e.target.value)}
                      className="text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsNewGestionOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 font-bold">
                    Aperturar Gestión
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDITAR / AÑADIR PUNTO ANEXO III */}
        {isSectionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-primary" /> 
                  {editingSection ? "Editar Punto / Sección" : "+ Añadir Punto Personalizado"}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setIsSectionModalOpen(false)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSaveSection} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Título del Punto / Sección *</label>
                  <Input
                    type="text"
                    required
                    value={secTitle}
                    onChange={(e) => setSecTitle(e.target.value)}
                    placeholder="Ej. Estrategias de Difusión, Marco Ético, Conclusiones..."
                    className="text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Descripción / Consigna para el Investigador</label>
                  <textarea
                    rows={3}
                    value={secDescription}
                    onChange={(e) => setSecDescription(e.target.value)}
                    placeholder="Escriba las orientaciones e indicaciones técnicas que debe llenar el investigador..."
                    className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Estado Inicial:</span>
                    <button
                      type="button"
                      onClick={() => setSecIsEnabled(!secIsEnabled)}
                      className={`px-2.5 py-1 rounded text-xs font-bold border cursor-pointer ${
                        secIsEnabled ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {secIsEnabled ? "🟢 Habilitado" : "🔴 Deshabilitado"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Obligatoriedad:</span>
                    <button
                      type="button"
                      onClick={() => setSecIsRequired(!secIsRequired)}
                      className={`px-2.5 py-1 rounded text-xs font-bold border cursor-pointer ${
                        secIsRequired ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {secIsRequired ? "📌 Obligatorio" : "⚪ Opcional"}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsSectionModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 font-bold gap-1">
                    <Check className="h-4 w-4" /> Guardar Cambios
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
