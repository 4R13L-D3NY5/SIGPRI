"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProposalsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/directorio");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-xs font-semibold text-muted-foreground">
      Redirigiendo al directorio unificado de Proyectos y Propuestas...
    </div>
  );
}
