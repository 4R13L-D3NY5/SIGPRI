"use client";

import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileCheck,
  FilePlus,
  FileText,
  Filter,
  Layers,
  Plus,
  Search,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Campaign {
  id: string;
  code: string;
  title: string;
  category: string;
  fundingSource: string;
  maxBudgetPerProject: number;
  totalBudget: number;
  startDate: string;
  endDate: string;
  status: "Abierta" | "En Evaluación" | "Cerrada" | "Próxima";
  proposalsCount: number;
  description: string;
}

const initialCampaigns: Campaign[] = [
  {
    id: "1",
    code: "CONV-2026-01",
    title: "Convocatoria IDi 2026 - Investigación Científica e Innovación Tecnológica",
    category: "Proyectos de Investigación Aplicada",
    fundingSource: "Fondos Ley 843 e IDH",
    maxBudgetPerProject: 250000,
    totalBudget: 3500000,
    startDate: "2026-01-15",
    endDate: "2026-08-31",
    status: "Abierta",
    proposalsCount: 42,
    description: "Financiamiento no reembolsable para docentes e investigadores de la universidad en áreas estratégicas del desarrollo nacional.",
  },
  {
    id: "2",
    code: "CONV-2026-02",
    title: "Fondo Concursable Ley 843 para Biotecnología y Recursos Naturales",
    category: "Biotecnología & Medio Ambiente",
    fundingSource: "Retenciones Ley 843 DICYT",
    maxBudgetPerProject: 180000,
    totalBudget: 1800000,
    startDate: "2026-02-01",
    endDate: "2026-09-15",
    status: "Abierta",
    proposalsCount: 28,
    description: "Convocatoria orientada al aprovechamiento sostenible de la biodiversidad, energías renovables y economía circular.",
  },
  {
    id: "3",
    code: "CONV-2025-04",
    title: "Programa de Becas y Semilleros de Investigación de Posgrado",
    category: "Formación de Investigadores",
    fundingSource: "Fondos Propios DICYT",
    maxBudgetPerProject: 60000,
    totalBudget: 900000,
    startDate: "2025-09-01",
    endDate: "2026-04-30",
    status: "En Evaluación",
    proposalsCount: 65,
    description: "Incentivo a tesis maestría y doctorado con impacto directo en problemas sociales e industriales de Bolivia.",
  },
  {
    id: "4",
    code: "CONV-2025-03",
    title: "Convocatoria Extraordinaria de Salud Pública y Enfermedades Tropìcales",
    category: "Salud & Biomedicina",
    fundingSource: "Convenio Interinstitucional",
    maxBudgetPerProject: 300000,
    totalBudget: 2400000,
    startDate: "2025-03-01",
    endDate: "2025-11-30",
    status: "Cerrada",
    proposalsCount: 38,
    description: "Convocatoria finalizada para el fortalecimiento del laboratorio de virología y epidemiología molecular.",
  },
  {
    id: "5",
    code: "CONV-2027-01",
    title: "Fondo de Transferencia Tecnológica para la Industria 4.0",
    category: "Innovación & Robótica",
    fundingSource: "Ley 843 Gestión 2027",
    maxBudgetPerProject: 400000,
    totalBudget: 5000000,
    startDate: "2027-01-10",
    endDate: "2027-07-31",
    status: "Próxima",
    proposalsCount: 0,
    description: "Fondo futuro para prototipos industriales y patentes con empresas del sector productivo nacional.",
  },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODAS");
  const [showModal, setShowModal] = useState(false);

  // Form State for new Call
  const [newTitle, setNewTitle] = useState("");
  const [newCode, setNewCode] = useState(`CONV-2026-0${campaigns.length + 1}`);
  const [newCategory, setNewCategory] = useState("Investigación Aplicada");
  const [newFunding, setNewFunding] = useState("Fondos Ley 843");
  const [newMaxBudget, setNewMaxBudget] = useState(200000);
  const [newTotalBudget, setNewTotalBudget] = useState(2000000);
  const [newEndDate, setNewEndDate] = useState("2026-12-31");
  const [newDescription, setNewDescription] = useState("");

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Campaign = {
      id: Date.now().toString(),
      code: newCode,
      title: newTitle,
      category: newCategory,
      fundingSource: newFunding,
      maxBudgetPerProject: Number(newMaxBudget),
      totalBudget: Number(newTotalBudget),
      startDate: new Date().toISOString().split("T")[0],
      endDate: newEndDate,
      status: "Abierta",
      proposalsCount: 0,
      description: newDescription || "Nueva convocatoria abierta para postulación de proyectos DICYT.",
    };

    setCampaigns([created, ...campaigns]);
    setShowModal(false);
    // Reset form
    setNewTitle("");
    setNewDescription("");
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "TODAS" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Campaign["status"]) => {
    switch (status) {
      case "Abierta":
        return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">Abierta para Postulación</Badge>;
      case "En Evaluación":
        return <Badge className="bg-purple-500/15 text-purple-600 border-purple-500/30">En Evaluación por Comité</Badge>;
      case "Cerrada":
        return <Badge className="bg-slate-500/15 text-slate-600 border-slate-500/30">Convocatoria Cerrada</Badge>;
      case "Próxima":
        return <Badge className="bg-blue-500/15 text-blue-600 border-blue-500/30">Próximo Lanzamiento</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      <Header
        title="Gestión de Convocatorias DICYT"
        description="Publicación, administración y recepción de propuestas para fondos de investigación Ley 843"
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Banner + Nueva Convocatoria Button */}
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Convocatorias de Investigación Científica</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Administre las fechas de cierre, techos presupuestarios por proyecto y fuentes de financiamiento.
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2 shadow">
            <Plus className="h-4 w-4" /> Nueva Convocatoria
          </Button>
        </div>

        {/* Buscador y Filtros */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar convocatoria por nombre o código..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {["TODAS", "Abierta", "En Evaluación", "Cerrada", "Próxima"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-primary text-primary-foreground border-primary font-semibold"
                    : "bg-card text-muted-foreground hover:bg-accent border-border"
                }`}
              >
                {st === "TODAS" ? "Todas" : st}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Convocatorias */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredCampaigns.map((c) => (
            <Card key={c.id} className="flex flex-col justify-between hover:shadow-md transition-all border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {c.code}
                  </Badge>
                  {getStatusBadge(c.status)}
                </div>
                <CardTitle className="text-base font-bold leading-snug mt-2 text-foreground">
                  {c.title}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground line-clamp-2">
                  {c.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-xs pb-3">
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-3 border">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Fuente Financiamiento</span>
                    <span className="font-medium text-foreground truncate block">{c.fundingSource}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Categoría</span>
                    <span className="font-medium text-foreground truncate block">{c.category}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Techo p/ Proyecto</span>
                    <span className="font-mono font-bold text-emerald-600">
                      Bs. {c.maxBudgetPerProject.toLocaleString("es-BO")}
                    </span>
                  </div>
                  <div className="pt-1">
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Presupuesto Fondo</span>
                    <span className="font-mono font-bold text-foreground">
                      Bs. {c.totalBudget.toLocaleString("es-BO")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Cierre: <strong className="text-foreground">{c.endDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span>Postulaciones: <strong className="text-foreground">{c.proposalsCount}</strong></span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-3 flex items-center justify-between">
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <FileText className="h-3.5 w-3.5" /> Ver Bases PDF
                </Button>
                <Button size="sm" className="text-xs gap-1" disabled={c.status !== "Abierta"}>
                  {c.status === "Abierta" ? "Postular Proyecto" : "Convocatoria Cerrada"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Modal Nueva Convocatoria */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Nueva Convocatoria DICYT</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-accent"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Título de la Convocatoria</label>
                  <Input
                    required
                    placeholder="Ej. Convocatoria Proyectos IDi 2026"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Código Identificador</label>
                    <Input value={newCode} onChange={(e) => setNewCode(e.target.value)} />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Categoría</label>
                    <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Techo p/ Proyecto (BOB)</label>
                    <Input
                      type="number"
                      value={newMaxBudget}
                      onChange={(e) => setNewMaxBudget(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Fondo Total (BOB)</label>
                    <Input
                      type="number"
                      value={newTotalBudget}
                      onChange={(e) => setNewTotalBudget(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Fuente Financiamiento</label>
                    <Input value={newFunding} onChange={(e) => setNewFunding(e.target.value)} />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Fecha de Cierre</label>
                    <Input
                      type="date"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Descripción / Objetivos</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border bg-background p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Resumen del alcance y requisitos..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Crear Convocatoria
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
