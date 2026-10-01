from pydantic import BaseModel
from typing import List, Optional

class ForecastResponse(BaseModel):
    labels: List[str]
    historical: List[Optional[float]]
    p50: List[Optional[float]]
    p10: List[Optional[float]]
    p90: List[Optional[float]]

class ShapFactor(BaseModel):
    label: str
    impact: str
    percent: int

class CoachRecommendation(BaseModel):
    title: str
    detail: str
    impact: str
    action: str
    route: str

class PersonaData(BaseModel):
    persona_id: str
    current_balance: float
    deficit_date: str
    risk_percent: int
    risk_level: str
    fee_leakage: float
    forecast: ForecastResponse
    shap_factors: List[ShapFactor]
    recommendations: List[CoachRecommendation]
    coach_bangla: str
