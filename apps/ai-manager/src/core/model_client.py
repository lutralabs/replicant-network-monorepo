"""
Model client module for fetching model information.

This module provides a client for the API to fetch model information from the model registry.
"""

import logging
import time
from typing import Dict, Optional, List

from src.core.model_registry import model_registry
from src.models.inference import ModelInfo

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ModelClient:
    """
    Client for fetching model information from the model registry.

    This class provides methods for the API to fetch model information from the model registry
    with caching to reduce repeated calls.
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

    def get_models(self) -> List[Dict]:
        """
        Get all available models.

        Returns:
            List of model information dictionaries
        """
        if not self._is_cache_valid():
            # Refresh the cache
            self._models_cache = {
                model["hash"]: model for model in model_registry.get_models()}
            self._last_fetch_time = time.time()

        return list(self._models_cache.values())

    def get_model(self, model_id: str) -> Optional[Dict]:
        """
        Get information about a specific model.

        Args:
            model_id: The ID (hash) of the model

        Returns:
            Model information dictionary or None if not found
        """
        if not self._is_cache_valid():
            # Refresh the cache
            self._models_cache = {
                model["hash"]: model for model in model_registry.get_models()}
            self._last_fetch_time = time.time()

        return self._models_cache.get(model_id)


# Create a singleton instance
model_client = ModelClient()
