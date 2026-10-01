"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Megaphone, Plus, Search, Filter, Calendar, Clock, BookOpen, User, 
  Building2, GraduationCap, FilePlus, Sparkles, CheckCircle2, AlertCircle, 
  X, Check, ExternalLink, Globe, Layers, FileText, Edit3, LayoutGrid, Table as TableIcon,
  Trash2, Image, FileUp, UploadCloud, Eye, Download, FileCode
} from "lucide-react";
import { getStoredMasterProjects } from "@/lib/sigpri-store";
import { ProjectItem } from "../projects/page";
import { UNITEPC_SEDES_DATA, getUNITEPCFacultades, getUNITEPCCarreras } from "@/lib/unitepc-structure";
import { ElegantToast, ElegantConfirmModal, ToastState } from "@/components/ui/elegant-toast";

export interface ResearchCall {
  id: string;
  code: string;
  title: string;
  gestion: string; // ej. "1-2026", "2-2026", "1-2027"
  scopeType: "INSTITUCIONAL" | "FACULTAD" | "CARRERA";
  targetFacultad?: string;
  targetCarrera?: string;
  startDate: string;
  endDate: string;
  status: "Abierta para Postulación" | "En Evaluación por Comité" | "Cerrada" | "Próxima";
  description: string;
  artBannerUrl?: string;
  artBannerType?: "image" | "pdf";
  artBannerName?: string;
  createdAt: string;
}

const GESTIONES_DISPONIBLES = ["1-2026", "2-2026", "1-2027", "2-2027"];

const INITIAL_RESEARCH_CALLS: ResearchCall[] = [
  {
    id: "call-1",
    code: "CONV-1-2026-01",
    title: "Convocatoria Institucional de Investigación Científica e Innovación Tecnológica UNITEPC",
    gestion: "1-2026",
    scopeType: "INSTITUCIONAL",
    startDate: "2026-01-15",
    endDate: "2026-08-31",
    status: "Abierta para Postulación",
    description: "Convocatoria abierta a todas las facultades, carreras y sedes nacionales para la presentación de perfiles y propuestas de investigación aplicada.",
    artBannerUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    artBannerType: "image",
    artBannerName: "Afiche_Institucional_UNITEPC_2026.jpg",
    createdAt: "2026-01-10",
  },
  {
    id: "call-2",
    code: "CONV-1-2026-02",
    title: "Convocatoria de Investigación en Biomedicina y Salud Pública (Facultad de Medicina)",
    gestion: "1-2026",
    scopeType: "FACULTAD",
    targetFacultad: "Facultad de Ciencias de la Salud",
    startDate: "2026-02-01",
    endDate: "2026-09-15",
    status: "Abierta para Postulación",
    description: "Convocatoria específica para proyectos orientados al estudio de enfermedades prevalentes, epidemiología y biotecnología médica.",
    artBannerUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    artBannerType: "image",
    artBannerName: "Afiche_Salud_Biomedicina_2026.jpg",
    createdAt: "2026-01-20",
  },
  {
    id: "call-3",
    code: "CONV-1-2026-03",
    title: "Fondo de Investigación para la Carrera de Ingeniería de Sistemas e Inteligencia Artificial",
    gestion: "1-2026",
    scopeType: "CARRERA",
    targetFacultad: "Facultad de Ciencias y Tecnología",
    targetCarrera: "Ingeniería de Sistemas",
    startDate: "2026-03-01",
    endDate: "2026-10-31",
    status: "Abierta para Postulación",
    description: "Postulación para proyectos focalizados en desarrollo de software, modelado de datos y soluciones IA para el ámbito académico e industrial.",
    artBannerUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    artBannerType: "image",
    artBannerName: "Afiche_Sistemas_IA_2026.jpg",
    createdAt: "2026-02-01",
  },
  {
    id: "call-4",
    code: "CONV-2-2025-04",
    title: "Convocatoria Extraordinaria de Proyectos Multidisciplinarios 2025",
    gestion: "2-2025",
    scopeType: "INSTITUCIONAL",
    startDate: "2025-07-01",
    endDate: "2025-11-30",
    status: "Cerrada",
    description: "Convocatoria concluida correspondiente a la gestión 2-2025 para la consolidación de grupos de investigación.",
    createdAt: "2025-06-15",
  },
];

const LOCAL_STORAGE_CALLS_KEY = "sigpri_research_calls_data_v2";

