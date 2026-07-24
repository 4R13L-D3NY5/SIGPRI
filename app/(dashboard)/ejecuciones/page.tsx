"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Network, CheckCircle2, Clock, AlertTriangle, PlayCircle, BarChart3, 
  FileCheck, Calculator, UserCheck, ChevronRight, Sparkles, Building2,
  LayoutGrid, Table as TableIcon
} from "lucide-react";
import Link from "next/link";
import { calculateLey843Tax } from "@/lib/sigpri-data";

interface ExecutionProject {
  id: string;
  code: string;
  title: string;
  leadInvestigator: string;
  facultyArea: string;
  wbsProgress: number;
  approvedBudget: number;
  disbursedAmount: number;
  activePhase: string;
  nextMilestone: string;
  status: 'En Ejecución' | 'En Observación' | 'Concluido';
}

const EXECUTION_PROJECTS: ExecutionProject[] = [
  {
    id: "exec-1",
    code: "SIGPRI-2026-001",
    title: "Modelado Epidemiológico y Telemedicina Asistida por IA en Zonas Rurales de Bolivia",
    leadInvestigator: "Dra. Maria Lorena Orellana Aguilar",
    facultyArea: "Ciencias de la Salud & Telemedicina",
    wbsProgress: 65,
    approvedBudget: 60000,
    disbursedAmount: 39000,
    activePhase: "Fase 2: Trabajo de Campo y Recolección de Datos Biométricos",
    nextMilestone: "Entrega de Segundo Informe Parcial de Avance (15 de Agosto 2026)",
    status: "En Ejecución",
  },
  {
    id: "exec-2",
    code: "SIGPRI-2025-008",
    title: "Implementación de Biomateriales Odontológicos a Base de Nano-Hidroxiapatita Sintetizada",
    leadInvestigator: "Dr. Roberto Vargas Machuca",
    facultyArea: "Odontología & Biomateriales",
    wbsProgress: 100,
    approvedBudget: 70000,
    disbursedAmount: 70000,
    activePhase: "Fase 4: Cierre de Proyecto y Transferencia de Tecnología",
    nextMilestone: "Publicación de Resultados Indexados (Concluido)",
    status: "Concluido",
  },
];

export default function ExecutionsPage() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [projects] = useState<ExecutionProject[]>(EXECUTION_PROJECTS);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-10">
      <Header 
        title="Seguimiento de Ejecuciones Institucionales" 
        description="Monitoreo de cronogramas, hitos de investigación y avance físico-financiero de proyectos aprobados." 
      />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 w-full">
        {/* BANNER PRINCIPAL CON TOGGLE TARJETAS/TABLA */}
        <Card className="border-primary/20 bg-card text-card-foreground shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-primary/40 text-primary font-bold">
                    Módulo de Ejecuciones WBS
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">Gestión Universitaria 2026</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Network className="h-6 w-6 text-primary" />
                  <span>Seguimiento de Ejecuciones Institucionales</span>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Monitoreo de cronogramas, hitos de investigación y avance físico-financiero de proyectos aprobados.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
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

                <Badge variant="secondary" className="font-bold text-xs">
                  {projects.length} Proyectos en Seguimiento
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* LISTADO DE PROYECTOS EN EJECUCIÓN (TARJETAS VS TABLA) */}
        {viewMode === "cards" ? (
          <div className="space-y-4">
            {projects.map((p) => {
              const tax = calculateLey843Tax(p.approvedBudget, 'servicios', 'bruto');

              return (
                <Card key={p.id} className="border-border bg-card text-card-foreground shadow-sm hover:border-primary/40 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="font-mono font-bold border-primary/40 text-primary bg-primary/10">
                          {p.code}
                        </Badge>
                        <span className="text-xs font-bold text-foreground">{p.facultyArea}</span>
                      </div>

                      <Badge 
                        variant="outline" 
                        className={`font-bold text-xs ${
                          p.status === 'Concluido'
                            ? 'border-purple-500/40 text-purple-400 bg-purple-500/10'
                            : 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                        }`}
                      >
                        {p.status === 'Concluido' ? '🏁 Concluido' : '🚀 En Ejecución'}
                      </Badge>
                    </div>

                    <div className="pt-2">
                      <CardTitle className="text-lg font-bold">{p.title}</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-1">
                        Investigador Responsable: <span className="font-semibold text-foreground">{p.leadInvestigator}</span>
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* AVANCE WBS */}
                      <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground font-semibold">Avance WBS:</span>
                          <span className="font-mono font-bold text-primary">{p.wbsProgress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border">
                          <div 
                            className="bg-primary h-full transition-all duration-300" 
                            style={{ width: `${p.wbsProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* PRESUPUESTO Y DESEMBOLSO */}
                      <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Presupuesto Aprobado:</span>
                          <span className="font-mono font-bold text-foreground">Bs. {p.approvedBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monto Desembolsado:</span>
                          <span className="font-mono font-bold text-emerald-400">Bs. {p.disbursedAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* FASE ACTUAL */}
                      <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1 text-xs">
                        <span className="text-muted-foreground font-semibold block">Fase Activa:</span>
                        <span className="font-bold text-foreground line-clamp-1">{p.activePhase}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 border-t border-border/50 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <span className="text-muted-foreground">
                      📍 Próximo Hito: <strong className="text-foreground">{p.nextMilestone}</strong>
                    </span>

                    <Link href="/directorio">
                      <Button variant="outline" size="sm" className="font-bold text-xs gap-1">
                        Ir al Directorio Unificado <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          /* TABLA DE EJECUCIONES */
          <Card className="border-border bg-card shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50 font-bold uppercase text-[10px] text-muted-foreground">
                    <th className="p-3 w-32">Código</th>
                    <th className="p-3">Título del Proyecto</th>
                    <th className="p-3 w-40">Investigador</th>
                    <th className="p-3 w-28 text-center">Avance WBS</th>
                    <th className="p-3 w-36">Presupuesto Aprobado</th>
                    <th className="p-3 w-36">Desembolsado</th>
                    <th className="p-3 w-32">Estado</th>
                    <th className="p-3 text-center w-28">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">
                        {p.code}
                      </td>
                      <td className="p-3 font-bold text-foreground">
                        <div className="space-y-0.5">
                          <span className="line-clamp-1">{p.title}</span>
                          <span className="text-[10px] text-muted-foreground font-normal block">{p.activePhase}</span>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {p.leadInvestigator}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-primary">
                        {p.wbsProgress}%
                      </td>
                      <td className="p-3 font-mono font-bold text-foreground">
                        Bs. {p.approvedBudget.toLocaleString()}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        Bs. {p.disbursedAmount.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <Badge 
                          variant="outline" 
                          className={`font-bold text-[10px] ${
                            p.status === 'Concluido'
                              ? 'border-purple-500/40 text-purple-400 bg-purple-500/10'
                              : 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                          }`}
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Link href="/directorio">
                          <Button variant="outline" size="sm" className="h-7 px-2 text-[10px] font-bold gap-1">
                            Ver <ChevronRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
