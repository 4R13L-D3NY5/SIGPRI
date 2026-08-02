from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/wbs", tags=["WBS & Schedule"])

@router.get("/proposal/{proposal_id}", response_model=List[schemas.WbsTaskResponse])
def get_wbs_tasks(proposal_id: int, db: Session = Depends(get_db)):
    return db.query(models.WbsTask).filter(models.WbsTask.proposal_id == proposal_id).order_by(models.WbsTask.wbs_code.asc()).all()

@router.post("/", response_model=schemas.WbsTaskResponse, status_code=status.HTTP_201_CREATED)
def create_wbs_task(task_in: schemas.WbsTaskCreate, db: Session = Depends(get_db)):
    db_task = models.WbsTask(
        proposal_id=task_in.proposal_id,
        wbs_code=task_in.wbs_code,
        title=task_in.title,
        description=task_in.description,
        progress_percentage=task_in.progress_percentage,
        responsible=task_in.responsible,
        start_date=task_in.start_date,
        end_date=task_in.end_date,
        weeks=task_in.weeks or [],
        status=task_in.status
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.patch("/{id}", response_model=schemas.WbsTaskResponse)
def update_wbs_task(id: int, task_in: schemas.WbsTaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.WbsTask).filter(models.WbsTask.id == id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tarea WBS no encontrada")

    update_data = task_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)

    if db_task.progress_percentage >= 100.0:
        db_task.status = "COMPLETADO"
    elif db_task.progress_percentage > 0.0:
        db_task.status = "EN_PROGRESO"

    db.commit()
    db.refresh(db_task)
    return db_task
