"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Network, CheckCircle2, Clock, AlertTriangle, PlayCircle, BarChart3, 
  FileCheck, Calculator, UserCheck, ChevronRight, Sparkles, Building2
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
    activePhase: "Fase 3: Transferencia Técnica y Cierre de Proyecto",
    nextMilestone: "Aprobación de Informe Final DICYT y Finiquito Institucional",
    status: "Concluido",
  },
  {
    id: "exec-3",
    code: "SIGPRI-2026-004",
    title: "Monitoreo Satelital de Deforestación en la Cuenca Amazónica Boliviana con Redes Neuronales",
    leadInvestigator: "Ing. Gonzalo Flores Medina",
    facultyArea: "Ingeniería y Ciencias de la Tierra",
    wbsProgress: 35,
    approvedBudget: 85000,
    disbursedAmount: 29750,
    activePhase: "Fase 1: Adquisición de Licencias e Imágenes de Alta Resolución",
    nextMilestone: "Validación de Código por Comité Científico",
    status: "En Ejecución",
  }
];

export default function ExecutionsPage() {
  const [projects] = useState<ExecutionProject[]>(EXECUTION_PROJECTS);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-10">
      <Header 
        title="Ejecuciones & Seguimiento WBS" 
        description="Fiscalización técnica de proyectos aprobados en ejecución, hitos de avance y desembolsos ejecutados." 
      />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 w-full">
        {/* BANNER PRINCIPAL */}
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

              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="font-bold text-xs">
                  {projects.length} Proyectos en Seguimiento
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* LISTADO DE PROYECTOS EN EJECUCIÓN */}
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
                      {p.status === 'Concluido' ? '🏁 Concluido' : '🚀 3. En Ejecución'}
                    </Badge>
                  </div>

                  <div className="pt-2">
                    <CardTitle className="text-lg font-bold">{p.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Investigador Principal: <strong className="text-primary">{p.leadInvestigator}</strong>
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 text-xs">
                  {/* BARRA DE PROGRESO WBS */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-foreground">Avance Físico del Cronograma (WBS):</span>
                      <span className="text-emerald-400 font-mono text-sm">{p.wbsProgress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${p.wbsProgress}%` }}></div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Fase Activa: <strong className="text-foreground">{p.activePhase}</strong>
                    </p>
                  </div>

                  {/* HITOS Y PRESUPUESTO EJECUTADO */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-muted/40 border border-border">
                      <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Presupuesto Aprobado</span>
                      <span className="font-bold text-foreground text-sm">Bs. {p.approvedBudget.toLocaleString('es-BO')}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <span className="text-primary text-[10px] uppercase font-bold block mb-1">Monto Desembolsado</span>
                      <span className="font-bold text-primary text-sm">Bs. {p.disbursedAmount.toLocaleString('es-BO')}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/20">
                      <span className="text-teal-400 text-[10px] uppercase font-bold block mb-1">Retenciones Ley 843</span>
                      <span className="font-bold text-teal-400 text-sm">Bs. {tax.totalRetention.toLocaleString('es-BO')}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-between">
                    <span className="font-semibold text-[11px]">Próximo Hito: {p.nextMilestone}</span>
                    <Badge variant="outline" className="border-amber-500/40 text-amber-400 font-bold text-[10px]">
                      En Calendario
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
