"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  UserCheck, ShieldCheck, Users, User, Plus, Search, Filter, Trash2, Edit3, 
  CheckCircle2, XCircle, UserPlus, BookOpen, Calendar, Clock, Award, X, 
  Layers, Lock, Unlock, Check, AlertTriangle, FileText, Mail, Phone, IdCard, 
  Building2, GraduationCap, Globe, KeyRound, Calculator, DollarSign, Wallet,
  LayoutGrid, Table as TableIcon
} from "lucide-react";
import { getStoredMasterProjects } from "@/lib/sigpri-store";
import { ProjectItem } from "../projects/page";
import { UNITEPC_SEDES_DATA, getUNITEPCFacultades, getUNITEPCCarreras } from "@/lib/unitepc-structure";

// ESTRUCTURA DE MIEMBRO DE COMITÉ
export interface CommitteeMember {
  id: string;
  name: string;
  ciNumber?: string;
  email: string;
  phone?: string;
  investigatorType: "INTERNO" | "EXTERNO";
  sede?: string;
  facultad?: string;
  carrera?: string;
  degree: string;
  institution: string;
  role: "Presidente" | "Secretario Técnico" | "Evaluador Par" | "Vocal";
  systemRole: "comite";
  status: "Activo" | "Deshabilitado";
  createdAt: string;
}

// ESTRUCTURA DE COMITÉ EVALUADOR
export interface Committee {
  id: string;
  code: string;
  name: string;
  area: string;
  gestion: string; // ej. "1-2026", "2-2026", "1-2027"
  status: "Activo" | "En Sesión" | "Receso" | "Deshabilitado";
  members: CommitteeMember[];
  assignedProjectIds: string[];
  nextSessionDate: string;
}

// ESTRUCTURA DE PERSONAL DE CONTABILIDAD Y FINANZAS
export interface AccountingOfficer {
  id: string;
  name: string;
  ciNumber: string;
  email: string;
  phone: string;
  cargo: "Analista Contable" | "Auditor Financiero" | "Jefe de Tesorería" | "Revisor Impositivo";
  sede: string;
  systemRole: "contabilidad";
  status: "Activo" | "Deshabilitado";
  assignedProjectIds: string[];
  createdAt: string;
}

const GESTIONES_DISPONIBLES = ["1-2026", "2-2026", "1-2027", "2-2027"];

// INICIALMENTE ÚNICAMENTE 2 COMITÉS BASE
const INITIAL_COMMITTEES: Committee[] = [
  {
    id: "com-101",
    code: "COM-CIEN-1-2026",
    name: "Comité Científico UNITEPC",
    area: "Evaluación Científica y Metodológica",
    gestion: "1-2026",
    status: "Activo",
    assignedProjectIds: ["proj-1", "proj-2"],
    nextSessionDate: "2026-08-15",
    members: [
      { id: "m-1", name: "Dr. Gustavo Alarcón", ciNumber: "4589123 CB", email: "gustavo.alarcon@unitepc.edu.bo", phone: "71728394", investigatorType: "INTERNO", sede: "Cochabamba", facultad: "Facultad de Ciencias y Tecnología", carrera: "Ingeniería de Sistemas", role: "Presidente", degree: "Ph.D. en Ciencias de la Computación", institution: "UNITEPC", systemRole: "comite", status: "Activo", createdAt: "2026-01-10" },
      { id: "m-2", name: "Dra. Patricia Terrazas", ciNumber: "5123984 CB", email: "patricia.terrazas@unitepc.edu.bo", phone: "72839405", investigatorType: "INTERNO", sede: "Cochabamba", facultad: "Facultad de Ciencias y Tecnología", carrera: "Ingeniería Mecatrónica", role: "Secretario Técnico", degree: "M.Sc. en Ingeniería Mecatrónica", institution: "UNITEPC", systemRole: "comite", status: "Activo", createdAt: "2026-01-10" },
      { id: "m-3", name: "Ing. Roberto Siles", ciNumber: "3892014 SC", email: "roberto.siles@uagrm.edu.bo", phone: "76543210", investigatorType: "EXTERNO", degree: "M.Sc. en Sistemas Eléctricos", institution: "UAGRM", role: "Evaluador Par", systemRole: "comite", status: "Activo", createdAt: "2026-01-15" },
      { id: "m-4", name: "Dra. Carmen Villarroel", ciNumber: "4920183 CB", email: "carmen.villarroel@umss.edu.bo", phone: "79123456", investigatorType: "EXTERNO", degree: "Ph.D. en Ciencia de Datos", institution: "UMSS", role: "Evaluador Par", systemRole: "comite", status: "Activo", createdAt: "2026-01-15" },
    ],
  },
  {
    id: "com-102",
    code: "COM-BIO-1-2026",
    name: "Comité Bioético UNITEPC",
    area: "Bioética, Bioseguridad y Ética Médica",
    gestion: "1-2026",
    status: "Activo",
    assignedProjectIds: ["proj-1", "proj-3"],
    nextSessionDate: "2026-08-20",
    members: [
      { id: "m-5", name: "Dr. Fernando Morales", ciNumber: "3129048 LP", email: "fernando.morales@unitepc.edu.bo", phone: "71122334", investigatorType: "INTERNO", sede: "Cochabamba", facultad: "Facultad de Ciencias de la Salud", carrera: "Medicina", role: "Presidente", degree: "Ph.D. en Infectología y Bioética", institution: "UNITEPC", systemRole: "comite", status: "Activo", createdAt: "2026-01-12" },
      { id: "m-6", name: "Dra. Lorena Bazán", ciNumber: "6123984 CB", email: "lorena.bazan@unitepc.edu.bo", phone: "72233445", investigatorType: "INTERNO", sede: "Cochabamba", facultad: "Facultad de Ciencias de la Salud", carrera: "Bioquímica y Farmacia", role: "Secretario Técnico", degree: "Ph.D. en Biotecnología Médica", institution: "UNITEPC", systemRole: "comite", status: "Activo", createdAt: "2026-01-12" },
      { id: "m-7", name: "Dr. Oscar Campero", ciNumber: "4019283 CB", email: "oscar.campero@genetica.org", phone: "73344556", investigatorType: "EXTERNO", degree: "M.Sc. en Farmacología", institution: "Instituto de Genética", role: "Evaluador Par", systemRole: "comite", status: "Activo", createdAt: "2026-01-18" },
    ],
  },
];

