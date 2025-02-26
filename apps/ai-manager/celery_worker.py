#!/usr/bin/env python
"""
Celery worker script for AI Manager.

This script starts a Celery worker for processing AI inference tasks.
"""

import logging
import os
from src.core.celery_app import celery_app


# Set up logging
log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=getattr(logging, log_level))
logger = logging.getLogger(__name__)

os.environ['PYTORCH_ENABLE_MPS_FALLBACK'] = '1'

if __name__ == "__main__":
    logger.info("Starting Celery worker for AI Manager")
    celery_app.worker_main(["worker", "--loglevel=info", "-c", "1"])
