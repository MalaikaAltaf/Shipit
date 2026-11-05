# ShipIt

ShipIt is a full-cycle junior engineer simulator. It turns a realistic engineering ticket into a guided workflow where developers can clarify requirements, submit an implementation, and review the result with a persistent history of their work.

## Features

- Authentication with JWT-based sessions
- Ticket workspace for reviewing assigned engineering tasks
- Clarification workflow for resolving ambiguity before implementation
- Submission and review flow with saved history
- FastAPI backend with PostgreSQL persistence
- React and Vite frontend with a development proxy to the API
- Render-ready backend configuration

## Tech Stack

**Frontend**

- React
- React Router
- Vite
- Axios

**Backend**

- Python
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- JWT and bcrypt authentication

## Project Structure

```text
.
├── frontend/          React/Vite application
├── routes/            FastAPI route modules
├── alembic/           Database migrations
├── engine/            Application workflow logic
├── main.py            FastAPI application entry point
├── models.py          SQLAlchemy models
├── schemas.py         Pydantic schemas
├── database.py        Database connection and session setup
├── requirements.txt   Python dependencies
└── render.yaml        Render deployment configuration
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- A PostgreSQL database

## Local Setup

### 1. Configure the backend

Create a local `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET_KEY=replace-with-a-long-random-value
QSTASH_URL=
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_NEXT_SIGNING_KEY=
```

Install Python dependencies and run migrations:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
```

Start the API:

```powershell
uvicorn main:app --reload --port 8000
```

The API is available at `http://localhost:8000`. Health check: `http://localhost:8000/health`.

### 2. Configure the frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies `/v1` requests to the local API.

## Useful Commands

```powershell
# Backend
alembic upgrade head
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm run dev
npm run build
npm run lint
```

## Deployment

The root `render.yaml` defines the backend web service for Render. Configure the database URL, JWT secret, and QStash values as encrypted environment variables in the Render dashboard. Build and deploy the frontend separately using the generated `frontend/dist` output or a static hosting provider.

## Security

Never commit `.env` files, private keys, credentials, virtual environments, dependency directories, or generated build output. Use environment variables for all deployment secrets.

## License

This project is currently distributed without a public license.
