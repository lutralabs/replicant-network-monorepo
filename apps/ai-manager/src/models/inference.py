from pydantic import BaseModel, Field, field_validator
from typing import Any, List, Optional


class InferenceRequest(BaseModel):
    """
    Request model for the inference endpoint.
    """
    id: str = Field(..., description="Unique identifier for the request")
    model_id: str = Field(...,
                          description="Model ID (hash) to use for inference")
    prompt: str = Field(...,
                        description="Text prompt for inference", max_length=200)

    @field_validator('prompt')
    @classmethod
    def prompt_length(cls, v):
        if len(v) > 200:
            raise ValueError('Prompt must not be longer than 200 characters')
        return v


class InferenceResponse(BaseModel):
    """
    Response model for the inference endpoint.
    """
    id: str
    model_id: str
    result: Any
    processing_time: float


class ModelInfo(BaseModel):
    """
    Model information.
    """
    id: str = Field(..., description="Model ID (hash)")
    name: str = Field(..., description="Model name")
    size: int = Field(..., description="Model size in bytes")
    path: str = Field(..., description="Model file path")
    extension: str = Field(..., description="Model file extension")


class ModelsListResponse(BaseModel):
    """
    Response model for the models list endpoint.
    """
    models: List[ModelInfo] = Field(default_factory=list)
    count: int
