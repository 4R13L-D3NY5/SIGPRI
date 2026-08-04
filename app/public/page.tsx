"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, BookOpen, Building2, CheckCircle2, ChevronRight, ExternalLink, 
  FileCheck, FileText, Globe, Lock, Mail, RefreshCw, Search, Send, 
  Shield, ShieldCheck, Sparkles, User, Users, Calendar, DollarSign, 
  Layers, MapPin, Phone, HelpCircle, ArrowRight, Check, Rocket, 
  FileSpreadsheet, Bookmark, Lightbulb, GraduationCap, HeartHandshake, Eye, Download,
  Sun, Moon
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
    description: "Proyectos de investigación aplicada orientados a resolver problemáticas nacionales en salud, desarrollo tecnológico e innovación productiva.",
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
    badgeColor: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
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
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    <div className={`min-h-screen transition-colors duration-200 flex flex-col font-sans selection:bg-blue-900 selection:text-white ${
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* 1. BARRA DE NOTIFICACIÓN INSTITUCIONAL SUPERIOR */}
      <div className={`text-[11px] py-2 px-4 border-b shrink-0 transition-colors ${
        isDarkMode ? "bg-slate-900 text-slate-300 border-slate-800" : "bg-slate-950 text-white border-slate-800"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
              OFICIAL
            </span>
            <span className="font-medium">
              UNIVERSIDAD TÉCNICA PRIVADA COSMOS • Dirección de Investigación Científica
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <span>Convocatorias 2026 Vigentes</span>
            <span>&bull;</span>
            <span className="font-mono text-emerald-400">investigacion@unitepc.edu.bo</span>
          </div>
        </div>
      </div>

      {/* 2. HEADER DE NAVEGACIÓN CORPORATIVO CON TOGGLE MODO NOCHE / MODO DÍA */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-md shadow-sm shrink-0 transition-colors ${
        isDarkMode ? "bg-slate-900/90 border-slate-800 text-slate-100" : "bg-white/95 border-slate-200 text-slate-900"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* LOGO E IDENTIDAD UNITEPC */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/unitepc_logo.png"
              alt="UNITEPC Logo"
              className="h-10 object-contain"
            />
            <div className={`h-6 w-px hidden sm:block ${isDarkMode ? "bg-slate-800" : "bg-slate-300"}`}></div>
            <div className="hidden sm:block">
              <span className={`font-extrabold text-sm block leading-none tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                UNITEPC
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Investigación
              </span>
            </div>
          </div>

          {/* MENÚ DE NAVEGACIÓN CORPORATIVO CENTRAL */}
          <nav className={`hidden md:flex items-center gap-8 text-xs font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
            <a href="#importancia" className="hover:text-blue-500 transition-colors flex items-center gap-1.5 py-1">
              <Lightbulb className="h-3.5 w-3.5 text-blue-500" />
              <span>Importancia</span>
            </a>
            <a href="#convocatorias" className="hover:text-blue-500 transition-colors flex items-center gap-1.5 py-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Convocatorias 2026</span>
            </a>
            <a href="#publicaciones" className="hover:text-blue-500 transition-colors flex items-center gap-1.5 py-1">
              <BookOpen className="h-3.5 w-3.5 text-purple-500" />
              <span>Revistas & Artículos</span>
            </a>
            <a href="#postular" className="hover:text-blue-500 transition-colors flex items-center gap-1.5 py-1">
              <Rocket className="h-3.5 w-3.5 text-emerald-500" />
              <span>Postulación Web</span>
            </a>
          </nav>

          {/* BOTONES DE ACCIÓN Y TOGGLE MODO NOCHE / DÍA */}
          <div className="flex items-center gap-3 shrink-0">
            {/* BUTTON TOGGLE MODO NOCHE / MODO DÍA */}
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 border ${
                isDarkMode
                  ? "bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200"
              }`}
              title="Cambiar Modo Noche / Modo Día"
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span className="hidden sm:inline">Modo Día</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-slate-700" />
                  <span className="hidden sm:inline">Modo Noche</span>
                </>
              )}
            </button>

            <ProposalTutorialModal
              triggerButtonText="📖 Guía del Postulante"
              triggerButtonClassName={`text-xs font-bold gap-1 px-3.5 py-2 rounded-lg transition-all border ${
                isDarkMode 
                  ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700" 
                  : "bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200"
              }`}
            />

            <Button asChild size="sm" className="text-xs font-bold gap-1.5 shadow-md bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded-lg">
              <Link href="/sign-in">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Acceso SIGPRI</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 3. HERO LANDING SECTION */}
      <section className={`relative border-b py-16 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDarkMode 
          ? "bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-slate-800" 
          : "bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-slate-200"
      }`}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          <Badge variant="outline" className={`px-4 py-1.5 text-xs font-bold gap-2 uppercase tracking-wider shadow-sm ${
            isDarkMode
              ? "border-blue-500/40 text-blue-400 bg-blue-500/10"
              : "border-blue-300 text-blue-900 bg-blue-100/60"
          }`}>
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            <span>PORTAL OFICIAL DE POSTULACIONES Y DIVULGACIÓN CIENTÍFICA</span>
          </Badge>

          <h1 className={`text-3xl sm:text-5xl font-black tracking-tight leading-tight ${
            isDarkMode ? "text-white" : "text-slate-950"
          }`}>
            Impulsando el Conocimiento, la Ciencia y la Innovación Tecnológica en Bolivia
          </h1>

          <p className={`text-sm sm:text-base max-w-3xl mx-auto leading-relaxed ${
            isDarkMode ? "text-slate-300" : "text-slate-600"
          }`}>
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
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm border shadow-sm transition-all ${
                isDarkMode 
                  ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" 
                  : "bg-white border-slate-300 text-slate-800 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="h-4 w-4 text-purple-500" />
              <span>Explorar Revistas y Artículos Publicados</span>
            </a>
          </div>

          {/* TARJETAS DE INDICADORES Y METRICAS CIENTIFICAS */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left text-xs max-w-4xl mx-auto">
            <div className={`p-4 rounded-2xl border shadow-sm space-y-1 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center justify-between text-blue-500 font-extrabold text-lg">
                <span>100%</span>
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <span className={`font-bold block text-xs ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Evaluación Ciega por Pares</span>
              <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Dictámenes Científicos y Bioéticos</span>
            </div>

            <div className={`p-4 rounded-2xl border shadow-sm space-y-1 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center justify-between text-purple-400 font-extrabold text-lg">
                <span>APA 7</span>
                <Bookmark className="h-5 w-5 text-purple-400" />
              </div>
              <span className={`font-bold block text-xs ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Estándar PAT UNITEPC</span>
              <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Metodología Académica Rigurosa</span>
            </div>

            <div className={`p-4 rounded-2xl border shadow-sm space-y-1 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center justify-between text-emerald-400 font-extrabold text-lg">
                <span>Bs. 330K</span>
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <span className={`font-bold block text-xs ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Fondo Competitivo 2026</span>
              <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Financiamiento por Convocatoria</span>
            </div>

            <div className={`p-4 rounded-2xl border shadow-sm space-y-1 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center justify-between text-amber-400 font-extrabold text-lg">
                <span>SciELO / Scopus</span>
                <Globe className="h-5 w-5 text-amber-400" />
              </div>
              <span className={`font-bold block text-xs ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>Difusión e Indexación</span>
              <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Revistas Electrónicas Oficiales</span>
            </div>
          </div>

        </div>
      </section>

      {/* CONTENIDO PRINCIPAL DE LA LANDING */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16 flex-1 w-full">

        {/* 4. SECCIÓN 1: IMPORTANCIA DE LA INVESTIGACIÓN CIENTÍFICA EN UNITEPC */}
        <section id="importancia" className="space-y-6 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge className={`font-bold ${isDarkMode ? "bg-blue-500/10 text-blue-400 border-blue-500/30" : "bg-blue-100 text-blue-900 border-blue-300"}`}>
              Misión Institucional
            </Badge>
            <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              La Importancia de la Investigación en la Universidad
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              En UNITEPC, concebimos la investigación científica como el motor fundamental para resolver problemas de la sociedad boliviana y generar nuevo conocimiento con rigor metodológico y bioético.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <Card className={`border shadow-sm hover:shadow-md transition-all ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"}`}>
              <CardHeader className="pb-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold mb-2">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-extrabold">1. Innovación y Solución a Problemas Reales</CardTitle>
              </CardHeader>
              <CardContent className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Nuestros proyectos abarcan desde el desarrollo de biotecnología aplicada hasta la creación de software con Inteligencia Artificial y protocolos de salud pública adaptados a nuestra realidad epidemiológica.
              </CardContent>
            </Card>

            <Card className={`border shadow-sm hover:shadow-md transition-all ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"}`}>
              <CardHeader className="pb-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold mb-2">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-extrabold">2. Integridad y Ética Bioética</CardTitle>
              </CardHeader>
              <CardContent className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Garantizamos que toda investigación cumpla con los principios bioéticos internacionales mediante la evaluación de nuestros Comités Científico y Bioético y el estricto apego al modelo PAT UNITEPC.
              </CardContent>
            </Card>

            <Card className={`border shadow-sm hover:shadow-md transition-all ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"}`}>
              <CardHeader className="pb-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold mb-2">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-extrabold">3. Transferencia y Difusión Científica</CardTitle>
              </CardHeader>
              <CardContent className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Cada proyecto financiado concluye en la elaboración y publicación de un artículo científico original indexado en revistas electrónicas de circulación nacional e internacional.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 5. SECCIÓN 2: CONVOCATORIAS VIGENTES Y FONDOS COMPETITIVOS 2026 */}
        <section id="convocatorias" className={`space-y-6 scroll-mt-24 border-t pt-12 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-blue-600 pl-4 py-1">
            <div>
              <Badge className={`mb-1 font-bold ${isDarkMode ? "bg-blue-500/10 text-blue-400 border-blue-500/30" : "bg-blue-100 text-blue-900 border-blue-300"}`}>
                Bases Oficiales 2026
              </Badge>
              <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Convocatorias de Investigación Abiertas
              </h2>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Seleccione una convocatoria para iniciar el registro de su propuesta preliminar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAMPAIGNS_DATA.map((camp) => (
              <Card key={camp.code} className={`border shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
              }`}>
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
                  <CardDescription className={`text-xs leading-relaxed mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    {camp.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 text-xs pb-3">
                  <div className={`p-3 rounded-xl border space-y-1.5 text-[11px] ${
                    isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Alcance:</span>
                      <span className="font-semibold">{camp.scope}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Fondo Total:</span>
                      <span className="font-mono font-bold text-blue-500">{camp.budgetPool}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Máximo por Proyecto:</span>
                      <span className="font-mono font-bold text-emerald-500">{camp.maxPerProject}</span>
                    </div>
                    <div className={`flex justify-between pt-1 border-t ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Cierre de Recepción:</span>
                      <span className="font-bold text-rose-500">{camp.deadline}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className={`pt-2 border-t ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
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

        {/* 6. SECCIÓN 3: TRABAJOS CONCLUIDOS, REVISTAS ELECTRÓNICAS Y ARTÍCULOS CIENTÍFICOS */}
        <section id="publicaciones" className={`space-y-6 scroll-mt-24 border-t pt-12 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-purple-600 pl-4 py-1">
            <div>
              <Badge className={`mb-1 font-bold ${isDarkMode ? "bg-purple-500/10 text-purple-400 border-purple-500/30" : "bg-purple-100 text-purple-900 border-purple-300"}`}>
                Divulgación & Producción Intelectual
              </Badge>
              <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Revistas Electrónicas y Artículos Científicos Publicados
              </h2>
              <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Trabajos de investigación concluidos por nuestros docentes y estudiantes difundidos en revistas indexadas
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar artículo, autor o revista..."
                className={`pl-9 text-xs ${isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
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
                  : isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
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
                  : isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
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
                  : isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
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
                  : isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                  : "bg-white border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
            >
              📚 Libros & Memorias
            </button>
          </div>

          {/* LISTADO DE TARJETAS DE ARTÍCULOS PUBLICADOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPapers.map((paper) => (
              <Card key={paper.id} className={`border shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className={`font-mono text-[10px] font-bold ${
                      isDarkMode ? "bg-purple-500/10 text-purple-400 border-purple-500/30" : "bg-purple-50 text-purple-800 border-purple-200"
                    }`}>
                      {paper.mediumType}
                    </Badge>
                    <Badge className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      Año {paper.year}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-extrabold mt-2 leading-snug">
                    {paper.title}
                  </CardTitle>
                  <CardDescription className={`text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    👤 Autores: <strong className={isDarkMode ? "text-slate-200" : "text-slate-800"}>{paper.authors}</strong>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 text-xs pb-3">
                  <p className={`leading-relaxed text-[11px] ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {paper.abstract}
                  </p>

                  <div className={`p-3 rounded-xl border space-y-1 font-mono text-[10px] ${
                    isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Revista / Medio:</span>
                      <span className="font-semibold">{paper.journal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Indexación:</span>
                      <span className="font-bold text-purple-400">{paper.indexing}</span>
                    </div>
                    <div className={`flex justify-between pt-1 border-t ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>Identificador DOI:</span>
                      <a href={paper.doi} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline truncate max-w-[200px]">
                        {paper.doi}
                      </a>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className={`pt-2 border-t flex items-center justify-between text-xs ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
                  <span className={`font-medium text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{paper.faculty}</span>
                  <Button variant="outline" size="sm" className={`text-xs h-8 gap-1.5 font-bold ${
                    isDarkMode ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700" : "text-blue-900 border-blue-200 hover:bg-blue-50"
                  }`}>
                    <Download className="h-3.5 w-3.5" />
                    <span>Ver Artículo Completo (PDF)</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* 7. SECCIÓN 4: FORMULARIO WEB DE POSTULACIÓN DE PROPUESTA */}
        <section id="postular" className={`space-y-6 scroll-mt-24 border-t pt-12 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA: INSTRUCTIVO Y REQUISITOS */}
            <div className="lg:col-span-5 space-y-5">
              <Badge className={`font-bold ${isDarkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-emerald-100 text-emerald-900 border-emerald-300"}`}>
                Formulario Oficial PAT UNITEPC
              </Badge>
              <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Registro de Propuesta Preliminar de Investigación
              </h2>
              <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                Complete los datos institucionales, académicos y presupuestarios solicitados conforme al <strong>Anexo 3 (Parte I y II)</strong> de la normativa universitaria. Su registro será evaluado por el Comité Científico, Comité Bioético y la Unidad de Contabilidad.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className={`flex items-start gap-3 p-3.5 rounded-xl border shadow-sm ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className={`font-bold block ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>Verificación Segura Antispam</span>
                    <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Protección con Google reCAPTCHA para garantizar la recepción de solicitudes.</span>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-3.5 rounded-xl border shadow-sm ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <FileCheck className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className={`font-bold block ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>Revisión por Pares Ciegos</span>
                    <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Dictámenes estructurados (Aprobado, Observado con opción a corrección, Rechazado).</span>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-3.5 rounded-xl border shadow-sm ${
                  isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <FileSpreadsheet className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className={`font-bold block ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>Fiscalización Impositiva Automatizada</span>
                    <span className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Retenciones de ley (Servicios 15.5%, Bienes 8%, Alquileres 16%) calculadas en tiempo real.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: FORMULARIO DINÁMICO */}
            <Card className={`lg:col-span-7 shadow-lg border ${
              isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
            }`}>
              <CardHeader className={`border-b ${isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span>Ficha de Postulación de Propuesta</span>
                  <Badge variant="outline" className="font-mono text-xs bg-blue-500/10 text-blue-400 border-blue-500/30 font-bold">
                    {formData.campaignCode}
                  </Badge>
                </CardTitle>
                <CardDescription className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
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
                      <h3 className="text-lg font-extrabold">¡Propuesta Registrada Exitosamente!</h3>
                      <p className={`text-xs max-w-md mx-auto ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                        Su propuesta preliminar fue recibida correctamente por la Dirección de Investigación Científica UNITEPC.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs font-mono text-slate-200 max-w-md mx-auto space-y-2">
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">Código de Seguimiento:</span>
                        <span className="font-bold text-emerald-400">{submittedReceipt.code}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">Fecha de Recepción:</span>
                        <span>{submittedReceipt.date}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
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
                      <span className={`font-bold text-xs uppercase tracking-wider block border-b pb-1 ${
                        isDarkMode ? "text-blue-400 border-slate-800" : "text-blue-900 border-slate-200"
                      }`}>
                        1. Selección de Convocatoria y Datos del Postulante
                      </span>

                      <div className="space-y-1">
                        <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Convocatoria a la que Aplica (*)
                        </label>
                        <select
                          value={formData.campaignCode}
                          onChange={(e) => setFormData({ ...formData, campaignCode: e.target.value })}
                          className={`w-full h-9 rounded-md border px-3 text-xs font-bold focus:outline-none ${
                            isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                          }`}
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
                          <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            Nombre Completo (*)
                          </label>
                          <Input
                            required
                            placeholder="Ej. Dr. Carlos Mamani Terán"
                            value={formData.leadInvestigator}
                            onChange={(e) => setFormData({ ...formData, leadInvestigator: e.target.value })}
                            className={`h-9 text-xs ${isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            C.I. / Pasaporte (*)
                          </label>
                          <Input
                            required
                            placeholder="Ej. 6894012 CB"
                            value={formData.ci}
                            onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
                            className={`h-9 text-xs ${isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            Correo Institucional (*)
                          </label>
                          <Input
                            type="email"
                            required
                            placeholder="ejemplo@unitepc.edu.bo"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`h-9 text-xs ${isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            Teléfono / WhatsApp (*)
                          </label>
                          <Input
                            required
                            placeholder="Ej. 79326793"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={`h-9 text-xs ${isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* PASO 2: ADSCRIPCIÓN INSTITUCIONAL Y EJE TEMÁTICO */}
                    <div className="space-y-3 pt-2">
                      <span className={`font-bold text-xs uppercase tracking-wider block border-b pb-1 ${
                        isDarkMode ? "text-blue-400 border-slate-800" : "text-blue-900 border-slate-200"
                      }`}>
                        2. Adscripción Institucional UNITEPC y Eje Temático
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            Sede UNITEPC (*)
                          </label>
                          <select
                            value={formData.sede}
                            onChange={(e) => setFormData({ ...formData, sede: e.target.value })}
                            className={`w-full h-9 rounded-md border px-3 text-xs focus:outline-none ${
                              isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                            }`}
                          >
                            {sedesList.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            Facultad Académica (*)
                          </label>
                          <select
                            value={formData.facultad}
                            onChange={(e) => setFormData({ ...formData, facultad: e.target.value })}
                            className={`w-full h-9 rounded-md border px-3 text-xs focus:outline-none ${
                              isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                            }`}
                          >
                            {facultadesList.map((f) => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            Carrera / Área (*)
                          </label>
                          <select
                            value={formData.carrera}
                            onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                            className={`w-full h-9 rounded-md border px-3 text-xs focus:outline-none ${
                              isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                            }`}
                          >
                            {carrerasList.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            Eje Temático UNITEPC (*)
                          </label>
                          <select
                            value={formData.ejeTematico}
                            onChange={(e) => setFormData({ ...formData, ejeTematico: e.target.value })}
                            className={`w-full h-9 rounded-md border px-3 text-xs focus:outline-none font-semibold ${
                              isDarkMode ? "bg-slate-950 border-slate-700 text-blue-400" : "bg-white border-slate-300 text-blue-900"
                            }`}
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
                      <span className={`font-bold text-xs uppercase tracking-wider block border-b pb-1 ${
                        isDarkMode ? "text-blue-400 border-slate-800" : "text-blue-900 border-slate-200"
                      }`}>
                        3. Perfil del Proyecto (Anexo 3 - Parte I y II)
                      </span>

                      <div className="space-y-1">
                        <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Título Tentativo del Proyecto (*)
                        </label>
                        <Input
                          required
                          placeholder="Ej. Evaluación epidemiológica de brotes de dengue en la región tropical..."
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className={`h-9 text-xs ${isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Planteamiento del Problema / Resumen (*)
                        </label>
                        <textarea
                          required
                          rows={3}
                          className={`w-full rounded-md border p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-900 ${
                            isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                          }`}
                          placeholder="Describa la hipótesis de trabajo, el objeto de estudio y la problemática científica a resolver..."
                          value={formData.abstractText}
                          onChange={(e) => setFormData({ ...formData, abstractText: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                          Monto Presupuestario Estimado Solicitado (Bs.) (*)
                        </label>
                        <Input
                          type="number"
                          required
                          min={1000}
                          max={50000}
                          value={formData.requestedBudget}
                          onChange={(e) => setFormData({ ...formData, requestedBudget: Number(e.target.value) })}
                          className={`h-9 text-xs font-mono font-bold ${
                            isDarkMode ? "bg-slate-950 border-slate-700 text-emerald-400" : "bg-white border-slate-300 text-emerald-700"
                          }`}
                        />
                      </div>
                    </div>

                    {/* WIDGET RECAPTCHA INTERACTIVO DE SEGURIDAD */}
                    <div className="pt-2">
                      <label className={`font-semibold block mb-1.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                        Verificación Antispam Security
                      </label>
                      <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                        isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-300"
                      }`}>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={handleRecaptchaClick}
                            className={`h-7 w-7 rounded-md border transition-all flex items-center justify-center ${
                              recaptchaStatus === "verified"
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                : isDarkMode
                                ? "bg-slate-900 border-slate-700 hover:border-blue-500"
                                : "bg-white border-slate-400 hover:border-blue-900"
                            }`}
                          >
                            {recaptchaStatus === "verifying" && (
                              <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                            )}
                            {recaptchaStatus === "verified" && (
                              <CheckCircle2 className="h-5 w-5" />
                            )}
                          </button>
                          <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
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
                        className="w-full gap-2 shadow-lg font-extrabold text-xs py-5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl"
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

      {/* 8. FOOTER INSTITUCIONAL COMPLETO CON SOPORTE MODO NOCHE / DÍA */}
      <footer className={`border-t py-10 text-xs transition-colors mt-auto shrink-0 ${
        isDarkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-600"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center gap-2">
                <img
                  src="/unitepc_logo.png"
                  alt="UNITEPC Logo"
                  className="h-8 object-contain"
                />
                <span className={`font-extrabold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Universidad Técnica Privada Cosmos (UNITEPC)
                </span>
              </div>
              <p className={`text-xs leading-relaxed max-w-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Dirección de Investigación Científica • Sistema Integrado de Gestión de Proyectos de Investigación y Fiscalización Presupuestaria (SIGPRI).
              </p>
            </div>

            <div className="space-y-2">
              <span className={`font-bold block uppercase text-[10px] tracking-wider ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                Sedes Nacionales
              </span>
              <ul className="space-y-1 text-[11px]">
                <li>Cochabamba (Campus Central)</li>
                <li>La Paz (Sede Central)</li>
                <li>Santa Cruz • Cobija</li>
                <li>Ivirgarzama • Puerto Quijarro</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className={`font-bold block uppercase text-[10px] tracking-wider ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                Contacto e Información
              </span>
              <ul className="space-y-1 text-[11px]">
                <li>Correo: investigacion@unitepc.edu.bo</li>
                <li>Teléfono: +591 (4) 4252525</li>
                <li>Gestión Académica 2026</li>
              </ul>
            </div>
          </div>

          <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] ${
            isDarkMode ? "border-slate-800" : "border-slate-200"
          }`}>
            <p>© 2026 Universidad Técnica Privada Cosmos (UNITEPC). Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className={`font-semibold ${isDarkMode ? "text-blue-400 hover:text-white" : "text-blue-900 hover:text-slate-900"}`}>
                Acceso SIGPRI
              </Link>
              <span>&bull;</span>
              <Link href="/directorio" className={`font-semibold ${isDarkMode ? "text-blue-400 hover:text-white" : "text-blue-900 hover:text-slate-900"}`}>
                Directorio Interno
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* TOAST ELEGANTE */}
      <ElegantToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