// INICIALMENTE PERSONAL DE CONTABILIDAD Y FINANZAS
const INITIAL_ACCOUNTING_OFFICERS: AccountingOfficer[] = [
  {
    id: "acc-1",
    name: "Lic. Marco Antonio Soliz",
    ciNumber: "3920194 CB",
    email: "marco.soliz@unitepc.edu.bo",
    phone: "71239845",
    cargo: "Analista Contable",
    sede: "Cochabamba",
    systemRole: "contabilidad",
    status: "Activo",
    assignedProjectIds: ["proj-1", "proj-2", "proj-3"],
    createdAt: "2026-01-15",
  },
  {
    id: "acc-2",
    name: "Lic. Claudia Valenzuela",
    ciNumber: "4820193 SC",
    email: "claudia.valenzuela@unitepc.edu.bo",
    phone: "72901823",
    cargo: "Auditor Financiero",
    sede: "Santa Cruz",
    systemRole: "contabilidad",
    status: "Activo",
    assignedProjectIds: ["proj-4", "proj-6"],
    createdAt: "2026-01-20",
  },
];

const LOCAL_STORAGE_COMMITTEES_KEY = "sigpri_committees_master_data_v2";
const LOCAL_STORAGE_ACCOUNTING_KEY = "sigpri_accounting_officers_data_v1";

