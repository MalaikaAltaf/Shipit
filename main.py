from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes, ticket_routes, submission_routes, internal_routes, user_routes

app = FastAPI(
    title="ShipIt API",
    description="Backend for the Full-Cycle Junior Engineer Simulator",
    version="1.0.0",
)

# Allow CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth_routes.router)
app.include_router(ticket_routes.router)
app.include_router(submission_routes.router)
app.include_router(internal_routes.router)
app.include_router(user_routes.router)

@app.get("/health")
def health_check():
    """Health check endpoint to ensure the API is running."""
    return {"status": "ok", "message": "ShipIt API is healthy"}
