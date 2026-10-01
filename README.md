# CashCompass 🧭 - DIU AI Hackathon 

<div align="center">
  <img src="frontend/assets/images/cashcompass-logo.svg" alt="CashCompass Logo" width="120" height="120">
  <p><b>Financial Health & Liquidity Workspace for the Next Billion Users</b></p>
</div>

---

## 📖 Overview
**CashCompass** is a predictive financial health assistant designed for MFS (Mobile Financial Services) users in Bangladesh. Built for the **DIU AI Hackathon**, it leverages Explainable AI (XAI) and deterministic behavioral modeling to help low-to-middle-income users avoid liquidity crunches, manage avoidable fee leakages, and build emergency savings buffers.

## ✨ Key Features
- **🔮 Liquidity Forecasting**: Probabilistic 30-day cash-flow modeling predicting exact dates of potential deficit breaches.
- **🤖 Explainable AI (TreeSHAP)**: Fully transparent, non-black-box insights detailing *why* a user is at risk (e.g., "High cash-out velocity").
- **💬 Bangla Copilot**: A grounded, responsible advisory engine providing plain-language (Bengali) actionable steps without predatory lending traps.
- **🔒 Smart Reserve Vault**: Automated and manual micro-saving triggers to build emergency buffers safely.
- **🛡️ Responsible AI Design**: Strictly ignores demographic attributes, focusing purely on transactional behavior (velocity, burn rate, entropy) to ensure fair lending and advisory practices.

---

## 🛠️ Tech Stack
- **Frontend**: Custom HTML5, Vanilla CSS3 (Glassmorphism & Custom Animations), Vanilla JS (Zero-dependency modular architecture), Chart.js
- **Backend Core**: FastAPI (Python), Motor (Async MongoDB), Celery (Background Tasks), Pydantic
- **Machine Learning**: XGBoost, Scikit-Learn, SHAP, Pandas
- **Architecture Pattern**: Microservice-ready, Event-driven ETL processing

---

## 📂 Project Structure

```text
CashCompass/
│
├── data/                                 # Data & Pipeline
│   ├── generator/                        # Synthetic MFS transaction simulator
│   └── schemas/                          # Strict JSON contracts
│
├── configs/                              # Global Configurations
│   ├── model_forecaster.yaml             
│   └── guardrail_policies.yaml           # Anti-predatory system rules
│
├── src/                                  # Core Backend System
│   ├── api/                              # FastAPI Production Service
│   │   ├── routes/                       # Endpoints (health, forecast, stress)
│   │   └── dependencies.py               # Async Mongo & Model connections
│   ├── models/                           # ML & Statistical Models
│   │   ├── stress_classifier.py          # XGBoost Inference Engine
│   │   └── forecaster.py                 
│   ├── data_pipeline/                    # ETL & Feature Engineering
│   ├── guardrails/                       # Responsible AI policy enforcement
│   └── copilot/                          # Bangla-grounded NLP engine
│
├── frontend/                             # Animated Premium Web UI
│   ├── assets/                           
│   ├── css/                              # Modular CSS (animations, components)
│   ├── js/                               # Services, State Management, Renderers
│   └── index.html                        # Application Entry
│
├── notebooks/                            # ML & Research Artifacts
│   └── 01_synthetic_data_exploration.ipynb # EDA & XGBoost Training Pipeline
│
├── scripts/                              # Operational Scripts
│   ├── train_all_models.py               # E2E Training execution
│   └── run_backend.sh                    # Localboot script
│
├── tests/                                # Production Test Suite
├── deployments/                          # Docker / Cloud configs
└── docs/                                 # Architecture & Logic Chains
```

---

## 🚀 Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/shuvosinghpartho/CashCompass-Diu_Ai_Hackathon.git
cd CashCompass-Diu_Ai_Hackathon
```

### 2. Set up the Python Environment
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Run the Backend API
The FastAPI application serves inference endpoints and health checks.
```bash
# Ensure you are in the virtual environment
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Serve the Frontend Dashboard
In a new terminal window, host the static frontend files:
```bash
cd frontend
python3 -m http.server 3000
```
Navigate to **`http://localhost:3000`** in your browser.

---

## ⚖️ Hackathon Compliance
This project strictly adheres to Responsible AI guidelines:
- **No Data Bias**: Demographic identities are not ingested into the predictive layers.
- **Explainability**: Every UI recommendation is backed by auditable SHAP attributions.
- **Non-Predatory**: The system actively prevents high-interest loan nudges, favoring savings and digital rerouting.

<br>
<p align="center">
  <i>Developed with ❤️ for the DIU AI Hackathon</i>
</p>
