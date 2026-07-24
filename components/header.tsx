"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface HeaderProps {
  description?: string;
  title: string;
}

export function Header({ title, description }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  const userName = session?.user?.name || "Dra. Maria Lorena Orellana Aguilar";
  const userRole = "Rol";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    try {
      authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/sign-in";
          },
        },
      });
    } catch (e) {
      console.warn("Sign out fallback redirected to /sign-in", e);
    }
    // Redirección inmediata garantizada
    window.location.href = "/sign-in";
  };


  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-md relative overflow-hidden">
      {/* LÍNEA ELEGANTE PALETA UNITEPC */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#0F2A4A] via-emerald-500 to-amber-500" />

      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="min-w-0">
          <h1 className="truncate font-bold text-base leading-tight text-foreground">{title}</h1>
          {description && (
            <p className="truncate text-muted-foreground text-xs leading-none">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Secuencia estricta: Nombre -> Modo -> Botón (Avatar desplegable) */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* 1. Nombre (Dra. Maria Lorena Orellana Aguilar | Rol) */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="font-medium text-xs text-foreground">
            {userName} <span className="text-muted-foreground font-normal">| {userRole}</span>
          </span>
        </div>

        {/* 2. Modo (Toggle Oscuro/Claro) */}
        <ThemeToggle />

        {/* 3. Botón (Avatar con desplegable Ver Perfil / Salir) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 p-1 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-unitepc-lila"
            aria-label="Menú de usuario"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-unitepc-lila font-bold text-white text-xs shadow-sm">
              {userInitials || "MO"}
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Desplegable Ver Perfil / Salir */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-popover p-1 shadow-md ring-1 ring-black/5 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-2 border-b border-border">
                <p className="font-semibold text-xs text-popover-foreground">{userName}</p>
                <p className="text-[11px] text-muted-foreground">{userName} | {userRole}</p>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  href={"/settings" as any}
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <User className="h-4 w-4 text-unitepc-teal" />
                  <span>Ver Perfil</span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
