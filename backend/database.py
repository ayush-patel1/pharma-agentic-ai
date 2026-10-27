import json
import os
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./neurorepurpose.db")

# Support both SQLite and PostgreSQL
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    runs = relationship("ResearchRun", back_populates="project", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="project", cascade="all, delete-orphan")


class ResearchRun(Base):
    __tablename__ = "research_runs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=True)
    drug = Column(String(255), nullable=False)
    disease = Column(String(255), nullable=False)
    status = Column(String(50), default="completed")  # queued, running, completed, failed
    parameters_json = Column(Text, default="{}")
    execution_trace_json = Column(Text, default="[]")
    metrics_json = Column(Text, default="{}")
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="runs")
    records = relationship("LiteratureRecordModel", back_populates="run", cascade="all, delete-orphan")
    claims = relationship("ExtractedClaimModel", back_populates="run", cascade="all, delete-orphan")
    gaps = relationship("ResearchGapModel", back_populates="run", cascade="all, delete-orphan")
    reports = relationship("ReportModel", back_populates="run", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="run", cascade="all, delete-orphan")


class LiteratureRecordModel(Base):
    __tablename__ = "literature_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    run_id = Column(String(36), ForeignKey("research_runs.id"), nullable=True)
    pmid = Column(String(50), default="", index=True)
    doi = Column(String(100), default="", index=True)
    title = Column(String(500), nullable=False)
    abstract = Column(Text, default="")
    authors = Column(Text, default="")
    journal = Column(String(255), default="")
    publication_date = Column(String(100), default="")
    publication_year = Column(Integer, nullable=True)
    publication_type = Column(String(100), default="")
    source = Column(String(50), default="PubMed")  # PubMed, Europe PMC, Uploaded PDF
    link = Column(String(500), default="")
    retrieval_score = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    run = relationship("ResearchRun", back_populates="records")


class ExtractedClaimModel(Base):
    __tablename__ = "extracted_claims"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    run_id = Column(String(36), ForeignKey("research_runs.id"), nullable=False)
    claim_id = Column(String(50), nullable=False)  # e.g. CLM-01
    claim_text = Column(Text, nullable=False)
    source_id = Column(String(100), default="")  # PMID or Document Ref
    source_title = Column(String(500), default="")
    passage = Column(Text, default="")
    section = Column(String(100), default="Abstract")
    relationship_type = Column(String(50), default="supports")  # supports, contradicts, contextualizes
    verification_status = Column(String(50), default="verified")  # verified, partially_verified, unsupported
    confidence = Column(Float, default=0.9)
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    run = relationship("ResearchRun", back_populates="claims")


class ResearchGapModel(Base):
    __tablename__ = "research_gaps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    run_id = Column(String(36), ForeignKey("research_runs.id"), nullable=False)
    gap_title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    biological_relevance = Column(Text, default="")
    follow_up_query = Column(String(255), default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    run = relationship("ResearchRun", back_populates="gaps")


class ReportModel(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    run_id = Column(String(36), ForeignKey("research_runs.id"), nullable=False)
    title = Column(String(255), nullable=False)
    content_html = Column(Text, nullable=False)
    content_markdown = Column(Text, default="")
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    run = relationship("ResearchRun", back_populates="reports")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=True)
    run_id = Column(String(36), ForeignKey("research_runs.id"), nullable=True)
    title = Column(String(255), default="Research Exploration")
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="chat_sessions")
    run = relationship("ResearchRun", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String(50), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    citations_json = Column(Text, default="[]")  # list of cited source cards
    execution_meta_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")


def init_db():
    Base.metadata.create_all(bind=engine)
    # Ensure default project exists
    db = SessionLocal()
    try:
        default_proj = db.query(Project).filter_by(name="Default Research Workspace").first()
        if not default_proj:
            default_proj = Project(
                id="default",
                name="Default Research Workspace",
                description="Primary workspace for cross-study drug repurposing investigation.",
            )
            db.add(default_proj)
            db.commit()
    finally:
        db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
