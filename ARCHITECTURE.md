# System Architecture

## Overview

The platform uses a decoupled client-server architecture:
- **Frontend**: Next.js 15 App Router, TypeScript, Tailwind CSS, Recharts, Lucide Icons.
- **Backend**: Python 3.14 FastAPI REST service with Async SQLAlchemy 2.0 ORM, Pydantic v2 schemas, Passlib authentication.
- **Database**: PostgreSQL 16 (with zero-config SQLite async fallback for local development).

## Security & Data Hierarchy
```
Organization -> State -> Branch -> Area -> Supervisor -> Farmer -> Farm -> Shed -> Flock
```
Row-level and endpoint authorization is strictly enforced at the backend level via FastAPI dependencies (`RequireRole`).
