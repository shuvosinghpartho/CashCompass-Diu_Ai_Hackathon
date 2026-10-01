from fastapi import APIRouter
from src.api.dependencies import db

router = APIRouter()

@router.get("/healthz")
async def liveness_probe():
    return {"status": "alive"}

@router.get("/ready")
async def readiness_probe():
    try:
        # Check database connection
        if db.client is not None:
            # Send a ping to confirm a successful connection
            await db.client.admin.command('ping')
            return {"status": "ready", "database": "connected"}
    except Exception as e:
        return {"status": "not_ready", "error": str(e)}
    
    return {"status": "ready", "database": "not_connected"}
