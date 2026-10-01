from celery import Celery
import time
import os

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "worker",
    broker=redis_url,
    backend=redis_url
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Dhaka",
    enable_utc=True,
)

@celery_app.task
def generate_forecast(persona_id: str):
    """
    Simulates a heavy background task (e.g. running a LightGBM forecast model)
    """
    print(f"Starting forecast generation for {persona_id}...")
    time.sleep(5)  # Simulate model inference time
    print(f"Forecast generation for {persona_id} completed.")
    return {"status": "success", "persona": persona_id}
