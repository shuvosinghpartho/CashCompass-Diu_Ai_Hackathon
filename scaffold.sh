#!/bin/bash
# Scaffolding the upay-cashcompass project structure

mkdir -p .github/workflows
touch .github/workflows/ci.yml
touch .github/workflows/docker-build.yml

mkdir -p data/raw data/processed data/generator data/schemas
touch data/generator/__init__.py
touch data/generator/config.py
touch data/generator/personas.py
touch data/generator/transaction_patterns.py
touch data/generator/generate_synthetic_ledger.py
touch data/schemas/transaction_schema.json

mkdir -p configs
touch configs/base_config.yaml
touch configs/feature_config.yaml
touch configs/model_forecaster.yaml
touch configs/model_classifier.yaml
touch configs/guardrail_policies.yaml

mkdir -p src/common src/data_pipeline src/models src/guardrails src/copilot src/api/routes
touch src/__init__.py

touch src/common/__init__.py
touch src/common/logger.py
touch src/common/exceptions.py
touch src/common/utils.py

touch src/data_pipeline/__init__.py
touch src/data_pipeline/loader.py
touch src/data_pipeline/validator.py
touch src/data_pipeline/feature_engineering.py

touch src/models/__init__.py
touch src/models/base.py
touch src/models/forecaster.py
touch src/models/stress_classifier.py
touch src/models/explainer.py
touch src/models/evaluator.py
touch src/models/registry.py

touch src/guardrails/__init__.py
touch src/guardrails/policy_rules.py
touch src/guardrails/fair_lending_validator.py
touch src/guardrails/action_evaluator.py

touch src/copilot/__init__.py
touch src/copilot/prompt_templates.py
touch src/copilot/schemas.py
touch src/copilot/advisor_service.py

touch src/api/__init__.py
touch src/api/middleware.py
touch src/api/routes/__init__.py
touch src/api/routes/health.py
touch src/api/routes/stress.py
touch src/api/routes/coach.py

mkdir -p tests/unit tests/integration
touch tests/conftest.py
touch tests/unit/test_feature_engineering.py
touch tests/unit/test_models.py
touch tests/unit/test_guardrails.py
touch tests/unit/test_api_schemas.py
touch tests/integration/test_end_to_end_pipeline.py
touch tests/integration/test_api_endpoints.py

mkdir -p notebooks
touch notebooks/01_synthetic_data_exploration.ipynb
touch notebooks/02_forecasting_benchmark.ipynb
touch notebooks/03_risk_calibration_analysis.ipynb
touch notebooks/04_business_roi_simulation.ipynb

mkdir -p scripts
touch scripts/run_synthetic_pipeline.sh
touch scripts/train_all_models.py
touch scripts/run_local_demo.sh

mkdir -p deployments
touch deployments/Dockerfile
touch deployments/docker-compose.yml
touch deployments/nginx.conf

mkdir -p docs
touch docs/ARCHITECTURE.md
touch docs/LOGIC_CHAIN.md
touch docs/RESPONSIBLE_AI.md
touch docs/API_SPEC.json

touch .dockerignore
touch .env.example
touch .gitignore
touch Makefile
touch pyproject.toml
touch requirements-dev.txt

echo "Project structure scaffolded successfully!"
