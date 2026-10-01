from fastapi import APIRouter, Depends
from src.api.schemas import PersonaData
from src.api.dependencies import get_database
from typing import Dict, Any

router = APIRouter()

# Mock data generation for demo purposes
def get_mock_data(persona_id: str) -> Dict[str, Any]:
    if persona_id == 'student':
        return {
            "persona_id": "student",
            "current_balance": 3150,
            "deficit_date": "Oct 18",
            "risk_percent": 92,
            "risk_level": "CRITICAL PRESSURE",
            "fee_leakage": 125,
            "forecast": {
                "labels": ["Oct 1", "Oct 2", "Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7", "Oct 8"],
                "historical": [6500, 5200, 4800, 4100, 3150, None, None, None],
                "p50": [None, None, None, None, 3150, 2400, 1100, -200],
                "p10": [None, None, None, None, 3150, 1800, 400, -900],
                "p90": [None, None, None, None, 3150, 3200, 2800, 2000]
            },
            "shap_factors": [
                {"label": "Freelance Income Delay", "impact": "+55% Deficit Impact", "percent": 90},
                {"label": "Unexpected Tech Expense", "impact": "+20% Deficit Impact", "percent": 50},
            ],
            "recommendations": [
                {"title": "Delay non-essential tech purchase", "detail": "Postpone hardware upgrades until next gig payout.", "impact": "Saves ৳2,000", "action": "Lock Buffer", "route": "reserve-vault"}
            ],
            "coach_bangla": "তানভীর ভাই, আপনার ফ্রি-ল্যান্স পেমেন্ট আসতে দেরি হওয়ায় ১৮ অক্টোবরের মধ্যে ব্যালেন্স শূন্য হতে পারে।"
        }
    
    return {
        "persona_id": "salaried",
        "current_balance": 14250,
        "deficit_date": "Oct 23",
        "risk_percent": 87,
        "risk_level": "CRITICAL PRESSURE",
        "fee_leakage": 385,
        "forecast": {
            "labels": ["Oct 1", "Oct 2", "Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7", "Oct 8", "Oct 9", "Oct 10"],
            "historical": [25000, 23500, 21000, 19200, 18000, 17500, 16000, 15200, 14800, 14250],
            "p50": [None, None, None, None, None, None, None, None, None, 14250, 13000, 11500, 9000, 7500, 6000, 4000, 2000, -500],
            "p10": [None, None, None, None, None, None, None, None, None, 14250, 12000, 9500, 7000, 5000, 3000, 1000, -1000, -2500],
            "p90": [None, None, None, None, None, None, None, None, None, 14250, 14000, 13500, 11000, 10000, 9000, 8000, 6000, 4500]
        },
        "shap_factors": [
            {"label": "Food & Discretionary Surge", "impact": "+42% Deficit Impact", "percent": 82},
            {"label": "High Cash-Out Velocity", "impact": "+28% Deficit Impact", "percent": 64},
            {"label": "Upcoming Unbuffered Utility Bill", "impact": "+19% Deficit Impact", "percent": 45}
        ],
        "recommendations": [
            {"title": "Move utility payments to digital", "detail": "Pay DESCO bill directly from wallet to avoid cash-out fees.", "impact": "Saves ৳125 in fees", "action": "Pay Digitally", "route": "mfs-wallet"},
            {"title": "Lock emergency buffer", "detail": "Move ৳500 into your reserve vault before weekend spending.", "impact": "Secures ৳500", "action": "Secure Buffer", "route": "reserve-vault"}
        ],
        "coach_bangla": "রহিম ভাই, আপনার খরচ করার বর্তমান গতি অনুযায়ী আগামী ২৩শে অক্টোবর এর মধ্যে ওয়ালেট ব্যালেন্স শূন্যে নেমে যাওয়ার তীব্র ঝুঁকি রয়েছে।"
    }

@router.get("/forecast/{persona_id}", response_model=PersonaData)
async def get_persona_data(persona_id: str, db = Depends(get_database)):
    # In a real app, we'd query MongoDB here
    # persona_data = await db["personas"].find_one({"persona_id": persona_id})
    return get_mock_data(persona_id)

from pydantic import BaseModel
class VaultLockRequest(BaseModel):
    user_id: str
    amount: float

@router.post("/vault/lock")
async def lock_vault_buffer(request: VaultLockRequest):
    return {"success": True, "amount": request.amount, "message": "Buffer locked successfully"}

