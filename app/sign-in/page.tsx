"use client";

import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calculator,
  Check,
  CheckCircle2,
  FileCheck,
  FolderGit2,
  Globe,
  GraduationCap,
  KeyRound,
  Lock,
  LogIn,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  FileUp,
  Calendar,
  Sliders,
  UserPlus,
  BarChart3,
  Search,
  CheckSquare
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InvestigatorRegisterForm } from "./_components/investigator-register-form";
import { ProposalTutorialModal } from "@/components/proposal-tutorial-modal";

export interface RoleOption {
  id: string;
  title: string;
  description: string;
  badgeText: string;
  icon: any;
  defaultEmail: string;
}

// 6 ROLES INSTITUCIONALES OFICIALES SOLICITADOS
const roles: RoleOption[] = [
  {
    id: "admin",
    title: "1. Administrador",
    description: "Acceso total al sistema, gestión de usuarios, módulos y parámetros globales",
    badgeText: "Acceso Total",
    icon: ShieldCheck,
    defaultEmail: "admin@unitepc.edu.bo",
  },
  {
    id: "jefe_investigador",
    title: "2. Jefe Investigador",
    description: "Acceso a todos los proyectos, parametrización de convocatorias/campañas y reportes",
    badgeText: "Convocatorias & Reportes",
    icon: Sliders,
    defaultEmail: "jefe.investigador@unitepc.edu.bo",
  },
  {
    id: "directorio",
    title: "3. Directorio",
    description: "Acceso visual, seguimiento de avance de proyectos (lectura) y reportes ejecutivos",
    badgeText: "Seguimiento (Lectura)",
    icon: BarChart3,
    defaultEmail: "directorio@unitepc.edu.bo",
  },
  {
    id: "investigador",
    title: "4. Investigador",
    description: "Acceso a los proyectos en los que participa y carga de propuestas de investigación",
    badgeText: "Carga & Mis Proyectos",
    icon: FolderGit2,
    defaultEmail: "investigador@unitepc.edu.bo",
  },
  {
    id: "comite",
    title: "5. Comité",
    description: "Acceso a proyectos (lectura) y apartado de evaluación por dictamen científico y bioético",
    badgeText: "Evaluación & Comités",
    icon: UserCheck,
    defaultEmail: "comite.evaluador@unitepc.edu.bo",
  },
  {
    id: "contabilidad",
    title: "6. Contabilidad",
    description: "Acceso a proyectos (lectura) y apartado de evaluación presupuestaria y retenciones impositivas",
    badgeText: "Presupuestos y Retenciones",
    icon: Calculator,
    defaultEmail: "contabilidad@unitepc.edu.bo",
  },
];

