from fastapi import APIRouter, Depends, HTTPException, status, Response
from datetime import datetime
from typing import Dict, List
import torch
import os
import logging
import json
import random
import numpy as np
from PIL import Image

from src.core.device import device
from src.core.auth import get_current_user
from src.models.inference import InferenceRequest, InferenceResponse, ImageResult, encode_image_to_base64
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
        # Load the model (from cache if already loaded)
        pipe = model_registry.load_model(request.model_id)

        # Set inference parameters
        num_inference_steps = request.num_inference_steps or model_registry.default_inference_steps
        guidance_scale = request.guidance_scale or model_registry.default_guidance_scale

        # Set generator for reproducibility if seed is provided
        generator = None
        if request.seed is not None:
            generator = torch.Generator(
                device=device).manual_seed(request.seed)

        # Generate images
        image_results = []
        for i in range(request.num_images):
            # If seed is not provided or we're generating multiple images, create a random seed for each
            current_seed = request.seed if request.seed is not None else random.randint(
                0, 2**32 - 1)
            if i > 0 and request.seed is not None:
                current_seed = request.seed + i

            # Create generator with the current seed
            current_generator = torch.Generator(
                device=device).manual_seed(current_seed)

            logger.info(
                f"Generating image {i+1}/{request.num_images} with seed {current_seed}")

            # Run the model
            result = pipe(
                prompt=request.prompt,
                negative_prompt=request.negative_prompt,
                num_inference_steps=num_inference_steps,
                guidance_scale=guidance_scale,
                width=request.width,
                height=request.height,
                generator=current_generator,
            )

            # Get the image
            image = result.images[0]

            # Convert to base64
            base64_image = encode_image_to_base64(image)

            # Add to results
            image_results.append(
                ImageResult(
                    base64=base64_image,
                    seed=current_seed,
                    width=request.width,
                    height=request.height
                )
            )

        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()

        logger.info(
            f"Generated {len(image_results)} images in {processing_time:.2f} seconds")

        return InferenceResponse(
            id=request.id,
            model_id=request.model_id,
            images=image_results,
            processing_time=processing_time,
            prompt=request.prompt,
            negative_prompt=request.negative_prompt,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale
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
