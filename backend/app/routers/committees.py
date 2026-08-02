from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/committees", tags=["Committees Evaluation"])

@router.get("/proposal/{proposal_id}", response_model=List[schemas.CommitteeEvaluationResponse])
def get_proposal_evaluations(proposal_id: int, db: Session = Depends(get_db)):
    return db.query(models.CommitteeEvaluation).filter(models.CommitteeEvaluation.proposal_id == proposal_id).order_by(models.CommitteeEvaluation.created_at.desc()).all()

@router.post("/", response_model=schemas.CommitteeEvaluationResponse, status_code=status.HTTP_201_CREATED)
def create_evaluation(eval_in: schemas.CommitteeEvaluationCreate, db: Session = Depends(get_db)):
    proposal = db.query(models.Proposal).filter(models.Proposal.id == eval_in.proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Propuesta no encontrada")

    db_eval = models.CommitteeEvaluation(
        proposal_id=eval_in.proposal_id,
        committee_type=eval_in.committee_type.upper(),
        evaluator_name=eval_in.evaluator_name,
        score=eval_in.score,
        verdict=eval_in.verdict.upper(),
        comments=eval_in.comments
    )
    db.add(db_eval)

    # Automatically update proposal status depending on verdict and committee type
    verdict = eval_in.verdict.upper()
    if verdict == "RECHAZADO":
        proposal.status = "Rechazado"
    elif verdict == "CORRECCION":
        proposal.status = "Correcciones Solicitadas"
    elif verdict == "APROBADO":
        # Check if both scientific and bioethic are approved
        evals = db.query(models.CommitteeEvaluation).filter(models.CommitteeEvaluation.proposal_id == proposal.id).all()
        scientific_approved = any(e.committee_type == "CIENTIFICO" and e.verdict == "APROBADO" for e in evals) or eval_in.committee_type == "CIENTIFICO"
        bioethics_approved = any(e.committee_type == "BIOETICO" and e.verdict == "APROBADO" for e in evals) or eval_in.committee_type == "BIOETICO"

        if scientific_approved and bioethics_approved:
            proposal.status = "Aprobado"
        elif eval_in.committee_type == "CIENTIFICO":
            proposal.status = "En Revisión Bioética"
        elif eval_in.committee_type == "BIOETICO":
            proposal.status = "En Revisión Científica"

    db.commit()
    db.refresh(db_eval)
    return db_eval
