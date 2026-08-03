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
  weeks: string[]; // 20 semanas
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
        name: "Ariel Denys Camara Arze",
        ci: "6522053",
        carrera: "ING. DE SISTEMAS",
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
      }
    ];
  });

  // TAREAS DE CRONOGRAMA WBS (ANEXO 3 - PARTE 3)
  const [wbsTasks] = useState<WbsTaskDocx[]>(() => [
    {
      wbsCode: "1.0",
      title: "Módulo de Recepción",
      description: "Diseño BD y Portal UI/UX",
      progress: "100%",
      responsible: "Equipo Dev",
      startDate: "03-ago",
      endDate: "24-ago",
      weeks: ["X", "X", "X", "X", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    },
    {
      wbsCode: "1.1",
      title: "Diseño Base de Datos",
      description: "Estructuración de tablas",
      progress: "100%",
      responsible: "Desarrollador",
      startDate: "03-ago",
      endDate: "10-ago",
      weeks: ["X", "X", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    },
    {
      wbsCode: "1.2",
      title: "Portal Investigadores",
      description: "Envío de propuestas",
      progress: "100%",
      responsible: "Desarrollador",
      startDate: "17-ago",
      endDate: "24-ago",
      weeks: ["", "", "X", "X", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    },
    {
      wbsCode: "2.0",
      title: "Módulo de Comités",
      description: "Científico y Bioético",
      progress: "60%",
      responsible: "Equipo Dev",
      startDate: "31-ago",
      endDate: "10-oct",
      weeks: ["", "", "", "", "X", "X", "X", "X", "X", "X", "X", "X", "", "", "", "", "", "", "", ""]
    },
    {
      wbsCode: "3.0",
      title: "Módulo de Avances",
      description: "Seguimiento y Artículos",
      progress: "30%",
      responsible: "Equipo Dev",
      startDate: "26-oct",
      endDate: "16-nov",
      weeks: ["", "", "", "", "", "", "", "", "", "", "", "", "X", "X", "X", "X", "", "", "", ""]
    },
    {
      wbsCode: "4.0",
      title: "Módulo Contable",
      description: "Presupuestos y Retenciones",
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
      observations: "Retención 15.5% Ley 843 (IUE 12.5% + IT 3.0%)",
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
      <div className="relative w-full max-w-5xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* BARRA SUPERIOR DE ACCIONES */}
        <div className="px-6 py-3.5 bg-muted/60 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold text-xs">
              {project.code}
            </Badge>
            <span className="text-xs font-bold text-foreground">Documento Oficial PAT UNITEPC (Formato Propuesta Base .DOCX)</span>
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

        {/* VISTA PREVIA DEL DOCUMENTO IMPRESO CON LA ESTRUCTURA EXACTA DE FORMATO PROPUESTA.DOCX */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-slate-950">
          <div 
            ref={printRef}
            className="max-w-[21.59cm] mx-auto bg-white text-slate-900 shadow-2xl rounded-sm p-[2.5cm] space-y-10 font-serif leading-relaxed text-xs border border-slate-300 print:shadow-none print:border-none print:p-0"
            style={{
              minHeight: "27.94cm",
              fontFamily: "'Times New Roman', Times, serif",
              lineHeight: "1.5",
              textAlign: "justify",
            }}
          >

            {/* ============================================================ */}
            {/* ANEXO 1: DECLARACIÓN JURADA                                 */}
            {/* ============================================================ */}
            <div className="space-y-4 page-break-after border-b-2 border-slate-800 pb-8">
              {/* ENCABEZADO CON LOGO OFICIAL UNITEPC */}
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <img
                  src="/unitepc_logo.png"
                  alt="UNITEPC Logo"
                  className="h-14 object-contain"
                />
                <div className="text-right text-[10px] text-slate-600">
                  <p className="font-bold uppercase">UNIVERSIDAD TÉCNICA PRIVADA COSMOS</p>
                  <p>Dirección de Investigación Científica y Tecnológica (DICYT)</p>
                  <p className="font-mono">Gestión Academic {project.managementYear || "2026"}</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <h1 className="text-sm font-extrabold tracking-widest uppercase">ANEXO 1</h1>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">DECLARACIÓN JURADA</h2>
                <p className="text-[10px] italic text-slate-600 mt-0.5">
                  (Debe ser impresa con el logotipo de carrera. Remitir por correo electrónico en formato PDF)
                </p>
              </div>

              <p className="leading-relaxed">
                Quien(es) suscribe(n) certifica(n) que la propuesta de investigación, desarrollo experimental y/o emprendimiento de base tecnológica denominado:
              </p>

              {/* CAJA DE NOMBRE DEL PROYECTO (TABLA 1 DOCX) */}
              <div className="border border-slate-800 p-3 bg-slate-50 font-bold text-center text-xs uppercase tracking-wide">
                {project.title}
              </div>

              <p className="leading-relaxed">
                Esta propuesta es un trabajo original y propio que se pretende ejecutar o implementar en la gestión <strong>{project.managementYear || "2026"}</strong>.
              </p>

              <p className="leading-relaxed">
                No incurre en fraude, plagio o vicios de autoría, en cuyo caso se exime de toda responsabilidad a la Universidad Técnica Privada Cosmos y el(los) autor(es) se declara(n) como único(s) responsable(s).
              </p>

              <p className="font-bold pt-2">
                Lista de todos los miembros del equipo de Investigación:
              </p>

              {/* TABLA DE INTEGRANTES (TABLA 2 DOCX) */}
              <table className="w-full text-left text-[11px] border-collapse border border-slate-800">
                <thead>
                  <tr className="bg-slate-200 font-bold border-b border-slate-800 text-center">
                    <th className="p-1.5 border-r border-slate-800 w-8">N°</th>
                    <th className="p-1.5 border-r border-slate-800">Nombre completo</th>
                    <th className="p-1.5 border-r border-slate-800">C.I.</th>
                    <th className="p-1.5 border-r border-slate-800">Carrera</th>
                    <th className="p-1.5 border-r border-slate-800">Institución</th>
                    <th className="p-1.5 border-r border-slate-800">Profesión / Ocupación</th>
                    <th className="p-1.5 w-24">Firma</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((m) => (
                    <tr key={m.num} className="border-b border-slate-400">
                      <td className="p-1.5 text-center font-bold border-r border-slate-400">{m.num}</td>
                      <td className="p-1.5 font-bold border-r border-slate-400">{m.name}</td>
                      <td className="p-1.5 border-r border-slate-400">{m.ci}</td>
                      <td className="p-1.5 border-r border-slate-400">{m.carrera}</td>
                      <td className="p-1.5 border-r border-slate-400">{m.institution}</td>
                      <td className="p-1.5 border-r border-slate-400">{m.occupation}</td>
                      <td className="p-1.5 text-center font-mono text-[9px] text-emerald-800 font-bold">{m.signature || "Firmado"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* SECCIÓN RESPALDO DE DIRECCIÓN DE CARRERA (TABLA 3 DOCX) */}
              <div className="border border-slate-800 p-4 mt-6 text-center italic text-slate-700 bg-slate-50 font-semibold">
                Firma(s) y sello(s) de la(s) Directores(es) de la(s) carrera que respalda(n) el trabajo.
              </div>
            </div>

            {/* ============================================================ */}
            {/* ANEXO 2: FORMULARIO DE INSCRIPCIÓN                           */}
            {/* ============================================================ */}
            <div className="space-y-4 page-break-after border-b-2 border-slate-800 pb-8 pt-4">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <img
                  src="/unitepc_logo.png"
                  alt="UNITEPC Logo"
                  className="h-14 object-contain"
                />
                <div className="text-right text-[10px] text-slate-600">
                  <p className="font-bold uppercase">UNIVERSIDAD TÉCNICA PRIVADA COSMOS</p>
                  <p>Dirección de Investigación Científica y Tecnológica (DICYT)</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <h1 className="text-sm font-extrabold tracking-widest uppercase">ANEXO 2</h1>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">FORMULARIO DE INSCRIPCIÓN</h2>
                <p className="text-[10px] italic text-slate-600 mt-0.5">
                  (Remitir por correo electrónico en formatos MS Word y PDF)
                </p>
              </div>

              <p className="font-bold">Título completo del trabajo:</p>
              <div className="border border-slate-800 p-3 bg-slate-50 font-bold text-center text-xs uppercase tracking-wide">
                {project.title}
              </div>

              <p className="font-bold pt-2">Participante(es) de la propuesta de Proyecto en orden y Carrera:</p>

              {/* TABLA DE PARTICIPANTES CONTACTO (TABLA 5 DOCX) */}
              <table className="w-full text-left text-[11px] border-collapse border border-slate-800">
                <thead>
                  <tr className="bg-slate-200 font-bold border-b border-slate-800 text-center">
                    <th className="p-1.5 border-r border-slate-800 w-8">N°</th>
                    <th className="p-1.5 border-r border-slate-800">Nombre completo</th>
                    <th className="p-1.5 border-r border-slate-800">C.I.</th>
                    <th className="p-1.5 border-r border-slate-800">Ciudad y país de residencia</th>
                    <th className="p-1.5 border-r border-slate-800">Teléfono</th>
                    <th className="p-1.5">Correo electrónico</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((m) => (
                    <tr key={m.num} className="border-b border-slate-400">
                      <td className="p-1.5 text-center font-bold border-r border-slate-400">{m.num}</td>
                      <td className="p-1.5 font-bold border-r border-slate-400">{m.name}</td>
                      <td className="p-1.5 border-r border-slate-400">{m.ci}</td>
                      <td className="p-1.5 border-r border-slate-400">{m.cityCountry}</td>
                      <td className="p-1.5 border-r border-slate-400">{m.phone}</td>
                      <td className="p-1.5 text-blue-900 font-mono text-[10px]">{m.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ÁREA PERTINENTE */}
              <p className="font-bold pt-2">Área en la que se presenta el trabajo (marcar sólo una con una X):</p>
              <div className="border border-slate-800 p-3 space-y-2 text-xs bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold">[ X ]</span>
                  <span className="font-bold">Ciencias de la Salud & Telemedicina / Tecnología y Sistemas</span>
                  <span className="text-slate-500 italic">({project.facultyArea})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-mono">[  ]</span>
                  <span>Odontología y Biomateriales</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-mono">[  ]</span>
                  <span>Bioquímica y Farmacia</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-mono">[  ]</span>
                  <span>Humanidades, Ciencias Sociales y Administrativas</span>
                </div>
              </div>
              <p className="text-[10px] italic text-slate-600">
                En caso de que un trabajo corresponda a dos o más áreas, se debe priorizar y marcar la de mayor pertinencia.
              </p>
            </div>

            {/* ============================================================ */}
            {/* ANEXO 3: PROPUESTA DE PROYECTO (PARTE 1 Y PARTE 2)            */}
            {/* ============================================================ */}
            <div className="space-y-4 page-break-after border-b-2 border-slate-800 pb-8 pt-4">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <img
                  src="/unitepc_logo.png"
                  alt="UNITEPC Logo"
                  className="h-14 object-contain"
                />
                <div className="text-right text-[10px] text-slate-600">
                  <p className="font-bold uppercase">UNIVERSIDAD TÉCNICA PRIVADA COSMOS</p>
                  <p>Dirección de Investigación Científica y Tecnológica (DICYT)</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <h1 className="text-sm font-extrabold tracking-widest uppercase">ANEXO 3</h1>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">PROPUESTA DE PROYECTO</h2>
                <p className="text-[10px] italic text-slate-600 mt-0.5">
                  (Remitir por correo electrónico en formatos MS Word y PDF)
                </p>
              </div>

              {/* PARTE 1: DATOS GENERALES (TABLAS 9, 10, 11 Y 12 DOCX) */}
              <div className="space-y-3">
                <div>
                  <label className="font-bold uppercase text-[11px]">NOMBRE DEL PROYECTO:</label>
                  <div className="border border-slate-800 p-2.5 bg-slate-50 font-bold uppercase">
                    {project.title}
                  </div>
                </div>

                <div>
                  <label className="font-bold uppercase text-[11px]">GESTORA / DIRECTOR DE PROYECTO:</label>
                  <div className="border border-slate-800 p-2.5 bg-slate-50 font-bold">
                    {project.leadInvestigator || "Dra. Maria Lorena Orellana Aguilar"}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-slate-800 p-2 bg-slate-50">
                    <span className="block text-[10px] font-bold text-slate-600 uppercase">FECHA INICIO PROYECTO</span>
                    <span className="font-mono font-bold">03/08/2026</span>
                  </div>
                  <div className="border border-slate-800 p-2 bg-slate-50">
                    <span className="block text-[10px] font-bold text-slate-600 uppercase">FECHA FINALIZACIÓN</span>
                    <span className="font-mono font-bold">19/12/2026</span>
                  </div>
                  <div className="border border-slate-800 p-2 bg-slate-50">
                    <span className="block text-[10px] font-bold text-slate-600 uppercase">FECHA DE EMISIÓN</span>
                    <span className="font-mono font-bold">{new Date().toLocaleDateString("es-BO")}</span>
                  </div>
                </div>
              </div>

              {/* PARTE 2: ESTRUCTURA CIENTÍFICA (TABLA 8 DOCX) */}
              <div className="space-y-4 pt-4 border-t border-slate-400">
                <h3 className="font-extrabold uppercase text-xs tracking-wider border-b border-slate-800 pb-1">
                  CUERPO CIENTÍFICO DE LA PROPUESTA (ANEXO III PARTE 2)
                </h3>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase">1. Planteamiento del problema y definición del objeto de estudio</h4>
                    <p className="pt-1 text-slate-800 leading-relaxed">{project.abstractText || "El desarrollo del sistema SIGPRI resolverá la ineficiencia en la recepción, evaluación y fiscalización contable de proyectos de investigación."}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase">2. Justificación</h4>
                    <p className="pt-1 text-slate-800 leading-relaxed">
                      Centralizar la recepción de propuestas y habilitar módulos específicos para el Comité Científico y el Comité Bioético reducirá drásticamente los tiempos de evaluación y feedback iterativo.  
                      <strong>Justificación Académica:</strong> El sistema garantizará que todo proyecto financiado concluya de manera estandarizada en la elaboración de un artículo científico original.  
                      <strong>Justificación Administrativa/Contable:</strong> Integrar un módulo financiero permitirá validar cotizaciones, aprobar o rechazar costos y calcular retenciones impositivas en tiempo real.
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
                      <li>Trazabilidad financiera absoluta en tiempo real con cálculo automático de retenciones Ley 843.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase">7. Impactos que se pretenden lograr</h4>
                    <p className="pt-1 text-slate-800 leading-relaxed">
                      Erradicación total de la pérdida de documentos físicos y la redundancia de trámites.  
                      <strong>Impacto Académico y Científico:</strong> Fomento directo e incremento medible en la producción de artículos científicos originales.  
                      <strong>Impacto Económico y Financiero:</strong> Instauración de una cultura de transparencia institucional robusta que blindará a la universidad ante errores de cálculo tributario.
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

            {/* ============================================================ */}
            {/* ANEXO 3 - PARTE 3: CRONOGRAMA WBS / GANTT (TABLA 13 DOCX)     */}
            {/* ============================================================ */}
            <div className="space-y-4 page-break-after border-b-2 border-slate-800 pb-8 pt-4">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <img
                  src="/unitepc_logo.png"
                  alt="UNITEPC Logo"
                  className="h-14 object-contain"
                />
                <div className="text-right text-[10px] text-slate-600">
                  <p className="font-bold uppercase">UNIVERSIDAD TÉCNICA PRIVADA COSMOS</p>
                  <p>Dirección de Investigación Científica y Tecnológica (DICYT)</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <h1 className="text-sm font-extrabold tracking-widest uppercase">CRONOGRAMA DE ACTIVIDADES</h1>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">(ANEXO 3 - PARTE 3)</h2>
                <p className="text-[10px] italic text-slate-600 mt-0.5">
                  Las columnas individuales representan semanas de ejecución (Semanas 1 a 20).
                </p>
              </div>

              {/* TABLA DE CRONOGRAMA WBS COMPLETA */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] border-collapse border border-slate-800">
                  <thead>
                    <tr className="bg-slate-200 font-bold border-b border-slate-800 text-center">
                      <th className="p-1 border-r border-slate-800">WBS</th>
                      <th className="p-1 border-r border-slate-800">Título de Tarea</th>
                      <th className="p-1 border-r border-slate-800">Descripción / Entregable</th>
                      <th className="p-1 border-r border-slate-800">Responsable</th>
                      <th className="p-1 border-r border-slate-800">Inicio</th>
                      <th className="p-1 border-r border-slate-800">Fin</th>
                      <th className="p-1 border-r border-slate-800 w-10">% Avance</th>
                      {Array.from({ length: 12 }).map((_, w) => (
                        <th key={w} className="p-0.5 border-r border-slate-800 text-[9px]">S{w + 1}</th>
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
                        {t.weeks.slice(0, 12).map((w, idx) => (
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
            {/* ANEXO 3 - PARTE 4: PRESUPUESTO Y FISCALIZACIÓN LEY 843        */}
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
                  <p>Dirección de Investigación Científica y Tecnológica (DICYT)</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <h1 className="text-sm font-extrabold tracking-widest uppercase">PRESUPUESTO Y FISCALIZACIÓN IMPOSITIVA</h1>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">(ANEXO 3 - PARTE 4 / LEY 843)</h2>
              </div>

              <table className="w-full text-left text-[11px] border-collapse border border-slate-800">
                <thead>
                  <tr className="bg-slate-200 font-bold border-b border-slate-800 text-center">
                    <th className="p-1.5 border-r border-slate-800 w-8">N°</th>
                    <th className="p-1.5 border-r border-slate-800">Descripción del Gasto</th>
                    <th className="p-1.5 border-r border-slate-800 text-center">Modo</th>
                    <th className="p-1.5 border-r border-slate-800 text-center">Tipo Doc.</th>
                    <th className="p-1.5 border-r border-slate-800 text-center">Categoría Ley 843</th>
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
                  <span className="text-slate-600 block text-[10px]">TOTAL RETENCIONES (LEY 843):</span>
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
    </div>
  );
}
