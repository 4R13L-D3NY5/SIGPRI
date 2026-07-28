"use client";

import { useState, useEffect } from "react";
import { 
  X, FileText, Calendar, DollarSign, Plus, Trash2, CheckCircle2, 
  ArrowRight, ArrowLeft, Building2, User, UserPlus, Calculator, 
  Layers, Check, Sparkles, BookOpen, AlertCircle
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
  const [activeStep, setActiveStep] = useState<"detalle" | "cronograma" | "presupuesto">("detalle");

  // CÓDIGO AUTOGENERADO Y GESTIÓN
  const generatedCode = `SIGPRI-2026-${String(existingCount + 1).padStart(3, "0")}`;

  // ==========================================
  // ESTADOS - PESTAÑA 1: DETALLE (ANEXO III)
  // ==========================================
  const [title, setTitle] = useState("");
  const [selectedCallCode, setSelectedCallCode] = useState("");
  const [activeCalls, setActiveCalls] = useState<{ code: string; title: string }[]>([]);
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
      title: "Fase 1: Revisión Bibliográfica y Diseño del Protocolo",
      description: "Recopilación de literatura y ajuste metodológico",
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
      title: "Fase 2: Levantamiento de Datos y Pruebas Experimentales",
      description: "Trabajo de campo o pruebas de laboratorio",
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
      title: "Fase 3: Análisis de Resultados e Informe Final (Anexo III)",
      description: "Sostenibilidad, sistematización y redacción final",
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
  // ESTADOS - PESTAÑA 3: PRESUPUESTO (LEY 843)
  // ==========================================
  const [budgetItems, setBudgetItems] = useState<BudgetItemRow[]>([
    {
      codeNum: 1,
      institution: "UNITEPC",
      description: "Honorarios de Asistencia de Investigación y Pruebas",
      purchaseOrLoan: "compra",
      unit: "Servicio",
      quantity: 1,
      unitPrice: 25000,
      docType: "RETENCIÓN",
      retentionType: "SERVICIOS",
      observations: "Sujeto a retención 15.5% Ley 843",
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
      observations: "Factura comercial con NIT UNITEPC",
    }
  ]);

  // CARGAR FACULTADES Y CONVOCATORIAS
  useEffect(() => {
    const facs = getUNITEPCFacultades("Cochabamba");
    setFacultadesList(facs);
    if (facs.length > 0) {
      setFacultad(facs[0]);
      const cars = getUNITEPCCarreras("Cochabamba", facs[0]);
      setCarrerasList(cars);
      if (cars.length > 0) setCarrera(cars[0]);
    }

    // Cargar convocatorias activas desde localStorage
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

  useEffect(() => {
    const cars = getUNITEPCCarreras("Cochabamba", facultad);
    setCarrerasList(cars);
    if (cars.length > 0) setCarrera(cars[0]);
  }, [facultad]);

  if (!isOpen) return null;

  // HANDLERS PARA EQUIPO DE INVESTIGADORES
  const handleAddTeamMember = () => {
    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: "",
      ci: "",
      type: "INTERNO",
      carrera: carrera || "Medicina",
      institution: "UNITEPC",
      occupation: "Investigador Coautor",
      cityCountry: "Cochabamba - Bolivia",
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

  const handleUpdateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  // HANDLERS PARA WBS CRONOGRAMA
  const handleAddWbsTask = () => {
    const nextNum = wbsTasks.length + 1;
    const newTask: WbsTask = {
      id: `wbs-${Date.now()}`,
      wbsCode: `${nextNum}.0`,
      title: `Fase ${nextNum}: Nueva Actividad de Investigación`,
      description: "Descripción de los entregables y alcance",
      responsible: leadInvestigator || "Investigador",
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

  // HANDLERS PARA PRESUPUESTO
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

  // CÁLCULOS FINANCIEROS Y DE IMPUESTOS (LEY 843)
  const totalRequestedBudget = budgetItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const totalRetentionTax = budgetItems.reduce((sum, item) => {
    const subtotal = item.quantity * item.unitPrice;
    if (item.docType === "RETENCIÓN") {
      if (item.retentionType === "SERVICIOS") return sum + subtotal * 0.155;
      if (item.retentionType === "COMPRA") return sum + subtotal * 0.08;
      if (item.retentionType === "ALQUILERES") return sum + subtotal * 0.16;
    }
    return sum;
  }, 0);

  const totalNetDisbursement = totalRequestedBudget - totalRetentionTax;

  // SUBMIT FINAL DE LA NUEVA PROPUESTA CON SUS 3 SECCIONES COMPLETAS
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
      abstractText: anexoSections.problema || "Propuesta registrada unificadamente con Detalle (Anexo III), Cronograma WBS y Presupuesto Ley 843.",
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
          notes: "Registro unificado de propuesta académica con Detalle, Cronograma WBS y Presupuesto de Fiscalización.",
        }
      ]
    };

    onSave(newProjectItem, wbsTasks, budgetItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* ENCABEZADO PRINCIPAL DE LA PROPUESTA */}
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground font-black flex items-center justify-center shadow">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold text-xs">
                  {generatedCode}
                </Badge>
                <span className="text-xs text-muted-foreground font-semibold">Registro de Nueva Propuesta DICYT</span>
              </div>
              <h2 className="text-lg font-bold text-foreground tracking-tight leading-tight">
                {title ? title : "Postular Nueva Propuesta de Investigación"}
              </h2>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* NAVEGADOR DE LOS 3 APARTADOS (DETALLE, CRONOGRAMA, PRESUPUESTO) */}
        <div className="px-6 py-2.5 bg-background border-b border-border flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStep("detalle")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeStep === "detalle"
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>1. Detalle (Anexo III)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep("cronograma")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeStep === "cronograma"
                  ? "bg-amber-600 text-white shadow"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>2. Cronograma WBS / EDT</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveStep("presupuesto")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeStep === "presupuesto"
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground"
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span>3. Presupuesto & Retenciones</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Avance:</span>
            <Badge variant="outline" className="font-bold text-[11px] bg-primary/10 border-primary/20 text-primary">
              {activeStep === "detalle" ? "Paso 1 de 3" : activeStep === "cronograma" ? "Paso 2 de 3" : "Paso 3 de 3"}
            </Badge>
          </div>
        </div>

        {/* CONTENIDO SCROLLABLE DE LOS 3 PASOS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ========================================================= */}
          {/* PESTAÑA 1: DETALLE DE LA PROPUESTA (ANEXO III PARTE 2) */}
          {/* ========================================================= */}
          {activeStep === "detalle" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* DATOS GENERALES Y VINCULACIÓN CON CONVOCATORIA */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" /> Identificación General y Convocatoria
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8 space-y-1">
                    <label className="text-xs font-bold text-foreground">Título de la Propuesta / Proyecto *</label>
                    <Input
                      placeholder="Ingrese el título completo de la investigación..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="font-semibold text-sm bg-background"
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

                  <div className="md:col-span-4 space-y-1">
                    <label className="text-xs font-bold text-foreground">Facultad / Área *</label>
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

                  <div className="md:col-span-4 space-y-1">
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

                  <div className="md:col-span-4 space-y-1">
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

              {/* EQUIPO DE INVESTIGADORES */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <User className="h-4 w-4 text-primary" /> Equipo de Investigadores Postulantes
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Registre al docente responsable y coinvestigadores del equipo</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={handleAddTeamMember} className="text-xs font-bold gap-1">
                    <UserPlus className="h-3.5 w-3.5" /> Añadir Integrante
                  </Button>
                </div>

                <div className="space-y-2">
                  {teamMembers.map((m, idx) => (
                    <div key={m.id} className="p-3 rounded-lg border border-border bg-muted/10 grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                      <div className="md:col-span-4">
                        <label className="text-[10px] font-bold text-muted-foreground block">Nombre Completo</label>
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
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-muted-foreground block">C.I. / Documento</label>
                        <Input
                          value={m.ci}
                          onChange={(e) => handleUpdateTeamMember(m.id, "ci", e.target.value)}
                          placeholder="C.I."
                          className="h-8 text-xs bg-background"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-[10px] font-bold text-muted-foreground block">Correo Electrónico</label>
                        <Input
                          value={m.email}
                          onChange={(e) => handleUpdateTeamMember(m.id, "email", e.target.value)}
                          placeholder="correo@unitepc.edu.bo"
                          className="h-8 text-xs bg-background"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-muted-foreground block">Rol en Equipo</label>
                        <Input
                          value={m.occupation}
                          onChange={(e) => handleUpdateTeamMember(m.id, "occupation", e.target.value)}
                          placeholder="Ej: Coinvestigador"
                          className="h-8 text-xs bg-background"
                        />
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        {idx > 0 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTeamMember(m.id)} className="h-7 w-7 text-rose-400 hover:bg-rose-500/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* APARTADOS DEL ANEXO III PARTE 2 */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <FileText className="h-4 w-4" /> Desarrollo del Perfil / Proyecto (Estructura Anexo III Parte 2)
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Desarrolle minuciosamente los apartados científicos requeridos para la gestión</p>
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
                      placeholder="Formulación clara de la problemática, hipótesis y delimitación del objeto de estudio..."
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">2. Justificación Institucional y Académica *</label>
                    <textarea
                      rows={2}
                      value={anexoSections.justificacion}
                      onChange={(e) => setAnexoSections({ ...anexoSections, justificacion: e.target.value })}
                      placeholder="Justificación técnica, relevancia social, económica o aporte al desarrollo regional..."
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">3. Estado del Arte *</label>
                    <textarea
                      rows={2}
                      value={anexoSections.estadoDelArte}
                      onChange={(e) => setAnexoSections({ ...anexoSections, estadoDelArte: e.target.value })}
                      placeholder="Antecedentes científicos, literatura relevante e investigaciones previas..."
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">4. Objetivos (General y Específicos) *</label>
                    <textarea
                      rows={2}
                      value={anexoSections.objetivos}
                      onChange={(e) => setAnexoSections({ ...anexoSections, objetivos: e.target.value })}
                      placeholder="Objetivo General y lista cuantificable de Objetivos Específicos..."
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">5. Metodología y Diseño Experimental *</label>
                    <textarea
                      rows={3}
                      value={anexoSections.metodologia}
                      onChange={(e) => setAnexoSections({ ...anexoSections, metodologia: e.target.value })}
                      placeholder="Tipo de investigación, universo, muestra, técnicas de recolección de datos y procedimientos..."
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">6. Resultados Esperados</label>
                      <textarea
                        rows={2}
                        value={anexoSections.resultados}
                        onChange={(e) => setAnexoSections({ ...anexoSections, resultados: e.target.value })}
                        placeholder="Productos tangibles, patentes, prototipos o publicaciones..."
                        className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">7. Impactos Pretendidos</label>
                      <textarea
                        rows={2}
                        value={anexoSections.impactos}
                        onChange={(e) => setAnexoSections({ ...anexoSections, impactos: e.target.value })}
                        placeholder="Impacto científico, tecnológico, social o académico..."
                        className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">8. Referencias Bibliográficas (Formato APA v7)</label>
                    <textarea
                      rows={2}
                      value={anexoSections.referencias}
                      onChange={(e) => setAnexoSections({ ...anexoSections, referencias: e.target.value })}
                      placeholder="Citas bibliográficas en formato APA 7ma Edición..."
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PESTAÑA 2: CRONOGRAMA DE TRABAJO (WBS / EDT) */}
          {/* ========================================================= */}
          {activeStep === "cronograma" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> Estructura de Desglose del Trabajo (WBS / EDT)
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Defina las fases, hitos y actividades planificadas para el proyecto</p>
                  </div>
                  <Button type="button" size="sm" onClick={handleAddWbsTask} className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1">
                    <Plus className="h-4 w-4" /> Añadir Fase WBS
                  </Button>
                </div>

                <div className="space-y-3 pt-2">
                  {wbsTasks.map((task, idx) => (
                    <div key={task.id} className="p-3.5 rounded-xl border border-border bg-card space-y-2 shadow-sm">
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <Badge variant="outline" className="font-mono bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold text-xs">
                            {task.wbsCode}
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

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 text-xs">
                        <div className="md:col-span-6 space-y-0.5">
                          <label className="text-[10px] font-bold text-muted-foreground">Descripción del Entregable</label>
                          <Input
                            value={task.description}
                            onChange={(e) => handleUpdateWbsTask(task.id, "description", e.target.value)}
                            placeholder="Entregables esperados..."
                            className="h-7 text-xs bg-background"
                          />
                        </div>
                        <div className="md:col-span-3 space-y-0.5">
                          <label className="text-[10px] font-bold text-muted-foreground">Fecha Inicio</label>
                          <Input
                            type="date"
                            value={task.startDate}
                            onChange={(e) => handleUpdateWbsTask(task.id, "startDate", e.target.value)}
                            className="h-7 text-xs bg-background"
                          />
                        </div>
                        <div className="md:col-span-3 space-y-0.5">
                          <label className="text-[10px] font-bold text-muted-foreground">Fecha Cierre</label>
                          <Input
                            type="date"
                            value={task.endDate}
                            onChange={(e) => handleUpdateWbsTask(task.id, "endDate", e.target.value)}
                            className="h-7 text-xs bg-background"
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
          {/* PESTAÑA 3: PRESUPUESTO & RETENCIONES IMPOSITIVAS (LEY 843) */}
          {/* ========================================================= */}
          {activeStep === "presupuesto" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* TABLA DE ÍTEMS PRESUPUESTARIOS */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Calculator className="h-4 w-4" /> Desglose de Gastos y Categorización Tributaria (Ley 843)
                    </h3>
                    <p className="text-[11px] text-muted-foreground">Especifique cada ítem requerido, indicando si cuenta con Factura o Retención impositiva</p>
                  </div>
                  <Button type="button" size="sm" onClick={handleAddBudgetItem} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1">
                    <Plus className="h-4 w-4" /> Añadir Ítem Presupuestario
                  </Button>
                </div>

                <div className="space-y-3 pt-2">
                  {budgetItems.map((item, idx) => {
                    const subtotal = item.quantity * item.unitPrice;
                    return (
                      <div key={idx} className="p-3.5 rounded-xl border border-border bg-card space-y-2 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                          <div className="md:col-span-5">
                            <label className="text-[10px] font-bold text-muted-foreground block">Concepto / Descripción del Gasto</label>
                            <Input
                              value={item.description}
                              onChange={(e) => handleUpdateBudgetItem(idx, "description", e.target.value)}
                              placeholder="Ej: Honorarios de Asistencia de Investigación"
                              className="h-8 font-semibold text-xs bg-background"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-muted-foreground block">Tipo de Documento</label>
                            <select
                              value={item.docType}
                              onChange={(e) => handleUpdateBudgetItem(idx, "docType", e.target.value)}
                              className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              <option value="FACTURA">FACTURA (0%)</option>
                              <option value="RETENCIÓN">RETENCIÓN (Ley 843)</option>
                            </select>
                          </div>

                          {item.docType === "RETENCIÓN" && (
                            <div className="md:col-span-2">
                              <label className="text-[10px] font-bold text-muted-foreground block">Categoría Tributaria</label>
                              <select
                                value={item.retentionType}
                                onChange={(e) => handleUpdateBudgetItem(idx, "retentionType", e.target.value)}
                                className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                              >
                                <option value="SERVICIOS">SERVICIOS (15.5%)</option>
                                <option value="COMPRA">BIENES (8.0%)</option>
                                <option value="ALQUILERES">ALQUILERES (16.0%)</option>
                              </select>
                            </div>
                          )}

                          <div className={item.docType === "RETENCIÓN" ? "md:col-span-2" : "md:col-span-4"}>
                            <label className="text-[10px] font-bold text-muted-foreground block">Monto Solicitado (Bs.)</label>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleUpdateBudgetItem(idx, "unitPrice", Number(e.target.value))}
                              className="h-8 font-bold text-xs bg-background text-right"
                            />
                          </div>

                          <div className="md:col-span-1 flex justify-end">
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveBudgetItem(idx)} className="h-7 w-7 text-rose-400 hover:bg-rose-500/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RESUMEN DE CÁLCULO DE IMPUESTOS */}
              <div className="p-5 rounded-2xl bg-muted/40 border border-border grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-background border border-border">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Presupuesto Bruto Solicitado:</span>
                  <span className="text-xl font-black text-foreground">Bs. {totalRequestedBudget.toLocaleString("es-BO")}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
                  <span className="text-[10px] font-bold uppercase tracking-wider block">Total Retenciones (Ley 843):</span>
                  <span className="text-xl font-black">Bs. {totalRetentionTax.toLocaleString("es-BO")}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider block">Monto Neto a Desembolsar:</span>
                  <span className="text-xl font-black">Bs. {totalNetDisbursement.toLocaleString("es-BO")}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* PIE DE PÁGINA CON BOTONES DE NAVEGACIÓN */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between shrink-0">
          <div>
            {activeStep !== "detalle" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveStep(activeStep === "presupuesto" ? "cronograma" : "detalle")}
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
            {activeStep !== "presupuesto" ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setActiveStep(activeStep === "detalle" ? "cronograma" : "presupuesto")}
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
