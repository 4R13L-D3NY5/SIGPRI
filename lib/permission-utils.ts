export function getActiveUserRole(): string {
  if (typeof window !== "undefined") {
    const role = localStorage.getItem("sigpri_user_role");
    if (role) return role;
  }
  return "admin"; // Default fallback
}

export function canEditProjectFields(userRole: string, status: string): boolean {
  if (userRole === "admin" || userRole === "jefe_investigador") {
    return true;
  }

  if (userRole === "investigador") {
    return status === "En Propuesta";
  }

  return false;
}

export function canEditBudget(userRole: string, status: string): boolean {
  if (userRole === "admin" || userRole === "jefe_investigador" || userRole === "contabilidad") {
    return true;
  }
  if (userRole === "investigador") {
    return status === "En Propuesta";
  }
  return false;
}
