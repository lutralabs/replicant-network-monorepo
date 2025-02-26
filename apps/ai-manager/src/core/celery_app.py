from celery import Celery
import os

# Get Redis URL from environment variable or use default
redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

# Create Celery app
celery_app = Celery(
    "ai_manager",
    broker=redis_url,
    backend=redis_url,
    include=["src.tasks.inference_tasks"]
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,  # 1 hour max runtime for tasks
    worker_prefetch_multiplier=1,  # Process one task at a time per worker
    broker_connection_retry_on_startup=True,
    worker_max_memory_per_child=4000000,  # Restart worker after using 4GB of memory

    # Critical settings to prevent memory issues and segmentation faults
    worker_concurrency=1,  # Use only one worker process
    task_acks_late=True,  # Acknowledge tasks after they complete
    worker_max_tasks_per_child=1,  # Restart worker after each task to free memory

    # Prevent worker from being killed due to memory issues
    worker_send_task_events=False,  # Reduce IPC overhead
    worker_log_format='[%(asctime)s: %(levelname)s/%(processName)s] %(message)s',

    # Use 'solo' pool to avoid multiprocessing issues with PyTorch
    # This is critical for preventing SIGSEGV errors
    worker_pool='solo',
    worker_pool_restarts=True,
)
