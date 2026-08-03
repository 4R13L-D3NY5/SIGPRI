"use client";

import {
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileCheck,
  FileText,
  Globe,
  Lock,
  Mail,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ElegantToast, ToastState } from "@/components/ui/elegant-toast";
import { ProposalTutorialModal } from "@/components/proposal-tutorial-modal";

const publicProjects = [
  {
    code: "INV-2026-089",
    title: "Síntesis de Nanopartículas de Plata con Extractos Vegetales de la Amazonía",
    researcher: "Dr. Marcelo Vargas Rocha",
    faculty: "Ciencias Puras y Naturales",
    area: "Biotecnología & Química",
    summary: "Investigación orientada a la creación de desinfectantes ecológicos de alta eficiencia para zonas rurales.",
  },
  {
    code: "INV-2026-077",
    title: "Optimización Algorítmica basada en IA para Redes Eléctricas Rurales",
    researcher: "Dra. Elena Quispe Mamani",
    faculty: "Ingeniería",
    area: "Energías Renovables & IA",
    summary: "Algoritmos inteligentes para garantizar la estabilidad de micro-redes solares en comunidades aisladas.",
  },
  {
    code: "INV-2025-044",
    title: "Turismo Sostenible y Cadenas de Valor en el Lago Titicaca",
    researcher: "MSc. Javier Condori Larico",
    faculty: "Ciencias Sociales",
    area: "Desarrollo Comunitario",
    summary: "Estrategias de desarrollo socioeconómico sin pérdida de patrimonio cultural ni daño ecológico.",
  },
];

