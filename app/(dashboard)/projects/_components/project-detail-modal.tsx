"use client";

import { useState, useEffect } from "react";
import { 
  X, BookOpen, UserCheck, ShieldCheck, FileText, Award, AlertTriangle, 
  CheckCircle2, Clock, Calendar, Building2, User, Download, ExternalLink, Scale,
  CheckSquare, FileSpreadsheet, Layers, Milestone, Globe, Phone, Mail, MapPin,
  Table as TableIcon, Info, Maximize2, UserPlus, GraduationCap, Briefcase, Plus,
  Search, Check, UserCheck2, ArrowRight, Edit3, Lock, Save, Trash2, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProjectItem, ExactProjectStatus } from "../page";
import { UNITEPC_SEDES_DATA, getUNITEPCFacultades, getUNITEPCCarreras } from "@/lib/unitepc-structure";
import { 
  getRegisteredInvestigators, 
  saveRegisteredInvestigator, 
  RegisteredInvestigator 
} from "@/lib/investigators-directory";
import { getActiveUserRole, canEditProjectFields } from "@/lib/permission-utils";

export interface TeamMember {
  id: string;
  name: string;
  ci: string;
  type: "INTERNO" | "EXTERNO";
  carrera: string;
  institution: string;
  occupation: string;
  cityCountry: string;
  phone: string;
  email: string;
  signatureStatus: string;
  isResponsable?: boolean;
}

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Ing. Ariel Denys Camara Arze",
    ci: "6522053",
    type: "INTERNO",
    carrera: "Ing. de Sistemas",
    institution: "UNITEPC",
    occupation: "Doc. Investigador",
    cityCountry: "Cochabamba, Bolivia",
    phone: "79326793",
    email: "arielcamara@unitepc.edu.bo",
    signatureStatus: "✓ Firmado",
    isResponsable: true,
  },
  {
    id: "2",
    name: "Ing. Harold Marco Antonio Rojas Torres",
    ci: "9465510",
    type: "INTERNO",
    carrera: "Ing. de Sistemas",
    institution: "UNITEPC",
    occupation: "Doc. Investigador",
    cityCountry: "Cochabamba, Bolivia",
    phone: "78311416",
    email: "haroldrojas@unitepc.edu.bo",
    signatureStatus: "✓ Firmado",
    isResponsable: false,
  },
  {
    id: "3",
    name: "Ing. Jose James Claure Ricaldi",
    ci: "5188558",
    type: "INTERNO",
    carrera: "Ing. de Sistemas",
    institution: "UNITEPC",
    occupation: "Dir. Carrera Sistemas",
    cityCountry: "Cochabamba, Bolivia",
    phone: "72242424",
    email: "jclaure_dis@unitepc.net",
    signatureStatus: "✓ Firmado y Sellado",
    isResponsable: false,
  },
];

const TEMATIC_AREAS = [
  "1) Innovación, Tecnología y Ciencia",
  "2) Desarrollo Agropecuario Integral",
  "3) Inclusión, Derechos Humanos, Cultura Ancestral",
  "4) Productividad y Emprendedurismo",
  "5) Educación y Salud",
  "6) Biodiversidad y Medio Ambiente",
];

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (newStatus: ExactProjectStatus) => void;
}

