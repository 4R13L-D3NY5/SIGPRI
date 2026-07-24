"use client";

import { useState, useEffect } from "react";
import { 
  X, DollarSign, Calculator, Plus, Trash2, Edit3, Lock, CheckCircle2, 
  AlertCircle, ShieldCheck, FileSpreadsheet, Building, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { calculateLey843Tax } from "@/lib/sigpri-data";
import { ProjectItem, ExactProjectStatus } from "../page";
import { getActiveUserRole, canEditBudget } from "@/lib/permission-utils";

export interface BudgetItemRow {
  codeNum: number;
  institution: string;
  description: string;
  purchaseOrLoan: "compra" | "Préstamo";
  unit: string;
  quantity: number;
  unitPrice: number;
  docType: "FACTURA" | "RETENCIÓN" | "N/A";
  retentionType: "COMPRA" | "SERVICIOS" | "ALQUILERES" | "N/A";
  observations: string;
}

const DEFAULT_BUDGET_ITEMS: BudgetItemRow[] = [
  {
    codeNum: 1,
    institution: "UNITEPC",
    description: "Jeringas de insulina x100 unidades",
    purchaseOrLoan: "compra",
    unit: "Caja",
    quantity: 5,
    unitPrice: 115,
    docType: "FACTURA",
    retentionType: "COMPRA",
    observations: "Cotización 10 días",
  },
  {
    codeNum: 2,
    institution: "UNITEPC",
    description: "Alcohol al 90% de 1 litro",
    purchaseOrLoan: "compra",
    unit: "Bidon",
    quantity: 5,
    unitPrice: 30,
    docType: "FACTURA",
    retentionType: "COMPRA",
    observations: "Cotización 30 días",
  },
  {
    codeNum: 3,
    institution: "ZONOSIS",
    description: "Cajas Petri especializadas para cultivo",
    purchaseOrLoan: "Préstamo",
    unit: "cajas",
    quantity: 25,
    unitPrice: 80,
    docType: "N/A",
    retentionType: "N/A",
    observations: "No requiere desembolso (Convenio Institucional)",
  },
  {
    codeNum: 4,
    institution: "UNITEPC",
    description: "Honorarios de Consultoría Externa Análisis Bioestadístico",
    purchaseOrLoan: "compra",
    unit: "Servicio",
    quantity: 1,
    unitPrice: 8500,
    docType: "RETENCIÓN",
    retentionType: "SERVICIOS",
    observations: "Retención de Servicios 15.5% Ley 843",
  },
  {
    codeNum: 5,
    institution: "UNITEPC",
    description: "Insumos Reactivos Químicos Grado Analítico",
    purchaseOrLoan: "compra",
    unit: "Frasco",
    quantity: 3,
    unitPrice: 1200,
    docType: "RETENCIÓN",
    retentionType: "COMPRA",
    observations: "Retención de Bienes 8% Ley 843",
  },
];

interface ProjectBudgetModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (newStatus: ExactProjectStatus) => void;
}

