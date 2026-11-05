from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from database import get_db
import models
import schemas
from engine import pm_engine

# A simple dependency to simulate getting the current user.
# In a real app, this would decode the JWT and fetch the user.
# For simplicity in this step, we will just expect a hardcoded user ID or fetch the first user.
def get_current_user_id(db: Session = Depends(get_db)):
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=401, detail="No users found. Please register first.")
    return user.id

router = APIRouter(prefix="/v1/tickets", tags=["tickets"])

@router.post("", response_model=schemas.TicketResponse, status_code=status.HTTP_201_CREATED)
def request_new_ticket(user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Generate a new ticket for the student."""
    ticket_data = pm_engine.generate_new_ticket()
    
    db_ticket = models.Ticket(
        user_id=user_id,
        title=ticket_data["title"],
        description=ticket_data["description"],
        hidden_criteria=ticket_data["hidden_criteria"],
        difficulty=ticket_data["difficulty"],
        status="open"
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.get("/{ticket_id}", response_model=schemas.TicketResponse)
def get_ticket(ticket_id: UUID, user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Get details of a specific ticket."""
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id, models.Ticket.user_id == user_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.post("/{ticket_id}/clarifications", response_model=schemas.ClarificationResponse, status_code=status.HTTP_201_CREATED)
def ask_clarification(ticket_id: UUID, clarification: schemas.ClarificationCreate, user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Ask the PM engine a clarifying question about a ticket."""
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id, models.Ticket.user_id == user_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # Record the student's question
    student_msg = models.Clarification(ticket_id=ticket_id, role="student", message=clarification.message)
    db.add(student_msg)
    
    # Get the PM engine's answer
    pm_answer = pm_engine.answer_clarifying_question(ticket.title, clarification.message)
    
    # Record the PM engine's answer
    pm_msg = models.Clarification(ticket_id=ticket_id, role="pm_engine", message=pm_answer)
    db.add(pm_msg)
    
    db.commit()
    db.refresh(pm_msg)
    
    # Return the PM engine's response
    return pm_msg

@router.get("/{ticket_id}/clarifications", response_model=List[schemas.ClarificationResponse])
def get_clarifications(ticket_id: UUID, user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Get the full thread of questions and answers for a ticket."""
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id, models.Ticket.user_id == user_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    clarifications = db.query(models.Clarification).filter(models.Clarification.ticket_id == ticket_id).order_by(models.Clarification.created_at).all()
    return clarifications
