from fastapi import APIRouter, HTTPException, Depends, status, Response
from typing import Dict

from src.core.model_registry import model_registry
from src.models.inference import ModelInfo, ModelsListResponse
from src.core.auth import get_current_user

# Create a router for model-related endpoints
router = APIRouter(tags=["models"])


@router.get("/models", response_model=ModelsListResponse,
            response_model_exclude_none=True,
            status_code=status.HTTP_200_OK)
async def list_models(response: Response, user: Dict = Depends(get_current_user)):
    """
    List all available models.

    Requires authentication via API key or JWT token.

    Response will be in JSON format.
    """
    # Set response content type to JSON
    response.headers["Content-Type"] = "application/json"

    models = model_registry.models

    # Convert to list of ModelInfo objects
    model_list = [
        ModelInfo(
            id=model_hash,
            name=model_info["name"],
            size=model_info["size"],
            path=model_info["path"],
            extension=model_info["extension"]
        )
        for model_hash, model_info in models.items()
    ]

    return ModelsListResponse(
        models=model_list,
        count=len(model_list)
    )


@router.get("/models/{model_id}", response_model=ModelInfo,
            response_model_exclude_none=True,
            status_code=status.HTTP_200_OK)
async def get_model(model_id: str, response: Response, user: Dict = Depends(get_current_user)):
    """
    Get information about a specific model.

    Requires authentication via API key or JWT token.

    Response will be in JSON format.
    """
    # Set response content type to JSON
    response.headers["Content-Type"] = "application/json"

    model_info = model_registry.get_model_by_hash(model_id)

    if not model_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model with ID {model_id} not found"
        )

    return ModelInfo(
        id=model_id,
        name=model_info["name"],
        size=model_info["size"],
        path=model_info["path"],
        extension=model_info["extension"]
    )
