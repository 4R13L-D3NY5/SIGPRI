# 📌 CONTEXTO TÉCNICO Y FUNCIONAL COMPLETO DE SIGPRI UNITEPC

> **Sistema Integrado de Gestión de Proyectos de Investigación y Fiscalización Presupuestaria (SIGPRI)**  
> **Universidad Técnica Privada Cosmos (UNITEPC)**  
> *Documento de Transferencia y Continuidad para Desarrolladores y Equipos Tácticos.*

---

## 📋 1. RESUMEN DEL SISTEMA

**SIGPRI** es una plataforma web integral, desacoplada y modular diseñada para la administración, fiscalización financiera, evaluación científica/bioética y parametrización de convocatorias y proyectos de investigación de la **Universidad Técnica Privada Cosmos (UNITEPC)**.

El sistema unifica todo el ciclo de vida de un proyecto académico: desde la postulación inicial del docente/investigador bajo el esquema oficial del **Anexo III (Parte 2)**, la revisión por Comités Evaluadores y Personal de Contabilidad, hasta la fiscalización impositiva de retenciones (Ley 843 Bolivia) y el seguimiento del avance físico/financiero (WBS/EDT).

---

## 🏗️ 2. ARQUITECTURA GENERAL Y TECNOLOGÍAS

El proyecto está diseñado bajo una **arquitectura desacoplada** con separación limpia entre la capa de presentación (Frontend SPA/SSR) y el motor de servicios y base de datos (Backend REST API).

```
+--------------------------------------------------------------------------+
|                     FRONTEND - NEXT.JS 15 (REACT 19)                    |
|                                                                          |
|  - Dashboard (/), Directorio (/directorio), Comités (/comites),          |
|    Convocatorias (/convocatorias), Parametrización (/parametrizacion),    |
|    Ejecuciones (/ejecuciones), Portal Público (/portal-publico),         |
|    Autenticación / Roles (/sign-in)                                      |
|                                                                          |
|  - UI: TailwindCSS, Lucide Icons, Shadcn UI, Recharts, Framer-Motion     |
|  - Capa de Servicio: lib/api-service.ts (sigpriApi)                      |
+--------------------------------------------------------------------------+
                                    |
                                    | (Peticiones HTTP REST / JSON)
                                    v
+--------------------------------------------------------------------------+
|                       BACKEND - FASTAPI (PYTHON 3.11+)                  |
|                                                                          |
|  - Endpoints REST (/api/proposals, /api/committees, /api/budget, etc.)   |
|  - Motor Impositivo: Ley 843 (Servicios 15.5%, Bienes 8%, Alquileres 16%) |
|  - ORM / DB: SQLAlchemy + SQLite (local.db) / PostgreSQL (Producción)    |
+--------------------------------------------------------------------------+
```

### Tecnologías Clave:
* **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, Lucide React, Recharts.
* **Backend**: FastAPI, Python 3.11+, SQLAlchemy, Uvicorn, Pydantic.
* **Alertas y UI**: Componentes personalizados `ElegantToast` y `ElegantConfirmModal` sin `alert()`/`confirm()` nativos de navegador.
* **Paleta Institucional UNITEPC**:
  * Azul Marino Institucional: `#0F2A4A` / `#1E3A8A`
  * Verde Esmeralda Acceso: `#059669` / `#10B981`
  * Dorado/Ámbar de Acento: `#D97706` / `#F59E0B`

---

## 👥 3. SISTEMA DE ROLES INSTITUCIONALES (RBAC)

El sistema cuenta con **6 roles institucionales oficiales** que controlan la visibilidad de los módulos y los permisos de edición:

| N° | Rol Institucional | Permisos & Descripción | Módulos Accesibles |
|:---|:---|:---|:---|
| **1** | **Administrador** | Acceso total, gestión de usuarios, parámetros globales y auditoría. | Todos los Módulos |
| **2** | **Jefe Investigador** | Parametrización de gestiones/Anexo III, convocatorias y reportes ejecutivos. | Dashboard, Directorio, Comités, Ejecuciones, Convocatorias, Parametrización |
| **3** | **Directorio** | Monitoreo ejecutivo de alto nivel (vista de lectura) y reportes consolidados. | Dashboard, Directorio, Ejecuciones |
| **4** | **Investigador** | Postulación de proyectos, carga de Anexo III y seguimiento de mis proyectos. | Dashboard, Directorio |
| **5** | **Comité Evaluador** | Evaluación científica y bioética, dictámenes, puntajes y asignación de proyectos. | Dashboard, Directorio, Comités |
| **6** | **Contabilidad** | Fiscalización presupuestaria, retenciones impositivas Ley 843 y desembolsos. | Dashboard, Directorio, Comités, Ejecuciones |

---

## 🧩 4. DETALLE DE MÓDULOS DEL SISTEMA