export default function PublicPortalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    identityCard: "",
    title: "",
    area: "Ingeniería y Tecnología",
    summary: "",
  });

  // reCAPTCHA state
  const [recaptchaStatus, setRecaptchaStatus] = useState<"idle" | "verifying" | "verified">("idle");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleRecaptchaClick = () => {
    if (recaptchaStatus === "verified") return;
    setRecaptchaStatus("verifying");
    setTimeout(() => {
      setRecaptchaStatus("verified");
    }, 1200);
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (recaptchaStatus !== "verified") {
      setToast({ message: "Por favor confirme la verificación de seguridad reCAPTCHA ('No soy un robot').", type: "error" });
      return;
    }

    setFormSubmitted(true);
  };

  const filteredProjects = publicProjects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.researcher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Público */}
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow">
              U
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base block leading-none">UNITEPC Portal Público</span>
              <span className="text-[11px] text-muted-foreground">Dirección de Investigación Científica</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ProposalTutorialModal />

            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link href="/sign-in">Acceso Institucional</Link>
            </Button>
            <Button asChild size="sm" className="text-xs gap-1 shadow">
              <Link href="/">
                <Globe className="h-3.5 w-3.5" /> Dashboard Interno
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-primary/5 via-background to-background py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <Badge variant="outline" className="px-3 py-1 text-xs border-primary/30 text-primary gap-1">
            <Sparkles className="h-3 w-3" /> Transparencia y Divulgación Científica
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Portal Abierto de Investigación y Convocatorias Institucionales
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Consulte los proyectos de investigación científica financiados por la universidad o envíe una propuesta preliminar de investigación a nuestros comités evaluadores.
          </p>
          <div className="pt-2 flex justify-center">
            <ProposalTutorialModal
              triggerButtonText="📖 Ver Guía Interactiva y Diagrama de Flujo del Investigador"
              triggerButtonClassName="font-bold text-xs gap-2 px-5 py-2.5 shadow-md bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 flex-1 w-full">
        {/* Sección 1: Proyectos Destacados */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Proyectos Científicos Aprobados</h2>
              <p className="text-xs text-muted-foreground">Catálogo público de investigaciones en curso</p>
            </div>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proyecto público..."
                className="pl-9 text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <Card key={p.code} className="hover:shadow-md transition-all flex flex-col justify-between border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-[10px]">{p.code}</Badge>
                    <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px] border-emerald-500/20">Aprobado</Badge>
                  </div>
                  <CardTitle className="text-sm font-bold mt-2 leading-snug">{p.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2 mt-1">{p.summary}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs space-y-2 pb-3">
                  <div className="bg-muted/40 p-2.5 rounded-lg border text-[11px]">
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Investigador</span>
                    <span className="font-medium text-foreground">{p.researcher}</span>
                    <span className="block text-muted-foreground text-[10px]">{p.faculty}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t text-[11px] text-muted-foreground flex justify-between items-center">
                  <span>{p.area}</span>
                  <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                    Ver Más <ChevronRight className="h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Sección 2: Formulario de Propuesta Preliminar con reCAPTCHA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t pt-10">
          <div className="lg:col-span-5 space-y-4">
            <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/30">Envío de Propuestas</Badge>
            <h2 className="text-2xl font-bold">¿Tienes una Idea de Investigación?</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Complete el formulario para enviar una propuesta preliminar de proyecto para la gestión actual. El comité evaluador de la Dirección de Investigación analizará la viabilidad y le contactará por correo electrónico.
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-foreground block">Verificación Segura con reCAPTCHA</span>
                  <span className="text-muted-foreground text-[11px]">Protección anti-spam para la recepción de solicitudes.</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
                <FileCheck className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold text-foreground block">Revisión por Pares Ciegos</span>
                  <span className="text-muted-foreground text-[11px]">Evaluación transparente bajo la normativa UNITEPC.</span>
                </div>
              </div>
            </div>
          </div>

          <Card className="lg:col-span-7 shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="text-base font-bold">Formulario de Registro de Propuesta</CardTitle>
              <CardDescription className="text-xs">
                Complete todos los campos requeridos y resuelva la verificación reCAPTCHA
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formSubmitted ? (
                <div className="py-8 text-center space-y-3 animate-in fade-in">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-base">¡Propuesta Registrada Exitosamente!</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Su propuesta preliminar fue recibida. Se le ha asignado el código de seguimiento provisional.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setFormSubmitted(false)} className="text-xs">
                    Enviar Otra Propuesta
                  </Button>
                </div>
              ) : (
                        placeholder="Ej. 6894012 LP"
                        value={formData.identityCard}
                        onChange={(e) => setFormData({ ...formData, identityCard: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Correo Electrónico Institucional</label>
                      <Input
                        type="email"
                        required
                        placeholder="ejemplo@universidad.edu.bo"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Área Temática Principal</label>
                      <select
                        className="w-full h-9 rounded-md border bg-background px-3 text-xs outline-none"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      >
                        <option value="Ingeniería y Tecnología">Ingeniería y Tecnología</option>
                        <option value="Ciencias de la Salud & Bioética">Ciencias de la Salud & Bioética</option>
                        <option value="Ciencias Puras y Naturales">Ciencias Puras y Naturales</option>
                        <option value="Ciencias Agrícolas y Pecuarias">Ciencias Agrícolas y Pecuarias</option>
                        <option value="Ciencias Sociales y Humanidades">Ciencias Sociales y Humanidades</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Título Tentativo de la Propuesta</label>
                    <Input
                      required
                      placeholder="Ej. Desarrollo de celdas solares con minerales locales"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Resumen del Proyecto (Máx. 300 palabras)</label>
                    <textarea
                      rows={3}
                      className="w-full rounded-md border bg-background p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                      placeholder="Describa el objetivo principal, metodología e impacto..."
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    />
                  </div>

                  {/* Widget reCAPTCHA Interactivo */}
                  <div className="pt-2">
                    <div className="inline-flex flex-col rounded-lg border bg-muted/30 p-3 shadow-sm min-w-[280px]">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleRecaptchaClick}
                          className={`h-7 w-7 rounded border transition-all flex items-center justify-center ${
                            recaptchaStatus === "verified"
                              ? "bg-emerald-600 border-emerald-600 text-white"
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

                      <div className="mt-2 pt-2 border-t flex items-center justify-between text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Lock className="h-3 w-3 text-muted-foreground" />
                          <span>reCAPTCHA v3</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="hover:underline cursor-pointer">Privacidad</span>
                          <span>&bull;</span>
                          <span className="hover:underline cursor-pointer">Términos</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={recaptchaStatus !== "verified"}
                      className="w-full gap-2 shadow font-bold"
                    >
                      <Send className="h-4 w-4" /> Enviar Propuesta a Investigación
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer Público */}
      <footer className="border-t bg-card py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Universidad Técnica Privada Cosmos (UNITEPC) — Sistema SIGPRI. Todos los derechos reservados.</p>
          <p className="text-[11px] mt-1">Plataforma de Investigación & Fiscalización Financiera</p>
        </div>
      </footer>

      {/* TOAST ELEGANTE */}
      <ElegantToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
