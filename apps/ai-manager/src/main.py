import os
from fastapi import FastAPI, APIRouter, Response, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Import versioned routes
from src.routes.v1 import router as v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI application.
    Handles startup and shutdown events.
    """
    # No need to initialize model registry or start watcher thread
    # The API will fetch model information from the worker

    yield

    # No need to stop the model registry watcher thread


# Initialize FastAPI app
app = FastAPI(
    title="AI Inference API",
    description="API for AI model inference",
    version="0.1.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a root router for redirecting to the latest version
root_router = APIRouter()


@root_router.get("/", status_code=status.HTTP_200_OK)
async def root_redirect(response: Response):
    """
    Root endpoint that redirects to the latest API version.

    Response will be in JSON format.
    """
    # Set response content type to JSON
    response.headers["Content-Type"] = "application/json"

    return {
        "message": "AI Inference API",
        "documentation": "/docs",
        "latest_version": "/v1"
    }

# Include the versioned routers
app.include_router(root_router)
app.include_router(v1_router)

# For backwards compatibility, include v1 routes at the root level too
# This can be removed in the future when all clients have migrated to the versioned API
app.include_router(v1_router, prefix="")
