import pytest
from fastapi import status


def test_list_models_endpoint(client, valid_api_key, mock_model_id):
    """Test the list models endpoint returns the expected response"""
    # Set up headers with valid API key
    headers = {
        "Authorization": f"Bearer {valid_api_key}"
    }

    # Make the request
    response = client.get("/v1/models", headers=headers)

    # Check status code
    assert response.status_code == status.HTTP_200_OK

    # Check response content
    data = response.json()
    assert "models" in data
    assert "count" in data
    assert data["count"] >= 1  # At least the mock model should be present

    # Check that the mock model is in the list
    mock_model_found = False
    for model in data["models"]:
        if model["id"] == mock_model_id:
            mock_model_found = True
            assert model["name"] == "mock-model.ckpt"
            assert model["size"] == 1024
            assert model["path"] == "ai-models/mock-model.ckpt"
            assert model["extension"] == ".ckpt"
            break

    assert mock_model_found, "Mock model not found in the list"


def test_get_model_endpoint(client, valid_api_key, mock_model_id):
    """Test the get model endpoint returns the expected response"""
    # Set up headers with valid API key
    headers = {
        "Authorization": f"Bearer {valid_api_key}"
    }

    # Make the request
    response = client.get(f"/v1/models/{mock_model_id}", headers=headers)

    # Check status code
    assert response.status_code == status.HTTP_200_OK

    # Check response content
    model = response.json()
    assert model["id"] == mock_model_id
    assert model["name"] == "mock-model.ckpt"
    assert model["size"] == 1024
    assert model["path"] == "ai-models/mock-model.ckpt"
    assert model["extension"] == ".ckpt"


def test_get_model_not_found(client, valid_api_key):
    """Test the get model endpoint returns 404 for non-existent model"""
    # Set up headers with valid API key
    headers = {
        "Authorization": f"Bearer {valid_api_key}"
    }

    # Make the request with a non-existent model ID
    response = client.get("/v1/models/non-existent-model-id", headers=headers)

    # Check status code
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_list_models_unauthorized(client):
    """Test the list models endpoint requires authentication"""
    # Make the request without auth headers
    response = client.get("/v1/models")

    # Check status code - should be 401 or 403
    assert response.status_code in [
        status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]


def test_get_model_unauthorized(client, mock_model_id):
    """Test the get model endpoint requires authentication"""
    # Make the request without auth headers
    response = client.get(f"/v1/models/{mock_model_id}")

    # Check status code - should be 401 or 403
    assert response.status_code in [
        status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]
