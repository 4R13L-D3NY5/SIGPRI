"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, BookOpen, Building2, CheckCircle2, ChevronRight, ExternalLink, 
  FileCheck, FileText, Globe, Lock, Mail, RefreshCw, Search, Send, 
  Shield, ShieldCheck, Sparkles, User, Users, Calendar, DollarSign, 
  Layers, MapPin, Phone, HelpCircle, ArrowRight, Check, Rocket, FileSpreadsheet
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ElegantToast, ToastState } from "@/components/ui/elegant-toast";
import { ProposalTutorialModal } from "@/components/proposal-tutorial-modal";
import { UNITEPC_SEDES_DATA, getUNITEPCFacultades, getUNITEPCCarreras } from "@/lib/unitepc-structure";

// CONVOCATORIAS VIGENTES 2026
const CAMPAIGNS_DATA = [
  {
    code: "CONV-1-2026-03",
    title: "Convocatoria Nacional de Proyectos de Investigación 2026",
    scope: "Nacional (Todas las Sedes UNITEPC)",
    area: "Multidisciplinario & Tecnología",
    budgetPool: "Bs. 150.000",
    maxPerProject: "Hasta Bs. 50.000",
    deadline: "30 de Septiembre, 2026",
    badgeColor: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    description: "Orientada a proyectos de investigación aplicada en salud, desarrollo tecnológico e innovación con impacto directo en Bolivia.",
  },
  {
    code: "CONV-2-2026-01",
    title: "Fondo Especial de Investigación en Ciencias de la Salud & Bioética",
    scope: "Facultades de Odontología, Medicina, Bioquímica y Enfermería",
    area: "Salud Integral & Biomedicina",
    budgetPool: "Bs. 80.000",
    maxPerProject: "Hasta Bs. 30.000",
    deadline: "15 de Octubre, 2026",
    badgeColor: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    description: "Financiamiento enfocado en estudios clínicos, ensayos bioéticos, salud comunitaria y prevención biológica.",
  },
  {
    code: "CONV-3-2026-02",
    title: "Fondo de Innovación Tecnológica, Inteligencia Artificial & Software",
    scope: "Facultad de Ciencias de la Tecnología / Ingeniería",
    area: "Software, IA & Robótica",
    budgetPool: "Bs. 100.000",
    maxPerProject: "Hasta Bs. 40.000",
    deadline: "30 de Noviembre, 2026",
    badgeColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    description: "Proyectos de desarrollo de software, automatización, inteligencia artificial y transferencia tecnológica.",
  },
];

// EJES TEMÁTICOS ESTRATÉGICOS UNITEPC
const EJE_TEMATICO_OPTIONS = [
  "1) Salud Integral, Epidemiología y Biomedicina",
  "2) Tecnología, Inteligencia Artificial y Software",
  "3) Innovación en Educación Superior",
  "4) Ciencias de la Producción e Industria",
  "5) Educación y Salud",
  "6) Biodiversidad y Medio Ambiente",
  "7) Arte, Cultura y Literatura",
];

// PROYECTOS FINANCIADOS Y APROBADOS (DIVULGACIÓN PÚBLICA)
const PUBLIC_PROJECTS = [
  {
    code: "SIGPRI-2026-001",
    title: "Desarrollo del Sistema de Gestión de Proyectos de Investigación (SIGPRI)",
    researcher: "Ing. Ariel Denys Camara Arze",
    faculty: "Facultad de Ciencias de la Tecnología / Ingeniería",
    campus: "Cochabamba - Campus Central",
    area: "Ingeniería de Sistemas / Software",
    budget: "Bs. 50.000",
    status: "4. Aprobado en Ejecución",
    summary: "Plataforma web integral para la recepción de propuestas, evaluación por comités y fiscalización impositiva de retenciones.",
  },
  {
    code: "SIGPRI-2026-002",
    title: "Síntesis Nanotecnológica de Hidroxiapatita a partir de Cáscaras de Huevo para Regeneración Ósea",
    researcher: "Dr. Roberto Carlos Villarroel M.",
    faculty: "Facultad de Odontología y Ciencias de la Salud",
    campus: "Cochabamba - Campus Central",
    area: "Biomedicina & Odontología",
    budget: "Bs. 38.000",
    status: "2. En Evaluación",
    summary: "Investigación aplicada para la creación de injertos biomédicos económicos a partir de desechos orgánicos avícolas.",
  },
  {
    code: "SIGPRI-2025-044",
    title: "Evaluación Epidemiológica y Resistencia Antimicrobiana en Cepas Hospitalarias",
    researcher: "Dra. Carmen Rosa Morales Arispe",
    faculty: "Facultad de Ciencias de la Salud / Bioquímica",
    campus: "La Paz - Sede Central",
    area: "Salud Pública & Microbiología",
    budget: "Bs. 42.000",
    status: "6. Publicado",
    summary: "Estudio multicéntrico de resistencia a antibióticos con publicación de artículo científico en revista indexada.",
  },
];

