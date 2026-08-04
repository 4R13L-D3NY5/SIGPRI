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
  CheckSquare,
  Sun,
  Moon
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
  
  // MODO NOCHE / MODO DÍA TOGGLE STATE (Predefinido en Modo Noche)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

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
    <div className={`min-h-screen transition-colors duration-200 flex flex-col justify-between p-4 sm:p-6 ${
      isDarkMode ? "bg-slate-950 text-slate-100 selection:bg-blue-900 selection:text-white" : "bg-slate-50 text-slate-900 selection:bg-blue-900 selection:text-white"
    }`}>
      
      {/* HEADER PRINCIPAL CON BOTÓN TOGGLE MODO DÍA / NOCHE */}
      <header className={`flex items-center justify-between max-w-7xl w-full mx-auto pb-4 border-b ${
        isDarkMode ? "border-slate-800" : "border-slate-200"
      }`}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-900 text-white font-extrabold flex items-center justify-center text-lg shadow-md">
            S
          </div>
          <div>
            <h1 className={`font-bold text-lg leading-none tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Acceso al Sistema SIGPRI UNITEPC
            </h1>
            <p className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Sistema de Gestión de Proyectos e Investigaciones UNITEPC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* BOTÓN CONMUTADOR MODO NOCHE / MODO DÍA */}
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
            triggerButtonText="📖 Guía & Flujo de Postulación"
            triggerButtonClassName={`text-xs font-bold gap-1.5 px-3 py-2 rounded-lg transition-all border ${
              isDarkMode 
                ? "bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800" 
                : "bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
            }`}
          />

          <Button
            variant={isRegisterMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className={`text-xs font-bold gap-1.5 ${
              isDarkMode 
                ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800" 
                : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
            }`}
          >
            <UserPlus className="h-4 w-4 text-blue-500" />
            {isRegisterMode ? "Ir a Iniciar Sesión" : "Registrarme como Investigador"}
          </Button>

          <Link href="/portal-publico">
            <Button variant="ghost" size="sm" className={`text-xs ${isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}>
              <Globe className="h-4 w-4 mr-1 text-emerald-500" /> Portal Público
            </Button>
          </Link>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl w-full mx-auto py-8 flex-1 flex flex-col justify-center">
        {isRegisterMode ? (
          // APARTADO DE REGISTRO DE INVESTIGADOR CON RECAPTCHA
          <div className={`max-w-2xl mx-auto w-full border rounded-2xl shadow-xl p-6 sm:p-8 ${
            isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <InvestigatorRegisterForm onCancel={() => setIsRegisterMode(false)} />
          </div>
        ) : (
          // APARTADO DE SELECCIÓN DE ROLES E INICIO DE SESIÓN
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SELECCIÓN DE PERFIL / ROL (6 ROLES INSTITUCIONALES) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    SELECCIÓN DE PERFIL / ROL INSTITUCIONAL
                  </h2>
                  <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Elija su rol institucional para ajustar los permisos de navegación y control
                  </p>
                </div>
                <Badge variant="outline" className={`font-mono font-bold text-xs ${
                  isDarkMode ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-blue-100 border-blue-300 text-blue-900"
                }`}>
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
                          ? isDarkMode 
                            ? "bg-slate-900 border-blue-500 ring-2 ring-blue-500/30 shadow-md text-white" 
                            : "bg-white border-blue-900 ring-2 ring-blue-900/20 shadow-md text-slate-900"
                          : isDarkMode
                            ? "bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 text-slate-300"
                            : "bg-white/80 border-slate-200 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`p-2.5 rounded-lg shrink-0 ${
                          isSelected 
                            ? "bg-blue-900 text-white" 
                            : isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
                        }`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-bold text-sm truncate ${
                              isSelected 
                                ? isDarkMode ? "text-blue-400" : "text-blue-900" 
                                : isDarkMode ? "text-slate-200" : "text-slate-800"
                            }`}>
                              {role.title}
                            </h3>
                          </div>
                          <p className={`text-xs line-clamp-1 mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                            {role.description}
                          </p>
                        </div>
                      </div>

                      <Badge variant="outline" className={`shrink-0 font-bold text-[10px] ${
                        isSelected 
                          ? isDarkMode ? "bg-blue-500/15 border-blue-500/40 text-blue-400" : "bg-blue-100 border-blue-300 text-blue-900"
                          : isDarkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
                      }`}>
                        {role.badgeText}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FORMULARIO DE INICIO DE SESIÓN CON CREDENCIALES ROL */}
            <div className="lg:col-span-5 space-y-6">
              <Card className={`border shadow-xl ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
              }`}>
                <CardHeader className={`space-y-1 border-b pb-4 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={`font-mono text-[10px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Credenciales Rol Institucional
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold">Iniciar Sesión</CardTitle>
                  <CardDescription className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Acceso configurado para <strong className={`font-bold ${isDarkMode ? "text-blue-400" : "text-blue-900"}`}>{selectedRole.title}</strong>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-5 space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                        Correo Institucional
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`pl-9 font-mono text-xs ${
                            isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className={`font-semibold block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                        Contraseña de Acceso
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`pl-9 font-mono text-xs ${
                            isDarkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border text-[11px] leading-relaxed ${
                      isDarkMode ? "bg-slate-950/60 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}>
                      <span className={`font-bold block mb-0.5 ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>
                        Modo Permisos Rol Activado
                      </span>
                      Permisos asignados: <strong className={isDarkMode ? "text-blue-400" : "text-blue-900"}>{selectedRole.badgeText}</strong>.
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold h-10 text-xs sm:text-sm gap-2 mt-2"
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

                <CardFooter className={`flex flex-col gap-2 pt-0 pb-4 border-t mt-4 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
                  <div className="w-full pt-3 flex items-center justify-between text-xs">
                    <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>¿Eres nuevo en la plataforma?</span>
                    <button
                      onClick={() => setIsRegisterMode(true)}
                      className={`font-bold hover:underline flex items-center gap-1 ${isDarkMode ? "text-blue-400" : "text-blue-900"}`}
                    >
                      Registrarme <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardFooter>
              </Card>

              {/* BANNER DE ACCESO DIRECTO A PROPUESTAS */}
              <div className={`p-4 rounded-xl border space-y-3 ${
                isDarkMode ? "bg-slate-900/80 border-slate-800 text-slate-200" : "bg-blue-50/60 border-blue-200 text-slate-800"
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-900/20 text-blue-500">
                    <FileUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm">¿Eres Investigador? Presenta tu Propuesta</h4>
                    <p className={`text-[11px] ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Si ya estás registrado, ingresa directamente para cargar tu proyecto de investigación.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/carga-propuesta" className="w-full">
                    <Button variant="outline" size="sm" className={`w-full font-bold text-xs gap-1.5 ${
                      isDarkMode ? "border-slate-700 bg-slate-900 text-blue-400 hover:bg-slate-800" : "border-blue-300 bg-white text-blue-900 hover:bg-blue-50"
                    }`}>
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
      <footer className={`max-w-7xl w-full mx-auto pt-4 border-t flex items-center justify-between text-xs ${
        isDarkMode ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"
      }`}>
        <span>© 2026 Ecosistema SIGPRI - UNITEPC</span>
        <div className="flex items-center gap-4">
          <Link href="/portal-publico" className={`hover:underline ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
            Portal Público
          </Link>
          <button onClick={() => setIsRegisterMode(true)} className={`font-bold hover:underline ${isDarkMode ? "text-blue-400" : "text-blue-900"}`}>
            Registro de Investigador
          </button>
        </div>
      </footer>

    </div>
  );
}
