from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    title = Column(String(255), nullable=False)
    area = Column(String(100), nullable=False)
    gestora = Column(String(150), default="Dra. Maria Lorena Orellana Aguilar")
    start_date = Column(String(20), default="2026-08-03")
    end_date = Column(String(20), default="2026-12-19")
    status = Column(String(50), default="Borrador")  # Borrador, Enviado, En Revisión Científica, En Revisión Bioética, Aprobado, Rechazado, Correcciones Solicitadas
    team_members = Column(JSON, default=list) # [{name, ci, carrera, institucion, profesion, email, cell}]
    summary = Column(Text, nullable=True)
    justification = Column(Text, nullable=True)
    objectives = Column(Text, nullable=True)
    methodology = Column(Text, nullable=True)
    expected_results = Column(Text, nullable=True)
    impacts = Column(Text, nullable=True)
    references = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    evaluations = relationship("CommitteeEvaluation", back_populates="proposal", cascade="all, delete-orphan")
    budget_items = relationship("BudgetItem", back_populates="proposal", cascade="all, delete-orphan")
    wbs_tasks = relationship("WbsTask", back_populates="proposal", cascade="all, delete-orphan")
    final_reports = relationship("FinalReport", back_populates="proposal", cascade="all, delete-orphan")

class CommitteeEvaluation(Base):
    __tablename__ = "committee_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), nullable=False)
    committee_type = Column(String(50), nullable=False) # CIENTIFICO or BIOETICO
    evaluator_name = Column(String(150), nullable=False)
    score = Column(Float, default=0.0)
    verdict = Column(String(50), nullable=False) # APROBADO, RECHAZADO, CORRECCION
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    proposal = relationship("Proposal", back_populates="evaluations")

class BudgetItem(Base):
    __tablename__ = "budget_items"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), nullable=False)
    item_number = Column(Integer, default=1)
    institution = Column(String(100), default="UNITEPC") # UNITEPC, ZONOSIS, OTRA
    description = Column(String(255), nullable=False)
    type = Column(String(50), default="compra") # compra, prestamo, servicio
    unit = Column(String(50), default="Caja")
    quantity = Column(Float, default=1.0)
    unit_price = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    voucher_type = Column(String(50), default="FACTURA") # FACTURA, RETENCION, N/A
    retention_type = Column(String(50), default="COMPRA") # COMPRA, SERVICIO, ALQUILER, N/A
    retention_rate = Column(Float, default=0.0)
    retention_amount = Column(Float, default=0.0)
    executed_amount = Column(Float, default=0.0)
    control_status = Column(String(100), default="VALIDADO")
    observations = Column(Text, nullable=True)

    proposal = relationship("Proposal", back_populates="budget_items")

class WbsTask(Base):
    __tablename__ = "wbs_tasks"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), nullable=False)
    wbs_code = Column(String(20), nullable=False) # 1.0, 1.1, 2.0, 2.1, etc.
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    progress_percentage = Column(Float, default=0.0)
    responsible = Column(String(150), default="Equipo Dev")
    start_date = Column(String(50), nullable=True)
    end_date = Column(String(50), nullable=True)
    weeks = Column(JSON, default=list) # List of active week numbers [1, 2, 3]
    status = Column(String(50), default="PENDIENTE") # PENDIENTE, EN_PROGRESO, COMPLETADO

    proposal = relationship("Proposal", back_populates="wbs_tasks")

class FinalReport(Base):
    __tablename__ = "final_reports"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), nullable=False)
    article_title = Column(String(255), nullable=False)
    article_abstract = Column(Text, nullable=True)
    file_path = Column(String(255), nullable=True)
    status = Column(String(50), default="SUBMITTED") # SUBMITTED, APPROVED, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)

    proposal = relationship("Proposal", back_populates="final_reports")
