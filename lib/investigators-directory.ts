export interface RegisteredInvestigator {
  id: string;
  name: string;
  ci: string;
  type: "INTERNO" | "EXTERNO";
  sede: string;
  facultad: string;
  carrera: string;
  institution: string;
  occupation: string;
  email: string;
  phone: string;
  cityCountry: string;
  mustChangePasswordOnFirstLogin?: boolean;
}

export const INITIAL_INVESTIGATORS: RegisteredInvestigator[] = [
  {
    id: "inv-1",
    name: "Ing. Ariel Denys Camara Arze",
    ci: "6522053",
    type: "INTERNO",
    sede: "Cochabamba",
    facultad: "Facultad de Ciencias de la Tecnología / Ingeniería",
    carrera: "Ing. de Sistemas",
    institution: "UNITEPC",
    occupation: "Doc. Investigador",
    email: "arielcamara@unitepc.edu.bo",
    phone: "79326793",
    cityCountry: "Cochabamba, Bolivia",
  },
  {
    id: "inv-2",
    name: "Ing. Harold Marco Antonio Rojas Torres",
    ci: "9465510",
    type: "INTERNO",
    sede: "Cochabamba",
    facultad: "Facultad de Ciencias de la Tecnología / Ingeniería",
    carrera: "Ing. de Sistemas",
    institution: "UNITEPC",
    occupation: "Doc. Investigador",
    email: "haroldrojas@unitepc.edu.bo",
    phone: "78311416",
    cityCountry: "Cochabamba, Bolivia",
  },
  {
    id: "inv-3",
    name: "Ing. Jose James Claure Ricaldi",
    ci: "5188558",
    type: "INTERNO",
    sede: "Cochabamba",
    facultad: "Facultad de Ciencias de la Tecnología / Ingeniería",
    carrera: "Ing. de Sistemas",
    institution: "UNITEPC",
    occupation: "Dir. Carrera Sistemas",
    email: "jclaure_dis@unitepc.net",
    phone: "72242424",
    cityCountry: "Cochabamba, Bolivia",
  },
  {
    id: "inv-4",
    name: "Dra. María Lorena Orellana Aguilar",
    ci: "4839201",
    type: "INTERNO",
    sede: "Cochabamba",
    facultad: "Facultad de Ciencias de la Salud",
    carrera: "Medicina",
    institution: "UNITEPC",
    occupation: "Directora de Investigaciones Salud",
    email: "lorena.orellana@unitepc.edu.bo",
    phone: "71728394",
    cityCountry: "Cochabamba, Bolivia",
  },
  {
    id: "inv-5",
    name: "Dr. Carlos Eduardo Mendizábal",
    ci: "3920194",
    type: "EXTERNO",
    sede: "-",
    facultad: "-",
    carrera: "-",
    institution: "Hospital Viedma - Centro de Epidemiología",
    occupation: "Consultor de Investigación Clínica",
    email: "cmendizabal@hospitalviedma.gob.bo",
    phone: "76543210",
    cityCountry: "Cochabamba, Bolivia",
  },
  {
    id: "inv-6",
    name: "Ing. Vania Lucía Morales Zenteno",
    ci: "7744112",
    type: "INTERNO",
    sede: "La Paz",
    facultad: "Facultad de Ciencias de la Tecnología / Ingeniería",
    carrera: "Ingeniería Biomédica",
    institution: "UNITEPC",
    occupation: "Docente Investigadora",
    email: "vmorales@unitepc.edu.bo",
    phone: "70594832",
    cityCountry: "La Paz, Bolivia",
  },
];

export function getRegisteredInvestigators(): RegisteredInvestigator[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("sigpri_investigators_directory");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return INITIAL_INVESTIGATORS;
}

export function saveRegisteredInvestigator(newInv: Omit<RegisteredInvestigator, "id">): RegisteredInvestigator {
  const current = getRegisteredInvestigators();
  const created: RegisteredInvestigator = {
    ...newInv,
    id: `inv-${Date.now()}`,
    mustChangePasswordOnFirstLogin: true,
  };
  const updated = [created, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem("sigpri_investigators_directory", JSON.stringify(updated));
  }
  return created;
}