export default function CallsPage() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [calls, setCalls] = useState<ResearchCall[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [gestionFilter, setGestionFilter] = useState<string>("all");
  const [scopeFilter, setScopeFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  // ALERTAS ELEGANTES Y MODAL DE CONFIRMACIÓN
  const [toast, setToast] = useState<ToastState | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // MODAL: CREAR NUEVA CONVOCATORIA
  const [isNewCallOpen, setIsNewCallOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCode, setNewCode] = useState("");
  const [newGestion, setNewGestion] = useState("1-2026");
  const [newScopeType, setNewScopeType] = useState<"INSTITUCIONAL" | "FACULTAD" | "CARRERA">("INSTITUCIONAL");
  const [newFacultad, setNewFacultad] = useState("Facultad de Ciencias de la Salud");
  const [newCarrera, setNewCarrera] = useState("Medicina");
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().substring(0, 10));
  const [newEndDate, setNewEndDate] = useState("2026-11-30");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState<ResearchCall["status"]>("Abierta para Postulación");
  const [newArtBannerUrl, setNewArtBannerUrl] = useState<string>("");
  const [newArtBannerType, setNewArtBannerType] = useState<"image" | "pdf">("image");
  const [newArtBannerName, setNewArtBannerName] = useState<string>("");

  // MODAL: EDITAR CONVOCATORIA Y VISTA AMPLIADA DE ARTE
  const [editingCall, setEditingCall] = useState<ResearchCall | null>(null);
  const [viewArtCall, setViewArtCall] = useState<ResearchCall | null>(null);

  // HELPER PARA CARGAR AFICHE / ARTE GRÁFICO (BASE64)
  const handleFileUpload = (file: File, isEditMode: boolean = false) => {
    if (!file) return;
    const reader = new FileReader();
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (isEditMode && editingCall) {
        setEditingCall({
          ...editingCall,
          artBannerUrl: result,
          artBannerType: isPdf ? "pdf" : "image",
          artBannerName: file.name,
        });
      } else {
        setNewArtBannerUrl(result);
        setNewArtBannerType(isPdf ? "pdf" : "image");
        setNewArtBannerName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  // LISTAS DINÁMICAS PARA SEDES Y FACULTADES
  const sedesList = Object.keys(UNITEPC_SEDES_DATA);
  const [facultadesList, setFacultadesList] = useState<string[]>([]);
  const [carrerasList, setCarrerasList] = useState<string[]>([]);

  useEffect(() => {
    const facs = getUNITEPCFacultades("Cochabamba");
    setFacultadesList(facs);
    if (facs.length > 0) {
      setNewFacultad(facs[0]);
      const cars = getUNITEPCCarreras("Cochabamba", facs[0]);
      setCarrerasList(cars);
      if (cars.length > 0) setNewCarrera(cars[0]);
    }
  }, []);

  useEffect(() => {
    const cars = getUNITEPCCarreras("Cochabamba", newFacultad);
    setCarrerasList(cars);
    if (cars.length > 0) setNewCarrera(cars[0]);
  }, [newFacultad]);

  // CARGA DE DATOS DE CONVOCATORIAS Y PROYECTOS
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCalls = localStorage.getItem(LOCAL_STORAGE_CALLS_KEY);
      if (storedCalls) {
        try {
          const parsed = JSON.parse(storedCalls);
          setCalls(Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_RESEARCH_CALLS);
        } catch (e) {
          setCalls(INITIAL_RESEARCH_CALLS);
        }
      } else {
        setCalls(INITIAL_RESEARCH_CALLS);
        localStorage.setItem(LOCAL_STORAGE_CALLS_KEY, JSON.stringify(INITIAL_RESEARCH_CALLS));
      }

      setProjects(getStoredMasterProjects());
    }
  }, []);

  const saveCallsData = (updated: ResearchCall[]) => {
    setCalls(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_CALLS_KEY, JSON.stringify(updated));
    }
  };

  // CREAR NUEVA CONVOCATORIA
  const handleCreateCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setToast({ message: "Por favor ingrese el título de la convocatoria.", type: "error" });
      return;
    }

    const autoCode = newCode.trim() || `CONV-${newGestion}-${String(calls.length + 1).padStart(2, "0")}`;
    const newCallItem: ResearchCall = {
      id: `call-${Date.now()}`,
      code: autoCode,
      title: newTitle,
      gestion: newGestion,
      scopeType: newScopeType,
      targetFacultad: newScopeType !== "INSTITUCIONAL" ? newFacultad : undefined,
      targetCarrera: newScopeType === "CARRERA" ? newCarrera : undefined,
      startDate: newStartDate,
      endDate: newEndDate,
      status: newStatus,
      description: newDescription || "Convocatoria oficial para proyectos de investigación.",
      artBannerUrl: newArtBannerUrl || undefined,
      artBannerType: newArtBannerType,
      artBannerName: newArtBannerName || undefined,
      createdAt: new Date().toISOString().substring(0, 10),
    };

    saveCallsData([...calls, newCallItem]);
    setNewTitle("");
    setNewCode("");
    setNewDescription("");
    setNewArtBannerUrl("");
    setNewArtBannerName("");
    setIsNewCallOpen(false);
    setToast({ message: `Convocatoria ${autoCode} aperturada exitosamente.`, type: "success" });
  };

  // GUARDAR EDICIÓN DE CONVOCATORIA
  const handleUpdateCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCall || !editingCall.title.trim()) {
      setToast({ message: "El título de la convocatoria es obligatorio.", type: "error" });
      return;
    }

    const updatedList = calls.map((c) => (c.id === editingCall.id ? editingCall : c));
    saveCallsData(updatedList);
    setEditingCall(null);
    setToast({ message: `Convocatoria ${editingCall.code} actualizada correctamente.`, type: "success" });
  };

  // ELIMINAR CONVOCATORIA
  const executeDeleteCall = (id: string) => {
    const updatedList = calls.filter((c) => c.id !== id);
    saveCallsData(updatedList);
    setDeleteConfirmId(null);
    setToast({ message: "Convocatoria eliminada del sistema.", type: "info" });
  };

  // OBTENER CONTEO DE PROYECTOS VINCULADOS A CADA CONVOCATORIA
  const getCallProposalsCount = (callCode: string) => {
    return projects.filter((p) => p.callCode === callCode).length;
  };

  // FILTRADO DE CONVOCATORIAS
  const filteredCalls = calls.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesGestion = gestionFilter === "all" || c.gestion === gestionFilter;
    const matchesScope = scopeFilter === "all" || c.scopeType === scopeFilter;
    return matchesSearch && matchesStatus && matchesGestion && matchesScope;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background pb-10">
      <Header
        title="Gestión Administrativa de Convocatorias"
        description="Publicación, administración de vigencia y parametrización de convocatorias institucionales semestrales, por facultad o carrera."
      />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 w-full">
        {/* HEADER BANNER Y BOTÓN NUEVA CONVOCATORIA */}
        <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold">
                  Convocatorias UNITEPC
                </Badge>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-primary" />
                Administración de Convocatorias de Investigación
              </CardTitle>
              <CardDescription>
                Panel administrativo para aperturar, editar y gestionar la disponibilidad de convocatorias institucionales por gestión y área académica.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              {/* TOGGLE VISTA TARJETAS Y TABLA */}
              <div className="flex items-center bg-muted/60 border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="h-7 px-2 text-xs gap-1 font-bold"
                  title="Vista en Tarjetas"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tarjetas</span>
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-7 px-2 text-xs gap-1 font-bold"
                  title="Vista en Tabla"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tabla</span>
                </Button>
              </div>

              <Button
                onClick={() => setIsNewCallOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nueva Convocatoria</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* BÚSQUEDA Y FILTROS */}
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar convocatoria por nombre o código..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 text-xs font-medium"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="all">Todos los Estados</option>
                <option value="Abierta para Postulación">🟢 Abierta para Postulación</option>
                <option value="En Evaluación por Comité">🟣 En Evaluación por Comité</option>
                <option value="Cerrada">🔴 Cerrada</option>
                <option value="Próxima">🟡 Próxima</option>
              </select>
            </div>

            <div>
              <select
                value={gestionFilter}
                onChange={(e) => setGestionFilter(e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="all">Todas las Gestiones</option>
                {GESTIONES_DISPONIBLES.map((g) => (
                  <option key={g} value={g}>Gestión {g}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
                className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="all">Todas las Coberturas</option>
                <option value="INSTITUCIONAL">🏢 Institucional (Nacional)</option>
                <option value="FACULTAD">🏥 Por Facultad</option>
                <option value="CARRERA">🎓 Por Carrera</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CONTENIDO: VISTA EN TARJETAS O VISTA EN TABLA */}
      {filteredCalls.length === 0 ? (
        <Card className="border-border p-12 text-center text-muted-foreground">
          <p>No se encontraron convocatorias con los criterios de búsqueda seleccionados.</p>
        </Card>
      ) : viewMode === "cards" ? (
        /* VISTA EN TARJETAS (COMPACTAS Y ADMINISTRATIVAS SIN BOTÓN POSTULAR) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCalls.map((call) => {
            const registeredProposals = getCallProposalsCount(call.code);

            return (
              <Card key={call.id} className="border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group">
                {/* BANNER DEL ARTE GRÁFICO SI EXISTE */}
                {call.artBannerUrl && (
                  <div className="relative w-full h-36 bg-muted border-b border-border overflow-hidden cursor-pointer" onClick={() => setViewArtCall(call)}>
                    {call.artBannerType === "image" ? (
                      <img src={call.artBannerUrl} alt={call.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-background flex items-center justify-center gap-3 p-4">
                        <FileText className="h-10 w-10 text-rose-400" />
                        <div>
                          <Badge variant="outline" className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[10px] font-bold">Documento PDF Oficial</Badge>
                          <p className="font-bold text-xs text-foreground mt-1 truncate">{call.artBannerName || "Afiche_Oficial.pdf"}</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                      <Badge variant="secondary" className="bg-black/60 backdrop-blur text-white border-white/20 font-bold text-[10px] gap-1">
                        <Image className="h-3 w-3 text-primary" /> Arte Gráfico Oficial
                      </Badge>
                      <Button size="sm" variant="secondary" className="h-7 text-[11px] font-bold bg-white/90 text-black hover:bg-white gap-1 shadow">
                        <Eye className="h-3.5 w-3.5" /> Ampliar Arte
                      </Button>
                    </div>
                  </div>
                )}

                <CardHeader className="pb-2 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold">
                        {call.code}
                      </Badge>
                      <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold">
                        Gestión {call.gestion}
                      </Badge>
                    </div>

                    <Badge 
                      variant="outline"
                      className={`font-bold text-[11px] ${
                        call.status === "Abierta para Postulación"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : call.status === "En Evaluación por Comité"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                          : call.status === "Cerrada"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {call.status}
                    </Badge>
                  </div>

                  <CardTitle className="text-base font-extrabold text-foreground leading-snug">
                    {call.title}
                  </CardTitle>

                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    {call.scopeType === "INSTITUCIONAL" && (
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/30 gap-1 font-bold text-[10px]">
                        <Globe className="h-3 w-3" /> Cobertura Institucional (Todas las Áreas)
                      </Badge>
                    )}
                    {call.scopeType === "FACULTAD" && (
                      <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1 font-bold text-[10px]">
                        <Building2 className="h-3 w-3" /> {call.targetFacultad}
                      </Badge>
                    )}
                    {call.scopeType === "CARRERA" && (
                      <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/30 gap-1 font-bold text-[10px]">
                        <GraduationCap className="h-3 w-3" /> {call.targetCarrera} ({call.targetFacultad})
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs">
                  <p className="text-muted-foreground leading-relaxed line-clamp-2">
                    {call.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Cierre: <strong className="text-foreground font-mono">{call.endDate}</strong></span>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-foreground">
                      <FileText className="h-4 w-4 text-emerald-500" />
                      <span>{registeredProposals} Propuestas Registradas</span>
                    </div>
                  </div>
                </CardContent>

                {/* FOOTER CON ACCIONES DE VER ARTE Y EDITAR */}
                <CardFooter className="pt-2.5 pb-2.5 bg-muted/20 border-t border-border flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground font-mono">Creada: {call.createdAt}</span>
                  <div className="flex items-center gap-1.5">
                    {call.artBannerUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewArtCall(call)}
                        className="text-xs font-bold gap-1 text-primary border-primary/30 hover:bg-primary/10"
                        title="Ver Afiche / Arte Gráfico"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver Arte
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCall(call)}
                      className="text-xs font-bold gap-1 text-foreground hover:bg-muted border-border"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-primary" /> Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteConfirmId(call.id)}
                      className="h-7 w-7 text-rose-400 hover:bg-rose-500/10 rounded-full"
                      title="Eliminar Convocatoria"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        /* VISTA EN TABLA ADMINISTRATIVA DE CONVOCATORIAS */
        <Card className="border-border bg-card shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50 font-bold uppercase text-[10px] text-muted-foreground">
                  <th className="p-3 w-32">Código</th>
                  <th className="p-3">Título de la Convocatoria</th>
                  <th className="p-3 w-24">Gestión</th>
                  <th className="p-3 w-48">Cobertura / Alcance</th>
                  <th className="p-3 w-32">Cierre</th>
                  <th className="p-3 w-40">Estado</th>
                  <th className="p-3 w-28 text-center">Propuestas</th>
                  <th className="p-3 text-center w-28">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCalls.map((call) => {
                  const registeredProposals = getCallProposalsCount(call.code);
                  return (
                    <tr key={call.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">
                        {call.code}
                      </td>
                      <td className="p-3 font-bold text-foreground">
                        <div className="space-y-0.5">
                          <span className="line-clamp-1">{call.title}</span>
                          <span className="text-[10px] text-muted-foreground line-clamp-1 font-normal">{call.description}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        {call.gestion}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {call.scopeType === "INSTITUCIONAL" && (
                          <span className="font-bold text-blue-400">🏢 Institucional</span>
                        )}
                        {call.scopeType === "FACULTAD" && (
                          <span className="font-bold text-amber-400">🏥 {call.targetFacultad}</span>
                        )}
                        {call.scopeType === "CARRERA" && (
                          <span className="font-bold text-purple-400">🎓 {call.targetCarrera}</span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-semibold text-foreground">
                        {call.endDate}
                      </td>
                      <td className="p-3">
                        <Badge 
                          variant="outline"
                          className={`font-bold text-[10px] ${
                            call.status === "Abierta para Postulación"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : call.status === "En Evaluación por Comité"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                              : call.status === "Cerrada"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {call.status}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono font-bold text-center text-foreground">
                        {registeredProposals}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingCall(call)}
                            className="h-7 w-7 text-primary hover:bg-primary/10 rounded-full"
                            title="Editar Convocatoria"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirmId(call.id)}
                            className="h-7 w-7 text-rose-400 hover:bg-rose-500/10 rounded-full"
                            title="Eliminar Convocatoria"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      </main>

      {/* MODAL: CREAR NUEVA CONVOCATORIA */}
      {isNewCallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> + Registrar Nueva Convocatoria
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsNewCallOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateCall} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Título / Nombre de la Convocatoria *</label>
                <Input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Convocatoria Institucional de Investigación e Innovación 2026..."
                  className="text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Código (Opcional)</label>
                  <Input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="CONV-1-2026-05"
                    className="text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Gestión Académica</label>
                  <select
                    value={newGestion}
                    onChange={(e) => setNewGestion(e.target.value)}
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {GESTIONES_DISPONIBLES.map((g) => (
                      <option key={g} value={g}>Gestión {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Alcance / Cobertura de la Convocatoria</label>
                <select
                  value={newScopeType}
                  onChange={(e) => setNewScopeType(e.target.value as any)}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="INSTITUCIONAL">🏢 Institucional (Todas las Áreas y Sedes)</option>
                  <option value="FACULTAD">🏥 Por Facultad Específica</option>
                  <option value="CARRERA">🎓 Por Carrera Específica</option>
                </select>
              </div>

              {newScopeType !== "INSTITUCIONAL" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40 border border-border">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Facultad</label>
                    <select
                      value={newFacultad}
                      onChange={(e) => setNewFacultad(e.target.value)}
                      className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {facultadesList.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  {newScopeType === "CARRERA" && (
                    <div className="space-y-1">
                      <label className="font-bold text-foreground">Carrera</label>
                      <select
                        value={newCarrera}
                        onChange={(e) => setNewCarrera(e.target.value)}
                        className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {carrerasList.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Fecha de Apertura</label>
                  <Input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Fecha de Cierre *</label>
                  <Input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Estado Inicial</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Abierta para Postulación">🟢 Abierta para Postulación</option>
                  <option value="En Evaluación por Comité">🟣 En Evaluación por Comité</option>
                  <option value="Cerrada">🔴 Cerrada</option>
                  <option value="Próxima">🟡 Próxima</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Descripción / Objetivos</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detalle los objetivos, términos de referencia y requisitos..."
                  className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* SECCIÓN: ARTE GRÁFICO / AFICHE OFICIAL DE LA CONVOCATORIA (IMAGEN O PDF) */}
              <div className="space-y-1.5 p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground flex items-center gap-1.5">
                    <Image className="h-4 w-4 text-primary" />
                    Arte Gráfico / Afiche Oficial (Imagen o PDF)
                  </label>
                  <span className="text-[10px] text-muted-foreground">Opcional</span>
                </div>

                {newArtBannerUrl ? (
                  <div className="relative rounded-lg border border-primary/40 p-2 bg-background flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {newArtBannerType === "image" ? (
                        <img src={newArtBannerUrl} alt="Arte Banner" className="h-12 w-20 object-cover rounded border border-border shrink-0" />
                      ) : (
                        <div className="h-12 w-12 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                          <FileText className="h-6 w-6 text-rose-500" />
                        </div>
                      )}
                      <div className="truncate text-xs">
                        <p className="font-bold text-foreground truncate">{newArtBannerName || "Arte_Convocatoria"}</p>
                        <p className="text-[10px] text-emerald-400 font-semibold">✓ Arte cargado correctamente ({newArtBannerType.toUpperCase()})</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setNewArtBannerUrl("");
                        setNewArtBannerName("");
                      }}
                      className="h-7 w-7 text-rose-400 hover:bg-rose-500/10 rounded-full shrink-0"
                      title="Quitar Arte"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <label className="flex-1 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-input hover:border-primary bg-background cursor-pointer transition-colors text-xs font-semibold text-muted-foreground hover:text-foreground">
                      <UploadCloud className="h-4 w-4 text-primary" />
                      <span>Subir Afiche (PNG, JPG, WebP o PDF)</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, false);
                        }}
                      />
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewArtBannerUrl("https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80");
                        setNewArtBannerType("image");
                        setNewArtBannerName("Afiche_Oficial_UNITEPC.jpg");
                      }}
                      className="text-[11px] font-semibold gap-1 text-primary border-primary/30 hover:bg-primary/10 shrink-0"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Usar Arte Ejemplo
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsNewCallOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 font-bold">
                  Crear Convocatoria
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR CONVOCATORIA */}
      {editingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-primary" /> ✏️ Editar Convocatoria: {editingCall.code}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setEditingCall(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleUpdateCall} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Título / Nombre de la Convocatoria *</label>
                <Input
                  type="text"
                  required
                  value={editingCall.title}
                  onChange={(e) => setEditingCall({ ...editingCall, title: e.target.value })}
                  className="text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Código</label>
                  <Input
                    type="text"
                    value={editingCall.code}
                    onChange={(e) => setEditingCall({ ...editingCall, code: e.target.value })}
                    className="text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Gestión Académica</label>
                  <select
                    value={editingCall.gestion}
                    onChange={(e) => setEditingCall({ ...editingCall, gestion: e.target.value })}
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {GESTIONES_DISPONIBLES.map((g) => (
                      <option key={g} value={g}>Gestión {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Estado de la Convocatoria</label>
                <select
                  value={editingCall.status}
                  onChange={(e) => setEditingCall({ ...editingCall, status: e.target.value as any })}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Abierta para Postulación">🟢 Abierta para Postulación</option>
                  <option value="En Evaluación por Comité">🟣 En Evaluación por Comité</option>
                  <option value="Cerrada">🔴 Cerrada</option>
                  <option value="Próxima">🟡 Próxima</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Fecha de Apertura</label>
                  <Input
                    type="date"
                    value={editingCall.startDate}
                    onChange={(e) => setEditingCall({ ...editingCall, startDate: e.target.value })}
                    className="text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Fecha de Cierre</label>
                  <Input
                    type="date"
                    value={editingCall.endDate}
                    onChange={(e) => setEditingCall({ ...editingCall, endDate: e.target.value })}
                    className="text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Descripción / Objetivos</label>
                <textarea
                  rows={2}
                  value={editingCall.description}
                  onChange={(e) => setEditingCall({ ...editingCall, description: e.target.value })}
                  className="w-full bg-background border border-input rounded-lg p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* SECCIÓN: ARTE GRÁFICO / AFICHE EN MODO EDICIÓN */}
              <div className="space-y-1.5 p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground flex items-center gap-1.5">
                    <Image className="h-4 w-4 text-primary" />
                    Arte Gráfico / Afiche Oficial (Imagen o PDF)
                  </label>
                  <span className="text-[10px] text-muted-foreground">Opcional</span>
                </div>

                {editingCall.artBannerUrl ? (
                  <div className="relative rounded-lg border border-primary/40 p-2 bg-background flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {editingCall.artBannerType === "image" ? (
                        <img src={editingCall.artBannerUrl} alt="Arte Banner" className="h-12 w-20 object-cover rounded border border-border shrink-0" />
                      ) : (
                        <div className="h-12 w-12 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                          <FileText className="h-6 w-6 text-rose-500" />
                        </div>
                      )}
                      <div className="truncate text-xs">
                        <p className="font-bold text-foreground truncate">{editingCall.artBannerName || "Arte_Convocatoria"}</p>
                        <p className="text-[10px] text-emerald-400 font-semibold">✓ Arte asignado ({editingCall.artBannerType?.toUpperCase() || "IMAGEN"})</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCall({ ...editingCall, artBannerUrl: undefined, artBannerName: undefined })}
                      className="h-7 w-7 text-rose-400 hover:bg-rose-500/10 rounded-full shrink-0"
                      title="Quitar Arte"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <label className="flex-1 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-input hover:border-primary bg-background cursor-pointer transition-colors text-xs font-semibold text-muted-foreground hover:text-foreground">
                      <UploadCloud className="h-4 w-4 text-primary" />
                      <span>Subir Nuevo Afiche (PNG, JPG, WebP o PDF)</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, true);
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingCall(null)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 font-bold gap-1">
                  <Check className="h-4 w-4" /> Guardar Cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VISTA AMPLIADA DEL ARTE GRÁFICO / AFICHE DE CONVOCATORIA */}
      {viewArtCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* CABECERA */}
            <div className="p-4 border-b border-border bg-muted/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <Badge variant="outline" className="font-mono bg-primary/10 text-primary border-primary/30 font-bold shrink-0">
                  {viewArtCall.code}
                </Badge>
                <h3 className="font-extrabold text-sm sm:text-base text-foreground truncate">
                  Arte Gráfico Oficial: {viewArtCall.title}
                </h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setViewArtCall(null)} className="rounded-full shrink-0 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* CUERPO DEL RENDER */}
            <div className="p-6 overflow-y-auto flex items-center justify-center bg-black/40 min-h-[350px]">
              {viewArtCall.artBannerUrl ? (
                viewArtCall.artBannerType === "image" ? (
                  <div className="space-y-3 text-center w-full">
                    <img
                      src={viewArtCall.artBannerUrl}
                      alt={viewArtCall.title}
                      className="max-h-[60vh] max-w-full object-contain mx-auto rounded-lg shadow-2xl border border-border"
                    />
                    <p className="text-xs text-muted-foreground font-mono">
                      {viewArtCall.artBannerName || "Afiche_Oficial_Convocatoria.jpg"}
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-[60vh] bg-background border border-border rounded-lg p-2">
                    <iframe
                      src={viewArtCall.artBannerUrl}
                      title="Afiche PDF Convocatoria"
                      className="w-full h-full rounded border-0"
                    />
                  </div>
                )
              ) : (
                <div className="text-center space-y-2 p-8 text-muted-foreground">
                  <AlertCircle className="h-10 w-10 mx-auto text-amber-500" />
                  <p className="font-bold text-foreground">No hay arte gráfico asignado a esta convocatoria.</p>
                </div>
              )}
            </div>

            {/* PIE DE MODAL */}
            <div className="p-3 bg-muted/30 border-t border-border flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground font-mono">Gestión {viewArtCall.gestion} | UNITEPC</span>
              <div className="flex items-center gap-2">
                {viewArtCall.artBannerUrl && (
                  <a
                    href={viewArtCall.artBannerUrl}
                    download={viewArtCall.artBannerName || `Arte_${viewArtCall.code}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="sm" className="bg-primary hover:bg-primary/90 font-bold text-xs gap-1.5 shadow">
                      <Download className="h-4 w-4" /> Descargar Afiche Oficial
                    </Button>
                  </a>
                )}
                <Button variant="outline" size="sm" onClick={() => setViewArtCall(null)} className="font-bold">
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST ELEGANTE */}
      <ElegantToast toast={toast} onClose={() => setToast(null)} />

      {/* MODAL CONFIRMACIÓN ELIMINAR */}
      <ElegantConfirmModal
        isOpen={deleteConfirmId !== null}
        title="Eliminar Convocatoria"
        message="¿Está seguro de que desea eliminar esta convocatoria? Esta acción no se puede deshacer."
        confirmText="Sí, Eliminar"
        isDanger={true}
        onConfirm={() => deleteConfirmId && executeDeleteCall(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