### 1. 📊 Dashboard Central (`/` / `app/(dashboard)/page.tsx`)
* **KPIs Animados**: Total de Proyectos SIGPRI, Presupuesto Ejecutado, Convocatorias Activas, Evaluaciones Pendientes.
* **Gráficos en Tiempo Real**: Tendencia mensual de postulaciones, evaluaciones y aprobaciones (Recharts), y distribución por facultad/área.
* **Acceso Rápido a Proyectos y Calculadora de Retenciones**.

### 2. 📁 Directorio Unificado de Proyectos y Propuestas (`/directorio` / `app/(dashboard)/projects/page.tsx`)
* **Unificación de Proyectos y Propuestas**: Listado centralizado con conmutador universal entre **Vista de Tarjetas** y **Vista de Tabla**.
* **Filtros Avanzados**: Por Gestión (`1-2026`, `2-2026`...), Estado (`En Propuesta`, `En Evaluación`, `En Observación`, `Aprobado en Ejecución`, `Concluido`, `Publicado`, `Cancelado`) y Búsqueda por palabra clave.
* **Modales Interactivos de Gestión**:
  * 👁️ **Detalles del Proyecto**: Resumen del Anexo III Parte 2, investigadores y equipo.
  * 📊 **WBS / EDT (Work Breakdown Structure)**: Visualización y avance porcentual por fases.
  * 🧮 **Presupuesto y Retenciones Ley 843**: Cálculo automático de impuestos bolivianos:
    * *Servicios*: 15.5% (IUE 12.5% + IT 3%)
    * *Bienes*: 8.0% (IUE 5.0% + IT 3%)
    * *Alquileres*: 16.0% (RC-IVA 13% + IT 3%)
  * 📜 **Historial de Auditoría**: Trazabilidad completa de cambios de estado, fechas y responsables.
  * 🚫 **Cancelación y Diagrama de Flujo**: Modal de cancelación con justificación y flujo visual de aprobación.

### 3. 👥 Comités Evaluadores y Contabilidad (`/comites` / `app/(dashboard)/committees/page.tsx`)
* **Pestaña 1: Comités Evaluadores Científicos y Bioéticos**:
  * Creación y gestión de comités por área (Salud, Tecnología, Bioquímica, etc.).
  * Asignación de proyectos a comités específicos.
  * Registro de miembros docentes evaluadores internos (UNITEPC) y externos con datos de grado, titulación e institución.
* **Pestaña 2: Personal de Contabilidad y Fiscalización**:
  * Registro de personal contable con asignación por sede (Cochabamba, La Paz, Santa Cruz, etc.).
  * Asignación de proyectos a fiscalizadores contables específicos.
  * Habilitación/deshabilitación de accesos al módulo.

### 4. 📈 Monitoreo de Ejecuciones Presupuestarias (`/ejecuciones` / `app/(dashboard)/ejecuciones/page.tsx`)
* Seguimiento de desembolsos aprobados vs. ejecutados.
* Control de retenciones tributarias efectivamente aplicadas.
* Conmutador de vista Tarjetas / Tabla.

### 5. 📢 Convocatorias de Investigación (`/convocatorias` / `app/(dashboard)/campaigns/page.tsx`)
* **Módulo Administrativo de Convocatorias**:
  * Creación y Apertura de Convocatorias Institucionales, por Facultad o por Carrera.
  * Modal de Edición de Convocatoria (Título, Código, Gestión, Alcance, Fechas de Apertura/Cierre, Estado y Objetivos).
  * Eliminación de convocatorias con modal elegante de confirmación.
  * Conmutador de vista Tarjetas / Tabla.

### 6. ⚙️ Parametrización y Configuración del Sistema (`/parametrizacion` / `app/(dashboard)/settings/page.tsx`)
* **Pestaña 1: 🗓️ Gestión de Gestiones Académicas**:
  * Creación de semestres académicas (`1-2026`, `2-2026`, `1-2027`...).
  * Control de estado (`🟢 Vigente / Aperturada`, `🟣 En Evaluación`, `🔴 Cerrada / Concluida`, `🟡 Archivada`).
  * Botón para **Fijar Gestión Activa Oficial** en todo el sistema.
* **Pestaña 2: 📝 Estructura de Proyectos (Anexo III - Parte 2)**:
  * Parametrización dinámica por gestión de los puntos solicitados para las propuestas.
  * **Interruptores 🟢/🔴**: Habilitar/Deshabilitar puntos para una gestión específica.
  * **Interruptores 📌 Obligatorio / ⚪ Opcional**: Exigir o hacer optativo cada apartado.
  * **Botones ⬆️ / ⬇️**: Reordenar la secuencia de los puntos del perfil/proyecto.
  * **Añadir Puntos Personalizados**: Permite agregar apartados dinámicos como *Estrategias de Difusión*, *Conclusiones*, *Recomendaciones*, *Impacto Ambiental*, etc.
* **Pestaña 3: ⚙️ Parámetros Institucionales**:
  * Ajustes de Normativa APA 7ma Edición (Adaptación PAT UNITEPC) y lista oficial de sedes nacionales.

