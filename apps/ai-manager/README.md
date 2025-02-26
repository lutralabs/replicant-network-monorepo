# AI Inference API

A secure API service for AI model inference that adapts to available hardware acceleration (CUDA or MPS).

## Features

* REST API with FastAPI
* Hardware acceleration detection (CUDA, MPS/Metal, CPU fallback)
* API key authentication
* JWT token support
* Request validation
* Health check endpoint
* API versioning (v1)
* CORS support

## Project Structure

```
apps/ai-manager/
├── app.py              # Entry point for the application
├── test.py             # Entry point for running tests
├── pyproject.toml      # Project dependencies
├── Dockerfile          # Container definition
├── README.md           # This file
├── pytest.ini          # Pytest configuration
├── src/                # Source code directory
│   ├── __init__.py     # Package initialization
│   ├── main.py         # Main application setup
│   ├── core/           # Core functionality
│   │   ├── __init__.py
│   │   ├── auth.py     # Authentication logic
│   │   └── device.py   # Device detection logic
│   ├── models/         # Data models
│   │   ├── __init__.py
│   │   └── inference.py # Inference request/response models
│   ├── routes/         # API routes
│   │   ├── __init__.py
│   │   └── v1/         # Version 1 API routes
│   │       ├── __init__.py
│   │       ├── health.py    # Health-related endpoints
│   │       └── inference.py # Inference endpoints
│   └── test_api.py     # API testing utilities
└── tests/              # Test directory
    ├── __init__.py     # Package initialization
    ├── conftest.py     # Test fixtures and configuration
    ├── unit/           # Unit tests
    │   ├── __init__.py
    │   ├── test_auth.py
    │   └── test_device.py
    └── integration/    # Integration tests
        ├── __init__.py
        └── test_api_endpoints.py
```

## Requirements

* Python 3.13+
* PyTorch 2.6.0+
* FastAPI 0.110.0+
* Additional dependencies in pyproject.toml

## Setup

1. Clone the repository
2. Install dependencies:

```
uv sync
```

4. Set environment variables (optional):

```
export SECRET_KEY="your-secure-secret-key"
export API_KEYS="key1,key2,key3"
export CORS_ORIGINS="http://localhost:3000,https://yourdomain.com"
```

## Running the API

```bash
uv run app.py
```

## Testing

Run the tests with:

```bash
uv run test.py
```

## API Endpoints

All API endpoints accept and return JSON data. Requests should include the `Content-Type: application/json` header.

### Root Endpoints

#### GET /

Returns basic information about the API and links to the latest version.

**Response Format**: JSON

#### GET /v1

Returns basic information about the v1 API.

**Response Format**: JSON

### Health Endpoints

#### GET /health or GET /v1/health

Health check endpoint that returns the current status of the API.

**Response Format**: JSON

### Model Endpoints

#### GET /v1/models

Lists all available models.

**Authentication**: Bearer token (API key or JWT)

**Response Format**: JSON

**Response Example**:

```json
{
  "models": [
    {
      "id": "model-hash-1",
      "name": "model1.ckpt",
      "size": 1234567,
      "path": "ai-models/model1.ckpt",
      "extension": ".ckpt"
    },
    {
      "id": "model-hash-2",
      "name": "model2.ckpt",
      "size": 7654321,
      "path": "ai-models/model2.ckpt",
      "extension": ".ckpt"
    }
  ],
  "count": 2
}
```

#### GET /v1/models/{model_id}

Gets information about a specific model.

**Authentication**: Bearer token (API key or JWT)

**Response Format**: JSON

**Response Example**:

```json
{
  "id": "model-hash-1",
  "name": "model1.ckpt",
  "size": 1234567,
  "path": "ai-models/model1.ckpt",
  "extension": ".ckpt"
}
```

### Inference Endpoints

#### POST /infer or POST /v1/infer

Performs inference using the Stable Diffusion model to generate images.

**Authentication**: Bearer token (API key or JWT)

**Request Format**: JSON with Content-Type: application/json

**Request Example**:

```json
{
  "id": "unique-request-id",
  "model_id": "model-hash-1",
  "prompt": "A beautiful landscape with mountains and a lake",
  "negative_prompt": "blurry, low quality",
  "num_inference_steps": 30,
  "guidance_scale": 7.5,
  "width": 512,
  "height": 512,
  "seed": 42,
  "num_images": 1
}
```

