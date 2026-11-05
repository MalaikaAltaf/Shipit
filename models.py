import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(Text, unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    tickets = relationship("Ticket", back_populates="user")

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    hidden_criteria = Column(JSON, nullable=False)
    difficulty = Column(Text, nullable=False)
    status = Column(Text, nullable=False, default="open")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    user = relationship("User", back_populates="tickets")
    clarifications = relationship("Clarification", back_populates="ticket")
    submissions = relationship("Submission", back_populates="ticket")

class Clarification(Base):
    __tablename__ = "clarifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id"))
    role = Column(Text, nullable=False) # 'student' or 'pm_engine'
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    ticket = relationship("Ticket", back_populates="clarifications")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ticket_id = Column(UUID(as_uuid=True), ForeignKey("tickets.id"))
    code_text = Column(Text, nullable=False)
    openapi_spec = Column(JSON, nullable=False)
    status = Column(Text, nullable=False, default="pending")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    ticket = relationship("Ticket", back_populates="submissions")
    reviews = relationship("Review", back_populates="submission")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submission_id = Column(UUID(as_uuid=True), ForeignKey("submissions.id"))
    review_type = Column(Text, nullable=False) # 'api_audit' or 'code_review'
    score = Column(Integer, nullable=False)
    categorized_result = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)

    submission = relationship("Submission", back_populates="reviews")
