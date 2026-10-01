from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import forecast, health, stress
from src.api.dependencies import connect_to_mongo, close_mongo_connection
import uvicorn
import os

app = FastAPI(title="CashCompass API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    from src.models.stress_classifier import classifier
    classifier.load_model()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

app.include_router(health.router)
app.include_router(forecast.router, prefix="/api/v1")
app.include_router(stress.router, prefix="/api/v1")

if __name__ == "__main__":
    uvicorn.run("src.api.main:app", host="0.0.0.0", port=8000, reload=True)
