# Deployment Guide

## Production Deployment with Docker Compose

1. Clone repository & configure `.env`:
   ```bash
   cp .env.example .env
   ```

2. Build and start production containers:
   ```bash
   docker-compose up -d --build
   ```

3. Verify health endpoints:
   - Backend API: `http://localhost:8000/health`
   - Next.js Web: `http://localhost:3000`
