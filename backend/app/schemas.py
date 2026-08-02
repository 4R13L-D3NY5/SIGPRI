from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any
from datetime import datetime

# Team Member schema
class TeamMemberSchema(BaseModel):
    name: str
    ci: str
    carrera: str
    institucion: str = "UNITEPC"
    profesion: str = "DOC. INVESTIGADOR"
    email: Optional[str] = None
    cell: Optional[str] = None

# Proposal schemas
class ProposalBase(BaseModel):
    title: str
    area: str
    gestora: Optional[str] = "Dra. Maria Lorena Orellana Aguilar"
    start_date: Optional[str] = "2026-08-03"
    end_date: Optional[str] = "2026-12-19"
    team_members: Optional[List[TeamMemberSchema]] = []
    summary: Optional[str] = None
    justification: Optional[str] = None
    objectives: Optional[str] = None
    methodology: Optional[str] = None
    expected_results: Optional[str] = None
    impacts: Optional[str] = None
    references: Optional[str] = None

class ProposalCreate(ProposalBase):
    pass

class ProposalUpdate(BaseModel):
    title: Optional[str] = None
    area: Optional[str] = None
    gestora: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: Optional[str] = None
    team_members: Optional[List[TeamMemberSchema]] = None
    summary: Optional[str] = None
    justification: Optional[str] = None
    objectives: Optional[str] = None
    methodology: Optional[str] = None
    expected_results: Optional[str] = None
    impacts: Optional[str] = None
    references: Optional[str] = None

# Budget schemas
class BudgetItemBase(BaseModel):
    item_number: int = 1
    institution: str = "UNITEPC"
    description: str
    type: str = "compra" # compra, prestamo, servicio
    unit: str = "Caja"
    quantity: float = 1.0
    unit_price: float = 0.0
    voucher_type: str = "FACTURA" # FACTURA, RETENCION, N/A
    retention_type: str = "COMPRA" # COMPRA, SERVICIO, ALQUILER, N/A
    retention_rate: Optional[float] = None
    observations: Optional[str] = None

class BudgetItemCreate(BudgetItemBase):
    proposal_id: int

class BudgetItemResponse(BudgetItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    proposal_id: int
    total_amount: float
    retention_rate: float
    retention_amount: float
    executed_amount: float
    control_status: str

# Committee evaluation schemas
class CommitteeEvaluationBase(BaseModel):
    committee_type: str # CIENTIFICO or BIOETICO
    evaluator_name: str
    score: float = 0.0
    verdict: str # APROBADO, RECHAZADO, CORRECCION
    comments: Optional[str] = None

class CommitteeEvaluationCreate(CommitteeEvaluationBase):
    proposal_id: int

class CommitteeEvaluationResponse(CommitteeEvaluationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    proposal_id: int
    created_at: datetime

# WBS Task schemas
class WbsTaskBase(BaseModel):
    wbs_code: str
    title: str
    description: Optional[str] = None
    progress_percentage: float = 0.0
    responsible: str = "Equipo Dev"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    weeks: Optional[List[int]] = []
    status: str = "PENDIENTE"

class WbsTaskCreate(WbsTaskBase):
    proposal_id: int

class WbsTaskUpdate(BaseModel):
    progress_percentage: Optional[float] = None
    responsible: Optional[str] = None
    status: Optional[str] = None
    weeks: Optional[List[int]] = None

class WbsTaskResponse(WbsTaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    proposal_id: int

# Final report schemas
class FinalReportCreate(BaseModel):
    proposal_id: int
    article_title: str
    article_abstract: Optional[str] = None
    file_path: Optional[str] = None

class FinalReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    proposal_id: int
    article_title: str
    article_abstract: Optional[str]
    file_path: Optional[str]
    status: str
    created_at: datetime

# Proposal Response
class ProposalResponse(ProposalBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    status: str
    created_at: datetime
    updated_at: datetime
    evaluations: List[CommitteeEvaluationResponse] = []
    budget_items: List[BudgetItemResponse] = []
    wbs_tasks: List[WbsTaskResponse] = []
    final_reports: List[FinalReportResponse] = []
