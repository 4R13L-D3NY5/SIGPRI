"use client";

import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CommitteeMember {
  name: string;
  role: "Presidente" | "Secretario Técnico" | "Evaluador Par" | "Vocal";
  degree: string;
  institution: string;
}

interface Committee {
  id: string;
  code: string;
  name: string;
  area: string;
  status: "Activo" | "En Sesión" | "Receso";
  members: CommitteeMember[];
  assignedProjectsCount: number;
  completedReviewsCount: number;
  nextSessionDate: string;
}

const initialCommittees: Committee[] = [
  {
    id: "1",
    code: "COM-ING-2026",
    name: "Comité Evaluador de Ingeniería, Robótica y Tecnología",
    area: "Ingeniería y Tecnología",
    status: "En Sesión",
    assignedProjectsCount: 14,
    completedReviewsCount: 9,
    nextSessionDate: "2026-07-28",
    members: [
      { name: "Dr. Gustavo Alarcón", role: "Presidente", degree: "Ph.D. en Ciencias de la Computación", institution: "DICYT / UMSA" },
      { name: "Dra. Patricia Terrazas", role: "Secretario Técnico", degree: "M.Sc. en Ingeniería Mecatrónica", institution: "DICYT" },
      { name: "Ing. Roberto Siles", role: "Evaluador Par", degree: "M.Sc. en Sistemas Eléctricos", institution: "UAGRM" },
      { name: "Dra. Carmen Villarroel", role: "Evaluador Par", degree: "Ph.D. en Ciencia de Datos", institution: "UMSS" },
    ],
  },
  {
    id: "2",
    code: "COM-BIO-2026",
    name: "Comité de Bioética e Investigación Médica",
    area: "Ciencias de la Salud & Bioética",
    status: "Activo",
    assignedProjectsCount: 18,
    completedReviewsCount: 12,
    nextSessionDate: "2026-08-02",
    members: [
      { name: "Dr. Fernando Morales", role: "Presidente", degree: "Ph.D. en Infectología y Bioética", institution: "Facultad de Medicina" },
      { name: "Dra. Lorena Bazán", role: "Secretario Técnico", degree: "Ph.D. en Biotecnología Médica", institution: "DICYT" },
      { name: "Dr. Oscar Campero", role: "Evaluador Par", degree: "M.Sc. en Farmacología", institution: "Instituto de Genética" },
    ],
  },
  {
    id: "3",
    code: "COM-NAT-2026",
    name: "Comité de Ciencias Exactas, Físicas y Químicas",
    area: "Ciencias Puras y Naturales",
    status: "Activo",
    assignedProjectsCount: 10,
    completedReviewsCount: 8,
    nextSessionDate: "2026-08-05",
    members: [
      { name: "Dr. Raúl Zeballos", role: "Presidente", degree: "Ph.D. en Ciencias Químicas", institution: "Instituto de Nanotecnología" },
      { name: "MSc. Claudia Paredes", role: "Secretario Técnico", degree: "M.Sc. en Física Teórica", institution: "DICYT" },
      { name: "Dr. Hernán Rocha", role: "Evaluador Par", degree: "Ph.D. en Astronomía", institution: "Observatorio Nacional" },
    ],
  },
  {
    id: "4",
    code: "COM-AGR-2026",
    name: "Comité de Agropecuaria y Recursos Medioambientales",
    area: "Ciencias Agrícolas y Pecuarias",
    status: "Receso",
    assignedProjectsCount: 6,
    completedReviewsCount: 6,
    nextSessionDate: "2026-08-20",
    members: [
      { name: "Ing. Gonzalo Tapia", role: "Presidente", degree: "M.Sc. en Suelos y Agua", institution: "Agronomía DICYT" },
      { name: "Dra. Isabel Mamani", role: "Secretario Técnico", degree: "Ph.D. en Genética Vegetal", institution: "Centro de Investigación Agrícola" },
    ],
  },
];

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>(initialCommittees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("TODAS");
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);

  // Form State for new Evaluator Member
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberDegree, setNewMemberDegree] = useState("");
  const [newMemberInstitution, setNewMemberInstitution] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<CommitteeMember["role"]>("Evaluador Par");

  const filteredCommittees = committees.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === "TODAS" || c.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommittee || !newMemberName.trim()) return;

    const newMember: CommitteeMember = {
      name: newMemberName,
      role: newMemberRole,
      degree: newMemberDegree || "M.Sc. Especialista",
      institution: newMemberInstitution || "DICYT Par Evaluador Externo",
    };

    const updatedCommittees = committees.map((c) => {
      if (c.id === selectedCommittee.id) {
        return {
          ...c,
          members: [...c.members, newMember],
        };
      }
      return c;
    });

    setCommittees(updatedCommittees);
    setSelectedCommittee({
      ...selectedCommittee,
      members: [...selectedCommittee.members, newMember],
    });
    setShowAddMember(false);
    setNewMemberName("");
    setNewMemberDegree("");
    setNewMemberInstitution("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      <Header
        title="Comités Evaluadores DICYT"
        description="Gestión de evaluadores científicos pares, comités de ética y asignación de arbitraje de proyectos"
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Banner superior */}
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-bold text-foreground">Comités Científicos y de Bioética DICYT</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Supervisión de evaluación de pares evaluadores, dictámenes y actas de resolución de proyectos.
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1.5 text-xs font-semibold self-start sm:self-auto">
            {committees.reduce((acc, c) => acc + c.members.length, 0)} Evaluadores Registrados
          </Badge>
        </div>

        {/* Buscador & Filtro por Área */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por comité o área de conocimiento..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {["TODAS", "Ingeniería y Tecnología", "Ciencias de la Salud & Bioética", "Ciencias Puras y Naturales", "Ciencias Agrícolas y Pecuarias"].map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
                  selectedArea === area
                    ? "bg-primary text-primary-foreground border-primary font-semibold"
                    : "bg-card text-muted-foreground hover:bg-accent border-border"
                }`}
              >
                {area === "TODAS" ? "Todas las Áreas" : area.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Comités */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredCommittees.map((committee) => (
            <Card key={committee.id} className="flex flex-col justify-between hover:shadow-md transition-all border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {committee.code}
                  </Badge>
                  <Badge
                    className={
                      committee.status === "En Sesión"
                        ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                        : committee.status === "Activo"
                        ? "bg-blue-500/15 text-blue-600 border-blue-500/30"
                        : "bg-slate-500/15 text-slate-600 border-slate-500/30"
                    }
                  >
                    {committee.status}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold leading-snug mt-2 text-foreground">
                  {committee.name}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Área: <strong className="text-foreground">{committee.area}</strong>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-xs pb-3">
                {/* Resumen de Carga de Evaluación */}
                <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3 border">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Proyectos Asignados</span>
                    <span className="font-mono font-bold text-base text-foreground">{committee.assignedProjectsCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Dictámenes Listos</span>
                    <span className="font-mono font-bold text-base text-emerald-600">
                      {committee.completedReviewsCount} / {committee.assignedProjectsCount}
                    </span>
                  </div>
                </div>

                {/* Próxima Sesión */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>Próxima Sesión Ordinaria: <strong className="text-foreground">{committee.nextSessionDate}</strong></span>
                  </div>
                </div>

                {/* Integrantes Preview */}
                <div>
                  <span className="block font-semibold mb-2 text-foreground text-xs">
                    Miembros del Comité ({committee.members.length}):
                  </span>
                  <div className="space-y-1.5">
                    {committee.members.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-md bg-background p-2 border text-[11px]">
                        <div>
                          <span className="font-semibold text-foreground block">{m.name}</span>
                          <span className="text-muted-foreground text-[10px]">{m.degree} &bull; {m.institution}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {m.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-3 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1"
                  onClick={() => setSelectedCommittee(committee)}
                >
                  <Users className="h-3.5 w-3.5" /> Gestionar Miembros
                </Button>
                <Button size="sm" className="text-xs gap-1">
                  <FileCheck className="h-3.5 w-3.5" /> Asignar Proyectos
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Modal de Gestión de Miembros */}
        {selectedCommittee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-xl border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <Badge variant="outline" className="font-mono">{selectedCommittee.code}</Badge>
                  <h2 className="text-lg font-bold text-foreground mt-1">{selectedCommittee.name}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCommittee(null);
                    setShowAddMember(false);
                  }}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-accent"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              {!showAddMember ? (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm">Lista de Integrantes Registrados</h3>
                    <Button size="sm" onClick={() => setShowAddMember(true)} className="gap-1">
                      <UserPlus className="h-3.5 w-3.5" /> Agregar Evaluador
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {selectedCommittee.members.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div>
                          <span className="font-bold text-foreground block text-sm">{m.name}</span>
                          <span className="text-muted-foreground">{m.degree}</span>
                          <span className="block text-[10px] text-muted-foreground mt-0.5">{m.institution}</span>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20">{m.role}</Badge>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 flex justify-end">
                    <Button variant="outline" onClick={() => setSelectedCommittee(null)}>
                      Cerrar
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddMember} className="space-y-4 text-xs">
                  <h3 className="font-bold text-sm text-foreground">Agregar Nuevo Evaluador Par</h3>
                  <div>
                    <label className="block font-semibold mb-1">Nombre Completo</label>
                    <Input
                      required
                      placeholder="Ej. Dr. Mario Ugarte Pinto"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Grado Académico / Titulación</label>
                      <Input
                        placeholder="Ej. Ph.D. en Biología Molecular"
                        value={newMemberDegree}
                        onChange={(e) => setNewMemberDegree(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Rol en el Comité</label>
                      <select
                        className="w-full h-9 rounded-md border bg-background px-3 text-xs outline-none"
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value as CommitteeMember["role"])}
                      >
                        <option value="Evaluador Par">Evaluador Par</option>
                        <option value="Presidente">Presidente</option>
                        <option value="Secretario Técnico">Secretario Técnico</option>
                        <option value="Vocal">Vocal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Institución u Origen</label>
                    <Input
                      placeholder="Ej. Centro de Investigaciones Químicas"
                      value={newMemberInstitution}
                      onChange={(e) => setNewMemberInstitution(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowAddMember(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Guardar Evaluador
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