### 7. 🌐 Portal Público y Registro de Investigadores (`/portal-publico`, `/sign-in`)
* **Portal Público**: Muestra proyectos concluidos y aprobados a la comunidad.
* **Registro de Investigadores**: Formulario con captcha de seguridad antispam (reCAPTCHA) para postulantes externos.

---

## 🗂️ 5. ESTRUCTURA DE ARCHIVOS CLAVE DEL PROYECTO

```
c:/laragon/www/agentes/acme-community-agent/
├── app/
│   ├── (dashboard)/
│   │   ├── page.tsx                     # Dashboard central (KPIs y Gráficos)
│   │   ├── projects/page.tsx            # Directorio Unificado de Proyectos y Propuestas
│   │   ├── committees/page.tsx          # Comités Evaluadores y Personal de Contabilidad
│   │   ├── ejecuciones/page.tsx          # Monitoreo de Ejecuciones Presupuestarias
│   │   ├── campaigns/page.tsx           # Gestión Administrativa de Convocatorias
│   │   ├── settings/page.tsx            # Parametrización (Gestiones y Anexo III Parte 2)
│   │   └── layout.tsx                   # Layout del Dashboard con Sidebar
│   ├── public/page.tsx                  # Portal Público Transparente
│   ├── sign-in/page.tsx                 # Selección de Roles y Registro con reCAPTCHA
│   ├── layout.tsx                       # Layout Raíz (Tema Claro/Oscuro)
│   └── globals.css                      # Estilos Globales CSS y Animaciones
├── components/
│   ├── sidebar.tsx                      # Sidebar Lateral con Isotipo v2 e Indicadores
│   ├── header.tsx                       # Barra Superior con Línea Acento UNITEPC
│   └── ui/
│       ├── elegant-toast.tsx            # Componente de Notificaciones Toast y Modales Confirm
│       ├── badge.tsx, button.tsx, card.tsx, input.tsx, sidebar.tsx
├── lib/
│   ├── api-service.ts                   # Capa de Servicio API Desacoplada (sigpriApi)
│   ├── sigpri-store.ts                  # Tienda de Datos Maestra de Proyectos
│   ├── sigpri-data.ts                   # Motor de Retenciones Impositivas Ley 843
│   ├── unitepc-structure.ts             # Estructura Oficial de Sedes, Facultades y Carreras UNITEPC
│   └── config.ts                        # Configuración Global (communityName: SIGPRI UNITEPC)
├── public/
│   └── sigpri_logo.jpg                  # Isotipo v2 Minimalista de Proyectos (Sin texto interno)
├── CONTEXTO.md                          # Este documento de contexto y guía de continuidad
├── .env.local                           # Variables de Entorno Locales (COMMUNITY_NAME=SIGPRI UNITEPC)
└── package.json                         # Dependencias y Scripts de Ejecución
```

---

## 🚀 6. GUÍA DE INSTALACIÓN Y EJECUCIÓN EN OTRA MÁQUINA

Para clonar y poner en marcha el proyecto en una nueva computadora o servidor, siga estos pasos:

### 1. Clonar el Repositorio desde GitHub:
```bash
git clone https://github.com/4R13L-D3NY5/SIGPRI.git
cd SIGPRI
```

### 2. Instalar Dependencias del Frontend:
```bash
npm install
# o con pnpm / yarn:
pnpm install
```

### 3. Verificar Archivo de Variables de Entorno (`.env.local`):
Asegúrese de tener un archivo `.env.local` en la raíz con el siguiente contenido:
```env
ALLOW_ADMIN_DEMO_MODE=true
ADMIN_DEMO_MODE=true
COMMUNITY_NAME=SIGPRI UNITEPC
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
BETTER_AUTH_SECRET=demo-secret-key-unitepc-123456789012345
```

### 4. Iniciar el Servidor de Desarrollo Frontend:
```bash
npm run dev -- -p 3001
```
*El sistema estará disponible en:* **`http://localhost:3001`**

### 5. Iniciar el Backend FastAPI (Opcional para Modo Servidor API):
Si desea ejecutar el backend de base de datos Python en paralelo:
```bash
# Desde la carpeta backend del proyecto:
pip install fastapi uvicorn sqlalchemy pydantic
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
*Documentación de la API en:* **`http://127.0.0.1:8000/docs`**

---

## 📌 7. ESTADO DE AVANCE Y PRÓXIMOS PASOS RECOMENDADOS

1. **Persistencia REST Directa**: La capa `lib/api-service.ts` ya está implementada y mapea los endpoints REST `/api/proposals`, `/api/committees`, `/api/calls` y `/api/gestiones`.
2. **Generación de Reportes PDF**: Integrar una librería de exportación como `@react-pdf/renderer` o `jspdf` en `/directorio` para descargar fichas completas del Anexo III Parte 2.
3. **Notificaciones por Correo**: Conectar un servicio SMTP o Resend para enviar avisos automáticos a los docentes cuando su propuesta cambie a estado `Aprobado` o `En Observación`.

---
*SIGPRI UNITEPC — Sistema de Gestión de Proyectos de Investigación y Fiscalización Presupuestaria.*