export default function PublicPortalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // ESTADO DEL FORMULARIO WEB DE POSTULACIÓN
  const [formData, setFormData] = useState({
    campaignCode: "CONV-1-2026-03",
    leadInvestigator: "",
    ci: "",
    email: "",
    phone: "",
    sede: "Cochabamba",
    facultad: "Facultad de Ciencias de la Salud",
    carrera: "Medicina",
    ejeTematico: EJE_TEMATICO_OPTIONS[0],
    title: "",
    abstractText: "",
    requestedBudget: 25000,
  });

  // SEDES, FACULTADES Y CARRERAS DINÁMICAS
  const sedesList = Object.keys(UNITEPC_SEDES_DATA);
  const [facultadesList, setFacultadesList] = useState<string[]>([]);
  const [carrerasList, setCarrerasList] = useState<string[]>([]);

  useEffect(() => {
    const facs = getUNITEPCFacultades(formData.sede);
    setFacultadesList(facs);
    if (facs.length > 0) {
      const firstFac = facs[0];
      const cars = getUNITEPCCarreras(formData.sede, firstFac);
      setCarrerasList(cars);
      setFormData((prev) => ({
        ...prev,
        facultad: firstFac,
        carrera: cars[0] || "",
      }));
    }
  }, [formData.sede]);

  useEffect(() => {
    const cars = getUNITEPCCarreras(formData.sede, formData.facultad);
    setCarrerasList(cars);
    if (cars.length > 0) {
      setFormData((prev) => ({ ...prev, carrera: cars[0] }));
    }
  }, [formData.facultad]);

  // reCAPTCHA state
  const [recaptchaStatus, setRecaptchaStatus] = useState<"idle" | "verifying" | "verified">("idle");
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    code: string;
    date: string;
    title: string;
    leadInvestigator: string;
  } | null>(null);

  const [toast, setToast] = useState<ToastState | null>(null);

  const handleRecaptchaClick = () => {
    if (recaptchaStatus === "verified") return;
    setRecaptchaStatus("verifying");
    setTimeout(() => {
      setRecaptchaStatus("verified");
    }, 1000);
  };

  const handleSelectCampaign = (campaignCode: string) => {
    setFormData({ ...formData, campaignCode });
    const el = document.getElementById("postular");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (recaptchaStatus !== "verified") {
      setToast({ message: "Por favor complete la verificación de seguridad reCAPTCHA ('No soy un robot').", type: "error" });
      return;
    }

    const generatedCode = `PROP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleString("es-BO");

    setSubmittedReceipt({
      code: generatedCode,
      date: nowStr,
      title: formData.title,
      leadInvestigator: formData.leadInvestigator,
    });

    setToast({
      message: `¡Propuesta ${generatedCode} registrada con éxito! El expediente preliminar ha sido remitido a la Dirección de Investigación.`,
      type: "success",
    });
  };

  const filteredProjects = PUBLIC_PROJECTS.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.researcher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.faculty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* 1. HEADER / NAVBAR SUPERIOR ELEGANTE CON NAVEGACIÓN Y LOGO UNITEPC */}
      <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground font-black flex items-center justify-center shadow-md">
              U
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base block leading-none tracking-tight">
                UNITEPC Portal de Investigación
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                Dirección de Investigación Científica (Fondo Competitivo 2026)
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#convocatorias" className="hover:text-primary transition-colors flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Convocatorias
            </a>
            <a href="#postular" className="hover:text-primary transition-colors flex items-center gap-1">
              <Rocket className="h-3.5 w-3.5" /> Postulación Web
            </a>
            <a href="#proyectos" className="hover:text-primary transition-colors flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" /> Proyectos Públicos
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ProposalTutorialModal
              triggerButtonText="📖 Guía Investigador"
              triggerButtonClassName="text-xs font-bold gap-1 bg-muted hover:bg-muted/80 text-foreground border border-border"
            />
            <Button asChild size="sm" className="text-xs font-bold gap-1.5 shadow">
              <Link href="/sign-in">
                <Lock className="h-3.5 w-3.5" /> Acceso Sistema
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION ESTILO WEB LANDING DE ALTA GAMA */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="outline" className="px-4 py-1.5 text-xs font-bold border-emerald-500/40 text-emerald-400 bg-emerald-500/10 gap-1.5 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Portal Oficial de Convocatorias & Postulaciones UNITEPC
          </Badge>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Fondo Competitivo de Investigación y Proyectos Institucionales 2026
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Plataforma web oficial para la postulación de propuestas científicas, evaluación por comités ciegos, seguimiento del cronograma WBS y fiscalización financiera contable.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#postular"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Rocket className="h-4 w-4" />
              <span>Postular Mi Propuesta de Investigación</span>
            </a>
            
            <a
              href="#convocatorias"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all"
            >
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Ver Convocatorias Vigentes</span>
            </a>

            <ProposalTutorialModal
              triggerButtonText="📖 Guía Interactiva del Investigador"
              triggerButtonClassName="font-bold text-xs sm:text-sm gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200"
            />
          </div>

          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left text-xs max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold block">✓ Evaluación Transparente</span>
              <span className="text-slate-400 text-[11px]">Revisión por Pares Ciegos</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-blue-400 font-bold block">✓ Cronograma WBS</span>
              <span className="text-slate-400 text-[11px]">Monitoreo de Entregables</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-amber-400 font-bold block">✓ Fiscalización Contable</span>
              <span className="text-slate-400 text-[11px]">Retenciones e Impuestos</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-purple-400 font-bold block">✓ Producción Científica</span>
              <span className="text-slate-400 text-[11px]">Publicación Indexada APA 7</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 flex-1 w-full">

        {/* 3. SECCIÓN DE CONVOCATORIAS VIGENTES 2026 */}
        <section id="convocatorias" className="space-y-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-primary pl-4 py-1">
            <div>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-1">Bases Oficiales 2026</Badge>
              <h2 className="text-2xl font-black tracking-tight text-foreground">Convocatorias de Investigación Abiertas</h2>
              <p className="text-xs text-muted-foreground">Seleccione una convocatoria para iniciar el registro de su propuesta preliminar</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAMPAIGNS_DATA.map((camp) => (
              <Card key={camp.code} className="border-border shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className={`font-mono text-[10px] font-bold ${camp.badgeColor}`}>
                      {camp.code}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                      🟢 Abierta
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-extrabold mt-2 leading-snug">{camp.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed mt-1">{camp.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 text-xs pb-3">
                  <div className="bg-muted/40 p-3 rounded-xl border border-border space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Alcance:</span>
                      <span className="font-semibold text-foreground">{camp.scope}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fondo Total:</span>
                      <span className="font-mono font-bold text-primary">{camp.budgetPool}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Máximo por Proyecto:</span>
                      <span className="font-mono font-bold text-emerald-500">{camp.maxPerProject}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t">
                      <span className="text-muted-foreground">Cierre de Recepción:</span>
                      <span className="font-bold text-rose-500">{camp.deadline}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 border-t">
                  <Button
                    type="button"
                    onClick={() => handleSelectCampaign(camp.code)}
                    className="w-full text-xs font-bold gap-1.5 shadow bg-primary hover:bg-primary/90"
                  >
                    <span>Postular a esta Convocatoria</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* 4. SECCIÓN DEL FORMULARIO WEB DE POSTULACIÓN DE PROPUESTA */}
        <section id="postular" className="space-y-6 scroll-mt-20 border-t border-border pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA: INSTRUCTIVO Y REQUISITOS */}
            <div className="lg:col-span-5 space-y-5">
              <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30 font-bold">Formulario Oficial PAT UNITEPC</Badge>
              <h2 className="text-2xl font-black text-foreground tracking-tight">Registro de Propuesta Preliminar de Investigación</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Complete los datos institucionales, académicos y presupuestarios solicitados conforme al <strong>Anexo 3 (Parte I y II)</strong> de la normativa universitaria. Su registro será evaluado por el Comité Científico, Comité Bioético y la Unidad de Contabilidad.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">Verificación Segura Antispam</span>
                    <span className="text-muted-foreground text-[11px]">Protección con Google reCAPTCHA para garantizar la recepción de solicitudes.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border">
                  <FileCheck className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">Revisión por Pares Ciegos</span>
                    <span className="text-muted-foreground text-[11px]">Dictámenes estructurados (Aprobado, Observado con opción a corrección, Rechazado).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border">
                  <FileSpreadsheet className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">Fiscalización Impositiva Automatizada</span>
                    <span className="text-muted-foreground text-[11px]">Retenciones de ley (Servicios 15.5%, Bienes 8%, Alquileres 16%) calculadas en tiempo real.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: FORMULARIO DINÁMICO WEB */}
            <Card className="lg:col-span-7 shadow-xl border-primary/20">
              <CardHeader className="bg-muted/40 border-b border-border">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span>Ficha de Postulación de Propuesta</span>
                  <Badge variant="outline" className="font-mono text-xs bg-primary/10 text-primary border-primary/30 font-bold">
                    {formData.campaignCode}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Ingrese la información requerida. Los campos marcados con (*) son obligatorios.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                {submittedReceipt ? (
                  /* RECIBO DIGITAL TRAS ENVÍO EXITOSO */
                  <div className="py-6 space-y-4 animate-in fade-in text-center">
                    <div className="h-14 w-14 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-extrabold text-foreground">¡Propuesta Registrada Exitosamente!</h3>
                      <p className="text-xs text-muted-foreground max-w-md mx-auto">
                        Su propuesta preliminar fue recibida correctamente por la Dirección de Investigación Científica UNITEPC.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-left text-xs font-mono text-slate-200 max-w-md mx-auto space-y-2">
                      <div className="flex justify-between border-b border-slate-700 pb-1">
                        <span className="text-slate-400">Código de Seguimiento:</span>
                        <span className="font-bold text-emerald-400">{submittedReceipt.code}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-700 pb-1">
                        <span className="text-slate-400">Fecha de Recepción:</span>
                        <span>{submittedReceipt.date}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-700 pb-1">
                        <span className="text-slate-400">Investigador Postulante:</span>
                        <span className="truncate max-w-[200px]">{submittedReceipt.leadInvestigator}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Título del Proyecto:</span>
                        <span className="font-sans text-[11px] text-white line-clamp-2">{submittedReceipt.title}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-center gap-3">
                      <Button variant="outline" size="sm" onClick={() => setSubmittedReceipt(null)} className="text-xs">
                        Enviar Otra Propuesta
                      </Button>
                      <Button size="sm" asChild className="text-xs font-bold gap-1 bg-primary">
                        <Link href="/directorio">
                          <span>Ver en Directorio Interno</span>
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* FORMULARIO INTERACTIVO COMPLETO */
                  <form onSubmit={handleSubmitProposal} className="space-y-5 text-xs">
                    
                    {/* PASO 1: SELECCIÓN DE CONVOCATORIA Y DATOS DEL POSTULANTE */}
                    <div className="space-y-3">
                      <span className="font-bold text-xs uppercase tracking-wider text-primary block border-b pb-1">
                        1. Selección de Convocatoria y Datos del Postulante
                      </span>

                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground block">Convocatoria a la que Aplica (*)</label>
                        <select
                          value={formData.campaignCode}
                          onChange={(e) => setFormData({ ...formData, campaignCode: e.target.value })}
                          className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {CAMPAIGNS_DATA.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} — {c.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-muted-foreground block">Nombre Completo (*)</label>
                          <Input
                            required
                            placeholder="Ej. Dr. Carlos Mamani Terán"
                            value={formData.leadInvestigator}
                            onChange={(e) => setFormData({ ...formData, leadInvestigator: e.target.value })}
                            className="h-9 text-xs bg-background"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-muted-foreground block">C.I. / Pasaporte (*)</label>
                          <Input
                            required
                            placeholder="Ej. 6894012 CB"
                            value={formData.ci}
                            onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
                            className="h-9 text-xs bg-background"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-muted-foreground block">Correo Institucional (*)</label>
                          <Input
                            type="email"
                            required
                            placeholder="ejemplo@unitepc.edu.bo"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-9 text-xs bg-background"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-muted-foreground block">Teléfono / WhatsApp (*)</label>
                          <Input
                            required
                            placeholder="Ej. 79326793"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="h-9 text-xs bg-background"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PASO 2: ADSCRIPCIÓN INSTITUCIONAL Y EJE TEMÁTICO */}
                    <div className="space-y-3 pt-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-primary block border-b pb-1">
                        2. Adscripción Institucional UNITEPC y Eje Temático
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-muted-foreground block">Sede UNITEPC (*)</label>
                          <select
                            value={formData.sede}
                            onChange={(e) => setFormData({ ...formData, sede: e.target.value })}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none"
                          >
                            {sedesList.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-semibold text-muted-foreground block">Facultad Académica (*)</label>
                          <select
                            value={formData.facultad}
                            onChange={(e) => setFormData({ ...formData, facultad: e.target.value })}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none"
                          >
                            {facultadesList.map((f) => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-muted-foreground block">Carrera / Área (*)</label>
                          <select
                            value={formData.carrera}
                            onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none"
                          >
                            {carrerasList.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-muted-foreground block">Eje Temático UNITEPC (*)</label>
                          <select
                            value={formData.ejeTematico}
                            onChange={(e) => setFormData({ ...formData, ejeTematico: e.target.value })}
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none font-semibold text-primary"
                          >
                            {EJE_TEMATICO_OPTIONS.map((eje) => (
                              <option key={eje} value={eje}>{eje}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* PASO 3: PROPUESTA CIENTÍFICA Y PRESUPUESTO */}
                    <div className="space-y-3 pt-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-primary block border-b pb-1">
                        3. Perfil del Proyecto (Anexo 3 - Parte I y II)
                      </span>

                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground block">Título Tentativo del Proyecto (*)</label>
                        <Input
                          required
                          placeholder="Ej. Evaluación epidemiológica de brotes de dengue en la región tropical..."
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="h-9 text-xs bg-background"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground block">Planteamiento del Problema / Resumen (*)</label>
                        <textarea
                          required
                          rows={3}
                          className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="Describa la hipótesis de trabajo, el objeto de estudio y la problemática científica a resolver..."
                          value={formData.abstractText}
                          onChange={(e) => setFormData({ ...formData, abstractText: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground block">Monto Presupuestario Estimado Solicitado (Bs.) (*)</label>
                        <Input
                          type="number"
                          required
                          min={1000}
                          max={50000}
                          value={formData.requestedBudget}
                          onChange={(e) => setFormData({ ...formData, requestedBudget: Number(e.target.value) })}
                          className="h-9 text-xs bg-background font-mono font-bold text-emerald-500"
                        />
                      </div>
                    </div>

                    {/* WIDGET RECAPTCHA INTERACTIVO DE SEGURIDAD */}
                    <div className="pt-2">
                      <label className="font-semibold text-muted-foreground block mb-1.5">Verificación Antispam Security</label>
                      <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleRecaptchaClick}
                            className={`h-7 w-7 rounded-md border transition-all flex items-center justify-center ${
                              recaptchaStatus === "verified"
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                : "bg-background border-input hover:border-primary"
                            }`}
                          >
                            {recaptchaStatus === "verifying" && (
                              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                            )}
                            {recaptchaStatus === "verified" && (
                              <CheckCircle2 className="h-5 w-5" />
                            )}
                          </button>
                          <span className="text-xs font-semibold text-foreground">
                            {recaptchaStatus === "verified"
                              ? "Verificación reCAPTCHA Completada"
                              : recaptchaStatus === "verifying"
                              ? "Verificando token de seguridad..."
                              : "No soy un robot"}
                          </span>
                        </div>

                        <div className="flex flex-col items-center">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-[9px] text-muted-foreground font-mono">reCAPTCHA v3</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3">
                      <Button
                        type="submit"
                        disabled={recaptchaStatus !== "verified"}
                        className="w-full gap-2 shadow-lg font-extrabold text-xs py-5 bg-primary hover:bg-primary/90"
                      >
                        <Send className="h-4 w-4" />
                        <span>Enviar Propuesta a la Dirección de Investigación</span>
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

          </div>
        </section>

        {/* 5. SECCIÓN DE PROYECTOS APROBADOS Y EN EJECUCIÓN (CATÁLOGO PÚBLICO DE DIVULGACIÓN) */}
        <section id="proyectos" className="space-y-6 scroll-mt-20 border-t border-border pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-emerald-500 pl-4 py-1">
            <div>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 mb-1">Divulgación Científica</Badge>
              <h2 className="text-2xl font-black tracking-tight text-foreground">Catálogo de Investigaciones UNITEPC</h2>
              <p className="text-xs text-muted-foreground">Proyectos aprobados, financiados y en fase de ejecución o publicación</p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por proyecto o investigador..."
                className="pl-9 text-xs bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <Card key={p.code} className="hover:shadow-lg transition-all flex flex-col justify-between border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-[10px] font-bold">{p.code}</Badge>
                    <Badge className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold border-emerald-500/30">
                      {p.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-extrabold mt-2 leading-snug">{p.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2 mt-1">{p.summary}</CardDescription>
                </CardHeader>

                <CardContent className="text-xs space-y-2 pb-3">
                  <div className="bg-muted/40 p-3 rounded-xl border border-border text-[11px] space-y-1">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold">Investigador Responsable</span>
                      <span className="font-semibold text-foreground">{p.researcher}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold">Facultad & Sede</span>
                      <span className="text-muted-foreground text-[10px]">{p.faculty} • {p.campus}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 border-t text-[11px] text-muted-foreground flex justify-between items-center">
                  <span className="font-semibold text-primary">{p.area}</span>
                  <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 font-bold">
                    <span>Ver Ficha</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

      </main>

      {/* 6. FOOTER INSTITUCIONAL COMPLETO ESTILO WEB */}
      <footer className="border-t border-border bg-card py-10 text-xs text-muted-foreground mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground font-black flex items-center justify-center text-xs">
                  U
                </div>
                <span className="font-extrabold text-foreground text-sm">
                  Universidad Técnica Privada Cosmos (UNITEPC)
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm">
                Dirección de Investigación Científica • Sistema Integrado de Gestión de Proyectos de Investigación y Fiscalización Presupuestaria (SIGPRI).
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-foreground block uppercase text-[10px] tracking-wider">Sedes Nacionales</span>
              <ul className="space-y-1 text-[11px]">
                <li>Cochabamba (Campus Central)</li>
                <li>La Paz (Sede Central)</li>
                <li>Santa Cruz • Cobija</li>
                <li>Ivirgarzama • Puerto Quijarro</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-foreground block uppercase text-[10px] tracking-wider">Contacto e Información</span>
              <ul className="space-y-1 text-[11px]">
                <li>Correo: investigacion@unitepc.edu.bo</li>
                <li>Teléfono: +591 (4) 4252525</li>
                <li>Gestión Académica 2026</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p>© 2026 Universidad Técnica Privada Cosmos (UNITEPC). Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="hover:text-foreground font-semibold">Acceso Administrativo</Link>
              <span>&bull;</span>
              <Link href="/directorio" className="hover:text-foreground font-semibold">Directorio Interno</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* TOAST ELEGANTE */}
      <ElegantToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
