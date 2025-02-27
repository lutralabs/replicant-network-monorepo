import logging
import torch
import random
from datetime import datetime
from io import BytesIO
import os
import gc
from typing import Dict, Optional

from src.core.celery_app import celery_app
from src.core.device import device
from src.core.model_registry import model_registry
from src.core.supabase import supabase
from celery.signals import worker_shutdown, worker_ready, worker_process_init
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# Use the bucket name from environment or default
bucket_name = os.environ.get("SUPABASE_BUCKET_NAME", "generated-images")

# Dictionary to store loaded models in the worker process
# This will be populated during worker initialization
loaded_models = {}

# Initialize model registry when this module is imported
# This ensures models are scanned and the watcher is started for Celery workers
model_registry.scan_models()
model_registry.start_watcher()

# Register a worker process initialization handler to preload models


@worker_process_init.connect
def init_worker_process(**kwargs):
    logger.info("Initializing worker process")
    # Scan models to ensure they're discovered
    models = model_registry.scan_models()

    # Preload models into the worker process
    global loaded_models
    loaded_models = {}

    # Log the number of models found
    logger.info(f"Found {len(models)} models in the registry")

    # Force garbage collection to clean up memory
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

# Register a worker startup signal handler to ensure the model registry is initialized


@worker_ready.connect
def startup_worker_handler(**kwargs):
    logger.info("Celery worker started, ensuring model registry is initialized")
    # Scan models again to ensure they're loaded
    model_registry.scan_models()
    # Make sure the watcher is running
    if not hasattr(model_registry, '_watcher_thread') or not model_registry._watcher_thread or not model_registry._watcher_thread.is_alive():
        model_registry.start_watcher()

# Register a worker shutdown signal handler to stop the model registry watcher


@worker_shutdown.connect
def shutdown_worker_handler(**kwargs):
    logger.info("Celery worker shutting down, stopping model registry watcher")
    model_registry.stop_watcher()

    # Clear loaded models
    global loaded_models
    loaded_models.clear()

    # Force garbage collection
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

# Helper function to get a model, either from the local cache or by loading it


def get_model(model_id: str):
    global loaded_models

    # Check if the model is already loaded in this worker process
    if model_id in loaded_models:
        logger.info(f"Using locally cached model: {model_id}")
        return loaded_models[model_id]

    # Get model info from the registry
    model_info = model_registry.get_model_by_hash(model_id)
    if not model_info:
        raise ValueError(f"Model with ID {model_id} not found")

    logger.info(f"Loading model from {model_info['path']}")

    # Force garbage collection before loading a new model
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

    try:
        # Load the model based on file extension
        if model_info["extension"] in [".ckpt", ".safetensors"]:
            # Load Stable Diffusion model
            from diffusers import StableDiffusionPipeline, DPMSolverMultistepScheduler

            # Set lower precision to reduce memory usage
            dtype = torch.float16 if device.type == "cuda" else torch.float32

            # Load with memory-efficient settings
            pipe = StableDiffusionPipeline.from_single_file(
                model_info["path"],
                torch_dtype=dtype,
                use_safetensors=model_info["extension"] == ".safetensors",
                low_cpu_mem_usage=True,
                variant="fp16" if dtype == torch.float16 else None
            )

            # Use DPM-Solver++ scheduler for faster inference
            pipe.scheduler = DPMSolverMultistepScheduler.from_config(
                pipe.scheduler.config,
                algorithm_type="dpmsolver++",
                use_karras_sigmas=True
            )

            # Move to device
            pipe = pipe.to(device)

            # Enable memory efficient attention
            pipe.enable_attention_slicing(1)

            # Enable xformers if available and on CUDA
            if device.type == "cuda":
                try:
                    pipe.enable_xformers_memory_efficient_attention()
                    logger.info("Enabled xformers memory efficient attention")
                except Exception as e:
                    logger.warning(f"Could not enable xformers: {e}")

            # Cache the model in this worker process
            loaded_models[model_id] = pipe
            logger.info(f"Successfully loaded model: {model_info['name']}")
            return pipe
        else:
            raise ValueError(
                f"Unsupported model format: {model_info['extension']}")
    except Exception as e:
        logger.error(f"Error loading model {model_info['path']}: {e}")
        raise ValueError(f"Failed to load model: {str(e)}")


