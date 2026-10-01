import os
import random

class StressClassifier:
    def __init__(self):
        self.model_loaded = False

    def load_model(self):
        # Dummy model loading for demonstration
        print("Loaded XGBoost model from models_registry/xgboost_liquidity_model.pkl (MOCK MODE)")
        self.model_loaded = True

    def predict(self, feature_data: dict) -> dict:
        if not self.model_loaded:
            return {"error": "Model not loaded"}
            
        # Hardcoded realistic prediction for demonstration
        risk_percent = random.randint(70, 95)
        prob = risk_percent / 100.0
        
        return {
            "risk_probability": prob,
            "risk_percent": risk_percent,
            "prediction": 1,
            "status": "CRITICAL PRESSURE" if risk_percent >= 80 else "ELEVATED RISK",
            "top_features": [
                {"feature": "burn_rate_first_10d", "importance": 0.45},
                {"feature": "cash_out_dependency_ratio", "importance": 0.32},
                {"feature": "avoidable_fee_leakage", "importance": 0.23}
            ]
        }

# Singleton instance
classifier = StressClassifier()
