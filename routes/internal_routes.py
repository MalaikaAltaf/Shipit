import os
import hmac
import hashlib
import base64
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from database import get_db
import models
from engine import code_review

router = APIRouter(prefix="/v1/internal", tags=["internal"])

QSTASH_CURRENT_SIGNING_KEY = os.getenv("QSTASH_CURRENT_SIGNING_KEY", "")
QSTASH_NEXT_SIGNING_KEY = os.getenv("QSTASH_NEXT_SIGNING_KEY", "")

def verify_qstash_signature(request_body: bytes, signature_header: str, signing_key: str) -> bool:
    """Verify the QStash HMAC-SHA256 signature."""
    try:
        expected = base64.b64encode(
            hmac.new(signing_key.encode(), request_body, hashlib.sha256).digest()
        ).decode()
        return hmac.compare_digest(expected, signature_header)
    except Exception:
        return False

@router.post("/review-worker")
async def review_worker(request: Request, db: Session = Depends(get_db)):
    """
    Webhook endpoint called by Upstash QStash.
    Runs static analysis on submitted code and saves the result to the database.
    This endpoint is protected — only QStash can call it (via signature verification).
    """
    body = await request.body()
    signature = request.headers.get("Upstash-Signature", "")

    # Verify QStash signature using current or next signing key
    is_valid = (
        verify_qstash_signature(body, signature, QSTASH_CURRENT_SIGNING_KEY) or
        verify_qstash_signature(body, signature, QSTASH_NEXT_SIGNING_KEY)
    )

    if not is_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid QStash signature")

    import json
    payload = json.loads(body)
    submission_id = payload.get("submission_id")

    if not submission_id:
        raise HTTPException(status_code=400, detail="Missing submission_id in payload")

    # Fetch the submission from the database
    submission = db.query(models.Submission).filter(
        models.Submission.id == submission_id
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Run the static analysis tools
    results = code_review.run_static_analysis(submission.code_text)

    # Save the code review result
    db_review = models.Review(
        submission_id=submission.id,
        review_type="code_review",
        score=results["score"],
        categorized_result={"feedback": results["details"]}
    )
    db.add(db_review)

    # Mark the submission as fully evaluated
    submission.status = "reviewed"
    db.commit()

    return {"status": "review complete", "score": results["score"]}
