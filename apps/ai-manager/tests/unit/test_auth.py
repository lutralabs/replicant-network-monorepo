import pytest
from src.main import verify_api_key
from jose import jwt
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


def test_jwt_token_creation_and_verification():
    """Test JWT token creation and verification"""
    # Get the secret key from the environment
    secret_key = os.environ.get("SECRET_KEY", "test-secret-key")

    # Create a JWT token
    payload = {"sub": "test-user"}
    token = jwt.encode(payload, secret_key, algorithm="HS256")

    # Verify the JWT token
    decoded = jwt.decode(token, secret_key, algorithms=["HS256"])

    # Check that the decoded payload matches the original
    assert decoded["sub"] == payload["sub"]


def test_jwt_token_invalid_signature():
    """Test that a JWT token with an invalid signature is rejected"""
    # Get the secret key from the environment
    secret_key = os.environ.get("SECRET_KEY", "test-secret-key")

    # Create a JWT token
    payload = {"sub": "test-user"}
    token = jwt.encode(payload, secret_key, algorithm="HS256")

    # Try to verify the JWT token with a different secret key
    with pytest.raises(jwt.JWTError):
        jwt.decode(token, "wrong-secret-key", algorithms=["HS256"])
