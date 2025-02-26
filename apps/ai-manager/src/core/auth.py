import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Dict

# Security configuration
SECRET_KEY = os.environ.get(
    "SECRET_KEY", "your-secret-key-for-development-only")
API_KEYS = os.environ.get("API_KEYS", "test-key-1,test-key-2").split(",")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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
    Get the current user from the provided credentials.

    This function supports both API key and JWT token authentication.

    Args:
        credentials (HTTPAuthorizationCredentials): The credentials provided in the request.

    Returns:
        Dict: A dictionary containing the user information.

    Raises:
        HTTPException: If the credentials are invalid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Check if it's a JWT token or API key
    token = credentials.credentials

    # First try as API key
    if verify_api_key(token):
        return {"sub": "api_user"}

    # Then try as JWT
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return {"sub": username}
    except JWTError:
        raise credentials_exception
