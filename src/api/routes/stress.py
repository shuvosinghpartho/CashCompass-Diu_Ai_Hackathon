from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.models.stress_classifier import classifier

router = APIRouter()

class FeaturePayload(BaseModel):
    avg_monthly_inflow: float
    income_entropy: float
    burn_rate_first_10d: float
    rolling_outflow_mean_7d: float
    rolling_outflow_std_7d: float
    velocity_acceleration: float
    cash_out_dependency_ratio: float
    avoidable_fee_leakage: float
    fixed_obligation_ratio: float
    discretionary_spend_ratio: float

@router.post("/stress-prediction")
async def predict_liquidity_stress(payload: FeaturePayload):
    # Pass dict to classifier
    result = classifier.predict(payload.model_dump())
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    return result