**Request Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier for the request |
| model_id | string | Yes | - | Model ID (hash) to use for inference |
| prompt | string | Yes | - | Text prompt for image generation (max 1000 chars) |
| negative_prompt | string | No | null | Negative prompt to guide what not to generate |
| num_inference_steps | integer | No | 30 | Number of inference steps (1-150) |
| guidance_scale | float | No | 7.5 | Guidance scale for classifier-free guidance (1.0-20.0) |
| width | integer | No | 512 | Width of the generated image (256-1024) |
| height | integer | No | 512 | Height of the generated image (256-1024) |
| seed | integer | No | random | Random seed for reproducibility |
| num_images | integer | No | 1 | Number of images to generate (1-4) |

**Response Format**: JSON

**Response Example**:

```json
{
  "id": "unique-request-id",
  "model_id": "model-hash-1",
  "images": [
    {
      "base64": "iVBORw0KGgoAAAANSUhEUgAA...",
      "seed": 42,
      "width": 512,
      "height": 512
    }
  ],
  "processing_time": 5.67,
  "prompt": "A beautiful landscape with mountains and a lake",
  "negative_prompt": "blurry, low quality",
  "num_inference_steps": 30,
  "guidance_scale": 7.5
}
```

**Response Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Unique identifier for the request |
| model_id | string | Model ID (hash) used for inference |
| images | array | Array of generated images |
| images[].base64 | string | Base64-encoded PNG image data |
| images[].seed | integer | Seed used for this image |
| images[].width | integer | Width of the image |
| images[].height | integer | Height of the image |
| processing_time | float | Time taken to process the request in seconds |
| prompt | string | Text prompt used for generation |
| negative_prompt | string | Negative prompt used for generation |
| num_inference_steps | integer | Number of inference steps used |
| guidance_scale | float | Guidance scale used |

## Authentication

The API supports two authentication methods:

1. **API Keys**: Simple API keys passed in the Authorization header

```
Authorization: Bearer your-api-key
```

2. **JWT Tokens**: For more advanced authentication scenarios

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Environment Variables

* `SECRET_KEY`: Secret key for JWT token generation/validation
* `API_KEYS`: Comma-separated list of valid API keys
* `PORT`: Port to run the server on (default: 8000)
* `CORS_ORIGINS`: Comma-separated list of allowed origins for CORS (default: "*")
* `MODEL_DIRS`: Comma-separated list of directories to scan for models (default: "ai-models/")
* `MODEL_SCAN_INTERVAL`: Interval in seconds to scan for new models (default: 10)
* `DEFAULT_INFERENCE_STEPS`: Default number of inference steps for Stable Diffusion (default: 30)
* `DEFAULT_GUIDANCE_SCALE`: Default guidance scale for Stable Diffusion (default: 7.5)

## Deployment

This service is designed to be deployed on servers with CUDA support, but will automatically adapt to run on macOS with M1/M2 chips using Metal Performance Shaders (MPS) or fall back to CPU if neither is available.

## Security Considerations

* In production, always use a strong, unique `SECRET_KEY`
* Rotate API keys regularly
* Consider using a reverse proxy (like Nginx) with HTTPS
* Implement rate limiting for production use

## Model Management

The API automatically scans the `ai-models/` directory for model files ( `.ckpt` , `.pt` , `.pth` , `.bin` , `.safetensors` ) and makes them available for inference. The scanning happens at startup and periodically while the API is running.

Each model is identified by its SHA-256 hash, which is used as the `model_id` in API requests.

### Adding New Models

To add a new model:

1. Place the model file in the `ai-models/` directory
2. The API will automatically detect the new model within 10 seconds
3. Use the `/v1/models` endpoint to get the model's hash (ID)
4. Use the model ID in inference requests

### Environment Variables

* `SECRET_KEY`: Secret key for JWT token generation/validation
* `API_KEYS`: Comma-separated list of valid API keys
* `PORT`: Port to run the server on (default: 8000)
* `CORS_ORIGINS`: Comma-separated list of allowed origins for CORS (default: "*")
* `MODEL_DIRS` : Comma-separated list of directories to scan for models (default: "ai-models/")
