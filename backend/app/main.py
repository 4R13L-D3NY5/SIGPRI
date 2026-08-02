import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.database import engine, Base, SessionLocal
from app import models, tax_engine
from app.routers import proposals, budget, committees, wbs, final_reports

# Initialize tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SIGPRI UNITEPC API",
    description="Sistema Integral de Gestión de Proyectos de Investigación con Motor de Retenciones Impositivas",
    version="1.0.0"
)

# CORS configuration for Frontend React SPA
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(proposals.router)
app.include_router(budget.router)
app.include_router(committees.router)
app.include_router(wbs.router)
app.include_router(final_reports.router)

@app.on_event("startup")
def startup_event():
    # Ensure default initial proposal exists for quick testing/demo if empty
    db = SessionLocal()
    try:
        if db.query(models.Proposal).count() == 0:
            sample_proposal = models.Proposal(
                code="SIGPRI-2026-001",
                title="SIGPRI: Sistema Integral de Gestión de Proyectos de Investigación",
                area="Ingeniería y Tecnología",
                gestora="Dra. Maria Lorena Orellana Aguilar",
                start_date="2026-08-03",
                end_date="2026-12-19",
                status="Aprobado",
                team_members=[
                    {
                        "name": "Ariel Denys Camara Arze",
                        "ci": "6522053",
                        "carrera": "ING. DE SISTEMAS",
                        "institucion": "UNITEPC",
                        "profesion": "DOC. INVESTIGADOR",
                        "email": "arielcamara@unitepc.edu.bo",
                        "cell": "79326793"
                    },
                    {
                        "name": "Harold Marco Antonio Rojas Torres",
                        "ci": "9465510",
                        "carrera": "ING. DE SISTEMAS",
                        "institucion": "UNITEPC",
                        "profesion": "DOC. INVESTIGADOR",
                        "email": "haroldrojas@unitepc.edu.bo",
                        "cell": "78311416"
                    },
                    {
                        "name": "Jose James Claure Ricaldi",
                        "ci": "5188558",
                        "carrera": "ING. DE SISTEMAS",
                        "institucion": "UNITEPC",
                        "profesion": "DIR. CARRERA SISTEMAS",
                        "email": "jclaure_dis@unitepc.net",
                        "cell": "72242424"
                    }
                ],
                summary="El desarrollo de la plataforma web SIGPRI automatiza el flujo completo de evaluación de propuestas científicas, bioéticas, seguimiento de avances con gráfico WBS y gestión presupuestaria con cálculo automático de retenciones impositivas.",
                justification="Resuelve la ineficiencia del manejo en papel, garantiza transparencia financiera y el cumplimiento estricto de la retención de impuestos (IUE/IT/RC-IVA) para compras y servicios.",
                objectives="Implementar la plataforma web SIGPRI con motor de retenciones contable, comités de evaluación y gráfico WBS interactivo para UNITEPC.",
                methodology="Desarrollo bajo metodología ágil Scrum durante 5 meses divididos en 22 semanas de ejecución.",
                expected_results="Plataforma 100% funcional en producción, trazabilidad tributaria total y entrega de artículo científico original.",
                impacts="Erradicación de pérdidas de expedientes, impacto académico por mayor producción científica e impacto económico por rendición transparente de cuentas.",
                references="Ballegooie & Riva (2020), Pérez-Martínez et al. (2021), Smith & Jones (2022)."
            )
            db.add(sample_proposal)
            db.commit()
            db.refresh(sample_proposal)

            # Seed WBS tasks
            wbs_items = [
                {"wbs_code": "1.0", "title": "Módulo de Recepción", "description": "Diseño BD y Portal UI/UX", "responsible": "Equipo Dev", "start_date": "03-ago", "end_date": "24-ago", "weeks": [1, 2, 3, 4], "progress_percentage": 100.0, "status": "COMPLETADO"},
                {"wbs_code": "1.1", "title": "Diseño Base de Datos", "description": "Estructuración de tablas relacionales y esquemas", "responsible": "Desarrollador", "start_date": "03-ago", "end_date": "10-ago", "weeks": [1, 2], "progress_percentage": 100.0, "status": "COMPLETADO"},
                {"wbs_code": "1.2", "title": "Portal Investigadores", "description": "Envío y gestión interactiva de propuestas", "responsible": "Desarrollador", "start_date": "17-ago", "end_date": "24-ago", "weeks": [3, 4], "progress_percentage": 100.0, "status": "COMPLETADO"},
                {"wbs_code": "2.0", "title": "Módulo de Comités", "description": "Evaluación Científico y Bioético", "responsible": "Equipo Dev", "start_date": "31-ago", "end_date": "10-oct", "weeks": [5, 6, 7, 8, 9, 10, 11, 12], "progress_percentage": 85.0, "status": "EN_PROGRESO"},
                {"wbs_code": "2.1", "title": "Flujo Científico", "description": "Revisión por pares, aprobación y observaciones", "responsible": "Desarrollador", "start_date": "31-ago", "end_date": "21-sep", "weeks": [5, 6, 7, 8], "progress_percentage": 100.0, "status": "COMPLETADO"},
                {"wbs_code": "2.2", "title": "Flujo Bioético", "description": "Validación de ética, bioseguridad y dictámenes", "responsible": "Desarrollador", "start_date": "28-sep", "end_date": "19-oct", "weeks": [9, 10, 11, 12], "progress_percentage": 70.0, "status": "EN_PROGRESO"},
                {"wbs_code": "3.0", "title": "Módulo de Avances", "description": "Seguimiento dinámico y entrega de Artículos", "responsible": "Equipo Dev", "start_date": "26-oct", "end_date": "16-nov", "weeks": [13, 14, 15, 16], "progress_percentage": 50.0, "status": "EN_PROGRESO"},
                {"wbs_code": "3.1", "title": "Cronograma", "description": "Control de entregables e hitos del proyecto", "responsible": "Desarrollador", "start_date": "26-oct", "end_date": "02-nov", "weeks": [13, 14], "progress_percentage": 60.0, "status": "EN_PROGRESO"},
                {"wbs_code": "3.2", "title": "Artículo Original", "description": "Módulo de entrega y verificación de manuscrito", "responsible": "Desarrollador", "start_date": "09-nov", "end_date": "16-nov", "weeks": [15, 16], "progress_percentage": 40.0, "status": "EN_PROGRESO"},
                {"wbs_code": "4.0", "title": "Módulo Contable", "description": "Presupuestos y Motor de Retenciones", "responsible": "Equipo Dev", "start_date": "23-nov", "end_date": "14-dic", "weeks": [17, 18, 19, 20], "progress_percentage": 90.0, "status": "EN_PROGRESO"},
                {"wbs_code": "4.1", "title": "Cotizaciones", "description": "Carga y validación de costos y proveedores", "responsible": "Desarrollador", "start_date": "23-nov", "end_date": "30-nov", "weeks": [17, 18], "progress_percentage": 100.0, "status": "COMPLETADO"},
                {"wbs_code": "4.2", "title": "Motor de Retenciones", "description": "Cálculo automático de IUE/IT/RC-IVA y montos ejecutados", "responsible": "Desarrollador", "start_date": "14-dic", "end_date": "14-dic", "weeks": [19, 20], "progress_percentage": 80.0, "status": "EN_PROGRESO"},
                {"wbs_code": "5.0", "title": "Despliegue y QA", "description": "Pruebas de integración y paso a producción", "responsible": "Equipo Dev", "start_date": "14-dic", "end_date": "21-dic", "weeks": [21, 22], "progress_percentage": 20.0, "status": "PENDIENTE"}
            ]
            for w in wbs_items:
                db.add(models.WbsTask(proposal_id=sample_proposal.id, **w))

            # Seed budget items matching Excel format
            budget_sample = [
                {"item_number": 1, "institution": "UNITEPC", "description": "Jeringas de insulina x100 unidades", "type": "compra", "unit": "Caja", "quantity": 5.0, "unit_price": 115.0, "voucher_type": "FACTURA", "retention_type": "COMPRA", "observations": "Cotización 10 días"},
                {"item_number": 2, "institution": "UNITEPC", "description": "Alcohol al 90% de 1 litro", "type": "compra", "unit": "Bidon", "quantity": 5.0, "unit_price": 30.0, "voucher_type": "FACTURA", "retention_type": "COMPRA", "observations": "Cotización 30 días"},
                {"item_number": 3, "institution": "ZONOSIS", "description": "Cajas Petri", "type": "prestamo", "unit": "cajas", "quantity": 25.0, "unit_price": 80.0, "voucher_type": "N/A", "retention_type": "N/A", "observations": "No se requiere desembolso (préstamo)"},
                {"item_number": 4, "institution": "UNITEPC", "description": "Desarrollo de módulos web en React y FastAPI", "type": "servicio", "unit": "Servicio", "quantity": 1.0, "unit_price": 3500.0, "voucher_type": "RETENCION", "retention_type": "SERVICIO", "observations": "Retención del 15.5% (IUE 12.5% + IT 3%)"},
                {"item_number": 5, "institution": "UNITEPC", "description": "Compra de insumos químicos de prueba", "type": "compra", "unit": "Lote", "quantity": 2.0, "unit_price": 850.0, "voucher_type": "RETENCION", "retention_type": "COMPRA", "observations": "Retención del 8.0% (IUE 5% + IT 3%)"}
            ]

            for b in budget_sample:
                calc = tax_engine.calculate_retention(
                    quantity=b["quantity"],
                    unit_price=b["unit_price"],
                    voucher_type=b["voucher_type"],
                    retention_type=b["retention_type"],
                    item_type=b["type"]
                )
                db.add(models.BudgetItem(
                    proposal_id=sample_proposal.id,
                    item_number=b["item_number"],
                    institution=b["institution"],
                    description=b["description"],
                    type=b["type"],
                    unit=b["unit"],
                    quantity=b["quantity"],
                    unit_price=b["unit_price"],
                    total_amount=calc["total_amount"],
                    voucher_type=b["voucher_type"],
                    retention_type=b["retention_type"],
                    retention_rate=calc["retention_rate"],
                    retention_amount=calc["retention_amount"],
                    executed_amount=calc["executed_amount"],
                    control_status=calc["control_status"],
                    observations=b["observations"]
                ))

            # Seed evaluations
            db.add(models.CommitteeEvaluation(
                proposal_id=sample_proposal.id,
                committee_type="CIENTIFICO",
                evaluator_name="Dr. Carlos Mendoza (Comité Científico)",
                score=95.0,
                verdict="APROBADO",
                comments="Metodología Scrum y propuesta técnica adecuadamente fundamentada."
            ))
            db.add(models.CommitteeEvaluation(
                proposal_id=sample_proposal.id,
                committee_type="BIOETICO",
                evaluator_name="Dra. Elena Ramos (Comité Bioético)",
                score=92.0,
                verdict="APROBADO",
                comments="Cumple con la declaración jurada y principios éticos universitarios."
            ))

            db.commit()
    finally:
        db.close()

# Montar la aplicación frontend React SPA (dist)
dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(dist_path):
    assets_dir = os.path.join(dist_path, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    def serve_spa():
        return FileResponse(os.path.join(dist_path, "index.html"))

    @app.get("/{full_path:path}")
    def serve_spa_fallback(full_path: str):
        if full_path.startswith("api/"):
            return {"error": "API route not found", "path": full_path}
        file_target = os.path.join(dist_path, full_path)
        if os.path.isfile(file_target):
            return FileResponse(file_target)
        return FileResponse(os.path.join(dist_path, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {"message": "SIGPRI UNITEPC Backend API running successfully", "status": "active"}

