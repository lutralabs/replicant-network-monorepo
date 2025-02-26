from fastapi import APIRouter, Response, status
from datetime import datetime
from src.core.device import device

# Create a router for health-related endpoints
router = APIRouter(tags=["health"])


@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check(response: Response):
    """
    Health check endpoint that returns the current status of the API.

    Response will be in JSON format.
    """
    # Set response content type to JSON
    response.headers["Content-Type"] = "application/json"

    return {
        "status": "healthy",
        "device": str(device),
        "timestamp": datetime.now().isoformat()
    }


@router.get("/", status_code=status.HTTP_200_OK)
async def root(response: Response):
    """
    Root endpoint that returns basic information about the API.

    Response will be in JSON format.
    """
    # Set response content type to JSON
    response.headers["Content-Type"] = "application/json"

    return {
        "message": "AI Inference API is running",
        "device": str(device),
        "version": "v1"
    }
