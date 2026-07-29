"use client";

import { useState } from "react";
import { 
  X, BookOpen, Sparkles, ArrowRight, CheckCircle2, AlertCircle, 
  FileText, Calendar, Calculator, UserPlus, ShieldCheck, Check, 
  HelpCircle, Download, Layers, RefreshCw, ChevronRight, Award,
  Building2, User, Lock, ExternalLink
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
  triggerButtonText = "📖 Guía de Postulación de Propuestas DICYT",
  triggerButtonVariant = "outline",
  triggerButtonClassName = "font-bold text-xs gap-2 shadow-sm border-primary/30 text-primary hover:bg-primary/10",
}: ProposalTutorialModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleOpen = () => {
    if (externalIsOpen === undefined) setInternalIsOpen(true);
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
      {/* BOTÓN DISPARADOR (RENDERIZADO SI NO ES CONTROLADO EXTERNAMENTE) */}
      {externalIsOpen === undefined && (
        <Button
          type="button"
          variant={triggerButtonVariant}
          className={triggerButtonClassName}
          onClick={handleOpen}
        >
          <BookOpen className="h-4 w-4 text-primary animate-pulse" />
          <span>{triggerButtonText}</span>
          <Badge variant="outline" className="ml-1 font-mono text-[9px] bg-primary/10 text-primary border-primary/20">
            Diagrama SVG
          </Badge>
        </Button>
      )}

      {/* MODAL DE TUTORIAL Y DIAGRAMA DE SECUENCIA */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200">
            
            {/* ENCABEZADO DEL MODAL */}
            <div className="px-6 py-4 border-b border-border bg-muted/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground font-black flex items-center justify-center shadow-md">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold text-xs">
                      Normativa DICYT UNITEPC
                    </Badge>
                    <span className="text-xs text-muted-foreground font-semibold">Diagrama de Secuencia y Guía Completa</span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground tracking-tight leading-tight mt-0.5">
                    ¿Cómo Registrar y Postular una Propuesta de Investigación?
                  </h2>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* CONTENIDO PRINCIPAL SCROLLABLE */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* ========================================================= */}
              {/* SECCIÓN 1: DIAGRAMA DE SECUENCIA SVG ILUSTRATIVO EN VIVO */}
              {/* ========================================================= */}
              <div className="p-5 rounded-2xl border border-primary/30 bg-muted/20 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Diagrama de Flujo y Secuencia del Proceso de Registro
                  </h3>
                  <Badge variant="outline" className="font-bold text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                    Proceso Oficial UNITEPC 2026
                  </Badge>
                </div>

                {/* SVG VECTOR DIAGRAM COMPONENT */}
                <div className="w-full overflow-x-auto rounded-xl border border-border bg-slate-950 p-4 shadow-2xl">
                  <svg
                    viewBox="0 0 1000 440"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full min-w-[850px] h-auto select-none"
                  >
                    <defs>
                      <linearGradient id="grad-line" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="grad-node-1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1E293B" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </linearGradient>
                      <linearGradient id="grad-active" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0F2A4A" />
                        <stop offset="100%" stopColor="#1E3A8A" />
                      </linearGradient>
                    </defs>

                    {/* LÍNEA DE CONEXIÓN PRINCIPAL CON FLECHAS */}
                    <path
                      d="M 100 120 L 290 120 L 480 120 L 670 120 L 860 120"
                      stroke="url(#grad-line)"
                      strokeWidth="3"
                      strokeDasharray="6 6"
                    />

                    {/* FASES SUPERIORES (PASOS EN LÍNEA) */}
                    
                    {/* PASO 1: REGISTRO DE CUENTA */}
                    <g transform="translate(40, 60)">
                      <rect x="0" y="0" width="130" height="120" rx="16" fill="url(#grad-node-1)" stroke="#3B82F6" strokeWidth="2" />
                      <circle cx="65" cy="35" r="20" fill="#3B82F6" fillOpacity="0.2" stroke="#3B82F6" strokeWidth="2" />
                      <text x="65" y="40" textAnchor="middle" fill="#60A5FA" fontSize="14" fontWeight="bold">1</text>
                      <text x="65" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">Creación Cuenta</text>
                      <text x="65" y="92" textAnchor="middle" fill="#94A3B8" fontSize="9">Investigador UNITEPC</text>
                    </g>
                    <path d="M 175 120 L 205 120" stroke="#3B82F6" strokeWidth="2" markerEnd="url(#arrow)" />

                    {/* PASO 2: REGISTRO INICIAL PROPUESTA */}
                    <g transform="translate(225, 60)">
                      <rect x="0" y="0" width="130" height="120" rx="16" fill="url(#grad-node-1)" stroke="#8B5CF6" strokeWidth="2" />
                      <circle cx="65" cy="35" r="20" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="2" />
                      <text x="65" y="40" textAnchor="middle" fill="#A78BFA" fontSize="14" fontWeight="bold">2</text>
                      <text x="65" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">Registro Propuesta</text>
                      <text x="65" y="92" textAnchor="middle" fill="#94A3B8" fontSize="9">SIGPRI-2026-XXX</text>
                    </g>
                    <path d="M 360 120 L 390 120" stroke="#8B5CF6" strokeWidth="2" />

                    {/* PASO 3: COMPLETAR LOS 3 APARTADOS (DETALLE, CRONOGRAMA, PRESUPUESTO) */}
                    <g transform="translate(415, 45)">
                      <rect x="0" y="0" width="150" height="150" rx="16" fill="url(#grad-active)" stroke="#F59E0B" strokeWidth="2.5" />
                      <circle cx="75" cy="30" r="18" fill="#F59E0B" fillOpacity="0.2" stroke="#F59E0B" strokeWidth="2" />
                      <text x="75" y="35" textAnchor="middle" fill="#FBBF24" fontSize="13" fontWeight="bold">3</text>
                      <text x="75" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">3 Apartados Clave</text>
                      
                      {/* BOTONES 1, 2, 3 */}
                      <rect x="15" y="78" width="120" height="18" rx="5" fill="#1E293B" stroke="#3B82F6" strokeWidth="1" />
                      <text x="75" y="91" textAnchor="middle" fill="#93C5FD" fontSize="8" fontWeight="bold">📄 1. Detalle (Anexo III)</text>

                      <rect x="15" y="100" width="120" height="18" rx="5" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" />
                      <text x="75" y="113" textAnchor="middle" fill="#FDE047" fontSize="8" fontWeight="bold">📅 2. Cronograma WBS</text>

                      <rect x="15" y="122" width="120" height="18" rx="5" fill="#1E293B" stroke="#10B981" strokeWidth="1" />
                      <text x="75" y="135" textAnchor="middle" fill="#6EE7B7" fontSize="8" fontWeight="bold">📗 3. Presupuesto Ley 843</text>
                    </g>
                    <path d="M 570 120 L 600 120" stroke="#F59E0B" strokeWidth="2" />

                    {/* PASO 4: EVALUACIÓN COMITÉ CIENTÍFICO Y BIOÉTICO */}
                    <g transform="translate(605, 60)">
                      <rect x="0" y="0" width="130" height="120" rx="16" fill="url(#grad-node-1)" stroke="#EC4899" strokeWidth="2" />
                      <circle cx="65" cy="35" r="20" fill="#EC4899" fillOpacity="0.2" stroke="#EC4899" strokeWidth="2" />
                      <text x="65" y="40" textAnchor="middle" fill="#F472B6" fontSize="14" fontWeight="bold">4</text>
                      <text x="65" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">Dictamen Comité</text>
                      <text x="65" y="92" textAnchor="middle" fill="#94A3B8" fontSize="9">Evaluación /100 Pts</text>
                    </g>

                    {/* RAMIFICACIÓN DE DECISIÓN (APROBADO vs OBSERVADO) */}
                    
                    {/* CAMINO 1: OBSERVACIONES Y CORRECCIÓN (HACIA ABAJO CON RETORNO) */}
                    <path d="M 670 185 L 670 260 L 490 260 L 490 200" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                    <g transform="translate(540, 240)">
                      <rect x="0" y="0" width="140" height="40" rx="8" fill="#881337" stroke="#F43F5E" strokeWidth="1.5" />
                      <text x="70" y="18" textAnchor="middle" fill="#FECDD3" fontSize="10" fontWeight="bold">⚠️ En Observación</text>
                      <text x="70" y="32" textAnchor="middle" fill="#FDA4AF" fontSize="8">Reenviar con Correcciones</text>
                    </g>

                    {/* CAMINO 2: APROBACIÓN Y EJECUCIÓN (HACIA PASO 5 DERECHA) */}
                    <path d="M 740 120 L 785 120" stroke="#10B981" strokeWidth="2.5" />
                    
                    {/* PASO 5: APROBADO EN EJECUCIÓN Y DESEMBOLSO */}
                    <g transform="translate(790, 60)">
                      <rect x="0" y="0" width="140" height="120" rx="16" fill="url(#grad-node-1)" stroke="#10B981" strokeWidth="2.5" />
                      <circle cx="70" cy="35" r="20" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2" />
                      <text x="70" y="40" textAnchor="middle" fill="#34D399" fontSize="14" fontWeight="bold">5</text>
                      <text x="70" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">🚀 Aprobado en Ejecución</text>
                      <text x="70" y="92" textAnchor="middle" fill="#6EE7B7" fontSize="9">Desembolso & Seguimiento</text>
                    </g>

                    {/* LEYENDA INFORMATIVA ABAJO DEL SVG */}
                    <g transform="translate(40, 340)">
                      <rect x="0" y="0" width="920" height="75" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="1" />
                      <text x="20" y="25" fill="#38BDF8" fontSize="11" fontWeight="bold">💡 Resumen de Requisitos Normativos DICYT UNITEPC:</text>
                      <text x="20" y="45" fill="#94A3B8" fontSize="10">• Anexo III Parte 2: Redacción científica estructurada (Problema, Objetivos, Metodología, APA 7) y equipo con C.I. y firma digital.</text>
                      <text x="20" y="62" fill="#94A3B8" fontSize="10">• Cronograma WBS (Semanas 1-22) y Presupuesto con Fiscalización Ley 843 (Facturas o Retenciones 15.5% Servicios / 8.0% Bienes / 16.0% Alquileres).</text>
                    </g>

                  </svg>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECCIÓN 2: GUÍA PASO A PASO EN PESTAÑAS DETALLADAS */}
              {/* ========================================================= */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" /> Explicación Detallada de Cada Paso del Proceso
                  </h3>
                  <span className="text-xs text-muted-foreground font-medium">Seleccione un paso para ver sus detalles</span>
                </div>

                {/* BOTONES DE PESTAÑA PARA LOS 5 PASOS */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { num: 1, title: "1. Cuenta Investigador", icon: UserPlus, color: "border-sky-500/30 text-sky-500" },
                    { num: 2, title: "2. Registro Propuesta", icon: Plus, color: "border-purple-500/30 text-purple-500" },
                    { num: 3, title: "3. Los 3 Apartados", icon: FileText, color: "border-amber-500/30 text-amber-500" },
                    { num: 4, title: "4. Dictamen Comité", icon: ShieldCheck, color: "border-pink-500/30 text-pink-500" },
                    { num: 5, title: "5. Aprobación & Fondos", icon: CheckCircle2, color: "border-emerald-500/30 text-emerald-500" },
                  ].map((tab) => (
                    <button
                      key={tab.num}
                      type="button"
                      onClick={() => setActiveStepTab(tab.num)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
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

                {/* CONTENIDO EXPLICATIVO SEGÚN PESTAÑA SELECCIONADA */}
                <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
                  
                  {activeStepTab === 1 && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        <UserPlus className="h-5 w-5" /> Paso 1: Creación de Cuenta y Perfil de Investigador
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Todo docente o estudiante postulante debe contar con una cuenta institucional registrada en la plataforma SIGPRI UNITEPC. El registro valida el C.I., la Sede Universitaria (`Cochabamba`, `La Paz`, `Santa Cruz`, `Cobija`, `Ivirgarzama`, `Puerto Quijarro`) y la Carrera respectiva.
                      </p>
                      <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1 font-mono">
                        <div className="font-bold text-foreground">💡 Roles Disponibles en el Portal:</div>
                        <div className="text-muted-foreground">• <strong>Investigador / Docente:</strong> Postula proyectos, completa Anexo III, carga cronograma y presupuesto.</div>
                        <div className="text-muted-foreground">• <strong>Jefe de Investigación:</strong> Supervisa convocatorias y valida cumplimientos.</div>
                      </div>
                    </div>
                  )}

                  {activeStepTab === 2 && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 text-purple-500 font-bold text-sm">
                        <Plus className="h-5 w-5" /> Paso 2: Registro Inicial de la Propuesta de Investigación
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        En el directorio de proyectos, haga clic en el botón <strong>"+ Registrar Nueva Propuesta"</strong>. Complete los datos básicos iniciales: Título de la investigación, Convocatoria vincular activa, Sede, Facultad, Carrera y Nombre del Investigador Responsable.
                      </p>
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1">
                        <div className="font-bold text-purple-500">✨ Asignación de Código Oficial:</div>
                        <p className="text-muted-foreground">El sistema asignará automáticamente un código correlativo (ej: <code>SIGPRI-2026-004</code>) y el estado inicial <code>🌱 1. En Propuesta</code>.</p>
                      </div>
                    </div>
                  )}

                  {activeStepTab === 3 && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                        <FileText className="h-5 w-5" /> Paso 3: Estructuración de los 3 Apartados del Proyecto
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Una vez registrada la propuesta, acceda a ella en el listado y utilice los 3 botones principales de su tarjeta para completar la información:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                        <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 space-y-1">
                          <div className="font-bold text-xs text-primary flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" /> 📄 Botón 1: Detalle (Anexo III)
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-snug">
                            Estructura el Perfil según normativa PAT UNITEPC APA v7 (Problema, Objetivos, Metodología, Impactos, APA 7) y equipo con C.I. y correo.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1">
                          <div className="font-bold text-xs text-amber-500 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" /> 📅 Botón 2: Cronograma WBS
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-snug">
                            Define la Estructura de Desglose del Trabajo WBS (Fases 1.0, 2.0...), entregables esperados, responsable y rango de fechas.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                          <div className="font-bold text-xs text-emerald-500 flex items-center gap-1">
                            <Calculator className="h-3.5 w-3.5" /> 📗 Botón 3: Presupuesto Ley 843
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-snug">
                            Ingresa el desglose de ítems, seleccionando FACTURA o RETENCIÓN (Servicios 15.5%, Bienes 8%, Alquileres 16%) con cálculo automático.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStepTab === 4 && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 text-pink-500 font-bold text-sm">
                        <ShieldCheck className="h-5 w-5" /> Paso 4: Evaluación por Comité Científico y Bioético
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Al enviar la propuesta a revisión, su estado pasa a <code>🔍 2. En Evaluación</code>. Los evaluadores asignados del Comité Científico y Bioético califican la propuesta sobre 100 puntos y registran sus observaciones.
                      </p>
                      <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs space-y-1">
                        <div className="font-bold text-pink-500">⚖️ Dictámenes Posibles:</div>
                        <div className="text-muted-foreground">• <strong>Favorable (&gt;= 70 pts):</strong> Pasa a aprobación y desembolso por Contabilidad.</div>
                        <div className="text-muted-foreground">• <strong>Con Observaciones:</strong> Pasa al estado <code>⚠️ 3. En Observación</code> para correcciones del investigador.</div>
                      </div>
                    </div>
                  )}

                  {activeStepTab === 5 && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                        <CheckCircle2 className="h-5 w-5" /> Paso 5: Aprobación, Desembolso y Ejecución WBS
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Con el dictamen favorable del comité y la aprobación financiera de Contabilidad, el proyecto pasa oficialmente al estado <code>🚀 4. Aprobado en Ejecución</code>.
                      </p>
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                        <div className="font-bold text-emerald-500">💰 Desembolso & Seguimiento Semanal:</div>
                        <p className="text-muted-foreground">Se habilita el desembolso del monto neto aprobado y el seguimiento semanal del avance WBS en la plataforma.</p>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* PIE DE PÁGINA DEL MODAL */}
            <div className="px-6 py-4 border-t border-border bg-muted/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <Shield className="h-4 w-4 text-primary" />
                <span>Dirección de Investigación Científica y Tecnológica (DICYT UNITEPC)</span>
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

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
