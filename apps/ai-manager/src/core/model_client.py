"""
Model client module for fetching model information from the Celery worker.

This module provides a client for the API to fetch model information from the Celery worker
instead of implementing its own folder watcher.
"""

import logging
import time
from typing import Dict, Optional, List
from celery.result import AsyncResult

from src.core.celery_app import celery_app
from src.models.inference import ModelInfo

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ModelClient:
    """
    Client for fetching model information from the Celery worker.

    This class provides methods for the API to fetch model information from the Celery worker
    instead of implementing its own folder watcher.
    """

    def __init__(self):
        """
        Initialize the model client.
        """
        self._models_cache: Dict[str, Dict] = {}
        self._last_fetch_time = 0
        self._cache_ttl = 10  # Cache TTL in seconds

    def _is_cache_valid(self) -> bool:
        """
        Check if the cache is still valid.

        Returns:
            True if the cache is valid, False otherwise
        """
        return (time.time() - self._last_fetch_time) < self._cache_ttl and self._models_cache


# Create a singleton instance
model_client = ModelClient()
