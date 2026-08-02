from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/final-reports", tags=["Final Reports"])

@router.get("/proposal/{proposal_id}", response_model=List[schemas.FinalReportResponse])
def get_final_reports(proposal_id: int, db: Session = Depends(get_db)):
    return db.query(models.FinalReport).filter(models.FinalReport.proposal_id == proposal_id).order_by(models.FinalReport.id.desc()).all()

@router.post("/", response_model=schemas.FinalReportResponse, status_code=status.HTTP_201_CREATED)
def submit_final_report(report_in: schemas.FinalReportCreate, db: Session = Depends(get_db)):
    proposal = db.query(models.Proposal).filter(models.Proposal.id == report_in.proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Propuesta no encontrada")

    db_report = models.FinalReport(
        proposal_id=report_in.proposal_id,
        article_title=report_in.article_title,
        article_abstract=report_in.article_abstract,
        file_path=report_in.file_path or "docs/articulo_original.pdf",
        status="SUBMITTED"
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report
