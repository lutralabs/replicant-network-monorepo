import pytest
from src.core.auth import verify_api_key
import os


def test_verify_api_key_valid():
    """Test that a valid API key is verified correctly"""
    # Get the first API key from the environment
    api_key = os.environ.get("API_KEYS", "test-key-1").split(",")[0]

    # Verify the API key
    assert verify_api_key(api_key) is True


def test_verify_api_key_invalid():
    """Test that an invalid API key is rejected"""
    # Use an invalid API key
    api_key = "invalid-key"

    # Verify the API key
    assert verify_api_key(api_key) is False
