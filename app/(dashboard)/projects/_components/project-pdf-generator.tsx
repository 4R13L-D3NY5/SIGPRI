"use client";

import { useState, useRef } from "react";
import { 
  Printer, X, FileText, CheckCircle2, Building2, 
  User, Calendar, Calculator, ShieldCheck, Award, FileSpreadsheet,
  Globe, BookOpen, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectItem } from "../page";

export interface TeamMemberDocx {
  num: number;
  name: string;
  ci: string;
  carrera: string;
  institution: string;
  occupation: string;
  phone?: string;
  email?: string;
  cityCountry?: string;
  signature?: string;
}

export interface WbsTaskDocx {
  wbsCode: string;
  title: string;
  description: string;
  progress: string;
  responsible: string;
  startDate: string;
  endDate: string;
  weeks: string[];
}

export interface BudgetItemDocx {
  num: number;
  institution: string;
  description: string;
  mode: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  docType: string;
  retentionType: string;
  observations: string;
}

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

  // INTEGRANTES DE EQUIPO (DECLARACIÓN JURADA ANEXO 1 Y FORMULARIO ANEXO 2)
  const [teamMembers] = useState<TeamMemberDocx[]>(() => {
    return [
      {
        num: 1,
        name: project.leadInvestigator || "Ariel Denys Camara Arze",
        ci: "6522053",
        carrera: project.facultyArea || "ING. DE SISTEMAS",
        institution: "UNITEPC",
        occupation: "DOC. INVESTIGADOR",
        cityCountry: "COCHABAMBA, BOLIVIA",
        phone: "79326793",
        email: "arielcamara@unitepc.edu.bo",
        signature: "Firmado Digitalmente",
      },
      {
        num: 2,
        name: "Harold Marco Antonio Rojas Torres",
        ci: "9465510",
        carrera: "ING. DE SISTEMAS",
        institution: "UNITEPC",
        occupation: "DOC. INVESTIGADOR",
        cityCountry: "COCHABAMBA, BOLIVIA",
        phone: "78311416",
        email: "haroldrojas@unitepc.edu.bo",
        signature: "Firmado Digitalmente",
      },
      {
        num: 3,
        name: "Jose James Claure Ricaldi",
        ci: "5188558",
        carrera: "ING. DE SISTEMAS",
        institution: "UNITEPC",
        occupation: "DIR. CARRERA SISTEMAS",
        cityCountry: "COCHABAMBA, BOLIVIA",
        phone: "72242424",
        email: "jclaure_dis@unitepc.net",
        signature: "Firmado Digitalmente",
      },
    ];
  });

  // TAREAS DEL CRONOGRAMA WBS (ANEXO 3 - PARTE 3) CON 20 SEMANAS
  const [wbsTasks] = useState<WbsTaskDocx[]>(() => [
    {
      wbsCode: "1.0",
      wbsTitle: "Requerimientos y BD",
      title: "Requerimientos y Base de Datos",
      description: "Modelado relacional de la plataforma",
      progress: "100%",
      responsible: "Ing. Ariel Camara",
      startDate: "03-ago",
      endDate: "17-ago",
      weeks: ["X", "X", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    },
    {
      wbsCode: "1.1",
      wbsTitle: "Estructura BD",
      title: "Estructuración de Tablas",
      description: "Esquema relacional y migraciones",
      progress: "100%",
      responsible: "Desarrollador",
      startDate: "03-ago",
      endDate: "10-ago",
      weeks: ["X", "X", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    },
    {
      wbsCode: "1.2",
      wbsTitle: "Portal Investigadores",
      title: "Portal Investigadores",
      description: "Envío de propuestas preliminares",
      progress: "100%",
      responsible: "Desarrollador",
      startDate: "17-ago",
      endDate: "24-ago",
      weeks: ["", "", "X", "X", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    },
    {
      wbsCode: "2.0",
      wbsTitle: "Módulo de Comités",
      title: "Módulo de Comités Evaluadores",
      description: "Dictámenes Científico y Bioético",
      progress: "60%",
      responsible: "Equipo Dev",
      startDate: "31-ago",
      endDate: "10-oct",
      weeks: ["", "", "", "", "X", "X", "X", "X", "X", "X", "X", "X", "", "", "", "", "", "", "", ""]
    },
    {
      wbsCode: "3.0",
      wbsTitle: "Módulo de Avances",
      title: "Módulo de Avances y Artículos",
      description: "Seguimiento WBS y entregable final",
      progress: "30%",
      responsible: "Equipo Dev",
      startDate: "26-oct",
      endDate: "16-nov",
      weeks: ["", "", "", "", "", "", "", "", "", "", "", "", "X", "X", "X", "X", "", "", "", ""]
    },
    {
      wbsCode: "4.0",
      wbsTitle: "Módulo Contable",
      title: "Módulo Contable & Impuestos",
      description: "Presupuestos y retenciones impositivas",
      progress: "0%",
      responsible: "Equipo Dev",
      startDate: "23-nov",
      endDate: "14-dic",
      weeks: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "X", "X", "X", "X"]
    }
  ]);

  // ÍTEMS PRESUPUESTARIOS (ANEXO 3 - PARTE 4)
  const [budgetItems] = useState<BudgetItemDocx[]>(() => [
    {
      num: 1,
      institution: "UNITEPC",
      description: "Servicios de Desarrollo de Software Full-Stack y Arquitectura BD",
      mode: "Compra",
      unit: "Servicio",
      quantity: 1,
      unitPrice: Math.round(project.requestedBudget * 0.6) || 30000,
      docType: "RETENCIÓN",
      retentionType: "SERVICIOS",
      observations: "Retención Impositiva (Servicios 15.5%)",
    },
    {
      num: 2,
      institution: "UNITEPC",
      description: "Servidores Cloud VPS, Licencias de Infraestructura y Dominio Web",
      mode: "Compra",
      unit: "Lote",
      quantity: 1,
      unitPrice: Math.round(project.requestedBudget * 0.4) || 20000,
      docType: "FACTURA",
      retentionType: "COMPRA",
      observations: "Factura Comercial con NIT de la Universidad",
    }
  ]);

  if (!isOpen) return null;

  // CÁLCULOS PRESUPUESTARIOS
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* BARRA SUPERIOR DE ACCIONES */}
        <div className="px-6 py-3.5 bg-muted/60 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold text-xs">
              {project.code}
            </Badge>
            <span className="text-xs font-bold text-foreground">
              Documento Oficial PAT UNITEPC (Tamaño Oficio 8.5&quot;x13&quot; • Salto a Horizontal en Cronograma y Presupuesto)
            </span>
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

        {/* VISTA PREVIA DEL DOCUMENTO IMPRESO CON REGLAS DE IMPRESIÓN OFICIO 8.5x13 Y SALTO A HORIZONTAL */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-slate-950">
          
          {/* ESTILOS CSS REGLAS DE IMPRESIÓN @MEDIA PRINT PARA TAMAÑO OFICIO (8.5x13 in) Y SALTO A HORIZONTAL */}
          <style>{`
            @page {
              size: 8.5in 13in;
              margin: 1.2cm;
            }

            @media print {
              @page {
                size: 8.5in 13in;
                margin: 1.2cm;
              }

              @page landscape-oficio {
                size: 13in 8.5in;
                margin: 1cm;
              }

              html, body {
                background: white !important;
                color: black !important;
                font-size: 11px !important;
              }

              .print-portrait-page {
                page-break-after: always;
                break-after: page;
              }

              .print-landscape-page {
                page-break-before: always;
                break-before: page;
                page: landscape-oficio;
              }

              .no-print {
                display: none !important;
              }
            }
          `}</style>

          <div ref={printRef} className="space-y-8">

            {/* ========================================================================================= */}
            {/* SECCIÓN 1: VERTICAL (PORTRAIT - OFICIO 8.5" x 13") -> ANEXOS 1, 2 Y 3 (PARTE I Y II)      */}
            {/* ========================================================================================= */}
            <div 
              className="print-portrait-page max-w-[21.59cm] mx-auto bg-white text-slate-900 shadow-2xl rounded-sm p-[2cm] space-y-8 font-serif leading-relaxed text-xs border border-slate-300 print:shadow-none print:border-none print:p-0 print:max-w-full"
              style={{
                minHeight: "33.02cm", /* 13 pulgadas de alto */
                width: "21.59cm",     /* 8.5 pulgadas de ancho */
                fontFamily: "'Times New Roman', Times, serif",
                lineHeight: "1.5",
                textAlign: "justify",
              }}
            >
              {/* ============================================================ */}
              {/* ANEXO 1: DECLARACIÓN JURADA                                 */}
              {/* ============================================================ */}
              <div className="space-y-4 border-b-2 border-slate-800 pb-8">
                {/* ENCABEZADO CON LOGO OFICIAL UNITEPC */}
                <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                  <img
                    src="/unitepc_logo.png"
                    alt="UNITEPC Logo"
                    className="h-14 object-contain"
                  />
                  <div className="text-right text-[10px] text-slate-600">
                    <p className="font-bold uppercase">UNIVERSIDAD TÉCNICA PRIVADA COSMOS</p>
                    <p>Dirección de Investigación Científica</p>
                    <p className="font-mono">Gestión Académica {project.managementYear || "2026"}</p>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <h1 className="text-sm font-extrabold tracking-widest uppercase">ANEXO 1</h1>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">DECLARACIÓN JURADA</h2>
                  <p className="text-[10px] italic text-slate-600 mt-0.5">
                    (Debe ser impresa con el logotipo de carrera. Remitir por correo electrónico en formato PDF)
                  </p>
                </div>

                <p className="pt-2">
                  Los postulantes al Fondo Competitivo de Proyectos de Investigación Financiadables UNITEPC declaramos formalmente:
                </p>

                <ol className="list-decimal list-inside space-y-2 pl-2">
                  <li>
                    Que, el proyecto titulado: <strong className="uppercase font-bold text-slate-900">“{project.title}”</strong> es un trabajo original, inédito y de nuestra autoría intelectual.
                  </li>
                  <li>
                    Que no vulnera derechos de propiedad intelectual, derechos de autor ni patente de terceros.
                  </li>
                  <li>
                    Que no ha sido postulado ni se encuentra en proceso de evaluación o financiamiento en otra institución nacional o internacional.
                  </li>
                  <li>
                    Que conocemos y aceptamos a cabalidad el Reglamento General de Investigación y las bases de la Convocatoria {project.campaignCode || "CONV-1-2026-03"}.
                  </li>
                </ol>

                <p className="pt-2">
                  En conformidad con lo expuesto, firmamos la presente declaración a los {new Date().getDate()} días del mes de {new Date().toLocaleString('es-ES', { month: 'long' })} de {project.managementYear || "2026"}.
                </p>

                {/* TABLA DE INTEGRANTES ANEXO 1 */}
                <div className="pt-4">
                  <table className="w-full text-left text-[11px] border-collapse border border-slate-800">
                    <thead>
                      <tr className="bg-slate-200 font-bold border-b border-slate-800 text-center">
                        <th className="p-1.5 border-r border-slate-800 w-8">N°</th>
                        <th className="p-1.5 border-r border-slate-800">Nombre Completo del Investigador</th>
                        <th className="p-1.5 border-r border-slate-800 w-24">C.I.</th>
                        <th className="p-1.5 border-r border-slate-800">Carrera / Unidad</th>
                        <th className="p-1.5 w-32">Firma Digital</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((m) => (
                        <tr key={m.num} className="border-b border-slate-400">
                          <td className="p-1.5 text-center font-mono border-r border-slate-400">{m.num}</td>
                          <td className="p-1.5 font-semibold border-r border-slate-400">{m.name}</td>
                          <td className="p-1.5 text-center font-mono border-r border-slate-400">{m.ci}</td>
                          <td className="p-1.5 border-r border-slate-400">{m.carrera}</td>
                          <td className="p-1.5 text-center font-mono text-[9px] italic text-slate-600">{m.signature || "Firmado"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ============================================================ */}
              {/* ANEXO 2: FORMULARIO DE REGISTRO DE INVESTIGADORES            */}
              {/* ============================================================ */}
              <div className="space-y-4 border-b-2 border-slate-800 pb-8 pt-4">
                <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                  <img
                    src="/unitepc_logo.png"
                    alt="UNITEPC Logo"
                    className="h-14 object-contain"
                  />
                  <div className="text-right text-[10px] text-slate-600">
                    <p className="font-bold uppercase">UNIVERSIDAD TÉCNICA PRIVADA COSMOS</p>
                    <p>Dirección de Investigación Científica</p>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <h1 className="text-sm font-extrabold tracking-widest uppercase">ANEXO 2</h1>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">FORMULARIO DE REGISTRO DE INTEGRANTES DEL EQUIPO</h2>
                </div>

                <div className="space-y-4 pt-2">
                  {teamMembers.map((m) => (
                    <div key={m.num} className="border border-slate-800 p-3 rounded-sm space-y-2 bg-slate-50">
                      <div className="bg-slate-800 text-white px-2 py-0.5 font-bold text-[10px] uppercase flex justify-between">
                        <span>Investigador N° {m.num}: {m.name}</span>
                        <span>{m.occupation}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div><strong>Cédula de Identidad:</strong> {m.ci}</div>
                        <div><strong>Institución:</strong> {m.institution}</div>
                        <div><strong>Carrera / Área:</strong> {m.carrera}</div>
                        <div><strong>Ciudad / País:</strong> {m.cityCountry || "Cochabamba, Bolivia"}</div>
                        <div><strong>Teléfono de Contacto:</strong> {m.phone || "79326793"}</div>
                        <div><strong>Correo Electrónico:</strong> {m.email || "investigacion@unitepc.edu.bo"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ============================================================ */}
              {/* ANEXO 3 - PARTE I Y II: INFORMACIÓN GENERAL Y CUERPO         */}
              {/* ============================================================ */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                  <img
                    src="/unitepc_logo.png"
                    alt="UNITEPC Logo"
                    className="h-14 object-contain"
                  />
                  <div className="text-right text-[10px] text-slate-600">
                    <p className="font-bold uppercase">UNIVERSIDAD TÉCNICA PRIVADA COSMOS</p>
                    <p>Dirección de Investigación Científica</p>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <h1 className="text-sm font-extrabold tracking-widest uppercase">ANEXO 3</h1>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">PERFIL DE PROYECTO DE INVESTIGACIÓN</h2>
                </div>

                {/* PARTE I: INFORMACIÓN GENERAL DEL PROYECTO (TABLA 7 DOCX) */}
                <div className="space-y-3">
                  <div className="bg-slate-200 border border-slate-800 p-2 font-extrabold text-center uppercase tracking-wider text-xs">
                    PARTE I: INFORMACIÓN GENERAL DEL PROYECTO
                  </div>

                  <div className="border border-slate-800 p-3 space-y-2">
                    <div><strong>Título del Proyecto:</strong> {project.title}</div>
                    <div><strong>Código de Registro:</strong> {project.code}</div>
                    <div><strong>Investigador Principal:</strong> {project.leadInvestigator}</div>
                    <div><strong>Facultad / Área Temática:</strong> {project.facultyArea}</div>
                    <div><strong>Sede / Campus UNITEPC:</strong> {project.campus || "Cochabamba - Campus Central"}</div>
                    <div><strong>Gestión Académica de Postulación:</strong> {project.managementYear || "2026"}</div>
                    <div><strong>Convocatoria Referencial:</strong> {project.campaignCode || "CONV-1-2026-03"} ({project.campaignName || "Convocatoria Nacional de Proyectos 2026"})</div>
                  </div>

                  {/* SELECCIÓN DE EJE TEMÁTICO ESTRATÉGICO UNITEPC (TABLA 6 DOCX) */}
                  <div className="border border-slate-800 p-3 space-y-2">
                    <div className="font-bold border-b border-slate-400 pb-1 uppercase">Eje Temático Estratégico UNITEPC Seleccionado:</div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <span className="font-mono text-emerald-800">[ X ]</span>
                        <span>1) Salud Integral, Epidemiología y Biomedicina</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="font-mono">[  ]</span>
                        <span>2) Tecnología, Inteligencia Artificial y Software</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="font-mono">[  ]</span>
                        <span>3) Innovación en Educación Superior</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="font-mono">[  ]</span>
                        <span>4) Ciencias de la Producción e Industria</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PARTE II: CUERPO CIENTÍFICO Y METODOLÓGICO (TABLA 8 DOCX) */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="bg-slate-200 border border-slate-800 p-2 font-extrabold text-center uppercase tracking-wider text-xs">
                    PARTE II: CONTENIDO CIENTÍFICO Y METODOLÓGICO DE LA PROPUESTA
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">1. Planteamiento del problema y definición del objeto de estudio</h4>
                      <p className="pt-1 text-slate-800 leading-relaxed">{project.abstractText || "El desarrollo del sistema SIGPRI resolverá la ineficiencia en la recepción, evaluación y fiscalización contable de proyectos de investigación."}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">2. Justificación</h4>
                      <p className="pt-1 text-slate-800 leading-relaxed">
                        Centralizar la recepción de propuestas y habilitar módulos específicos para el Comité Científico y el Comité Bioético reducirá drásticamente los tiempos de evaluación y feedback iterativo.  
                        <br /><strong>Justificación Académica:</strong> El sistema garantizará que todo proyecto financiado concluya de manera estandarizada en la elaboración de un artículo científico original.  
                        <br /><strong>Justificación Administrativa/Contable:</strong> Integrar un módulo financiero permitirá validar cotizaciones, aprobar o rechazar costos y calcular retenciones impositivas en tiempo real.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">3. Estado del arte</h4>
                      <p className="pt-1 text-slate-800 leading-relaxed">
                        La gestión integral de la investigación universitaria, frecuentemente administrada a través de sistemas CRIS (Current Research Information Systems), ha experimentado una transformación fundamental al integrar dimensiones académicas, éticas y financieras en una única arquitectura tecnológica. Según Ballegooie y Riva (2020), la fragmentación entre los sistemas de revisión por comités y los módulos presupuestarios constituye la principal causa de ineficiencia. SIGPRI adopta estos paradigmas de vanguardia para construir un ecosistema digital cerrado y auditable.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">4. Objetivos</h4>
                      <p className="pt-1 text-slate-800 leading-relaxed font-bold">Objetivo General:</p>
                      <p className="text-slate-800">Desarrollar e implementar el Sistema Integral de Gestión de Proyectos de Investigación (SIGPRI) para administrar la recepción, evaluación por comités, seguimiento de avances, consolidación científica y control contable de los proyectos institucionales.</p>
                      <p className="pt-1 text-slate-800 leading-relaxed font-bold">Objetivos Específicos:</p>
                      <ul className="list-disc list-inside text-slate-800 space-y-0.5 pl-2">
                        <li>Desarrollar módulos de evaluación para el Comité Científico y Bioético (estados: aprobado, corrección, rechazado).</li>
                        <li>Implementar un módulo de seguimiento (Gantt/Cronograma) que supervise el avance hasta la redacción del artículo científico original.</li>
                        <li>Integrar un módulo contable para la validación de costos, cotizaciones, aprobaciones de presupuesto y cálculo automático de retenciones.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">5. Metodología</h4>
                      <p className="pt-1 text-slate-800 leading-relaxed">
                        El desarrollo del sistema SIGPRI se ejecutará en un lapso de 5 meses y estará fundamentado en la metodología ágil Scrum, lo cual permitirá entregas incrementales y una adaptación continua a los requerimientos de la Dirección de Investigación. El proceso iniciará con una fase intensiva de levantamiento de requerimientos y el diseño arquitectónico de una base de datos relacional robusta. Posteriormente, el equipo se enfocará en la construcción Full-Stack de la plataforma, programando los módulos de evaluación iterativa para los Comités Científico y Bioético y el motor contable de retenciones.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">6. Resultados que se esperan</h4>
                      <ul className="list-disc list-inside text-slate-800 space-y-1 pl-2">
                        <li>Implementación de una plataforma web centralizada y 100% funcional que interconecte a investigadores, comités y contabilidad.</li>
                        <li>Reducción drástica en los tiempos de tramitación y retroalimentación eliminando expedientes físicos.</li>
                        <li>Consolidación de un repositorio investigativo estandarizado que garantice entregables científicos verificados.</li>
                        <li>Trazabilidad financiera absoluta en tiempo real con cálculo automático de retenciones e impuestos.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">7. Impactos que se pretenden lograr</h4>
                      <p className="pt-1 text-slate-800 leading-relaxed">
                        Erradicación total de la pérdida de documentos físicos y la redundancia de trámites.  
                        <br /><strong>Impacto Académico y Científico:</strong> Fomento directo e incremento medible en la producción de artículos científicos originales.  
                        <br /><strong>Impacto Económico y Financiero:</strong> Instauración de una cultura de transparencia institucional robusta que blindará a la universidad ante errores de cálculo tributario.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">8. Referencias bibliográficas</h4>
                      <div className="pt-1 text-slate-800 space-y-1 font-mono text-[11px]">
                        <p>Ballegooie, M. van, & Riva, E. (2020). Research management systems and the academic workflow. Journal of Information Science, 46(2), 213-228.</p>
                        <p>Pérez-Martínez, A., Gómez, R., & Silva, C. (2021). Automatización de comités de ética y científicos en plataformas universitarias. Revista Iberoamericana de Tecnología Académica, 12(3), 45-59.</p>
                        <p>Smith, J. R., & Jones, A. B. (2022). Financial traceability in academic R&D: Integrating accounting modules in CRIS systems. Academic Press.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================================= */}
            {/* SECCIÓN 2: HORIZONTAL / LANDSCAPE (OFICIO 13" x 8.5") -> CRONOGRAMA WBS Y PRESUPUESTO    */}
            {/* ========================================================================================= */}
            <div 
              className="print-landscape-page max-w-[33.02cm] mx-auto bg-white text-slate-900 shadow-2xl rounded-sm p-[2cm] space-y-8 font-serif leading-relaxed text-xs border border-slate-300 print:shadow-none print:border-none print:p-0 print:max-w-full"
              style={{
                minHeight: "21.59cm", /* 8.5 pulgadas de alto */
                width: "33.02cm",     /* 13 pulgadas de ancho */
                fontFamily: "'Times New Roman', Times, serif",
                lineHeight: "1.4",
                textAlign: "justify",
              }}
            >
              {/* ============================================================ */}
              {/* ANEXO 3 - PARTE 3: CRONOGRAMA WBS / GANTT (TABLA 13 DOCX)     */}
              {/* ============================================================ */}
              <div className="space-y-4 border-b-2 border-slate-800 pb-8">
                <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                  <img
                    src="/unitepc_logo.png"
                    alt="UNITEPC Logo"
                    className="h-14 object-contain"
                  />
                  <div className="text-right text-[10px] text-slate-600">
                    <p className="font-bold uppercase">UNIVERSIDAD TÉCNICA PRIVADA COSMOS</p>
                    <p>Dirección de Investigación Científica</p>
                    <p className="font-mono text-[9px]">Documento Horizontal (Oficio 13&quot; x 8.5&quot;)</p>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <h1 className="text-sm font-extrabold tracking-widest uppercase">CRONOGRAMA DE ACTIVIDADES WBS (DIAGRAMA DE GANTT)</h1>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">(ANEXO 3 - PARTE 3)</h2>
                  <p className="text-[10px] italic text-slate-600 mt-0.5">
                    Planificación temporal por semanas de ejecución (Semanas 1 a 20).
                  </p>
                </div>

                {/* TABLA DE CRONOGRAMA WBS COMPLETA (20 SEMANAS ANCHO TOTAL) */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10px] border-collapse border border-slate-800">
                    <thead>
                      <tr className="bg-slate-200 font-bold border-b border-slate-800 text-center">
                        <th className="p-1 border-r border-slate-800 w-10">WBS</th>
                        <th className="p-1 border-r border-slate-800 w-36">Título de Tarea</th>
                        <th className="p-1 border-r border-slate-800 w-48">Descripción / Entregable</th>
                        <th className="p-1 border-r border-slate-800 w-28">Responsable</th>
                        <th className="p-1 border-r border-slate-800 w-16">Inicio</th>
                        <th className="p-1 border-r border-slate-800 w-16">Fin</th>
                        <th className="p-1 border-r border-slate-800 w-12">% Avance</th>
                        {Array.from({ length: 20 }).map((_, w) => (
                          <th key={w} className="p-0.5 border-r border-slate-800 text-[8px]">S{w + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {wbsTasks.map((t) => (
                        <tr key={t.wbsCode} className="border-b border-slate-400">
                          <td className="p-1 text-center font-mono font-bold border-r border-slate-400">{t.wbsCode}</td>
                          <td className="p-1 font-bold border-r border-slate-400">{t.title}</td>
                          <td className="p-1 border-r border-slate-400">{t.description}</td>
                          <td className="p-1 border-r border-slate-400">{t.responsible}</td>
                          <td className="p-1 text-center font-mono text-[9px] border-r border-slate-400">{t.startDate}</td>
                          <td className="p-1 text-center font-mono text-[9px] border-r border-slate-400">{t.endDate}</td>
                          <td className="p-1 text-center font-mono font-bold border-r border-slate-400">{t.progress}</td>
                          {t.weeks.map((w, idx) => (
                            <td key={idx} className={`p-0.5 text-center font-mono font-bold border-r border-slate-400 ${w === "X" ? "bg-slate-800 text-white" : ""}`}>
                              {w}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ============================================================ */}
              {/* ANEXO 3 - PARTE 4: PRESUPUESTO Y FISCALIZACIÓN               */}
              {/* ============================================================ */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                  <img
                    src="/unitepc_logo.png"
                    alt="UNITEPC Logo"
                    className="h-14 object-contain"
                  />
                  <div className="text-right text-[10px] text-slate-600">
                    <p className="font-bold uppercase">UNIVERSIDAD TÉCNICA PRIVADA COSMOS</p>
                    <p>Dirección de Investigación Científica</p>
                    <p className="font-mono text-[9px]">Documento Horizontal (Oficio 13&quot; x 8.5&quot;)</p>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <h1 className="text-sm font-extrabold tracking-widest uppercase">PRESUPUESTO Y FISCALIZACIÓN PRESUPUESTARIA</h1>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">(ANEXO 3 - PARTE 4 / PRESUPUESTO)</h2>
                </div>

                <table className="w-full text-left text-[11px] border-collapse border border-slate-800">
                  <thead>
                    <tr className="bg-slate-200 font-bold border-b border-slate-800 text-center">
                      <th className="p-1.5 border-r border-slate-800 w-8">N°</th>
                      <th className="p-1.5 border-r border-slate-800">Descripción del Gasto</th>
                      <th className="p-1.5 border-r border-slate-800 text-center">Modo</th>
                      <th className="p-1.5 border-r border-slate-800 text-center">Tipo Doc.</th>
                      <th className="p-1.5 border-r border-slate-800 text-center">Categoría Impositiva</th>
                      <th className="p-1.5 border-r border-slate-800 text-right">Solicitado (Bs.)</th>
                      <th className="p-1.5 text-right">Retención (Bs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetItems.map((item) => {
                      const subtotal = (item.quantity || 1) * (item.unitPrice || 0);
                      let tax = 0;
                      if (item.docType === "RETENCIÓN") {
                        if (item.retentionType === "SERVICIOS") tax = subtotal * 0.155;
                        if (item.retentionType === "COMPRA") tax = subtotal * 0.08;
                        if (item.retentionType === "ALQUILERES") tax = subtotal * 0.16;
                      }
                      return (
                        <tr key={item.num} className="border-b border-slate-400">
                          <td className="p-1.5 text-center font-mono border-r border-slate-400">{item.num}</td>
                          <td className="p-1.5 font-semibold border-r border-slate-400">{item.description}</td>
                          <td className="p-1.5 text-center border-r border-slate-400">{item.mode}</td>
                          <td className="p-1.5 text-center font-mono border-r border-slate-400">{item.docType}</td>
                          <td className="p-1.5 text-center border-r border-slate-400">{item.docType === "RETENCIÓN" ? item.retentionType : "N/A (Factura)"}</td>
                          <td className="p-1.5 text-right font-mono font-bold border-r border-slate-400">Bs. {subtotal.toLocaleString("es-BO")}</td>
                          <td className="p-1.5 text-right font-mono font-bold text-amber-900">Bs. {tax.toLocaleString("es-BO")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="p-3 bg-slate-100 border border-slate-800 rounded-sm grid grid-cols-3 gap-2 text-xs text-center font-bold">
                  <div>
                    <span className="text-slate-600 block text-[10px]">PRESUPUESTO BRUTO:</span>
                    <span>Bs. {grossTotal.toLocaleString("es-BO")}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block text-[10px]">TOTAL RETENCIONES TRIBUTARIAS:</span>
                    <span>Bs. {taxTotal.toLocaleString("es-BO")}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block text-[10px]">NETO A DESEMBOLSAR:</span>
                    <span className="text-emerald-800 font-extrabold">Bs. {netTotal.toLocaleString("es-BO")}</span>
                  </div>
                </div>

                {/* FIRMAS Y AVALES INSTITUCIONALES */}
                <div className="pt-10 grid grid-cols-3 gap-6 text-center text-xs">
                  <div className="border-t border-slate-800 pt-2">
                    <p className="font-bold">{project.leadInvestigator || "Dra. Maria Lorena Orellana Aguilar"}</p>
                    <p className="text-[10px] text-slate-600">Investigador Responsable</p>
                    <p className="text-[9px] font-mono text-emerald-800">Firmado Digitalmente</p>
                  </div>

                  <div className="border-t border-slate-800 pt-2">
                    <p className="font-bold">Ing. Jose James Claure Ricaldi</p>
                    <p className="text-[10px] text-slate-600">Director de Investigación UNITEPC</p>
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

      </div>
    </div>
  );
}
