from fastapi import APIRouter, Depends, HTTPException, status, Response
from datetime import datetime
from typing import Dict, List, Optional
import torch
import os
import logging
import json
import random
import numpy as np
from PIL import Image
import uuid

from src.core.device import device
from src.core.auth import get_current_user
from src.models.inference import InferenceRequest, InferenceResponse, ImageResult, encode_image_to_base64
from src.core.model_registry import model_registry
from src.core.supabase import supabase
from src.tasks.inference_tasks import generate_image

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
        f"Submitting inference job with model: {model_info['name']} (hash: {request.model_id})")

    try:
        # Generate image URLs that will be used once the images are generated
        image_results = []
        task_ids = []

        # Get bucket name from environment variable or use default
        bucket_name = os.environ.get(
            "SUPABASE_BUCKET_NAME", "generated-images")

        for i in range(request.num_images):
            # Generate a unique ID for this specific image
            image_id = f"{request.id}_{i}"

            # Calculate the seed for this image
            current_seed = request.seed if request.seed is not None else random.randint(
                0, 2**32 - 1)
            if i > 0 and request.seed is not None:
                current_seed = request.seed + i

            # Generate the URL where the image will be stored
            image_path = f"{request.id}"

            # Get the public URL using the Supabase singleton
            image_url = supabase.storage.from_(
                bucket_name).get_public_url(image_path)

            # Submit the task to Celery
            task = generate_image.delay(
                request_id=request.id,
                model_id=request.model_id,
                prompt=request.prompt,
                negative_prompt=request.negative_prompt,
                num_inference_steps=request.num_inference_steps,
                guidance_scale=request.guidance_scale,
                width=request.width,
                height=request.height,
                seed=current_seed,
                image_index=i
            )

            task_ids.append(task.id)

            # Add placeholder result with the URL where the image will be available
            image_results.append(
                ImageResult(
                    url=image_url,
                    seed=current_seed,
                    width=request.width,
                    height=request.height,
                )
            )

            logger.info(
                f"Submitted task {task.id} for image {i+1}/{request.num_images}")

        # Calculate processing time for task submission
        processing_time = (datetime.now() - start_time).total_seconds()

        logger.info(
            f"Submitted {len(image_results)} image generation tasks in {processing_time:.2f} seconds")

        # Return response with task IDs and URLs where images will be available
        return InferenceResponse(
            id=request.id,
            model_id=request.model_id,
            images=image_results,
            processing_time=processing_time,
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            num_inference_steps=request.num_inference_steps or model_registry.default_inference_steps,
            guidance_scale=request.guidance_scale or model_registry.default_guidance_scale,
            # Add additional fields for async processing
            task_ids=task_ids,
            status="processing"
        )
    except ValueError as e:
        logger.error(f"Value error during inference: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error during inference: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during inference: {str(e)}"
        )


@router.get("/infer/{request_id}/status", status_code=status.HTTP_200_OK)
async def get_inference_status(request_id: str,
                               user: Dict = Depends(get_current_user)):
    """
    Get the status of an inference request.

    Args:
        request_id: The ID of the inference request

    Returns:
        Status information about the inference request
    """
    # In a real implementation, you would check the status of the Celery tasks
    # associated with this request_id

    # For now, we'll just return a placeholder response
    return {
        "request_id": request_id,
        "status": "processing",
        "message": "This endpoint is a placeholder. Implement task status checking."
    }
