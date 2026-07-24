import { ProjectItem } from "@/app/(dashboard)/projects/page";
import { WbsTask } from "@/app/(dashboard)/projects/_components/project-wbs-modal";

export function generateProjectWbsPdfReport(project: ProjectItem, tasks: WbsTask[]) {
  const leafTasks = tasks.filter((t) => !t.isParent);
  const overallProgress = leafTasks.length > 0 
    ? Math.round(leafTasks.reduce((acc, t) => acc + t.progress, 0) / leafTasks.length)
    : 0;

  const nowStr = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const tasksHtml = tasks.map((t) => {
    const isParent = t.isParent;
    const historyCount = t.weeklyHistory?.length || 0;
    const latestObs = t.weeklyHistory && t.weeklyHistory.length > 0 
      ? t.weeklyHistory[0] 
      : null;

    return `
      <tr class="${isParent ? "parent-row" : "subtask-row"}">
        <td class="center font-mono font-bold">${t.wbsCode}</td>
        <td class="${isParent ? "bold text-primary" : "pl-4"}">${t.title}</td>
        <td class="text-muted">${t.description}</td>
        <td>${t.responsible}</td>
        <td class="center font-mono">${t.startDate} - ${t.endDate}</td>
        <td class="center font-mono font-bold">${t.progress}%</td>
        <td class="center">
          <span class="badge badge-${t.status === "COMPLETADO" ? "success" : t.status === "EN_PROGRESO" ? "warning" : "secondary"}">
            ${t.status}
          </span>
        </td>
        <td class="obs-cell">
          ${latestObs 
            ? `<div class="obs-text">"${latestObs.observation}"</div>
               <div class="obs-meta">${latestObs.registeredAt} - por ${latestObs.registeredBy}</div>`
            : `<span class="text-muted italic">Sin observaciones</span>`
          }
        </td>
      </tr>
    `;
  }).join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Informe de Progreso WBS - ${project.code}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 15mm;
        }
        body {
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          background-color: #ffffff;
          margin: 0;
          padding: 0;
          font-size: 11px;
          line-height: 1.4;
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-b: 2px solid #0284c7;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .logo-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .institution-name {
          font-size: 16px;
          font-weight: 800;
          color: #0369a1;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .sub-name {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
        }
        .report-badge {
          background-color: #e0f2fe;
          color: #0369a1;
          border: 1px solid #7dd3fc;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 700;
          text-align: right;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
        }
        .meta-item {
          display: flex;
          flex-direction: column;
        }
        .meta-label {
          font-size: 9px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }
        .meta-value {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
        }

        .progress-bar-container {
          width: 100%;
          background-color: #e2e8f0;
          height: 10px;
          border-radius: 5px;
          overflow: hidden;
          margin-top: 4px;
        }
        .progress-bar-fill {
          height: 100%;
          background-color: #10b981;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        th {
          background-color: #0f172a;
          color: #ffffff;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          padding: 8px;
          text-align: left;
        }
        td {
          padding: 7px 8px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: top;
        }
        .parent-row {
          background-color: #f1f5f9;
          font-weight: 700;
        }
        .subtask-row {
          background-color: #ffffff;
        }
        .pl-4 {
          padding-left: 20px;
        }
        .center {
          text-align: center;
        }
        .font-mono {
          font-family: monospace;
        }
        .bold {
          font-weight: 700;
        }
        .text-primary {
          color: #0284c7;
        }
        .text-muted {
          color: #64748b;
        }
        .italic {
          font-style: italic;
        }

        .badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 700;
        }
        .badge-success { background-color: #d1fae5; color: #065f46; }
        .badge-warning { background-color: #fef3c7; color: #92400e; }
        .badge-secondary { background-color: #f1f5f9; color: #475569; }

        .obs-cell {
          max-width: 250px;
        }
        .obs-text {
          font-size: 10px;
          color: #334155;
          font-style: italic;
        }
        .obs-meta {
          font-size: 8px;
          color: #94a3b8;
          margin-top: 2px;
        }

        .signatures-container {
          display: flex;
          justify-content: space-around;
          margin-top: 40px;
          page-break-inside: avoid;
        }
        .signature-box {
          width: 220px;
          text-align: center;
          border-top: 1px solid #94a3b8;
          padding-top: 6px;
        }
        .signature-title {
          font-size: 10px;
          font-weight: 700;
          color: #0f172a;
        }
        .signature-sub {
          font-size: 9px;
          color: #64748b;
        }

        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 9px;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
          padding-top: 8px;
        }
      </style>
    </head>
    <body>

      <!-- HEADER INSTITUCIONAL -->
      <div class="header-container">
        <div class="logo-title">
          <div>
            <div class="institution-name">Universidad Técnica Privada Cosmos (UNITEPC)</div>
            <div class="sub-name">Dirección Nacional de Investigación Científica y Tecnológica</div>
          </div>
        </div>
        <div class="report-badge">
          <div>INFORME DE SEGUIMIENTO Y PROGRESO WBS</div>
          <div style="font-size: 9px; font-weight: 400; margin-top: 2px;">Fecha de emisión: ${nowStr}</div>
        </div>
      </div>

      <!-- METADATOS DEL PROYECTO -->
      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Código del Proyecto</span>
          <span class="meta-value" style="color: #0284c7;">${project.code}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Investigador Responsable</span>
          <span class="meta-value">${project.leadInvestigator}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Área / Gestión</span>
          <span class="meta-value">${project.facultyArea} (${project.managementYear})</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Estado Institucional</span>
          <span class="meta-value">${project.status}</span>
        </div>
        <div class="meta-item" style="grid-column: span 4;">
          <span class="meta-label">Título del Proyecto</span>
          <span class="meta-value" style="font-size: 13px;">${project.title}</span>
        </div>
        <div class="meta-item" style="grid-column: span 4;">
          <span class="meta-label">Avance Global Ponderado: ${overallProgress}%</span>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${overallProgress}%;"></div>
          </div>
        </div>
      </div>

      <!-- TABLA WBS Y SEGUIMIENTO -->
      <table>
        <thead>
          <tr>
            <th style="width: 50px; text-align: center;">WBS</th>
            <th style="width: 180px;">Título de Tarea / Hito</th>
            <th style="width: 160px;">Descripción</th>
            <th style="width: 120px;">Responsable</th>
            <th style="width: 90px; text-align: center;">Fechas</th>
            <th style="width: 60px; text-align: center;">Avance</th>
            <th style="width: 80px; text-align: center;">Estado</th>
            <th>Última Observación de Seguimiento Semanal</th>
          </tr>
        </thead>
        <tbody>
          ${tasksHtml}
        </tbody>
      </table>

      <!-- SECCIÓN DE FIRMAS -->
      <div class="signatures-container">
        <div class="signature-box">
          <div class="signature-title">${project.leadInvestigator}</div>
          <div class="signature-sub">Investigador Responsable del Proyecto</div>
        </div>
        <div class="signature-box">
          <div class="signature-title">Dra. María Lorena Orellana Aguilar</div>
          <div class="signature-sub">Directora Nacional de Investigación - UNITEPC</div>
        </div>
        <div class="signature-box">
          <div class="signature-title">Comité de Evaluación Científica</div>
          <div class="signature-sub">Firma de Conformidad y Fiscalización</div>
        </div>
      </div>

      <!-- PIE DE PÁGINA -->
      <div class="footer">
        Documento Oficial generado por el Sistema Integrado de Proyectos de Investigación (SIGPRI) - UNITEPC.
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
