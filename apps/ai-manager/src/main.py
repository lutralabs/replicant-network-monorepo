from src.routes.v1 import router as v1_router
import os
import logging
import threading
from fastapi import FastAPI, APIRouter, Response, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Import core modules
from src.core.model_registry import model_registry

# Set up logging
log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=getattr(logging, log_level))
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI application.
    Handles startup and shutdown events.
    """
    # Initialize model registry and start watcher thread
    logger.info("Initializing model registry")
    model_registry.scan_models()
    model_registry.start_watcher()

    yield

    # Stop the model registry watcher thread on shutdown
    logger.info("Stopping model registry watcher")
    model_registry.stop_watcher()


# Initialize FastAPI app with proper concurrency settings
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

# Import versioned routes after app is defined to avoid circular imports

# Include the versioned routers
app.include_router(root_router)
app.include_router(v1_router)

# For backwards compatibility, include v1 routes at the root level too
# This can be removed in the future when all clients have migrated to the versioned API
app.include_router(v1_router, prefix="")
