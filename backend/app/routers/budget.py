from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app import models, schemas, tax_engine

router = APIRouter(prefix="/api/budget", tags=["Budget & Tax Engine"])

@router.get("/proposal/{proposal_id}", response_model=List[schemas.BudgetItemResponse])
def get_budget_items(proposal_id: int, db: Session = Depends(get_db)):
    return db.query(models.BudgetItem).filter(models.BudgetItem.proposal_id == proposal_id).order_by(models.BudgetItem.item_number.asc()).all()

@router.post("/calculate")
def calculate_tax(payload: Dict[str, Any]):
    quantity = payload.get("quantity", 1.0)
    unit_price = payload.get("unit_price", 0.0)
    voucher_type = payload.get("voucher_type", "FACTURA")
    retention_type = payload.get("retention_type", "COMPRA")
    custom_rate = payload.get("custom_rate", None)
    item_type = payload.get("type", "compra")

    return tax_engine.calculate_retention(
        quantity=quantity,
        unit_price=unit_price,
        voucher_type=voucher_type,
        retention_type=retention_type,
        custom_rate=custom_rate,
        item_type=item_type
    )

@router.post("/", response_model=schemas.BudgetItemResponse, status_code=status.HTTP_201_CREATED)
def create_budget_item(item_in: schemas.BudgetItemCreate, db: Session = Depends(get_db)):
    proposal = db.query(models.Proposal).filter(models.Proposal.id == item_in.proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Propuesta no encontrada")

    calc = tax_engine.calculate_retention(
        quantity=item_in.quantity,
        unit_price=item_in.unit_price,
        voucher_type=item_in.voucher_type,
        retention_type=item_in.retention_type,
        custom_rate=item_in.retention_rate,
        item_type=item_in.type
    )

    db_item = models.BudgetItem(
        proposal_id=item_in.proposal_id,
        item_number=item_in.item_number,
        institution=item_in.institution,
        description=item_in.description,
        type=item_in.type,
        unit=item_in.unit,
        quantity=item_in.quantity,
        unit_price=item_in.unit_price,
        total_amount=calc["total_amount"],
        voucher_type=item_in.voucher_type,
        retention_type=item_in.retention_type,
        retention_rate=calc["retention_rate"],
        retention_amount=calc["retention_amount"],
        executed_amount=calc["executed_amount"],
        control_status=calc["control_status"],
        observations=item_in.observations
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/{id}", response_model=schemas.BudgetItemResponse)
def update_budget_item(id: int, item_in: schemas.BudgetItemBase, db: Session = Depends(get_db)):
    db_item = db.query(models.BudgetItem).filter(models.BudgetItem.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Ítem presupuestario no encontrado")

    calc = tax_engine.calculate_retention(
        quantity=item_in.quantity,
        unit_price=item_in.unit_price,
        voucher_type=item_in.voucher_type,
        retention_type=item_in.retention_type,
        custom_rate=item_in.retention_rate,
        item_type=item_in.type
    )

    db_item.item_number = item_in.item_number
    db_item.institution = item_in.institution
    db_item.description = item_in.description
    db_item.type = item_in.type
    db_item.unit = item_in.unit
    db_item.quantity = item_in.quantity
    db_item.unit_price = item_in.unit_price
    db_item.total_amount = calc["total_amount"]
    db_item.voucher_type = item_in.voucher_type
    db_item.retention_type = item_in.retention_type
    db_item.retention_rate = calc["retention_rate"]
    db_item.retention_amount = calc["retention_amount"]
    db_item.executed_amount = calc["executed_amount"]
    db_item.control_status = calc["control_status"]
    db_item.observations = item_in.observations

    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget_item(id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.BudgetItem).filter(models.BudgetItem.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Ítem presupuestario no encontrado")
    db.delete(db_item)
    db.commit()
    return None
