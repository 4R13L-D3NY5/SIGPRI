"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  Coins,
  Download,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Info,
  Percent,
  Printer,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type RubroType = "bienes_sin_factura" | "servicios_sin_factura" | "bienes_con_factura" | "honorarios_pi" | "beca_estudiante";

export default function BudgetCalculatorPage() {
  const [montoTotal, setMontoTotal] = useState<number>(100000);
  const [rubro, setRubro] = useState<RubroType>("servicios_sin_factura");
  const [applyOverhead, setApplyOverhead] = useState<boolean>(true);
  const [downloadNotice, setDownloadNotice] = useState(false);

  // Calculations under Bolivian Ley 843 Tax Regulations
  const calcResults = useMemo(() => {
    let retencionITPercent = 0;
    let retencionIUEPercent = 0;
    let retencionIVAPercent = 0;

    switch (rubro) {
      case "bienes_sin_factura":
        retencionITPercent = 3; // 3% IT
        retencionIUEPercent = 5; // 5% IUE Bienes
        retencionIVAPercent = 0;
        break;
      case "servicios_sin_factura":
        retencionITPercent = 3; // 3% IT
        retencionIUEPercent = 12.5; // 12.5% IUE Servicios
        retencionIVAPercent = 0;
        break;
      case "bienes_con_factura":
        retencionITPercent = 0;
        retencionIUEPercent = 0;
        retencionIVAPercent = 13; // 13% Crédito Fiscal IVA
        break;
      case "honorarios_pi":
        retencionITPercent = 0;
        retencionIUEPercent = 0;
        retencionIVAPercent = 13; // 13% RC-IVA Retención
        break;
      case "beca_estudiante":
        retencionITPercent = 0;
        retencionIUEPercent = 0;
        retencionIVAPercent = 0;
        break;
    }

    const overheadPercent = applyOverhead ? 5 : 0; // 5% Overhead DICYT

    const montoIT = (montoTotal * retencionITPercent) / 100;
    const montoIUE = (montoTotal * retencionIUEPercent) / 100;
    const montoIVA = (montoTotal * retencionIVAPercent) / 100;
    const montoOverhead = (montoTotal * overheadPercent) / 100;

    const totalRetencionesImpuestos = montoIT + montoIUE + montoIVA;
    const totalDeducciones = totalRetencionesImpuestos + montoOverhead;

    const montoLiquido = montoTotal - totalDeducciones;
    const porcentajeDeduccionTotal = ((totalDeducciones / (montoTotal || 1)) * 100).toFixed(1);

    return {
      retencionITPercent,
      retencionIUEPercent,
      retencionIVAPercent,
      overheadPercent,
      montoIT,
      montoIUE,
      montoIVA,
      montoOverhead,
      totalRetencionesImpuestos,
      totalDeducciones,
      montoLiquido,
      porcentajeDeduccionTotal,
    };
  }, [montoTotal, rubro, applyOverhead]);

  const handlePreset = (amount: number) => {
    setMontoTotal(amount);
  };

  const handleExport = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      <Header
        title="Calculadora de Presupuesto y Retenciones Ley 843"
        description="Herramienta oficial de fiscalización financiera para la liquidación de fondos de investigación DICYT (Bolivia)"
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Banner Informativo Ley 843 */}
        <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white">Normativa Tributaria Bolivia</Badge>
                <span className="text-xs text-muted-foreground">Ley Nº 843 y Decretos Reglamentarios</span>
              </div>
              <h2 className="font-bold text-lg text-foreground">
                Cálculo Automático de Retenciones e Impuestos Universitarios
              </h2>
              <p className="text-xs text-muted-foreground max-w-3xl">
                Determine con precisión la retención de IT (3%), IUE Servicios (12.5%), IUE Bienes (5%) y RC-IVA (13%) conforme a la normativa legal vigente para la ejecución de proyectos de investigación.
              </p>
            </div>
            <Button onClick={handleExport} className="gap-2 shadow shrink-0">
              <Download className="h-4 w-4" /> Exportar Planilla Ley 843
            </Button>
          </div>
        </div>

        {downloadNotice && (
          <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/40 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Planilla oficial exportada con éxito en formato PDF / Excel para la Dirección Financiera.</span>
            </div>
            <button type="button" onClick={() => setDownloadNotice(false)} className="text-xs underline">
              Ocultar
            </button>
          </div>
        )}

        {/* Layout Grid: Calculadora + Resumen Liquidación */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Formulario Calculadora (7 cols) */}
          <Card className="lg:col-span-7 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" /> Parámetros del Presupuesto
              </CardTitle>
              <CardDescription className="text-xs">
                Ingrese el monto asignado y el tipo de gasto o rubro contratado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-xs">
              {/* Presets de Montos */}
              <div>
                <label className="block font-semibold mb-1 text-muted-foreground">Accesos Rápidos (Presupuestos Típicos)</label>
                <div className="flex flex-wrap gap-2">
                  {[10000, 50000, 100000, 250000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handlePreset(amt)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
                        montoTotal === amt
                          ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                          : "bg-muted/40 hover:bg-accent text-foreground"
                      }`}
                    >
                      Bs. {amt.toLocaleString("es-BO")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monto Total Input */}
              <div>
                <label className="block font-bold text-sm mb-1 text-foreground">
                  Monto Total del Rubro / Contrato (BOB)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono font-bold text-muted-foreground text-sm">
                    Bs.
                  </span>
                  <Input
                    type="number"
                    min={0}
                    step={1000}
                    value={montoTotal}
                    onChange={(e) => setMontoTotal(Math.max(0, Number(e.target.value)))}
                    className="pl-12 font-mono text-base font-bold h-11"
                  />
                </div>
              </div>

              {/* Tipo de Rubro */}
              <div>
                <label className="block font-semibold mb-2 text-foreground">
                  Categoría de Gasto / Ley 843
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      rubro === "servicios_sin_factura"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "bg-card hover:bg-accent/40 border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rubro"
                      checked={rubro === "servicios_sin_factura"}
                      onChange={() => setRubro("servicios_sin_factura")}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-bold text-foreground block">Servicios Profesionales / Consultorías sin Factura</span>
                      <span className="text-muted-foreground text-[11px]">
                        Retención Ley 843: <strong>12.5% IUE + 3% IT = 15.5% Retención Total</strong>
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      rubro === "bienes_sin_factura"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "bg-card hover:bg-accent/40 border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rubro"
                      checked={rubro === "bienes_sin_factura"}
                      onChange={() => setRubro("bienes_sin_factura")}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-bold text-foreground block">Adquisición de Bienes e Insumos sin Factura</span>
                      <span className="text-muted-foreground text-[11px]">
                        Retención Ley 843: <strong>5% IUE + 3% IT = 8.0% Retención Total</strong>
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      rubro === "honorarios_pi"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "bg-card hover:bg-accent/40 border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rubro"
                      checked={rubro === "honorarios_pi"}
                      onChange={() => setRubro("honorarios_pi")}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-bold text-foreground block">Honorarios Docente Investigador / Personal Técnico</span>
                      <span className="text-muted-foreground text-[11px]">
                        Retención Directa RC-IVA Ley 843: <strong>13% RC-IVA</strong>
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      rubro === "bienes_con_factura"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "bg-card hover:bg-accent/40 border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rubro"
                      checked={rubro === "bienes_con_factura"}
                      onChange={() => setRubro("bienes_con_factura")}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-bold text-foreground block">Compras y Servicios Con Factura Oficial</span>
                      <span className="text-muted-foreground text-[11px]">
                        Crédito Fiscal IVA 13% recuperable p/ la Institución (0% retención impositiva directa)
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      rubro === "beca_estudiante"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "bg-card hover:bg-accent/40 border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rubro"
                      checked={rubro === "beca_estudiante"}
                      onChange={() => setRubro("beca_estudiante")}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-bold text-foreground block">Becas Auxiliares de Investigación a Estudiantes</span>
                      <span className="text-muted-foreground text-[11px]">
                        Estímulo Académico exento de retención tributaria (0% Retención)
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Checkbox Overhead DICYT */}
              <div className="pt-2 border-t">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyOverhead}
                    onChange={(e) => setApplyOverhead(e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span className="font-semibold text-xs text-foreground">
                    Aplicar Retención de Gestión Institucional DICYT (5% Overhead)
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Resultado de Liquidación (5 cols) */}
          <Card className="lg:col-span-5 shadow-sm border-l-4 border-l-emerald-500 flex flex-col justify-between">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="w-fit font-mono text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                Liquidación Tributaria DICYT
              </Badge>
              <CardTitle className="text-base font-bold mt-1">Desglose de Fondos y Líquido Patable</CardTitle>
              <CardDescription className="text-xs">
                Monto neto final disponible tras la aplicación de la Ley 843
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 text-xs">
              {/* Tarjeta de Monto Líquido */}
              <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background p-4 border border-emerald-500/20 text-center">
                <span className="text-xs uppercase font-bold text-muted-foreground">Monto Líquido a Transferir</span>
                <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  Bs. {calcResults.montoLiquido.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-muted-foreground block mt-1">
                  Descuento Total: <strong>{calcResults.porcentajeDeduccionTotal}%</strong> del bruto
                </span>
              </div>

              {/* Tabla de Desglose */}
              <div className="divide-y divide-border rounded-lg border bg-card">
                <div className="flex justify-between p-2.5 font-medium">
                  <span>Monto Total Bruto</span>
                  <span className="font-mono font-bold">
                    Bs. {montoTotal.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {calcResults.retencionITPercent > 0 && (
                  <div className="flex justify-between p-2.5 text-amber-600 dark:text-amber-400">
                    <span>- Retención IT (3%)</span>
                    <span className="font-mono font-bold">
                      - Bs. {calcResults.montoIT.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {calcResults.retencionIUEPercent > 0 && (
                  <div className="flex justify-between p-2.5 text-amber-600 dark:text-amber-400">
                    <span>- Retención IUE ({calcResults.retencionIUEPercent}%)</span>
                    <span className="font-mono font-bold">
                      - Bs. {calcResults.montoIUE.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {calcResults.retencionIVAPercent > 0 && (
                  <div className="flex justify-between p-2.5 text-blue-600 dark:text-blue-400">
                    <span>- Retención RC-IVA / Facturación (13%)</span>
                    <span className="font-mono font-bold">
                      - Bs. {calcResults.montoIVA.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                {calcResults.overheadPercent > 0 && (
                  <div className="flex justify-between p-2.5 text-purple-600 dark:text-purple-400">
                    <span>- Gestión DICYT (5% Overhead)</span>
                    <span className="font-mono font-bold">
                      - Bs. {calcResults.montoOverhead.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between p-2.5 font-bold bg-muted/30">
                  <span>Total Deducciones Retenidas</span>
                  <span className="font-mono text-rose-600">
                    - Bs. {calcResults.totalDeducciones.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Nota Legal */}
              <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-[11px] text-muted-foreground">
                <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <p>
                  Las retenciones tributarias son depositadas automáticamente en las cuentas fiscales del Servicio de Impuestos Nacionales (SIN) en la boleta de pago mensual de la Universidad.
                </p>
              </div>
            </CardContent>

            <CardFooter className="pt-2 border-t flex justify-end gap-2">
              <Button onClick={handleExport} className="w-full text-xs gap-1.5">
                <FileSpreadsheet className="h-4 w-4" /> Generar Comprobante DICYT
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
