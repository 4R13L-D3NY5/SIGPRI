"use client";

import { useState } from "react";
import { 
  X, BookOpen, Sparkles, ArrowRight, CheckCircle2, AlertCircle, 
  FileText, Calendar, Calculator, UserPlus, ShieldCheck, Check, 
  HelpCircle, Download, Layers, RefreshCw, ChevronRight, Award,
  Building2, User, Lock, ExternalLink, Plus, Eye, Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface ProposalTutorialModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  triggerButtonText?: string;
  triggerButtonVariant?: "default" | "outline" | "secondary" | "ghost";
  triggerButtonClassName?: string;
}

export function ProposalTutorialModal({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  triggerButtonText = "📖 Guía & Flujo de Postulación",
  triggerButtonVariant = "outline",
  triggerButtonClassName = "font-bold text-xs gap-2 shadow-sm border-primary/30 text-primary hover:bg-primary/10",
}: ProposalTutorialModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"diagrama" | "pasos" | "requisitos">("diagrama");
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [zoomSvg, setZoomSvg] = useState<boolean>(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleOpen = () => {
    if (externalIsOpen === undefined) {
      setInternalIsOpen(true);
    }
  };

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  return (
    <>
      {/* BOTÓN DISPARADOR INTERNO SI NO SE CONTROLA EXTERNAMENTE */}
      {externalIsOpen === undefined && (
        <Button
          type="button"
          variant={triggerButtonVariant}
          className={triggerButtonClassName}
          onClick={handleOpen}
        >
          <BookOpen className="h-4 w-4 text-primary" />
          <span>{triggerButtonText}</span>
        </Button>
      )}

      {/* MODAL DE TUTORIAL Y DIAGRAMA DE SECUENCIA */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200">
            
            {/* ENCABEZADO PRINCIPAL DEL MODAL */}
            <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-muted/50 via-card to-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground font-black flex items-center justify-center shadow-md">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold text-xs">
                      Normativa UNITEPC
                    </Badge>
                    <span className="text-xs text-muted-foreground font-semibold">Guía Completa de Postulación de Proyectos</span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground tracking-tight leading-tight mt-0.5">
                    Tutorial e Instructivo del Investigador UNITEPC
                  </h2>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* PESTAÑAS PRINCIPALES DEL TUTORIAL */}
            <div className="px-6 py-2.5 bg-background border-b border-border flex items-center justify-between gap-2 overflow-x-auto shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalTab("diagrama")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    modalTab === "diagrama"
                      ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>📊 1. Diagrama de Secuencia (SVG)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab("pasos")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    modalTab === "pasos"
                      ? "bg-amber-600 text-white shadow-md ring-2 ring-amber-500/30"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  <span>📖 2. Paso a Paso Explicativo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab("requisitos")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    modalTab === "requisitos"
                      ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/30"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>📋 3. Requisitos & Anexos I, II, III</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <Badge variant="outline" className="font-bold text-[11px] bg-primary/10 border-primary/20 text-primary">
                  Proceso UNITEPC 2026
                </Badge>
              </div>
            </div>

            {/* CONTENIDO SCROLLABLE */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* ========================================================= */}
              {/* PESTAÑA 1: DIAGRAMA DE SECUENCIA SVG ILUSTRATIVO EN VIVO */}
              {/* ========================================================= */}
              {modalTab === "diagrama" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="p-5 rounded-2xl border border-primary/30 bg-muted/20 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                      <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-2">
                          <Sparkles className="h-4 w-4" /> Diagrama de Secuencia y Flujo del Proceso
                        </h3>
                        <p className="text-[11px] text-muted-foreground">Flujo secuencial desde la creación de cuenta hasta la aprobación y desembolso</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setZoomSvg(!zoomSvg)}
                        className="text-xs font-bold gap-1.5 self-start sm:self-auto"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>{zoomSvg ? "Restablecer Tamaño" : "Ampliar Vista"}</span>
                      </Button>
                    </div>

                    {/* SVG VECTOR DIAGRAM CON DEFS Y MARKERS 100% VÁLIDOS */}
                    <div className={`w-full overflow-x-auto rounded-xl border border-border bg-slate-950 p-4 shadow-2xl transition-all ${zoomSvg ? "max-h-[75vh]" : ""}`}>
                      <svg
                        viewBox="0 0 1000 440"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full min-w-[880px] h-auto select-none"
                      >
                        <defs>
                          {/* MARKER FLECHA */}
                          <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="7"
                            refX="9"
                            refY="3.5"
                            orient="auto"
                          >
                            <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
                          </marker>
                          <marker
                            id="arrowhead-green"
                            markerWidth="10"
                            markerHeight="7"
                            refX="9"
                            refY="3.5"
                            orient="auto"
                          >
                            <polygon points="0 0, 10 3.5, 0 7" fill="#10B981" />
                          </marker>

                          {/* GRADIENTES */}
                          <linearGradient id="grad-line" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
                            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.9" />
                          </linearGradient>

                          <linearGradient id="grad-node-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1E293B" />
                            <stop offset="100%" stopColor="#0F172A" />
                          </linearGradient>

                          <linearGradient id="grad-active-node" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0F2A4A" />
                            <stop offset="100%" stopColor="#1E3A8A" />
                          </linearGradient>
                        </defs>

                        {/* LÍNEA DE CONEXIÓN PRINCIPAL */}
                        <path
                          d="M 90 120 L 280 120 L 470 120 L 660 120 L 850 120"
                          stroke="url(#grad-line)"
                          strokeWidth="3"
                          strokeDasharray="6 6"
                        />

                        {/* PASO 1: CREACIÓN DE CUENTA */}
                        <g transform="translate(30, 50)">
                          <rect x="0" y="0" width="135" height="135" rx="16" fill="url(#grad-node-bg)" stroke="#3B82F6" strokeWidth="2" />
                          <circle cx="67" cy="35" r="20" fill="#3B82F6" fillOpacity="0.25" stroke="#3B82F6" strokeWidth="2" />
                          <text x="67" y="40" textAnchor="middle" fill="#60A5FA" fontSize="14" fontWeight="bold">1</text>
                          <text x="67" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">1. Registro Cuenta</text>
                          <text x="67" y="96" textAnchor="middle" fill="#94A3B8" fontSize="9">Docente / Investigador</text>
                          <text x="67" y="112" textAnchor="middle" fill="#60A5FA" fontSize="8" fontStyle="italic">C.I. & Sede UNITEPC</text>
                        </g>

                        {/* PASO 2: REGISTRO PROPUESTA */}
                        <g transform="translate(220, 50)">
                          <rect x="0" y="0" width="135" height="135" rx="16" fill="url(#grad-node-bg)" stroke="#8B5CF6" strokeWidth="2" />
                          <circle cx="67" cy="35" r="20" fill="#8B5CF6" fillOpacity="0.25" stroke="#8B5CF6" strokeWidth="2" />
                          <text x="67" y="40" textAnchor="middle" fill="#A78BFA" fontSize="14" fontWeight="bold">2</text>
                          <text x="67" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">2. Crear Propuesta</text>
                          <text x="67" y="96" textAnchor="middle" fill="#94A3B8" fontSize="9">SIGPRI-2026-XXX</text>
                          <text x="67" y="112" textAnchor="middle" fill="#A78BFA" fontSize="8" fontStyle="italic">🌱 En Propuesta</text>
                        </g>

                        {/* PASO 3: COMPLETAR 3 APARTADOS (DETALLE, CRONOGRAMA, PRESUPUESTO) */}
                        <g transform="translate(410, 35)">
                          <rect x="0" y="0" width="160" height="165" rx="18" fill="url(#grad-active-node)" stroke="#F59E0B" strokeWidth="2.5" />
                          <circle cx="80" cy="30" r="18" fill="#F59E0B" fillOpacity="0.25" stroke="#F59E0B" strokeWidth="2" />
                          <text x="80" y="35" textAnchor="middle" fill="#FBBF24" fontSize="13" fontWeight="bold">3</text>
                          <text x="80" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">3 Apartados Clave</text>
                          
                          {/* BOTONES DENTRO DEL PASO 3 */}
                          <rect x="15" y="74" width="130" height="22" rx="6" fill="#1E293B" stroke="#3B82F6" strokeWidth="1" />
                          <text x="80" y="88" textAnchor="middle" fill="#93C5FD" fontSize="8.5" fontWeight="bold">📄 1. Detalle (Anexo III)</text>

                          <rect x="15" y="102" width="130" height="22" rx="6" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
                          <text x="80" y="116" textAnchor="middle" fill="#FDE047" fontSize="8.5" fontWeight="bold">📅 2. Cronograma WBS</text>

                          <rect x="15" y="130" width="130" height="22" rx="6" fill="#1E293B" stroke="#10B981" strokeWidth="1" />
                          <text x="80" y="144" textAnchor="middle" fill="#6EE7B7" fontSize="8.5" fontWeight="bold">📗 3. Presupuesto & Retenciones</text>
                        </g>

                        {/* PASO 4: COMITÉ CIENTÍFICO Y BIOÉTICO */}
                        <g transform="translate(615, 50)">
                          <rect x="0" y="0" width="135" height="135" rx="16" fill="url(#grad-node-bg)" stroke="#EC4899" strokeWidth="2" />
                          <circle cx="67" cy="35" r="20" fill="#EC4899" fillOpacity="0.25" stroke="#EC4899" strokeWidth="2" />
                          <text x="67" y="40" textAnchor="middle" fill="#F472B6" fontSize="14" fontWeight="bold">4</text>
                          <text x="67" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">4. Dictamen Comité</text>
                          <text x="67" y="96" textAnchor="middle" fill="#94A3B8" fontSize="9">Evaluación /100 Pts</text>
                          <text x="67" y="112" textAnchor="middle" fill="#F472B6" fontSize="8" fontStyle="italic">🔍 En Evaluación</text>
                        </g>

                        {/* PASO 5: APROBADO EN EJECUCIÓN */}
                        <g transform="translate(805, 50)">
                          <rect x="0" y="0" width="145" height="135" rx="16" fill="url(#grad-node-bg)" stroke="#10B981" strokeWidth="2.5" />
                          <circle cx="72" cy="35" r="20" fill="#10B981" fillOpacity="0.25" stroke="#10B981" strokeWidth="2" />
                          <text x="72" y="40" textAnchor="middle" fill="#34D399" fontSize="14" fontWeight="bold">5</text>
                          <text x="72" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">5. Aprobado Ejecución</text>
                          <text x="72" y="96" textAnchor="middle" fill="#6EE7B7" fontSize="9">Desembolso Fondos</text>
                          <text x="72" y="112" textAnchor="middle" fill="#34D399" fontSize="8" fontStyle="italic">🚀 4. En Ejecución</text>
                        </g>

                        {/* RAMIFICACIÓN DE OBSERVACIÓN Y REVISION ABAJO */}
                        <path d="M 680 185 L 680 255 L 490 255 L 490 200" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                        <g transform="translate(540, 235)">
                          <rect x="0" y="0" width="140" height="38" rx="8" fill="#881337" stroke="#F43F5E" strokeWidth="1.5" />
                          <text x="70" y="16" textAnchor="middle" fill="#FECDD3" fontSize="9.5" fontWeight="bold">⚠️ En Observación</text>
                          <text x="70" y="30" textAnchor="middle" fill="#FDA4AF" fontSize="8">Reenviar con Correcciones</text>
                        </g>

                        {/* RESUMEN DE LEYENDA ABAJO */}
                        <g transform="translate(30, 335)">
                          <rect x="0" y="0" width="920" height="75" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
                          <text x="20" y="24" fill="#38BDF8" fontSize="11" fontWeight="bold">💡 Leyenda de Flujo y Requisitos Normativos UNITEPC:</text>
                          <text x="20" y="43" fill="#94A3B8" fontSize="10">• Anexo III Parte 2: Formulación científica completa (Problema, Objetivos, Metodología, Impactos, APA 7) y Equipo con C.I.</text>
                          <text x="20" y="60" fill="#94A3B8" fontSize="10">• Cronograma WBS (Semanas 1-22) y Presupuesto Financiero (Facturas o Retenciones impositivas de Servicios / Bienes / Alquileres).</text>
                        </g>

                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* PESTAÑA 2: PASO A PASO EXPLICATIVO INTERACTIVO */}
              {/* ========================================================= */}
              {modalTab === "pasos" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" /> Explicación Detallada de los 5 Pasos del Proceso
                    </h3>
                    <span className="text-xs text-muted-foreground font-medium">Haga clic en un paso para ver sus requisitos</span>
                  </div>

                  {/* SELECTOR DE LOS 5 PASOS */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {[
                      { num: 1, title: "1. Cuenta Investigador", icon: UserPlus, color: "border-sky-500/30 text-sky-500" },
                      { num: 2, title: "2. Crear Propuesta", icon: Plus, color: "border-purple-500/30 text-purple-500" },
                      { num: 3, title: "3. Los 3 Apartados", icon: FileText, color: "border-amber-500/30 text-amber-500" },
                      { num: 4, title: "4. Dictamen Comité", icon: ShieldCheck, color: "border-pink-500/30 text-pink-500" },
                      { num: 5, title: "5. Aprobación & Fondos", icon: CheckCircle2, color: "border-emerald-500/30 text-emerald-500" },
                    ].map((tab) => (
                      <button
                        key={tab.num}
                        type="button"
                        onClick={() => setActiveStepTab(tab.num)}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          activeStepTab === tab.num
                            ? "bg-primary text-primary-foreground font-bold shadow-md border-primary"
                            : "bg-muted/30 hover:bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <tab.icon className="h-4 w-4" />
                          <Badge variant="outline" className={`text-[9px] font-mono font-bold ${activeStepTab === tab.num ? "bg-primary-foreground/20 text-primary-foreground border-transparent" : tab.color}`}>
                            Paso {tab.num}
                          </Badge>
                        </div>
                        <span className="text-xs font-semibold leading-tight">{tab.title}</span>
                      </button>
                    ))}
                  </div>

                  {/* CAJA DE DETALLE DEL PASO SELECCIONADO */}
                  <div className="p-5 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
                    {activeStepTab === 1 && (
                      <div className="space-y-3 animate-in fade-in duration-150">
                        <div className="flex items-center gap-2 text-primary font-bold text-sm">
                          <UserPlus className="h-5 w-5" /> Paso 1: Creación de Cuenta y Perfil de Investigador
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Todo docente o estudiante de la universidad debe contar con una cuenta institucional registrada en la plataforma SIGPRI UNITEPC. Al registrarse se valida su C.I., Sede Universitaria (`Cochabamba`, `La Paz`, `Santa Cruz`, `Cobija`, `Ivirgarzama`, `Puerto Quijarro`) y la Carrera correspondiente.
                        </p>
                      </div>
                    )}

                    {activeStepTab === 2 && (
                      <div className="space-y-3 animate-in fade-in duration-150">
                        <div className="flex items-center gap-2 text-purple-500 font-bold text-sm">
                          <Plus className="h-5 w-5" /> Paso 2: Registro Inicial de la Propuesta de Investigación
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          En el directorio de proyectos, presione el botón <strong>"+ Registrar Nueva Propuesta"</strong>. Ingrese el Título de la propuesta, Convocatoria vincular activa, Sede, Facultad, Carrera y el nombre del Investigador Responsable.
                        </p>
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1">
                          <div className="font-bold text-purple-500">✨ Código Autogenerado:</div>
                          <p className="text-muted-foreground">El sistema asignará el código correlativo <code>SIGPRI-2026-XXX</code> y el estado inicial <code>🌱 1. En Propuesta</code>.</p>
                        </div>
                      </div>
                    )}

                    {activeStepTab === 3 && (
                      <div className="space-y-3 animate-in fade-in duration-150">
                        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                          <FileText className="h-5 w-5" /> Paso 3: Estructuración de los 3 Apartados del Proyecto
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          En la tarjeta de la propuesta registrada, haga clic en los 3 botones principales para completar el proyecto:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                          <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 space-y-1">
                            <div className="font-bold text-xs text-primary flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" /> 📄 1. Detalle (Anexo III)
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug">
                              Formulación científica completa PAT UNITEPC APA v7 (Problema, Objetivos, Metodología, APA 7) y equipo de coinvestigadores.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1">
                            <div className="font-bold text-xs text-amber-500 flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" /> 📅 2. Cronograma WBS
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug">
                              Plan de trabajo estructurado por Fases (WBS 1.0, 2.0...), entregables esperados, responsable y rango de fechas.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                            <div className="font-bold text-xs text-emerald-500 flex items-center gap-1">
                              <Calculator className="h-3.5 w-3.5" /> 📗 3. Presupuesto & Retenciones
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug">
                              Tabla de gastos indicando FACTURA o RETENCIÓN (Servicios 15.5%, Bienes 8%, Alquileres 16%) con cálculo automático.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStepTab === 4 && (
                      <div className="space-y-3 animate-in fade-in duration-150">
                        <div className="flex items-center gap-2 text-pink-500 font-bold text-sm">
                          <ShieldCheck className="h-5 w-5" /> Paso 4: Dictamen del Comité Científico y Bioético
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          La propuesta es enviada a revisión y pasa a <code>🔍 2. En Evaluación</code>. Los comités evalúan la pertinencia, calidad científica y aspectos éticos emitiendo un puntaje sobre 100 Pts.
                        </p>
                      </div>
                    )}

                    {activeStepTab === 5 && (
                      <div className="space-y-3 animate-in fade-in duration-150">
                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                          <CheckCircle2 className="h-5 w-5" /> Paso 5: Aprobación en Ejecución y Desembolso
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Con dictamen favorable (&gt;= 70 Pts) y visto bueno contable, la propuesta pasa a <code>🚀 4. Aprobado en Ejecución</code>, habilitando el desembolso de fondos y la fiscalización del avance WBS.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* PESTAÑA 3: REQUISITOS Y ANEXOS I, II, III */}
              {/* ========================================================= */}
              {modalTab === "requisitos" && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <FileText className="h-4 w-4" /> Checklist de Requisitos Normativos UNITEPC
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-card border border-border space-y-2">
                        <span className="font-bold text-foreground block">📄 Anexo III Parte 2 (Perfil de Proyecto):</span>
                        <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                          <li>Planteamiento del Problema y Objeto de Estudio.</li>
                          <li>Justificación Institucional y Académica.</li>
                          <li>Estado del Arte con citas bibliográficas.</li>
                          <li>Objetivos (General y Específicos).</li>
                          <li>Metodología y Diseño Experimental.</li>
                          <li>Resultados e Impactos Pretendidos.</li>
                          <li>Referencias Bibliográficas en APA 7ma Edición.</li>
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-card border border-border space-y-2">
                        <span className="font-bold text-foreground block">📗 Presupuesto & Fiscalización Impositiva:</span>
                        <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                          <li>Desglose detallado por ítem y cantidad.</li>
                          <li>Factura comercial con NIT de la Universidad.</li>
                          <li>Retención impositiva para servicios (15.5%).</li>
                          <li>Retención impositiva para compras (8.0%).</li>
                          <li>Retención impositiva para alquileres (16.0%).</li>
                          <li>Firma digital y visto bueno de Contabilidad.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* PIE DE PÁGINA DEL MODAL */}
            <div className="px-6 py-4 border-t border-border bg-muted/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Dirección de Investigación Científica UNITEPC</span>
              </div>
              <Button type="button" size="sm" onClick={handleClose} className="bg-primary hover:bg-primary/90 font-bold text-xs gap-1.5 shadow">
                Entendido / Cerrar Guía <Check className="h-4 w-4" />
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
