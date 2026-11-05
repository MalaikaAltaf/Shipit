import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from qstash import QStash

from database import get_db
import models
import schemas
from engine import api_auditor
from routes.ticket_routes import get_current_user_id

QSTASH_TOKEN = os.getenv("QSTASH_TOKEN", "")
# The public URL where QStash will POST back to. Update this after Render deployment.
APP_BASE_URL = os.getenv("APP_BASE_URL", "http://localhost:8000")

router = APIRouter(prefix="/v1/tickets", tags=["submissions"])

@router.post("/{ticket_id}/submissions", response_model=schemas.SubmissionResponse, status_code=status.HTTP_201_CREATED)
def submit_solution(ticket_id: UUID, submission: schemas.SubmissionCreate, user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Submit a solution (code + OpenAPI spec) for a ticket."""
    ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id, models.Ticket.user_id == user_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    # Save the submission
    db_submission = models.Submission(
        ticket_id=ticket_id,
        code_text=submission.code_text,
        openapi_spec=submission.openapi_spec,
        status="evaluating" # It will eventually be processed by the background static analysis
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    
    # Run the synchronous API Design Audit immediately
    audit_results = api_auditor.audit_openapi_spec(submission.openapi_spec)
    
    db_review = models.Review(
        submission_id=db_submission.id,
        review_type="api_audit",
        score=audit_results["score"],
        categorized_result={"feedback": audit_results["details"]}
    )
    db.add(db_review)
    db.commit()

    # Publish to QStash to trigger the async code review in the background.
    # QStash will call our /v1/internal/review-worker endpoint.
    try:
        qstash = QStash(token=QSTASH_TOKEN)
        qstash.message.publish_json(
            url=f"{APP_BASE_URL}/v1/internal/review-worker",
            body={"submission_id": str(db_submission.id)},
        )
        db_submission.status = "pending_review"
        db.commit()
    except Exception as e:
        # Don't fail the request if QStash publish fails — the API audit already ran.
        # Log it and move on.
        print(f"WARNING: Failed to publish to QStash: {e}")
        db_submission.status = "api_audit_only"
        db.commit()

    db.refresh(db_submission)
    return db_submission

@router.get("/submissions/{submission_id}", response_model=schemas.SubmissionResponse, tags=["submissions"])
def get_submission(submission_id: UUID, user_id: UUID = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Fetch a submission and its reviews."""
    submission = db.query(models.Submission).join(models.Ticket).filter(
        models.Submission.id == submission_id,
        models.Ticket.user_id == user_id
    ).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    return submission
