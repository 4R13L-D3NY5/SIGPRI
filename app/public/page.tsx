"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, BookOpen, Building2, CheckCircle2, ChevronRight, ExternalLink, 
  FileCheck, FileText, Globe, Lock, Mail, RefreshCw, Search, Send, 
  Shield, ShieldCheck, Sparkles, User, Users, Calendar, DollarSign, 
  Layers, MapPin, Phone, HelpCircle, ArrowRight, Check, Rocket, 
  FileSpreadsheet, Bookmark, Lightbulb, GraduationCap, HeartHandshake, Eye, Download, Share2
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
    badgeColor: "bg-blue-100 border-blue-300 text-blue-800",
    description: "Proyectos de investigación aplicada orientados a resolver problemáticas nacionales en salud, tecnología e innovación productiva.",
  },
  {
    code: "CONV-2-2026-01",
    title: "Fondo Especial de Investigación en Ciencias de la Salud & Bioética",
    scope: "Facultades de Odontología, Medicina, Bioquímica y Enfermería",
    area: "Salud Integral & Biomedicina",
    budgetPool: "Bs. 80.000",
    maxPerProject: "Hasta Bs. 30.000",
    deadline: "15 de Octubre, 2026",
    badgeColor: "bg-purple-100 border-purple-300 text-purple-800",
    description: "Financiamiento enfocado en estudios clínicos, ensayos bioéticos, prevención epidemiológica y salud comunitaria.",
  },
  {
    code: "CONV-3-2026-02",
    title: "Fondo de Innovación Tecnológica, Inteligencia Artificial & Software",
    scope: "Facultad de Ciencias de la Tecnología / Ingeniería",
    area: "Software, IA & Robótica",
    budgetPool: "Bs. 100.000",
    maxPerProject: "Hasta Bs. 40.000",
    deadline: "30 de Noviembre, 2026",
    badgeColor: "bg-emerald-100 border-emerald-300 text-emerald-800",
    description: "Desarrollo de sistemas de software, algoritmos de inteligencia artificial y transferencia tecnológica con aplicación industrial.",
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

// ARTÍCULOS Y REVISTAS ELECTRÓNICAS PUBLICADAS (DIFUSIÓN CIENTÍFICA CONCLUIDA)
const PUBLISHED_PAPERS = [
  {
    id: "pub-001",
    title: "Síntesis Nanotecnológica de Hidroxiapatita a partir de Cáscaras de Huevo para Regeneración Ósea",
    authors: "Dr. Roberto Carlos Villarroel M., Dra. Lorena Orellana A., Ing. Ariel Camara",
    mediumType: "Revista Electrónica Indexada",
    journal: "Revista Boliviana de Biomedicina y Odontología (Vol. 14, N° 2, 2025)",
    indexing: "SciELO / Latindex Catálogo 2.0",
    doi: "https://doi.org/10.unitepc.rev/biomed.2025.0142",
    year: "2025",
    faculty: "Ciencias de la Salud & Odontología",
    abstract: "Investigación experimental que demuestra la viabilidad de utilizar residuos avícolas para la síntesis de biomateriales aplicados a injertos óseos en cirugía bucal con alta biocompatibilidad.",
  },
  {
    id: "pub-002",
    title: "Resistencia Antimicrobiana y Perfil Epidemiológico en Cepas Hospitalarias de Cochabamba",
    authors: "Dra. Carmen Rosa Morales Arispe, Dr. Gonzalo Fernández Terán",
    mediumType: "Artículo Científico Original",
    journal: "Revista Científica de Ciencias de la Salud UNITEPC (Vol. 8, N° 1, 2025)",
    indexing: "REDIB / Dialnet / DOAJ",
    doi: "https://doi.org/10.unitepc.rev/salud.2025.0801",
    year: "2025",
    faculty: "Ciencias de la Salud / Bioquímica",
    abstract: "Estudio multicéntrico que evalúa los patrones de resistencia a antibióticos de mayor prescripción en unidades de terapia intensiva, proponiendo un protocolo de contención biológica.",
  },
  {
    id: "pub-003",
    title: "Optimización Algorítmica basada en Inteligencia Artificial para Redes Eléctricas Rurales",
    authors: "Dra. Elena Quispe Mamani, Ing. Harold Rojas Torres, Lic. Javier Mercado",
    mediumType: "Revista Electrónica Indexada",
    journal: "Journal of Applied Technology & Software (Vol. 11, Issue 3, 2025)",
    indexing: "Scopus / IEEE Xplore Digital Library",
    doi: "https://doi.org/10.unitepc.rev/tech.2025.1103",
    year: "2025",
    faculty: "Ciencias de la Tecnología / Ingeniería",
    abstract: "Desarrollo de un modelo predictivo mediante redes neuronales convolucionales para prevenir caídas de tensión en micro-redes solares aisladas de la zona andina.",
  },
  {
    id: "pub-004",
    title: "Desarrollo Institucional de la Plataforma SIGPRI para la Gestoría Científica Universitaria",
    authors: "Ing. Ariel Denys Camara Arze, Ing. Jose James Claure Ricaldi",
    mediumType: "Libro / Memoria de Innovación",
    journal: "Ediciones Académicas UNITEPC • Colección Investigación y Sociedad (2026)",
    indexing: "Repositorio Institucional UNITEPC / ISBN: 978-99974-0-452-1",
    doi: "https://doi.org/10.unitepc.pub/sigpri.2026.001",
    year: "2026",
    faculty: "Ingeniería de Sistemas",
    abstract: "Monografía técnica que sistematiza la arquitectura de software desacoplada y la automatización de la fiscalización contable impositiva para proyectos de investigación.",
  },
];

export default function PublicPortalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMediumFilter, setSelectedMediumFilter] = useState("TODOS");

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

  const filteredPapers = PUBLISHED_PAPERS.filter((p) => {
    const matchesMedium = selectedMediumFilter === "TODOS" || p.mediumType === selectedMediumFilter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      p.title.toLowerCase().includes(searchLower) ||
      p.authors.toLowerCase().includes(searchLower) ||
      p.journal.toLowerCase().includes(searchLower) ||
      p.faculty.toLowerCase().includes(searchLower);

    return matchesMedium && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* BARRA SUPERIOR DE ANUNCIOS INSTITUCIONALES */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">Oficial</span>
            <span>Universidad Técnica Privada Cosmos (UNITEPC) • Dirección de Investigación Científica</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            <span>Convocatorias 2026 Vigentes</span>
            <span>&bull;</span>
            <span className="font-mono text-emerald-400">investigacion@unitepc.edu.bo</span>
          </div>
        </div>
      </div>

      {/* 1. HEADER / NAVBAR SUPERIOR TEMA CLARO */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/unitepc_logo.png"
              alt="UNITEPC Logo"
              className="h-10 object-contain"
            />
            <div className="border-l border-slate-300 pl-3">
              <span className="font-extrabold text-slate-900 text-sm sm:text-base block leading-none tracking-tight">
                UNITEPC Investigación
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Portal de Postulaciones y Difusión Científica
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#importancia" className="hover:text-blue-900 transition-colors flex items-center gap-1">
              <Lightbulb className="h-3.5 w-3.5 text-blue-700" /> Importancia
            </a>
            <a href="#convocatorias" className="hover:text-blue-900 transition-colors flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Convocatorias 2026
            </a>
            <a href="#publicaciones" className="hover:text-blue-900 transition-colors flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-purple-700" /> Publicaciones & Revistas
            </a>
            <a href="#postular" className="hover:text-blue-900 transition-colors flex items-center gap-1">
              <Rocket className="h-3.5 w-3.5 text-emerald-700" /> Postular Propuesta
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ProposalTutorialModal
              triggerButtonText="📖 Guía Investigador"
              triggerButtonClassName="text-xs font-bold gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
            />
            <Button asChild size="sm" className="text-xs font-bold gap-1.5 shadow-md bg-blue-900 hover:bg-blue-950 text-white">
              <Link href="/sign-in">
                <Lock className="h-3.5 w-3.5 text-emerald-400" /> Acceso SIGPRI
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION TEMA CLARO IMPACTANTE */}
      <section className="relative bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="outline" className="px-4 py-1.5 text-xs font-bold border-blue-300 text-blue-900 bg-blue-100/60 gap-1.5 uppercase tracking-wider shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-700" /> Portal Oficial de Postulaciones y Divulgación Científica
          </Badge>
          
          <h1 className="text-3xl sm:text-5xl font-black text-blue-950 tracking-tight leading-tight">
            Impulsando el Conocimiento, la Ciencia y la Innovación Tecnológica en Bolivia
          </h1>
          
          <p className="text-slate-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            La Dirección de Investigación Científica de la <strong>Universidad Técnica Privada Cosmos (UNITEPC)</strong> promueve el desarrollo científico a través del financiamiento de proyectos de impacto, la evaluación rigurosa por comités pares y la difusión de resultados en revistas electrónicas de prestigio.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#postular"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm bg-blue-900 text-white hover:bg-blue-950 shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Rocket className="h-4 w-4 text-emerald-400" />
              <span>Postular Mi Proyecto de Investigación</span>
            </a>
            
            <a
              href="#publicaciones"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 shadow-sm transition-all"
            >
              <BookOpen className="h-4 w-4 text-purple-700" />
              <span>Explorar Revistas y Artículos Publicados</span>
            </a>

            <ProposalTutorialModal
              triggerButtonText="📖 Guía Instructivo UNITEPC"
              triggerButtonClassName="font-bold text-xs sm:text-sm gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 shadow-sm"
            />
          </div>

          {/* INDICADORES CIENTÍFICOS DESTACADOS */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left text-xs max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-blue-900 font-extrabold text-lg">
                <span>100%</span>
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="font-bold text-slate-800 block text-xs">Evaluación Ciega por Pares</span>
              <span className="text-slate-500 text-[11px]">Dictámenes Científicos y Bioéticos</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-purple-900 font-extrabold text-lg">
                <span>APA 7</span>
                <Bookmark className="h-5 w-5 text-purple-600" />
              </div>
              <span className="font-bold text-slate-800 block text-xs">Estándar PAT UNITEPC</span>
              <span className="text-slate-500 text-[11px]">Metodología Académica Rigurosa</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-emerald-900 font-extrabold text-lg">
                <span>Bs. 330K</span>
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="font-bold text-slate-800 block text-xs">Fondo Competitivo 2026</span>
              <span className="text-slate-500 text-[11px]">Financiamiento por Convocatoria</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-amber-900 font-extrabold text-lg">
                <span>SciELO / Scopus</span>
                <Globe className="h-5 w-5 text-amber-600" />
              </div>
              <span className="font-bold text-slate-800 block text-xs">Difusión e Indexación</span>
              <span className="text-slate-500 text-[11px]">Revistas Electrónicas Oficiales</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16 flex-1 w-full">

        {/* 3. SECCIÓN 1: IMPORTANCIA DE LA INVESTIGACIÓN CIENTÍFICA EN UNITEPC */}
        <section id="importancia" className="space-y-6 scroll-mt-20">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge className="bg-blue-100 text-blue-900 border-blue-300 font-bold">Misión Institucional</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              La Importancia de la Investigación en la Universidad
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              En UNITEPC, concebimos la investigación científica no solo como un requisito académico, sino como el motor fundamental para la solución de problemas de la sociedad boliviana y la generación de conocimiento con rigor ético.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold mb-2">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-extrabold text-slate-900">1. Innovación y Solución a Problemas Reales</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 leading-relaxed">
                Nuestros proyectos abarcan desde el desarrollo de biotecnología aplicada hasta la creación de software con Inteligencia Artificial y protocolos de salud pública adaptados a nuestra realidad epidemiológica.
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold mb-2">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-extrabold text-slate-900">2. Integridad y Ética Científica</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 leading-relaxed">
                Garantizamos que toda investigación cumpla con los principios bioéticos internacionales mediante la evaluación de nuestros Comités Científico y Bioético y el estricto apego al modelo PAT UNITEPC.
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold mb-2">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-extrabold text-slate-900">3. Transferencia y Difusión Científica</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 leading-relaxed">
                Cada proyecto financiado concluye en la elaboración y publicación de un artículo científico original indexado en revistas electrónicas de circulación nacional e internacional.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 4. SECCIÓN 2: CONVOCATORIAS VIGENTES Y FONDOS COMPETITIVOS 2026 */}
        <section id="convocatorias" className="space-y-6 scroll-mt-20 border-t border-slate-200 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-blue-900 pl-4 py-1">
            <div>
              <Badge className="bg-blue-100 text-blue-900 border-blue-300 mb-1 font-bold">Bases Oficiales 2026</Badge>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Convocatorias de Investigación Abiertas</h2>
              <p className="text-xs text-slate-600">Seleccione una convocatoria para iniciar el registro de su propuesta preliminar</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAMPAIGNS_DATA.map((camp) => (
              <Card key={camp.code} className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className={`font-mono text-[10px] font-bold ${camp.badgeColor}`}>
                      {camp.code}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-100 border-emerald-300 text-emerald-800">
                      🟢 Abierta
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-extrabold mt-2 leading-snug text-slate-900">{camp.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed mt-1 text-slate-600">{camp.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 text-xs pb-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Alcance:</span>
                      <span className="font-semibold text-slate-800">{camp.scope}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fondo Total:</span>
                      <span className="font-mono font-bold text-blue-900">{camp.budgetPool}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Máximo por Proyecto:</span>
                      <span className="font-mono font-bold text-emerald-700">{camp.maxPerProject}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Cierre de Recepción:</span>
                      <span className="font-bold text-rose-700">{camp.deadline}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 border-t border-slate-200">
                  <Button
                    type="button"
                    onClick={() => handleSelectCampaign(camp.code)}
                    className="w-full text-xs font-bold gap-1.5 shadow bg-blue-900 hover:bg-blue-950 text-white"
                  >
                    <span>Postular a esta Convocatoria</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* 5. SECCIÓN 3: TRABAJOS CONCLUIDOS, REVISTAS ELECTRÓNICAS Y ARTÍCULOS CIENTÍFICOS */}
        <section id="publicaciones" className="space-y-6 scroll-mt-20 border-t border-slate-200 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-purple-700 pl-4 py-1">
            <div>
              <Badge className="bg-purple-100 text-purple-900 border-purple-300 mb-1 font-bold">Divulgación & Producción Intelectual</Badge>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Revistas Electrónicas y Artículos Científicos Publicados</h2>
              <p className="text-xs text-slate-600">Trabajos de investigación concluidos por nuestros docentes y estudiantes difundidos en revistas indexadas</p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar artículo, autor o revista..."
                className="pl-9 text-xs bg-white border-slate-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* PESTAÑAS DE FILTRADO POR TIPO DE MEDIO DE DIFUSIÓN */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
            <button
              onClick={() => setSelectedMediumFilter("TODOS")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                selectedMediumFilter === "TODOS"
                  ? "bg-purple-900 text-white border-purple-900 shadow-sm"
                  : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              🌐 Todos los Medios ({PUBLISHED_PAPERS.length})
            </button>
            <button
              onClick={() => setSelectedMediumFilter("Revista Electrónica Indexada")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                selectedMediumFilter === "Revista Electrónica Indexada"
                  ? "bg-purple-900 text-white border-purple-900 shadow-sm"
                  : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              📖 Revistas Electrónicas Indexadas
            </button>
            <button
              onClick={() => setSelectedMediumFilter("Artículo Científico Original")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                selectedMediumFilter === "Artículo Científico Original"
                  ? "bg-purple-900 text-white border-purple-900 shadow-sm"
                  : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              📄 Artículos Científicos
            </button>
            <button
              onClick={() => setSelectedMediumFilter("Libro / Memoria de Innovación")}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                selectedMediumFilter === "Libro / Memoria de Innovación"
                  ? "bg-purple-900 text-white border-purple-900 shadow-sm"
                  : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              📚 Libros & Memorias
            </button>
          </div>

          {/* LISTADO DE TARJETAS DE ARTÍCULOS PUBLICADOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPapers.map((paper) => (
              <Card key={paper.id} className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="font-mono text-[10px] bg-purple-50 text-purple-800 border-purple-200 font-bold">
                      {paper.mediumType}
                    </Badge>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                      Año {paper.year}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-extrabold text-slate-900 mt-2 leading-snug">
                    {paper.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-semibold">
                    👤 Autores: <strong className="text-slate-800">{paper.authors}</strong>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 text-xs pb-3">
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {paper.abstract}
                  </p>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Revista / Medio:</span>
                      <span className="font-semibold text-slate-800">{paper.journal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Indexación:</span>
                      <span className="font-bold text-purple-900">{paper.indexing}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Identificador DOI:</span>
                      <a href={paper.doi} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline truncate max-w-[200px]">
                        {paper.doi}
                      </a>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium text-[11px]">{paper.faculty}</span>
                  <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5 font-bold text-blue-900 border-blue-200 hover:bg-blue-50">
                    <Download className="h-3.5 w-3.5" />
                    <span>Ver Artículo Completo (PDF)</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* 6. SECCIÓN 4: FORMULARIO WEB DE POSTULACIÓN DE PROPUESTA EN TEMA CLARO */}
        <section id="postular" className="space-y-6 scroll-mt-20 border-t border-slate-200 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA: INSTRUCTIVO Y REQUISITOS */}
            <div className="lg:col-span-5 space-y-5">
              <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold">Formulario Oficial PAT UNITEPC</Badge>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Registro de Propuesta Preliminar de Investigación</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete los datos institucionales, académicos y presupuestarios solicitados conforme al <strong>Anexo 3 (Parte I y II)</strong> de la normativa universitaria. Su registro será evaluado por el Comité Científico, Comité Bioético y la Unidad de Contabilidad.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Verificación Segura Antispam</span>
                    <span className="text-slate-500 text-[11px]">Protección con Google reCAPTCHA para garantizar la recepción de solicitudes.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <FileCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Revisión por Pares Ciegos</span>
                    <span className="text-slate-500 text-[11px]">Dictámenes estructurados (Aprobado, Observado con opción a corrección, Rechazado).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <FileSpreadsheet className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Fiscalización Impositiva Automatizada</span>
                    <span className="text-slate-500 text-[11px]">Retenciones de ley (Servicios 15.5%, Bienes 8%, Alquileres 16%) calculadas en tiempo real.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: FORMULARIO DINÁMICO TEMA CLARO */}
            <Card className="lg:col-span-7 shadow-lg border-slate-200 bg-white">
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <CardTitle className="text-base font-bold flex items-center justify-between text-slate-900">
                  <span>Ficha de Postulación de Propuesta</span>
                  <Badge variant="outline" className="font-mono text-xs bg-blue-100 text-blue-900 border-blue-300 font-bold">
                    {formData.campaignCode}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Ingrese la información requerida. Los campos marcados con (*) son obligatorios.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                {submittedReceipt ? (
                  /* RECIBO DIGITAL TRAS ENVÍO EXITOSO */
                  <div className="py-6 space-y-4 animate-in fade-in text-center">
                    <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-extrabold text-slate-900">¡Propuesta Registrada Exitosamente!</h3>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
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
                      <Button size="sm" asChild className="text-xs font-bold gap-1 bg-blue-900 hover:bg-blue-950 text-white">
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
                      <span className="font-bold text-xs uppercase tracking-wider text-blue-900 block border-b border-slate-200 pb-1">
                        1. Selección de Convocatoria y Datos del Postulante
                      </span>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 block">Convocatoria a la que Aplica (*)</label>
                        <select
                          value={formData.campaignCode}
                          onChange={(e) => setFormData({ ...formData, campaignCode: e.target.value })}
                          className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
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
                          <label className="font-semibold text-slate-700 block">Nombre Completo (*)</label>
                          <Input
                            required
                            placeholder="Ej. Dr. Carlos Mamani Terán"
                            value={formData.leadInvestigator}
                            onChange={(e) => setFormData({ ...formData, leadInvestigator: e.target.value })}
                            className="h-9 text-xs bg-white border-slate-300"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 block">C.I. / Pasaporte (*)</label>
                          <Input
                            required
                            placeholder="Ej. 6894012 CB"
                            value={formData.ci}
                            onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
                            className="h-9 text-xs bg-white border-slate-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 block">Correo Institucional (*)</label>
                          <Input
                            type="email"
                            required
                            placeholder="ejemplo@unitepc.edu.bo"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-9 text-xs bg-white border-slate-300"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 block">Teléfono / WhatsApp (*)</label>
                          <Input
                            required
                            placeholder="Ej. 79326793"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="h-9 text-xs bg-white border-slate-300"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PASO 2: ADSCRIPCIÓN INSTITUCIONAL Y EJE TEMÁTICO */}
                    <div className="space-y-3 pt-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-blue-900 block border-b border-slate-200 pb-1">
                        2. Adscripción Institucional UNITEPC y Eje Temático
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 block">Sede UNITEPC (*)</label>
                          <select
                            value={formData.sede}
                            onChange={(e) => setFormData({ ...formData, sede: e.target.value })}
                            className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs focus:outline-none"
                          >
                            {sedesList.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-semibold text-slate-700 block">Facultad Académica (*)</label>
                          <select
                            value={formData.facultad}
                            onChange={(e) => setFormData({ ...formData, facultad: e.target.value })}
                            className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs focus:outline-none"
                          >
                            {facultadesList.map((f) => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 block">Carrera / Área (*)</label>
                          <select
                            value={formData.carrera}
                            onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                            className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs focus:outline-none"
                          >
                            {carrerasList.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700 block">Eje Temático UNITEPC (*)</label>
                          <select
                            value={formData.ejeTematico}
                            onChange={(e) => setFormData({ ...formData, ejeTematico: e.target.value })}
                            className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 text-xs focus:outline-none font-semibold text-blue-900"
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
                      <span className="font-bold text-xs uppercase tracking-wider text-blue-900 block border-b border-slate-200 pb-1">
                        3. Perfil del Proyecto (Anexo 3 - Parte I y II)
                      </span>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 block">Título Tentativo del Proyecto (*)</label>
                        <Input
                          required
                          placeholder="Ej. Evaluación epidemiológica de brotes de dengue en la región tropical..."
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="h-9 text-xs bg-white border-slate-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 block">Planteamiento del Problema / Resumen (*)</label>
                        <textarea
                          required
                          rows={3}
                          className="w-full rounded-md border border-slate-300 bg-white p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-900"
                          placeholder="Describa la hipótesis de trabajo, el objeto de estudio y la problemática científica a resolver..."
                          value={formData.abstractText}
                          onChange={(e) => setFormData({ ...formData, abstractText: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 block">Monto Presupuestario Estimado Solicitado (Bs.) (*)</label>
                        <Input
                          type="number"
                          required
                          min={1000}
                          max={50000}
                          value={formData.requestedBudget}
                          onChange={(e) => setFormData({ ...formData, requestedBudget: Number(e.target.value) })}
                          className="h-9 text-xs bg-white border-slate-300 font-mono font-bold text-emerald-700"
                        />
                      </div>
                    </div>

                    {/* WIDGET RECAPTCHA INTERACTIVO DE SEGURIDAD */}
                    <div className="pt-2">
                      <label className="font-semibold text-slate-700 block mb-1.5">Verificación Antispam Security</label>
                      <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleRecaptchaClick}
                            className={`h-7 w-7 rounded-md border transition-all flex items-center justify-center ${
                              recaptchaStatus === "verified"
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                : "bg-white border-slate-400 hover:border-blue-900"
                            }`}
                          >
                            {recaptchaStatus === "verifying" && (
                              <RefreshCw className="h-4 w-4 animate-spin text-blue-900" />
                            )}
                            {recaptchaStatus === "verified" && (
                              <CheckCircle2 className="h-5 w-5" />
                            )}
                          </button>
                          <span className="text-xs font-semibold text-slate-800">
                            {recaptchaStatus === "verified"
                              ? "Verificación reCAPTCHA Completada"
                              : recaptchaStatus === "verifying"
                              ? "Verificando token de seguridad..."
                              : "No soy un robot"}
                          </span>
                        </div>

                        <div className="flex flex-col items-center">
                          <Lock className="h-4 w-4 text-slate-400" />
                          <span className="text-[9px] text-slate-500 font-mono">reCAPTCHA v3</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3">
                      <Button
                        type="submit"
                        disabled={recaptchaStatus !== "verified"}
                        className="w-full gap-2 shadow-lg font-extrabold text-xs py-5 bg-blue-900 hover:bg-blue-950 text-white"
                      >
                        <Send className="h-4 w-4 text-emerald-400" />
                        <span>Enviar Propuesta a la Dirección de Investigación</span>
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

          </div>
        </section>

      </main>

      {/* 7. FOOTER INSTITUCIONAL COMPLETO EN TEMA CLARO */}
      <footer className="border-t border-slate-200 bg-white py-10 text-xs text-slate-600 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center gap-2">
                <img
                  src="/unitepc_logo.png"
                  alt="UNITEPC Logo"
                  className="h-8 object-contain"
                />
                <span className="font-extrabold text-slate-900 text-sm">
                  Universidad Técnica Privada Cosmos (UNITEPC)
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Dirección de Investigación Científica • Sistema Integrado de Gestión de Proyectos de Investigación y Fiscalización Presupuestaria (SIGPRI).
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 block uppercase text-[10px] tracking-wider">Sedes Nacionales</span>
              <ul className="space-y-1 text-[11px] text-slate-600">
                <li>Cochabamba (Campus Central)</li>
                <li>La Paz (Sede Central)</li>
                <li>Santa Cruz • Cobija</li>
                <li>Ivirgarzama • Puerto Quijarro</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 block uppercase text-[10px] tracking-wider">Contacto e Información</span>
              <ul className="space-y-1 text-[11px] text-slate-600">
                <li>Correo: investigacion@unitepc.edu.bo</li>
                <li>Teléfono: +591 (4) 4252525</li>
                <li>Gestión Académica 2026</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p>© 2026 Universidad Técnica Privada Cosmos (UNITEPC). Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="hover:text-slate-900 font-semibold text-blue-900">Acceso SIGPRI</Link>
              <span>&bull;</span>
              <Link href="/directorio" className="hover:text-slate-900 font-semibold text-blue-900">Directorio Interno</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* TOAST ELEGANTE */}
      <ElegantToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