export function ProjectBudgetModal({ project, isOpen, onClose, onUpdateStatus }: ProjectBudgetModalProps) {
  const [items, setItems] = useState<BudgetItemRow[]>(DEFAULT_BUDGET_ITEMS);
  const [userRole, setUserRole] = useState<string>("admin");
  const [canEdit, setCanEdit] = useState<boolean>(true);
  
  // Formulario para nuevo ítem
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<BudgetItemRow>>({
    institution: "UNITEPC",
    description: "",
    purchaseOrLoan: "compra",
    unit: "Unidad",
    quantity: 1,
    unitPrice: 100,
    docType: "FACTURA",
    retentionType: "COMPRA",
    observations: "",
  });

  useEffect(() => {
    if (project) {
      const role = getActiveUserRole();
      setUserRole(role);
      setCanEdit(canEditBudget(role, project.status));
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const canManageStatus = userRole === "admin" || userRole === "jefe_investigador" || userRole === "contabilidad";

  // CÁLCULOS DE LEY 843
  const processedItems = items.map((item) => {
    const isLoan = item.purchaseOrLoan === "Préstamo";
    const totalAmount = isLoan ? 0 : item.quantity * item.unitPrice;
    
    let retentionAmount = 0;
    let retentionRate = 0;

    if (!isLoan && item.docType === "RETENCIÓN") {
      if (item.retentionType === "COMPRA") {
        retentionRate = 8.0; // 5% IUE + 3% IT
      } else if (item.retentionType === "SERVICIOS") {
        retentionRate = 15.5; // 12.5% IUE + 3% IT
      } else if (item.retentionType === "ALQUILERES") {
        retentionRate = 16.0; // 13% RC-IVA + 3% IT
      }
      retentionAmount = (totalAmount * retentionRate) / 100;
    }

    const executedAmount = totalAmount - retentionAmount;

    return {
      ...item,
      totalAmount,
      retentionRate,
      retentionAmount,
      executedAmount,
    };
  });

  // Métricas acumuladas
  const totalBruto = processedItems.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalRetenciones = processedItems.reduce((sum, item) => sum + item.retentionAmount, 0);
  const totalEjecutado = processedItems.reduce((sum, item) => sum + item.executedAmount, 0);
  const totalLoansCount = processedItems.filter((item) => item.purchaseOrLoan === "Préstamo").length;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit || !newItem.description?.trim()) return;

    const row: BudgetItemRow = {
      codeNum: items.length + 1,
      institution: newItem.institution || "UNITEPC",
      description: newItem.description,
      purchaseOrLoan: newItem.purchaseOrLoan as any,
      unit: newItem.unit || "Unidad",
      quantity: Number(newItem.quantity) || 1,
      unitPrice: Number(newItem.unitPrice) || 0,
      docType: newItem.docType as any,
      retentionType: newItem.retentionType as any,
      observations: newItem.observations || "",
    };

    setItems([...items, row]);
    setShowAddForm(false);
    setNewItem({
      institution: "UNITEPC",
      description: "",
      purchaseOrLoan: "compra",
      unit: "Unidad",
      quantity: 1,
      unitPrice: 100,
      docType: "FACTURA",
      retentionType: "COMPRA",
      observations: "",
    });
  };

  const handleDeleteItem = (codeNum: number) => {
    if (!canEdit) return;
    setItems(items.filter((i) => i.codeNum !== codeNum));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-[98vw] bg-card text-card-foreground border border-border/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in duration-200">
        
        {/* HEADER DEL MODAL */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-muted/40 border-b border-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono bg-primary/10 border-primary/30 text-primary font-bold">
                {project.code}
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold">
                Ley 843 Automatizada
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
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Gestión Presupuestaria Institucional (Formato Excel DICYT)
            </h2>
            <p className="text-xs text-muted-foreground">
              Desglose detallado de ítems, compras, préstamos y cálculo impositivo conforme a la normativa tributaria boliviana.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && (
              <Button size="sm" onClick={() => setShowAddForm(!showAddForm)} className="bg-primary hover:bg-primary/90 font-bold gap-1">
                <Plus className="h-4 w-4" /> {showAddForm ? "Cerrar Formulario" : "Agregar Ítem"}
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* TARJETAS RESUMEN DE CONTROL FINANCIERO */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-muted/20 border-b border-border/60 text-xs">
          <div className="p-3 rounded-lg bg-card border border-border/60 shadow-sm space-y-1">
            <span className="text-muted-foreground font-semibold block">Total Presupuesto Bruto:</span>
            <span className="text-base font-bold text-primary font-mono">
              Bs. {totalBruto.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-card border border-border/60 shadow-sm space-y-1">
            <span className="text-muted-foreground font-semibold block">Retenciones Ley 843:</span>
            <span className="text-base font-bold text-rose-400 font-mono">
              Bs. {totalRetenciones.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-card border border-border/60 shadow-sm space-y-1">
            <span className="text-muted-foreground font-semibold block">Desembolso Neto Ejecutado:</span>
            <span className="text-base font-bold text-emerald-400 font-mono">
              Bs. {totalEjecutado.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-card border border-border/60 shadow-sm space-y-1">
            <span className="text-muted-foreground font-semibold block">Ítems en Préstamo:</span>
            <span className="text-base font-bold text-amber-400 font-mono">
              {totalLoansCount} ítems (Sin Desembolso)
            </span>
          </div>
        </div>

        {/* FORMULARIO DE AGREGAR ÍTEM */}
        {canEdit && showAddForm && (
          <form onSubmit={handleAddItem} className="p-4 bg-primary/5 border-b border-primary/20 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground block">Institución</label>
              <Input
                value={newItem.institution}
                onChange={(e) => setNewItem({ ...newItem, institution: e.target.value })}
                placeholder="UNITEPC / ZONOSIS"
                className="h-8 text-xs bg-background"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-muted-foreground block">Descripción del Ítem</label>
              <Input
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Ej. Alcohol al 90%, Insumos reactivos..."
                className="h-8 text-xs bg-background"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground block">Modalidad</label>
              <select
                value={newItem.purchaseOrLoan}
                onChange={(e) => setNewItem({ ...newItem, purchaseOrLoan: e.target.value as any })}
                className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="compra">Compra</option>
                <option value="Préstamo">Préstamo</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground block">Unidad</label>
              <Input
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                placeholder="Caja, Bidón, Servicio..."
                className="h-8 text-xs bg-background"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground block">Cantidad</label>
              <Input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                className="h-8 text-xs bg-background"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground block">Precio Unitario (Bs.)</label>
              <Input
                type="number"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
                className="h-8 text-xs bg-background"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground block">Documento</label>
              <select
                value={newItem.docType}
                onChange={(e) => setNewItem({ ...newItem, docType: e.target.value as any })}
                className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="FACTURA">FACTURA</option>
                <option value="RETENCIÓN">RETENCIÓN</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-muted-foreground block">Tipo de Retención Ley 843</label>
              <select
                value={newItem.retentionType}
                onChange={(e) => setNewItem({ ...newItem, retentionType: e.target.value as any })}
                className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="COMPRA">COMPRA (8% - 5% IUE + 3% IT)</option>
                <option value="SERVICIOS">SERVICIOS (15.5% - 12.5% IUE + 3% IT)</option>
                <option value="ALQUILERES">ALQUILERES (16% - 13% RC-IVA + 3% IT)</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-muted-foreground block">Observaciones</label>
              <Input
                value={newItem.observations}
                onChange={(e) => setNewItem({ ...newItem, observations: e.target.value })}
                placeholder="Notas de cotización o desembolso..."
                className="h-8 text-xs bg-background"
              />
            </div>
            <div className="sm:col-span-4 flex justify-end gap-2 pt-2">
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                Guardar en Presupuesto
              </Button>
            </div>
          </form>
        )}

        {/* TABLA ESTILO EXCEL */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 bg-background">
          <table className="w-full text-left text-xs border-collapse min-w-[1300px]">
            <thead>
              <tr className="border-b border-border/80 bg-muted/60 text-muted-foreground uppercase font-bold">
                <th className="p-2.5 w-12 text-center">C</th>
                <th className="p-2.5 w-28">INSTITUCIÓN</th>
                <th className="p-2.5 w-64">Descripción</th>
                <th className="p-2.5 w-28">Compra o Préstamo</th>
                <th className="p-2.5 w-20">Unidad</th>
                <th className="p-2.5 w-16 text-center">Cantidad</th>
                <th className="p-2.5 w-24 text-right">PRECIO (Bs.)</th>
                <th className="p-2.5 w-28 text-right">Monto Total</th>
                <th className="p-2.5 w-28 text-right text-rose-400">Retención (Bs.)</th>
                <th className="p-2.5 w-28 text-right text-emerald-400">Monto Ejecutado</th>
                <th className="p-2.5 w-28 text-center">FACTURA / RETENCIÓN</th>
                <th className="p-2.5 w-28">Tipo Retención</th>
                <th className="p-2.5 w-20 text-center">% Retención</th>
                <th className="p-2.5">Observaciones</th>
                {canEdit && <th className="p-2.5 w-12 text-center">Acción</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {processedItems.map((item) => (
                <tr key={item.codeNum} className="hover:bg-muted/30 transition-colors">
                  <td className="p-2.5 text-center font-mono text-muted-foreground font-bold">{item.codeNum}</td>
                  <td className="p-2.5 font-semibold text-foreground">{item.institution}</td>
                  <td className="p-2.5 text-foreground">{item.description}</td>
                  <td className="p-2.5">
                    {item.purchaseOrLoan === "Préstamo" ? (
                      <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/10 font-bold text-[10px]">
                        Préstamo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-blue-500/40 text-blue-400 bg-blue-500/10 font-bold text-[10px]">
                        Compra
                      </Badge>
                    )}
                  </td>
                  <td className="p-2.5 text-muted-foreground">{item.unit}</td>
                  <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                  <td className="p-2.5 text-right font-mono">Bs. {item.unitPrice.toLocaleString()}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-foreground">
                    Bs. {item.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold text-rose-400">
                    {item.retentionAmount > 0 ? `Bs. ${item.retentionAmount.toLocaleString()}` : "-"}
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold text-emerald-400">
                    Bs. {item.executedAmount.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-center">
                    <span className="font-semibold text-xs">{item.docType}</span>
                  </td>
                  <td className="p-2.5 text-muted-foreground text-xs">{item.retentionType}</td>
                  <td className="p-2.5 text-center font-mono">
                    {item.retentionRate > 0 ? `${item.retentionRate}%` : "N/A"}
                  </td>
                  <td className="p-2.5 text-muted-foreground text-xs">{item.observations}</td>
                  {canEdit && (
                    <td className="p-2.5 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item.codeNum)}
                        className="h-7 w-7 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/40 font-bold text-foreground text-xs">
                <td colSpan={7} className="p-3 text-right uppercase">Total General Presupuesto:</td>
                <td className="p-3 text-right font-mono text-primary">Bs. {totalBruto.toLocaleString()}</td>
                <td className="p-3 text-right font-mono text-rose-400">Bs. {totalRetenciones.toLocaleString()}</td>
                <td className="p-3 text-right font-mono text-emerald-400">Bs. {totalEjecutado.toLocaleString()}</td>
                <td colSpan={canEdit ? 5 : 4} className="p-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* FOOTER DEL MODAL */}
        <div className="flex items-center justify-between p-4 bg-muted/40 border-t border-border/60">
          <span className="text-xs text-muted-foreground">
            Formato oficial estandarizado según la planilla de control de desembolsos UNITEPC.
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar Presupuesto
          </Button>
        </div>

      </div>
    </div>
  );
}
