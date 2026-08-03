"use client";

import { useState, useRef } from "react";
import { 
  Printer, Download, X, FileText, CheckCircle2, Building2, 
  User, Calendar, Calculator, ShieldCheck, Award, FileSpreadsheet,
  Globe, BookOpen, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectItem } from "../page";
import { TeamMember } from "./project-detail-modal";
import { WbsTask } from "./project-wbs-modal";
import { BudgetItemRow } from "./project-budget-modal";

export interface ProjectPdfGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem;
}

export function ProjectPdfGenerator({
  isOpen,
  onClose,
  project,
}: ProjectPdfGeneratorProps) {
  const printRef = useRef<HTMLDivElement>(null);

  // CARGAR INTEGRANTES DE EQUIPO, WBS Y PRESUPUESTO
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`sigpri_team_members_${project.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return [
      {
        id: "mem-1",
        name: project.leadInvestigator || "Dra. Maria Lorena Orellana Aguilar",
        ci: "5489123",
        type: "INTERNO",
        carrera: project.facultyArea || "Medicina",
        institution: "UNITEPC",
        occupation: "Investigador Responsable",
        cityCountry: "Cochabamba - Bolivia",
        phone: "79326793",
        email: "investigacion@unitepc.edu.bo",
        signatureStatus: "Firmado Digitalmente",
        isResponsable: true,
      }
    ];
  });

  const [wbsTasks, setWbsTasks] = useState<WbsTask[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`sigpri_wbs_tasks_${project.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return [
      {
        id: "wbs-1",
        wbsCode: "1.0",
        title: "Fase 1: Revisión Bibliográfica y Protocolo de Investigación",
        description: "Recopilación del estado del arte y definición de instrumentos",
        responsible: project.leadInvestigator,
        startDate: "2026-08-01",
        endDate: "2026-09-15",
        progress: 100,
        status: "COMPLETADO",
        startWeek: 1,
        endWeek: 6,
        isParent: false,
      },
      {
        id: "wbs-2",
        wbsCode: "2.0",
        title: "Fase 2: Trabajo de Campo, Levantamiento de Datos y Experimentos",
        description: "Ejecución del diseño metodológico y recolección de muestras",
        responsible: "Equipo Investigador",
        startDate: "2026-09-16",
        endDate: "2026-11-15",
        progress: 60,
        status: "EN_PROGRESO",
        startWeek: 7,
        endWeek: 14,
        isParent: false,
      },
      {
        id: "wbs-3",
        wbsCode: "3.0",
        title: "Fase 3: Análisis de Resultados e Informe Final (Anexo III)",
        description: "Sistematización de datos y redacción del artículo científico",
        responsible: project.leadInvestigator,
        startDate: "2026-11-16",
        endDate: "2026-12-15",
        progress: 0,
        status: "PENDIENTE",
        startWeek: 15,
        endWeek: 20,
        isParent: false,
      }
    ];
  });

  const [budgetItems, setBudgetItems] = useState<BudgetItemRow[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`sigpri_budget_items_${project.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
    }
    return [
      {
        codeNum: 1,
        institution: "UNITEPC",
        description: "Honorarios de Asistencia de Investigación y Pruebas Especializadas",
        purchaseOrLoan: "compra",
        unit: "Servicio",
        quantity: 1,
        unitPrice: Math.round(project.requestedBudget * 0.6) || 30000,
        docType: "RETENCIÓN",
        retentionType: "SERVICIOS",
        observations: "Sujeto a retención 15.5% Ley 843 (IUE 12.5% + IT 3%)",
      },
      {
        codeNum: 2,
        institution: "UNITEPC",
        description: "Insumos, Reactivos y Materiales de Laboratorio",
        purchaseOrLoan: "compra",
        unit: "Lote",
        quantity: 1,
        unitPrice: Math.round(project.requestedBudget * 0.4) || 20000,
        docType: "FACTURA",
        retentionType: "COMPRA",
        observations: "Factura comercial con NIT de la Universidad",
      }
    ];
  });

  if (!isOpen) return null;

  // CÁLCULOS PRESUPUESTARIOS PARA EL DOCUMENTO OFICIAL
  const grossTotal = budgetItems.reduce((sum, item) => sum + (item.quantity || 1) * (item.unitPrice || 0), 0);
  const taxTotal = budgetItems.reduce((sum, item) => {
    const subtotal = (item.quantity || 1) * (item.unitPrice || 0);
    if (item.docType === "RETENCIÓN") {
      if (item.retentionType === "SERVICIOS") return sum + subtotal * 0.155;
      if (item.retentionType === "COMPRA") return sum + subtotal * 0.08;
      if (item.retentionType === "ALQUILERES") return sum + subtotal * 0.16;
    }
    return sum;
  }, 0);
  const netTotal = grossTotal - taxTotal;

  // FUNCIÓN PARA IMPRIMIR / GENERAR PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* BARRA SUPERIOR DE ACCIONES */}
        <div className="px-6 py-3.5 bg-muted/60 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold text-xs">
              {project.code}
            </Badge>
            <span className="text-xs font-bold text-foreground">Documento Oficial PAT UNITEPC (.PDF)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handlePrint}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-1.5 shadow-md"
            >
              <Printer className="h-4 w-4" />
              <span>🖨️ Imprimir / Guardar como PDF</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* VISTA PREVIA DEL DOCUMENTO IMPRESO SEGÚN NORMATIVA PAT UNITEPC */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-slate-950">
          <div 
            ref={printRef}
            className="max-w-[21.59cm] mx-auto bg-white text-slate-900 shadow-2xl rounded-sm p-[2.5cm] space-y-6 font-serif leading-relaxed text-sm border border-slate-300 print:shadow-none print:border-none print:p-0"
            style={{
              minHeight: "27.94cm",
              fontFamily: "'Times New Roman', Times, serif",
              lineHeight: "1.5",
              textAlign: "justify",
            }}
          >

            {/* CARÁTULA OFICIAL / ENCABEZADO PAT UNITEPC (ANEXO I & II) */}
            <div className="text-center space-y-3 border-b-2 border-slate-900 pb-6 mb-6">
              <div className="flex items-center justify-center gap-3">
                <img
                  src="/sigpri_logo.jpg"
                  alt="UNITEPC Logo"
                  className="h-16 w-16 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div>
                  <h1 className="text-base font-extrabold tracking-wide uppercase">
                    UNIVERSIDAD TÉCNICA PRIVADA COSMOS (UNITEPC)
                  </h1>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    DIRECCIÓN DE INVESTIGACIÓN CIENTÍFICA Y TECNOLÓGICA (DICYT)
                  </h2>
                  <h3 className="text-[11px] font-semibold text-slate-600">
                    PROGRAMA DE ASESORAMIENTO A LA TITULACIÓN (P.A.T.)
                  </h3>
                </div>
              </div>

              <div className="pt-4">
                <span className="text-xs font-mono font-bold text-slate-600 uppercase block">
                  INFORME OFICIAL DE PROYECTO DE INVESTIGACIÓN - GESTIÓN {project.managementYear}
                </span>
                <h2 className="text-lg font-black uppercase text-slate-950 mt-1 leading-snug">
                  {project.title}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-3 text-left border-t border-slate-200">
                <div>
                  <p><strong>Código de Proyecto:</strong> <span className="font-mono font-bold">{project.code}</span></p>
                  <p><strong>Convocatoria Vincular:</strong> {project.callCode || "CONV-1-2026-01"} - {project.callTitle || "Convocatoria Nacional UNITEPC"}</p>
                  <p><strong>Sede / Facultad:</strong> {project.facultyArea}</p>
                </div>
                <div>
                  <p><strong>Investigador Responsable:</strong> {project.leadInvestigator}</p>
                  <p><strong>Estado Oficial:</strong> {project.status}</p>
                  <p><strong>Fecha de Emisión:</strong> {project.createdAt || new Date().toISOString().substring(0, 10)}</p>
                </div>
              </div>
            </div>

            {/* TABLA DE INTEGRANTES DE EQUIPO */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1">
                EQUIPO DE INVESTIGADORES Y COAUTORES
              </h3>
              <table className="w-full text-left text-xs border-collapse border border-slate-400">
                <thead>
                  <tr className="bg-slate-200 font-bold border-b border-slate-400">
                    <th className="p-1.5 border-r border-slate-400">Nombre Completo</th>
                    <th className="p-1.5 border-r border-slate-400">C.I.</th>
                    <th className="p-1.5 border-r border-slate-400">Carrera / Institución</th>
                    <th className="p-1.5 border-r border-slate-400">Rol en Proyecto</th>
                    <th className="p-1.5 text-center">Firma Digital</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((m, i) => (
                    <tr key={i} className="border-b border-slate-300">
                      <td className="p-1.5 font-bold border-r border-slate-300">{m.name}</td>
                      <td className="p-1.5 border-r border-slate-300">{m.ci}</td>
                      <td className="p-1.5 border-r border-slate-300">{m.carrera}</td>
                      <td className="p-1.5 border-r border-slate-300">{m.occupation}</td>
                      <td className="p-1.5 text-center font-mono font-bold text-emerald-800 text-[10px]">{m.signatureStatus || "Firmado Digitalmente"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CUERPO DEL PROYECTO (ESTRUCTURA ANEXO III PARTE 2 - NORMATIVA PAT UNITEPC) */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1">
                ESTRUCTURA CIENTÍFICA Y DELIMITACIÓN (ANEXO III PARTE 2)
              </h3>

              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase">1. PLANTEAMIENTO DEL PROBLEMA Y OBJETO DE ESTUDIO</h4>
                  <p className="text-slate-800 pt-0.5">{project.abstractText || "Formulación clara de la problemática científica, hipótesis de trabajo y alcance del objeto de estudio de la investigación."}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase">2. JUSTIFICACIÓN INSTITUCIONAL Y RELEVANCIA SOCIAL</h4>
                  <p className="text-slate-800 pt-0.5">El proyecto responde a las líneas de investigación prioritarias de UNITEPC, aportando soluciones científicas y tecnológicas a necesidades concretas del entorno socioeconómico regional y nacional.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase">3. ESTADO DEL ARTE Y ANTECEDENTES</h4>
                  <p className="text-slate-800 pt-0.5">Revisión exhaustiva de literatura científica indexada y antecedentes experimentales relevantes para sustentar la metodología propuesta.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase">4. OBJETIVOS</h4>
                  <p className="text-slate-800 pt-0.5"><strong>Objetivo General:</strong> Desarrollar y validar el protocolo de investigación para dar cumplimiento a las metas institucionales de la gestión {project.managementYear}.</p>
                  <p className="text-slate-800 pt-0.5"><strong>Objetivos Específicos:</strong> 1) Sistematizar la literatura de referencia; 2) Ejecutar el diseño metodológico y levantamiento de datos; 3) Analizar y publicar los resultados obtenidos.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase">5. DISEÑO METODOLÓGICO Y EXPERIMENTAL</h4>
                  <p className="text-slate-800 pt-0.5">Enfoque mixto cuantitativo/cualitativo, diseño descriptivo y experimental con control rigoroso de variables y técnicas estadísticas de validación.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase">6. RESULTADOS ESPERADOS E IMPACTOS PRETENDIRDOS</h4>
                  <p className="text-slate-800 pt-0.5">Generación de artículos científicos en revistas indexadas, prototipos tecnológicos y transferencia de conocimiento hacia la comunidad universitaria.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase">7. REFERENCIAS BIBLIOGRÁFICAS (FORMATO APA 7MA EDICIÓN)</h4>
                  <p className="font-mono text-[11px] text-slate-700 pt-0.5">
                    UNITEPC. (2026). Reglamento del Programa de Asesoramiento a la Titulación (P.A.T.) y Guía de Elaboración de Trabajos de Grado. Cochabamba: Editorial UNITEPC.
                  </p>
                </div>
              </div>
            </div>

            {/* CRONOGRAMA DE TRABAJO WBS / EDT */}
            <div className="space-y-2 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1">
                CRONOGRAMA DE ACTIVIDADES Y ESTRUCTURA WBS / EDT
              </h3>
              <table className="w-full text-left text-xs border-collapse border border-slate-400">
                <thead>
                  <tr className="bg-slate-200 font-bold border-b border-slate-400">
                    <th className="p-1.5 border-r border-slate-400 w-16 text-center">WBS</th>
                    <th className="p-1.5 border-r border-slate-400">Fase / Actividad</th>
                    <th className="p-1.5 border-r border-slate-400">Entregable y Alcance</th>
                    <th className="p-1.5 border-r border-slate-400">Responsable</th>
                    <th className="p-1.5 border-r border-slate-400 text-center">Inicio / Cierre</th>
                    <th className="p-1.5 text-center w-16">Avance</th>
                  </tr>
                </thead>
                <tbody>
                  {wbsTasks.map((t, i) => (
                    <tr key={i} className="border-b border-slate-300">
                      <td className="p-1.5 text-center font-mono font-bold border-r border-slate-300">{t.wbsCode}</td>
                      <td className="p-1.5 font-semibold border-r border-slate-300">{t.title}</td>
                      <td className="p-1.5 border-r border-slate-300">{t.description}</td>
                      <td className="p-1.5 border-r border-slate-300">{t.responsible}</td>
                      <td className="p-1.5 text-center font-mono text-[11px] border-r border-slate-300">{t.startDate} - {t.endDate}</td>
                      <td className="p-1.5 text-center font-bold font-mono">{t.progress}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PRESUPUESTO Y FISCALIZACIÓN IMPOSITIVA LEY 843 */}
            <div className="space-y-2 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1">
                PRESUPUESTO DETALLADO Y FISCALIZACIÓN IMPOSITIVA (LEY 843 BOLIVIA)
              </h3>
              <table className="w-full text-left text-xs border-collapse border border-slate-400">
                <thead>
                  <tr className="bg-slate-200 font-bold border-b border-slate-400">
                    <th className="p-1.5 text-center border-r border-slate-400 w-8">N°</th>
                    <th className="p-1.5 border-r border-slate-400">Concepto / Descripción</th>
                    <th className="p-1.5 border-r border-slate-400 text-center">Tipo Doc.</th>
                    <th className="p-1.5 border-r border-slate-400 text-center">Categoría Ley 843</th>
                    <th className="p-1.5 border-r border-slate-400 text-right">Solicitado (Bs.)</th>
                    <th className="p-1.5 text-right">Retención (Bs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetItems.map((item, i) => {
                    const subtotal = (item.quantity || 1) * (item.unitPrice || 0);
                    let tax = 0;
                    if (item.docType === "RETENCIÓN") {
                      if (item.retentionType === "SERVICIOS") tax = subtotal * 0.155;
                      if (item.retentionType === "COMPRA") tax = subtotal * 0.08;
                      if (item.retentionType === "ALQUILERES") tax = subtotal * 0.16;
                    }
                    return (
                      <tr key={i} className="border-b border-slate-300">
                        <td className="p-1.5 text-center font-mono border-r border-slate-300">{i + 1}</td>
                        <td className="p-1.5 font-semibold border-r border-slate-300">{item.description}</td>
                        <td className="p-1.5 text-center font-mono text-[11px] border-r border-slate-300">{item.docType}</td>
                        <td className="p-1.5 text-center border-r border-slate-300">{item.docType === "RETENCIÓN" ? item.retentionType : "N/A (Factura)"}</td>
                        <td className="p-1.5 text-right font-mono font-bold border-r border-slate-300">Bs. {subtotal.toLocaleString("es-BO")}</td>
                        <td className="p-1.5 text-right font-mono font-bold text-amber-900">Bs. {tax.toLocaleString("es-BO")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="p-3 bg-slate-100 border border-slate-400 rounded-sm grid grid-cols-3 gap-2 text-xs text-center font-bold">
                <div>
                  <span className="text-slate-600 block text-[10px]">PRESUPUESTO BRUTO:</span>
                  <span>Bs. {grossTotal.toLocaleString("es-BO")}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">TOTAL RETENCIONES (LEY 843):</span>
                  <span>Bs. {taxTotal.toLocaleString("es-BO")}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">NETO A DESEMBOLSAR:</span>
                  <span className="text-emerald-800 font-extrabold">Bs. {netTotal.toLocaleString("es-BO")}</span>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE FIRMAS Y AVALES INSTITUCIONALES */}
            <div className="pt-12 grid grid-cols-3 gap-6 text-center text-xs">
              <div className="border-t border-slate-800 pt-2">
                <p className="font-bold">{project.leadInvestigator}</p>
                <p className="text-[10px] text-slate-600">Investigador Responsable</p>
                <p className="text-[9px] font-mono text-emerald-800">Firmado Digitalmente</p>
              </div>

              <div className="border-t border-slate-800 pt-2">
                <p className="font-bold">Ing. Jose James Claure Ricaldi</p>
                <p className="text-[10px] text-slate-600">Director DICYT UNITEPC</p>
                <p className="text-[9px] font-mono text-emerald-800">Aval Institucional</p>
              </div>

              <div className="border-t border-slate-800 pt-2">
                <p className="font-bold">Lic. Javier Mercado Rivas</p>
                <p className="text-[10px] text-slate-600">Jefe de Contabilidad & Fiscalización</p>
                <p className="text-[9px] font-mono text-emerald-800">Aprobación Presupuestaria</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
