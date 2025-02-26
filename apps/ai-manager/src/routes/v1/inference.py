from fastapi import APIRouter, Depends, HTTPException, status, Response
from datetime import datetime
from typing import Dict
import torch
import os
import logging
import json

from src.core.device import device
from src.core.auth import get_current_user
from src.models.inference import InferenceRequest, InferenceResponse
from src.core.model_registry import model_registry

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a router for inference-related endpoints
router = APIRouter(tags=["inference"])


@router.post("/infer", response_model=InferenceResponse,
             response_model_exclude_none=True,
             status_code=status.HTTP_200_OK)
async def infer(request: InferenceRequest,
                response: Response,
                user: Dict = Depends(get_current_user)):
    """
    Perform inference using the AI model.

    Requires authentication via API key or JWT token.

    Request must be in JSON format with Content-Type: application/json.
    Response will be in JSON format.
    """
    start_time = datetime.now()

    # Set response content type to JSON
    response.headers["Content-Type"] = "application/json"

    # Get the model info from the registry
    model_info = model_registry.get_model_by_hash(request.model_id)
    if not model_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model with ID {request.model_id} not found"
        )

    logger.info(
        f"Running inference with model: {model_info['name']} (hash: {request.model_id})")

    try:
        # This is where you would load the model and run inference
        # For now, we'll just do a simple matrix multiplication as a placeholder
        a = torch.randn(3, 3, device=device)
        b = torch.randn(3, 3, device=device)
        c = torch.matmul(a, b)

        # Convert tensor to list for JSON serialization
        result = c.cpu().tolist()

        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()

        return InferenceResponse(
            id=request.id,
            model_id=request.model_id,
            result=result,
            processing_time=processing_time
        )
    except Exception as e:
        logger.error(f"Error during inference: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during inference: {str(e)}"
        )