@celery_app.task(bind=True, name="generate_image",
                 max_retries=3,
                 retry_backoff=True,
                 retry_backoff_max=600,
                 soft_time_limit=1800,
                 time_limit=3600,
                 autoretry_for=(Exception,),
                 retry_kwargs={'max_retries': 3})
def generate_image(
    self,
    request_id: str,
    model_id: str,
    prompt: str,
    negative_prompt: Optional[str] = None,
    num_inference_steps: Optional[int] = None,
    guidance_scale: Optional[float] = None,
    width: Optional[int] = 512,
    height: Optional[int] = 512,
    seed: Optional[int] = None,
    image_index: int = 0,
) -> Dict:
    """
    Celery task to generate an image using the AI model and upload it to Supabase.

    Args:
        request_id: Unique identifier for the request
        model_id: Model ID (hash) to use for inference
        prompt: Text prompt for inference
        negative_prompt: Negative prompt to guide what not to generate
        num_inference_steps: Number of inference steps
        guidance_scale: Guidance scale for classifier-free guidance
        width: Width of the generated image
        height: Height of the generated image
        seed: Random seed for reproducibility
        image_index: Index of the image in a multi-image request

    Returns:
        Dictionary with image information
    """
    start_time = datetime.now()
    image_url = None
    current_seed = None

    try:
        # Get the model info from the registry
        model_info = model_registry.get_model_by_hash(model_id)
        if not model_info:
            raise ValueError(f"Model with ID {model_id} not found")

        logger.info(
            f"Running inference with model: {model_info['name']} (hash: {model_id})")

        # Load the model from our local worker cache or load it if not cached
        pipe = get_model(model_id)

        # Set inference parameters
        num_inference_steps = num_inference_steps or model_registry.default_inference_steps
        guidance_scale = guidance_scale or model_registry.default_guidance_scale

        # If seed is not provided, create a random seed
        current_seed = seed if seed is not None else random.randint(
            0, 2**32 - 1)
        if image_index > 0 and seed is not None:
            current_seed = seed + image_index

        # Create generator with the current seed
        current_generator = torch.Generator(
            device=device).manual_seed(current_seed)

        logger.info(f"Generating image with seed {current_seed}")

        # Run the model with memory-efficient settings
        result = pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
            width=width,
            height=height,
            generator=current_generator,
        )

        # Get the image
        image = result.images[0]

        # Clear CUDA cache after generation if available
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        # Generate a unique filename for the image
        image_filename = f"{request_id}_{image_index}_{current_seed}.png"

        # Convert image to bytes for storage
        img_bytes = BytesIO()
        image.save(img_bytes, format="PNG")
        img_bytes.seek(0)

        # Upload to Supabase
        try:
            logger.info(f"Uploading image to Supabase bucket: {bucket_name}")
            supabase_path = f"{request_id}"

            # Upload the image to the existing bucket
            supabase.storage.from_(bucket_name).upload(
                supabase_path,
                img_bytes.getvalue(),
                {"content-type": "image/png"}
            )

            # Get the public URL
            image_url = supabase.storage.from_(
                bucket_name).get_public_url(supabase_path)
            logger.info(f"Image uploaded successfully. URL: {image_url}")
        except Exception as e:
            logger.error(f"Error uploading to Supabase: {e}")
            raise ValueError(f"Failed to upload image to Supabase: {str(e)}")

        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()

        logger.info(f"Generated image in {processing_time:.2f} seconds")

        return {
            "request_id": request_id,
            "model_id": model_id,
            "seed": current_seed,
            "width": width,
            "height": height,
            "url": image_url,
            "processing_time": processing_time,
            "status": "completed" if image_url and not image_url.startswith("error://") else "partial",
            "image_index": image_index
        }

    except Exception as e:
        logger.error(f"Error during inference: {e}")
        # Update task status
        self.update_state(
            state="FAILURE",
            meta={
                "request_id": request_id,
                "error": str(e),
                "status": "failed"
            }
        )
