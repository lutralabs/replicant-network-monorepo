from fastapi import APIRouter
from .health import router as health_router
from .inference import router as inference_router
from .models import router as models_router

# Create a v1 router that includes all v1 endpoints
router = APIRouter(prefix="/v1")

# Include the individual routers
router.include_router(health_router)
router.include_router(inference_router)
router.include_router(models_router)