export default function SignInPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleOption>(roles[0]);
  const [email, setEmail] = useState<string>(roles[0].defaultEmail);
  const [password, setPassword] = useState<string>("dicyt2026pass");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  const handleRoleSelect = (role: RoleOption) => {
    setSelectedRole(role);
    setEmail(role.defaultEmail);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Guardar el rol seleccionado en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("sigpri_user_role", selectedRole.id);
        localStorage.setItem(
          "sigpri_current_user",
          JSON.stringify({
            name: selectedRole.title,
            email: email,
            role: selectedRole.id,
            roleLabel: selectedRole.badgeText,
          })
        );
      }

      setIsLoading(false);

      // Si es investigador, redirigir a carga-propuesta o directorio
      if (selectedRole.id === "investigador") {
        router.push("/carga-propuesta");
      } else {
        router.push("/directorio");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-4 sm:p-6">
      
      {/* HEADER PRINCIPAL */}
      <header className="flex items-center justify-between max-w-7xl w-full mx-auto pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground font-extrabold flex items-center justify-center text-lg shadow-md">
            S
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-tight">Acceso al Sistema SIGPRI UNITEPC</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sistema de Gestión de Proyectos e Investigaciones UNITEPC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ProposalTutorialModal />

          <Button
            variant={isRegisterMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-xs font-bold gap-1.5"
          >
            <UserPlus className="h-4 w-4" />
            {isRegisterMode ? "Ir a Iniciar Sesión" : "Registrarme como Investigador"}
          </Button>

          <Link href="/portal-publico">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
              <Globe className="h-4 w-4 mr-1" /> Portal Público
            </Button>
          </Link>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl w-full mx-auto py-8 flex-1 flex flex-col justify-center">
        {isRegisterMode ? (
          // APARTADO DE REGISTRO DE INVESTIGADOR CON RECAPTCHA
          <div className="max-w-2xl mx-auto w-full bg-card border border-border rounded-2xl shadow-xl p-6 sm:p-8">
            <InvestigatorRegisterForm onCancel={() => setIsRegisterMode(false)} />
          </div>
        ) : (
          // APARTADO DE SELECCIÓN DE ROLES E INICIO DE SESIÓN
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SELECCIÓN DE PERFIL / ROL (6 ROLES INSTITUCIONALES) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">SELECCIÓN DE PERFIL / ROL INSTITUCIONAL</h2>
                  <p className="text-xs text-muted-foreground">Elija su rol institucional para ajustar los permisos de navegación y control</p>
                </div>
                <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold text-xs">
                  6 Roles Disponibles
                </Badge>
              </div>

              <div className="space-y-2.5">
                {roles.map((role) => {
                  const isSelected = selectedRole.id === role.id;
                  const IconComponent = role.icon;
                  return (
                    <div
                      key={role.id}
                      onClick={() => handleRoleSelect(role)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? "bg-card border-primary ring-2 ring-primary/30 shadow-md"
                          : "bg-card/50 border-border hover:bg-card hover:border-border/80"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-bold text-sm truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
                              {role.title}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {role.description}
                          </p>
                        </div>
                      </div>

                      <Badge variant="outline" className={`shrink-0 font-bold text-[10px] ${isSelected ? "bg-primary/15 border-primary/40 text-primary" : "bg-muted text-muted-foreground border-border"}`}>
                        {role.badgeText}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FORMULARIO DE INICIO DE SESIÓN CON CREDENCIALES ROL */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="border-border shadow-xl bg-card">
                <CardHeader className="space-y-1 border-b border-border pb-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
                      Credenciales Rol Institucional
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold">Iniciar Sesión</CardTitle>
                  <CardDescription className="text-xs">
                    Acceso configurado para <strong className="text-primary font-bold">{selectedRole.title}</strong>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-5 space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-foreground">Correo Institucional</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 font-mono text-xs bg-background"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-foreground">Contraseña DICYT</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9 font-mono text-xs bg-background"
                          required
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/30 border border-border text-[11px] text-muted-foreground leading-relaxed">
                      <span className="font-bold text-foreground block mb-0.5">Modo Permisos Rol Activado</span>
                      Permisos asignados: <strong className="text-primary">{selectedRole.badgeText}</strong>.
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary/90 font-bold h-10 text-xs sm:text-sm gap-2 mt-2"
                    >
                      {isLoading ? (
                        <span>Ingresando...</span>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4" />
                          <span>Ingresar como {selectedRole.badgeText}</span>
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>

                <CardFooter className="flex flex-col gap-2 pt-0 pb-4 border-t border-border mt-4">
                  <div className="w-full pt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>¿Eres nuevo en la plataforma?</span>
                    <button
                      onClick={() => setIsRegisterMode(true)}
                      className="text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      Registrarme <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardFooter>
              </Card>

              {/* BANNER DE ACCESO DIRECTO A PROPUESTAS */}
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <FileUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-foreground">¿Eres Investigador? Presenta tu Propuesta</h4>
                    <p className="text-[11px] text-muted-foreground">Si ya estás registrado, ingresa directamente para cargar tu proyecto de investigación.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/carga-propuesta" className="w-full">
                    <Button variant="outline" size="sm" className="w-full border-primary/40 text-primary font-bold text-xs gap-1.5">
                      Ir Directo a Propuestas <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* FOOTER PÁGINA */}
      <footer className="max-w-7xl w-full mx-auto pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>© 2026 Ecosistema SIGPRI - UNITEPC</span>
        <div className="flex items-center gap-4">
          <Link href="/portal-publico" className="hover:underline">Portal Público</Link>
          <button onClick={() => setIsRegisterMode(true)} className="text-primary font-bold hover:underline">
            Registro de Investigador
          </button>
        </div>
      </footer>

    </div>
  );
}
