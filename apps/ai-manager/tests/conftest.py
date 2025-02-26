import pytest
from fastapi.testclient import TestClient
import os
from src.main import app
from src.core.auth import API_KEYS
from src.core.model_registry import model_registry

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
def mock_model_id():
    """
    Return a mock model ID for testing
    """
    # Add a mock model to the registry
    mock_model_hash = "mock-model-hash-123"
    model_registry.models[mock_model_hash] = {
        "path": "ai-models/mock-model.ckpt",
        "name": "mock-model.ckpt",
        "size": 1024,
        "mtime": 1234567890,
        "extension": ".ckpt",
        "last_scanned": 1234567890
    }
    model_registry.path_to_hash["ai-models/mock-model.ckpt"] = mock_model_hash
    return mock_model_hash


@pytest.fixture
def valid_inference_request(mock_model_id):
    """
    Return a valid inference request payload
    """
    return {
        "id": "test-request-123",
        "model_id": mock_model_id,
        "prompt": "This is a test prompt for inference"
    }


@pytest.fixture
def invalid_inference_request(mock_model_id):
    """
    Return an invalid inference request payload (prompt too long)
    """
    return {
        "id": "test-request-456",
        "model_id": mock_model_id,
        "prompt": "x" * 201  # 201 characters, exceeding the 200 character limit
    }


@pytest.fixture
def missing_field_inference_request():
    """
    Return an inference request payload with missing required field
    """
    return {
        "prompt": "This is a test prompt for inference"
        # Missing 'id' and 'model_id' fields
    }
