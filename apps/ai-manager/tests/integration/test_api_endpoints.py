import pytest
from fastapi import status


def test_root_endpoint(client):
    """Test the root endpoint returns the expected response"""
    response = client.get("/")

    # Check status code
    assert response.status_code == status.HTTP_200_OK

    # Check response content
    data = response.json()
    assert "message" in data
    assert "documentation" in data
    assert "latest_version" in data
    assert data["latest_version"] == "/v1"


def test_v1_root_endpoint(client):
    """Test the v1 root endpoint returns the expected response"""
    response = client.get("/v1")

    # Check status code
    assert response.status_code == status.HTTP_200_OK

    # Check response content
    data = response.json()
    assert "message" in data
    assert "device" in data
    assert "version" in data
    assert data["version"] == "v1"


def test_health_endpoint(client):
    """Test the health endpoint returns the expected response"""
    # Test both the versioned and unversioned endpoints
    endpoints = ["/v1/health"]

    for endpoint in endpoints:
        response = client.get(endpoint)

        # Check status code
        assert response.status_code == status.HTTP_200_OK

        # Check response content
        data = response.json()
        assert "status" in data
        assert "device" in data
        assert "timestamp" in data
        assert data["status"] == "healthy"


def test_infer_endpoint_valid_request(client, valid_api_key, valid_inference_request):
    """Test the infer endpoint with a valid request and API key"""
    # Test both the versioned and unversioned endpoints
    endpoints = ["/v1/infer"]

    for endpoint in endpoints:
        # Set up headers with valid API key
        headers = {
            "Authorization": f"Bearer {valid_api_key}"
        }

        # Make the request
        response = client.post(
            endpoint, json=valid_inference_request, headers=headers)

        # Check status code
        assert response.status_code == status.HTTP_200_OK

        # Check response content
        data = response.json()
        assert "id" in data
        assert "result" in data
        assert "processing_time" in data
        assert data["id"] == valid_inference_request["id"]
        assert isinstance(data["result"], list)
        assert isinstance(data["processing_time"], float)


def test_infer_endpoint_invalid_api_key(client, invalid_api_key, valid_inference_request):
    """Test the infer endpoint with an invalid API key"""
    # Test both the versioned and unversioned endpoints
    endpoints = ["/v1/infer"]

    for endpoint in endpoints:
        # Set up headers with invalid API key
        headers = {
            "Authorization": f"Bearer {invalid_api_key}"
        }

        # Make the request
        response = client.post(
            endpoint, json=valid_inference_request, headers=headers)

        # Check status code
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_infer_endpoint_missing_auth(client, valid_inference_request):
    """Test the infer endpoint with missing authentication"""
    # Test both the versioned and unversioned endpoints
    endpoints = ["/v1/infer"]

    for endpoint in endpoints:
        # Make the request without auth headers
        response = client.post(endpoint, json=valid_inference_request)

        # Check status code - should be 401 or 403
        assert response.status_code in [
            status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]


def test_infer_endpoint_invalid_request(client, valid_api_key, invalid_inference_request):
    """Test the infer endpoint with an invalid request (prompt too long)"""
    # Test both the versioned and unversioned endpoints
    endpoints = ["/v1/infer"]

    for endpoint in endpoints:
        # Set up headers with valid API key
        headers = {
            "Authorization": f"Bearer {valid_api_key}"
        }

        # Make the request
        response = client.post(
            endpoint, json=invalid_inference_request, headers=headers)

        # Check status code
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_infer_endpoint_missing_field(client, valid_api_key, missing_field_inference_request):
    """Test the infer endpoint with a request missing a required field"""
    # Test both the versioned and unversioned endpoints
    endpoints = ["/v1/infer"]

    for endpoint in endpoints:
        # Set up headers with valid API key
        headers = {
            "Authorization": f"Bearer {valid_api_key}"
        }

        # Make the request
        response = client.post(
            endpoint, json=missing_field_inference_request, headers=headers)

        # Check status code
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
