"use client";

import {
  ArrowUpRight,
  Award,
  BookOpen,
  Building2,
  Calculator,
  CheckCircle2,
  Clock,
  FileCheck,
  FileSpreadsheet,
  FolderGit2,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Data for Activity Trend Chart
const activityTrendData = [
  { mes: "Ene", postulados: 12, evaluados: 8, aprobados: 5, presupuesto: 420 },
  { mes: "Feb", postulados: 19, evaluados: 14, aprobados: 9, presupuesto: 680 },
  { mes: "Mar", postulados: 25, evaluados: 18, aprobados: 14, presupuesto: 950 },
  { mes: "Abr", postulados: 32, evaluados: 26, aprobados: 20, presupuesto: 1240 },
  { mes: "May", postulados: 28, evaluados: 24, aprobados: 18, presupuesto: 1100 },
  { mes: "Jun", postulados: 45, evaluados: 35, aprobados: 28, presupuesto: 1850 },
  { mes: "Jul", postulados: 50, evaluados: 42, aprobados: 34, presupuesto: 2210 },
];

const recentProjects = [
  {
    code: "INV-2026-089",
    title: "Síntesis de Nanopartículas con Extractos Vegetales de la Amazonía",
    researcher: "Dr. Marcelo Vargas",
    faculty: "Ciencias Puras y Naturales",
    status: "En Evaluación",
    budget: "Bs. 120,000",
    date: "Hace 2 horas",
  },
  {
    code: "INV-2026-077",
    title: "Optimización Algorítmica para Redes de Distribución Eléctrica Rural",
    researcher: "Dra. Elena Quispe",
    faculty: "Ingeniería",
    status: "Aprobado",
    budget: "Bs. 250,000",
    date: "Hace 5 horas",
  },
  {
    code: "INV-2026-064",
    title: "Impacto Socioeconómico del Turismo Sostenible en el Lago Titicaca",
    researcher: "MSc. Javier Condori",
    faculty: "Ciencias Sociales",
    status: "En Ejecución",
    budget: "Bs. 95,000",
    date: "Ayer",
  },
  {
    code: "INV-2026-052",
    title: "Estudio Epidemiológico de Enfermedades Zoonóticas en el Altiplano",
    researcher: "Dra. Sofía Mendoza",
    faculty: "Medicina",
    status: "En Evaluación",
    budget: "Bs. 310,000",
    date: "Hace 2 días",
  },
];

export default function DashboardPage() {
  // Animated counters state
  const [counts, setCounts] = useState({
    proyectos: 0,
    presupuesto: 0,
    convocatorias: 0,
    evaluaciones: 0,
  });

  useEffect(() => {
    const duration = 1200; // ms
    const steps = 30;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        proyectos: Math.floor(142 * progress),
        presupuesto: Math.floor(8450000 * progress),
        convocatorias: Math.floor(12 * progress),
        evaluaciones: Math.floor(28 * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts({
          proyectos: 142,
          presupuesto: 8450000,
          convocatorias: 12,
          evaluaciones: 28,
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-10">
      <Header
        title="Resumen General SIGPRI UNITEPC"
        description="Sistema de Gestión de Proyectos e Investigaciones UNITEPC — Monitoreo Integral"
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Banner Informativo */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/40 text-primary font-bold">
                  Gestión 2026-2027
                </Badge>
                <span className="text-xs text-muted-foreground">Última actualización: Hoy, 12:00</span>
              </div>
              <h2 className="font-bold text-xl tracking-tight">
                Sistema de Gestión de Proyectos e Investigaciones (SIGPRI)
              </h2>
              <p className="text-muted-foreground text-sm max-w-2xl">
                Plataforma centralizada para la administración de convocatorias, comités evaluadores y fiscalización presupuestaria y retenciones.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button asChild size="sm" className="gap-1.5 shadow">
                <Link href="/directorio">
                  <FolderGit2 className="h-4 w-4" />
                  Ver Proyectos
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <Link href="/comites">
                  <Calculator className="h-4 w-4" />
                  Comités y Contabilidad
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 4 KPIs Animados */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* KPI 1 */}
          <Card className="relative overflow-hidden transition-all hover:shadow-md border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Proyectos SIGPRI
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <FolderGit2 className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight text-foreground">
                {counts.proyectos}
              </div>
              <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
                <TrendingUp className="mr-1 h-3.5 w-3.5" />
                <span>+18.5% esta gestión</span>
                <span className="ml-auto text-muted-foreground font-normal">2025-2027</span>
              </div>
            </CardContent>
          </Card>

          {/* KPI 2 */}
          <Card className="relative overflow-hidden transition-all hover:shadow-md border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Presupuesto Ejecutado
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Calculator className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight text-foreground">
                Bs. {counts.presupuesto.toLocaleString("es-BO")}
              </div>
              <div className="mt-2 flex items-center text-xs text-emerald-600 font-medium">
                <TrendingUp className="mr-1 h-3.5 w-3.5" />
                <span>+12.4% vs 2025</span>
                <span className="ml-auto text-muted-foreground font-normal">Retenciones</span>
              </div>
            </CardContent>
          </Card>

          {/* KPI 3 */}
          <Card className="relative overflow-hidden transition-all hover:shadow-md border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Convocatorias Activas
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <Award className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight text-foreground">
                {counts.convocatorias}
              </div>
              <div className="mt-2 flex items-center text-xs text-amber-600 font-medium">
                <Clock className="mr-1 h-3.5 w-3.5" />
                <span>4 convocatorias por cerrar</span>
              </div>
            </CardContent>
          </Card>

          {/* KPI 4 */}
          <Card className="relative overflow-hidden transition-all hover:shadow-md border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Evaluaciones Pendientes
              </CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                <FileCheck className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold tracking-tight text-foreground">
                {counts.evaluaciones}
              </div>
              <div className="mt-2 flex items-center text-xs text-purple-600 font-medium">
                <Users className="mr-1 h-3.5 w-3.5" />
                <span>15 evaluadores pares en sesión</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfica Activity Trend + Resumen Estadístico */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Gráfica Activity trend */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  Activity Trend - Tendencia de Proyectos y Ejecución
                </CardTitle>
                <CardDescription className="text-xs">
                  Evolución mensual de postulaciones, evaluaciones y aprobación de fondos SIGPRI
                </CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1 text-xs">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Tiempo Real
              </Badge>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPostulados" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorEvaluados" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorAprobados" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                    <XAxis dataKey="mes" tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
                    <YAxis tickLine={false} axisLine={false} className="text-xs fill-muted-foreground" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg text-xs space-y-1">
                              <p className="font-semibold text-sm border-b pb-1 mb-1">{label} 2026</p>
                              {payload.map((entry: any) => (
                                <div key={entry.name} className="flex items-center justify-between gap-4">
                                  <span style={{ color: entry.color }} className="font-medium">
                                    {entry.name}:
                                  </span>
                                  <span className="font-bold">{entry.value}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="postulados"
                      name="Postulados"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorPostulados)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="evaluados"
                      name="Evaluados"
                      stroke="#a855f7"
                      fillOpacity={1}
                      fill="url(#colorEvaluados)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="aprobados"
                      name="Aprobados"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorAprobados)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Leyenda de la gráfica */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground border-t pt-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span>Proyectos Postulados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                  <span>Proyectos Evaluados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span>Proyectos Aprobados</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Distribución por Áreas / Estadísticas Rápidas */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Distribución por Áreas</CardTitle>
              <CardDescription className="text-xs">Proyectos vigentes según facultad/área</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Ingeniería y Tecnología</span>
                  <span className="text-muted-foreground">38% (54 proy.)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "38%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Ciencias Puras y Naturales</span>
                  <span className="text-muted-foreground">27% (38 proy.)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "27%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Ciencias de la Salud</span>
                  <span className="text-muted-foreground">19% (27 proy.)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "19%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Ciencias Agrícolas y Pecuarias</span>
                  <span className="text-muted-foreground">11% (15 proy.)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "11%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Ciencias Sociales y Humanidades</span>
                  <span className="text-muted-foreground">5% (8 proy.)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: "5%" }} />
                </div>
              </div>

              <div className="pt-3 border-t">
                <Button asChild variant="outline" className="w-full text-xs gap-1">
                  <Link href="/projects">
                    Ver Directorio Completo
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Proyectos Recientes */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Últimos Proyectos Registrados</CardTitle>
              <CardDescription className="text-xs">Ingresos recientes a la plataforma de Investigación UNITEPC</CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost" className="gap-1 text-xs">
              <Link href="/projects">
                Ver todos <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border rounded-md border">
              {recentProjects.map((project) => (
                <div key={project.code} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {project.code}
                      </Badge>
                      <Badge
                        className={
                          project.status === "Aprobado"
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/30"
                            : project.status === "En Ejecución"
                            ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/30"
                            : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/30"
                        }
                      >
                        {project.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{project.date}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-foreground">{project.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Investigador: <span className="text-foreground font-medium">{project.researcher}</span> &bull; {project.faculty}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0">
                    <div className="text-right">
                      <span className="block text-xs text-muted-foreground">Presupuesto</span>
                      <span className="font-mono font-semibold text-sm">{project.budget}</span>
                    </div>
                    <Button asChild size="sm" variant="outline" className="h-8">
                      <Link href="/projects">Ficha</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
