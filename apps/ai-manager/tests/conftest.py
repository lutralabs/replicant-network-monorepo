import pytest
from fastapi.testclient import TestClient
import os
from src.main import app, API_KEYS

# Set test environment variables
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["API_KEYS"] = "test-key-1,test-key-2"


@pytest.fixture
def client():
    """
    Create a test client for the FastAPI application
    """
    with TestClient(app) as client:
        yield client


@pytest.fixture
def valid_api_key():
    """
    Return a valid API key for testing
    """
    return API_KEYS[0]


@pytest.fixture
def invalid_api_key():
    """
    Return an invalid API key for testing
    """
    return "invalid-api-key"


@pytest.fixture
def valid_inference_request():
    """
    Return a valid inference request payload
    """
    return {
        "id": "test-request-123",
        "prompt": "This is a test prompt for inference"
    }


@pytest.fixture
def invalid_inference_request():
    """
    Return an invalid inference request payload (prompt too long)
    """
    return {
        "id": "test-request-456",
        "prompt": "x" * 201  # 201 characters, exceeding the 200 character limit
    }


@pytest.fixture
def missing_field_inference_request():
    """
    Return an inference request payload with missing required field
    """
    return {
        "prompt": "This is a test prompt for inference"
        # Missing 'id' field
    }
