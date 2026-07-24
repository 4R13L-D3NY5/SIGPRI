"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateLey843Tax } from "@/lib/sigpri-data";
import { 
  FileText, Calendar, Calculator, Plus, Trash2, CheckCircle2, 
  Send, Save, ArrowLeft, Building2, User, Sparkles, Clock, AlertTriangle, ChevronRight, DollarSign
} from "lucide-react";
import Link from "next/link";

// Interfaces para Cronograma y Presupuesto
interface WbsItem {
  id: string;
  phase: string;
  taskName: string;
  durationMonths: number;
  startDate: string;
  endDate: string;
  responsible: string;
}

interface BudgetItem {
  id: string;
  category: 'servicios' | 'bienes' | 'alquileres';
  itemDescription: string;
  quantity: number;
  unitPrice: number;
}

export default function ProposalSubmissionPage() {
  const [activeTab, setActiveTab] = useState<'datos' | 'cronograma' | 'presupuesto'>('datos');
  const [submitted, setSubmitted] = useState(false);

  // 1. DATOS GENERALES DE LA PROPUESTA
  const [proposalData, setProposalData] = useState({
    title: "",
    investigator: "Dra. Maria Lorena Orellana Aguilar",
    email: "lorena.orellana@unitepc.edu.bo",
    faculty: "Ciencias de la Salud",
    line: "Epidemiología, Salud Pública y Telemedicina",
    academicPeriod: "2026",
    abstract: "",
    generalObjective: "",
    specificObjectives: "",
    justification: "",
  });

  // 2. GESTIÓN DE CRONOGRAMA DE TRABAJO (WBS)
  const [scheduleItems, setScheduleItems] = useState<WbsItem[]>([
    {
      id: "wbs-1",
      phase: "Fase 1: Revisión Bibliográfica y Diseño",
      taskName: "Revisión sistemática de literatura y aprobación del protocolo de Bioética",
      durationMonths: 2,
      startDate: "2026-03-01",
      endDate: "2026-04-30",
      responsible: "Dra. Maria Lorena Orellana A.",
    },
    {
      id: "wbs-2",
      phase: "Fase 2: Trabajo de Campo y Toma de Muestras",
      taskName: "Despliegue de sensores de telemedicina y recolección de datos en campo",
      durationMonths: 4,
      startDate: "2026-05-01",
      endDate: "2026-08-31",
      responsible: "Equipo de Auxiliares de Investigación",
    },
    {
      id: "wbs-3",
      phase: "Fase 3: Análisis y Redacción Final",
      taskName: "Procesamiento de datos con IA, redacción del Informe Final y artículo indexado",
      durationMonths: 3,
      startDate: "2026-09-01",
      endDate: "2026-11-30",
      responsible: "Dra. Maria Lorena Orellana A.",
    }
  ]);

  const [newSchedule, setNewSchedule] = useState<Omit<WbsItem, 'id'>>({
    phase: "Fase 1: Preparación",
    taskName: "",
    durationMonths: 1,
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    responsible: "Investigador Principal",
  });

  const handleAddScheduleItem = () => {
    if (!newSchedule.taskName.trim()) {
      alert("Por favor ingresa el nombre de la tarea del cronograma.");
      return;
    }
    const item: WbsItem = {
      ...newSchedule,
      id: `wbs-${Date.now()}`
    };
    setScheduleItems(prev => [...prev, item]);
    setNewSchedule({
      phase: "Fase 1: Preparación",
      taskName: "",
      durationMonths: 1,
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      responsible: "Investigador Principal",
    });
  };

  const handleDeleteScheduleItem = (id: string) => {
    setScheduleItems(prev => prev.filter(item => item.id !== id));
  };

  // 3. GESTIÓN DE PRESUPUESTO DE LA PROPUESTA (LEY 843)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: "b-1",
      category: "servicios",
      itemDescription: "Honorarios de Consultoría Especializada en Algoritmos de Aprendizaje Profundo",
      quantity: 1,
      unitPrice: 25000,
    },
    {
      id: "b-2",
      category: "bienes",
      itemDescription: "Adquisición de Servidor GPU y Kits de Sensores Biométricos de Campo",
      quantity: 2,
      unitPrice: 15000,
    },
    {
      id: "b-3",
      category: "alquileres",
      itemDescription: "Alquiler de Vehículo 4x4 para Transporte de Muestras en Zonas Rurales",
      quantity: 1,
      unitPrice: 10000,
    }
  ]);

  const [newBudgetItem, setNewBudgetItem] = useState<Omit<BudgetItem, 'id'>>({
    category: "servicios",
    itemDescription: "",
    quantity: 1,
    unitPrice: 5000,
  });

  const handleAddBudgetItem = () => {
    if (!newBudgetItem.itemDescription.trim() || newBudgetItem.unitPrice <= 0) {
      alert("Por favor especifica la descripción y un precio unitario válido.");
      return;
    }
    const item: BudgetItem = {
      ...newBudgetItem,
      id: `b-${Date.now()}`
    };
    setBudgetItems(prev => [...prev, item]);
    setNewBudgetItem({
      category: "servicios",
      itemDescription: "",
      quantity: 1,
      unitPrice: 5000,
    });
  };

  const handleDeleteBudgetItem = (id: string) => {
    setBudgetItems(prev => prev.filter(item => item.id !== id));
  };

  // Cálculos totales de Presupuesto y Retenciones Ley 843
  const totalGrossBudget = budgetItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  
  const taxDetails = budgetItems.map(item => {
    const totalItem = item.quantity * item.unitPrice;
    return calculateLey843Tax(totalItem, item.category, 'bruto');
  });

  const totalRetentionsLey843 = taxDetails.reduce((acc, t) => acc + t.totalRetention, 0);
  const totalNetExecuted = taxDetails.reduce((acc, t) => acc + t.liquidPayout, 0);

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalData.title.trim() || !proposalData.abstract.trim()) {
      alert("Por favor completa los datos mínimos obligatorios de la propuesta (Título y Resumen).");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-10 font-sans">
      <Header 
        title="Presentación de Propuestas de Investigación" 
        description="Formulario oficial DICYT UNITEPC para la carga de proyectos, planificación de cronogramas WBS y presupuestos Ley 843." 
      />

      <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 w-full">
        {submitted ? (
          <Card className="border-emerald-500/40 bg-card text-card-foreground p-8 text-center space-y-5 shadow-2xl max-w-3xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">¡Propuesta de Investigación Presentada con Éxito!</h2>
            <p className="text-xs text-muted-foreground max-w-lg mx-auto">
              Tu proyecto ha sido registrado en el sistema SIGPRI bajo el código <strong className="text-primary font-mono">SIGPRI-2026-006</strong> en estado <strong className="text-blue-400">📝 1. En Propuesta</strong> para la revisión de los Comités Evaluadores.
            </p>

            <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs text-left max-w-md mx-auto space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Título:</span>
                <span className="font-bold text-foreground truncate max-w-[200px]">{proposalData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Investigador Principal:</span>
                <span className="font-bold text-primary">{proposalData.investigator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Presupuesto Bruto Solicitado:</span>
                <span className="font-bold text-foreground">Bs. {totalGrossBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Retenciones Ley 843:</span>
                <span className="font-bold text-primary">Bs. {totalRetentionsLey843.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <Link href="/directorio">
                <Button className="font-bold text-xs">Ir al Directorio de Proyectos</Button>
              </Link>
              <Button variant="outline" onClick={() => setSubmitted(false)} className="font-bold text-xs">
                Registrar Otra Propuesta
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* CABECERA CON NAVEGACIÓN POR PESTAÑAS (DATOS ➔ CRONOGRAMA ➔ PRESUPUESTO) */}
            <Card className="border-border bg-card text-card-foreground shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      <span>Formulario Oficial de Carga de Propuestas DICYT</span>
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-1">
                      Completa los 3 apartados del proyecto: Datos Generales, Cronograma WBS y Presupuesto con Ley 843.
                    </CardDescription>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-primary/40 text-primary font-bold text-xs">
                      Convocatoria 2026-I
                    </Badge>
                  </div>
                </div>

                {/* BOTONES DE NAVEGACIÓN ENTRE APARTADOS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('datos')}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      activeTab === 'datos'
                        ? 'bg-primary/10 text-primary border-primary/50 shadow-sm'
                        : 'bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/60 hover:text-foreground'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>1. Datos de la Propuesta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('cronograma')}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      activeTab === 'cronograma'
                        ? 'bg-primary/10 text-primary border-primary/50 shadow-sm'
                        : 'bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/60 hover:text-foreground'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>2. Gestión de Cronograma ({scheduleItems.length} Tareas)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('presupuesto')}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                      activeTab === 'presupuesto'
                        ? 'bg-primary/10 text-primary border-primary/50 shadow-sm'
                        : 'bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/60 hover:text-foreground'
                    }`}
                  >
                    <Calculator className="w-4 h-4" />
                    <span>3. Presupuesto (Bs. {totalGrossBudget.toLocaleString()})</span>
                  </button>
                </div>
              </CardHeader>
            </Card>

            {/* TAB 1: DATOS GENERALES DE LA PROPUESTA */}
            {activeTab === 'datos' && (
              <Card className="border-border bg-card text-card-foreground shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Apartado 1: Información General y Marco Conceptual
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Define la identificación del proyecto, resumen ejecutivo y fundamentación académica.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Título de la Propuesta de Investigación *</label>
                      <input
                        required
                        value={proposalData.title}
                        onChange={(e) => setProposalData({ ...proposalData, title: e.target.value })}
                        placeholder="Ej. Evaluación Bioenergética y Diagnóstico por Imágenes en..."
                        className="w-full bg-background border border-input rounded-lg p-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Investigador Principal (PI) *</label>
                      <input
                        required
                        value={proposalData.investigator}
                        onChange={(e) => setProposalData({ ...proposalData, investigator: e.target.value })}
                        className="w-full bg-background border border-input rounded-lg p-2.5 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Facultad / Área Académica</label>
                      <select
                        value={proposalData.faculty}
                        onChange={(e) => setProposalData({ ...proposalData, faculty: e.target.value })}
                        className="w-full bg-background border border-input rounded-lg p-2.5 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                      >
                        <option value="Ciencias de la Salud">Ciencias de la Salud</option>
                        <option value="Ingeniería y Tecnología">Ingeniería y Tecnología</option>
                        <option value="Bioquímica y Farmacia">Bioquímica y Farmacia</option>
                        <option value="Odontología">Odontología</option>
                        <option value="Ciencias de la Educación">Ciencias de la Educación</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Línea de Investigación DICYT</label>
                      <input
                        value={proposalData.line}
                        onChange={(e) => setProposalData({ ...proposalData, line: e.target.value })}
                        className="w-full bg-background border border-input rounded-lg p-2.5 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Gestión Universitaria</label>
                      <select
                        value={proposalData.academicPeriod}
                        onChange={(e) => setProposalData({ ...proposalData, academicPeriod: e.target.value })}
                        className="w-full bg-background border border-input rounded-lg p-2.5 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                      >
                        <option value="2026">Gestión 2026</option>
                        <option value="2027">Gestión 2027</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Resumen Ejecutivo del Proyecto (Abstract) *</label>
                    <textarea
                      rows={4}
                      required
                      value={proposalData.abstract}
                      onChange={(e) => setProposalData({ ...proposalData, abstract: e.target.value })}
                      placeholder="Sintetiza la problemática, metodología, resultados esperados y contribución al estado del arte..."
                      className="w-full bg-background border border-input rounded-lg p-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Objetivo General</label>
                      <textarea
                        rows={3}
                        value={proposalData.generalObjective}
                        onChange={(e) => setProposalData({ ...proposalData, generalObjective: e.target.value })}
                        placeholder="Describir la meta principal alcanzable al finalizar la investigación..."
                        className="w-full bg-background border border-input rounded-lg p-2.5 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Justificación e Impacto Social / Académico</label>
                      <textarea
                        rows={3}
                        value={proposalData.justification}
                        onChange={(e) => setProposalData({ ...proposalData, justification: e.target.value })}
                        placeholder="Explicar la relevancia para la universidad UNITEPC y la sociedad boliviana..."
                        className="w-full bg-background border border-input rounded-lg p-2.5 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end border-t border-border pt-4">
                  <Button onClick={() => setActiveTab('cronograma')} className="font-bold text-xs">
                    Siguiente: Gestión del Cronograma WBS ➔
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* TAB 2: GESTIÓN DE CRONOGRAMA DE TRABAJO (WBS) */}
            {activeTab === 'cronograma' && (
              <Card className="border-border bg-card text-card-foreground shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Apartado 2: Gestión de Cronograma de Trabajo (WBS & Hitos)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Planifica la secuencia temporal, fases de ejecución, entregables y responsables asignados.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 text-xs">
                  {/* FORMULARIO PARA AGREGAR NUEVA TAREA WBS */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                    <h4 className="font-bold text-foreground flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-primary" />
                      <span>Agregar Nueva Fase / Tarea al Cronograma</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-bold text-muted-foreground block mb-1">Fase del Proyecto</label>
                        <select
                          value={newSchedule.phase}
                          onChange={(e) => setNewSchedule({ ...newSchedule, phase: e.target.value })}
                          className="w-full bg-background border border-input rounded-lg p-2 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="Fase 1: Preparación y Bioética">Fase 1: Preparación y Bioética</option>
                          <option value="Fase 2: Ejecución y Trabajo de Campo">Fase 2: Ejecución y Campo</option>
                          <option value="Fase 3: Análisis y Redacción Final">Fase 3: Análisis y Publicación</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold text-muted-foreground block mb-1">Descripción de la Tarea WBS *</label>
                        <input
                          value={newSchedule.taskName}
                          onChange={(e) => setNewSchedule({ ...newSchedule, taskName: e.target.value })}
                          placeholder="Ej. Recolección de muestras biológicas y procesamiento analítico..."
                          className="w-full bg-background border border-input rounded-lg p-2 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="font-bold text-muted-foreground block mb-1">Duración (Meses)</label>
                        <input
                          type="number"
                          min={1}
                          max={24}
                          value={newSchedule.durationMonths}
                          onChange={(e) => setNewSchedule({ ...newSchedule, durationMonths: Number(e.target.value) })}
                          className="w-full bg-background border border-input rounded-lg p-2 text-foreground font-bold"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-muted-foreground block mb-1">Fecha Inicio</label>
                        <input
                          type="date"
                          value={newSchedule.startDate}
                          onChange={(e) => setNewSchedule({ ...newSchedule, startDate: e.target.value })}
                          className="w-full bg-background border border-input rounded-lg p-2 text-foreground font-medium"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-muted-foreground block mb-1">Fecha Fin</label>
                        <input
                          type="date"
                          value={newSchedule.endDate}
                          onChange={(e) => setNewSchedule({ ...newSchedule, endDate: e.target.value })}
                          className="w-full bg-background border border-input rounded-lg p-2 text-foreground font-medium"
                        />
                      </div>

                      <div className="flex items-end">
                        <Button onClick={handleAddScheduleItem} className="w-full font-bold text-xs">
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar Tarea
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* TABLA / LISTADO DE CRONOGRAMA VIGENTE */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-foreground">Matriz de Planificación de Tareas ({scheduleItems.length})</h4>

                    <div className="overflow-x-auto rounded-xl border border-border bg-card">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-border bg-muted/50 text-muted-foreground font-bold uppercase tracking-wider">
                            <th className="p-3">Fase</th>
                            <th className="p-3">Tarea / Entregable</th>
                            <th className="p-3 text-center">Duración</th>
                            <th className="p-3">Fechas (Inicio - Fin)</th>
                            <th className="p-3 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {scheduleItems.map((item) => (
                            <tr key={item.id} className="hover:bg-muted/30">
                              <td className="p-3 font-bold text-primary whitespace-nowrap">{item.phase}</td>
                              <td className="p-3 text-foreground font-medium">{item.taskName}</td>
                              <td className="p-3 text-center font-bold whitespace-nowrap">{item.durationMonths} Meses</td>
                              <td className="p-3 whitespace-nowrap text-muted-foreground font-mono">
                                {item.startDate} ➔ {item.endDate}
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteScheduleItem(item.id)}
                                  className="h-7 w-7 text-rose-400 hover:bg-rose-500/10"
                                  title="Eliminar Tarea"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t border-border pt-4">
                  <Button variant="outline" onClick={() => setActiveTab('datos')} className="font-bold text-xs">
                    ➔ Volver a Datos Generales
                  </Button>
                  <Button onClick={() => setActiveTab('presupuesto')} className="font-bold text-xs">
                    Siguiente: Gestión de Presupuesto Ley 843 ➔
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* TAB 3: GESTIÓN DE PRESUPUESTO DE LA PROPUESTA (LEY 843) */}
            {activeTab === 'presupuesto' && (
              <Card className="border-border bg-card text-card-foreground shadow-sm space-y-4">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    Apartado 3: Gestión de Presupuesto & Fiscalización Ley 843
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Carga los rubros presupuestarios, montos y calcula automáticamente las retenciones tributarias (IUE/IT/RC-IVA).
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5 text-xs">
                  {/* RESUMEN DE CONSOLIDACIÓN DE PRESUPUESTO Y RETENCIONES */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-muted/40 border border-border">
                      <span className="text-muted-foreground uppercase font-bold text-[10px]">Presupuesto Bruto Solicitado</span>
                      <p className="text-xl font-black text-foreground mt-1">Bs. {totalGrossBudget.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                      <span className="text-primary uppercase font-bold text-[10px]">Retenciones Ley 843 (Calculadas)</span>
                      <p className="text-xl font-black text-primary mt-1">Bs. {totalRetentionsLey843.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <span className="text-emerald-400 uppercase font-bold text-[10px]">Desembolso Neto Líquido</span>
                      <p className="text-xl font-black text-emerald-400 mt-1">Bs. {totalNetExecuted.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>

                  {/* FORMULARIO PARA AGREGAR NUEVA PARTIDA PRESUPUESTARIA */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
                    <h4 className="font-bold text-foreground flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-primary" />
                      <span>Agregar Nueva Partida Presupuestaria</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="font-bold text-muted-foreground block mb-1">Categoría Impositiva (Ley 843)</label>
                        <select
                          value={newBudgetItem.category}
                          onChange={(e) => setNewBudgetItem({ ...newBudgetItem, category: e.target.value as any })}
                          className="w-full bg-background border border-input rounded-lg p-2 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                        >
                          <option value="servicios">Servicios / Consultorías (15.5%)</option>
                          <option value="bienes">Compra de Bienes / Insumos (8.0%)</option>
                          <option value="alquileres">Alquileres / Bienes Inmuebles (16.0%)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="font-bold text-muted-foreground block mb-1">Descripción del Ítem o Servicio *</label>
                        <input
                          value={newBudgetItem.itemDescription}
                          onChange={(e) => setNewBudgetItem({ ...newBudgetItem, itemDescription: e.target.value })}
                          placeholder="Ej. Adquisición de Reactivos PCR y Material Quirúrgico..."
                          className="w-full bg-background border border-input rounded-lg p-2 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-muted-foreground block mb-1">Precio Unitario (Bs.) *</label>
                        <input
                          type="number"
                          min={1}
                          value={newBudgetItem.unitPrice}
                          onChange={(e) => setNewBudgetItem({ ...newBudgetItem, unitPrice: Number(e.target.value) })}
                          className="w-full bg-background border border-input rounded-lg p-2 text-foreground font-bold"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleAddBudgetItem} className="font-bold text-xs">
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar Partida Presupuestaria
                      </Button>
                    </div>
                  </div>

                  {/* TABLA DE PARTIDAS PRESUPUESTARIAS CON RETENCIONES LEY 843 */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-foreground">Planilla de Gastos y Retenciones Tributarias</h4>

                    <div className="overflow-x-auto rounded-xl border border-border bg-card">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-border bg-muted/50 text-muted-foreground font-bold uppercase tracking-wider">
                            <th className="p-3">Categoría Ley 843</th>
                            <th className="p-3">Descripción de la Partida</th>
                            <th className="p-3 text-right">Monto Bruto</th>
                            <th className="p-3 text-right">Retención (IUE/IT)</th>
                            <th className="p-3 text-right">Monto Neto Líquido</th>
                            <th className="p-3 text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {budgetItems.map((item, idx) => {
                            const subtotal = item.quantity * item.unitPrice;
                            const tax = calculateLey843Tax(subtotal, item.category, 'bruto');

                            return (
                              <tr key={item.id} className="hover:bg-muted/30">
                                <td className="p-3 font-bold text-primary uppercase whitespace-nowrap">
                                  {item.category} ({tax.iueRate + tax.itRate + tax.rcIvaRate * 100}%)
                                </td>
                                <td className="p-3 text-foreground font-medium">{item.itemDescription}</td>
                                <td className="p-3 text-right font-bold text-foreground whitespace-nowrap">
                                  Bs. {subtotal.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-3 text-right font-bold text-primary whitespace-nowrap">
                                  Bs. {tax.totalRetention.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-3 text-right font-bold text-emerald-400 whitespace-nowrap">
                                  Bs. {tax.liquidPayout.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-3 text-center whitespace-nowrap">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteBudgetItem(item.id)}
                                    className="h-7 w-7 text-rose-400 hover:bg-rose-500/10"
                                    title="Eliminar Partida"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t border-border pt-4">
                  <Button variant="outline" onClick={() => setActiveTab('cronograma')} className="font-bold text-xs">
                    ➔ Volver a Cronograma WBS
                  </Button>
                  
                  <form onSubmit={handleSubmitProposal}>
                    <Button type="submit" className="font-bold text-xs bg-gradient-to-r from-purple-800 to-teal-700 hover:from-purple-700 hover:to-teal-600 text-white shadow-lg">
                      <Send className="w-4 h-4 mr-1.5" />
                      Presentar Propuesta Oficial a DICYT
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
