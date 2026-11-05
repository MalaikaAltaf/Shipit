from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TicketResponse(BaseModel):
    id: UUID
    title: str
    description: str
    difficulty: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ClarificationCreate(BaseModel):
    message: str

class ClarificationResponse(BaseModel):
    id: UUID
    role: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

class SubmissionCreate(BaseModel):
    code_text: str
    openapi_spec: dict

class ReviewResponse(BaseModel):
    id: UUID
    review_type: str
    score: int
    categorized_result: dict
    created_at: datetime

    class Config:
        from_attributes = True

class SubmissionResponse(BaseModel):
    id: UUID
    status: str
    created_at: datetime
    reviews: list[ReviewResponse] = []

    class Config:
        from_attributes = True
