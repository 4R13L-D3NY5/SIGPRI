"use client";

import { useState, useEffect } from "react";
import { 
  User, Mail, Phone, Lock, Building2, IdCard, ShieldCheck, CheckCircle2, 
  ArrowRight, RefreshCw, Sparkles, UserPlus, MapPin, Briefcase, GraduationCap, Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  UNITEPC_SEDES_DATA, 
  getUNITEPCFacultades, 
  getUNITEPCCarreras 
} from "@/lib/unitepc-structure";

interface InvestigatorRegisterFormProps {
  onCancel?: () => void;
}

export function InvestigatorRegisterForm({ onCancel }: InvestigatorRegisterFormProps) {
  const router = useRouter();

  // Tipo de Investigador: "INTERNO" | "EXTERNO"
  const [investigatorType, setInvestigatorType] = useState<"INTERNO" | "EXTERNO">("INTERNO");

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    ciNumber: "",
    email: "",
    phone: "",
    sede: "Cochabamba",
    facultad: "Facultad de Ciencias de la Salud",
    carrera: "Medicina",
    externalInstitution: "",
    externalOccupation: "",
    cityCountry: "Cochabamba, Bolivia",
    password: "",
  });

  // Dynamic Lists for Interno
  const sedesList = Object.keys(UNITEPC_SEDES_DATA);
  const [facultadesList, setFacultadesList] = useState<string[]>([]);
  const [carrerasList, setCarrerasList] = useState<string[]>([]);

  // Captcha State
  const [captchaCode, setCaptchaCode] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [isRobotChecked, setIsRobotChecked] = useState(false);
  const [captchaError, setCaptchaError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Actualizar facultades cuando cambia la sede
  useEffect(() => {
    const facs = getUNITEPCFacultades(formData.sede);
    setFacultadesList(facs);
    if (facs.length > 0) {
      const firstFac = facs[0];
      setFormData((prev) => ({ ...prev, facultad: firstFac }));
      const cars = getUNITEPCCarreras(formData.sede, firstFac);
      setCarrerasList(cars);
      if (cars.length > 0) {
        setFormData((prev) => ({ ...prev, carrera: cars[0] }));
      }
    }
  }, [formData.sede]);

  // Actualizar carreras cuando cambia la facultad
  useEffect(() => {
    const cars = getUNITEPCCarreras(formData.sede, formData.facultad);
    setCarrerasList(cars);
    if (cars.length > 0) {
      setFormData((prev) => ({ ...prev, carrera: cars[0] }));
    }
  }, [formData.facultad]);

  // Generar código Captcha aleatorio
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserCaptchaInput("");
    setCaptchaError("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRobotChecked) {
      setCaptchaError("Debe marcar la casilla de verificación reCAPTCHA.");
      return;
    }

    if (userCaptchaInput.toUpperCase() !== captchaCode.toUpperCase()) {
      setCaptchaError("El código de seguridad ingresado no coincide.");
      generateCaptcha();
      return;
    }

    setIsLoading(true);
    setCaptchaError("");

    setTimeout(() => {
      // Guardar datos en localStorage
      const userProfile = {
        name: formData.fullName || "Investigador Registrado",
        email: formData.email,
        role: "investigador",
        roleLabel: "Investigador",
        type: investigatorType,
        institution: investigatorType === "INTERNO" ? "UNITEPC" : (formData.externalInstitution || "Institución Externa"),
        sede: investigatorType === "INTERNO" ? formData.sede : "-",
        facultad: investigatorType === "INTERNO" ? formData.facultad : "-",
        carrera: investigatorType === "INTERNO" ? formData.carrera : "-",
        occupation: investigatorType === "INTERNO" ? "Docente Investigador" : (formData.externalOccupation || "Investigador Externo"),
        ci: formData.ciNumber,
        cityCountry: formData.cityCountry,
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("sigpri_user_role", "investigador");
        localStorage.setItem("sigpri_current_user", JSON.stringify(userProfile));
      }

      setIsLoading(false);
      setSuccessMsg("¡Registro exitoso! Redirigiendo al formulario de presentación de propuestas...");

      setTimeout(() => {
        router.push("/carga-propuesta");
      }, 1200);
    }, 1000);
  };

  return (
    <div className="space-y-5 animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="space-y-0.5">
          <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 font-bold text-[10px]">
            DICYT UNITEPC
          </Badge>
          <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Registro de Nuevo Investigador
          </h3>
          <p className="text-xs text-muted-foreground">
            Complete sus datos académicos o institucionales para postular a las convocatorias.
          </p>
        </div>

        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-xs text-muted-foreground">
            Volver al Login
          </Button>
        )}
      </div>

      {successMsg ? (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm space-y-2 text-center">
          <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-400 animate-bounce" />
          <p className="font-bold">{successMsg}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">

          {/* SELECCIÓN TIPO DE INVESTIGADOR (INTERNO / EXTERNO) */}
          <div className="space-y-1.5">
            <label className="font-bold text-foreground block text-xs">
              Tipo de Investigador Proponente <span className="text-primary">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setInvestigatorType("INTERNO")}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                  investigatorType === "INTERNO"
                    ? "bg-primary text-primary-foreground border-primary shadow-md ring-2 ring-primary/30"
                    : "bg-muted/40 border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Investigador Interno UNITEPC</span>
              </button>

              <button
                type="button"
                onClick={() => setInvestigatorType("EXTERNO")}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                  investigatorType === "EXTERNO"
                    ? "bg-primary text-primary-foreground border-primary shadow-md ring-2 ring-primary/30"
                    : "bg-muted/40 border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                <Globe className="h-4 w-4" />
                <span>Investigador Externo / Empresa</span>
              </button>
            </div>
          </div>
          
          {/* NOMBRE COMPLETO & C.I. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground block">
                Nombre Completo <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="text"
                  placeholder="Ej. Dra. Elena Claros Guzmán"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="pl-9 h-9 text-xs bg-background"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground block">
                Carnet de Identidad (C.I.) <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <IdCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="text"
                  placeholder="Ej. 6522053 CBBA"
                  value={formData.ciNumber}
                  onChange={(e) => setFormData({ ...formData, ciNumber: e.target.value })}
                  className="pl-9 h-9 text-xs bg-background font-mono"
                />
              </div>
            </div>
          </div>

          {/* CORREO INSTITUCIONAL & TELÉFONO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-foreground block">
                Correo Electrónico {investigatorType === "INTERNO" ? "(Institucional UNITEPC)" : ""} <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="email"
                  placeholder={investigatorType === "INTERNO" ? "usuario@unitepc.edu.bo" : "correo@empresa.com"}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-9 h-9 text-xs bg-background font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground block">
                Teléfono / WhatsApp <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="text"
                  placeholder="Ej. 79326793"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-9 h-9 text-xs bg-background font-mono"
                />
              </div>
            </div>
          </div>

          {/* CAMPOS ESPECÍFICOS SEGÚN SEA INTERNO O EXTERNO */}
          {investigatorType === "INTERNO" ? (
            // INVESTIGADOR INTERNO: SELECTS EN CASCADA (SEDE ➔ FACULTAD ➔ CARRERA)
            <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-primary" />
                  Estructura Académica UNITEPC
                </span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 font-bold">
                  8 Sedes Disponibles
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* SELECT SEDE */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground block">Sede UNITEPC *</label>
                  <select
                    value={formData.sede}
                    onChange={(e) => setFormData({ ...formData, sede: e.target.value })}
                    className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs text-foreground font-semibold"
                  >
                    {sedesList.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* SELECT FACULTAD */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground block">Facultad *</label>
                  <select
                    value={formData.facultad}
                    onChange={(e) => setFormData({ ...formData, facultad: e.target.value })}
                    className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs text-foreground truncate"
                  >
                    {facultadesList.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* SELECT CARRERA */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground block">Carrera / Unidad *</label>
                  <select
                    value={formData.carrera}
                    onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                    className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs text-foreground font-bold text-primary"
                  >
                    {carrerasList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            // INVESTIGADOR EXTERNO: EMPRESA, INSTITUCIÓN, CARGO Y CIUDAD
            <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-primary" />
                  Datos de la Empresa / Institución Externa
                </span>
                <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/30 font-bold">
                  Proponente Externo
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground block">
                    Empresa / Institución de Origen *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      required
                      type="text"
                      placeholder="Ej. Hospital Viedma / YPFB / EMAGUA"
                      value={formData.externalInstitution}
                      onChange={(e) => setFormData({ ...formData, externalInstitution: e.target.value })}
                      className="pl-9 h-9 text-xs bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground block">
                    Cargo / Profesión / Ocupación *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      required
                      type="text"
                      placeholder="Ej. Director de Investigación / Consultor"
                      value={formData.externalOccupation}
                      onChange={(e) => setFormData({ ...formData, externalOccupation: e.target.value })}
                      className="pl-9 h-9 text-xs bg-background"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTRASEÑA DE ACCESO */}
          <div className="space-y-1">
            <label className="font-semibold text-foreground block">
              Contraseña de Acceso <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                required
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-9 h-9 text-xs bg-background"
              />
            </div>
          </div>

          {/* CONTROL DE SEGURIDAD RECAPTCHA INTERACTIVO */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Control de Registro y Verificación reCAPTCHA
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">reCAPTCHA v3 Safe</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground select-none">
                <input
                  type="checkbox"
                  checked={isRobotChecked}
                  onChange={(e) => setIsRobotChecked(e.target.checked)}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                />
                <span>No soy un robot</span>
              </label>
              <div className="flex items-center gap-1">
                <div className="h-5 w-5 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-[10px] font-bold text-blue-400">
                  C
                </div>
              </div>
            </div>

            {/* CÓDIGO DE DESAFÍO CAPTCHA */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 space-y-1">
                <label className="text-[11px] text-muted-foreground block">Ingresar Código de Seguridad:</label>
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="Código de 6 dígitos"
                  value={userCaptchaInput}
                  onChange={(e) => setUserCaptchaInput(e.target.value)}
                  className="h-8 font-mono text-center tracking-widest text-xs uppercase bg-background"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground block text-center">Código Rotatorio:</span>
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-mono font-extrabold text-sm tracking-widest select-none shadow-inner">
                  <span>{captchaCode}</span>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Generar nuevo código captcha"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {captchaError && (
              <p className="text-[11px] font-bold text-rose-400">⚠️ {captchaError}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 font-bold h-10 text-xs sm:text-sm gap-2"
          >
            {isLoading ? (
              <span>Registrando Investigador...</span>
            ) : (
              <>
                <span>Completar Registro ({investigatorType}) e Ir a Propuestas</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
