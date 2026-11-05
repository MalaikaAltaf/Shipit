from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
from routes.ticket_routes import get_current_user_id
from uuid import UUID

router = APIRouter(prefix="/v1/users", tags=["users"])

@router.get("/me/history", response_model=List[schemas.TicketResponse])
def get_history(user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Fetch all past tickets and their scores for the current user."""
    tickets = (
        db.query(models.Ticket)
        .filter(models.Ticket.user_id == user_id)
        .order_by(models.Ticket.created_at.desc())
        .all()
    )
    return tickets
