"use client";

import { useState, useEffect } from "react";
import { 
  X, FileText, Calendar, DollarSign, Plus, Trash2, CheckCircle2, 
  ArrowRight, ArrowLeft, Building2, User, UserPlus, Calculator, 
  Layers, Check, Sparkles, BookOpen, AlertCircle, ShieldCheck,
  Table as TableIcon, Info, HelpCircle, FileSpreadsheet, Scale,
  GraduationCap, Briefcase, Phone, Mail, MapPin, Globe, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProjectItem } from "../page";
import { UNITEPC_SEDES_DATA, getUNITEPCFacultades, getUNITEPCCarreras } from "@/lib/unitepc-structure";
import { calculateLey843Tax } from "@/lib/sigpri-data";
import { TeamMember } from "./project-detail-modal";
import { WbsTask } from "./project-wbs-modal";
import { BudgetItemRow } from "./project-budget-modal";

export interface NewProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProposal: ProjectItem, wbsTasks: WbsTask[], budgetItems: BudgetItemRow[]) => void;
  existingCount: number;
}

export function NewProposalModal({
  isOpen,
  onClose,
  onSave,
  existingCount,
}: NewProposalModalProps) {
  const [activeTab, setActiveTab] = useState<"detalle" | "cronograma" | "presupuesto">("detalle");

  // CÓDIGO AUTOGENERADO Y GESTIÓN
  const generatedCode = `SIGPRI-2026-${String(existingCount + 1).padStart(3, "0")}`;

  // ==========================================
  // ESTADOS - PESTAÑA 1: DETALLE (ANEXO III)
  // ==========================================
  const [title, setTitle] = useState("");
  const [selectedCallCode, setSelectedCallCode] = useState("");
  const [activeCalls, setActiveCalls] = useState<{ code: string; title: string }[]>([]);
  const [selectedSede, setSelectedSede] = useState("Cochabamba");
  const [facultad, setFacultad] = useState("Facultad de Ciencias de la Salud");
  const [carrera, setCarrera] = useState("Medicina");
  const [facultadesList, setFacultadesList] = useState<string[]>([]);
  const [carrerasList, setCarrerasList] = useState<string[]>([]);
  const [managementYear, setManagementYear] = useState<"2025" | "2026" | "2027">("2026");
  const [leadInvestigator, setLeadInvestigator] = useState("Dra. Maria Lorena Orellana Aguilar");

  // EQUIPO DE INVESTIGADORES
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "mem-1",
      name: "Dra. Maria Lorena Orellana Aguilar",
      ci: "5489123",
      type: "INTERNO",
      carrera: "Medicina",
      institution: "UNITEPC",
      occupation: "Investigador Responsable",
      cityCountry: "Cochabamba - Bolivia",
      phone: "79326793",
      email: "lorena.orellana@unitepc.edu.bo",
      signatureStatus: "Firmado Digitalmente",
      isResponsable: true,
    }
  ]);

  // SECCIONES DEL ANEXO III PARTE 2
  const [anexoSections, setAnexoSections] = useState<Record<string, string>>({
    problema: "",
    justificacion: "",
    estadoDelArte: "",
    objetivos: "",
    metodologia: "",
    resultados: "",
    impactos: "",
    referencias: "",
  });

  // ==========================================
  // ESTADOS - PESTAÑA 2: CRONOGRAMA (WBS / EDT)
  // ==========================================
  const [wbsTasks, setWbsTasks] = useState<WbsTask[]>([
    {
      id: "wbs-1",
      wbsCode: "1.0",
      title: "Fase 1: Revisión Bibliográfica y Formulación del Protocolo",
      description: "Recopilación de literatura, estado del arte y ajuste metodológico",
      responsible: "Investigador Responsable",
      startDate: "2026-08-01",
      endDate: "2026-09-15",
      progress: 0,
      status: "PENDIENTE",
      startWeek: 1,
      endWeek: 6,
      isParent: false,
    },
    {
      id: "wbs-2",
      wbsCode: "2.0",
      title: "Fase 2: Trabajo de Campo y Levantamiento de Datos",
      description: "Ejecución de pruebas experimentales y toma de muestras",
      responsible: "Equipo Investigador",
      startDate: "2026-09-16",
      endDate: "2026-11-15",
      progress: 0,
      status: "PENDIENTE",
      startWeek: 7,
      endWeek: 14,
      isParent: false,
    },
    {
      id: "wbs-3",
      wbsCode: "3.0",
      title: "Fase 3: Procesamiento, Análisis de Resultados y Redacción Final",
      description: "Sistematización de datos y elaboración del informe final Anexo III",
      responsible: "Investigador Responsable",
      startDate: "2026-11-16",
      endDate: "2026-12-15",
      progress: 0,
      status: "PENDIENTE",
      startWeek: 15,
      endWeek: 20,
      isParent: false,
    }
  ]);

  // ==========================================
  // ESTADOS - PESTAÑA 3: PRESUPUESTO HOMOGÉNEO (LEY 843)
  // ==========================================
  const [budgetItems, setBudgetItems] = useState<BudgetItemRow[]>([
    {
      codeNum: 1,
      institution: "UNITEPC",
      description: "Honorarios de Asistencia de Investigación y Pruebas Especializadas",
      purchaseOrLoan: "compra",
      unit: "Servicio",
      quantity: 1,
      unitPrice: 25000,
      docType: "RETENCIÓN",
      retentionType: "SERVICIOS",
      observations: "Retención tributaria 15.5% Ley 843 (IUE 12.5% + IT 3%)",
    },
    {
      codeNum: 2,
      institution: "UNITEPC",
      description: "Insumos, Reactivos y Materiales de Laboratorio",
      purchaseOrLoan: "compra",
      unit: "Lote",
      quantity: 1,
      unitPrice: 15000,
      docType: "FACTURA",
      retentionType: "COMPRA",
      observations: "Factura comercial con NIT de la Universidad",
    }
  ]);

  // CARGAR ESTRUCTURA UNITEPC Y CONVOCATORIAS
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

  // HANDLERS DE EQUIPO DE INVESTIGADORES
  const handleAddTeamMember = () => {
    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: "",
      ci: "",
      type: "INTERNO",
      carrera: carrera || "Medicina",
      institution: "UNITEPC",
      occupation: "Investigador Coautor",
      cityCountry: `${selectedSede} - Bolivia`,
      phone: "",
      email: "",
      signatureStatus: "Pendiente",
      isResponsable: false,
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const handleRemoveTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const handleUpdateTeamMember = (id: string, field: keyof TeamMember, value: any) => {
    setTeamMembers(teamMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  // HANDLERS DE CRONOGRAMA WBS
  const handleAddWbsTask = () => {
    const nextNum = wbsTasks.length + 1;
    const newTask: WbsTask = {
      id: `wbs-${Date.now()}`,
      wbsCode: `${nextNum}.0`,
      title: `Fase ${nextNum}: Nueva Actividad de Investigación`,
      description: "Descripción de entregables y alcance",
      responsible: leadInvestigator || "Investigador Responsable",
      startDate: "2026-08-01",
      endDate: "2026-10-01",
      progress: 0,
      status: "PENDIENTE",
      startWeek: 1,
      endWeek: 8,
      isParent: false,
    };
    setWbsTasks([...wbsTasks, newTask]);
  };

  const handleRemoveWbsTask = (id: string) => {
    setWbsTasks(wbsTasks.filter((t) => t.id !== id));
  };

  const handleUpdateWbsTask = (id: string, field: keyof WbsTask, value: any) => {
    setWbsTasks(wbsTasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  // HANDLERS DE PRESUPUESTO COMPLETO HOMOGÉNEO
  const handleAddBudgetItem = () => {
    const nextNum = budgetItems.length + 1;
    const newItem: BudgetItemRow = {
      codeNum: nextNum,
      institution: "UNITEPC",
      description: "Nuevo Ítem o Adquisición",
      purchaseOrLoan: "compra",
      unit: "Unidad",
      quantity: 1,
      unitPrice: 1000,
      docType: "FACTURA",
      retentionType: "COMPRA",
      observations: "Gasto justificado según Anexo III",
    };
    setBudgetItems([...budgetItems, newItem]);
  };

  const handleRemoveBudgetItem = (index: number) => {
    setBudgetItems(budgetItems.filter((_, i) => i !== index));
  };

  const handleUpdateBudgetItem = (index: number, field: keyof BudgetItemRow, value: any) => {
    setBudgetItems(
      budgetItems.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // CÁLCULOS FINANCIEROS Y TRIBUTARIOS (LEY 843)
  const totalRequestedBudget = budgetItems.reduce(
    (sum, item) => sum + (item.quantity || 1) * (item.unitPrice || 0),
    0
  );

  const totalRetentionTax = budgetItems.reduce((sum, item) => {
    const subtotal = (item.quantity || 1) * (item.unitPrice || 0);
    if (item.docType === "RETENCIÓN") {
      if (item.retentionType === "SERVICIOS") return sum + subtotal * 0.155;
      if (item.retentionType === "COMPRA") return sum + subtotal * 0.08;
      if (item.retentionType === "ALQUILERES") return sum + subtotal * 0.16;
    }
    return sum;
  }, 0);

  const totalNetDisbursement = totalRequestedBudget - totalRetentionTax;

  // SUBMIT FINAL DE LA NUEVA PROPUESTA DE INVESTIGACIÓN
  const handleSubmitProposal = (e: React.FormEvent) => {
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
      requestedBudget: totalRequestedBudget || 50000,
      approvedBudget: totalRequestedBudget || 50000,
      taxCategory: "servicios",
      wbsProgress: 0,
      abstractText: anexoSections.problema || "Propuesta registrada unificadamente con los 3 apartados del proyecto.",
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
          notes: "Registro unificado de propuesta con el formato homogéneo de Detalle, Cronograma WBS y Presupuesto Ley 843.",
        }
      ]
    };

    onSave(newProjectItem, wbsTasks, budgetItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200">
        
        {/* ENCABEZADO OFICIAL HOMOGÉNEO CON EL RESTO DE MODALES */}
        <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-muted/50 via-card to-muted/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground font-black flex items-center justify-center shadow-md">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold text-xs">
                  {generatedCode}
                </Badge>
                <Badge variant="outline" className="font-bold text-[10px] bg-sky-500/10 border-sky-500/30 text-sky-500">
                  🌱 1. En Propuesta
                </Badge>
                <span className="text-xs text-muted-foreground font-semibold">Formulario Homogéneo SIGPRI UNITEPC</span>
              </div>
              <h2 className="text-lg font-bold text-foreground tracking-tight leading-tight mt-0.5">
                {title ? title : "Registrar Nueva Propuesta de Investigación"}
              </h2>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* NAVEGACIÓN HOMOGÉNEA POR LOS 3 BOTONES COMPARTIDOS */}
        <div className="px-6 py-2.5 bg-background border-b border-border flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("detalle")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "detalle"
                  ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>📄 Detalle (Anexo III)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("cronograma")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "cronograma"
                  ? "bg-amber-600 text-white shadow-md ring-2 ring-amber-500/30"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>📅 Cronograma (WBS)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("presupuesto")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "presupuesto"
                  ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/30"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground"
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>📗 Presupuesto (Ley 843)</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <span>Sección Activa:</span>
            <Badge variant="outline" className="font-bold text-[11px] bg-primary/10 border-primary/20 text-primary">
              {activeTab === "detalle" ? "1 / 3 Detalle General" : activeTab === "cronograma" ? "2 / 3 Cronograma WBS" : "3 / 3 Presupuesto & Retenciones"}
            </Badge>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ========================================================= */}
          {/* APARTADO 1: DETALLE DEL PROYECTO (ANEXO III PARTE 2) */}
          {/* ========================================================= */}
          {activeTab === "detalle" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* DATOS GENERALES DE IDENTIFICACIÓN */}
              <div className="p-5 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" /> Identificación General y Convocatoria
                  </h3>
                  <Badge variant="outline" className="font-bold text-[10px] bg-muted text-muted-foreground">
                    UNITEPC Bolivia
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8 space-y-1">
                    <label className="text-xs font-bold text-foreground">Título de la Propuesta / Proyecto *</label>
                    <Input
                      placeholder="Ingrese el título completo de la propuesta de investigación..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="font-bold text-sm bg-background"
                      required
                    />
                  </div>

                  <div className="md:col-span-4 space-y-1">
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

                  <div className="md:col-span-3 space-y-1">
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

                  <div className="md:col-span-4 space-y-1">
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

                  <div className="md:col-span-3 space-y-1">
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

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-foreground">Gestión Académica</label>
                    <select
                      value={managementYear}
                      onChange={(e) => setManagementYear(e.target.value as any)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="2026">Gestión 2026</option>
                      <option value="2027">Gestión 2027</option>
                      <option value="2025">Gestión 2025</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* EQUIPO DE INVESTIGADORES COMPLETO (HOMOGÉNEO CON PROJECT-DETAIL-MODAL) */}
              <div className="p-5 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <User className="h-4 w-4 text-primary" /> Equipo de Investigadores Postulantes
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Formulario completo de docentes responsables y coinvestigadores</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={handleAddTeamMember} className="text-xs font-bold gap-1">
                    <UserPlus className="h-3.5 w-3.5" /> Añadir Integrante
                  </Button>
                </div>

                <div className="space-y-3">
                  {teamMembers.map((m, idx) => (
                    <div key={m.id} className="p-4 rounded-xl border border-border bg-muted/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`font-bold text-[10px] ${idx === 0 ? "bg-primary/10 text-primary border-primary/30" : "bg-muted text-muted-foreground"}`}>
                            {idx === 0 ? "👑 Investigador Responsable" : `Investigador Coautor #${idx + 1}`}
                          </Badge>
                        </div>
                        {idx > 0 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTeamMember(m.id)} className="h-7 w-7 text-rose-400 hover:bg-rose-500/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground">Nombre Completo *</label>
                          <Input
                            value={m.name}
                            onChange={(e) => {
                              handleUpdateTeamMember(m.id, "name", e.target.value);
                              if (idx === 0) setLeadInvestigator(e.target.value);
                            }}
                            placeholder="Ej: Dra. Maria Lorena Orellana Aguilar"
                            className="h-8 text-xs font-semibold bg-background"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground">C.I. / Documento</label>
                          <Input
                            value={m.ci}
                            onChange={(e) => handleUpdateTeamMember(m.id, "ci", e.target.value)}
                            placeholder="Ej. 6522053"
                            className="h-8 text-xs bg-background"
                          />
                        </div>

                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground">Correo Electrónico *</label>
                          <Input
                            value={m.email}
                            onChange={(e) => handleUpdateTeamMember(m.id, "email", e.target.value)}
                            placeholder="correo@unitepc.edu.bo"
                            className="h-8 text-xs bg-background"
                          />
                        </div>

                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground">Teléfono / Celular</label>
                          <Input
                            value={m.phone}
                            onChange={(e) => handleUpdateTeamMember(m.id, "phone", e.target.value)}
                            placeholder="79326793"
                            className="h-8 text-xs bg-background"
                          />
                        </div>

                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground">Tipo de Investigador</label>
                          <select
                            value={m.type}
                            onChange={(e) => handleUpdateTeamMember(m.id, "type", e.target.value as any)}
                            className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="INTERNO">INTERNO UNITEPC</option>
                            <option value="EXTERNO">EXTERNO INSTITUCIONAL</option>
                          </select>
                        </div>

                        <div className="md:col-span-4 space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground">Carrera / Institución</label>
                          <Input
                            value={m.carrera}
                            onChange={(e) => handleUpdateTeamMember(m.id, "carrera", e.target.value)}
                            placeholder="Ej. Medicina / UNITEPC"
                            className="h-8 text-xs bg-background"
                          />
                        </div>

                        <div className="md:col-span-5 space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground">Ocupación / Rol Académico</label>
                          <Input
                            value={m.occupation}
                            onChange={(e) => handleUpdateTeamMember(m.id, "occupation", e.target.value)}
                            placeholder="Ej. Docente Investigador Titular"
                            className="h-8 text-xs bg-background"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* APARTADOS DEL ANEXO III PARTE 2 COMPLETO */}
              <div className="p-5 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <FileText className="h-4 w-4" /> Desarrollo de la Propuesta (Estructura Anexo III Parte 2)
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Formulario completo de secciones académicas requeridas por la normativa PAT UNITEPC</p>
                  </div>
                  <Badge variant="outline" className="font-bold text-[10px] bg-primary/10 border-primary/30 text-primary">
                    Normativa APA v7 UNITEPC
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">1. Planteamiento del Problema y Objeto de Estudio *</label>
                    <textarea
                      rows={3}
                      value={anexoSections.problema}
                      onChange={(e) => setAnexoSections({ ...anexoSections, problema: e.target.value })}
                      placeholder="Formulación clara del problema, hipótesis, preguntas de investigación y delimitación..."
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">2. Justificación Institucional y Social *</label>
                    <textarea
                      rows={2.5}
                      value={anexoSections.justificacion}
                      onChange={(e) => setAnexoSections({ ...anexoSections, justificacion: e.target.value })}
                      placeholder="Justificación técnica, pertinencia social, institucional y solución a necesidades de la comunidad..."
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">3. Estado del Arte *</label>
                    <textarea
                      rows={2.5}
                      value={anexoSections.estadoDelArte}
                      onChange={(e) => setAnexoSections({ ...anexoSections, estadoDelArte: e.target.value })}
                      placeholder="Revisión sistemática de literatura, antecedentes científicos y base teórica relevante..."
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">4. Objetivos (General y Específicos) *</label>
                    <textarea
                      rows={2.5}
                      value={anexoSections.objetivos}
                      onChange={(e) => setAnexoSections({ ...anexoSections, objetivos: e.target.value })}
                      placeholder="Objetivo General y metas cuantificables redactadas en verbos en infinitivo..."
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">5. Metodología y Diseño Experimental *</label>
                    <textarea
                      rows={3}
                      value={anexoSections.metodologia}
                      onChange={(e) => setAnexoSections({ ...anexoSections, metodologia: e.target.value })}
                      placeholder="Tipo de estudio, universo, muestra, variables, técnicas de recolección y análisis estadístico/computacional..."
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">6. Resultados Esperados</label>
                      <textarea
                        rows={2.5}
                        value={anexoSections.resultados}
                        onChange={(e) => setAnexoSections({ ...anexoSections, resultados: e.target.value })}
                        placeholder="Productos entregables, prototipos, patentes o artículos indexados..."
                        className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">7. Impactos Pretendidos</label>
                      <textarea
                        rows={2.5}
                        value={anexoSections.impactos}
                        onChange={(e) => setAnexoSections({ ...anexoSections, impactos: e.target.value })}
                        placeholder="Impacto científico, social, ambiental o transferencia tecnológica..."
                        className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">8. Referencias Bibliográficas (Formato APA v7)</label>
                    <textarea
                      rows={2.5}
                      value={anexoSections.referencias}
                      onChange={(e) => setAnexoSections({ ...anexoSections, referencias: e.target.value })}
                      placeholder="Citas bibliográficas en formato APA 7ma Edición con DOIs u URLs..."
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* APARTADO 2: CRONOGRAMA DE TRABAJO WBS / EDT (HOMOGÉNEO) */}
          {/* ========================================================= */}
          {activeTab === "cronograma" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> Estructura de Desglose del Trabajo (WBS / EDT)
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Mismo formato de tabla de fases, entregables, responsables y fechas que el modal de Cronograma</p>
                  </div>
                  <Button type="button" size="sm" onClick={handleAddWbsTask} className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1 self-start sm:self-auto">
                    <Plus className="h-4 w-4" /> Añadir Fase WBS
                  </Button>
                </div>

                <div className="space-y-3">
                  {wbsTasks.map((task, idx) => (
                    <div key={task.id} className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-sm">
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <Badge variant="outline" className="font-mono bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold text-xs">
                            Código WBS: {task.wbsCode}
                          </Badge>
                          <Input
                            value={task.title}
                            onChange={(e) => handleUpdateWbsTask(task.id, "title", e.target.value)}
                            placeholder="Nombre de la fase o actividad..."
                            className="h-8 font-bold text-xs bg-background flex-1"
                          />
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveWbsTask(task.id)} className="h-7 w-7 text-rose-400 hover:bg-rose-500/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                        <div className="md:col-span-5 space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground">Entregables y Alcance de la Fase</label>
                          <Input
                            value={task.description}
                            onChange={(e) => handleUpdateWbsTask(task.id, "description", e.target.value)}
                            placeholder="Entregables esperados..."
                            className="h-8 text-xs bg-background"
                          />
                        </div>

                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground">Responsable de Fase</label>
                          <Input
                            value={task.responsible}
                            onChange={(e) => handleUpdateWbsTask(task.id, "responsible", e.target.value)}
                            placeholder="Docente Responsable"
                            className="h-8 text-xs bg-background font-semibold"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground">Fecha Inicio</label>
                          <Input
                            type="date"
                            value={task.startDate}
                            onChange={(e) => handleUpdateWbsTask(task.id, "startDate", e.target.value)}
                            className="h-8 text-xs bg-background"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground">Fecha Cierre</label>
                          <Input
                            type="date"
                            value={task.endDate}
                            onChange={(e) => handleUpdateWbsTask(task.id, "endDate", e.target.value)}
                            className="h-8 text-xs bg-background"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* APARTADO 3: PRESUPUESTO HOMOGÉNEO (LEY 843) */}
          {/* ========================================================= */}
          {activeTab === "presupuesto" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* TABLA DE ÍTEMS CON EL MISMO FORMATO HOMOGÉNEO DE PROJECT-BUDGET-MODAL */}
              <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Calculator className="h-4 w-4" /> Presupuesto Detallado y Retenciones Impositivas (Ley 843)
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Mismo formato de tabla de presupuesto oficial con cálculo automático de impuestos</p>
                  </div>
                  <Button type="button" size="sm" onClick={handleAddBudgetItem} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1 self-start sm:self-auto">
                    <Plus className="h-4 w-4" /> Añadir Ítem Presupuestario
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border bg-card">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/40 text-muted-foreground font-bold border-b border-border">
                        <th className="p-2.5 text-center w-12">N°</th>
                        <th className="p-2.5 w-32">Institución</th>
                        <th className="p-2.5 min-w-[200px]">Descripción del Gasto</th>
                        <th className="p-2.5 w-24">Modo</th>
                        <th className="p-2.5 w-20">Unidad</th>
                        <th className="p-2.5 w-16 text-center">Cant.</th>
                        <th className="p-2.5 w-28 text-right">P. Unit (Bs.)</th>
                        <th className="p-2.5 w-28 text-right">Subtotal</th>
                        <th className="p-2.5 w-28">Documento</th>
                        <th className="p-2.5 w-36">Retención Ley 843</th>
                        <th className="p-2.5 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-medium">
                      {budgetItems.map((item, idx) => {
                        const subtotal = (item.quantity || 1) * (item.unitPrice || 0);
                        return (
                          <tr key={idx} className="hover:bg-muted/20">
                            <td className="p-2.5 text-center font-mono font-bold text-muted-foreground">{idx + 1}</td>
                            <td className="p-2.5">
                              <select
                                value={item.institution}
                                onChange={(e) => handleUpdateBudgetItem(idx, "institution", e.target.value)}
                                className="w-full h-7 rounded border border-input bg-background px-1 text-xs font-semibold"
                              >
                                <option value="UNITEPC">UNITEPC</option>
                                <option value="Externa">Externa</option>
                              </select>
                            </td>
                            <td className="p-2.5">
                              <Input
                                value={item.description}
                                onChange={(e) => handleUpdateBudgetItem(idx, "description", e.target.value)}
                                placeholder="Descripción del bien o servicio..."
                                className="h-7 text-xs font-semibold bg-background"
                              />
                            </td>
                            <td className="p-2.5">
                              <select
                                value={item.purchaseOrLoan}
                                onChange={(e) => handleUpdateBudgetItem(idx, "purchaseOrLoan", e.target.value)}
                                className="w-full h-7 rounded border border-input bg-background px-1 text-xs"
                              >
                                <option value="compra">Compra</option>
                                <option value="Préstamo">Préstamo</option>
                              </select>
                            </td>
                            <td className="p-2.5">
                              <Input
                                value={item.unit}
                                onChange={(e) => handleUpdateBudgetItem(idx, "unit", e.target.value)}
                                className="h-7 text-xs bg-background"
                              />
                            </td>
                            <td className="p-2.5 text-center">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleUpdateBudgetItem(idx, "quantity", Number(e.target.value))}
                                className="h-7 text-xs text-center bg-background"
                              />
                            </td>
                            <td className="p-2.5 text-right">
                              <Input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => handleUpdateBudgetItem(idx, "unitPrice", Number(e.target.value))}
                                className="h-7 text-xs font-bold text-right bg-background"
                              />
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-foreground">
                              Bs. {subtotal.toLocaleString("es-BO")}
                            </td>
                            <td className="p-2.5">
                              <select
                                value={item.docType}
                                onChange={(e) => handleUpdateBudgetItem(idx, "docType", e.target.value)}
                                className="w-full h-7 rounded border border-input bg-background px-1 text-xs font-bold"
                              >
                                <option value="FACTURA">FACTURA (0%)</option>
                                <option value="RETENCIÓN">RETENCIÓN</option>
                              </select>
                            </td>
                            <td className="p-2.5">
                              {item.docType === "RETENCIÓN" ? (
                                <select
                                  value={item.retentionType}
                                  onChange={(e) => handleUpdateBudgetItem(idx, "retentionType", e.target.value)}
                                  className="w-full h-7 rounded border border-input bg-background px-1 text-[11px] font-bold text-amber-500"
                                >
                                  <option value="SERVICIOS">SERVICIOS (15.5%)</option>
                                  <option value="COMPRA">BIENES (8.0%)</option>
                                  <option value="ALQUILERES">ALQUILERES (16.0%)</option>
                                </select>
                              ) : (
                                <span className="text-[11px] text-muted-foreground font-semibold">N/A (Facturado)</span>
                              )}
                            </td>
                            <td className="p-2.5 text-center">
                              <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveBudgetItem(idx)} className="h-6 w-6 text-rose-400 hover:bg-rose-500/10">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TARJETAS DE CÁLCULO FINANCIERO HOMOGÉNEAS CON PROJECT-BUDGET-MODAL */}
              <div className="p-5 rounded-2xl bg-muted/40 border border-border grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-background border border-border shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Presupuesto Bruto Solicitado:</span>
                  <span className="text-2xl font-black text-foreground">Bs. {totalRequestedBudget.toLocaleString("es-BO")}</span>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block">Total Retenciones Impositivas (Ley 843):</span>
                  <span className="text-2xl font-black">Bs. {totalRetentionTax.toLocaleString("es-BO")}</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider block">Monto Neto a Desembolsar:</span>
                  <span className="text-2xl font-black">Bs. {totalNetDisbursement.toLocaleString("es-BO")}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* PIE DE PÁGINA CON BOTONES DE NAVEGACIÓN HOMOGÉNEOS */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between shrink-0">
          <div>
            {activeTab !== "detalle" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab(activeTab === "presupuesto" ? "cronograma" : "detalle")}
                className="font-bold text-xs gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" /> Paso Anterior
              </Button>
            ) : (
              <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-xs">
                Cancelar
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== "presupuesto" ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setActiveTab(activeTab === "detalle" ? "cronograma" : "presupuesto")}
                className="bg-primary hover:bg-primary/90 font-bold text-xs gap-1.5 shadow"
              >
                Siguiente Paso <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleSubmitProposal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-lg"
              >
                <Check className="h-4 w-4" /> Finalizar y Registrar Propuesta
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