export default function CommitteesPage() {
  const [activeTab, setActiveTab] = useState<"committees" | "accounting">("committees");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [accountingOfficers, setAccountingOfficers] = useState<AccountingOfficer[]>([]);
  const [selectedGestionFilter, setSelectedGestionFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);

  // MODAL: CREAR NUEVO COMITÉ
  const [isNewCommitteeOpen, setIsNewCommitteeOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newGestion, setNewGestion] = useState("1-2026");

  // MODAL: GESTIONAR MIEMBROS COMITÉ (REGISTRO COMPLETO)
  const [memberManagementCommittee, setMemberManagementCommittee] = useState<Committee | null>(null);
  const [investigatorType, setInvestigatorType] = useState<"INTERNO" | "EXTERNO">("INTERNO");
  const [memFullName, setMemFullName] = useState("");
  const [memCiNumber, setMemCiNumber] = useState("");
  const [memEmail, setMemEmail] = useState("");
  const [memPhone, setMemPhone] = useState("");
  const [memSede, setMemSede] = useState("Cochabamba");
  const [memFacultad, setMemFacultad] = useState("Facultad de Ciencias de la Salud");
  const [memCarrera, setMemCarrera] = useState("Medicina");
  const [memDegree, setMemDegree] = useState("");
  const [memInstitution, setMemInstitution] = useState("UNITEPC");
  const [memRole, setMemRole] = useState<"Presidente" | "Secretario Técnico" | "Evaluador Par" | "Vocal">("Evaluador Par");

  // MODAL: REGISTRAR PERSONAL DE CONTABILIDAD
  const [isNewAccountingOpen, setIsNewAccountingOpen] = useState(false);
  const [accName, setAccName] = useState("");
  const [accCi, setAccCi] = useState("");
  const [accEmail, setAccEmail] = useState("");
  const [accPhone, setAccPhone] = useState("");
  const [accCargo, setAccCargo] = useState<AccountingOfficer["cargo"]>("Analista Contable");
  const [accSede, setAccSede] = useState("Cochabamba");

  // MODAL: ASIGNAR PROYECTOS A REVISIÓN CONTABLE / COMITÉ
  const [assignProjectCommittee, setAssignProjectCommittee] = useState<Committee | null>(null);
  const [assignProjectAccounting, setAssignProjectAccounting] = useState<AccountingOfficer | null>(null);

  // Listas dinámicas para Sede, Facultad y Carrera
  const sedesList = Object.keys(UNITEPC_SEDES_DATA);
  const [facultadesList, setFacultadesList] = useState<string[]>([]);
  const [carrerasList, setCarrerasList] = useState<string[]>([]);

  useEffect(() => {
    const facs = getUNITEPCFacultades(memSede);
    setFacultadesList(facs);
    if (facs.length > 0) {
      setMemFacultad(facs[0]);
      const cars = getUNITEPCCarreras(memSede, facs[0]);
      setCarrerasList(cars);
      if (cars.length > 0) setMemCarrera(cars[0]);
    }
  }, [memSede]);

  useEffect(() => {
    const cars = getUNITEPCCarreras(memSede, memFacultad);
    setCarrerasList(cars);
    if (cars.length > 0) setMemCarrera(cars[0]);
  }, [memFacultad]);

  // PERSISTENCIA
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Cargar Comités
      const storedComm = localStorage.getItem(LOCAL_STORAGE_COMMITTEES_KEY);
      if (storedComm) {
        try {
          const parsed = JSON.parse(storedComm);
          setCommittees(Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COMMITTEES);
        } catch (e) {
          setCommittees(INITIAL_COMMITTEES);
        }
      } else {
        setCommittees(INITIAL_COMMITTEES);
        localStorage.setItem(LOCAL_STORAGE_COMMITTEES_KEY, JSON.stringify(INITIAL_COMMITTEES));
      }

      // Cargar Personal de Contabilidad
      const storedAcc = localStorage.getItem(LOCAL_STORAGE_ACCOUNTING_KEY);
      if (storedAcc) {
        try {
          const parsedAcc = JSON.parse(storedAcc);
          setAccountingOfficers(Array.isArray(parsedAcc) && parsedAcc.length > 0 ? parsedAcc : INITIAL_ACCOUNTING_OFFICERS);
        } catch (e) {
          setAccountingOfficers(INITIAL_ACCOUNTING_OFFICERS);
        }
      } else {
        setAccountingOfficers(INITIAL_ACCOUNTING_OFFICERS);
        localStorage.setItem(LOCAL_STORAGE_ACCOUNTING_KEY, JSON.stringify(INITIAL_ACCOUNTING_OFFICERS));
      }

      setProjectsList(getStoredMasterProjects());
    }
  }, []);

  const saveCommitteesData = (updated: Committee[]) => {
    setCommittees(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_COMMITTEES_KEY, JSON.stringify(updated));
    }
  };

  const saveAccountingData = (updated: AccountingOfficer[]) => {
    setAccountingOfficers(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_ACCOUNTING_KEY, JSON.stringify(updated));
    }
  };

  // CREAR COMITÉ
  const handleCreateCommittee = () => {
    if (!newName.trim() || !newArea.trim()) {
      alert("Por favor complete el nombre y área del nuevo comité.");
      return;
    }

    const autoCode = newCode.trim() || `COM-${newName.substring(0, 3).toUpperCase()}-${newGestion}`;
    const newComm: Committee = {
      id: `com-${Date.now()}`,
      code: autoCode,
      name: newName,
      area: newArea,
      gestion: newGestion,
      status: "Activo",
      members: [],
      assignedProjectIds: [],
      nextSessionDate: new Date().toISOString().substring(0, 10),
    };

    saveCommitteesData([...committees, newComm]);
    setNewCode("");
    setNewName("");
    setNewArea("");
    setIsNewCommitteeOpen(false);
  };

  // REGISTRAR NUEVO INTEGRANTE EN COMITÉ (ROL COMITÉ)
  const handleAddMemberFull = (e: React.FormEvent) => {
    e.preventDefault();

    if (!memberManagementCommittee || !memFullName.trim() || !memEmail.trim()) {
      alert("Por favor ingrese el Nombre Completo y el Correo Electrónico.");
      return;
    }

    const newMem: CommitteeMember = {
      id: `m-${Date.now()}`,
      name: memFullName,
      ciNumber: memCiNumber || "SN",
      email: memEmail,
      phone: memPhone || "SN",
      investigatorType: investigatorType,
      sede: investigatorType === "INTERNO" ? memSede : undefined,
      facultad: investigatorType === "INTERNO" ? memFacultad : undefined,
      carrera: investigatorType === "INTERNO" ? memCarrera : undefined,
      degree: memDegree || "Docente Evaluador",
      institution: investigatorType === "INTERNO" ? "UNITEPC" : (memInstitution || "Institución Externa"),
      role: memRole,
      systemRole: "comite",
      status: "Activo",
      createdAt: new Date().toISOString().substring(0, 10),
    };

    const updatedCommittees = committees.map((c) => {
      if (c.id === memberManagementCommittee.id) {
        const updatedMembers = [...c.members, newMem];
        const updatedComm = { ...c, members: updatedMembers };
        setMemberManagementCommittee(updatedComm);
        return updatedComm;
      }
      return c;
    });

    saveCommitteesData(updatedCommittees);

    setMemFullName("");
    setMemCiNumber("");
    setMemEmail("");
    setMemPhone("");
    setMemDegree("");
  };

  // REGISTRAR PERSONAL DE CONTABILIDAD (ROL CONTABILIDAD)
  const handleCreateAccountingOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName.trim() || !accEmail.trim()) {
      alert("Por favor ingrese el Nombre Completo y el Correo Electrónico.");
      return;
    }

    const newOfficer: AccountingOfficer = {
      id: `acc-${Date.now()}`,
      name: accName,
      ciNumber: accCi || "SN",
      email: accEmail,
      phone: accPhone || "SN",
      cargo: accCargo,
      sede: accSede,
      systemRole: "contabilidad",
      status: "Activo",
      assignedProjectIds: [],
      createdAt: new Date().toISOString().substring(0, 10),
    };

    saveAccountingData([...accountingOfficers, newOfficer]);
    setAccName("");
    setAccCi("");
    setAccEmail("");
    setAccPhone("");
    setIsNewAccountingOpen(false);
  };

  const handleToggleAccountingStatus = (officerId: string) => {
    const updated = accountingOfficers.map((o) => {
      if (o.id === officerId) {
        return {
          ...o,
          status: o.status === "Activo" ? ("Deshabilitado" as const) : ("Activo" as const),
        };
      }
      return o;
    });
    saveAccountingData(updated);
  };

  const handleRemoveAccountingOfficer = (officerId: string) => {
    const updated = accountingOfficers.filter((o) => o.id !== officerId);
    saveAccountingData(updated);
  };

  const handleToggleProjectAccountingAssignment = (projectId: string) => {
    if (!assignProjectAccounting) return;

    const updated = accountingOfficers.map((o) => {
      if (o.id === assignProjectAccounting.id) {
        const exists = o.assignedProjectIds.includes(projectId);
        const updatedIds = exists
          ? o.assignedProjectIds.filter((id) => id !== projectId)
          : [...o.assignedProjectIds, projectId];

        const updatedOfficer = { ...o, assignedProjectIds: updatedIds };
        setAssignProjectAccounting(updatedOfficer);
        return updatedOfficer;
      }
      return o;
    });

    saveAccountingData(updated);
  };

  const handleRemoveMember = (memberId: string) => {
    if (!memberManagementCommittee) return;

    const updatedCommittees = committees.map((c) => {
      if (c.id === memberManagementCommittee.id) {
        const updatedMembers = c.members.filter((m) => m.id !== memberId);
        const updatedComm = { ...c, members: updatedMembers };
        setMemberManagementCommittee(updatedComm);
        return updatedComm;
      }
      return c;
    });

    saveCommitteesData(updatedCommittees);
  };

  const handleToggleMemberStatus = (memberId: string) => {
    if (!memberManagementCommittee) return;

    const updatedCommittees = committees.map((c) => {
      if (c.id === memberManagementCommittee.id) {
        const updatedMembers = c.members.map((m) => {
          if (m.id === memberId) {
            return {
              ...m,
              status: m.status === "Activo" ? ("Deshabilitado" as const) : ("Activo" as const),
            };
          }
          return m;
        });
        const updatedComm = { ...c, members: updatedMembers };
        setMemberManagementCommittee(updatedComm);
        return updatedComm;
      }
      return c;
    });

    saveCommitteesData(updatedCommittees);
  };

  const handleToggleCommitteeStatus = (committeeId: string, newStatus: Committee["status"]) => {
    const updated = committees.map((c) => (c.id === committeeId ? { ...c, status: newStatus } : c));
    saveCommitteesData(updated);
  };

  const handleToggleProjectAssignment = (projectId: string) => {
    if (!assignProjectCommittee) return;

    const updatedCommittees = committees.map((c) => {
      if (c.id === assignProjectCommittee.id) {
        const exists = c.assignedProjectIds.includes(projectId);
        const updatedIds = exists
          ? c.assignedProjectIds.filter((id) => id !== projectId)
          : [...c.assignedProjectIds, projectId];

        const updatedComm = { ...c, assignedProjectIds: updatedIds };
        setAssignProjectCommittee(updatedComm);
        return updatedComm;
      }
      return c;
    });

    saveCommitteesData(updatedCommittees);
  };

  const filteredCommittees = committees.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(query.toLowerCase()) || c.area.toLowerCase().includes(query.toLowerCase());
    const matchesGestion = selectedGestionFilter === "all" || c.gestion === selectedGestionFilter;
    return matchesSearch && matchesGestion;
  });

  const filteredAccountingOfficers = accountingOfficers.filter((o) => {
    return o.name.toLowerCase().includes(query.toLowerCase()) || o.cargo.toLowerCase().includes(query.toLowerCase()) || o.sede.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="flex flex-col min-h-screen bg-background pb-10">
      <Header
        title="Órganos Evaluadores y Control Financiero"
        description="Gestión unificada de comités de evaluación científica/bioética y personal de contabilidad/finanzas para el seguimiento presupuestario de proyectos."
      />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 w-full">
        {/* HEADER BANNER Y TABS */}
        <Card className="border border-border bg-card shadow-md">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold">
                  Evaluación & Finanzas UNITEPC
                </Badge>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-primary" />
                Órganos Evaluadores y Control Presupuestario
              </CardTitle>
              <CardDescription>
                Administración de comités científicos/bioéticos y personal contable habilitado para la auditoría presupuestaria y desembolsos.
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

              {activeTab === "committees" ? (
                <Button
                  onClick={() => setIsNewCommitteeOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-2 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Crear Nuevo Comité</span>
                </Button>
              ) : (
                <Button
                  onClick={() => setIsNewAccountingOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 shadow"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Registrar Personal de Contabilidad</span>
                </Button>
              )}
            </div>
          </div>

          {/* TABS DE NAVEGACIÓN (COMITÉS VS CONTABILIDAD) */}
          <div className="flex items-center gap-2 pt-4 border-t border-border">
            <button
              onClick={() => setActiveTab("committees")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "committees"
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <UserCheck className="h-4 w-4" /> Comités Evaluadores ({committees.length})
            </button>

            <button
              onClick={() => setActiveTab("accounting")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "accounting"
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Calculator className="h-4 w-4" /> Personal de Contabilidad y Finanzas ({accountingOfficers.length})
            </button>
          </div>
        </CardHeader>

        {/* FILTROS DE BÚSQUEDA */}
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={activeTab === "committees" ? "Buscar por comité o área..." : "Buscar por nombre, cargo o sede contable..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 text-xs font-medium"
              />
            </div>

            {activeTab === "committees" && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">Gestión Académica:</span>
                <select
                  value={selectedGestionFilter}
                  onChange={(e) => setSelectedGestionFilter(e.target.value)}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="all">Todas las Gestiones</option>
                  {GESTIONES_DISPONIBLES.map((g) => (
                    <option key={g} value={g}>Gestión {g}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CONTENIDO TAB 1: COMITÉS EVALUADORES */}
      {activeTab === "committees" && (
        viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCommittees.map((comm) => {
              const activeMembers = comm.members.filter((m) => m.status === "Activo");
              const disabledMembersCount = comm.members.filter((m) => m.status === "Deshabilitado").length;

              return (
                <Card key={comm.id} className={`border-2 ${comm.status === "Activo" ? "border-primary/40 bg-card" : "border-border bg-muted/20"} shadow-md flex flex-col justify-between`}>
                  <CardHeader className="pb-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold">
                          {comm.code}
                        </Badge>
                        <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold">
                          Gestión {comm.gestion}
                        </Badge>
                      </div>

                      <select
                        value={comm.status}
                        onChange={(e) => handleToggleCommitteeStatus(comm.id, e.target.value as Committee["status"])}
                        className="bg-background border border-input rounded px-2 py-1 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="Activo">🟢 Activo</option>
                        <option value="En Sesión">🟣 En Sesión</option>
                        <option value="Receso">🟡 Receso</option>
                        <option value="Deshabilitado">🔴 Deshabilitado</option>
                      </select>
                    </div>

                    <CardTitle className="text-lg font-extrabold text-foreground leading-tight">
                      {comm.name}
                    </CardTitle>
                    <CardDescription className="text-xs font-medium text-muted-foreground">
                      Área: <span className="font-bold text-foreground">{comm.area}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 text-xs">
                    <div className="p-3 rounded-lg bg-muted/40 border border-border flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Proyectos Asignados para Arbitraje:</span>
                        <span className="text-base font-extrabold text-primary">{comm.assignedProjectIds.length} Proyectos</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAssignProjectCommittee(comm)}
                        className="text-xs font-bold text-primary border-primary/30 hover:bg-primary/10 gap-1.5"
                      >
                        <FileText className="h-3.5 w-3.5" /> Asignar Proyectos
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-xs flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-primary" /> Miembros del Comité ({activeMembers.length} Activos
                          {disabledMembersCount > 0 && `, ${disabledMembersCount} Inactivos`}):
                        </span>
                      </div>

                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {comm.members.map((m) => (
                          <div
                            key={m.id}
                            className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                              m.status === "Activo"
                                ? "bg-card border-border/80"
                                : "bg-muted/40 border-dashed border-border opacity-60"
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground">{m.name}</span>
                                <Badge variant="outline" className="text-[9px] font-bold bg-primary/10 text-primary border-primary/30">
                                  {m.role}
                                </Badge>
                                <Badge variant="outline" className="text-[9px] font-bold bg-purple-500/10 text-purple-400 border-purple-500/30">
                                  Rol: Comité
                                </Badge>
                                {m.status === "Deshabilitado" && (
                                  <Badge variant="outline" className="text-[9px] font-bold bg-rose-500/10 text-rose-400 border-rose-500/30">
                                    Deshabilitado
                                  </Badge>
                                )}
                              </div>
                              <span className="text-[11px] text-muted-foreground block">
                                📧 {m.email} | {m.degree} - {m.institution}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 border-t border-border bg-muted/20 flex justify-between items-center">
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Próxima Sesión: {comm.nextSessionDate}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMemberManagementCommittee(comm)}
                      className="text-xs font-bold gap-1.5 bg-background hover:bg-muted border-border text-foreground"
                    >
                      <UserPlus className="h-3.5 w-3.5 text-primary" /> 👥 Gestionar Miembros
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          /* TABLA DE COMITÉS EVALUADORES */
          <Card className="border-border bg-card shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50 font-bold uppercase text-[10px] text-muted-foreground">
                    <th className="p-3 w-32">Código</th>
                    <th className="p-3">Comité Evaluador</th>
                    <th className="p-3 w-28">Gestión</th>
                    <th className="p-3 w-32 text-center">Evaluadores</th>
                    <th className="p-3 w-32 text-center">Proyectos</th>
                    <th className="p-3 w-32">Estado</th>
                    <th className="p-3 text-center w-40">Acciones Operativas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredCommittees.map((comm) => (
                    <tr key={comm.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">
                        {comm.code}
                      </td>
                      <td className="p-3 font-bold text-foreground">
                        <div className="space-y-0.5">
                          <span>{comm.name}</span>
                          <span className="text-[10px] text-muted-foreground block font-normal">{comm.area}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        {comm.gestion}
                      </td>
                      <td className="p-3 text-center font-bold text-foreground">
                        {comm.members.filter(m => m.status === 'Activo').length} Activos
                      </td>
                      <td className="p-3 text-center font-bold text-primary">
                        {comm.assignedProjectIds.length} Asignados
                      </td>
                      <td className="p-3">
                        <select
                          value={comm.status}
                          onChange={(e) => handleToggleCommitteeStatus(comm.id, e.target.value as Committee["status"])}
                          className="bg-background border border-input rounded px-2 py-1 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                        >
                          <option value="Activo">🟢 Activo</option>
                          <option value="En Sesión">🟣 En Sesión</option>
                          <option value="Receso">🟡 Receso</option>
                          <option value="Deshabilitado">🔴 Deshabilitado</option>
                        </select>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setMemberManagementCommittee(comm)}
                            className="h-7 text-[10px] font-bold gap-1"
                          >
                            <UserPlus className="w-3 h-3 text-primary" /> Miembros
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAssignProjectCommittee(comm)}
                            className="h-7 text-[10px] font-bold gap-1 text-primary"
                          >
                            <FileText className="w-3 h-3" /> Proyectos
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}

      {/* CONTENIDO TAB 2: PERSONAL DE CONTABILIDAD Y FINANZAS */}
      {activeTab === "accounting" && (
        viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAccountingOfficers.map((officer) => {
              return (
                <Card key={officer.id} className={`border-2 ${officer.status === "Activo" ? "border-emerald-500/40 bg-card" : "border-border bg-muted/20"} shadow-md flex flex-col justify-between`}>
                  <CardHeader className="pb-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold">
                          {officer.cargo}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-400 font-bold">
                          Rol: Contabilidad
                        </Badge>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAccountingStatus(officer.id)}
                        className={`h-7 px-2 text-[10px] font-bold gap-1 ${
                          officer.status === "Activo"
                            ? "border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                            : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                      >
                        {officer.status === "Activo" ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                        <span>{officer.status === "Activo" ? "Deshabilitar" : "Habilitar"}</span>
                      </Button>
                    </div>

                    <CardTitle className="text-lg font-extrabold text-foreground flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-emerald-500" />
                      {officer.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground flex items-center justify-between">
                      <span>Sede: <strong className="text-foreground">{officer.sede}</strong></span>
                      <span>CI: <strong className="text-foreground font-mono">{officer.ciNumber}</strong></span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1.5">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Correo de Acceso:</span>
                        <strong className="text-foreground font-mono">{officer.email}</strong>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Teléfono / Contacto:</span>
                        <strong className="text-foreground font-mono">{officer.phone}</strong>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">Proyectos en Auditoría Presupuestaria:</span>
                        <span className="text-base font-extrabold text-emerald-500">{officer.assignedProjectIds.length} Proyectos</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAssignProjectAccounting(officer)}
                        className="text-xs font-bold text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10 gap-1.5"
                      >
                        <FileText className="h-3.5 w-3.5" /> Asignar Proyectos
                      </Button>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 border-t border-border bg-muted/20 flex justify-between items-center">
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Registrado: {officer.createdAt}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAccountingOfficer(officer.id)}
                      className="h-7 w-7 text-rose-400 hover:bg-rose-500/10 rounded-full"
                      title="Eliminar usuario de contabilidad"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          /* TABLA DE PERSONAL DE CONTABILIDAD */
          <Card className="border-border bg-card shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50 font-bold uppercase text-[10px] text-muted-foreground">
                    <th className="p-3 w-44">Nombre Completo</th>
                    <th className="p-3 w-32">CI / DNI</th>
                    <th className="p-3">Correo Electrónico (Acceso)</th>
                    <th className="p-3 w-36">Cargo Financiero</th>
                    <th className="p-3 w-28">Sede</th>
                    <th className="p-3 w-28 text-center">Proyectos</th>
                    <th className="p-3 w-28 text-center">Estado</th>
                    <th className="p-3 text-center w-36">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredAccountingOfficers.map((officer) => (
                    <tr key={officer.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3 font-bold text-foreground">
                        {officer.name}
                      </td>
                      <td className="p-3 font-mono font-semibold text-muted-foreground">
                        {officer.ciNumber}
                      </td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">
                        {officer.email}
                      </td>
                      <td className="p-3 font-bold text-foreground">
                        {officer.cargo}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {officer.sede}
                      </td>
                      <td className="p-3 text-center font-bold text-emerald-500">
                        {officer.assignedProjectIds.length} Proyectos
                      </td>
                      <td className="p-3 text-center">
                        <Badge 
                          variant="outline"
                          className={`font-bold text-[10px] ${
                            officer.status === "Activo"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          {officer.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAssignProjectAccounting(officer)}
                            className="h-7 text-[10px] font-bold text-emerald-500 gap-1"
                          >
                            <FileText className="w-3 h-3" /> Proyectos
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleAccountingStatus(officer.id)}
                            className="h-7 w-7 text-amber-400 hover:bg-amber-500/10 rounded-full"
                          >
                            {officer.status === "Activo" ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAccountingOfficer(officer.id)}
                            className="h-7 w-7 text-rose-400 hover:bg-rose-500/10 rounded-full"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}
      </main>

      {/* MODAL: CREAR NUEVO COMITÉ */}
      {isNewCommitteeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> + Crear Nuevo Comité Evaluador
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsNewCommitteeOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Nombre del Comité *</label>
                <Input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Comité de Ética en Investigación Farmacéutica..."
                  className="text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Área de Conocimiento *</label>
                <Input
                  type="text"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  placeholder="Ej. Farmacología y Salud Pública"
                  className="text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Código del Comité (Opcional)</label>
                  <Input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="COM-FAR-1-2026"
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
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setIsNewCommitteeOpen(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleCreateCommittee} className="bg-primary hover:bg-primary/90 font-bold">
                Crear Comité
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR PERSONAL DE CONTABILIDAD (ROL CONTABILIDAD) */}
      {isNewAccountingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Calculator className="h-5 w-5 text-emerald-500" /> + Registrar Personal de Contabilidad y Finanzas
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsNewAccountingOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateAccountingOfficer} className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[11px] font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Este usuario tendrá credenciales de inicio de sesión habilitadas con el <strong>Rol Contabilidad</strong>.</span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Nombre Completo *</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    required
                    value={accName}
                    onChange={(e) => setAccName(e.target.value)}
                    placeholder="Ej. Lic. Marco Antonio Soliz"
                    className="pl-8 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Cédula de Identidad (CI)</label>
                  <Input
                    type="text"
                    value={accCi}
                    onChange={(e) => setAccCi(e.target.value)}
                    placeholder="3920194 CB"
                    className="text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Teléfono / WhatsApp</label>
                  <Input
                    type="text"
                    value={accPhone}
                    onChange={(e) => setAccPhone(e.target.value)}
                    placeholder="71239845"
                    className="text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Correo Electrónico (Usuario de Acceso) *</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    required
                    value={accEmail}
                    onChange={(e) => setAccEmail(e.target.value)}
                    placeholder="marco.soliz@unitepc.edu.bo"
                    className="pl-8 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Cargo Financiero</label>
                  <select
                    value={accCargo}
                    onChange={(e) => setAccCargo(e.target.value as any)}
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Analista Contable">Analista Contable</option>
                    <option value="Auditor Financiero">Auditor Financiero</option>
                    <option value="Jefe de Tesorería">Jefe de Tesorería</option>
                    <option value="Revisor Impositivo">Revisor Impositivo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Sede UNITEPC</label>
                  <select
                    value={accSede}
                    onChange={(e) => setAccSede(e.target.value)}
                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {sedesList.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsNewAccountingOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                  Registrar Personal Contable
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GESTIONAR MIEMBROS COMITÉ */}
      {memberManagementCommittee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-200 max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
              <div>
                <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary font-bold">
                  {memberManagementCommittee.code}
                </Badge>
                <h3 className="font-bold text-lg text-foreground mt-1 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Gestión de Miembros y Evaluadores: {memberManagementCommittee.name}
                </h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMemberManagementCommittee(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 pr-1">
              <form onSubmit={handleAddMemberFull} className="p-4 sm:p-5 rounded-xl bg-muted/30 border border-border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2">
                  <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <UserPlus className="h-4 w-4 text-primary" /> Registrar Nuevo Usuario Evaluador (Rol Comité)
                  </h4>
                  <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-400 font-bold text-[10px] w-fit">
                    ⚡ Acceso al Sistema Habilitado
                  </Badge>
                </div>

                <div className="flex items-center gap-2 p-1 bg-background border border-border rounded-lg w-fit">
                  <button
                    type="button"
                    onClick={() => setInvestigatorType("INTERNO")}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      investigatorType === "INTERNO"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    🏢 Evaluador Interno UNITEPC
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvestigatorType("EXTERNO")}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      investigatorType === "EXTERNO"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    🌐 Evaluador Externo Interinstitucional
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Nombre Completo *</label>
                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        required
                        value={memFullName}
                        onChange={(e) => setMemFullName(e.target.value)}
                        placeholder="Ej. Dr. Gustavo Alarcón Siles"
                        className="pl-8 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Cédula de Identidad (CI / DNI) *</label>
                    <div className="relative">
                      <IdCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={memCiNumber}
                        onChange={(e) => setMemCiNumber(e.target.value)}
                        placeholder="Ej. 4589123 CB"
                        className="pl-8 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Correo Electrónico (Usuario de Acceso) *</label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        required
                        value={memEmail}
                        onChange={(e) => setMemEmail(e.target.value)}
                        placeholder="gustavo.alarcon@unitepc.edu.bo"
                        className="pl-8 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Teléfono / WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={memPhone}
                        onChange={(e) => setMemPhone(e.target.value)}
                        placeholder="71728394"
                        className="pl-8 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {investigatorType === "INTERNO" ? (
                    <>
                      <div className="space-y-1">
                        <label className="font-bold text-foreground">Sede UNITEPC</label>
                        <select
                          value={memSede}
                          onChange={(e) => setMemSede(e.target.value)}
                          className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {sedesList.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-foreground">Facultad</label>
                        <select
                          value={memFacultad}
                          onChange={(e) => setMemFacultad(e.target.value)}
                          className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {facultadesList.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-bold text-foreground">Carrera / Unidad Académica</label>
                        <select
                          value={memCarrera}
                          onChange={(e) => setMemCarrera(e.target.value)}
                          className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {carrerasList.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-foreground">Institución de Origen / Universidad Externa</label>
                      <div className="relative">
                        <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          value={memInstitution}
                          onChange={(e) => setMemInstitution(e.target.value)}
                          placeholder="Ej. UMSA / UAGRM / Instituto de Genética"
                          className="pl-8 text-xs font-semibold"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Grado Académico / Especialidad</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={memDegree}
                        onChange={(e) => setMemDegree(e.target.value)}
                        placeholder="Ej. Ph.D. en Ciencias de la Computación"
                        className="pl-8 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Rol en Comité</label>
                    <select
                      value={memRole}
                      onChange={(e) => setMemRole(e.target.value as any)}
                      className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Presidente">Presidente</option>
                      <option value="Secretario Técnico">Secretario Técnico</option>
                      <option value="Evaluador Par">Evaluador Par</option>
                      <option value="Vocal">Vocal</option>
                    </select>
                  </div>

                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow">
                    <UserPlus className="h-4 w-4" /> Registrar Evaluador en Comité (Rol Comité)
                  </Button>
                </div>
              </form>

              <div className="space-y-2">
                <h4 className="font-bold text-xs text-foreground">
                  Personal Actual del Comité ({memberManagementCommittee.members.length} Evaluadores Registrados):
                </h4>

                {memberManagementCommittee.members.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic p-4 text-center border border-dashed border-border rounded-lg">
                    No hay miembros asignados a este comité en la gestión {memberManagementCommittee.gestion}.
                  </p>
                ) : (
                  memberManagementCommittee.members.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                        m.status === "Activo"
                          ? "bg-card border-border"
                          : "bg-muted/40 border-dashed border-border/80 opacity-70"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm">{m.name}</span>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-bold text-[10px]">
                            {m.role}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 font-bold text-[10px]">
                            Acceso: Rol Comité
                          </Badge>
                          {m.status === "Deshabilitado" && (
                            <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold text-[10px]">
                              Deshabilitado
                            </Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground block text-xs">
                          📧 {m.email} | CI: {m.ciNumber || "SN"} | {m.degree} - {m.institution}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleMemberStatus(m.id)}
                          className={`h-7 px-2 text-[10px] font-bold gap-1 ${
                            m.status === "Activo"
                              ? "border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                              : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                        >
                          {m.status === "Activo" ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                          <span>{m.status === "Activo" ? "Deshabilitar" : "Habilitar"}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(m.id)}
                          className="h-7 w-7 text-rose-400 hover:bg-rose-500/10 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-border shrink-0">
              <Button size="sm" variant="outline" onClick={() => setMemberManagementCommittee(null)} className="font-bold">
                Cerrar Gestión de Miembros
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ASIGNAR PROYECTOS AL COMITÉ */}
      {assignProjectCommittee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
              <div>
                <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary font-bold">
                  {assignProjectCommittee.code}
                </Badge>
                <h3 className="font-bold text-lg text-foreground mt-1 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Asignar Proyectos para Arbitraje: {assignProjectCommittee.name}
                </h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAssignProjectCommittee(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <p className="text-xs text-muted-foreground mb-3">
                Seleccione las propuestas o proyectos que serán evaluados y arbitrados por este comité en la gestión {assignProjectCommittee.gestion}:
              </p>

              {projectsList.map((p) => {
                const isAssigned = assignProjectCommittee.assignedProjectIds.includes(p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => handleToggleProjectAssignment(p.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isAssigned
                        ? "bg-primary/10 border-primary/50 text-foreground"
                        : "bg-card border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary text-xs">{p.code}</span>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {p.status}
                        </Badge>
                      </div>
                      <span className="font-bold text-foreground text-xs block">{p.title}</span>
                      <span className="text-[11px] text-muted-foreground block">Investigador: {p.leadInvestigator}</span>
                    </div>

                    <div className={`p-1.5 rounded-full border ${isAssigned ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>
                      <Check className={`h-4 w-4 ${isAssigned ? "opacity-100" : "opacity-0"}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-border shrink-0">
              <Button size="sm" onClick={() => setAssignProjectCommittee(null)} className="bg-primary hover:bg-primary/90 font-bold">
                Guardar Asignaciones
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ASIGNAR PROYECTOS A PERSONAL DE CONTABILIDAD */}
      {assignProjectAccounting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
              <div>
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold">
                  {assignProjectAccounting.cargo}
                </Badge>
                <h3 className="font-bold text-lg text-foreground mt-1 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-emerald-500" />
                  Asignar Proyectos para Auditoría Presupuestaria: {assignProjectAccounting.name}
                </h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAssignProjectAccounting(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <p className="text-xs text-muted-foreground mb-3">
                Seleccione las propuestas o proyectos que serán fiscalizados y verificados por {assignProjectAccounting.name} para desembolsos y retenciones:
              </p>

              {projectsList.map((p) => {
                const isAssigned = assignProjectAccounting.assignedProjectIds.includes(p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => handleToggleProjectAccountingAssignment(p.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isAssigned
                        ? "bg-emerald-500/10 border-emerald-500/50 text-foreground"
                        : "bg-card border-border hover:border-emerald-500/30"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-500 text-xs">{p.code}</span>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {p.status}
                        </Badge>
                      </div>
                      <span className="font-bold text-foreground text-xs block">{p.title}</span>
                      <span className="text-[11px] text-muted-foreground block">
                        Presupuesto: <strong className="text-foreground">Bs. {(p.requestedBudget || 0).toLocaleString()}</strong>
                      </span>
                    </div>

                    <div className={`p-1.5 rounded-full border ${isAssigned ? "bg-emerald-600 text-white border-emerald-600" : "border-border"}`}>
                      <Check className={`h-4 w-4 ${isAssigned ? "opacity-100" : "opacity-0"}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-border shrink-0">
              <Button size="sm" onClick={() => setAssignProjectAccounting(null)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                Guardar Asignaciones Contables
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
