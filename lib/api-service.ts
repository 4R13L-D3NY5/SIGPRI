"use client";

import { ProjectItem } from "@/app/(dashboard)/projects/page";
import { ResearchCall } from "@/app/(dashboard)/campaigns/page";
import { Committee, AccountingOfficer } from "@/app/(dashboard)/committees/page";
import { AcademicGestion, AcademicSectionItem } from "@/app/(dashboard)/settings/page";
import { INITIAL_MASTER_PROJECTS } from "./sigpri-store";

// DIRECCIÓN DE LA API BACKEND DESACOPLADA (Configurable por variable de entorno)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8008/api";

// CLAVES DE ALMACENAMIENTO CACHÉ
const KEYS = {
  PROJECTS: "sigpri_projects_master_data_v2",
  CALLS: "sigpri_research_calls_data_v2",
  COMMITTEES: "sigpri_committees_master_data_v2",
  ACCOUNTING: "sigpri_accounting_officers_data_v1",
  GESTIONES: "sigpri_gestiones_master_v1",
  SECTIONS: "sigpri_sections_anexo_iii_v1",
  USER: "sigpri_current_user",
  ROLE: "sigpri_user_role",
};

// HELPER PARA ACCESO SEGURO A CACHÉ EN NAVEGADOR
function getCache<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`[SigpriStore] Error leyendo caché para ${key}:`, e);
    return fallback;
  }
}

