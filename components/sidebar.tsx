"use client";

import {
  Calculator,
  ClipboardCheck,
  FileUp,
  FolderGit2,
  FolderTree,
  Globe,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Network,
  PanelLeft,
  Settings,
  ShieldCheck,
  Sliders,
  UserCheck,
  User,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  Sidebar as SidebarRoot,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

export const allSigpriModules = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "jefe_investigador", "directorio", "investigador", "comite", "contabilidad"] },
  { href: "/directorio", label: "Proyectos y Propuestas", icon: FolderTree, roles: ["admin", "jefe_investigador", "directorio", "investigador", "comite", "contabilidad"] },
  { href: "/comites", label: "Comités y Contabilidad", icon: UserCheck, roles: ["admin", "jefe_investigador", "comite", "contabilidad"] },
  { href: "/ejecuciones", label: "Ejecuciones", icon: Network, roles: ["admin", "jefe_investigador", "directorio", "contabilidad"] },
  { href: "/convocatorias", label: "Convocatorias", icon: Megaphone, roles: ["admin", "jefe_investigador"] },
  { href: "/parametrizacion", label: "Parametrización", icon: Sliders, roles: ["admin", "jefe_investigador"] },
];

export function Sidebar({ communityName }: { communityName?: string }) {
  const { setOpenMobile, toggleSidebar, state } = useSidebar();
  const [userRole, setUserRole] = useState<string>("admin");
  const [userLabel, setUserLabel] = useState<string>("Administrador");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("sigpri_user_role");
      const savedUserJson = localStorage.getItem("sigpri_current_user");

      if (savedRole) {
        setUserRole(savedRole);
      }
      if (savedUserJson) {
        try {
          const parsed = JSON.parse(savedUserJson);
          if (parsed?.roleLabel) setUserLabel(parsed.roleLabel);
          else if (savedRole === "admin") setUserLabel("Administrador");
          else if (savedRole === "jefe_investigador") setUserLabel("Jefe Investigador");
          else if (savedRole === "directorio") setUserLabel("Directorio");
          else if (savedRole === "investigador") setUserLabel("Investigador");
          else if (savedRole === "comite") setUserLabel("Comité Evaluador");
          else if (savedRole === "contabilidad") setUserLabel("Contabilidad y Retenciones");
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  return (
    <SidebarRoot collapsible="icon">
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary font-extrabold text-primary-foreground text-sm shadow-md">
            S
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate font-bold text-sm text-foreground">
              {communityName || "SIGPRI"}
            </span>
            <span className="block truncate text-[10px] font-semibold text-primary uppercase tracking-wider">
              UNITEPC
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-0" />

      {/* ROL ACTUAL BADGE */}
      <div className="px-3 py-2 group-data-[collapsible=icon]:hidden">
        <div className="p-2 rounded-lg bg-muted/40 border border-border space-y-1">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
            Rol Activo:
          </span>
          <Badge variant="outline" className="w-full justify-center bg-primary/10 border-primary/30 text-primary font-bold text-[11px] truncate">
            {userLabel}
          </Badge>
        </div>
      </div>

      <SidebarSeparator className="mx-0" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Módulos Accesibles
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Suspense>
                <NavItems currentRole={userRole} onNavigate={() => setOpenMobile(false)} />
              </Suspense>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="mx-0" />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="sm"
              tooltip="Cambiar Rol / Iniciar Sesión"
              className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
            >
              <Link href="/sign-in">
                <LogOut className="h-4 w-4 text-rose-400" />
                <span>Cambiar de Rol</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleSidebar()}
              size="sm"
              tooltip={state === "collapsed" ? "Expandir menú" : "Retraer menú"}
              className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
            >
              <PanelLeft className="h-4 w-4" />
              <span>{state === "collapsed" ? "Expandir" : "Retraer menú"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </SidebarRoot>
  );
}

function NavItems({ currentRole, onNavigate }: { currentRole: string; onNavigate: () => void }) {
  const pathname = usePathname();

  // Filtrar los módulos permitidos según el rol activo
  const visibleModules = allSigpriModules.filter((module) =>
    module.roles.includes(currentRole) || currentRole === "admin"
  );

  return visibleModules.map((item) => {
    const isActive =
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          onClick={onNavigate}
          tooltip={item.label}
          className={
            isActive
              ? "bg-primary/10 text-primary font-bold dark:bg-primary/20 dark:text-primary"
              : ""
          }
        >
          <Link href={item.href as any}>
            <item.icon className={isActive ? "text-primary" : ""} />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  });
}
