#!/bin/bash
echo "Starting Celery worker in the background..."
celery -A src.worker.celery_app worker --loglevel=info &
echo "Starting FastAPI backend..."
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
