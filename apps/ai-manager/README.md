# AI Manager

AI Manager is a service for managing and running AI inference tasks using FastAPI and Celery.

## Features

* FastAPI-based REST API for AI model inference
* Celery workers for asynchronous processing of AI tasks
* Support for GPU acceleration with NVIDIA CUDA
* Automatic model discovery and loading
* Redis for task queue and result storage
* Docker Compose setup for easy deployment

## Requirements

* Docker and Docker Compose
* NVIDIA GPU with CUDA support (optional, for GPU acceleration)
* NVIDIA Container Toolkit (for GPU support)

## Quick Start

1. Clone the repository
2. Navigate to the `ai-manager` directory
3. Create an `.env` file with your configuration (see below)
4. Start the services:

```bash
# For CPU-only mode (works on macOS and Linux)
docker-compose up -d

# For GPU-accelerated mode (Linux with NVIDIA GPU)
docker-compose --profile nvidia up -d
```

## Environment Variables

Create a `.env` file in the `ai-manager` directory with the following variables:

```
# API Configuration
PORT=8000
CORS_ORIGINS=*
API_KEYS=your-api-key-1,your-api-key-2

# Model Configuration
MODEL_SCAN_INTERVAL=10
DEFAULT_INFERENCE_STEPS=30
DEFAULT_GUIDANCE_SCALE=7.5

# Redis Configuration
REDIS_PORT=6379

# GPU Configuration (for NVIDIA mode)
GPU_COUNT=1

# Logging
LOG_LEVEL=INFO
PYTHONUNBUFFERED=1

# Restart Policy
RESTART_POLICY=unless-stopped

# Supabase Configuration (if using Supabase for storage)
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

## Architecture

The application consists of several components:

1. **FastAPI Server**: Handles HTTP requests and provides the REST API
2. **Celery Workers**: Process AI inference tasks asynchronously
3. **Redis**: Acts as the message broker and result backend for Celery
4. **Model Registry**: Manages AI models and their loading/unloading

## API Endpoints

The API documentation is available at `/docs` when the server is running.

## Models

Place your AI models in the `ai-models` directory. The application will automatically discover and load them.

## Development

To run the application in development mode:

```bash
# Install dependencies
uv pip install -e .

# Run the FastAPI server
uv run app.py

# Run a Celery worker
uv run celery_worker.py
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
