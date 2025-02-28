from pydantic import BaseModel, Field, field_validator
from typing import Any, List, Optional, Union
from base64 import b64encode
from io import BytesIO


class InferenceRequest(BaseModel):
    """
    Request model for the inference endpoint.
    """
    id: str = Field(..., description="Unique identifier for the request")
    model_id: str = Field(...,
                          description="Model ID (hash) to use for inference")
    prompt: str = Field(...,
                        description="Text prompt for inference", max_length=1000)
    negative_prompt: Optional[str] = Field(
        None, description="Negative prompt to guide what not to generate")
    num_inference_steps: Optional[int] = Field(
        None, description="Number of inference steps", ge=1, le=150)
    guidance_scale: Optional[float] = Field(
        None, description="Guidance scale for classifier-free guidance", ge=1.0, le=20.0)
    width: Optional[int] = Field(
        512, description="Width of the generated image", ge=256, le=1024)
    height: Optional[int] = Field(
        512, description="Height of the generated image", ge=256, le=1024)
    seed: Optional[int] = Field(
        None, description="Random seed for reproducibility")
    num_images: Optional[int] = Field(
        1, description="Number of images to generate", ge=1, le=4)

    @field_validator('prompt')
    @classmethod
    def prompt_length(cls, v):
        if len(v) > 1000:
            raise ValueError('Prompt must not be longer than 1000 characters')
        return v


class ImageResult(BaseModel):
    """
    Model for an image result.
    """
    seed: int = Field(..., description="Seed used for generation")
    width: int = Field(..., description="Width of the image")
    height: int = Field(..., description="Height of the image")
    url: str = Field(..., description="URL where the image is stored")


class InferenceResponse(BaseModel):
    """
    Response model for the inference endpoint.
    """
    id: str
    model_id: str
    images: List[ImageResult]
    processing_time: float
    prompt: str
    negative_prompt: Optional[str] = None
    num_inference_steps: int
    guidance_scale: float
    # New fields for async processing
    task_ids: Optional[List[str]] = None
    status: Optional[str] = "completed"


class TaskStatusResponse(BaseModel):
    """
    Response model for the task status endpoint.
    """
    request_id: str
    status: str
    task_ids: Optional[List[str]] = None
    message: Optional[str] = None
    images: Optional[List[ImageResult]] = None
    error: Optional[str] = None


def encode_image_to_base64(image) -> str:
    """
    Encode a PIL image to base64.

    Args:
        image: PIL Image

    Returns:
        Base64-encoded image string
    """
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    return b64encode(buffered.getvalue()).decode("utf-8")
