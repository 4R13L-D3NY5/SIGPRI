from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app import models, schemas, tax_engine

router = APIRouter(prefix="/api/proposals", tags=["Proposals"])

@router.get("/", response_model=List[schemas.ProposalResponse])
def get_proposals(db: Session = Depends(get_db)):
    return db.query(models.Proposal).order_by(models.Proposal.id.desc()).all()

@router.post("/", response_model=schemas.ProposalResponse, status_code=status.HTTP_201_CREATED)
def create_proposal(proposal_in: schemas.ProposalCreate, db: Session = Depends(get_db)):
    count = db.query(models.Proposal).count()
    code = f"SIGPRI-2026-{(count + 1):03d}"
    
    # Process team members JSON
    team_members_dict = [tm.model_dump() for tm in proposal_in.team_members] if proposal_in.team_members else []
    
    db_proposal = models.Proposal(
        code=code,
        title=proposal_in.title,
        area=proposal_in.area,
        gestora=proposal_in.gestora or "Dra. Maria Lorena Orellana Aguilar",
        start_date=proposal_in.start_date or "2026-08-03",
        end_date=proposal_in.end_date or "2026-12-19",
        status="Enviado",
        team_members=team_members_dict,
        summary=proposal_in.summary,
        justification=proposal_in.justification,
        objectives=proposal_in.objectives,
        methodology=proposal_in.methodology,
        expected_results=proposal_in.expected_results,
        impacts=proposal_in.impacts,
        references=proposal_in.references
    )
    db.add(db_proposal)
    db.commit()
    db.refresh(db_proposal)

    # Initialize default WBS structure for the project (1.0 to 5.0)
    default_wbs = [
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

    for wbs_data in default_wbs:
        task = models.WbsTask(proposal_id=db_proposal.id, **wbs_data)
        db.add(task)

    # Initialize sample default budget items (matching Excel standard)
    sample_budget = [
        {"item_number": 1, "institution": "UNITEPC", "description": "Jeringas de insulina x100 unidades", "type": "compra", "unit": "Caja", "quantity": 5.0, "unit_price": 115.0, "voucher_type": "FACTURA", "retention_type": "COMPRA", "observations": "Cotización 10 días"},
        {"item_number": 2, "institution": "UNITEPC", "description": "Alcohol al 90% de 1 litro", "type": "compra", "unit": "Bidon", "quantity": 5.0, "unit_price": 30.0, "voucher_type": "FACTURA", "retention_type": "COMPRA", "observations": "Cotización 30 días"},
        {"item_number": 3, "institution": "ZONOSIS", "description": "Cajas Petri", "type": "prestamo", "unit": "cajas", "quantity": 25.0, "unit_price": 80.0, "voucher_type": "N/A", "retention_type": "N/A", "observations": "No requiere desembolso (préstamo)"},
        {"item_number": 4, "institution": "UNITEPC", "description": "Servicio de desarrollo de software especializado", "type": "servicio", "unit": "Servicio", "quantity": 1.0, "unit_price": 4500.0, "voucher_type": "RETENCION", "retention_type": "SERVICIO", "observations": "Servicios sin factura (15.5% retención de ley)"},
        {"item_number": 5, "institution": "UNITEPC", "description": "Adquisición de insumos de laboratorio químico", "type": "compra", "unit": "Lote", "quantity": 2.0, "unit_price": 1200.0, "voucher_type": "RETENCION", "retention_type": "COMPRA", "observations": "Insumos sin factura (8% retención de ley)"}
    ]

    for bi_data in sample_budget:
        calc = tax_engine.calculate_retention(
            quantity=bi_data["quantity"],
            unit_price=bi_data["unit_price"],
            voucher_type=bi_data["voucher_type"],
            retention_type=bi_data["retention_type"],
            item_type=bi_data["type"]
        )
        item = models.BudgetItem(
            proposal_id=db_proposal.id,
            item_number=bi_data["item_number"],
            institution=bi_data["institution"],
            description=bi_data["description"],
            type=bi_data["type"],
            unit=bi_data["unit"],
            quantity=bi_data["quantity"],
            unit_price=bi_data["unit_price"],
            total_amount=calc["total_amount"],
            voucher_type=bi_data["voucher_type"],
            retention_type=bi_data["retention_type"],
            retention_rate=calc["retention_rate"],
            retention_amount=calc["retention_amount"],
            executed_amount=calc["executed_amount"],
            control_status=calc["control_status"],
            observations=bi_data["observations"]
        )
        db.add(item)

    db.commit()
    db.refresh(db_proposal)
    return db_proposal

@router.get("/{id}", response_model=schemas.ProposalResponse)
def get_proposal(id: int, db: Session = Depends(get_db)):
    proposal = db.query(models.Proposal).filter(models.Proposal.id == id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Propuesta no encontrada")
    return proposal

@router.patch("/{id}", response_model=schemas.ProposalResponse)
def update_proposal(id: int, proposal_in: schemas.ProposalUpdate, db: Session = Depends(get_db)):
    proposal = db.query(models.Proposal).filter(models.Proposal.id == id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Propuesta no encontrada")
    
    update_data = proposal_in.model_dump(exclude_unset=True)
    if "team_members" in update_data and update_data["team_members"] is not None:
        update_data["team_members"] = [tm if isinstance(tm, dict) else tm.model_dump() for tm in update_data["team_members"]]

    for key, value in update_data.items():
        setattr(proposal, key, value)

    proposal.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(proposal)
    return proposal

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_proposal(id: int, db: Session = Depends(get_db)):
    proposal = db.query(models.Proposal).filter(models.Proposal.id == id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Propuesta no encontrada")
    db.delete(proposal)
    db.commit()
    return None