function setCache<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[SigpriStore] Error guardando caché para ${key}:`, e);
  }
}

/**
 * SERVICIO DE API DESACOPLADO (SIGPRI API SERVICE)
 * Permite la comunicación desacoplada entre el frontend y el backend FastAPI,
 * manteniendo sincronización de caché para funcionamiento offline/SSR.
 */
export const sigpriApi = {
  // === PROYECTOS Y PROPUESTAS ===
  projects: {
    async getAll(): Promise<ProjectItem[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/proposals`, { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Mapear respuesta backend a la estructura de ProjectItem del frontend
            const mapped: ProjectItem[] = data.map((p: any) => ({
              id: p.id ? `proj-${p.id}` : p.code,
              code: p.code || `SIGPRI-2026-${p.id}`,
              title: p.title,
              leadInvestigator: p.gestora || p.leadInvestigator || "Investigador UNITEPC",
              facultyArea: p.area || p.facultyArea || "Investigación Institucional",
              managementYear: p.start_date ? p.start_date.substring(0, 4) : "2026",
              status: p.status || "En Propuesta",
              requestedBudget: p.total_budget || p.requestedBudget || 50000,
              approvedBudget: p.total_budget || p.approvedBudget || 50000,
              taxCategory: p.taxCategory || "servicios",
              wbsProgress: p.progress_pct || p.wbsProgress || 0,
              abstractText: p.summary || p.abstractText || "Proyecto registrado en la plataforma SIGPRI.",
              createdAt: p.created_at ? p.created_at.substring(0, 10) : new Date().toISOString().substring(0, 10),
              statusHistory: p.statusHistory || [],
            }));
            setCache(KEYS.PROJECTS, mapped);
            return mapped;
          }
        }
      } catch (e) {
        // Fallback a caché local en caso de desconexión
      }
      return getCache(KEYS.PROJECTS, INITIAL_MASTER_PROJECTS);
    },

    async saveAll(projects: ProjectItem[]): Promise<boolean> {
      setCache(KEYS.PROJECTS, projects);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("sigpri_data_updated", { detail: projects }));
      }

      try {
        await fetch(`${API_BASE_URL}/projects/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projects),
        });
        return true;
      } catch (e) {
        return false;
      }
    },

    async updateSingle(project: ProjectItem): Promise<ProjectItem[]> {
      const current = await this.getAll();
      const index = current.findIndex((p) => p.id === project.id);
      let updatedList: ProjectItem[];
      if (index >= 0) {
        updatedList = [...current];
        updatedList[index] = project;
      } else {
        updatedList = [project, ...current];
      }
      await this.saveAll(updatedList);
      return updatedList;
    },
  },

  // === CONVOCATORIAS DE INVESTIGACIÓN ===
  calls: {
    async getAll(fallbackCalls: ResearchCall[]): Promise<ResearchCall[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/calls`, { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCache(KEYS.CALLS, data);
            return data;
          }
        }
      } catch (e) {}
      return getCache(KEYS.CALLS, fallbackCalls);
    },

    async saveAll(calls: ResearchCall[]): Promise<boolean> {
      setCache(KEYS.CALLS, calls);
      try {
        await fetch(`${API_BASE_URL}/calls/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(calls),
        });
        return true;
      } catch (e) {
        return false;
      }
    },
  },

  // === COMITÉS EVALUADORES ===
  committees: {
    async getAll(fallbackCommittees: Committee[]): Promise<Committee[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/committees`, { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCache(KEYS.COMMITTEES, data);
            return data;
          }
        }
      } catch (e) {}
      return getCache(KEYS.COMMITTEES, fallbackCommittees);
    },

    async saveAll(committees: Committee[]): Promise<boolean> {
      setCache(KEYS.COMMITTEES, committees);
      try {
        await fetch(`${API_BASE_URL}/committees/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(committees),
        });
        return true;
      } catch (e) {
        return false;
      }
    },
  },

  // === PERSONAL DE CONTABILIDAD Y FISCALIZACIÓN ===
  accounting: {
    async getAll(fallbackOfficers: AccountingOfficer[]): Promise<AccountingOfficer[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/accounting-officers`, { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCache(KEYS.ACCOUNTING, data);
            return data;
          }
        }
      } catch (e) {}
      return getCache(KEYS.ACCOUNTING, fallbackOfficers);
    },

    async saveAll(officers: AccountingOfficer[]): Promise<boolean> {
      setCache(KEYS.ACCOUNTING, officers);
      try {
        await fetch(`${API_BASE_URL}/accounting-officers/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(officers),
        });
        return true;
      } catch (e) {
        return false;
      }
    },
  },

  // === GESTIONES ACADÉMICAS ===
  gestiones: {
    async getAll(fallbackGestiones: AcademicGestion[]): Promise<AcademicGestion[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/gestiones`, { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCache(KEYS.GESTIONES, data);
            return data;
          }
        }
      } catch (e) {}
      return getCache(KEYS.GESTIONES, fallbackGestiones);
    },

    async saveAll(gestiones: AcademicGestion[]): Promise<boolean> {
      setCache(KEYS.GESTIONES, gestiones);
      try {
        await fetch(`${API_BASE_URL}/gestiones/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gestiones),
        });
        return true;
      } catch (e) {
        return false;
      }
    },
  },

  // === ESTRUCTURA DE PROYECTOS ANEXO III (PARTE 2) ===
  sections: {
    async getAll(fallbackSections: AcademicSectionItem[]): Promise<AcademicSectionItem[]> {
      try {
        const res = await fetch(`${API_BASE_URL}/sections-anexo-iii`, { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCache(KEYS.SECTIONS, data);
            return data;
          }
        }
      } catch (e) {}
      return getCache(KEYS.SECTIONS, fallbackSections);
    },

    async saveAll(sections: AcademicSectionItem[]): Promise<boolean> {
      setCache(KEYS.SECTIONS, sections);
      try {
        await fetch(`${API_BASE_URL}/sections-anexo-iii/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sections),
        });
        return true;
      } catch (e) {
        return false;
      }
    },
  },

  // === USUARIO Y ROL ACTUAL DE SESIÓN ===
  session: {
    getRole(): string {
      return getCache(KEYS.ROLE, "admin");
    },
    setRole(role: string) {
      setCache(KEYS.ROLE, role);
    },
    getUser() {
      return getCache(KEYS.USER, null);
    },
    setUser(user: any) {
      setCache(KEYS.USER, user);
      if (user?.role) setCache(KEYS.ROLE, user.role);
    },
  },
};
