import torch
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel, Field, field_validator

# Security configuration
SECRET_KEY = os.environ.get(
    "SECRET_KEY", "your-secret-key-for-development-only")
API_KEYS = os.environ.get("API_KEYS", "test-key-1,test-key-2").split(",")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Initialize FastAPI app
app = FastAPI(
    title="AI Inference API",
    description="API for AI model inference",
    version="0.1.0"
)

# Security scheme
security = HTTPBearer()

# Models


class InferenceRequest(BaseModel):
    id: str = Field(..., description="Unique identifier for the request")
    prompt: str = Field(...,
                        description="Text prompt for inference", max_length=200)

    @field_validator('prompt')
    @classmethod
    def prompt_length(cls, v):
        if len(v) > 200:
            raise ValueError('Prompt must not be longer than 200 characters')
        return v


class InferenceResponse(BaseModel):
    id: str
    result: Any
    processing_time: float

# Authentication functions


def verify_api_key(api_key: str) -> bool:
    return api_key in API_KEYS


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
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

# Device setup


def setup_device():
    device = torch.device("cpu")  # Default fallback

    if torch.cuda.is_available():
        device = torch.device("cuda")
        print("CUDA is available! Using device:",
              torch.cuda.get_device_name(0))
    elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
        device = torch.device("mps")
        print("MPS is available! Using Apple Silicon acceleration")
    else:
        print("No GPU acceleration available. Using CPU.")

    return device


# Initialize device at startup
device = setup_device()

# Routes


@app.get("/")
async def root():
    return {"message": "AI Inference API is running", "device": str(device)}


@app.post("/infer", response_model=InferenceResponse)
async def infer(request: InferenceRequest, user: Dict = Depends(get_current_user)):
    start_time = datetime.now()

    # This is where you would run your actual model inference
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
        result=result,
        processing_time=processing_time
    )


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "device": str(device),
        "timestamp": datetime.now().isoformat()
    }
