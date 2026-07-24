"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastState {
  message: string;
  type?: "success" | "error" | "info";
  id?: number;
}

export function ElegantToast({ 
  toast, 
  onClose 
}: { 
  toast: ToastState | null; 
  onClose: () => void 
}) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] animate-in slide-in-from-top-4 fade-in duration-300">
      <div 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md max-w-md ${
          toast.type === "error"
            ? "bg-rose-950/90 text-rose-200 border-rose-500/40"
            : toast.type === "info"
            ? "bg-sky-950/90 text-sky-200 border-sky-500/40"
            : "bg-emerald-950/90 text-emerald-200 border-emerald-500/40"
        }`}
      >
        {toast.type === "error" ? (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        ) : toast.type === "info" ? (
          <Info className="w-5 h-5 text-sky-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}

        <span className="text-xs font-bold leading-tight flex-1">{toast.message}</span>

        <button 
          onClick={onClose}
          className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function ElegantConfirmModal({
  isOpen,
  title = "Confirmar Acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDanger = false,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-full ${isDanger ? "bg-rose-500/10 text-rose-400" : "bg-primary/10 text-primary"}`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs font-bold border border-border hover:bg-muted text-foreground transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors shadow ${
              isDanger ? "bg-rose-600 hover:bg-rose-700" : "bg-primary hover:bg-primary/90"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