export function ProjectDetailModal({ project, isOpen, onClose, onUpdateStatus }: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"anexo1" | "anexo2" | "anexo3_p1" | "anexo3_p2">("anexo1");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_TEAM_MEMBERS);
  const [selectedAreaIndex, setSelectedAreaIndex] = useState<number>(0);
  
  // Permisos por Rol y Estado
  const [userRole, setUserRole] = useState<string>("admin");
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [isSavedToast, setIsSavedToast] = useState<boolean>(false);

  // CAMPOS EDITABLES DEL PROYECTO (TODOS LOS PUNTOS DEL ANEXO 3 Y ANEXO 1/2)
  const [editableTitle, setEditableTitle] = useState("");
  const [editableDescriptores, setEditableDescriptores] = useState("Gestión de Proyectos, Inteligencia Artificial Generativa, Comités Científico/Bioético, Flujo Editorial, Contabilidad, Trazabilidad, Modelos de Lenguaje (LLMs).");
  const [editableDuracionMeses, setEditableDuracionMeses] = useState("5");
  const [editableLineasInvestigacion, setEditableLineasInvestigacion] = useState("Inteligencia Artificial, Desarrollo de Software, Emprendimiento Tecnológico");
  const [editableCarreras, setEditableCarreras] = useState("Ingeniería de Sistemas");

  // Anexo 3 - Parte II (Puntos 1 al 8)
  const [editablePoint1, setEditablePoint1] = useState("");
  const [editableJustificacionAcademica, setEditableJustificacionAcademica] = useState("El sistema garantizará que todo proyecto financiado concluya de manera estandarizada en la elaboración de un artículo científico original, fortaleciendo la producción intelectual institucional.");
  const [editableJustificacionAdministrativa, setEditableJustificacionAdministrativa] = useState("Integrar un módulo financiero permitirá validar cotizaciones, aprobar o rechazar costos y calcular retenciones impositivas en tiempo real, transparentando la ejecución presupuestaria.");
  const [editablePoint3EstadoArte, setEditablePoint3EstadoArte] = useState("La gestión integral de la investigación universitaria (sistemas CRIS) ha experimentado una transformación fundamental al integrar dimensiones académicas, éticas y financieras en una única arquitectura tecnológica. Según Ballegooie y Riva (2020), la desconexión entre comités y ejecución presupuestaria genera graves ineficiencias. SIGPRI adopta estos paradigmas para asegurar trazabilidad absoluta.");
  const [editableObjGeneral, setEditableObjGeneral] = useState("");
  const [editableObjEspecificos, setEditableObjEspecificos] = useState("- Desarrollar módulos de evaluación para el Comité Científico y Bioético.\n- Implementar un módulo de seguimiento (Gantt/Cronograma) que supervise el avance.\n- Integrar un módulo contable para la validación de costos y retenciones impositivas.");
  const [editablePoint5Metodologia, setEditablePoint5Metodologia] = useState("El desarrollo del sistema SIGPRI se ejecutará en un lapso de 5 meses y estará fundamentado en la metodología ágil Scrum, lo cual permitirá entregas incrementales y una adaptación continua.");
  const [editablePoint6Resultados, setEditablePoint6Resultados] = useState("- Implementación de una plataforma web centralizada y 100% funcional.\n- Reducción drástica en los tiempos de tramitación eliminando expedientes físicos.\n- Consolidación de un repositorio investigativo estandarizado (artículo científico original IMRyD).\n- Trazabilidad financiera absoluta en tiempo real con reportes de retenciones.");
  const [editableImpactoAcademico, setEditableImpactoAcademico] = useState("Fomento directo e incremento medible en la producción de artículos científicos originales por parte de la universidad.");
  const [editableImpactoEconomico, setEditableImpactoEconomico] = useState("Instauración de una cultura de transparencia institucional robusta blindando ante desvíos de fondos o errores de cálculo tributario.");
  const [editablePoint8Referencias, setEditablePoint8Referencias] = useState("Ballegooie, M. van, & Riva, E. (2020). Research management systems and the academic workflow. Journal of Information Science, 46(2), 213-228.\nPérez-Martínez, A., Gómez, R., & Silva, C. (2021). Automatización de comités de ética y científicos en plataformas universitarias. Revista Iberoamericana de Tecnología Académica, 12(3), 45-59.\nSmith, J. R., & Jones, A. B. (2022). Financial traceability in academic R&D: Integrating accounting modules in CRIS systems. Academic Press.");

  // Estado para el Modal de Agregar Investigador
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"SELECT" | "REGISTER">("SELECT");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [directoryList, setDirectoryList] = useState<RegisteredInvestigator[]>([]);

  // Formulario para Registrar Nuevo Investigador
  const [newInvestigatorType, setNewInvestigatorType] = useState<"INTERNO" | "EXTERNO">("INTERNO");
  const [newForm, setNewForm] = useState({
    name: "",
    ci: "",
    email: "",
    phone: "",
    sede: "Cochabamba",
    facultad: "Facultad de Ciencias de la Salud",
    carrera: "Medicina",
    externalInstitution: "",
    occupation: "",
    cityCountry: "Cochabamba, Bolivia",
  });

  const sedesList = Object.keys(UNITEPC_SEDES_DATA);
  const [facultadesList, setFacultadesList] = useState<string[]>([]);
  const [carrerasList, setCarrerasList] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      const role = getActiveUserRole();
      setUserRole(role);
      const allowed = canEditProjectFields(role, project.status);
      setCanEdit(allowed);

      setEditableTitle(project.title);
      setEditablePoint1(project.abstractText);
      setEditableObjGeneral("Desarrollar e implementar el Sistema Integral de Gestión de Proyectos de Investigación (SIGPRI) para administrar la recepción, evaluación por comités, seguimiento de avances, consolidación científica y control contable de los proyectos institucionales.");
    }
  }, [project]);

  useEffect(() => {
    if (isAddModalOpen) {
      setDirectoryList(getRegisteredInvestigators());
    }
  }, [isAddModalOpen]);

  useEffect(() => {
    const facs = getUNITEPCFacultades(newForm.sede);
    setFacultadesList(facs);
    if (facs.length > 0) {
      const firstFac = facs[0];
      setNewForm((prev) => ({ ...prev, facultad: firstFac }));
      const cars = getUNITEPCCarreras(newForm.sede, firstFac);
      setCarrerasList(cars);
      if (cars.length > 0) {
        setNewForm((prev) => ({ ...prev, carrera: cars[0] }));
      }
    }
  }, [newForm.sede]);

  useEffect(() => {
    const cars = getUNITEPCCarreras(newForm.sede, newForm.facultad);
    setCarrerasList(cars);
    if (cars.length > 0) {
      setNewForm((prev) => ({ ...prev, carrera: cars[0] }));
    }
  }, [newForm.facultad]);

  if (!isOpen || !project) return null;

  const canManageStatus = userRole === "admin" || userRole === "jefe_investigador" || userRole === "comite";

  const handleSaveChanges = () => {
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2000);
  };

  // Asignar / Desasignar Responsable
  const handleToggleResponsable = (id: string) => {
    if (!canEdit) return;
    setTeamMembers(prev =>
      prev.map(m => m.id === id ? { ...m, isResponsable: !m.isResponsable } : m)
    );
  };

  // Eliminar Investigador del Equipo
  const handleRemoveTeamMember = (id: string) => {
    if (!canEdit) return;
    if (teamMembers.length <= 1) {
      alert("El proyecto debe contar con al menos un integrante de investigación.");
      return;
    }
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const filteredDirectory = directoryList.filter((inv) => {
    const query = searchTerm.toLowerCase();
    return (
      inv.name.toLowerCase().includes(query) ||
      inv.ci.toLowerCase().includes(query) ||
      inv.carrera.toLowerCase().includes(query) ||
      inv.institution.toLowerCase().includes(query) ||
      inv.email.toLowerCase().includes(query)
    );
  });

  const handleSelectExisting = (inv: RegisteredInvestigator) => {
    if (teamMembers.some((m) => m.ci === inv.ci)) {
      alert("Este investigador ya forma parte del equipo del proyecto.");
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inv.name,
      ci: inv.ci,
      type: inv.type,
      carrera: inv.type === "INTERNO" ? inv.carrera : "N/A",
      institution: inv.institution,
      occupation: inv.occupation || (inv.type === "INTERNO" ? "Docente Investigador" : "Investigador Externo"),
      cityCountry: inv.cityCountry,
      phone: inv.phone,
      email: inv.email,
      signatureStatus: "✓ Pendiente de Firma",
      isResponsable: false,
    };

    setTeamMembers([...teamMembers, newMember]);
    setIsAddModalOpen(false);
    setSearchTerm("");
  };

  const handleRegisterNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.ci) return;

    const created = saveRegisteredInvestigator({
      name: newForm.name,
      ci: newForm.ci,
      type: newInvestigatorType,
      sede: newInvestigatorType === "INTERNO" ? newForm.sede : "-",
      facultad: newInvestigatorType === "INTERNO" ? newForm.facultad : "-",
      carrera: newInvestigatorType === "INTERNO" ? newForm.carrera : "-",
      institution: newInvestigatorType === "INTERNO" ? "UNITEPC" : (newForm.externalInstitution || "Empresa Externa"),
      occupation: newForm.occupation || (newInvestigatorType === "INTERNO" ? "Docente Investigador" : "Investigador Externo"),
      email: newForm.email || `${newForm.ci}@unitepc.edu.bo`,
      phone: newForm.phone || "70000000",
      cityCountry: newForm.cityCountry,
    });

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: created.name,
      ci: created.ci,
      type: created.type,
      carrera: created.carrera,
      institution: created.institution,
      occupation: created.occupation,
      cityCountry: created.cityCountry,
      phone: created.phone,
      email: created.email,
      signatureStatus: "✓ Registrado (Clave = C.I.)",
      isResponsable: false,
    };

    setTeamMembers([...teamMembers, newMember]);
    setIsAddModalOpen(false);

    setNewForm({
      name: "",
      ci: "",
      email: "",
      phone: "",
      sede: "Cochabamba",
      facultad: "Facultad de Ciencias de la Salud",
      carrera: "Medicina",
      externalInstitution: "",
      occupation: "",
      cityCountry: "Cochabamba, Bolivia",
    });
    setModalMode("SELECT");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-3 overflow-y-auto">
      <div className="w-full max-w-[98vw] h-[96vh] bg-card text-card-foreground border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* HEADER DEL MODAL CON GESTIÓN DE ESTADO Y CONDICIONAL DE EDICIÓN */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-muted/40 border-b border-border shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold">
                {project.code}
              </Badge>

              {/* GESTIÓN DE ESTADO DENTRO DEL MODAL */}
              {canManageStatus && onUpdateStatus ? (
                <div className="flex items-center gap-1.5 bg-background border border-input p-1 rounded-md shadow-sm">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pl-1">Estado:</span>
                  <select
                    value={project.status}
                    onChange={(e) => onUpdateStatus(e.target.value as ExactProjectStatus)}
                    className="bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="En Propuesta">1. En Propuesta</option>
                    <option value="En Evaluación">2. En Evaluación</option>
                    <option value="En Observación (Rechazado con opción a corrección)">3. En Observación</option>
                    <option value="Aprobado en Ejecución">4. Aprobado en Ejecución</option>
                    <option value="Concluido">5. Concluido</option>
                    <option value="Publicado">6. Publicado</option>
                    <option value="Cancelado">7. Cancelado</option>
                  </select>
                </div>
              ) : (
                <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 font-bold">
                  {project.status}
                </Badge>
              )}

              {/* BADGE MODO EDICIÓN VS MODO LECTURA */}
              {canEdit ? (
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/40 text-emerald-500 font-bold flex items-center gap-1">
                  <Edit3 className="h-3 w-3" /> Modo Edición Habilitado
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-500/10 border-amber-500/40 text-amber-500 font-bold flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Modo Lectura (Protegido por Estado: {project.status})
                </Badge>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground line-clamp-1">
              {editableTitle}
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-primary" />
                Responsable(s): <strong>{teamMembers.filter(m => m.isResponsable).map(m => m.name).join(", ") || project.leadInvestigator}</strong>
              </span>
              <span>|</span>
              <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5 text-primary" /> {project.facultyArea}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            {canEdit && (
              <Button onClick={handleSaveChanges} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm">
                <Save className="h-4 w-4" />
                <span>Guardar Cambios</span>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* TOAST DE CAMBIOS GUARDADOS */}
        {isSavedToast && (
          <div className="bg-emerald-500 text-white text-xs font-bold p-2 text-center flex items-center justify-center gap-2 shrink-0 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" /> ¡Todos los cambios han sido guardados con éxito!
          </div>
        )}

        {/* NAVEGACIÓN PESTAÑAS */}
        <div className="flex border-b border-border bg-muted/20 px-4 overflow-x-auto no-scrollbar gap-1 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab("anexo1")}
            className={`px-5 py-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "anexo1"
                ? "border-primary text-primary bg-background shadow-sm"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4" /> Anexo 1: Declaración Jurada
          </button>

          <button
            onClick={() => setActiveTab("anexo2")}
            className={`px-5 py-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "anexo2"
                ? "border-primary text-primary bg-background shadow-sm"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Award className="h-4 w-4" /> Anexo 2: Inscripción y Áreas
          </button>

          <button
            onClick={() => setActiveTab("anexo3_p1")}
            className={`px-5 py-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "anexo3_p1"
                ? "border-primary text-primary bg-background shadow-sm"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Info className="h-4 w-4" /> Anexo 3 - Parte I: Información General
          </button>

          <button
            onClick={() => setActiveTab("anexo3_p2")}
            className={`px-5 py-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === "anexo3_p2"
                ? "border-primary text-primary bg-background shadow-sm"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-4 w-4" /> Anexo 3 - Parte II: Propuesta (Puntos 1-8)
          </button>
        </div>

        {/* CONTENIDO MAXIMIZADO */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background text-foreground">
          
          {/* PESTAÑA: ANEXO 1 - DECLARACIÓN JURADA */}
          {activeTab === "anexo1" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-primary pl-4 py-1">
                <div>
                  <h3 className="font-bold text-lg text-foreground uppercase tracking-wide">ANEXO 1: DECLARACIÓN JURADA DE ORIGINALIDAD</h3>
                  <p className="text-xs text-muted-foreground">Documento legal de adscripción institucional DICYT UNITEPC.</p>
                </div>
                
                {/* BOTÓN AGREGAR INVESTIGADOR DISPONIBLE SI CANEDIT ES TRUE */}
                {canEdit && (
                  <Button 
                    onClick={() => {
                      setModalMode("SELECT");
                      setIsAddModalOpen(true);
                    }}
                    className="bg-primary hover:bg-primary/90 font-bold text-xs sm:text-sm gap-2 shadow-md shrink-0"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>+ Agregar Investigador</span>
                  </Button>
                )}
              </div>

              <div className="p-5 rounded-lg bg-muted/30 border border-border text-xs sm:text-sm leading-relaxed space-y-3">
                <p className="font-semibold text-foreground">
                  Quien(es) suscribe(n) certifica(n) que la propuesta de investigación, desarrollo experimental y/o emprendimiento de base tecnológica denominado:
                </p>
                
                {canEdit ? (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-primary block uppercase">Título del Proyecto (Editable):</label>
                    <textarea
                      value={editableTitle}
                      onChange={(e) => setEditableTitle(e.target.value)}
                      className="w-full p-3 rounded-lg border border-primary/40 bg-background text-primary font-bold text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-primary"
                      rows={2}
                    />
                  </div>
                ) : (
                  <p className="font-bold text-primary text-base bg-primary/5 p-4 rounded border border-primary/20">
                    "{editableTitle}"
                  </p>
                )}

                <p className="text-muted-foreground">
                  Esta propuesta es un trabajo original y propio que se pretende ejecutar o implementar en la gestión <strong className="text-foreground">{project.managementYear}</strong>. No incurre en fraude, plagio o vicios de autoría, en cuyo caso se exime de toda responsabilidad a la <strong>Universidad Técnica Privada Cosmos (UNITEPC)</strong> y el(los) autor(es) se declara(n) como único(s) responsable(s).
                </p>
              </div>

              {/* TABLA DE EQUIPO DE INVESTIGACIÓN CON DESIGNACIÓN DE RESPONSABLES Y QUITAR */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-foreground">Equipo de Investigación Registrado</h4>
                  <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                    {teamMembers.length} Miembros Asignados
                  </Badge>
                </div>

                <div className="overflow-x-auto border border-border rounded-lg shadow-sm">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted/60 text-muted-foreground font-bold border-b border-border uppercase">
                        <th className="p-3 w-12 text-center">Nº</th>
                        <th className="p-3">Nombre Completo</th>
                        <th className="p-3">Rol / Responsable</th>
                        <th className="p-3">Tipo</th>
                        <th className="p-3">C.I.</th>
                        <th className="p-3">Carrera / Origen</th>
                        <th className="p-3">Institución</th>
                        <th className="p-3 text-center">Estado Firma</th>
                        {canEdit && <th className="p-3 text-center w-20">Acción</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {teamMembers.map((m, idx) => (
                        <tr key={m.id} className="hover:bg-muted/30">
                          <td className="p-3 text-center font-bold">{idx + 1}</td>
                          <td className="p-3 font-bold text-primary">{m.name}</td>
                          
                          {/* BOTÓN TOGGLE RESPONSABLE DE PROYECTO */}
                          <td className="p-3">
                            {canEdit ? (
                              <button
                                onClick={() => handleToggleResponsable(m.id)}
                                className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
                                  m.isResponsable
                                    ? "bg-amber-500/20 text-amber-500 border border-amber-500/50 shadow-sm"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                                }`}
                                title="Haga clic para designar o quitar el rol de Responsable de Proyecto"
                              >
                                <Star className={`h-3.5 w-3.5 ${m.isResponsable ? "fill-amber-500 text-amber-500" : ""}`} />
                                <span>{m.isResponsable ? "Responsable" : "Co-Investigador"}</span>
                              </button>
                            ) : (
                              m.isResponsable ? (
                                <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold text-[10px]">
                                  ⭐ Responsable
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">Co-Investigador</span>
                              )
                            )}
                          </td>

                          <td className="p-3">
                            {m.type === "INTERNO" ? (
                              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary font-bold text-[10px]">
                                Interno
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold text-[10px]">
                                Externo
                              </Badge>
                            )}
                          </td>
                          <td className="p-3 font-mono">{m.ci}</td>
                          <td className="p-3">{m.carrera}</td>
                          <td className="p-3 font-semibold">{m.institution}</td>
                          <td className="p-3 text-center text-emerald-500 font-bold">{m.signatureStatus}</td>

                          {/* BOTÓN QUITAR INVESTIGADOR */}
                          {canEdit && (
                            <td className="p-3 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveTeamMember(m.id)}
                                title="Quitar de la lista de investigadores"
                                className="h-7 w-7 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA: ANEXO 2 - FORMULARIO DE INSCRIPCIÓN Y SELECCIÓN DE ÁREA TEMÁTICA INTERACTIVA */}
          {activeTab === "anexo2" && (
            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-4 py-1">
                <h3 className="font-bold text-lg text-foreground uppercase tracking-wide">ANEXO 2: FORMULARIO DE INSCRIPCIÓN Y ÁREAS TEMÁTICAS</h3>
                <p className="text-xs text-muted-foreground">Muestra la lista de participantes asignados y permite seleccionar el Área Temática Institucional.</p>
              </div>

              {/* DATOS DE PARTICIPANTES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-foreground">Participantes Asignados a la Propuesta</h4>
                  <span className="text-xs text-muted-foreground italic">
                    (Sincronizado automáticamente desde Anexo 1)
                  </span>
                </div>
                <div className="overflow-x-auto border border-border rounded-lg shadow-sm">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="bg-muted/60 text-muted-foreground font-bold border-b border-border uppercase">
                        <th className="p-3 w-12 text-center">Nº</th>
                        <th className="p-3">Nombre Completo</th>
                        <th className="p-3">Rol</th>
                        <th className="p-3">C.I.</th>
                        <th className="p-3">Ciudad y País</th>
                        <th className="p-3">Teléfono</th>
                        <th className="p-3">Correo Electrónico</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {teamMembers.map((m, idx) => (
                        <tr key={m.id} className="hover:bg-muted/30">
                          <td className="p-3 text-center font-bold">{idx + 1}</td>
                          <td className="p-3 font-bold text-foreground">{m.name}</td>
                          <td className="p-3">
                            {m.isResponsable ? (
                              <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold text-[10px]">
                                ⭐ Responsable
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">Co-Investigador</span>
                            )}
                          </td>
                          <td className="p-3 font-mono">{m.ci}</td>
                          <td className="p-3">{m.cityCountry}</td>
                          <td className="p-3 font-mono">{m.phone}</td>
                          <td className="p-3 font-mono text-primary">{m.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CLASIFICACIÓN INTERACTIVA POR ÁREA TEMÁTICA */}
              <div className="space-y-3">
                <h4 className="font-bold text-base text-foreground">Área Temática Institucional (Marcar sólo una) *</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {TEMATIC_AREAS.map((areaLabel, areaIdx) => {
                    const isSelected = selectedAreaIndex === areaIdx;
                    return (
                      <button
                        key={areaIdx}
                        type="button"
                        disabled={!canEdit}
                        onClick={() => canEdit && setSelectedAreaIndex(areaIdx)}
                        className={`p-4 rounded-lg border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 font-bold text-primary shadow-sm"
                            : "border-border bg-muted/20 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        <span>{areaLabel}</span>
                        <span className="text-base font-mono font-extrabold ml-2">
                          {isSelected ? "[ X ]" : "[   ]"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA: ANEXO 3 - PARTE I (TOTALMENTE EDITABLE) */}
          {activeTab === "anexo3_p1" && (
            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-4 py-1">
                <h3 className="font-bold text-lg text-foreground uppercase tracking-wide">ANEXO 3 - PARTE I: INFORMACIÓN GENERAL DEL PROYECTO</h3>
                <p className="text-xs text-muted-foreground">Ficha institucional oficial DICYT UNITEPC (Campos Editables).</p>
              </div>

              <div className="overflow-x-auto border border-border rounded-lg shadow-md">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/70 text-muted-foreground font-bold border-b border-border uppercase">
                      <th colSpan={2} className="p-4 text-base tracking-wider text-foreground">
                        PARTE I: INFORMACIÓN GENERAL DEL PROYECTO
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {/* TÍTULO DEL PROYECTO */}
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-bold text-foreground w-1/4 italic border-r border-border bg-muted/20 text-sm">
                        Título del proyecto
                      </td>
                      <td className="p-4">
                        {canEdit ? (
                          <textarea
                            value={editableTitle}
                            onChange={(e) => setEditableTitle(e.target.value)}
                            className="w-full p-2.5 rounded border border-input bg-background font-bold text-primary text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            rows={2}
                          />
                        ) : (
                          <span className="font-bold text-primary text-base">{editableTitle}</span>
                        )}
                      </td>
                    </tr>

                    {/* DESCRIPTORES / PALABRAS CLAVE */}
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-bold text-foreground w-1/4 italic border-r border-border bg-muted/20 text-sm">
                        Descriptores / palabras claves
                      </td>
                      <td className="p-4">
                        {canEdit ? (
                          <textarea
                            value={editableDescriptores}
                            onChange={(e) => setEditableDescriptores(e.target.value)}
                            className="w-full p-2.5 rounded border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            rows={2}
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm">{editableDescriptores}</span>
                        )}
                      </td>
                    </tr>

                    {/* DURACIÓN DEL PROYECTO */}
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-bold text-foreground w-1/4 italic border-r border-border bg-muted/20 text-sm">
                        Duración del proyecto (en meses)
                      </td>
                      <td className="p-4 font-mono font-bold text-foreground text-sm">
                        {canEdit ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={editableDuracionMeses}
                              onChange={(e) => setEditableDuracionMeses(e.target.value)}
                              className="w-24 h-8 text-xs bg-background font-mono font-bold"
                            />
                            <span className="text-xs text-muted-foreground">meses (22 Semanas)</span>
                          </div>
                        ) : (
                          <span>{editableDuracionMeses} meses (22 Semanas)</span>
                        )}
                      </td>
                    </tr>

                    {/* PROPONENTES INTEGRANTES */}
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-bold text-foreground w-1/4 italic border-r border-border bg-muted/20 text-sm">
                        Proponentes Integrantes
                      </td>
                      <td className="p-4 text-foreground font-semibold text-sm">
                        {teamMembers.map(m => m.name).join(", ")}
                      </td>
                    </tr>

                    {/* LÍNEAS DE INVESTIGACIÓN */}
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-bold text-foreground w-1/4 italic border-r border-border bg-muted/20 text-sm">
                        Línea(s) de Investigación
                      </td>
                      <td className="p-4">
                        {canEdit ? (
                          <Input
                            type="text"
                            value={editableLineasInvestigacion}
                            onChange={(e) => setEditableLineasInvestigacion(e.target.value)}
                            className="h-8 text-xs bg-background font-medium"
                          />
                        ) : (
                          <span className="text-foreground font-semibold text-sm">{editableLineasInvestigacion}</span>
                        )}
                      </td>
                    </tr>

                    {/* CARRERA(S) */}
                    <tr className="hover:bg-muted/30">
                      <td className="p-4 font-bold text-foreground w-1/4 italic border-r border-border bg-muted/20 text-sm">
                        Carrera(s)
                      </td>
                      <td className="p-4">
                        {canEdit ? (
                          <Input
                            type="text"
                            value={editableCarreras}
                            onChange={(e) => setEditableCarreras(e.target.value)}
                            className="h-8 text-xs bg-background font-bold text-primary"
                          />
                        ) : (
                          <span className="text-foreground font-bold text-sm">{editableCarreras}</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PESTAÑA: ANEXO 3 - PARTE II (PUNTOS 1 AL 8 TOTALMENTE EDITABLES) */}
          {activeTab === "anexo3_p2" && (
            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-4 py-1">
                <h3 className="font-bold text-lg text-foreground uppercase tracking-wide">ANEXO 3 - PARTE II: DESARROLLO DE LA PROPUESTA (PUNTOS 1 AL 8)</h3>
                <p className="text-xs text-muted-foreground">Estructura científica oficial. Todos los campos son editables cuando la propuesta está abierta a edición.</p>
              </div>

              <div className="space-y-6 text-xs sm:text-sm">
                
                {/* 1. PLANTEAMIENTO DEL PROBLEMA Y OBJETO DE ESTUDIO */}
                <div className="space-y-2">
                  <h4 className="font-bold text-primary text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-extrabold">1</span>
                    Planteamiento del Problema y Objeto de Estudio
                  </h4>
                  {canEdit ? (
                    <textarea
                      value={editablePoint1}
                      onChange={(e) => setEditablePoint1(e.target.value)}
                      className="w-full p-4 rounded-lg border border-primary/40 bg-background text-foreground leading-relaxed text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      rows={4}
                    />
                  ) : (
                    <p className="p-4 rounded-lg bg-muted/30 border border-border text-muted-foreground leading-relaxed text-sm">
                      {editablePoint1}
                    </p>
                  )}
                </div>

                {/* 2. JUSTIFICACIÓN (ACADÉMICA Y ADMINISTRATIVA) */}
                <div className="space-y-2">
                  <h4 className="font-bold text-primary text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-extrabold">2</span>
                    Justificación
                  </h4>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-4 text-sm">
                    <div>
                      <span className="font-bold text-foreground block">Justificación Académica:</span>
                      {canEdit ? (
                        <textarea
                          value={editableJustificacionAcademica}
                          onChange={(e) => setEditableJustificacionAcademica(e.target.value)}
                          className="w-full p-3 rounded border border-input bg-background text-foreground text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          rows={3}
                        />
                      ) : (
                        <p className="text-muted-foreground mt-1">{editableJustificacionAcademica}</p>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-foreground block">Justificación Administrativa / Contable:</span>
                      {canEdit ? (
                        <textarea
                          value={editableJustificacionAdministrativa}
                          onChange={(e) => setEditableJustificacionAdministrativa(e.target.value)}
                          className="w-full p-3 rounded border border-input bg-background text-foreground text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          rows={3}
                        />
                      ) : (
                        <p className="text-muted-foreground mt-1">{editableJustificacionAdministrativa}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. ESTADO DEL ARTE */}
                <div className="space-y-2">
                  <h4 className="font-bold text-primary text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-extrabold">3</span>
                    Estado del Arte
                  </h4>
                  {canEdit ? (
                    <textarea
                      value={editablePoint3EstadoArte}
                      onChange={(e) => setEditablePoint3EstadoArte(e.target.value)}
                      className="w-full p-4 rounded-lg border border-primary/40 bg-background text-foreground leading-relaxed text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      rows={4}
                    />
                  ) : (
                    <p className="p-4 rounded-lg bg-muted/30 border border-border text-muted-foreground leading-relaxed text-sm">
                      {editablePoint3EstadoArte}
                    </p>
                  )}
                </div>

                {/* 4. OBJETIVOS */}
                <div className="space-y-2">
                  <h4 className="font-bold text-primary text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-extrabold">4</span>
                    Objetivos
                  </h4>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-4 text-sm">
                    <div>
                      <span className="font-bold text-foreground block">Objetivo General:</span>
                      {canEdit ? (
                        <textarea
                          value={editableObjGeneral}
                          onChange={(e) => setEditableObjGeneral(e.target.value)}
                          className="w-full p-3 rounded border border-input bg-background text-foreground text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          rows={3}
                        />
                      ) : (
                        <p className="text-muted-foreground mt-1">{editableObjGeneral}</p>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-foreground block">Objetivos Específicos:</span>
                      {canEdit ? (
                        <textarea
                          value={editableObjEspecificos}
                          onChange={(e) => setEditableObjEspecificos(e.target.value)}
                          className="w-full p-3 rounded border border-input bg-background text-foreground text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                          rows={4}
                        />
                      ) : (
                        <pre className="text-muted-foreground mt-1 font-sans whitespace-pre-wrap">{editableObjEspecificos}</pre>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. METODOLOGÍA */}
                <div className="space-y-2">
                  <h4 className="font-bold text-primary text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-extrabold">5</span>
                    Metodología
                  </h4>
                  {canEdit ? (
                    <textarea
                      value={editablePoint5Metodologia}
                      onChange={(e) => setEditablePoint5Metodologia(e.target.value)}
                      className="w-full p-4 rounded-lg border border-primary/40 bg-background text-foreground leading-relaxed text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      rows={4}
                    />
                  ) : (
                    <p className="p-4 rounded-lg bg-muted/30 border border-border text-muted-foreground leading-relaxed text-sm">
                      {editablePoint5Metodologia}
                    </p>
                  )}
                </div>

                {/* 6. RESULTADOS QUE SE ESPERAN */}
                <div className="space-y-2">
                  <h4 className="font-bold text-primary text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-extrabold">6</span>
                    Resultados que se Esperan
                  </h4>
                  {canEdit ? (
                    <textarea
                      value={editablePoint6Resultados}
                      onChange={(e) => setEditablePoint6Resultados(e.target.value)}
                      className="w-full p-4 rounded-lg border border-primary/40 bg-background text-foreground leading-relaxed text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                      rows={4}
                    />
                  ) : (
                    <pre className="p-4 rounded-lg bg-muted/30 border border-border text-muted-foreground font-sans whitespace-pre-wrap leading-relaxed text-sm">
                      {editablePoint6Resultados}
                    </pre>
                  )}
                </div>

                {/* 7. IMPACTOS QUE SE PRETENDEN LOGRAR */}
                <div className="space-y-2">
                  <h4 className="font-bold text-primary text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-extrabold">7</span>
                    Impactos que se Pretenden Lograr
                  </h4>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-4 text-sm">
                    <div>
                      <span className="font-bold text-foreground block">Impacto Académico y Científico:</span>
                      {canEdit ? (
                        <textarea
                          value={editableImpactoAcademico}
                          onChange={(e) => setEditableImpactoAcademico(e.target.value)}
                          className="w-full p-3 rounded border border-input bg-background text-foreground text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          rows={2}
                        />
                      ) : (
                        <p className="text-muted-foreground mt-1">{editableImpactoAcademico}</p>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-foreground block">Impacto Económico y Financiero:</span>
                      {canEdit ? (
                        <textarea
                          value={editableImpactoEconomico}
                          onChange={(e) => setEditableImpactoEconomico(e.target.value)}
                          className="w-full p-3 rounded border border-input bg-background text-foreground text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          rows={2}
                        />
                      ) : (
                        <p className="text-muted-foreground mt-1">{editableImpactoEconomico}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 8. REFERENCIAS BIBLIOGRÁFICAS */}
                <div className="space-y-2">
                  <h4 className="font-bold text-primary text-base flex items-center gap-2">
                    <span className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-xs font-mono font-extrabold">8</span>
                    Referencias Bibliográficas (Formato APA v7)
                  </h4>
                  {canEdit ? (
                    <textarea
                      value={editablePoint8Referencias}
                      onChange={(e) => setEditablePoint8Referencias(e.target.value)}
                      className="w-full p-4 rounded-lg border border-primary/40 bg-background text-foreground leading-relaxed text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      rows={4}
                    />
                  ) : (
                    <pre className="p-4 rounded-lg bg-muted/30 border border-border text-muted-foreground font-mono text-xs whitespace-pre-wrap leading-relaxed">
                      {editablePoint8Referencias}
                    </pre>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

        {/* FOOTER DEL MODAL */}
        <div className="flex items-center justify-between p-4 bg-muted/40 border-t border-border shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Formato Propuesta Oficial UNITEPC - DICYT
          </span>
          <div className="flex items-center gap-2 ml-auto">
            {canEdit && (
              <Button onClick={handleSaveChanges} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5">
                <Save className="h-4 w-4" /> Guardar Cambios
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose} className="font-bold">
              Cerrar Ficha
            </Button>
          </div>
        </div>

      </div>

      {/* SUB-MODAL: SELECCIÓN Y REGISTRO DE INVESTIGADORES */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  {modalMode === "SELECT" ? "Seleccionar Investigador para el Proyecto" : "Registrar Nuevo Investigador"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {modalMode === "SELECT"
                    ? "Seleccione un investigador previamente registrado en el directorio o registre uno nuevo."
                    : "Complete el registro institucional (Clave por defecto = C.I.)."}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {modalMode === "SELECT" ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar por Nombre, C.I., Carrera o Empresa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9 text-xs bg-background"
                    />
                  </div>
                  <Button
                    onClick={() => setModalMode("REGISTER")}
                    className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 font-bold text-xs gap-1.5 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    <span>+ Registrar Nuevo</span>
                  </Button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 border border-border rounded-lg p-2 bg-muted/20">
                  {filteredDirectory.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground space-y-2">
                      <p>No se encontraron investigadores en el directorio.</p>
                      <Button
                        size="sm"
                        onClick={() => setModalMode("REGISTER")}
                        className="bg-primary hover:bg-primary/90 font-bold text-xs"
                      >
                        Registrar Nuevo Investigador
                      </Button>
                    </div>
                  ) : (
                    filteredDirectory.map((inv) => {
                      const isAlreadyInTeam = teamMembers.some((m) => m.ci === inv.ci);
                      return (
                        <div
                          key={inv.id}
                          className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                            isAlreadyInTeam
                              ? "bg-muted/50 border-border/60 opacity-60"
                              : "bg-card border-border hover:border-primary/40 hover:bg-muted/40"
                          }`}
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-foreground truncate">{inv.name}</span>
                              <Badge variant="outline" className="font-mono text-[10px]">C.I. {inv.ci}</Badge>
                              {inv.type === "INTERNO" ? (
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-bold text-[9px]">
                                  {inv.sede}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 font-bold text-[9px]">
                                  Externo
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {inv.type === "INTERNO" ? `${inv.carrera} | ${inv.institution}` : `${inv.institution} (${inv.occupation})`}
                            </p>
                          </div>

                          <Button
                            size="sm"
                            disabled={isAlreadyInTeam}
                            onClick={() => handleSelectExisting(inv)}
                            className="text-xs font-bold shrink-0 gap-1"
                            variant={isAlreadyInTeam ? "outline" : "default"}
                          >
                            {isAlreadyInTeam ? (
                              <span>Ya Asignado</span>
                            ) : (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Asignar</span>
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground">
                  <span>¿El investigador no aparece en la lista?</span>
                  <button
                    onClick={() => setModalMode("REGISTER")}
                    className="text-primary font-bold hover:underline flex items-center gap-1"
                  >
                    Registrar Nuevo Investigador <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterNewSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-foreground block text-xs">
                    Tipo de Investigador *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewInvestigatorType("INTERNO")}
                      className={`p-2.5 rounded-lg border text-center font-bold text-xs flex items-center justify-center gap-1.5 ${
                        newInvestigatorType === "INTERNO"
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      <GraduationCap className="h-4 w-4" /> Interno UNITEPC
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewInvestigatorType("EXTERNO")}
                      className={`p-2.5 rounded-lg border text-center font-bold text-xs flex items-center justify-center gap-1.5 ${
                        newInvestigatorType === "EXTERNO"
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      <Globe className="h-4 w-4" /> Externo / Empresa
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground block">Nombre Completo *</label>
                    <Input
                      required
                      type="text"
                      placeholder="Ej. Dra. Vania Morales"
                      value={newForm.name}
                      onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                      className="h-8 text-xs bg-background"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground block">Carnet de Identidad (C.I.) *</label>
                    <Input
                      required
                      type="text"
                      placeholder="Ej. 7744112 CBBA"
                      value={newForm.ci}
                      onChange={(e) => setNewForm({ ...newForm, ci: e.target.value })}
                      className="h-8 text-xs bg-background font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground block">Correo Electrónico *</label>
                    <Input
                      required
                      type="email"
                      placeholder="correo@unitepc.edu.bo"
                      value={newForm.email}
                      onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                      className="h-8 text-xs bg-background font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground block">Teléfono / WhatsApp</label>
                    <Input
                      type="text"
                      placeholder="79326793"
                      value={newForm.phone}
                      onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                      className="h-8 text-xs bg-background font-mono"
                    />
                  </div>
                </div>

                {newInvestigatorType === "INTERNO" ? (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-2">
                    <span className="font-bold text-foreground text-xs block">Estructura Académica UNITEPC</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground block">Sede *</label>
                        <select
                          value={newForm.sede}
                          onChange={(e) => setNewForm({ ...newForm, sede: e.target.value })}
                          className="w-full h-8 rounded border border-input bg-background px-2 text-xs font-semibold"
                        >
                          {sedesList.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground block">Facultad *</label>
                        <select
                          value={newForm.facultad}
                          onChange={(e) => setNewForm({ ...newForm, facultad: e.target.value })}
                          className="w-full h-8 rounded border border-input bg-background px-2 text-xs truncate"
                        >
                          {facultadesList.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground block">Carrera *</label>
                        <select
                          value={newForm.carrera}
                          onChange={(e) => setNewForm({ ...newForm, carrera: e.target.value })}
                          className="w-full h-8 rounded border border-input bg-background px-2 text-xs font-bold text-primary"
                        >
                          {carrerasList.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-2">
                    <span className="font-bold text-foreground text-xs block">Datos de Empresa / Institución Externa</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground block">Empresa / Institución de Origen *</label>
                        <Input
                          required
                          type="text"
                          placeholder="Hospital Viedma / YPFB"
                          value={newForm.externalInstitution}
                          onChange={(e) => setNewForm({ ...newForm, externalInstitution: e.target.value })}
                          className="h-8 text-xs bg-background"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground block">Cargo / Profesión *</label>
                        <Input
                          required
                          type="text"
                          placeholder="Consultor / Especialista"
                          value={newForm.occupation}
                          onChange={(e) => setNewForm({ ...newForm, occupation: e.target.value })}
                          className="h-8 text-xs bg-background"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-2.5 rounded bg-primary/10 border border-primary/30 text-primary text-[11px] font-semibold">
                  🔑 <strong>Credenciales por defecto:</strong> La contraseña de acceso inicial será su número de **C.I.** (`{newForm.ci || "C.I."}`). Se le solicitará cambio obligatorio al ingresar.
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setModalMode("SELECT")}>
                    ← Volver a Buscar
                  </Button>
                  <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 font-bold">
                    Completar Registro y Asignar
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
