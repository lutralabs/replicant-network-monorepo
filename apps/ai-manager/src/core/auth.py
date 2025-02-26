import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict

# Security configuration
API_KEYS = os.environ.get("API_KEYS", "test-key-1,test-key-2").split(",")

# Security scheme
security = HTTPBearer()


def verify_api_key(api_key: str) -> bool:
    """
    Verify if the provided API key is valid.

    Args:
        api_key (str): The API key to verify.

    Returns:
        bool: True if the API key is valid, False otherwise.
    """
    return api_key in API_KEYS


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """
    Get the current user from the provided credentials using API key authentication.

    Args:
        credentials (HTTPAuthorizationCredentials): The credentials provided in the request.

    Returns:
        Dict: A dictionary containing the user information.

    Raises:
        HTTPException: If the credentials are invalid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid API key",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Get the token from credentials
    token = credentials.credentials

    # Verify API key
    if verify_api_key(token):
        return {"sub": "api_user"}

    # If API key is invalid, raise exception
    raise credentials_exception
