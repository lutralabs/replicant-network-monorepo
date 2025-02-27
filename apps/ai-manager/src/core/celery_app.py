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

    # Enhanced error handling and resilience settings
    broker_connection_retry=True,  # Retry connecting to broker if connection is lost
    broker_connection_max_retries=None,  # Retry indefinitely
    broker_connection_timeout=10,  # Connection timeout in seconds

    # Task retry settings (default values, can be overridden per task)
    task_default_retry_delay=5,  # 5 seconds delay before retrying
    task_max_retries=3,  # Maximum number of retries
    task_retry_backoff=True,  # Use exponential backoff
    task_retry_backoff_max=600,  # Maximum backoff time (10 minutes)

    # Redis connection pool settings
    broker_pool_limit=10,  # Maximum number of connections in the pool
    redis_max_connections=20,  # Maximum number of connections to Redis

    # Task result settings
    task_ignore_result=False,  # We need results for task status tracking
    result_expires=86400,  # Results expire after 24 hours

    # Worker crash recovery
    # Cancel tasks if connection is lost
    worker_cancel_long_running_tasks_on_connection_loss=True,
    worker_deduplicate_successful_tasks=True,  # Prevent duplicate task execution
)
